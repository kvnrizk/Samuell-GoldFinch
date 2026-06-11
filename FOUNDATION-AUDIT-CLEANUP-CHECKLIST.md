# Foundation Audit And Cleanup Checklist

Status: Draft working document
Scope: Backend-first foundation cleanup, media simplification, SEO foundation, and operational hygiene
Design rule: Do not change frontend design, layout, colors, typography, motion language, or public visual direction unless explicitly requested
Last updated: 2026-06-11

## Purpose

This document turns the full codebase audit into a practical advancement checklist.

The goal is not to rebuild the website. The goal is to make the existing website simpler, safer, easier to run, and less overloaded for its actual use:

- Present Samuell Goldfinch clearly.
- Show selected work with images and videos without overloading the site.
- Capture contact, quote, and venue leads reliably.
- Keep Payload CMS useful, but not let it become an oversized CRM unless that is genuinely needed.
- Improve SEO after the backend and content foundation are stable.

## Non-Negotiables

- Do not redesign the frontend.
- Do not change public layout or visual identity during backend cleanup.
- Do not remove business-critical content without confirmation.
- Do not add new infrastructure unless the current need justifies it.
- Prefer deletion, disabling, or simplification over adding abstractions.
- Keep changes small and verifiable.
- Always preserve lead capture before cleaning optional systems.

## Current Verified State

Verification from the audit:

- `npm run test` passed: 5 test files, 15 tests.
- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` failed before app compilation because the old OneDrive `.next` state produced `EINVAL: invalid argument, readlink ... .next\build-manifest.json`.
- The repo has now been moved to `C:\Users\rab_n\Desktop\Samuell-GoldFinch`, outside OneDrive.

Build follow-up:

Phase 0 result on 2026-06-11:

- `npm run test` passed from `C:\Users\rab_n\Desktop\Samuell-GoldFinch`: 5 files, 15 tests.
- `npx tsc --noEmit --pretty false` passed from the Desktop copy.
- `npm run lint` passed from the Desktop copy.
- `npm run build` passed from the Desktop copy after removing `.next`.
- Build still logs MongoDB connection failures to `127.0.0.1:27017`, then uses CMS fallbacks. This is not a build blocker, but remains a Phase 2 env/reliability issue.
Build follow-up:

- [x] Delete or regenerate the Desktop `.next` folder after confirming the moved repo is the active repo.
- [x] Re-run `npm run build` from the Desktop copy.
- [x] Confirm the OneDrive copy is no longer used by the IDE or terminal.

## High-Level Verdict

The codebase is functional and has working tests, lint, and TypeScript. The core problem is not code quality alone. The problem is that the project currently carries more backend and frontend machinery than the website needs.

The backend is closer to a small CRM than a portfolio/business website:

- Payload CMS collections
- Lead scoring
- Automation sequences
- Sent notification logs
- Admin alerts
- Revenue dashboard
- CSV export
- Cron job
- Twilio WhatsApp integration
- Resend email integration
- SEO landing-page collection
- Press kit
- Journal
- Showreel
- Bilingual routing

Some of this is useful. Some of it is premature. The cleanup should separate what is essential from what is optional.

## Backend Priority Model

Essential backend systems:

- Payload CMS for content and admin editing
- Users and admin authentication
- Media uploads through Cloudinary
- Contact form saving leads
- Quote form saving leads
- Venue form saving leads
- Resend notification emails
- Basic SEO metadata and sitemap

Useful but optional systems:

- Journal
- Press kit
- Showreel CMS global
- Venue SEO pages
- Case studies
- Testimonials
- CSV export
- Admin dashboard widgets

Likely overbuilt for current need:

- Automation sequences
- Sent notification logs
- Cron stale-lead detection
- Twilio WhatsApp sending
- Revenue dashboard
- Pricing factors and budget estimator if pricing is not actively used
- Excess global visual/audio shell systems

## Critical Findings Checklist

### 1. Public Payload REST Write Surface

Finding:
Payload REST routes are exposed through `app/api/[...slug]/route.ts`, while lead collections allow anonymous creation.

Relevant files:

- `app/api/[...slug]/route.ts`
- `collections/Inquiries.ts`
- `collections/VenueInquiries.ts`
- `middleware.ts`
- `lib/actions.ts`

Risk:
Anonymous users and bots can bypass server actions and POST directly to Payload endpoints such as `/api/inquiries` and `/api/venue-inquiries`. That bypasses honeypot checks and some server-action validation. Payload field validation still exists, but the route can still create records and trigger hooks.

Impact:

- Spam leads can be inserted directly.
- Admin alerts and automation hooks can be triggered by direct API traffic.
- Rate limiting is weak because it is in-memory and per server instance.
- This makes backend behavior harder to reason about.

Decision needed:

- [ ] Decide if public Payload REST create endpoints should be disabled for lead collections.

Recommended direction:

- [ ] Keep server actions as the only public submission path.
- [ ] Change lead collection `create` access so anonymous REST cannot create records directly.
- [ ] Allow server-side creation through trusted local Payload calls only.
- [ ] Keep validation in `lib/actions.ts` as the public contract.
- [ ] Add tests proving direct public create is blocked where possible.

Acceptance criteria:

- [ ] Contact form still submits.
- [ ] Quote form still submits.
- [ ] Venue form still submits.
- [ ] Anonymous direct POST to Payload lead collections is blocked.
- [ ] Admin-created leads still work.

### 2. Public CMS Read Surface Is Too Broad

Finding:
Many content collections use `read: () => true`.

Relevant files:

- `collections/BlazeProjects.ts`
- `collections/KolasiEvents.ts`
- `collections/Artists.ts`
- `collections/Pages.ts`
- `collections/Posts.ts`
- `collections/Media.ts`
- `collections/VenueSEOPages.ts`
- `collections/CaseStudies.ts`
- `collections/Testimonials.ts`

Risk:
Payload REST can expose content even if the frontend does not display it. If draft, private, experimental, or incomplete content is stored in CMS, it may still be publicly readable.

Recommended direction:

- [ ] Keep public read only for collections that truly power public pages.
- [ ] Add a `published` or `_status` style gate where needed.
- [ ] Ensure fetchers only request published content.
- [ ] Decide whether `Pages` should be public at all.
- [ ] Decide whether `PricingFactors` should be public at all.

Acceptance criteria:

- [ ] Public pages still render fallback content if CMS fails.
- [ ] Draft or private CMS records are not available publicly.
- [ ] Payload admin editing still works.

### 3. Raw HTML Rendering Uses Unsafe Regex Sanitization

Finding:
Some pages use `dangerouslySetInnerHTML` with regex cleanup.

Relevant files:

- `app/(site)/venues/[slug]/page.tsx`
- `app/(site)/venues/case-studies/[slug]/CaseStudyDetail.tsx`
- `components/JsonLd.tsx`

Risk:
Regex cleanup does not reliably sanitize HTML. It can miss single-quoted handlers, unquoted handlers, malformed markup, SVG payloads, `javascript:` URLs, and other browser parsing edge cases.

Recommended direction:

- [ ] Prefer rich-text rendering instead of raw HTML where possible.
- [ ] If raw HTML must stay, use a proper sanitizer.
- [ ] Escape JSON-LD safely so `</script>` cannot break out of the script tag.

Acceptance criteria:

- [ ] CMS-authored rich content still displays.
- [ ] Script tags and event handlers cannot execute.
- [ ] JSON-LD remains valid.

### 4. Missing Environment Validation

Finding:
The app can boot with missing or invalid critical env vars.

Relevant files:

- `payload.config.ts`
- `lib/resend.ts`
- `lib/cloudinary-adapter.ts`
- `lib/cloudinary.ts`
- `.env.example`

Risk:
Missing env vars produce slow failures, confusing dev server behavior, or silent fallbacks. This already showed up as the server hanging or build/dev being fragile.

Recommended direction:

- [x] Add a small server-only env validation module.
- [x] Validate required backend env vars before Payload runtime initialization.
- [x] Fail fast with clear messages for `DATABASE_URI`, `PAYLOAD_SECRET`, Cloudinary, and Resend where those services are actually used.
- [x] Keep optional variables optional: analytics, admin gate, cron, Twilio.

Acceptance criteria:

- [x] Missing database URI gives an immediate readable error.
- [x] Missing Payload secret gives an immediate readable error.
- [x] Local development can still run with documented minimum env vars; public static fallbacks still build without a live CMS.
- [x] `.env.example` matches actual code usage.

## High Priority Cleanup Checklist

### Backend Phase 1 - Make Forms The Only Public Lead Entry Point

Goal:
Make lead capture reliable and predictable.

Tasks:

- [ ] Review `submitContactForm`, `submitQuoteForm`, and `submitVenueInquiry` in `lib/actions.ts`.
- [ ] Extract shared validation helpers only if it reduces duplication without adding abstraction bloat.
- [ ] Block anonymous direct REST create for `inquiries` and `venue-inquiries`.
- [ ] Confirm forms still save to Payload with server actions.
- [ ] Confirm email failures do not block lead saving.
- [ ] Add or update tests for direct Payload access behavior if practical.

Do not do:

- [ ] Do not add another form library.
- [ ] Do not add a new API framework.
- [ ] Do not redesign the forms.

### Backend Phase 2 - Decide What To Do With Automation

Goal:
Stop the backend from acting like a CRM unless the CRM behavior is actually needed.

Systems involved:

- `collections/AutomationSequences.ts`
- `collections/SentNotifications.ts`
- `collections/AdminAlerts.ts`
- `lib/automation.ts`
- `lib/notifications.ts`
- `app/api/cron/process-sequences/route.ts`
- `vercel.json`

Decision options:

- [ ] Keep automation fully active and harden it.
- [ ] Disable automation hooks but keep collections for later.
- [ ] Remove automation from the active app and keep only simple admin alerts.
- [ ] Remove automation, sent notifications, Twilio WhatsApp, and cron entirely.

Recommended short-term direction:

- [ ] Disable delayed automation and cron unless it is actively used.
- [ ] Keep simple admin alerts for new leads if useful.
- [ ] Keep direct Resend form notifications.
- [ ] Remove Twilio WhatsApp sending until there is a real operational need.

Acceptance criteria if disabling automation:

- [ ] New lead still saves.
- [ ] Admin still receives email notification.
- [ ] Client still receives auto-reply if desired.
- [ ] No cron is required for normal lead flow.
- [ ] No duplicate notifications are sent.

### Backend Phase 3 - Simplify Admin Dashboard

Goal:
Make Payload admin reliable and not overloaded.

Current dashboard components:

- `components/admin/AdminNotificationBell.tsx`
- `components/admin/DashboardKPIs.tsx`
- `components/admin/RevenueDashboard.tsx`
- `components/admin/RecentInquiries.tsx`
- `components/admin/InquiryKanban.tsx`
- `components/admin/InquiryCharts.tsx`

Decision options:

- [ ] Keep all dashboard widgets.
- [ ] Keep only recent inquiries and basic notification bell.
- [ ] Remove revenue dashboard until revenue tracking is real.
- [ ] Remove charts until there is enough real data.

Recommended short-term direction:

- [ ] Keep recent inquiries.
- [ ] Keep basic notification bell only if admin alerts remain.
- [ ] Disable revenue dashboard.
- [ ] Disable charts if they are not actively used.

Acceptance criteria:

- [ ] `/admin` loads quickly.
- [ ] Admin import map generation still works.
- [ ] No dashboard widget depends on unused collections.
- [ ] Lead management remains easy.

### Backend Phase 4 - Content Model Reduction

Goal:
Keep CMS collections that match the real website.

Essential collections to keep:

- [ ] Users
- [ ] Media
- [ ] Inquiries
- [ ] VenueInquiries
- [ ] BlazeProjects if portfolio is CMS-managed
- [ ] KolasiEvents if event archive is CMS-managed
- [ ] Artists if roster is CMS-managed
- [ ] Testimonials if used on public pages
- [ ] GlobalSettings

Collections to evaluate:

- [ ] Pages
- [ ] PricingFactors
- [ ] AdminAlerts
- [ ] AutomationSequences
- [ ] SentNotifications
- [ ] PressKit
- [ ] Showreel
- [ ] Posts
- [ ] VenueSEOPages
- [ ] VenuePackages
- [ ] CaseStudies
- [ ] VenueFAQ
- [ ] Milestones

Decision rule:

If Samuell will not update it monthly or it does not drive conversion, freeze it or remove it from the active backend.

Acceptance criteria:

- [ ] CMS feels smaller and understandable.
- [ ] No unused collection is required for the public site to boot.
- [ ] No public page breaks if optional collections are empty.

## Media And Performance Cleanup Checklist

### Media Phase 1 - Stop Eager Video Overload

Finding:
Mux videos are mounted eagerly for Mux sources. The lazy IntersectionObserver behavior only applies to non-Mux videos.

Relevant files:

- `components/ui/VideoPlayer.tsx`
- `app/(site)/HomeClient.tsx`
- `app/(site)/venues/VenuesClient.tsx`
- `app/(site)/showreel/ShowreelClient.tsx`
- `app/(site)/kolasi/KolasiClient.tsx`
- `app/(site)/blaze/BlazeClient.tsx`

Tasks:

- [ ] Make below-the-fold videos poster-first.
- [ ] Mount Mux players only when visible or when user interacts.
- [ ] Keep hero video behavior only where it is essential.
- [ ] Avoid mounting multiple autoplay players on the same page.
- [ ] Confirm visual design does not change.

Acceptance criteria:

- [ ] Home still looks the same at first glance.
- [ ] Pages load with fewer active video players.
- [ ] Mobile load is lighter.
- [ ] No layout or design changes are introduced.

### Media Phase 2 - Reduce Global Shell Weight

Finding:
The site shell globally loads cursor effects, halo effects, animated background, page transitions, WhatsApp float, audio provider, and audio player.

Relevant file:

- `components/layout/SiteShell.tsx`

Tasks:

- [ ] Identify which global effects are actually needed on every page.
- [ ] Lazy-load nonessential effects.
- [ ] Consider disabling custom cursor on pages where it adds no value.
- [ ] Keep visual output unchanged unless explicitly asked.

Acceptance criteria:

- [ ] Same visible design.
- [ ] Smaller initial client bundle.
- [ ] Less runtime JS on simple pages.

### Media Phase 3 - Image Rationalization

Tasks:

- [ ] Audit all Cloudinary hardcoded URLs.
- [ ] Decide which images should be CMS-managed and which should remain static fallback.
- [ ] Remove duplicate fallback arrays where possible.
- [ ] Ensure correct `sizes` attributes for large images.
- [ ] Keep `blurDataURL` only where useful.

Acceptance criteria:

- [ ] Images still display correctly.
- [ ] No missing image fallbacks.
- [ ] No frontend layout changes.

## SEO Foundation Checklist

SEO should come after backend simplification, not before.

Current SEO state:

- Global metadata exists.
- Sitemap exists.
- Robots exists.
- JSON-LD exists.
- Page metadata exists but is generic.
- French core metadata exists.

Tasks:

- [ ] Create a small SEO helper for consistent page metadata.
- [ ] Improve page titles and descriptions for `/`, `/blaze`, `/kolasi`, `/venues`, `/quote`, `/contact`.
- [ ] Improve French metadata for `/fr`, `/fr/venues`, `/fr/quote`, `/fr/contact`.
- [ ] Add safe JSON-LD serialization.
- [ ] Add page-specific `Service` schema for Blaze, Kolasi, and Venues.
- [ ] Add `FAQPage` schema for venue FAQ if FAQ remains.
- [ ] Keep sitemap aligned with active routes only.
- [ ] Remove or de-prioritize routes that are not part of the real content strategy.

Acceptance criteria:

- [ ] Metadata is unique per core route.
- [ ] Canonicals and hreflang are correct.
- [ ] Structured data validates.
- [ ] Sitemap includes only intentional public pages.

## Environment And Operations Checklist

### Local Setup

Tasks:

- [ ] Confirm IDE opens `C:\Users\rab_n\Desktop\Samuell-GoldFinch`.
- [ ] Confirm terminal runs from the Desktop copy.
- [ ] Remove or ignore the old OneDrive copy after confirming nothing is missing.
- [ ] Regenerate `.next` outside OneDrive.
- [ ] Re-run verification commands.

Commands:

```bash
npm run test
npx tsc --noEmit --pretty false
npm run lint
npm run build
```

### Required Env Vars

Minimum local backend env vars:

- [ ] `DATABASE_URI`
- [ ] `PAYLOAD_SECRET`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `RESEND_API_KEY` if testing email sends

Optional env vars:

- [ ] `ADMIN_ACCESS_SECRET`
- [ ] `CRON_SECRET`
- [ ] `SAM_WHATSAPP_NUMBER`
- [ ] `MUX_TOKEN_ID`
- [ ] `MUX_TOKEN_SECRET`
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_WHATSAPP_FROM`
- [ ] `NEXT_PUBLIC_GA4_ID`
- [ ] `NEXT_PUBLIC_META_PIXEL_ID`

Rule:

Optional integrations should not make local development fail. Required backend env vars should fail fast with a clear message.

## Testing Strategy Checklist

Existing tests cover:

- [ ] Middleware admin gate and rate limiting
- [ ] Server action validation and honeypot behavior
- [ ] CSV export column mapping
- [ ] Lead scoring helpers
- [ ] Notification variable escaping

Missing tests to add during cleanup:

- [ ] Direct anonymous Payload create is blocked for lead collections.
- [ ] Server actions can still create leads after Payload access is tightened.
- [ ] Raw CMS HTML cannot execute scripts after sanitizer change.
- [ ] JSON-LD escaping prevents `</script>` breakout.
- [ ] Automation disabled path does not send duplicate emails.
- [ ] Build smoke test after moving out of OneDrive.

## Proposed Advancement Board

### Phase 0 - Stabilize The Moved Repo

- [x] Confirm active path is Desktop repo.
- [x] Clean/regenerate `.next` in Desktop repo.
- [x] Run tests, TypeScript, lint, and build.
- [x] Update documentation with actual Phase 0 result.

Exit criteria:

- [x] `npm run build` passes outside OneDrive.
- [ ] Follow up in Phase 2: replace noisy MongoDB fallback logs with clear env validation / local setup behavior.

### Phase 1 - Secure Lead Entry

- [x] Lock down public Payload REST create for lead collections.
- [x] Keep server actions working.
- [x] Keep Resend notification flow working.
- [x] Add tests.

Exit criteria:

- [x] Forms work through existing server-action tests.
- [x] Direct anonymous Payload lead create is blocked by collection access tests.

Verification notes:

- `npm run test -- tests/lead-access.test.ts tests/actions.test.ts` passed on 2026-06-11.
- `npm run test` passed: 6 files, 21 tests.
- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed, with known local MongoDB fallback logs because no local MongoDB is running at `127.0.0.1:27017`.

### Phase 2 - Env And Backend Reliability

- [x] Add centralized server env helper.
- [x] Validate Payload runtime env before local API, REST, and admin initialization.
- [x] Preflight local MongoDB URIs so missing local MongoDB produces a short readable message instead of Mongoose stack spam.
- [x] Keep Payload config import-safe for type/import-map generation.
- [x] Make Resend and Cloudinary env checks lazy so optional local integrations do not break public pages.
- [x] Keep CMS fallbacks working with concise error messages.
- [x] Update `.env.example` local setup notes.
- [x] Add env helper tests.

Verification notes:

- `npm run test` passed: 7 files, 27 tests.
- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed. Build no longer emits repeated Payload/Mongoose stack traces when local MongoDB is not running; it emits concise CMS fallback messages instead.

### Phase 3 - Reduce Backend Complexity

- [x] Decide automation fate.
- [x] Disable delayed automation hooks for lead collections.
- [x] Disable Vercel cron scheduling for sequence processing.
- [x] Disable active Twilio path by removing automation/cron callers; `lib/whatsapp.ts` remains dormant for later.
- [x] Keep direct Resend form notifications.
- [x] Keep simple admin alerts for new leads, hot leads, status changes, and signed venue deals.
- [x] Simplify admin dashboard widgets by keeping notification bell, KPIs, and recent inquiries only.
- [x] Freeze automation collections instead of deleting them.

Exit criteria:

- [x] Backend active systems match actual business use more closely.
- [x] Admin dashboard import map regenerates with fewer widgets.
- [x] Forms still use existing server actions and direct Resend emails.

Verification notes:

- `npm run generate:payload` passed.
- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run test` passed: 7 files, 27 tests.
- `npm run build` passed.
- Build still logs MongoDB Atlas `bad auth` stack traces from the current `.env` credentials, then uses CMS fallbacks. Fix the Atlas username/password/database URI to remove those logs and make `/admin` persistence work reliably.

### Phase 4 - Harden Content Rendering And SEO Basics

- [x] Replace unsafe HTML rendering path for CMS string content.
- [x] Harden JSON-LD serialization against `</script>` breakout.
- [x] Improve core metadata consistency with a shared SEO helper.
- [x] Clean sitemap dynamic routes so missing CMS slugs do not generate malformed URLs.
- [x] Add focused safety tests.

Exit criteria:

- [x] No unsafe raw CMS HTML path remains.
- [x] Core SEO metadata is stronger and consistent across home, EN/FR contact, quote, venues, Blaze, and Kolasi.

Verification notes:

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run test` passed: 8 files, 30 tests.
- `npm run build` passed.
- Build still logs MongoDB Atlas `bad auth` stack traces from the current `.env` credentials, then uses CMS fallbacks. Fix the Atlas URI to remove those logs and make `/admin` persistence work reliably.

### Phase 5 - Media And Runtime Weight Reduction

- [ ] Make below-the-fold videos lazy/poster-first.
- [ ] Reduce global shell weight without visual changes.
- [ ] Rationalize image fallbacks.

Exit criteria:

- [ ] Same design.
- [ ] Less eager media and less global JS.

### Phase 6 - Frontend Polish Only When Explicitly Requested

Frontend planning docs:

- `FRONTEND-AUDIT-CHECKLIST.md`
- `FRONTEND-POLISH-CHECKLIST.md`

Current frontend status:

- [x] Full frontend audit documented.
- [x] Frontend polish phases documented.
- [ ] Frontend implementation not started.
- [ ] Spacing changes only when requested.
- [ ] Text changes only when requested.
- [ ] Positioning changes only when requested.
- [ ] No layout redesign.
- [ ] No design-system changes unless explicitly approved.

## Current Resume Point

Completed foundation phases:

- [x] Phase 0 - Stabilize The Moved Repo.
- [x] Phase 1 - Secure Lead Entry.
- [x] Phase 2 - Env And Backend Reliability.
- [x] Phase 3 - Reduce Backend Complexity.
- [x] Phase 4 - Harden Content Rendering And SEO Basics.

Next implementation phase:

- [ ] Phase 5 - Media And Runtime Weight Reduction.

The backend/security foundation phases are complete enough to move into media/runtime cleanup or the documented frontend polish pass. The unresolved blocker for real CMS/admin use is still the MongoDB Atlas `bad auth` credential issue in `.env`.

## Cleanup Decision Log

Use this section as decisions are made.

- [x] Automation: delayed automation disabled; collections frozen for later.
- [x] Twilio WhatsApp: dormant because automation/cron callers are disabled.
- [x] Revenue dashboard: removed from active admin dashboard widgets for now.
- [ ] CSV export: keep or remove?
- [ ] Journal: active content strategy or freeze?
- [ ] Press kit: active content strategy or freeze?
- [ ] Showreel CMS: active content strategy or static?
- [ ] Venue SEO pages: active SEO strategy or defer?
- [ ] Pricing factors: active pricing tool or remove?

## Definition Of Done For The Foundation Cleanup

- [x] Desktop repo builds successfully.
- [ ] Required env vars are validated clearly.
- [x] Public lead submission goes through server actions only.
- [ ] Forms still save leads and send intended emails.
- [x] Unused automation is disabled or removed.
- [x] Admin dashboard is simpler and reliable.
- [x] Raw HTML rendering is safe or removed.
- [ ] Public CMS read access is intentional.
- [ ] Videos are not eagerly overloaded below the fold.
- [x] SEO metadata is consistent for core routes.
- [ ] No frontend design or layout changes were made without explicit approval.
