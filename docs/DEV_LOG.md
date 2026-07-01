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
