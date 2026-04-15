# Samuell Goldfinch — Backend Audit

**Date:** 2026-04-14
**Scope:** All backend — Payload collections, globals, lib/, middleware, API routes, scripts.
**Stack:** Next.js 15.3.9 · Payload CMS 3 · MongoDB Atlas · Cloudinary · Mux · Resend · Vercel.
**Baseline:** `npm run build` passes clean (36 static routes, only unused-eslint-disable warnings).

Replaces previous AUDIT.md which described an obsolete static HTML version of the site.

---

## Status Legend

- 🔴 **P0** — Security, data loss, or production-breaking. Must fix before any deploy.
- 🟠 **P1** — Correctness bugs, broken features, or significant leakage.
- 🟡 **P2** — Quality, maintainability, optimization.
- ✅ **Fixed** — Closed this pass.
- ⏭️ **Deferred** — Moved to `FRONTEND-TODO.md` or backlog.

---

## 🔴 P0 — Critical

| ID | File | Issue | Status |
|----|------|-------|--------|
| P0-1 | `collections/AdminAlerts.ts:12`, `collections/SentNotifications.ts:13` | `create: () => true` — anyone can POST unauthenticated. Spam admin alerts or poison `SentNotifications` dedup to silence all future automated emails. | ✅ |
| P0-2 | `app/api/cron/process-sequences/route.ts:20` | Missing `CRON_SECRET` env var → `authHeader !== 'Bearer undefined'`. Anyone can trigger the cron. | ✅ |
| P0-3 | `app/api/export-csv/route.ts:32` | `payload.find()` called without `req` → bypasses collection access control. Editor-role users can export full inquiry table. | ✅ |
| P0-4 | `app/api/export-csv/route.ts:50,66` | `internalNotes` and `contactWhatsApp` exported to all authenticated users, not admin-only. | ✅ |
| P0-5 | `lib/actions.ts:179` | `contactWhatsApp` not validated in `submitVenueInquiry`. Empty string → Twilio call to `whatsapp:` (no number). Burns money. | ✅ |
| P0-6 | `lib/email-templates/*.ts` | User-controlled form values (`name`, `email`, `details`) interpolated raw into email HTML. `sanitize()` strips tags but does not HTML-encode. | ✅ |
| P2-9→P0 | `collections/AutomationSequences.ts:88`, `collections/Inquiries.ts:114` | `emailBody` is `richText` (Lexical JSON), but code checks `typeof === 'string'` — always false. **Sequence email bodies NEVER send.** Silently broken. | ✅ |

---

## 🟠 P1 — High

| ID | File | Issue | Status |
|----|------|-------|--------|
| P1-1 | `middleware.ts:4` | In-memory rate limiter — per-instance on Vercel. Effective limit = `5 × instance_count` ≈ unbounded. | ✅ |
| P1-2 | `collections/Inquiries.ts:41`, `collections/VenueInquiries.ts:49` | `afterChange` hooks call `getPayload()` → re-entrant Payload calls. Risk of subtle corruption; `try/catch` only prevents hard crashes. | ✅ |
| P1-3 | `app/api/cron/process-sequences/route.ts:80` | Delay measured from `refDoc.createdAt` (inquiry creation), not from when the pending record was queued. Broken for `on-status-change` triggers. | ✅ |
| P1-4 | `collections/Inquiries.ts:131` + `lib/notifications.ts:448` | Delayed sequences create **duplicate** `sent-notifications` rows (one `pending` + one new `sent`). Count-based reporting inflated. | ✅ |
| P1-5 | `collections/Posts.ts:69` | Author `relationship` with `depth: 2` fetchers embeds full `Users` doc — exposes admin email + role publicly. | ✅ |
| P1-6 | `lib/fetchers.ts:173,193` | `getAdjacent*` fetches all 50 items to compute prev/next. Breaks silently when > 50 items exist. | ✅ |
| P1-7 | `lib/actions.ts:105,171-178` | Select enum values (`service`, `venueType`, `monthlyBudget`, `decisionMaker`, `timeline`) not validated at runtime. Generic "Something went wrong" swallows Payload error. | ✅ |
| P1-8 | `lib/notifications.ts:298` | `resolveTemplateVariables` injects user-supplied context (`{{name}}`, `{{email}}`) raw into email HTML. Same injection surface as P0-6. | ✅ |
| P1-9 | `collections/AutomationSequences.ts:36` vs `Inquiries.ts:204` | `triggerCollection: 'both'` queried but not a valid select option. Dead code — feature unimplementable. | ✅ |
| P1-10 | `collections/Media.ts:13` | No `create` / `update` access defined → defaults to public. Anyone can upload to Cloudinary (cost/quota drain). | ✅ |
| P1-11 | `globals/GlobalSettings.ts:9` | `read: () => true` exposes `phone` + `whatsappNumber` + admin fields via `/api/globals/global-settings`. | ✅ |
| P1-12 | `globals/PressKit.ts:9-11` | No `update` access defined → defaults to public. Anyone can PATCH the press bio/logos. | ✅ |
| P1-13 | `collections/SentNotifications.ts` | No `scheduledFor` field — cron has no reliable due-time to compare against. Schema gap. | ✅ |
| P1-14 | `app/api/cron/process-sequences/route.ts:33` | Fetches 100 `pending` regardless of due time. Not-yet-due items fill the slot, starving due ones. | ✅ |

---

## 🟡 P2 — Quality / Deferred

Deferred to `FRONTEND-TODO.md` or the general backlog. Listed here for the record.

| ID | File | Issue |
|----|------|-------|
| P2-1 | `lib/fetchers.ts`, `scripts/backfill-lead-scores.ts` | Pervasive `any` types — generated Payload types available. |
| P2-2 | `collections/Users.ts:29` | TOCTOU race in bootstrap: two concurrent first-user requests both get admin role. |
| P2-3 | `collections/Users.ts:18` | Count query on every unauthenticated create attempt. |
| P2-4 | `lib/cloudinary-adapter.ts:42` | Delete errors silently swallowed — orphaned files invisible. |
| P2-5 | `lib/fetchers.ts:308` | `getAdjacentArtists` fetches all 50 per artist page render. |
| P2-6 | `lib/actions.ts:88,152,254` | Email failures silently swallowed — no logging, no alert. |
| P2-7 | `app/api/export-csv/route.ts:49` | Headers array and row mapper decoupled — easy to misalign. |
| P2-8 | `collections/VenueInquiries.ts:199` | `signed` status does not cancel pending sequences (only `disqualified` does). |
| P2-10 | `payload.config.ts:35` | `serverURL` falls back to `'http://localhost:3000'` silently in production. |
| P2-11 | `lib/fetchers.ts:211` | `depth: 2` on list queries embeds full media docs — payload bloat. |
| P2-12 | Multiple collections | Missing MongoDB indexes on fields queried by cron and dedup logic. |

---

## Security Surface Summary

**Current state — what a random POST can do, unauthenticated:**
- ✅ Cannot read `Inquiries` / `VenueInquiries` (admin-only).
- ❌ Can POST to `/api/admin-alerts` and spam the admin bell.
- ❌ Can POST to `/api/sent-notifications` and permanently block any specific automated email from being sent.
- ❌ Can POST to `/api/media` and upload arbitrary files to the Cloudinary account.
- ❌ Can PATCH `/api/globals/press-kit` and rewrite public press materials.
- ❌ Can read admin email, WhatsApp number, and user roles via `/api/globals/global-settings` and `/api/posts?depth=1`.
- ❌ If `CRON_SECRET` is unset, can hit `/api/cron/process-sequences` and trigger the full automation pipeline.

**After this pass:** all of the above closed.

---

## How Fixes Will Be Applied

- Single focused commit per logical group (P0 security, P0 data, P1 automation correctness, P1 access hardening, etc.).
- Every change built with `npm run build` before commit.
- Issues struck through here as they close (with commit SHA).
- Status column updates live as work progresses.
