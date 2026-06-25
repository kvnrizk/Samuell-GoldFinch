# Setup Reset Audit - 2026-05-06

## Goal
Stabilize local runtime outside OneDrive, validate environment/config truth, and verify readiness gates before frontend polish.

## What was done
1. Copied repo from OneDrive path to `C:\dev\Samuell-GoldFinch` and ran clean setup there.
2. Cleared `.next` and `node_modules`, then ran `npm ci --legacy-peer-deps` from clean state.
3. Verified Node/npm against project baseline:
   - `.nvmrc`: `20`
   - local Node: `v20.20.0`
   - local npm: `10.8.2`
4. Validated `.env` keys by presence only (no values exposed), using current `.env` as source of truth.
5. Ran quality gates (`lint`, `test`, `build`) in `C:\dev`.
6. Ran dev-start verification attempts and middleware smoke checks.

## Environment key status (presence only)
### Required
- `DATABASE_URI`: present
- `PAYLOAD_SECRET`: present
- `NEXT_PUBLIC_SITE_URL`: present

### Optional currently present
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`
- `RESEND_API_KEY`
- `SAM_WHATSAPP_NUMBER`

### Optional currently missing
- `CRON_SECRET`
- `ADMIN_ACCESS_SECRET`
- `NEXT_PUBLIC_GA4_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`

## Verification results
### Clean setup
- `npm ci --legacy-peer-deps`: pass

### Lint
- `npm run lint`: pass with 2 warnings
  - `app/(site)/quote/QuoteClient.tsx`: missing `useCallback` dependency (`locale`)
  - `components/layout/SiteShell.tsx`: `<head>` usage warning

### Tests
- `npm test`: pass (`5` files, `15` tests)

### Build
- `npm run build`: pass (exit code 0)
- During static generation, repeated Mongo connection errors to `127.0.0.1:27017` were logged, but CMS-safe fallbacks allowed build completion.

### Dev runtime
- Foreground startup capture confirms Next reaches Ready state in `C:\dev`:
  - From `fg-dev-final.log`: `Starting...` then `Ready in 1531ms`
- Repeated detached/background probing is flaky in this sandbox context and intermittently produced:
  - `EPERM` on `.next\trace`
  - `EADDRINUSE` when stale dev processes were still alive
- Middleware smoke evidence (captured in a successful probe run):
  - `POST /contact` attempts 1-5 returned non-rate-limited responses
  - attempt 6 returned `429` (rate limiting active)

## Dashboard/admin status
- Admin/dashboard wiring is present in code and configured:
  - Payload admin route exists at `/admin`
  - Dashboard components are registered in `payload.config.ts` (`beforeDashboard` block)
- Live admin UI verification in this environment is blocked by unstable detached dev probing + no DB connectivity.

## Current truth summary
- OneDrive path was a real runtime stability risk; moving to `C:\dev` materially improved build/dev behavior.
- Project stack/config/docs are aligned with a Next + Payload + Mongo setup.
- Build/test/lint baseline is mostly healthy.
- Main blocker before full runtime confidence is local DB connectivity (current runtime resolves to localhost Mongo and falls back for frontend content).

## Immediate next actions before frontend polish
1. Ensure `DATABASE_URI` in the active runtime points to intended MongoDB Atlas (or start local Mongo if that is intentional).
2. Re-run dev smoke checks with stable DB connection and confirm:
   - `/`, `/fr`, `/quote`, `/venues`, `/admin` load reliably
   - `/api/globals/global-settings` and `/api/posts` return expected auth/data behavior
3. Resolve or document the two lint warnings to keep CI/pipeline clean.
