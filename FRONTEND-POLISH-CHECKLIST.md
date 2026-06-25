# Frontend Polish Checklist (Post-Reset)

Use this after runtime + admin verification is stable.

## Priority 1 - Typography and readability
- [ ] Define a single responsive type scale token map in global styles (desktop/tablet/mobile).
- [ ] Normalize heading rhythm (`h1`..`h4`) across Home, Blaze, Kolasi, Venues, Quote, Contact.
- [ ] Increase small-body legibility where text is currently under 14px equivalent.
- [ ] Align CTA sizes and line-heights for visual consistency across pages.
- [ ] Verify French pages (`/fr/*`) do not overflow with longer strings at each breakpoint.

## Priority 2 - Spacing and visual consistency
- [ ] Standardize vertical section spacing tokens for hero, content sections, and footer.
- [ ] Normalize card padding and grid gaps across `blaze`, `kolasi`, `venues`, and `journal` lists.
- [ ] Ensure consistent button styles for primary/secondary/ghost actions.
- [ ] Audit border radii and shadow usage so cards/components follow one visual system.

## Priority 3 - Navigation and shell polish
- [ ] Review header behavior on scroll (desktop + mobile) and ensure predictable state transitions.
- [ ] Validate mobile menu readability, tap targets, and spacing at small widths.
- [ ] Verify footer hierarchy and spacing, especially legal/secondary links.
- [ ] Confirm language switcher and theme controls remain discoverable and aligned.

## Priority 4 - Motion and interaction quality
- [ ] Keep animation durations aligned with `MOTION.md` rules.
- [ ] Ensure reduced-motion behavior remains intact for reveal and ambient effects.
- [ ] Remove any jarring stagger/scroll effects that interfere with text readability.

## Priority 5 - Regression safety checks
- [ ] Re-run `npm run lint`, `npm test`, `npm run build` after polish pass.
- [ ] Capture before/after screenshots for `/`, `/fr`, `/quote`, `/venues`, `/admin` login screen.
- [ ] Quick responsive QA at common breakpoints (mobile portrait, tablet, desktop wide).

## Suggested execution order
1. Typography tokens and text-size pass
2. Section spacing + cards/buttons consistency
3. Header/footer/mobile nav polish
4. Motion tuning
5. Final QA + build gates

---

## Next Requested Landing Pass - Notes To Plan Before Implementation

- [ ] should elevate text in hero
- [ ] in the hero also, for the card on the right " signature wedding reel " is it supposed to show a video ?
- [ ] for featured sets should find a better label than "featured sets" because will feature things from blaze (Photography | Videography | Creative Direction) AND Kolasi
- [ ] and should be dispatched into two different identities one for blaze and one for kolasi // for the cards also should be clickable for exemple click on "stouh beirut" and it opens a widget of gallery for stouh beirut and we say IN THE SAME PAGE (same concept for all the cards in this section
- [ ] good for blaze section
- [ ] will rework the medi selection for kolasi, will keep one video and add 2 photos instead of 3 videos --> will keep the 16:9 video and replace the two 9:16 by two images
- [ ] the "for venues" section, directly under kolasi section looks too much AI, change the gold typical to a more sober ivory/white color and make the numbers (150+ live expereiences and 12+ cities filmed) like a counter when revealed on screen
- [ ] for the section "trusted by the best", should add real logo instead of texts where there isnt real logo
- [ ] for section "what our clients say" to be removed and later on will add testimony because those are all invented

## Kolasi Selected Work - Later Video Pass

- [ ] Replace the temporary Kolasi selected-work images with videos only.
- [ ] Prefer YouTube-hosted Kolasi videos if final assets are provided there.
- [ ] Keep the same 360 / tourniquet carousel interaction for Kolasi videos.
- [ ] Allow swipe/drag between Kolasi YouTube video cards.
- [ ] Clicking an active Kolasi video card should open a same-page video widget/modal, not navigate away.
- [ ] Do not keep the current temporary Kolasi image selection as final because the images are not strong enough.

## Missing Logo Asset TODO

- [ ] Provide real logo assets for collaborators currently displayed as text-only: Embassy of Lebanon, Kate Zubok, Transdev, Chloe Khalife, Brunch Festival, France Tourisme.
- [ ] Replace text-only collaborator cards with real logos when approved assets are available.
- [ ] Do not use generated/fake initials as logo substitutes.

## Planning Constraint

- [ ] Do not implement these notes until Rab explicitly validates the execution plan.
- [ ] Plan the cleanest step-by-step implementation before touching frontend code.
