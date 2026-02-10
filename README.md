# Samuell Goldfinch — Portfolio Platform

Full-service portfolio and CMS platform for Samuell Goldfinch — artistic director, DJ, and event curator based in Paris. Built with Next.js 15, Payload CMS v3, Tailwind CSS v4, and GSAP animations.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 15 (App Router)             |
| CMS         | Payload CMS v3 (integrated)         |
| Database    | MongoDB Atlas (free tier)           |
| Styling     | Tailwind CSS v4                     |
| Animations  | GSAP 3 + ScrollTrigger              |
| Language    | TypeScript 5                        |

## Project Structure

```
app/
  (site)/              # Public-facing pages
    page.tsx           # Homepage
    blaze/             # Blaze Production page
    kolasi/            # Kolasi Agency page
    about/             # About page
    contact/           # Contact form
    quote/             # Quote request form
    layout.tsx         # Site layout (header + footer)
  (payload)/           # Payload CMS admin panel
    admin/             # Admin catch-all route
    layout.tsx         # Admin layout
  api/
    [...payload]/      # Payload REST API routes
  layout.tsx           # Root layout
  globals.css          # Global styles
collections/           # Payload CMS collection configs
globals/               # Payload CMS global configs
components/
  layout/              # Header, Footer
  ui/                  # OrbitCarousel, ThemeToggle, etc.
lib/                   # Utilities (gsap-utils, cloudinary, etc.)
public/
  assets/              # Static images and videos
payload.config.ts      # Payload CMS configuration
```

## Prerequisites

- **Node.js** 18+ (recommended: 22 LTS)
- **npm** 9+
- A **MongoDB Atlas** account (free tier works)

## First-Time Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Samuell-Goldfinch-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas (free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account
2. Create a new project and a **free M0 cluster**
3. Choose a region close to you (e.g. AWS eu-west-3 for Paris)
4. Create a database user (remember the username and password)
5. Under **Network Access**, add your IP address (or "Allow Access from Anywhere" for development)
6. Click **Connect** > **Drivers** > **Node.js** and copy the connection string

### 4. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and replace the `DATABASE_URI` with your MongoDB Atlas connection string:

```env
DATABASE_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/sg-platform?retryWrites=true&w=majority
```

The `PAYLOAD_SECRET` is already generated. The other services (Cloudinary, Mux, Resend) are optional for local development.

### 5. Start the development server

```bash
npm run dev
```

The site will start at **http://localhost:3000** (or the next available port).

### 6. Create your admin account

Go to **http://localhost:3000/admin** and create your first admin user. This gives you access to the Payload CMS dashboard where you can manage all content.

## Available Scripts

| Command                | Description                              |
|------------------------|------------------------------------------|
| `npm run dev`          | Start development server                 |
| `npm run build`        | Build for production                     |
| `npm start`            | Start production server                  |
| `npm run lint`         | Run ESLint                               |
| `npm run generate:types` | Generate Payload TypeScript types      |

## Pages

| Route      | Description                                        |
|------------|----------------------------------------------------|
| `/`        | Homepage — hero video, featured sets, collaborations |
| `/blaze`   | Blaze Production — cinematic wedding films, editorial |
| `/kolasi`  | Kolasi Agency — DJ booking, event curation         |
| `/about`   | About Samuell Goldfinch                            |
| `/contact` | Contact form                                       |
| `/quote`   | Quote request form                                 |
| `/admin`   | Payload CMS admin dashboard                        |

## CMS Collections

The admin panel at `/admin` manages these content types:

- **Users** — Admin accounts
- **Media** — Uploaded images and files
- **Blaze Projects** — Portfolio projects for Blaze Production
- **Kolasi Events** — Events managed by Kolasi Agency
- **Artists** — DJ and performer profiles
- **Milestones** — Career milestones and achievements
- **Inquiries** — Contact form submissions
- **Pages** — Dynamic page content

## Environment Variables Reference

| Variable                          | Required | Description                        |
|-----------------------------------|----------|------------------------------------|
| `DATABASE_URI`                    | Yes      | MongoDB Atlas connection string    |
| `PAYLOAD_SECRET`                  | Yes      | Secret for Payload auth tokens     |
| `CLOUDINARY_CLOUD_NAME`          | No       | Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`             | No       | Cloudinary API key                 |
| `CLOUDINARY_API_SECRET`          | No       | Cloudinary API secret              |
| `MUX_TOKEN_ID`                   | No       | Mux video token ID                 |
| `MUX_TOKEN_SECRET`               | No       | Mux video token secret             |
| `RESEND_API_KEY`                 | No       | Resend email API key               |
| `NEXT_PUBLIC_SITE_URL`           | No       | Public site URL                    |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No    | Cloudinary name (client-side)      |

## Troubleshooting

**Port already in use**: Next.js will automatically pick the next available port. Check the terminal output for the actual URL.

**Admin panel not loading**: Make sure your `DATABASE_URI` in `.env` is correct and your MongoDB Atlas cluster is running. Check that your IP is whitelisted in Atlas Network Access.

**Images not loading**: All static assets must be in the `public/assets/` directory. The dev server only serves files from `public/`.
