# Frontend Developer — Handoff

Written 2026-04-15 by Kevin after a backend hardening pass (commit `212812d`).

The backend is now audited, tightened, and documented. Everything below is **frontend-focused** (UI, UX, performance, tests) or **nice-to-have backend cleanup** that doesn't block anything. Prioritized.

**Read first:**
- `CLAUDE.md` — full project brief, rules, tech stack
- `AUDIT.md` — what was reviewed, what was fixed, what was deferred
- `SAM-TODO.md` — what Sam still needs to provide (don't block on this; work around)

---

## P1 — Should land before the next public share

### 1. Critical-path test coverage (zero tests today)

No test setup exists. The highest-value tests:

- **`lib/actions.ts`** — form server actions. Mock Payload + Resend. Assert:
  - Honeypot short-circuits without hitting the DB
  - Invalid email / enum / empty required fields return specific errors
  - `submitVenueInquiry` rejects empty `contactWhatsApp`
  - Valid submission creates an inquiry and attempts email sends
- **`lib/notifications.ts`** — `resolveTemplateVariables` vs `resolveTemplateVariablesHtml` (the HTML variant must escape `<>&"'` in values but leave the template alone)
- **`middleware.ts`** — admin secret gating, rate limit boundary, 429 on 6th POST
- **`lib/lead-scoring.ts`** — pure function, easy wins for snapshot-style tests

Suggested stack: Vitest + `@testing-library/react` for any component tests later. Add `npm test` to CI.

### 2. Clean up 6 unused `eslint-disable` warnings

The build passes but these warnings exist:

```
./app/(site)/blaze/page.tsx:18           @typescript-eslint/no-explicit-any
./app/(site)/kolasi/page.tsx:20          @typescript-eslint/no-explicit-any
./app/(site)/page.tsx:24                 @typescript-eslint/no-explicit-any
./app/(site)/venues/case-studies/[slug]/page.tsx:41  @typescript-eslint/no-explicit-any
./app/(site)/venues/page.tsx:42          @typescript-eslint/no-explicit-any
./components/providers/AudioPlayerProvider.tsx:156   jsx-a11y/media-has-caption
```

Remove them — they're disabling rules that don't actually fire.

### 3. SEO — replace the placeholder logo reference

`components/JsonLd.tsx` hard-codes `/assets/logo.png`, which doesn't exist. Until Sam delivers the final asset (see SAM-TODO #3), point this at an existing Cloudinary image so Google's structured data validator stops erroring. Check `scripts/cloudinary-mapping.json` for an existing wordmark.

### 4. Replace corrupt `IMAGE_PORTRAIT.webp` fallback

`components/` (the About page client) currently uses a default Cloudinary image as a fallback for the broken portrait. When Sam delivers a new photo (see SAM-TODO #2), the fallback ternary can be removed.

---

## P2 — Nice to have

### 5. Tighten types in `lib/fetchers.ts`

Lots of `any` in filter predicates. Payload auto-generates types at `./payload-types.ts` (run `npm run generate:types`). Use them:

```ts
// Before
const result: any = await payload.find(...);

// After
import type { Post } from '@/payload-types';
const result = await payload.find<'posts'>({ ... });
```

### 6. Make `export-csv` column order safe to change

`app/api/export-csv/route.ts` has two parallel arrays (`headers` + row mappers) that are easy to misalign. Refactor to a single `[header, valueFn]` pair list so adding a column can only be done correctly.

### 7. Wire a real error reporter

`lib/actions.ts`, `lib/notifications.ts`, and several hooks use `console.error` to surface failures. In production those vanish into Vercel logs. Add Sentry (or equivalent) so silent email failures surface as paged alerts instead of being buried.

### 8. Animations / `lib/gsap-utils.ts`

This file was skipped in the backend audit. Worth a frontend-eyes pass for:
- ScrollTrigger cleanup on unmount (memory leaks in SPA nav)
- Reduced-motion fallback (`prefers-reduced-motion`)
- Mobile tap-target issues on any GSAP-driven UI

### 9. Lighthouse / Core Web Vitals

No baseline has been captured. Run Lighthouse on:
- `/` (homepage) — likely LCP issue with the hero video
- `/blaze/[slug]` (longest dynamic route)
- `/venues` (the biggest page, 10.9 kB route bundle + 455 kB JS)

Report back with numbers and a prioritized fix list (image formats, font preloads, reel poster priority, etc.).

---

## P3 — Backlog (backend-adjacent, no rush)

These are deferred from the backend audit — if you happen to be touching the relevant file, knock them out. Otherwise they wait.

| Ref | File | Issue |
|---|---|---|
| P1-1 | `middleware.ts` | In-memory rate limiter — replace with Vercel KV when traffic justifies it. See comment in file. |
| P1-2 | `collections/Inquiries.ts`, `VenueInquiries.ts` | Re-entrant Payload calls inside `afterChange`. No concrete repro but worth refactoring to a queue pattern if you ever see ordering bugs. |
| P2-1 | `lib/fetchers.ts`, `scripts/backfill-lead-scores.ts` | `any` types everywhere — tighten with generated Payload types. |
| P2-2 | `collections/Users.ts:29` | TOCTOU race in bootstrap (two concurrent first-user requests both get admin). Low practical risk. |
| P2-3 | `collections/Users.ts:18` | Count query on every unauth create attempt. Cache or short-circuit. |
| P2-4 | `lib/cloudinary-adapter.ts:42` | Delete errors silently swallowed. Add `console.error`. |
| P2-5 | `lib/fetchers.ts` | `getAdjacentArtists` — same cursor-based refactor as the other two (partially done now, could be deduplicated). |
| P2-7 | `app/api/export-csv/route.ts` | See #6 above. |
| P2-11 | `lib/fetchers.ts:211` | `depth: 2` on list queries bloats payload. Use `depth: 1` for lists, `depth: 2` only for single-item details. |
| P2-12 | Multiple collections | Missing MongoDB indexes. Main ones added (SentNotifications). If you add more queried fields, add `index: true`. |

---

## How to ship a change here

The site is live at https://samuellgoldfinch.com. Every change is critical.

1. Branch off `main` (`git checkout -b feat/your-thing`)
2. Run `npm run dev`, verify the change works locally
3. Run `npm run build` — must pass clean
4. Commit (no AI/Co-Authored-By footers — plain Kevin/dev commits)
5. Open a PR — Kevin reviews before merge
6. Merge triggers a Vercel auto-deploy to production

**Do not skip step 3.** The TypeScript + lint pass in `next build` is the only safety net right now.

---

## Questions?

Ping Kevin on whatever channel you two use. He wrote the original architecture and the backend-hardening pass this doc is handing off from.
