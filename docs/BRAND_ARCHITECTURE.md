# Blaze and Kolasi Brand Architecture

Date: 2026-07-01

## Current Diagnosis

Blaze is currently presented as the cinematic production side of Samuell Goldfinch: wedding films, editorial/commercial work, event coverage, galleries, and project detail pages.

Kolasi is currently presented as the live culture side: DJ booking, event curation, artists, venue programming, live events, and nightlife content.

The separation exists, but it is not clean enough yet. Users can understand the two brands, but not always within 5 seconds because several sections mix services, proof, media, and generic claims at the same time.

## Main Clarity Issues

- The homepage explains the parent identity well, but Blaze and Kolasi still feel compressed into one continuous visual language instead of two clearly organized offers.
- Blaze feels stronger because it has clearer selected work, better image inventory, and a more direct production promise.
- Kolasi has the right business direction, but the page is overloaded: hero, manifesto, expertise cards, video showcase, upcoming events, services accordion, marquee gallery, venue banner, and CTA all compete.
- Venue programming overlaps heavily with Kolasi, but it currently behaves like a separate mini-product instead of a focused Kolasi conversion path.
- Hardcoded fallback detail content still creates public demo-like proof for Blaze projects, Kolasi events, artists, and venue case studies.
- The venue page still forces fallback case studies when CMS case studies are empty. This is a credibility risk.
- Some media arrays are duplicated across homepage, Blaze, Kolasi, detail pages, and venue surfaces.
- Some motion and interaction patterns, especially 3D tilt/marquee behavior in Kolasi, add complexity without clarifying the brand.

## Target Blaze Positioning

Blaze should be the premium visual production identity:

- cinematic production
- weddings
- editorials
- brand/luxury storytelling
- event films and photography
- premium video/photo proof

Blaze should lead with selected work, galleries, reels, and concise service paths. It should feel visual, precise, emotional, and high-end.

## Target Kolasi Positioning

Kolasi should be the live culture and programming identity:

- artist booking
- DJ and live performance programming
- entertainment direction
- venue activation
- event curation
- live performance and nightlife experiences

Kolasi should lead with what it programs, who it books, where it activates, and how a venue or client starts a booking conversation. It should feel curated, operational, cultural, and credible.

## Recommended Page Structure

### Homepage

- Keep Samuell Goldfinch as the parent identity.
- Present Blaze and Kolasi as two clear branches, not as mixed service cards.
- Keep one concise selected-work area for Blaze.
- Keep Kolasi as a shorter editorial section leading to `/kolasi` and `/venues`.
- Keep collaborations only when assets/proof are real.
- Avoid fake testimonials and fake case studies.

### Blaze Page

- Keep the page focused on premium visual production.
- Prioritize hero, short manifesto, selected work selector, image/video proof, and final CTA.
- Consolidate duplicated static media arrays into one local source when implementing.
- Keep CMS project detail pages, but remove public demo fallback details in a later cleanup phase.

### Kolasi Page

- Reduce density before adding new effects.
- Keep hero, short positioning, core services, selected event/media proof, venue conversion path, and final CTA.
- Consider removing either the showcase or the marquee gallery if both show similar proof.
- Remove 3D tilt from gallery cards before adding any new 3D.
- Keep venue programming as a Kolasi-owned conversion branch.

### Venues Page

- Treat as the conversion page for Kolasi venue programming.
- Remove forced fake case-study rendering.
- Hide public proof when CMS has no real proof.
- Keep package fields in CMS, but avoid public price emphasis unless pricing is final and intentional.

### About Page

- Keep it as the place that explains the Samuell -> Blaze/Kolasi relationship.
- Reduce duplicate claims and keep proof only if verified.
- Use it to clarify the parent architecture, not to repeat every service page.

## Content Cleanup Recommendations

- Remove or hide fallback/demo detail content from public proof paths when CMS is empty.
- Stop rendering fake venue case studies.
- Consolidate repeated media lists into fewer local content modules before making CMS editable.
- Keep safe fallback media for layout resilience, but do not use fallback proof as if it were verified.
- Audit collaborator names/logos and separate "real logo available" from "text-only placeholder".
- Clean source encoding/mojibake in a later dedicated pass without changing copy meaning.

## Design Elevation Direction

- Do not redesign yet.
- First reduce page density and duplicated proof.
- Then make Blaze and Kolasi visually distinct through pacing, media selection, and section hierarchy, not new colors or gimmicks.
- Blaze should feel gallery/editorial.
- Kolasi should feel programmed/curated/live.
- Keep the existing dark cinematic identity as the baseline.
- Improve light mode only after sections are simplified.

## 3D Recommendation

3D should not be added now.

Where 3D could add value later:

- A restrained homepage brand-universe moment that explains Samuell, Blaze, and Kolasi.
- A single premium selected-work interaction if it improves project browsing.
- A lightweight spatial media selector after the content architecture is clean.

Where 3D would be harmful:

- Public forms.
- Header/navigation.
- Venue conversion flow.
- Proof/collaboration sections.
- Any page that is already overloaded.
- Any area where 3D hides unclear copy or weak content structure.

## Next Implementation Phase

Recommended Phase 12: CMS-only public detail proof cleanup.

Scope:

- Convert Blaze, Kolasi event, and artist detail fallbacks from public demo proof into CMS-only behavior.
- Keep safe fallback media only where it does not imply verified work, clients, artists, or events.
- Update static params so fallback/demo slugs are not exposed as real content.
- Keep public routes, copy meaning, CMS schemas, and visual direction unchanged.

## Phase 11 Baseline Completed

- Venue case studies now render only when CMS provides real case-study records.
- Fake upcoming Kolasi events were removed from the shared upcoming-events component.
- Kolasi marquee gallery tilt/3D-like hover behavior was removed while preserving the marquee layout.
- Static fallback detail routes for Blaze projects, Kolasi events, and artists still remain and should be handled in the next phase.
