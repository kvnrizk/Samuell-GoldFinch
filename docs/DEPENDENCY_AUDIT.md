# Dependency Audit

Date: 2026-07-01

## Current Count

`npm audit --json` reports:

- Critical: 0
- High: 15
- Moderate: 6
- Low: 1
- Total: 22

Production-only audit with `npm audit --omit=dev --json` reports:

- Critical: 0
- High: 13
- Moderate: 4
- Low: 2
- Total: 19

## Direct Vulnerable Dependencies

Production dependencies:

- `next@15.4.11`: high severity. Audit suggests `next@15.5.19`, which is same major but still a framework upgrade.
- `payload@3.84.1`: high severity via `undici` and `uuid`. Audit metadata suggests a non-useful downgrade-style fix, so this should be handled as a Payload ecosystem update only after review.
- `@payloadcms/db-mongodb@3.84.1`: high severity via `mongoose`, `payload`, and `uuid`.
- `@payloadcms/next@3.84.1`: high severity via Payload UI/GraphQL/runtime dependencies.
- `@payloadcms/plugin-cloud-storage@3.84.1`: high severity via Payload UI/runtime dependencies.
- `@payloadcms/richtext-lexical@3.84.1`: high severity via Payload UI/runtime dependencies.

Dev dependency:

- `tsx@4.19.2`: moderate severity via `esbuild`; dev/script tooling only.

## Transitive Summary

Payload-owned or Payload-adjacent:

- `undici`
- `uuid`
- `mongoose`
- `@payloadcms/graphql`
- `@payloadcms/ui`
- `immutable`
- `ws`
- `lodash`
- `js-yaml`
- `dompurify`
- `monaco-editor`

Next-owned:

- `postcss` under `next`

Dev/test tooling:

- `vite` through `vitest`
- `esbuild` through `tsx`, Payload internals, and Vite
- `flatted` through ESLint cache tooling

## Safe Fixes Applied

None in this phase.

Reason: the meaningful production fixes require upgrading core framework/CMS packages (`next` and the Payload package group). That is not a lockfile-only repair and should be reviewed as its own scoped dependency update because it can affect runtime, admin, and build behavior.

## Risky Fixes Deferred

- Upgrade `next` from `15.4.11` to the audited patched `15.5.x` line.
- Upgrade all Payload packages together from `3.84.1` to a reviewed patched `3.85.x` or newer Payload 3 line.
- Investigate whether the Payload audit recommendation for `payload@3.79.1` is stale or misleading before changing Payload versions.
- Upgrade `tsx` to a patched 4.x line after deciding whether dev-tool vulnerabilities should be handled separately.
- Re-run audit after framework/CMS updates because many transitive findings are owned by those packages.

## Recommended Next Actions

1. Create a dedicated dependency-update branch.
2. Update Next within major 15 only.
3. Update all Payload packages together within major 3 only.
4. Validate Payload admin, import map generation, forms, and production build.
5. Re-run `npm audit --json` and compare counts.

## Phase 2B Scoped Update Attempt

Date: 2026-07-01

### Baseline

- `next`: `15.4.11`
- Latest allowed Next 15 from npm: `15.5.19`
- Payload direct packages: `3.84.1`
- Latest allowed Payload 3 from npm: `3.85.1`
- Production audit before update attempt: 19 total vulnerabilities, with 13 high, 4 moderate, and 2 low.

### Update Plan Tested

Targeted only:

- `next`
- `payload`
- `@payloadcms/db-mongodb`
- `@payloadcms/next`
- `@payloadcms/plugin-cloud-storage`
- `@payloadcms/richtext-lexical`

### Result

No dependency update was committed.

Blockers:

- `@payloadcms/next@3.85.1` peer dependency allows `next >=15.4.11 <15.5.0` or `next >=16.2.6 <17.0.0`.
- `next@15.5.19` is therefore not compatible with Payload 3.85.1.
- Next 16 is out of scope for this project phase.
- There is no newer compatible `next@15.4.x`; `15.4.11` is the latest in that line.
- Updating Payload packages to `3.85.1` without Next required npm to refresh stale `package-lock.json` Payload entries. Normal `npm install`, `npm update`, package-lock-only install, and aligned Payload group install all failed with peer-resolution errors against the stale `3.84.1` lock entries.
- Using `npm install --force` was rejected as unsafe for this phase, so the update was not forced.

### Versions After

No package versions changed.

### Remaining Recommendation

Treat dependency remediation as a compatibility decision, not a mechanical patch:

1. Either wait for a Payload 3 release that supports patched Next 15.5.x.
2. Or plan a larger migration to Next 16 only after explicit approval.
3. Or review whether a manual lockfile refresh strategy is acceptable, then test it in a separate branch with full admin and form QA.
