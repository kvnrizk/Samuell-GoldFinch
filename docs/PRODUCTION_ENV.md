# Production Environment

No secret values belong in this file. Never commit `.env`.

## Required For Production Boot

| Variable | Scope | Service | Notes |
|---|---|---|---|
| `DATABASE_URI` | Server-only | MongoDB Atlas | Must include the database name, for example `/sg-platform`, and valid credentials. |
| `PAYLOAD_SECRET` | Server-only | Payload CMS | Used for Payload auth/session signing. Rotate if previously exposed. |
| `NEXT_PUBLIC_SITE_URL` | Public | Next.js/Payload | Production canonical URL, for example the primary domain. |

These are validated when `NODE_ENV=production`.

## Required For Production Features

| Variable | Scope | Service | Feature |
|---|---|---|---|
| `CRON_SECRET` | Server-only | Vercel Cron | Required for `/api/cron/process-sequences`; route fails closed when missing. |
| `RESEND_API_KEY` | Server-only | Resend | Contact, quote, venue emails, and password reset delivery. |
| `CLOUDINARY_CLOUD_NAME` | Server-only | Cloudinary | Payload media upload/delete URL generation. |
| `CLOUDINARY_API_KEY` | Server-only | Cloudinary | Payload media upload/delete. |
| `CLOUDINARY_API_SECRET` | Server-only | Cloudinary | Payload media upload/delete. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public | Cloudinary | Public Cloudinary image URLs. |
| `MUX_TOKEN_ID` | Server-only | Mux | Upload scripts and Mux asset management. |
| `MUX_TOKEN_SECRET` | Server-only | Mux | Upload scripts and Mux asset management. |
| `SAM_WHATSAPP_NUMBER` | Server-only | Notifications | Admin WhatsApp fallback when CMS global is empty. |
| `TWILIO_ACCOUNT_SID` | Server-only | Twilio | WhatsApp sending. |
| `TWILIO_AUTH_TOKEN` | Server-only | Twilio | WhatsApp sending. |
| `TWILIO_WHATSAPP_FROM` | Server-only | Twilio | WhatsApp sender number. |

## Optional Public Analytics

| Variable | Scope | Service | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_GA4_ID` | Public | Google Analytics | Enables GA4 when set. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Public | Meta Pixel | Enables Meta Pixel when set. |

## Local/Script-Only Variables

These are not required by the web app runtime:

| Variable | Scope | Used By |
|---|---|---|
| `PAYLOAD_URL` | Local/script-only | Lead-score and sequence scripts. |
| `PAYLOAD_EMAIL` | Local/script-only | Lead-score and sequence scripts. |
| `PAYLOAD_PASSWORD` | Local/script-only | Lead-score and sequence scripts. |
| `PAYLOAD_PUBLIC_SERVER_URL` | Local/script-only | Seed script target URL. |
| `PAYLOAD_ADMIN_EMAIL` | Local/script-only | Seed script login. |
| `PAYLOAD_ADMIN_PASSWORD` | Local/script-only | Seed script login. |

## MongoDB Atlas Checklist

- Use a dedicated database user for this project.
- Put the database name in `DATABASE_URI`, not only the cluster URL.
- Verify username/password in Atlas before deployment.
- Allow Vercel serverless access in Atlas Network Access.
- Rotate any credential that was ever pasted in chat, screenshots, tickets, or docs.
- Test `/admin` and form persistence against the production database before launch.

## Vercel Checklist

- Add variables in Vercel Project Settings > Environment Variables.
- Set production values separately from preview/development values.
- Keep all server-only variables out of `NEXT_PUBLIC_*`.
- Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
- Configure the Vercel Cron job with the same `CRON_SECRET` used by the route.
- Redeploy after changing environment variables.

## Admin Provisioning

Production unauthenticated first-admin bootstrap is disabled. Create the first production admin through a controlled setup flow before launch, then manage users from `/admin` with Payload authentication.

## Rotation Reminder

Rotate MongoDB, Payload, Resend, Cloudinary, Mux, Twilio, and cron secrets before production if any value was ever exposed outside the secure provider dashboard.
