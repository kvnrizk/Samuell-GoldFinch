# Frontend Audit And Polish Checklist

Status: Planning document
Scope: Frontend audit, polish, refont preparation, light-mode cleanup, and visual overload reduction
Design rule: Do not redesign the site. Do not reorder sections. Do not change layout direction, colors, motion language, or public visual identity unless explicitly approved.
Last updated: 2026-06-11

## Purpose

This document captures the frontend audit before starting the polish pass.

The goal is not to rebuild the frontend. The goal is to make the current website feel cleaner, more intentional, less overloaded, and less obviously template-generated while preserving the existing design direction.

Focus areas:

- Light-mode consistency.
- Text and copy discipline.
- Typography/refont planning.
- Minor spacing and positioning polish.
- Reducing AI-artifact language and effects.
- Reducing eager media and runtime weight.
- Keeping the existing layout and visual system intact.

## Non-Negotiables

- Do not redesign the frontend without explicit approval.
- Do not change section order without explicit approval.
- Do not remove business-critical CTAs without explicit approval.
- Do not change the public content model during frontend polish.
- Do not introduce new frontend dependencies unless there is a clear reason.
- Prefer small token, copy, spacing, and media-loading fixes over new abstractions.
- Preserve English and French route behavior.

## Brutal Frontend Verdict

The site has a strong visual direction, but it is currently trying too hard.

The main issues are:

- Light mode is patched globally instead of being truly supported by components.
- The venues experience feels the most AI-generated and least credible.
- There are too many simultaneous visual systems: cursor, halo, background, page transitions, audio, autoplay videos, floating CTAs, carousels, glows.
- Copy repeats premium-marketing phrases too often.
- Some metrics and case-study fallbacks feel unsafe if they are not real.
- The frontend has tokens, but many components ignore them and hardcode dark-mode classes.
- Heavy media is mounted too eagerly, especially Mux video.

This does not mean the frontend is bad. It means the current polish pass should remove noise and tighten consistency, not add more effects.

## Critical Findings

### 1. Light Mode Is Structurally Fragile

Finding:
Dark-mode utility classes are used throughout the app, then broad global CSS selectors try to force them into light mode.

Relevant file:

- `app/globals.css`

Examples of fragile global patching:

- `html.light [class*="bg-black"]`
- `html.light [class*="text-white"]`
- `html.light [class*="border-white/"]`
- Button and backdrop selectors patched with `!important`

Risk:
Light mode will keep producing random inconsistencies because components are not truly theme-aware.

Recommended direction:

- [ ] Replace hardcoded dark text/background classes with theme tokens in key components.
- [ ] Use `var(--text)`, `var(--text-dim)`, `var(--text-mute)`, `var(--bg-card)`, and `var(--border)` where appropriate.
- [ ] Remove only the global light-mode hacks that become unnecessary after component cleanup.

Do not:

- [ ] Do not redesign the light theme.
- [ ] Do not change the color palette.
- [ ] Do not rewrite all CSS at once.

### 2. Home "For Venues" Section Is Visually Inconsistent

Finding:
The "For Venues" callout uses hardcoded dark text classes that do not match the rest of the site text system.

Relevant file:

- `app/(site)/HomeClient.tsx`

Current issue:

- Heading uses `text-stone-100`.
- Body uses `text-zinc-400`.

Recommended direction:

- [ ] Use primary text token for the heading.
- [ ] Use dim text token for the body.
- [ ] Keep the same layout, spacing, CTA, and section structure.

Acceptance criteria:

- [ ] The section visually matches surrounding white/tokenized text.
- [ ] Light mode no longer needs a global patch for this text.
- [ ] No layout/design change is introduced.

### 3. Venues Page Feels The Most AI-Generated

Finding:
The venues page has the highest concentration of generic premium-copy patterns, heavy claims, and decorative repetition.

Relevant file:

- `app/(site)/venues/VenuesClient.tsx`

Specific concerns:

- "Weekly identity" appears too often.
- Terms like "curated", "tailored", "transform", "elevate", and "experience" are overused.
- Fallback case studies and metrics feel questionable if not real.
- `(caseStudies.length > 0 || true)` forces case studies to show even when CMS data is empty.

Recommended direction:

- [ ] Remove the forced `|| true` case-study rendering.
- [ ] Keep real case studies only, or make fallback content clearly generic and less claim-heavy.
- [ ] Replace repeated generic copy with specific venue-owner language.
- [ ] Keep page layout intact.

Acceptance criteria:

- [ ] The venues page feels more credible.
- [ ] No fake or unverifiable performance claim appears as fact.
- [ ] The page still sells the same service.

### 4. Motion And Effects Are Overloaded

Finding:
The app globally mounts several visual systems that all compete for attention.

Relevant files:

- `components/layout/SiteShell.tsx`
- `components/ui/CustomCursor.tsx`
- `components/ui/CursorHalo.tsx`
- `components/ui/AnimatedBackground.tsx`
- `components/ui/AudioPlayer.tsx`
- `components/ui/StickyMobileCTA.tsx`

Concerns:

- Cursor effects target broad selectors like `a.group`.
- Halo and magnetic effects can make normal links feel artificial.
- Animated background adds runtime work on every page.
- Audio player and floating WhatsApp are global, even on pages where they may not matter.

Recommended direction:

- [ ] Keep intentional motion.
- [ ] Reduce broad global selectors.
- [ ] Avoid applying hover/cursor effects to every grouped link.
- [ ] Consider lazy-loading nonessential shell effects later.
- [ ] Keep visible design unchanged unless explicitly approved.

### 5. Homepage Is Visually Rich But Overloaded

Finding:
The homepage has many competing focal systems.

Relevant file:

- `app/(site)/HomeClient.tsx`

Current stacked systems:

- Hero video.
- Hero side image/card.
- Scroll indicator.
- Multiple CTAs.
- Blaze carousel/cycling images.
- Kolasi autoplay video grid.
- Venue CTA.
- Trust strip/logos.
- Testimonials.
- Global background/cursor/audio effects.

Recommended direction:

- [ ] First tighten text and token consistency.
- [ ] Then reduce eager media behavior.
- [ ] Then tune spacing only where rhythm feels crowded.
- [ ] Do not remove sections unless explicitly approved.

### 6. Mux Video Loads Too Eagerly

Finding:
The shared `VideoPlayer` lazy-observes normal video files, but Mux videos mount immediately.

Relevant file:

- `components/ui/VideoPlayer.tsx`

Risk:
Below-the-fold Mux players add unnecessary runtime and network pressure.

Recommended direction:

- [ ] Make below-the-fold Mux videos poster-first or viewport-mounted.
- [ ] Keep hero video behavior where visually essential.
- [ ] Avoid multiple eager autoplay videos on one page.

Acceptance criteria:

- [ ] The visual design looks the same at first glance.
- [ ] Fewer video players mount before they are visible.
- [ ] Mobile load is lighter.

### 7. Theme Tokens Are Not Used Consistently

High-priority files to clean first:

- `app/(site)/HomeClient.tsx`
- `app/(site)/venues/VenuesClient.tsx`
- `app/(site)/contact/ContactClient.tsx`
- `app/(site)/quote/QuoteClient.tsx`
- `components/ui/VenueForm.tsx`
- `components/ui/PricingCard.tsx`
- `components/ui/ProcessTimeline.tsx`
- `components/layout/Footer.tsx`

Recommended direction:

- [ ] Replace hardcoded `text-stone-100`, `text-zinc-400`, `text-zinc-500`, `bg-black/*`, and `border-white/*` only where they conflict with theme support.
- [ ] Keep intentional brand accents like gold.
- [ ] Avoid a giant one-shot rewrite.

### 8. Copy Needs Human Editing

Finding:
The copy often sounds polished but generic.

Overused language:

- curated
- bespoke
- tailored
- transform
- elevate
- experience
- vision
- cinematic
- weekly identity

Recommended direction:

- [ ] Replace generic luxury language with specific, direct business language.
- [ ] Shorten headings where possible.
- [ ] Make CTAs clearer and less repetitive.
- [ ] Remove or soften metrics that are not verified.

### 9. Forms May Be Too Heavy For Conversion

Relevant files:

- `app/(site)/contact/ContactClient.tsx`
- `app/(site)/quote/QuoteClient.tsx`
- `components/ui/VenueForm.tsx`

Concerns:

- Venue inquiry asks for a lot of information.
- Quote flow is functional but dense.
- Some labels/helper text are dark-mode styled and may not read cleanly in light mode.

Recommended direction:

- [ ] Improve field text and helper copy.
- [ ] Improve light-mode token consistency.
- [ ] Do not change form fields or server actions unless explicitly approved.

### 10. French Support Needs UI String Cleanup

Finding:
French route support exists, but shared UI components still contain hardcoded English strings.

Examples to verify:

- Pricing cards.
- Shared CTAs.
- Footer service labels.
- Form helper text.
- Status messages.

Recommended direction:

- [ ] Finish visible shared UI strings first.
- [ ] Do not translate CMS content yet unless explicitly requested.
- [ ] Keep `/` English and `/fr` French behavior unchanged.

## Frontend Polish Phases

### Frontend Phase 1 - Token And Light-Mode Pass

Goal:
Make the existing design theme-consistent without changing visuals.

Tasks:

- [ ] Fix Home "For Venues" heading/body token usage.
- [ ] Tokenize key text in venues page.
- [ ] Tokenize form inputs and labels where light mode is weak.
- [ ] Tokenize PricingCard and ProcessTimeline text.
- [ ] Remove only unnecessary global light-mode hacks after components are fixed.

Exit criteria:

- [ ] Light mode looks intentional on `/`, `/venues`, `/quote`, and `/contact`.
- [ ] No public layout changes.
- [ ] No color palette redesign.

### Frontend Phase 2 - Venues Credibility Pass

Goal:
Make the venues experience feel more credible and less generated.

Tasks:

- [ ] Remove forced fallback case-study rendering.
- [ ] Remove or soften unverifiable metrics.
- [ ] Reduce repeated "weekly identity" copy.
- [ ] Rewrite venue copy to sound more direct and operational.
- [ ] Keep same sections unless explicit approval is given.

Exit criteria:

- [ ] Venues page still sells the offer.
- [ ] No fake case studies appear as real.
- [ ] Copy is less generic.

### Frontend Phase 3 - Motion Diet

Goal:
Keep the cinematic direction but remove artificial over-animation.

Tasks:

- [ ] Narrow cursor/halo selectors.
- [ ] Remove inappropriate hover labels from generic links.
- [ ] Reduce magnetic behavior where it feels gimmicky.
- [ ] Verify reduced-motion behavior.
- [ ] Keep the visual direction intact.

Exit criteria:

- [ ] Site feels premium, not gimmicky.
- [ ] Motion no longer distracts from copy and CTAs.

### Frontend Phase 4 - Media Loading Pass

Goal:
Reduce eager video/media weight without changing visible design.

Tasks:

- [ ] Lazy-mount below-the-fold Mux videos.
- [ ] Keep hero video behavior only where needed.
- [ ] Review homepage video count.
- [ ] Verify poster/fallback behavior.

Exit criteria:

- [ ] Pages look the same above the fold.
- [ ] Fewer players mount immediately.
- [ ] Mobile performance improves.

### Frontend Phase 5 - Refont And Typography Polish

Goal:
Improve brand character without redesigning layout.

Tasks:

- [ ] Audit current `DM Sans` and `Playfair Display` usage.
- [ ] Propose 2 or 3 restrained font pairings.
- [ ] Test wrapping on English and French headings.
- [ ] Keep spacing and layout stable.
- [ ] Only implement after explicit approval.

Exit criteria:

- [ ] Typography feels less template-like.
- [ ] Hero and section headings still fit cleanly.
- [ ] No layout redesign.

### Frontend Phase 6 - Spacing, Positioning, And Copy Pass

Goal:
Polish rhythm after token, copy, motion, and font decisions are stable.

Tasks:

- [ ] Tighten hero headline and CTA proximity only where needed.
- [ ] Improve section title wrapping.
- [ ] Improve mobile vertical rhythm.
- [ ] Shorten helper text.
- [ ] Verify French strings do not overflow.

Exit criteria:

- [ ] Site feels cleaner and less crowded.
- [ ] Existing layout direction is preserved.

## Verification Checklist

Run after each frontend implementation phase:

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run test
npm run build
```

Manual checks:

- [ ] `/`
- [ ] `/fr`
- [ ] `/venues`
- [ ] `/fr/venues`
- [ ] `/quote`
- [ ] `/fr/quote`
- [ ] `/contact`
- [ ] `/fr/contact`
- [ ] Header desktop and mobile.
- [ ] Footer desktop and mobile.
- [ ] Light mode and dark mode.
- [ ] Reduced motion if enabled.
- [ ] Contact, quote, and venue forms still submit through existing server actions.

## Current Decision

Before frontend implementation starts, return to the backend foundation checklist and complete the next stopped phase:

- Backend Phase 3 - Reduce Backend Complexity.

Frontend polish should begin only after explicit approval.
