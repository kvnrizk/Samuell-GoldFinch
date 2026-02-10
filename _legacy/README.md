# Samuell Goldfinch - Portfolio Website

Personal and business portfolio for **Samuell Goldfinch**, a Paris-based creative director, filmmaker, and international DJ. The site showcases two ventures: **Blaze Production** (cinematic film & photography) and **Kolasi Agency** (DJ booking, event curation & content creation).

**Live domain:** `samuellgoldfinch.com`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Static HTML (no framework, no build step) |
| Styling | Tailwind CSS (CDN, injected at runtime) + custom CSS (`css/main.css`) |
| Animations | GSAP 3 + ScrollTrigger (CDN) |
| Fonts | Google Fonts — Inter (sans) + Playfair Display (serif) |
| Forms | Formspree (two endpoints for contact & quote submissions) |
| Page transitions | Barba.js (included but currently disabled) |

---

## Project Structure

```
Samuell-Goldfinch-main/
|
|-- index.html              # Homepage
|-- blaze.html              # Blaze Production page
|-- kolasi.html             # Kolasi Agency page
|-- about.html              # About / bio page
|-- contact.html            # Contact form + info
|-- quote.html              # Bespoke quote request form
|-- AUDIT.md                # Code audit notes
|
|-- css/
|   |-- main.css            # Primary stylesheet (~1500+ lines)
|                             - CSS custom properties (palette, spacing, theme tokens)
|                             - Dark / light theme via html.dark / html.light
|                             - Page-scoped styles (.blaze-page, .kolasi-page, etc.)
|                             - Component styles (header, nav, hero, carousel, lightbox,
|                               cards, gallery, trusted logos, forms)
|                             - Responsive breakpoints (640px, 767px, 1024px)
|
|-- js/
|   |-- theme-bootstrap.js  # Runs first — applies stored theme before paint (prevents FOUC)
|   |-- main.js             # Core shared module loaded on every page
|   |                         - Tailwind CDN injection
|   |                         - Theme toggle (light/dark, localStorage)
|   |                         - Mobile hamburger nav overlay
|   |                         - Custom cursor (smooth-follow dot, hidden on touch)
|   |                         - Orbit carousel system (prev/next/swipe/keyboard/autoplay)
|   |                         - Lazy video loading (IntersectionObserver + retry logic)
|   |                         - Lazy image loading
|   |                         - Video play/pause controls
|   |                         - Section reveal ([data-reveal] -> .is-visible)
|   |                         - Header/main padding sync
|   |                         - Mobile viewport class
|   |                         - GSAP scroll animations
|   |-- home.js             # Homepage only
|   |                         - Cinematic video modal (GSAP transitions, focus trap)
|   |                         - Hero title/subtitle GSAP animations
|   |                         - Hero poster-to-video reveal
|   |                         - iOS mobile hero video fallback
|   |-- blaze.js            # Blaze page only
|   |                         - Gallery image classification (portrait/landscape/square)
|   |                         - Full-screen lightbox (prev/next/keyboard)
|   |                         - Dynamic import of heroAutoplay.js
|   |-- kolasi.js           # Kolasi page only
|   |                         - Hero video force-play with fallbacks
|   |                         - Showcase video click/keyboard controls
|   |                         - Custom loop points (data-loop-end)
|   |                         - Offscreen pause observer
|   |-- heroAutoplay.js     # ES module — hero video autoplay
|                             - IntersectionObserver-based play/pause
|                             - Respects prefers-reduced-motion & slow connections
|                             - Pauses on tab hidden
|
|-- assets/
|   |-- favicon.png
|   |-- icon-instagram.png
|   |-- Elie_saab_logo.webp
|   |-- mipim logo.webp
|   |-- stouth_beirut_logo.webp
|   |
|   |-- about/
|   |   |-- IMAGE_PORTRAIT.webp
|   |   |-- IMG_5840.JPG            # Main portrait
|   |
|   |-- blaze/
|   |   |-- LOGO_BLAZE.png
|   |   |-- IMG_6050.JPG
|   |   |-- art direction1.mp4
|   |   |-- ambassy/                 # Embassy of Lebanon event (19 photos)
|   |   |-- stouh_beirut/            # STOUH Beirut rooftop event (11 photos)
|   |   |-- weddings/               # Wedding photos (30+) + BLAZE_WEDDINGS_Demoreel.mp4
|   |   |-- editorial_and_brand/    # Editorial photos (4 images)
|   |   |-- events/                 # Transdev logo + aftermovie video
|   |   |-- cloudinary_uploaded/    # Compressed image uploads
|   |
|   |-- kolasi/
|   |   |-- LOGO KOLASI.png
|   |   |-- panorama voitture.mp4
|   |   |-- kate zubok festival chantilly.mp4
|   |   |-- artists/                # DJ/artist photos + video clips
|   |   |-- events/                 # Event footage (2nd Sun, etc.)
|   |   |-- images/                 # Venue and event stills
|   |   |-- speakeasy/              # Le Speakeasy photos
|   |   |-- Speakeasy_Ads/          # 3 promo videos
|   |
|   |-- css/
|   |   |-- style.css               # Legacy/unused stylesheet
|   |
|   |-- fonts/
|       |-- Inter.woff2
|       |-- PlayfairDisplay.woff2
```

---

## Pages Overview

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero video, featured gallery carousel, Blaze & Kolasi highlights, trusted collaborations, CTA |
| Blaze | `blaze.html` | Full-screen video hero, manifesto, 4 image carousels (STOUH Beirut, Embassy, Weddings, Editorial) |
| Kolasi | `kolasi.html` | Video hero, manifesto, 3 expertise video cards, showcase clips, services list, photo gallery |
| About | `about.html` | Bio, portrait, milestones timeline, artist statement, notable credits |
| Contact | `contact.html` | Contact form (Formspree), direct email/phone, Instagram links, response promise |
| Quote | `quote.html` | Detailed quote request form (Formspree) with service selector, date, guests, budget fields |

---

## How It Works

### Theme System
- `theme-bootstrap.js` runs synchronously before CSS loads to apply the stored theme (`dark` by default), preventing flash of unstyled content
- `main.js` manages the full toggle: clicking the theme button switches between `html.dark` and `html.light` classes and persists to `localStorage`
- All styling is driven by CSS custom properties under `:root` and `html.dark`

### Video Loading
- Videos use `data-src` or `data-video` attributes instead of `src`
- An `IntersectionObserver` in `main.js` injects the source and triggers playback only when the video scrolls into view
- Autoplay has retry logic (up to 4 attempts with increasing delays)
- Videos marked with `.no-pause` or `data-kolasi-autoplay` are exempt from pause-on-scroll

### Orbit Carousel
- A reusable carousel component driven by `[data-orbit-carousel]` data attributes
- Supports autoplay (configurable interval via `data-autoplay-interval`), prev/next buttons, swipe/drag, and keyboard arrows
- Slides rotate through `is-active`, `is-left`, `is-right`, and `is-off` CSS classes for 3D-style transitions

### Forms
- Contact form submits to `https://formspree.io/f/xdkozlvy`
- Quote form submits to `https://formspree.io/f/maylwjpq`
- Quote form uses async `fetch` with client-side validation and status feedback

---

## Running Locally

No build step required. Serve the `Samuell-Goldfinch-main/` directory with any static file server:

```bash
# Using npx (Node.js)
npx serve Samuell-Goldfinch-main -l 3000

# Using Python
cd Samuell-Goldfinch-main
python -m http.server 3000

# Using PHP
cd Samuell-Goldfinch-main
php -S localhost:3000
```

Then open `http://localhost:3000` in your browser.

---

## External Dependencies (CDN)

- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS framework (injected at runtime)
- [GSAP 3 + ScrollTrigger](https://greensock.com/gsap/) — scroll-driven animations
- [Google Fonts](https://fonts.google.com/) — Inter & Playfair Display
- [Formspree](https://formspree.io/) — form submission backend
