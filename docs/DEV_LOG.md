# Dev Log

## 2026-06-30 - Phase 1: Repo Cleanup and Context Setup

### Files Changed

- `.gitignore`
- `.env.example`
- `package.json`
- `AGENTS.md`
- `docs/DEV_LOG.md`
- `docs/VALIDATION_CHECKLIST.md`

### Files Removed or Ignored

Removed generated or unsafe local artifacts:

- `.next`
- `node_modules`
- `dev-check.err.log`
- `dev-check.out.log`
- `tsconfig.tsbuildinfo`
- `sg-website.zip`
- `samuell-goldfinch.zip`

Updated ignore rules for:

- `.env`
- `.env.*`
- `.next`
- `node_modules`
- `dist`
- `coverage`
- `*.log`
- `tsconfig.tsbuildinfo`
- `*.zip`

### Validation Results

- `npm run typecheck`: failed because `node_modules` was removed and `tsc` is not available.
- `npm run lint`: attempted after the stop point; failed because `node_modules` was removed and `next` is not available.
- `npm test`: not run; stopped at the first failing validation category.
- `npm run build`: not run; stopped at the first failing validation category.

### Remaining Risks

- Real `.env` values exist locally and must be rotated manually before production use.
- Dependencies must be restored with `npm ci` before code validation can run.
- Existing pre-phase change in `app/globals.css` was not touched by this cleanup phase.

### Recommended Next Phase

Run `npm ci`, then follow `docs/VALIDATION_CHECKLIST.md` from the top. Fix only the first failing validation category before continuing.

## 2026-07-01 - Phase 2: Dependency/security audit triage

### Files Changed

- `docs/DEPENDENCY_AUDIT.md`
- `docs/DEV_LOG.md`

### Audit Results

- Full `npm audit --json`: 22 total vulnerabilities, with 15 high, 6 moderate, and 1 low.
- Production-only `npm audit --omit=dev --json`: 19 total vulnerabilities, with 13 high, 4 moderate, and 2 low.

### Safe Fixes Applied

- None. Meaningful production fixes require reviewed Next/Payload package updates, not lockfile-only changes.

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed, 5 files and 15 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas.

### Remaining Risks

- Direct production vulnerabilities remain in `next`, `payload`, and Payload package group dependencies.
- Build can still log CMS-safe MongoDB DNS/connectivity fallback errors when Atlas is unreachable.

### Recommended Next Phase

Plan a scoped dependency update branch for Next 15 and Payload 3 patch/minor updates, then validate admin, forms, and build.

## 2026-07-01 - Phase 2B: Scoped Next/Payload dependency update

### Files Changed

- `docs/DEPENDENCY_AUDIT.md`
- `docs/DEV_LOG.md`

### Versions Checked

- `next`: current `15.4.11`; latest Next 15 from npm `15.5.19`.
- Payload direct packages: current `3.84.1`; latest Payload 3 from npm `3.85.1`.

### Result

- No dependency update was applied.
- `@payloadcms/next@3.85.1` does not allow Next `15.5.x`; it allows `>=15.4.11 <15.5.0` or Next 16.
- `15.4.11` is the latest available Next `15.4.x`.
- Normal npm resolution could not safely refresh the Payload lockfile from `3.84.1` to `3.85.1` without force.
- `npm install --force` was not used because it was rejected as unsafe for this phase.

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed, 5 files and 15 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas.

### Remaining Risks

- Production audit count remains unchanged.
- Direct production vulnerabilities remain in `next`, `payload`, and Payload package group dependencies.

### Recommended Next Phase

Decide explicitly whether to wait for a Payload 3 release that supports Next 15.5.x, approve a larger Next 16 migration, or approve a separate manual lockfile refresh experiment.

## 2026-07-01 - Phase 3: Payload Public Write Hardening

### Public Write Surface Reviewed

- `app/api/[...slug]/route.ts` exposes Payload REST handlers, so collection-level create access is the direct public write boundary.
- `inquiries` allowed unauthenticated create.
- `venue-inquiries` allowed unauthenticated create.
- Server actions in `lib/actions.ts` already validated and sanitized form values, but still sent internal `status` values.

### Files Changed

- `collections/Inquiries.ts`
- `collections/VenueInquiries.ts`
- `lib/actions.ts`
- `lib/public-write-sanitizer.ts`
- `tests/actions.test.ts`
- `tests/public-write-sanitizer.test.ts`
- `docs/DEV_LOG.md`

### Hardening Applied

- Added explicit public create allowlists for `inquiries` and `venue-inquiries`.
- Added collection `beforeValidate` sanitizers for unauthenticated creates.
- Public `inquiries` creates can only submit approved contact/quote fields; `status` is derived as `new`.
- Public `venue-inquiries` creates can only submit approved venue form fields; `source` is derived as `venue-form`, and `status` is derived from budget.
- Removed internal `status` writes from public server actions.
- Authenticated admin create/update behavior remains unchanged.

### Tests Added or Updated

- Added sanitizer tests proving public creates cannot inject internal inquiry or venue inquiry fields.
- Added server-action tests proving contact, quote, and venue form submissions only pass public fields to Payload.

### Validation Results

- `npm ci`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed, 6 files and 22 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas.

### Remaining Risks

- Payload REST endpoints are still public for the two form collections by design; protection now depends on the allowlist sanitizer and collection validation.
- Local MongoDB Atlas credentials still need to be corrected or rotated before production validation.
- Existing dependency audit vulnerabilities from Phase 2 remain unresolved.

### Recommended Next Phase

Continue backend cleanup with a narrow authenticated-admin access review, then separately address the local Atlas credential issue before production deployment.

## 2026-07-01 - Phase 4: Admin Access and Bootstrap Hardening

### Admin/Auth Surface Reviewed

- `middleware.ts`
- `collections/Users.ts`
- `payload.config.ts`
- `app/api/[...slug]/route.ts`
- `app/api/export-csv/route.ts`
- `app/api/cron/process-sequences/route.ts`
- Existing middleware, CSV, and access tests

### Unsafe Patterns Found

- `/admin?secret=...` middleware access created an `sg-admin-access` cookie from a URL query parameter.
- First unauthenticated user creation was allowed whenever the users collection was empty, including production.
- Stale docs still instructed production users to sign in with `/admin?secret=...`.

### Hardening Applied

- Removed the query-string admin secret and bypass cookie behavior from middleware.
- `/admin` now relies on Payload authentication instead of middleware URL secrets.
- Production unauthenticated first-admin bootstrap is blocked.
- Local empty-database first-admin bootstrap remains available for development.
- CSV export remains authenticated admin-only through Payload auth and role checks.
- Cron route remains server-secret-only and fails closed when `CRON_SECRET` is missing or invalid.
- Updated docs to remove secret-login instructions.

### Tests Added or Updated

- Updated middleware tests to prove admin URL secrets are ignored and no bypass cookie is set.
- Added user access tests for local bootstrap, production bootstrap blocking, and admin creation.
- Added admin route tests for CSV auth failures and cron secret failures.

### Validation Results

- `npm ci`: passed.
- `npm run typecheck`: failed once on new test typing, then passed after narrowing the test casts and env stubbing.
- `npm run lint`: passed.
- `npm test`: passed, 8 files and 32 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas.

### Remaining Risks

- Production admin account creation now requires a controlled setup path before launch.
- Additional platform-layer controls, such as Vercel Firewall IP allowlisting, are still optional hardening.

## 2026-07-01 - Phase 5: Environment and Production Configuration Validation

### Environment Surface Reviewed

- `.env.example`
- `package.json`
- `payload.config.ts`
- `next.config.mjs`
- `vercel.json`
- `app/api/cron/process-sequences/route.ts`
- `lib/resend.ts`
- `lib/cloudinary-adapter.ts`
- `lib/whatsapp.ts`
- public analytics and metadata environment usage
- MongoDB/Payload database configuration

### Files Changed

- `.env.example`
- `app/api/cron/process-sequences/route.ts`
- `docs/DEV_LOG.md`
- `docs/PRODUCTION_ENV.md`
- `lib/cloudinary-adapter.ts`
- `lib/env.ts`
- `lib/resend.ts`
- `lib/whatsapp.ts`
- `payload.config.ts`
- `tests/env.test.ts`

### Hardening Applied

- Added a no-dependency environment helper.
- Production now validates core boot variables: `DATABASE_URI`, `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
- Local development remains flexible for missing optional services.
- Feature-specific services read environment values through the helper without making optional services globally required.
- `.env.example` now lists the feature variables referenced by runtime code.
- Added a production environment runbook with MongoDB Atlas, Vercel, rotation, and admin provisioning notes.

### Validation Results

- `npm ci`: passed on rerun with a longer timeout. The first attempt timed out; the successful run emitted a Windows cleanup warning on `node_modules`.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed, 9 files and 37 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas.

### Remaining Risks

- Local `.env` still needs MongoDB Atlas credentials corrected or rotated before production validation.
- Feature integrations still require real provider dashboard validation after env values are set.

## 2026-07-01 - Phase 6: Public Form Abuse Protection

### Form Entry Points Reviewed

- `submitContactForm` in `lib/actions.ts`
- `submitQuoteForm` in `lib/actions.ts`
- `submitVenueInquiry` in `lib/actions.ts`
- contact, quote, and venue client form callers
- existing middleware in-memory rate limiter
- Phase 3 Payload public write sanitizers

### Protections Added

- Added a no-dependency in-memory server-action abuse guard.
- Blocks oversized form payloads before persistence.
- Blocks duplicate submissions with the same email or phone and message within a short window.
- Rate-limits repeated valid submissions by IP when available, otherwise by email or phone.
- Keeps existing honeypot short-circuiting.
- Keeps generic user-facing error messages.

### Limitations

- The guard is in-memory per server instance, like the existing middleware limiter.
- It is a practical abuse reduction layer, not a globally consistent anti-spam system.
- A future production upgrade could move counters to Vercel KV/Upstash or add Turnstile if spam volume justifies it.

### Files Changed

- `docs/DEV_LOG.md`
- `lib/actions.ts`
- `lib/form-abuse.ts`
- `tests/actions.test.ts`
- `tests/form-abuse.test.ts`

### Validation Results

- `npm ci`: passed. The run emitted a Windows cleanup warning on `node_modules`.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed, 10 files and 46 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas.

## 2026-07-01 - Phase 7: Frontend Simplification Baseline

### Frontend Areas Reviewed

- `app/(site)/HomeClient.tsx`
- `app/(site)/quote/QuoteClient.tsx`
- `app/(site)/venues/VenuesClient.tsx`
- `app/(site)/kolasi/KolasiClient.tsx`
- `app/(site)/about/AboutClient.tsx`
- `components/layout/Header.tsx`
- large client components and `use client` boundaries under `app/` and `components/`

### Complexity Found

- Several route-level client components are large and mix orchestration, static content, animation helpers, and presentational UI.
- `HomeClient` contained homepage media constants, collaborator data, counter animation logic, and selected-work carousel logic in the same file.
- `QuoteClient`, `VenuesClient`, `KolasiClient`, and `Header` remain larger-risk files and were intentionally left untouched in this baseline.

### Chosen Simplification Scope

- Homepage-only extraction.
- Moved static homepage media and collaborator data into a local data module.
- Moved venue counter animation into a small local component.
- Moved the selected-work carousel into a small local component.

### Files Changed

- `app/(site)/HomeClient.tsx`
- `app/(site)/home-content.ts`
- `app/(site)/_components/CounterStat.tsx`
- `app/(site)/_components/WorkOrbitCarousel.tsx`
- `docs/DEV_LOG.md`

### Intentionally Not Changed

- No public routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, public copy, colors, layout, or visual design direction changed.
- No 3D was added.
- No dependencies were added.
- No broader frontend files were refactored.

### Validation Results

- `npm ci`: passed. The run emitted a Windows cleanup warning on `node_modules`.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed after rerun with escalated filesystem access because the sandboxed run hit the known Windows `EPERM` realpath issue. Result: 10 files and 46 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas. Build also logged a stale Browserslist data notice.

### Remaining Frontend Risks

- `QuoteClient`, `VenuesClient`, `KolasiClient`, `AboutClient`, and `Header` are still large and should be simplified in separate narrow passes.
- Homepage visual parity was preserved by code movement, but browser screenshot comparison was not performed in this phase.
- Existing local MongoDB auth warnings still reduce signal quality during builds.

### Recommended Next Phase

Continue with another narrow frontend simplification pass, preferably `QuoteClient` form-step component extraction or `Header` state/render split, without changing visual design or behavior.

## 2026-07-01 - Phase 8: Header Structure Simplification

### Header Areas Reviewed

- `components/layout/Header.tsx`
- desktop navigation
- mobile navigation
- scroll behavior
- active route styling
- theme toggle behavior
- language switch behavior
- More dropdown behavior

### Chosen Simplification Scope

- Split header rendering structure into an internal `header-structure.tsx` module.
- Keep `Header.tsx` focused on state, effects, route awareness, and orchestration.
- Preserve existing navigation labels, destination URLs, classes, styles, and behavior.

### Files Changed

- `components/layout/Header.tsx`
- `components/layout/header-structure.tsx`
- `docs/DEV_LOG.md`

### Intentionally Not Changed

- No visual redesign.
- No 3D.
- No public routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, public copy, navigation labels, or destination URLs changed.
- No dependencies were added or upgraded.

### Validation Results

- `npm ci`: passed after the dev server was manually stopped.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed after rerun with escalated filesystem access because the sandboxed run hit the known Windows `EPERM` realpath issue. Result: 10 files and 46 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas. Build also logged a stale Browserslist data notice.

### Remaining Frontend Risks

- Browser visual comparison was not performed in this phase.
- Header behavior should still be manually smoke-tested on desktop and mobile after the next dev server start.
- `QuoteClient`, `VenuesClient`, `KolasiClient`, and `AboutClient` remain large frontend cleanup targets.
- Existing local MongoDB auth warnings still reduce build-log signal quality.

### Recommended Next Phase

Continue with another narrow frontend simplification pass, preferably `QuoteClient` form-step extraction, without changing visual design or behavior.

## 2026-07-01 - Phase 9: QuoteClient Structure Cleanup

### QuoteClient Areas Reviewed

- `app/(site)/quote/page.tsx`
- `app/(site)/quote/QuoteClient.tsx`
- quote form state and step rendering
- `submitQuoteForm` usage and related action tests
- quote constants/options and field helpers

### Chosen Simplification Scope

- Extracted quote form state types, initial form state, service option arrays, step labels, and `tx` helper into `quote-content.ts`.
- Extracted `InputField`, `SelectField`, `TextareaField`, and `ProgressBar` into `quote-fields.tsx`.
- Left step render functions, form state updates, validation checks, submit payload, animations, and server action contract inside `QuoteClient`.

### Files Changed

- `app/(site)/quote/QuoteClient.tsx`
- `app/(site)/quote/quote-content.ts`
- `app/(site)/quote/quote-fields.tsx`
- `docs/DEV_LOG.md`

### Intentionally Not Changed

- No public routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, public copy, form fields, validation behavior, submit payload shape, visual design, or responsive behavior changed.
- No 3D.
- No dependencies were added or upgraded.

### Validation Results

- `npm ci`: passed. The run emitted a Windows cleanup warning on `node_modules`.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed after rerun with escalated filesystem access because the sandboxed run hit the known Windows `EPERM` realpath issue. Result: 10 files and 46 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas. Build also logged a stale Browserslist data notice.

### Remaining Frontend Risks

- Browser visual comparison was not performed in this phase.
- Quote form should still be manually smoke-tested after the next dev server start.
- `VenuesClient`, `KolasiClient`, and `AboutClient` remain large cleanup targets.
- Existing local MongoDB auth warnings still reduce build-log signal quality.

### Recommended Next Phase

Continue with another narrow frontend simplification pass, preferably `VenuesClient` or `KolasiClient`, without changing visual design or behavior.

## 2026-07-01 - Phase 10: Blaze/Kolasi Brand Architecture Audit

### Areas Reviewed

- homepage Blaze and Kolasi sections
- `app/(site)/blaze/BlazeClient.tsx`
- `app/(site)/kolasi/KolasiClient.tsx`
- Blaze and Kolasi detail routes
- venue page connection to Kolasi programming
- About page brand relationship
- header navigation structure
- quote service options and venue routing
- hardcoded media arrays and fallback/demo content
- `blaze-projects` and `kolasi-events` Payload collections

### Findings

- Blaze is already positioned as cinematic production, weddings, editorials, and visual storytelling.
- Kolasi is already positioned as artist booking, event curation, live programming, and venue activation.
- The split is directionally correct, but the frontend still feels overloaded because proof, service explanation, media galleries, and conversion paths are mixed together.
- Blaze currently feels clearer and stronger than Kolasi because its selected-work structure is more direct.
- Kolasi has the right content model but too many competing sections and some unnecessary 3D/tilt behavior.
- Venue programming should be treated as a Kolasi-owned conversion path.
- Public fallback/demo proof remains a credibility risk, especially forced venue case studies.

### Files Changed

- `docs/BRAND_ARCHITECTURE.md`
- `docs/DEV_LOG.md`

### Intentionally Not Changed

- No app code changed.
- No design changes.
- No 3D added.
- No frontend components refactored.
- No routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, public copy, dependencies, or media assets changed.

### Validation Results

- `git status`: reviewed before documentation edits.
- `npm run typecheck`: passed after rerun with escalated filesystem access because the sandboxed run hit the known Windows `EPERM` realpath issue.

### Recommended Next Phase

Phase 11 should be a narrow Kolasi and Venues simplification baseline: remove fake public proof, isolate unnecessary 3D/tilt behavior, and consolidate Kolasi media constants without changing visual design or behavior.

## 2026-07-01 - Phase 11: Kolasi/Venues Simplification Baseline

### Areas Reviewed

- `app/(site)/kolasi/KolasiClient.tsx`
- `components/ui/UpcomingEvents.tsx`
- `app/(site)/venues/VenuesClient.tsx`
- Kolasi event and artist detail fallback routes
- venue case-study rendering
- quote routing for venue users
- hardcoded Kolasi media arrays and fake public proof

### Chosen Scope

- Remove or hide fake/demo public proof where CMS data is empty.
- Prevent venue case studies from rendering forced fallback cards.
- Remove Kolasi gallery tilt/3D-like hover behavior while keeping the marquee gallery.

### Changes Made

- `UpcomingEvents` no longer renders hardcoded fake upcoming events when CMS has no upcoming events. It now shows the existing empty state.
- `VenuesClient` no longer forces the case-study section to render when `caseStudies` is empty.
- Fake venue case-study cards for Calypso Club, Hotel Costes Bar, and forced Le Speakeasy results were removed from public rendering.
- Kolasi marquee gallery cards no longer run rotateX/rotateY/transformPerspective hover handlers.

### Files Changed

- `app/(site)/kolasi/KolasiClient.tsx`
- `app/(site)/venues/VenuesClient.tsx`
- `components/ui/UpcomingEvents.tsx`
- `docs/BRAND_ARCHITECTURE.md`
- `docs/DEV_LOG.md`

### Intentionally Not Changed

- No routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, form contracts, navigation labels, or URLs changed.
- No dependencies were added.
- No 3D was added.
- Real CMS-driven events, case studies, packages, artists, and venue form conversion paths remain intact.
- Static detail-route fallbacks for Blaze, Kolasi events, and artists were reviewed but left for a separate CMS-only proof cleanup phase.

### Validation Results

- `npm ci`: passed after rerun with escalated filesystem access because the sandboxed run hit the known Windows `EPERM` realpath issue.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed after rerun with escalated filesystem access because the sandboxed run hit the known Windows `EPERM` realpath issue. Result: 10 files and 46 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas. Build also logged a stale Browserslist data notice.

### Remaining Frontend Risks

- Blaze/Kolasi/artist detail pages still expose static fallback/demo content when CMS is empty.
- Kolasi page still has several dense sections and duplicated media arrays.
- Venue package fallback pricing and FAQ fallback content remain and need a separate product/content decision.
- Browser visual comparison was not performed yet.

### Recommended Next Phase

Phase 12 should remove public demo/fallback detail content from Blaze projects, Kolasi events, and artist profiles by switching those detail routes to CMS-only rendering while preserving safe page-level fallback media where appropriate.

## 2026-07-01 - Phase 12: Remove Public Demo/Fallback Proof From Detail Pages

### Detail Pages Reviewed

- `app/(site)/blaze/[slug]/page.tsx`
- `app/(site)/kolasi/[slug]/page.tsx`
- `app/(site)/kolasi/artists/[slug]/page.tsx`
- `app/(site)/blaze/[slug]/BlazeProjectDetail.tsx`
- `app/(site)/kolasi/[slug]/KolasiEventDetail.tsx`
- `app/(site)/kolasi/artists/[slug]/ArtistProfile.tsx`
- sitemap CMS route generation

### Fake/Demo Proof Removed

- Removed static Blaze project maps and demo slugs from public Blaze project detail routing.
- Removed static Kolasi event maps and demo slugs from public Kolasi event detail routing.
- Removed static artist profiles, fake social links, fake mixes, and fake artist-event relationships from public artist detail routing.
- Missing CMS detail records now return `notFound()` instead of static demo content.

### Chosen Scope

- Keep route patterns and real CMS rendering intact.
- Keep detail presentation components intact.
- Keep adjacent navigation for real CMS records, falling back only to neutral null adjacency if related CMS data is unavailable.
- Add a focused regression test that prevents static demo proof maps from being reintroduced into these route files.

### Fallback Content Intentionally Kept

- Neutral page-level fallback media and static UI sections outside these detail routes remain.
- Venue package/FAQ fallback utility content remains for a separate product/content decision.
- Journal, press, RSS, and About fallback content were not changed in this phase.
- Safe empty/not-found behavior remains the fallback for missing public detail proof.

### Files Changed

- `app/(site)/blaze/[slug]/page.tsx`
- `app/(site)/kolasi/[slug]/page.tsx`
- `app/(site)/kolasi/artists/[slug]/page.tsx`
- `tests/detail-fallbacks.test.ts`
- `docs/BRAND_ARCHITECTURE.md`
- `docs/DEV_LOG.md`

### Intentionally Not Changed

- No 3D.
- No redesign.
- No routes, slugs, Payload schemas, API contracts, backend behavior, form contracts, navigation labels, or URLs changed.
- No dependencies were added.
- No real CMS-driven content rendering was removed.
- No conversion paths were removed.

### Validation Results

- `npm ci`: passed after rerun with escalated filesystem access because the sandboxed run timed out before producing a useful result.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed after rerun with escalated filesystem access because the sandboxed run hit the known Windows `EPERM` realpath issue. Result: 11 files and 49 tests.
- `npm run build`: passed. Build still logged CMS-safe MongoDB authentication fallback errors because local `.env` credentials could not authenticate with Atlas. Build also logged a stale Browserslist data notice.

### Remaining Frontend Risks

- Kolasi page still has dense section stacking and duplicated media constants.
- Kolasi landing showcase cards link to static event slugs (`le-speakeasy`, `2nd-sun`, `kolasi-nights`); with the event detail route now CMS-only, those links resolve to `notFound()` unless the matching events exist in the CMS. Address in the Phase 13 Kolasi cleanup.
- Blaze listing page still has curated static image arrays for non-detail presentation.
- Journal and press fallback/demo content remain outside this phase (`journal/[slug]` still serves `staticPostsMap` demo posts).
- Venue package/FAQ utility fallbacks remain and need a separate product/content decision.
- Existing local MongoDB auth warnings still reduce build-log signal quality.

### Recommended Next Phase

Phase 13 should focus on Kolasi page density and media-source cleanup: consolidate static media constants, decide whether both showcase and marquee are needed, and preserve current visual direction without adding 3D.

## 2026-07-01 - Phase 13: Kolasi Landing Link and Density Cleanup

### Kolasi Areas Reviewed

- `app/(site)/kolasi/KolasiClient.tsx` (hero, manifesto, expertise, showcase, upcoming events, services accordion, marquee gallery, venue/CTA banners).
- `app/(site)/kolasi/page.tsx` server data flow (`getAllKolasiEvents`, `getUpcomingEvents` via `safeCms`).
- `components/ui/UpcomingEvents.tsx` link behavior.
- Kolasi event detail route and artist detail route (CMS-only from Phase 12).
- All `/kolasi/` link sites across `app/`.

### Broken/Demo Links Found

- The static `showcaseClips` cards rendered a "View Event" link to `/kolasi/<slug>` for demo slugs `le-speakeasy`, `2nd-sun`, and `kolasi-nights`. With the event detail route now CMS-only (`notFound()` on unknown slugs), these three links resolved to 404 and presented static promos as real, browsable events.
- `UpcomingEvents` was already safe: it links to `/kolasi/<slug>` only when a real CMS `slug` exists and shows a credible empty state otherwise.

### Chosen Scope

- Remove the demo `slug` fields from the static `showcaseClips` and drop the broken "View Event" link so the clips are honest, non-clickable brand/media previews.
- Remove `cursor-pointer` from the showcase card so a non-navigating card does not look clickable.
- Keep the promo videos, labels, layout, and all real conversion CTAs (`/venues`, `/contact`, `#services`) unchanged.
- Do not consolidate/remove media sections: the expertise, showcase, gallery, and services sections are all real brand media, and merging or removing any is a redesign/content decision outside this phase's minimal scope.

### Changes Made

- `app/(site)/kolasi/KolasiClient.tsx`: removed demo slugs from `showcaseClips`, removed the `/kolasi/<slug>` "View Event" link and the `& { slug?: string }` card type, removed the misleading `cursor-pointer`, and added a comment documenting that these clips are media previews, not linked events.
- `tests/kolasi-landing-links.test.ts`: new focused regression test asserting the landing exposes no demo detail links and keeps its real conversion CTAs.

### Files Changed

- `app/(site)/kolasi/KolasiClient.tsx`
- `tests/kolasi-landing-links.test.ts`
- `docs/DEV_LOG.md`
- `docs/BRAND_ARCHITECTURE.md`

### Intentionally Not Changed

- No 3D, no redesign, no broad `KolasiClient` rewrite.
- No routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, or form contracts changed.
- No dependencies added.
- No CMS-driven content removed; real event links via `UpcomingEvents` untouched.
- Static media arrays (`galleryRow1/2`, `expertise`, `services`) kept — they are neutral fallback/brand media, not demo proof, and consolidating them was not clearly safe within scope.

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed (no warnings or errors).
- `npm test`: passed. Result: 12 files and 51 tests.
- `npm run build`: passed. `/kolasi` bundle shrank slightly after removing the link block; build still logged the expected CMS-safe MongoDB auth fallback because local `.env` cannot authenticate with Atlas.

### Remaining Frontend Risks

- The venues page still links its static artist roster to `/kolasi/artists/<slug>` (`kate-zubok`, `dj-marco`, …), which now 404 on the CMS-only artist detail route. This is a separate page and out of this phase's scope.
- `journal/[slug]` still serves `staticPostsMap` demo posts.
- Static artist rosters / proof remain on the venues pages, `home-content.ts`, and `showreel`.
- The Kolasi landing still stacks several dense media sections (expertise vs. services overlap; showcase + marquee gallery); reducing this is a content/design decision deferred to a future phase.
- Local build cannot authenticate with Atlas, so live CMS rendering of the landing was not verified against real data.

### Recommended Next Phase

Phase 14: neutralize the venues page static artist roster links to `/kolasi/artists/<demo-slug>` (same CMS-only 404 risk as the Kolasi showcase), and make a content decision on the journal `[slug]` static demo posts.

## 2026-07-01 - Phase 14: Venues Artist Roster Link Cleanup

### Venues Artist Links Reviewed

- `app/(site)/venues/page.tsx` — English venues server page and its `staticRoster` fallback.
- `app/(site-fr)/fr/venues/page.tsx` — French venues server page (imports the same `VenuesClient` and carries a duplicate `staticRoster`).
- `app/(site)/venues/VenuesClient.tsx` — roster card render (`artist.slug ? <Link> : <div>`), Calendly/WhatsApp/`#venue-form` conversion paths.
- Artist detail route (`app/(site)/kolasi/artists/[slug]/page.tsx`) — CMS-only, `notFound()` on unknown slugs.
- All `/kolasi/artists/` link sites across `app/`.

### Broken/Demo Artist Links Found

- Both venues pages fed `VenuesClient` a `staticRoster` (used only when CMS returns no artists) in which six demo artists carried `slug` fields — `kate-zubok`, `dj-marco`, `lina-m`, `samir-k`, `naya-sound`, `rami-b` — rendering clickable `/kolasi/artists/<demo-slug>` cards that 404 on the CMS-only artist detail route.
- Two static roster entries (`alex-d`, `yasmine-k`) already had no slug and were non-clickable.
- All other `/kolasi/artists/` links in the app are real CMS-driven (VenuesClient for CMS artists, ArtistProfile prev/next, KolasiEventDetail artist chips, sitemap) and were left unchanged.

### Chosen Scope

- Remove the demo `slug` fields from both static rosters so the fallback cards render as non-clickable `<div>` previews via `VenuesClient`'s existing conditional.
- Leave `VenuesClient` untouched: real CMS artists still carry real slugs and remain clickable.
- Preserve all conversion paths (Calendly, WhatsApp, `#venue-form`, sticky mobile CTA).

### Changes Made

- `app/(site)/venues/page.tsx`: dropped `slug` from the six demo roster entries; added a comment explaining why static previews carry no slug.
- `app/(site-fr)/fr/venues/page.tsx`: same change for the French page.
- `tests/venues-roster-links.test.ts`: new focused regression test — both venues pages expose no demo artist slugs, `VenuesClient` still links real CMS artists, and venue conversion paths remain.

### Files Changed

- `app/(site)/venues/page.tsx`
- `app/(site-fr)/fr/venues/page.tsx`
- `tests/venues-roster-links.test.ts`
- `docs/DEV_LOG.md`
- `docs/BRAND_ARCHITECTURE.md`

### Intentionally Not Changed

- No 3D, no redesign, no broad `VenuesClient` rewrite.
- No routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, or form contracts changed.
- No dependencies added.
- No CMS-driven content removed; real CMS artist links preserved.
- The static roster cards themselves (demo artist names/genres/photos) were kept as non-clickable previews, per the phase's preferred approach; whether those demo names should exist at all is a separate content-authenticity decision.

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed (no warnings or errors).
- `npm test`: passed. Result: 13 files and 55 tests.
- `npm run build`: passed. `/venues` and `/fr/venues` both build; build still logged the expected CMS-safe MongoDB auth fallback because local `.env` cannot authenticate with Atlas.

### Remaining Frontend Risks

- The static venues roster still shows demo artist names/genres as non-clickable previews; treating these as a content-authenticity item is deferred.
- `journal/[slug]` still serves `staticPostsMap` demo posts.
- Static artist proof also remains on `home-content.ts` and `showreel`.
- The Kolasi landing still stacks several dense media sections (deferred content/design decision).
- Local build cannot authenticate with Atlas, so live CMS rendering of the venues roster was not verified against real data.

### Recommended Next Phase

Phase 15: content decision on the `journal/[slug]` static demo posts (currently rendered as real journal detail pages), then a broader pass on remaining static "proof" arrays in `home-content.ts` and `showreel`.

## 2026-07-01 - Phase 15: Journal Demo Post Cleanup

### Journal Areas Reviewed

- `app/(site)/journal/[slug]/page.tsx` — detail route (`staticPostsMap` fallback, `generateStaticParams`, `generateMetadata`, related posts).
- `app/(site)/journal/page.tsx` — listing page (`staticPosts` fallback).
- `app/feed.xml/route.ts` — RSS feed (`staticPosts` fallback).
- `app/sitemap.ts` — journal `postRoutes` (already CMS-only, no static demo posts).
- `app/(site)/journal/JournalClient.tsx` and `JournalPostDetail.tsx` — empty-state behavior.
- `lib/fetchers.ts` — `getAllPosts`, `getPostBySlug` (returns null for missing), `getRelatedPosts`.

### Demo/Static Posts Found

- Five full demo articles were served as real content: `behind-the-scenes-beirut-wedding`, `5-questions-wedding-videographer`, `art-of-nightlife-programming`, `kolasi-season-3`, `embassy-of-lebanon-bts`.
- Detail route: `staticPostsMap` provided full fake article bodies; demo slugs were prerendered via `generateStaticParams`, served on cache miss, used for metadata, and used as related-post fallbacks.
- Listing page: `staticPosts` rendered the five demo articles whenever CMS returned no posts.
- Feed: `staticPosts` published the five demo articles in the public RSS feed whenever CMS returned no posts.
- Sitemap: already CMS-only — no change needed.

### Chosen Scope

- Detail route → CMS-only; `notFound()` when the post is missing (matches Blaze/Kolasi/artist routes from Phase 12).
- Listing page → CMS-only; `JournalClient` already renders a credible empty state ("No posts in this category yet.").
- Feed → CMS-only; emits a valid RSS feed with zero items when CMS is empty.
- No component redesign; `JournalClient`/`JournalPostDetail` untouched.

### Changes Made

- `app/(site)/journal/[slug]/page.tsx`: removed `staticPostsMap`/`staticAllPosts`; `generateStaticParams` uses CMS slugs only; metadata and page fall back to `notFound()`/"Post Not Found" instead of demo content; related posts come from CMS only.
- `app/(site)/journal/page.tsx`: removed `staticPosts`; passes CMS posts only.
- `app/feed.xml/route.ts`: removed `staticPosts` and the empty-CMS fallback.
- `tests/journal-fallbacks.test.ts`: new focused regression test.

### Feed/Sitemap Impact

- Feed (`/feed.xml`): no longer publishes demo posts; renders a valid empty channel when CMS has no posts.
- Sitemap (`/sitemap.xml`): unchanged — it was already CMS-only for journal posts.

### Files Changed

- `app/(site)/journal/[slug]/page.tsx`
- `app/(site)/journal/page.tsx`
- `app/feed.xml/route.ts`
- `tests/journal-fallbacks.test.ts`
- `docs/DEV_LOG.md`
- `docs/BRAND_ARCHITECTURE.md`

### Intentionally Not Changed

- No 3D, no redesign, no broad journal rewrite.
- No routes, slugs, SEO metadata structure, Payload schemas, API contracts, backend behavior, or form contracts changed.
- No dependencies added.
- No real CMS-driven content removed; real CMS journal rendering preserved.
- Static "proof" arrays in `home-content.ts` and `showreel` were left untouched per scope.

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed (no warnings or errors).
- `npm test`: passed. Result: 14 files and 59 tests.
- `npm run build`: passed after stopping a running `next dev` server that held `.next\trace` (Windows/OneDrive `EPERM` lock) and clearing `.next`. `/journal/[slug]` now prerenders zero static params (no demo posts); build still logged the expected CMS-safe MongoDB auth fallback because local `.env` cannot authenticate with Atlas.

### Remaining Frontend/Content Risks

- The journal listing and feed are empty while CMS has no posts; seeding real posts is required for public journal content to appear.
- Static "proof" arrays remain in `home-content.ts` (artist names, venue logos) and `showreel`.
- The static venues roster still shows demo artist names/genres as non-clickable previews (content-authenticity item from Phase 14).
- The Kolasi landing still stacks several dense media sections (deferred content/design decision).
- Local build cannot authenticate with Atlas, so live CMS journal rendering was not verified against real data.

### Recommended Next Phase

Phase 16: content decision on remaining static "proof" arrays in `home-content.ts` (fabricated artist names / venue logos presented as credentials) and `showreel`, keeping real CMS-driven content intact.

## 2026-07-01 - Phase 16: Static Proof Cleanup (Home, Showreel, Venues Roster)

### Static Proof Surfaces Reviewed

- `app/(site)/home-content.ts` — `homeMedia` galleries and `homeCollaborations` ("Trusted by" credential strip).
- `app/(site)/HomeClient.tsx` — collaborations strip rendering (`grid-cols-2 md:grid-cols-5`, logo-or-name cards).
- `app/(site)/showreel/page.tsx` and `ShowreelClient.tsx` — `staticHighlights` reel clips.
- `app/(site)/venues/page.tsx` and `app/(site-fr)/fr/venues/page.tsx` — `staticRoster` fallback.
- `app/(site)/venues/VenuesClient.tsx` — roster grid and empty state.

### Fake/Demo Proof Found

- The fabricated demo persona "Kate Zubok" (part of the placeholder DJ roster: Kate Zubok, DJ Marco, Naya Sound, Samir K, Lina M, Rami B, Alex D, Yasmine K) appeared as:
  - A "Trusted by" collaboration credential in `homeCollaborations`.
  - A showreel highlight titled "Kate Zubok Live".
- Both venues pages carried an 8-artist `staticRoster` fallback of fabricated DJs (names + genres + generic photos) shown as the venues roster whenever CMS returned no artists.
- No static testimonials, press, awards, or case studies were found on these surfaces.

### Chosen Scope

- Remove the fabricated "Kate Zubok" credential from the homepage collaborations strip; keep all real collaborations (Elie Saab, MIPIM Cannes, STOUH BEIRUT, Le Speakeasy, Embassy of Lebanon, Transdev, Chloe Khalife, Brunch Festival, France Tourisme).
- Neutralize the showreel "Kate Zubok Live" label to a non-credential "Live Set", preserving the real Mux clip (no real media deleted).
- Remove the fabricated venues `staticRoster` fallback so the roster is CMS-only; VenuesClient's existing "Roster coming soon. Book a call…" empty state renders when CMS has no artists.

### Changes Made

- `app/(site)/home-content.ts`: removed the `{ name: 'Kate Zubok', location: 'International' }` collaboration entry.
- `app/(site)/showreel/page.tsx`: renamed the "Kate Zubok Live" highlight to "Live Set".
- `app/(site)/venues/page.tsx` and `app/(site-fr)/fr/venues/page.tsx`: removed `staticRoster`; roster is now `cmsArtists` only.
- `tests/static-proof.test.ts`: new focused regression test.

### Static Content Intentionally Kept

- `homeMedia` image galleries and showreel Mux clips — real portfolio media, not fabricated named credentials.
- Real collaborations/logos in `homeCollaborations` (Elie Saab, MIPIM, STOUH BEIRUT, Le Speakeasy, etc.) — corroborated by the About-page credits and real brand logos.
- "Chloe Khalife" — a real artist name, not part of the demo placeholder roster; left as a collaboration.
- VenuesClient roster grid and its empty state — real UI, unchanged.

### Files Changed

- `app/(site)/home-content.ts`
- `app/(site)/showreel/page.tsx`
- `app/(site)/venues/page.tsx`
- `app/(site-fr)/fr/venues/page.tsx`
- `tests/static-proof.test.ts`
- `docs/DEV_LOG.md`
- `docs/BRAND_ARCHITECTURE.md`

### Intentionally Not Changed

- No 3D, no redesign, no broad page rewrites.
- No routes, slugs, SEO metadata, Payload schemas, API contracts, backend behavior, or form contracts changed.
- No dependencies added.
- No real CMS-driven content or real media assets removed.
- No conversion CTAs removed (quote/contact/venues/Calendly/WhatsApp all preserved).
- The About page credits and other pages were left untouched (out of scope).

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed (no warnings or errors).
- `npm test`: passed. Result: 15 files and 63 tests.
- `npm run build`: passed (no dev server running, so no `.next` lock). Build still logged the expected CMS-safe MongoDB auth fallback because local `.env` cannot authenticate with Atlas.

### Remaining Frontend/Content Risks

- When CMS has no artists, the venues roster shows only the "Roster coming soon" empty state; seeding real artists is required for a public roster.
- Homepage/showreel/venues still depend on real CMS data for named proof; only the fabricated "Kate Zubok" persona was scrubbed here — any other unverifiable collaboration names remain the client's to confirm.
- Static demo imagery (generic artist photos) is still used decoratively in some galleries but is no longer attached to fabricated names.
- Local build cannot authenticate with Atlas, so live CMS rendering of these surfaces was not verified against real data.

### Recommended Next Phase

Phase 17: with the client, verify the remaining named collaborations/credits (home collaborations, About-page credits) against real engagements, and seed real CMS artists/posts/events so the public proof surfaces render genuine content instead of empty states.

## 2026-07-01 - Phase 16B: Add Embassy of Lebanon as Priority Blaze Project Card

### Context

Embassy of Lebanon is a confirmed real Blaze collaboration (per the phase brief and the real event assets in the repo). It previously appeared only as a generic collaboration credential and a press mention, not as a Blaze project card.

### Blaze Project/Proof Surfaces Reviewed

- `app/(site)/HomeClient.tsx` — homepage `curatedBlazeItems` fed to `WorkOrbitCarousel`.
- `app/(site)/home-content.ts` — `homeMedia` image sets, `homeCollaborations` strip.
- `app/(site)/blaze/BlazeClient.tsx` — `selectedWork` module (`stouhBeirut`/`weddingsStatic`/`editorialStatic` + `OrbitCarousel`) and the `?work=` deep-link handler.
- `app/(site-fr)/fr/page.tsx` — reuses `HomeClient` (so the homepage change covers `/fr`); no separate `/fr/blaze` route exists.
- `app/(site)/showreel/page.tsx` — does not feed Blaze cards.

### Where Embassy Was Already Present

- `home-content.ts` `homeCollaborations`: `{ name: 'Embassy of Lebanon', location: 'Paris' }` (generic, no logo).
- `app/(site)/press/page.tsx`: a press item "Behind the Lens: Embassy Events".

### Real Embassy Media Found

- `public/assets/blaze/ambassy/` contains 19 real Embassy event photos (`0C5A9134.jpg` … `4F8A9996.jpg`), also mirrored on Cloudinary. These are served the same way as the other Blaze card media (`/assets/blaze/...`).

### Where Embassy Was Added

- Homepage Blaze carousel (`curatedBlazeItems`): a new first WorkItem — title "Embassy of Lebanon", category "Institutional Event", meta "Institutional event coverage", image `media.embassy[0]`, `blazeWorkId: 'embassy'`.
- `home-content.ts`: added an `embassy` image array to `homeMedia` using real ambassy assets.
- Blaze page `selectedWork`: a new first item (id `embassy`) — "Embassy of Lebanon", "Institutional Event", description "Institutional event coverage in Paris.", `items: embassyStatic` (12 real ambassy photos in the same `{ url, title, category }` shape as the other cards).
- Blaze page: added `'embassy'` to the `?work=` deep-link allowlist so the homepage card opens the Embassy tab; widened the tab grid from `sm:grid-cols-3` to `sm:grid-cols-2 lg:grid-cols-4` to fit four tabs cleanly.

### Card Order / Priority

- Embassy is placed first on both the homepage carousel and the Blaze page selected-work module (default active tab), giving it top visual priority alongside the main showcased projects.

### What Was Intentionally Not Invented

- No fake case study, long description, event dates, metrics, testimonials, or invented gallery images.
- Only real ambassy assets were used; no unrelated wedding/editorial media was assigned to Embassy.
- Copy kept minimal and factual ("Institutional event coverage in Paris" — Paris is the confirmed collaboration location); no video was implied (only photo assets exist).

### Files Changed

- `app/(site)/home-content.ts`
- `app/(site)/HomeClient.tsx`
- `app/(site)/blaze/BlazeClient.tsx`
- `tests/blaze-embassy-card.test.ts`
- `docs/DEV_LOG.md`
- `docs/BRAND_ARCHITECTURE.md`

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed (no warnings or errors).
- `npm test`: passed. Result: 16 files and 66 tests.
- `npm run build`: passed after stopping a running `next dev` server that held `.next` and clearing `.next` (Windows/OneDrive `EPERM` lock). Build still logged the expected CMS-safe MongoDB auth fallback (local `.env` cannot authenticate with Atlas).

### Remaining Content/Design Risks

- Embassy card media/copy is curated/static, matching the other Blaze cards ("curated until the final CMS media pass"); it should migrate to CMS when Blaze projects are seeded.
- Only photo assets exist for Embassy; if a real Embassy film clip is provided later, the card can gain a hero video like other projects.
- The pre-existing homepage `?work=creative-direction` deep-link still does not match the Blaze `selectedWork` id `editorial` (unrelated pre-existing quirk, left untouched).
- Local build cannot authenticate with Atlas, so live rendering was not verified against real CMS data.

### Recommended Next Phase

Phase 17: with the client, verify the remaining named collaborations/credits against real engagements, and seed real CMS Blaze projects/artists/posts/events (including a CMS-backed Embassy project) so the curated static cards can be replaced by CMS-driven content.

## 2026-07-01 - Phase 16C: Validate Embassy of Lebanon Blaze Card

### Outcome

Validation-only pass confirming the Embassy of Lebanon Blaze card added in Phase 16B (commit `01038e0`). No code changes were required; the working tree was already clean.

### Verified

- Embassy appears as a Blaze project card on both surfaces: the homepage carousel (`curatedBlazeItems` in `HomeClient.tsx`) and the Blaze page selected-work module (`selectedWork` in `BlazeClient.tsx`), not only as a generic collaboration.
- All 12 referenced Embassy assets exist on disk under `public/assets/blaze/ambassy/` (e.g. `0C5A9134.jpg` … `4F8A9974.jpg`); no broken paths.
- Embassy media is real Embassy-specific imagery and is consistent with the existing Blaze media class — average ~1.89 MB per image vs ~2.5 MB for the existing `stouh_beirut` set, so no oversized-asset regression; images are optimized at serve time by Next/Image.
- Alt text is factual and minimal: both `WorkOrbitCarousel` and `OrbitCarousel` render `alt={item.title}` = "Embassy of Lebanon".
- No fake/demo proof reintroduced (guarded by `tests/blaze-embassy-card.test.ts`).

### Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed (no warnings or errors).
- `npm test`: passed. Result: 16 files and 66 tests.
- `npm run build`: passed after stopping a running `next dev` server that held `.next` and clearing `.next` (Windows/OneDrive `EPERM` lock).

### Commit

No new content commit was created for the card itself — it was already committed in Phase 16B as `01038e0` (message `content: add Embassy of Lebanon Blaze project card`). This entry records the Phase 16C validation only.
