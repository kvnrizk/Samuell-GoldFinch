# Samuell Goldfinch — CMS Usage Guide

## Logging In

1. Go to `https://samuellgoldfinch.com/admin`
2. Enter your email and password
3. You'll see the admin dashboard with all collections listed in the sidebar

---

## Collections Overview

| Collection | Purpose |
|---|---|
| **Blaze Projects** | Film & content production portfolio pieces |
| **Kolasi Events** | DJ events, club nights, venue showcases |
| **Artists** | DJ roster for Kolasi Agency |
| **Milestones** | Career timeline entries (About page) |
| **Inquiries** | Contact & quote form submissions |
| **Venue Inquiries** | Venue partnership form submissions |
| **Venue Packages** | Service tiers for venue partnerships |
| **Case Studies** | Venue success stories |
| **Venue FAQ** | Frequently asked questions (Venues page) |
| **Venue SEO Pages** | SEO landing pages under /venues/[slug] |
| **Pages** | Static page metadata |
| **Media** | All uploaded images (auto-stored in Cloudinary) |

---

## Adding a New Blaze Project

1. Sidebar → **Blaze Projects** → **Create New**
2. Fill in the required fields:
   - **Title**: Project name (e.g., "Stouth Beirut Launch Film")
   - **Slug**: URL-friendly version (auto-generated from title, or customize)
   - **Category**: Select from `wedding`, `editorial`, `event`, `brand`
3. **Hero Video**: Paste the Mux Playback ID (see Video Upload section below)
4. **Gallery**: Click "Add Gallery Item" → Upload images through the Media picker
5. **Featured**: Toggle ON to show this project on the homepage carousel
6. Click **Save** → changes appear on the site within 60 seconds

## Adding a New Kolasi Event

1. Sidebar → **Kolasi Events** → **Create New**
2. Fill in:
   - **Name**: Event title
   - **Venue**: Where it takes place
   - **Date**: Event date
   - **Description**: Short summary
3. **Gallery**: Add photos from the event
4. **Showcase Video**: Paste the Mux Playback ID for the highlight reel
5. Click **Save**

## Editing Text on Any Page

Most page text comes from the client-side components. To update dynamic text:

1. Sidebar → **Global Settings**
2. Edit fields like:
   - **Site description**
   - **Footer tagline**
   - **Contact email / phone**
   - **Instagram URLs** (main, Kolasi, Blaze)
   - **Calendly URL** for venue discovery calls
   - **WhatsApp number**
3. Click **Save**

For About page milestones:
1. Sidebar → **Milestones** → Edit existing or create new
2. Each milestone has a **name**, **title**, and **description**

## Changing SEO Metadata

Every collection with a slug has SEO fields:

1. Open any entry (e.g., a Blaze Project)
2. Scroll to the **SEO** section (if available):
   - **SEO Title**: Override the page title tag
   - **SEO Description**: Override the meta description
   - **OG Image**: Upload a custom 1200×630 image for social sharing
3. Click **Save**

---

## Managing Inquiries

### Viewing New Inquiries

1. Sidebar → **Inquiries** (for contact/quote submissions)
2. Sidebar → **Venue Inquiries** (for venue partnership applications)

### Updating Status

1. Click on an inquiry to open it
2. Change the **Status** field:
   - `new` → Just submitted
   - `contacted` → You've reached out
   - `booked` → Deal confirmed
   - `closed` → Completed or declined
3. Add **Internal Notes** for your records
4. Click **Save**

### Exporting to CSV

1. From the collection list view, use the **Export** button in the toolbar
2. Select the fields you want to export
3. Download as CSV for bookkeeping

---

## Video Upload Workflow (Mux)

### Step 1: Upload to Mux

1. Go to [dashboard.mux.com](https://dashboard.mux.com)
2. Navigate to **Video** → **Assets** → **Create New Asset**
3. Upload your `.mp4` file
4. Wait for the status to show **Ready** (usually 1–5 minutes)

### Step 2: Get the Playback ID

1. Click on the asset in Mux dashboard
2. Find the **Playback ID** (looks like: `DS00FP9hQWc01AI6ZSXW5nRVuG2IiGJE9s`)
3. Copy it

### Step 3: Add to CMS

1. In Payload admin, edit the relevant project or event
2. Paste the Playback ID into the **muxPlaybackId** or **Hero Video** field
3. Click **Save**
4. The video will appear on the site within 60 seconds (ISR revalidation)

### Recommended Video Specs

| Context | Resolution | Format | Duration |
|---|---|---|---|
| Hero background | 1920×1080 | H.264 MP4 | 10–30s |
| Project showcase | 1920×1080 | H.264 MP4 | Any |
| Event highlight | 1080×1920 (vertical) or 1920×1080 | H.264 MP4 | 15–60s |

---

## Image Upload Workflow (Cloudinary)

### Option A: Upload Through Payload (Recommended)

1. In Payload admin, go to **Media** → **Create New**
2. Drop or select your image file
3. The image is automatically uploaded to Cloudinary
4. Use the Media picker in any collection to reference it

### Option B: Upload Directly to Cloudinary

1. Go to [console.cloudinary.com](https://console.cloudinary.com)
2. Navigate to **Media Library**
3. Upload to the `sg-platform/` folder
4. Note the public ID for manual reference

### Recommended Image Dimensions

| Context | Size | Format |
|---|---|---|
| Hero / Cover | 1920 × 1080 px | JPG or WebP |
| Gallery item | 1200 × 800 px | JPG or WebP |
| Portrait / Artist photo | 800 × 1200 px | JPG or WebP |
| Logo / Brand mark | 600 × 300 px | PNG (transparent) |
| OG / Social sharing | 1200 × 630 px | JPG |

---

## Emergency Contacts

| Service | Status Page | Action |
|---|---|---|
| **Website down** | [vercel.com/dashboard](https://vercel.com) | Check deployment status, recent builds |
| **Vercel** | [vercel-status.com](https://vercel-status.com) | Platform status |
| **Mux (videos)** | [status.mux.com](https://status.mux.com) | Video delivery status |
| **Cloudinary (images)** | [status.cloudinary.com](https://status.cloudinary.com) | Image CDN status |
| **MongoDB (database)** | [status.cloud.mongodb.com](https://status.cloud.mongodb.com) | Database status |

### If the site is down:

1. Check [Vercel dashboard](https://vercel.com) for deployment errors
2. Check DNS (is the domain pointing to Vercel?)
3. Check the status pages above for service outages
4. Contact your developer

---

## Quick Reference

- **Admin panel**: `https://samuellgoldfinch.com/admin`
- **Site URL**: `https://samuellgoldfinch.com`
- **Changes appear**: Within 60 seconds (ISR revalidation)
- **Contact email**: `contact@samuellgoldfinch.com`
- **Content is cached**: If you don't see changes, wait 60 seconds or hard-refresh (Ctrl+Shift+R)
