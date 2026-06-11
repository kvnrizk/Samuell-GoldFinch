# Sam — Action Items

Written 2026-04-15 after backend hardening pass (commit `212812d`).

These are things only Sam can provide or decide. Each item is a blocker for going from "works in dev" to "fully live and clean."

---

## 1. Set missing Vercel environment variables

Go to Vercel dashboard → `samuell-gold-finch` → Settings → Environment Variables. Add these for the **Production** environment (and optionally Preview / Development):

| Variable | Value | Why |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://samuellgoldfinch.com` | Payload uses this to generate absolute URLs in emails and admin previews. Without it, links fall back to `localhost:3000`. |
| `CRON_SECRET` | Generate a random 32+ char string (`openssl rand -hex 32`) | Gates `/api/cron/process-sequences`. The endpoint now refuses to run if this is unset, so automation is currently disabled in prod until you set it. Also configure the same value in the Vercel cron job settings. |
| `NEXT_PUBLIC_GA4_ID` | Your GA4 measurement ID (format: `G-XXXXXXXXXX`) | Analytics are already wired up — they just need your ID. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Your Meta (Facebook) Pixel ID | Same — wired up, needs your ID. |
| `SAM_WHATSAPP_NUMBER` *(optional)* | `+33605883966` or your current one, E.164 format | Fallback if `global-settings.whatsappNumber` is empty. Currently uses the value stored in the CMS global. |

After adding, **redeploy** so the new env vars are picked up.

---

## 2. Provide a new portrait photo

**File:** `IMAGE_PORTRAIT.webp` (the original is corrupt and couldn't be uploaded to Cloudinary).
**Needed:** A clean, high-res portrait — minimum 1200×1600 px, ideally shot vertically for the About page hero.
Deliver as a single file in any common format (jpg, png, webp). Drop it in `Samuell-Goldfinch-main/public/assets/` or email to Kevin. It'll be uploaded to Cloudinary and swapped in automatically.

---

## 3. Provide a logo file for SEO metadata

**Current fallback:** `components/JsonLd.tsx` points structured data at the existing `/og-image.png` so validators do not fail on a missing asset.
**Needed:** Your "Samuell Goldfinch" wordmark/icon as a **1200×630 PNG** on a transparent background (or dark background matching the site).
Once delivered, replace the temporary structured-data image with the final brand asset. Same delivery method as above.

---

## 4. Enter real CMS content via `/admin`

Sign in at `https://samuellgoldfinch.com/admin?secret=<ADMIN_ACCESS_SECRET>` (grab the secret from `.env` — Kevin has it).

Priority order — each is a fallback replaced by real data:

1. **Global Settings** (Settings → Global Settings) — confirm phone, email, WhatsApp, Calendly URL, social links are current.
2. **Press Kit** (Content → Press Kit) — short / medium / full bio, brand logos (SVG/PNG), press photos with credit, media appearances.
3. **Showreel** (Content → Showreel) — hero reel Mux playback ID + the 4-6 highlight clips per category.
4. **Blaze Projects, Kolasi Events, Artists** — real content instead of the seed placeholders. Each has galleries, Mux IDs, and related fields.
5. **Venue Packages, Case Studies, FAQ, Pricing Factors** — for the /venues funnel.
6. **Journal Posts** (Content → Posts) — at least 5 to fill the /journal index.
7. **Testimonials** (Content → Testimonials) — tagged per brand (blaze / kolasi / venues).

Everything you don't fill in falls back to hard-coded placeholder content — so the site looks fine either way, but the real version is richer.

---

## 5. Automation — decide which sequences you actually want

The CRM automation layer is functional but there are no `AutomationSequences` configured yet. Go to `/admin` → Automation → Automation Sequences and think about which of these you want to run:

**Suggestions** (each is one `AutomationSequence` document):

| Name | Trigger | Delay | Channel | Audience |
|---|---|---|---|---|
| "New lead — instant admin ping" | on-create, general inquiries | 0h | admin-alert + whatsapp | admin |
| "Thank-you auto-reply" | on-create, general inquiries | 0h | email | lead |
| "24h follow-up if no reply" | on-status-change (status=new) | 24h | email | lead |
| "Qualified venue — book-a-call nudge" | on-status-change (qualified) | 2h | email + whatsapp | lead |
| "Proposal follow-up" | on-status-change (proposal-sent) | 72h | email | lead |

Each row is a CMS entry. Email body supports `{{name}}`, `{{venueName}}`, `{{calendlyUrl}}`, `{{budget}}`, `{{email}}`, `{{status}}`, `{{leadScore}}` — they're substituted (and HTML-escaped) at send time.

---

## 6. Vercel KV / Upstash Redis — optional upgrade for rate limiting

Current rate-limit on form submissions (5/hr per IP) lives in each serverless instance's memory. On Vercel this means the effective limit is higher and fuzzier. For a small-traffic site this is fine; if spam becomes a problem, hook up Vercel KV and swap the Map in `middleware.ts`. Cost: ~$0.20/mo.

---

## 7. Custom domain — double-check once more

Everything looks good from the 2026-02-18 deploy, but please verify by visiting (in a fresh incognito window):

- https://samuellgoldfinch.com (should load the site)
- https://www.samuellgoldfinch.com (should 301 to the root domain)
- https://samuellgoldfinch.com/admin?secret=... (should load the Payload admin)
- https://samuellgoldfinch.com/api/globals/global-settings (should return JSON)

Any one of these failing = DNS/SSL regressed.

---

## Status legend

When an item is done, strike it through (~~like this~~) so we can see what's left at a glance. Kevin will update this file as items close.
