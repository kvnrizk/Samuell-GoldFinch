# Samuell Goldfinch Platform

Next.js 15 + Payload CMS 3 + MongoDB Atlas + Tailwind CSS 4 + GSAP

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS 3 (embedded in Next.js) |
| Database | MongoDB Atlas (cloud-hosted) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animations | GSAP + ScrollTrigger |
| Images | Cloudinary CDN + next/image |
| Video | Mux (HLS adaptive streaming) |
| Email | Resend |
| Deployment | Vercel |

> **No Render needed.** Everything runs on Vercel + cloud services. No separate backend server.

## Prerequisites

- **Node.js 18+** (recommended: 20 LTS)
- **npm** (comes with Node.js)
- That's it. No Docker, no local MongoDB, no separate servers.

---

## Getting Started (5 steps)

### 1. Clone the repo

```bash
git clone <repo-url>
cd Samuell-Goldfinch-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

**Ask Kevin for the real values** to paste into `.env`. Do not create new service accounts.

For **frontend-only work**, you only need these 3 to run:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URI` | Ask Kevin (MongoDB Atlas connection string) |
| `PAYLOAD_SECRET` | Ask Kevin (random 64-char hex string) |
| `NEXT_PUBLIC_SITE_URL` | Set to `http://localhost:3000` |

Everything else is optional for local frontend dev — the site renders with static fallback data if services are unavailable.

### 4. Run the dev server

```bash
npm run dev
```

- Website: [http://localhost:3000](http://localhost:3000)
- CMS Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. (First time only) Create an admin user

Go to [http://localhost:3000/admin](http://localhost:3000/admin) and create your account when prompted.

---

## All Environment Variables

| Variable | Required | What it does |
|----------|----------|-------------|
| `DATABASE_URI` | Yes | MongoDB Atlas connection string |
| `PAYLOAD_SECRET` | Yes | Payload CMS auth token signing |
| `CLOUDINARY_CLOUD_NAME` | For images | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For images | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | For images | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | For images | Same value as `CLOUDINARY_CLOUD_NAME` |
| `MUX_TOKEN_ID` | For video | Mux streaming token |
| `MUX_TOKEN_SECRET` | For video | Mux streaming secret |
| `RESEND_API_KEY` | For email | Resend transactional email |
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` locally, production URL on Vercel |
| `NEXT_PUBLIC_GA4_ID` | Optional | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Meta/Facebook pixel ID |

---

## Common Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run build` | Production build (checks for type errors) |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint |
| `npm run generate:types` | Regenerate `payload-types.ts` after changing collections/globals |
| `npm run seed` | Seed the database with sample data |

---

## Project Structure

```
app/
  (site)/                    # All public pages
    HomeClient.tsx            # Homepage
    layout.tsx                # Site layout (header, footer, audio player, etc.)
    blaze/                    # Blaze Production (film & photography)
      BlazeClient.tsx
      [slug]/                 # /blaze/stouh-beirut etc.
    kolasi/                   # Kolasi Agency (DJ booking & events)
      KolasiClient.tsx
      [slug]/                 # /kolasi/le-speakeasy etc.
      artists/[slug]/         # /kolasi/artists/kate-zubok etc.
    about/                    # About page
    contact/                  # Contact form
    quote/                    # Multi-step quote wizard
    venues/                   # For Venues page
    journal/                  # Blog (listing + [slug] detail)
    showreel/                 # Video showreel
    press/                    # Press kit + downloads
  (payload)/                  # Payload CMS admin UI (auto-generated, don't edit)

collections/                  # CMS data models (one file per collection)
globals/                      # CMS globals (single-instance settings)
components/
  layout/                     # Header.tsx, Footer.tsx
  ui/                         # VideoPlayer, AudioPlayer, TestimonialCarousel, etc.
  providers/                  # React Context providers (AudioPlayerProvider)
lib/
  fetchers.ts                 # All server-side CMS data fetching
  gsap-utils.ts               # GSAP setup + helpers
  payload.ts                  # Payload client singleton
public/assets/                # Static images (fallback, migrating to Cloudinary)
```

---

## How the Code Works

### Pages use static fallbacks

Every page tries CMS first, then falls back to hardcoded data. Example from any page.tsx:

```tsx
let projects = staticFallbackData;
try {
  const cmsData = await getAllBlazeProjects();
  if (cmsData.length) projects = cmsData;
} catch { /* CMS unavailable, use fallback */ }
```

This means the site **always works** even with an empty database.

### Styling / Theming

Dark/light mode via CSS custom properties:

- `var(--bg)` — page background
- `var(--text)` — primary text
- `var(--text-dim)` — secondary text
- `var(--text-mute)` — muted/subtle text
- `var(--border)` — border color
- `var(--bg-card)` — card background
- Gold accent: `#c8a96e`

### Videos

Always use the `<VideoPlayer>` component, never raw `<video>` tags:

```tsx
import VideoPlayer from '@/components/ui/VideoPlayer';

// Mux streaming (preferred):
<VideoPlayer muxPlaybackId="abc123" autoPlay loop muted mode="hero" />

// Local MP4 fallback:
<VideoPlayer src="/assets/video.mp4" autoPlay loop muted mode="hero" />
```

### Images

Always use `next/image`, never `<img>`:

```tsx
import Image from 'next/image';

<Image src="/assets/photo.jpg" alt="..." fill sizes="100vw" className="object-cover" />
```

### Animations

GSAP with ScrollTrigger. Pattern:

```tsx
useGSAP(() => {
  if (prefersReducedMotion()) return;
  gsap.from('.reveal-up', { y: 40, opacity: 0, stagger: 0.15, scrollTrigger: { trigger: el, start: 'top 85%' } });
}, { scope: containerRef });
```

---

## Deployment (Vercel)

No additional servers needed. Vercel handles everything:
- Next.js frontend + API routes
- Payload CMS admin panel
- Serverless functions
- Image optimization via next/image

### Steps to deploy:

1. Push code to GitHub
2. Connect repo to Vercel
3. Add all `.env` variables in Vercel dashboard: **Settings > Environment Variables**
4. Set `NEXT_PUBLIC_SITE_URL` to production domain (e.g. `https://samuellgoldfinch.com`)
5. Deploy

### MongoDB Atlas: whitelist Vercel IPs

In MongoDB Atlas dashboard: **Network Access > Add IP Address > Allow Access from Anywhere** (`0.0.0.0/0`). This is needed because Vercel serverless functions use dynamic IPs.

---

## Team Access — Adding New Users to the Dashboard

Only admins can create accounts. There is no public signup or registration page.

### How to create an account for a team member

1. Log in at `/admin` with your admin credentials
2. Click **Users** in the sidebar
3. Click **Create New**
4. Fill in:
   - **Email** — their email address
   - **Password** — a strong temporary password (they can change it later)
   - **Name** — their full name
   - **Role** — `Editor` (can create/edit) or `Admin` (full access including delete & user management)
5. Click **Save**

### What to send the team member

> **Your CMS login is ready**
>
> 1. Go to: `https://yourdomain.com/admin`
> 2. Enter your email: `their-email@example.com`
> 3. Enter the password I sent you
> 4. Once logged in, you can change your password in the top-right menu
>
> You'll see the dashboard with KPIs, recent inquiries, and the sidebar to manage all content (Projects, Events, Artists, Blog, etc.)

### Roles explained

| Role | Create/Edit | Delete content | Manage users |
|------|------------|----------------|-------------|
| **Editor** | Yes | No | No |
| **Admin** | Yes | Yes | Yes |

### Password Reset

Team members can click **"Forgot password?"** on the login page. Requires Resend email to be configured.

---

## Securing the Admin URL in Production

The `/admin` route is protected by Payload's built-in authentication (email + password). To add extra security:

### Option 1: Custom admin route (recommended)

Change the admin path from `/admin` to something harder to guess. In `payload.config.ts`:

```ts
admin: {
  user: Users.slug,
  routes: {
    admin: '/sg-dashboard-2026',  // Change this to whatever you want
  },
}
```

Then access the dashboard at `https://yourdomain.com/sg-dashboard-2026` instead of `/admin`.

### Option 2: IP allowlist via Vercel middleware

Block `/admin` access except from specific IPs. Already partially configured in `middleware.ts`.

### Option 3: HTTP Basic Auth layer (Vercel)

Add a password gate before the login page using Vercel's built-in password protection (available on Pro plan).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Cannot connect to database" | Check `DATABASE_URI` in `.env`. Whitelist your IP in MongoDB Atlas > Network Access |
| Videos not playing | Mux credentials missing — videos fall back to local MP4s. MP4 files are git-ignored, ask Kevin for them |
| Images broken | Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set. Static images in `public/assets/` work without Cloudinary |
| CMS admin blank | Make sure `DATABASE_URI` and `PAYLOAD_SECRET` are set. Go to `/admin` to create first user |
| Build fails on types | Run `npm run generate:types` after modifying collections/globals |
| Port 3000 in use | Kill the process or use `npm run dev -- -p 3001` |
