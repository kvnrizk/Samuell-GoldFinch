# Samuell Goldfinch Cleanup Roadmap

Created 2026-06-27 on branch `Rab_FullPass`.

This is the master continuity document for the next cleanup phases. Keep it updated after every cleanup pass so the project always has a clear source of truth.

## Goal

Build a cleaner, more maintainable, high-end website for Samuell Goldfinch.

The target is not to make the site smaller or cheaper. The target is to make the site more focused, coherent, editable, and realistic for one person to maintain.

## Current State

### What Is Working

- The core brand direction is strong: cinematic, editorial, dark-first, premium.
- Next.js, Payload, MongoDB Atlas, Cloudinary, Mux, and Resend are wired.
- Public forms, admin access, Payload generation, baseline tests, and CMS-safe fallbacks exist.
- Core public routes exist: `/`, `/blaze`, `/kolasi`, `/venues`, `/quote`, `/contact`.
- French routes exist for the main translated flow: `/fr`, `/fr/venues`, `/fr/quote`, `/fr/contact`.

### Main Problems

- The public site is overloaded with too many pages, widgets, fallback sections, and optional experiences.
- The frontend has inconsistent typography, spacing, CTA rhythm, and text emphasis.
- Dark/light mode is fragile because `app/globals.css` still uses broad light-mode class overrides such as `html.light [class*="text-white"]`.
- Many colors are hardcoded directly in components instead of going through semantic tokens.
- Some UI components are too generic or overused for a premium editorial site.
- Some public proof and fallback content still risks feeling fake, demo-like, or overproduced.
- The backend/admin ecosystem is too large for one person unless every feature is actively used.
- Payload content editing is not yet simple enough for changing core page hero text, section copy, and section media from the back office.

## Non-Negotiable Rules

- Frontend design direction stays premium, cinematic, editorial, and art-directed.
- Cleanup means simpler and more coherent, not downgraded.
- Do not redesign everything at once.
- Do not delete backend collections before disabling/hiding and confirming they are unnecessary.
- Do not add a full page-builder unless explicitly requested later.
- Keep one source of truth for cleanup progress in this document.
- Every implementation phase must update this document with completed work, remaining issues, and verification results.

## Target Public Surface

The protected public surface is:

- `/`
- `/blaze`
- `/kolasi`
- `/venues`
- `/quote`
- `/contact`
- `/fr`
- `/fr/venues`
- `/fr/quote`
- `/fr/contact`

Non-core pages stay available for now, but should be hidden or de-emphasized unless they become useful:

- `/about`
- `/press`
- `/journal`
- `/showreel`
- dynamic detail pages without final real content

## Target Frontend Architecture

### Theme

Move from broad overrides to explicit semantic tokens.

Detailed audit and migration target: [`THEME-TOKEN-AUDIT.md`](./THEME-TOKEN-AUDIT.md).

Required token groups:

- Page surfaces: background, elevated, muted, overlay.
- Text: primary, secondary, muted, inverse.
- Borders: subtle, strong, accent.
- Actions: primary, secondary, ghost, danger.
- Media: overlay dark, overlay light, poster border.
- Brand accents: gold, ivory, dark, optional Kolasi accent only when intentional.

Dark mode remains the reference art direction. Light mode must be explicitly designed, not patched through global class matching.

### Components

Create or standardize small shared primitives before touching many pages:

- Section shell with consistent spacing and max width.
- Section heading/kicker treatment.
- CTA/button variants.
- Card/media frame variants.
- Editorial stat/proof treatment.
- Form field styling.

Avoid creating a large design system. Use only what reduces repetition and inconsistency on the core pages.

### Content

Hardcoded content is allowed only when it is stable:

- Brand labels.
- UI labels.
- Safe empty states.
- SEO defaults.
- Local fallback media that is intentionally curated.

Avoid hardcoded fake proof, fake testimonials, fake metrics, and demo portfolio entries.

## Target CMS Architecture

Use a simple Payload global for core page content, not a full page builder.

Recommended name: `site-content`.

Recommended tabs:

- Home
- Blaze
- Kolasi
- Venues
- Quote
- Contact

Each core page should eventually support:

- Hero eyebrow/title/intro.
- Primary CTA labels/links.
- Section headings and short body copy.
- Primary image/video/media fields for key sections.
- SEO title, description, and OG image where needed.

Keep collections for real repeatable content:

- Media
- Users
- Blaze Projects
- Kolasi Events, only if real event detail pages remain useful.
- Inquiries
- Venue Inquiries

Candidates to disable or hide before deleting:

- Automation Sequences
- Sent Notifications
- Admin dashboard widgets that are not used daily
- Pricing Factors
- Testimonials, until real proof exists
- Posts/Journal, unless Samuell commits to publishing
- Venue SEO Pages, unless SEO landing pages are actively needed
- Artists, unless artist profiles are actively needed
- Case Studies, unless real case studies are provided

## Phase Plan

### Phase 0 - Documentation Foundation

Purpose: create continuity before changing more code.

Tasks:

- Add this roadmap.
- Link this roadmap from `README.md`.
- Link this roadmap from `FRONTEND-POLISH-CHECKLIST.md`.
- Record known dirty files before implementation.

Current known dirty files before Phase 0 edits:

- `app/(site)/HomeClient.tsx`: prior landing Kolasi image swap.
- `app/globals.css`: existing user-owned changes. Do not touch until explicitly scoped.

Exit criteria:

- Roadmap exists.
- Existing docs point to it.
- No frontend or backend behavior changes.

### Phase 1 - Frontend Foundation

Purpose: make styling coherent before more page polish.

Tasks:

- Define semantic theme tokens.
- Add shared primitives for section, heading, CTA, card, and media frame.
- Migrate only the core pages.
- Keep `app/globals.css` broad light-mode overrides temporarily.
- Remove broad light-mode overrides only after replacement styles are explicit.

Exit criteria:

- Core pages can use shared tokens instead of repeated hardcoded classes.
- Dark and light mode remain usable.
- `npm run lint`, `npm run test`, and `npx tsc --noEmit --pretty false` pass.

### Phase 2 - Landing Page Editorial Pass

Purpose: make the homepage feel authored, not assembled.

Tasks:

- Tighten hero copy and CTA hierarchy.
- Clarify Blaze vs Kolasi identity.
- Reduce section density and improve spacing rhythm.
- Keep only real/approved proof.
- Make collaborations visually consistent without fake logos.
- Ensure mobile spacing and CTA wrapping are clean.

Exit criteria:

- Homepage feels clear in under 10 seconds.
- No invented proof or placeholder credibility.
- `/` and `/fr` remain aligned.

### Phase 3 - Core Page Simplification

Purpose: simplify the rest of the conversion surface.

Tasks:

- Clean `/blaze`, `/kolasi`, `/venues`, `/quote`, and `/contact`.
- Remove weak or unused sections.
- Use shared typography, section, card, button, and form styling.
- Keep routes stable.

Exit criteria:

- Core pages look like one system.
- Page density is lower without feeling empty.
- No unnecessary CMS fetches for hidden sections.

### Phase 4 - CMS Editability

Purpose: make the core site editable from the back office without a page builder.

Tasks:

- Add simple `site-content` Payload global.
- Wire core page hero text, section text, CTA labels, and key media.
- Keep safe fallbacks for missing CMS data.
- Regenerate Payload types and admin import map.
- Update docs with content editing instructions.

Exit criteria:

- Admin can update core text/media without code.
- Core pages still render with empty CMS.
- Payload generation, lint, tests, and TypeScript pass.

### Phase 5 - Backend/Admin Simplification

Purpose: reduce maintenance burden.

Tasks:

- Audit which admin collections are actually useful.
- Hide or disable unused admin surfaces first.
- Remove dashboard widgets that are not useful daily.
- Delete code only after a disabled period or explicit approval.

Exit criteria:

- Admin sidebar is smaller and easier to understand.
- No critical workflow is lost.
- Backend still supports content editing, inquiries, and media.

## Verification Gates

Run after implementation phases:

```bash
npx tsc --noEmit --pretty false
npm run lint
npm run test
```

Run before merge or production deployment:

```bash
npm run build
```

Build should be run from a non-OneDrive copy if `.next` file locking appears.

Manual QA:

- `/`
- `/fr`
- `/blaze`
- `/kolasi`
- `/venues`
- `/fr/venues`
- `/quote`
- `/fr/quote`
- `/contact`
- `/fr/contact`
- `/admin`

Check both dark and light mode.

## Continuity Log

Add entries here after each phase.

### 2026-06-27 - Phase 0 Started

- Created roadmap as the master cleanup document.
- Decision: leave `app/globals.css` untouched because it has existing user-owned changes.
- Decision: keep current uncommitted `HomeClient.tsx` image swap separate from roadmap work unless explicitly committed later.

### 2026-06-27 - Phase 1A Theme Audit

- Added `THEME-TOKEN-AUDIT.md`.
- Recorded hardcoded public-surface color usage and the semantic token target.
- Decision: add semantic tokens first, preserve compatibility aliases, and remove broad light-mode overrides only after core pages migrate.
- Decision: migrate shell first, then landing page, then core pages.

### 2026-06-27 - Phase 1B Semantic Tokens

- Added semantic theme tokens in `app/globals.css` for surfaces, text, borders, actions, media, and brand accents.
- Preserved existing compatibility aliases so current pages keep rendering through `--bg`, `--text`, `--border`, and related variables.
- Left broad light-mode override rules in place until components are migrated intentionally.
- No component markup, routes, backend wiring, or visual layout was changed in this step.
- Next step: migrate the shared shell/header/footer and CTA treatments before touching page-level sections.

### 2026-06-27 - Phase 1C Shared Shell Token Migration

- Migrated `Header`, `Footer`, and the `SiteShell` skip link away from repeated hardcoded gold/dark color literals.
- Added minimal shared utilities: `sg-skip-link`, `sg-hover-accent`, `sg-group-hover-accent`, and `sg-hover-surface`.
- Switched shell surfaces, borders, text states, active nav states, dropdown hover states, and theme toggle accents to semantic tokens.
- Kept navigation structure, spacing, layout, routes, and behavior unchanged.
- Next step: migrate landing-page section primitives and CTAs to the same token layer.

### 2026-06-27 - Phase 1D Landing Primitives Token Migration

- Added shared action/card/media utilities: `sg-action-primary`, `sg-action-secondary`, `sg-group-action-primary`, `sg-card`, and `sg-media-frame`.
- Migrated homepage CTAs, cards, counters, media frames, section backgrounds, and non-media text states to semantic tokens.
- Preserved homepage layout, section order, carousel behavior, routes, copy, and media selection.
- Left white text inside dark image/video overlays where it is intentional for legibility.
- Next step: continue token migration on `/blaze` and `/kolasi` before removing broad light-mode compatibility overrides.

### 2026-06-27 - Phase 1E Blaze and Kolasi Token Migration

- Added `sg-action-accent` for gold-accent CTAs without hardcoded color literals.
- Migrated `/blaze` and `/kolasi` page clients to semantic surfaces, text states, borders, media frames, and shared action utilities.
- Preserved page structure, copy, routes, section order, media choices, carousels, accordions, animations, and CTA destinations.
- Left white overlay text/marks only where they sit directly on dark media imagery.
- Next step: migrate `/venues`, `/quote`, and `/contact` before broad light-mode override removal.

### 2026-06-27 - Phase 1F Quote Contact and Venue Form Token Migration

- Added shared `sg-form-field` and `sg-form-label` utilities for core public forms.
- Migrated `/quote` form fields, progress states, selector cards, success state, and CTAs to semantic tokens/shared action utilities.
- Migrated `/contact` page surfaces, form fields, sidebar cards, link states, dividers, and CTAs to semantic tokens/shared form utilities.
- Migrated the shared `VenueForm` fields, step indicators, goal chips, success state, and submit/back controls to semantic tokens/shared action utilities.
- Preserved routes, form names, server-action payload shape, copy, layout, and interaction flow.
- Decision: defer the full `/venues` page-section migration to a targeted pass because broad replacement risks flattening its visual hierarchy.
- Next step: migrate `/venues` page sections and shared venue cards/components deliberately, then start removing broad light-mode compatibility overrides.
