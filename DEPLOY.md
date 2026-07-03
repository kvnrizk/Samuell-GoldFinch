# Deploy Runbook — merge `Kevin_Deploy_OFC` → `main`

This branch is ready for production. **Merging it into `main` triggers the Vercel deploy** (Vercel is connected to this repo on Kevin's account and builds every push to `main`).

---

## 1. Merge this branch into `main`

**Option A — GitHub PR (recommended, gives a review view):**
1. Open a PR: `Kevin_Deploy_OFC` → `main` (`https://github.com/kvnrizk/Samuell-GoldFinch/pull/new/Kevin_Deploy_OFC`).
2. Review the diff, then **Merge**.

**Option B — command line:**
```bash
git checkout main
git pull origin main
git merge Kevin_Deploy_OFC
git push origin main
```

## 2. Vercel deploys automatically

On push to `main`, Vercel builds and deploys. Watch it in the **Vercel dashboard → Deployments**. No other server is needed (Next.js app + Payload CMS admin + API routes all run on Vercel).

## 3. Required environment variables

Set these in **Vercel → Settings → Environment Variables** (they are *not* in the repo). The build fails in production without the first three.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URI` | ✅ | MongoDB Atlas connection string |
| `PAYLOAD_SECRET` | ✅ | Payload CMS auth secret |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production URL, e.g. `https://samuellgoldfinch.com` |
| `CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | recommended | Cloudinary cloud (admin media uploads + some images) |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | recommended | Cloudinary uploads from the CMS |
| `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` | recommended | Hero/showreel video streaming (Mux) |
| `RESEND_API_KEY` | recommended | Transactional email (contact/quote forms) |
| `CRON_SECRET` | recommended | Protects the automation cron route |
| `SAM_WHATSAPP_NUMBER`, `TWILIO_*` | optional | WhatsApp notifications |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | optional | Analytics |

**MongoDB Atlas:** Network Access must allow Vercel's dynamic IPs → add `0.0.0.0/0` (Allow Access from Anywhere).

## 4. What's in this release

- **Interactive 3D craft carousels** on the homepage — Blaze (clapperboard) + Kolasi (disco ball) hubs with the real work cards orbiting them. Lazy-loaded (three.js/R3F kept out of the initial JS bundle), with cinematic post-processing (bloom/vignette) + a self-hosted HDRI. Reduced-motion + mobile fallbacks included.
- **Header:** EN/FR language pill + inline light/dark theme toggle (moved out of the dropdown).
- **Typography:** de-italicized site-wide (upright serif); cinematic dark heroes in both themes.
- **Content/cleanup:** removed the Press Kit + Journal pages, dead code, and orphaned CMS collections (Posts, Pages, PricingFactors, Testimonials, PressKit).
- **CSP:** `connect-src` now allows `blob:` (required so three.js can load 3D textures).

## 5. Media hosting — important context

- **Most images + all videos now ship *in the repo*** under `public/assets/` (committed, force-added past `.gitignore`) → served directly by Vercel. Images were compressed (~138 MB → ~13 MB); videos are committed as-is (~177 MB).
- **23 assets still load from a separate Cloudinary account** (`dwayr9ynb`) via public URLs. These display fine but live on a **colleague's** account (not controlled here).
- **Future migration is prepped:** when a controlled Cloudinary account is available, run `node --import tsx scripts/host-media-on-cloudinary.mjs` (with real creds in `.env`), then the `cloudinaryVideoId` wiring can be pointed at it. That will also let us drop the ~177 MB of video from git and slim the repo.

## 6. Post-deploy verification

After the deploy goes live, spot-check:
- **Homepage** — hero video, the two 3D carousels (Blaze + Kolasi) render and play, brand logos show, Trusted-by logos show.
- **Blaze / Kolasi / About / Venues** — pages load; images and videos display (no broken media).
- **/admin** — Payload CMS dashboard loads and connects to MongoDB.
- **Browser console** — clean (the CSP `blob:` and SSR-hydration fixes are included).

## 7. First-time production setup (if not already done)

Production first-admin bootstrap is disabled — create the initial Payload admin in a controlled setup step, then manage all other users from `/admin`.
