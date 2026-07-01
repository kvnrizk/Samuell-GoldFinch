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
