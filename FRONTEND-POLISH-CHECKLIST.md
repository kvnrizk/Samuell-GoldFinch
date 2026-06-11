# Frontend Polish Checklist

Status: Planning document
Scope: Frontend polish after backend foundation cleanup
Primary audit doc: `FRONTEND-AUDIT-CHECKLIST.md`
Last updated: 2026-06-11

## Rule

Do not redesign the frontend unless explicitly approved.

Allowed during polish:

- Text tightening.
- Light spacing adjustments.
- Minor positioning fixes.
- Theme-token cleanup.
- Light-mode consistency fixes.
- Refont only after approval.
- Media-loading improvements that preserve the same visual output.

Not allowed without explicit approval:

- Layout redesign.
- Section reordering.
- New visual language.
- New colors.
- New animation concept.
- Removing business-critical sections or CTAs.

## Current Audit Summary

The frontend direction is strong, but it is overloaded.

Main problems to fix:

- Light mode is patched globally instead of being component-token based.
- The Home "For Venues" section uses hardcoded dark text and does not match the rest of the white/tokenized text.
- The Venues page has the most AI-artifact copy and questionable fallback metrics.
- Cursor, halo, animated background, audio, WhatsApp, autoplay videos, and page transitions compete for attention.
- Mux videos mount too eagerly below the fold.
- Shared components still hardcode dark text/background classes.
- French UI strings need a cleanup pass.

Full checklist:

- `FRONTEND-AUDIT-CHECKLIST.md`

## Recommended Execution Order

### 1. Token And Light-Mode Pass

- [ ] Fix Home "For Venues" heading and body text colors.
- [ ] Tokenize Home, Venues, Contact, Quote, VenueForm, PricingCard, and ProcessTimeline where hardcoded dark classes break light mode.
- [ ] Remove only the global light-mode hacks that become unnecessary.
- [ ] Keep visual design unchanged.

### 2. Venues Credibility Pass

- [ ] Remove forced case-study rendering.
- [ ] Remove or soften unverifiable fallback metrics.
- [ ] Reduce repeated "weekly identity" language.
- [ ] Rewrite venue copy to sound specific and human.
- [ ] Keep the current page structure.

### 3. Motion Diet

- [ ] Narrow broad cursor and halo selectors.
- [ ] Reduce magnetic/hover behavior that feels artificial.
- [ ] Keep intentional cinematic motion.
- [ ] Verify reduced-motion behavior.

### 4. Media Loading Pass

- [ ] Lazy-mount below-the-fold Mux videos.
- [ ] Avoid multiple eager autoplay videos on one page.
- [ ] Keep hero video behavior where visually essential.
- [ ] Preserve layout and visible design.

### 5. Refont Preparation

- [ ] Audit current `DM Sans` and `Playfair Display` usage.
- [ ] Propose 2 or 3 restrained alternatives.
- [ ] Test English and French heading wrapping.
- [ ] Implement only after explicit approval.

### 6. Spacing, Positioning, And Copy Polish

- [ ] Tighten hero and section headline wrapping.
- [ ] Improve CTA proximity where spacing feels loose.
- [ ] Improve mobile rhythm.
- [ ] Shorten helper text.
- [ ] Verify English and French pages.

## Verification Gates

Run after implementation phases:

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
- [ ] Contact, quote, and venue forms still submit.

## Current Project Sequence

Frontend polish is documented but not started.

Next active implementation work should return to the foundation checklist:

- `FOUNDATION-AUDIT-CLEANUP-CHECKLIST.md`
- Next phase: Backend Phase 3 - Reduce Backend Complexity.
