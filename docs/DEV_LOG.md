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
