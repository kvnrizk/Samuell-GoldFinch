# Theme Token Audit

Created 2026-06-27 on branch `Rab_FullPass`.

This document is Phase 1A of the cleanup roadmap. It defines the current theme problems and the exact migration target before editing `app/globals.css`.

## Current Findings

The site already has useful base variables in `app/globals.css`:

- `--bg`
- `--bg-card`
- `--bg-hover`
- `--text`
- `--text-dim`
- `--text-mute`
- `--border`
- `--border-hi`
- `--color-gold`
- responsive type variables such as `--fs-body`, `--fs-kicker`, and `--fs-caption`

The problem is that core components still mix these variables with hardcoded Tailwind color utilities and hex values.

Current public-surface color usage snapshot:

| Pattern | Count |
|---|---:|
| `#c8a96e` | 188 |
| `#09090b` | 24 |
| `text-white` | 30 |
| `border-white` | 75 |
| `bg-white` | 64 |
| `bg-black` | 10 |
| `bg-neutral` | 8 |
| `text-zinc` | 55 |
| `text-stone` | 28 |

This is why the light theme needs broad overrides such as:

- `html.light [class*="text-white"]`
- `html.light [class*="border-white/"]`
- `html.light [class*="bg-black"]`
- `html.light button[class*="border-white/"]`

Those overrides are fragile because they change unrelated elements globally instead of styling each component intentionally.

## Target Token Model

Do not remove existing tokens immediately. Add a clearer semantic layer first, then migrate core components to it.

Recommended token groups:

```css
/* Surfaces */
--surface-page
--surface-card
--surface-card-soft
--surface-raised
--surface-inverse

/* Text */
--text-primary
--text-secondary
--text-muted
--text-inverse
--text-accent

/* Borders */
--border-subtle
--border-strong
--border-accent

/* Actions */
--action-primary-bg
--action-primary-text
--action-primary-border
--action-secondary-bg
--action-secondary-text
--action-secondary-border
--action-ghost-bg
--action-ghost-text
--action-ghost-border

/* Media */
--media-overlay-soft
--media-overlay-strong
--media-border
--media-shadow

/* Brand */
--brand-gold
--brand-gold-soft
--brand-ivory
--brand-dark
--brand-kolasi
```

Compatibility aliases should remain during migration:

```css
--bg: var(--surface-page);
--bg-card: var(--surface-card);
--bg-hover: var(--surface-raised);
--text: var(--text-primary);
--text-dim: var(--text-secondary);
--text-mute: var(--text-muted);
--border: var(--border-subtle);
--border-hi: var(--border-strong);
```

## Required Shared Classes

Add small utility classes only where they remove repeated hardcoded styling.

Recommended first classes:

```css
.sg-section
.sg-section-tight
.sg-section-muted
.sg-heading
.sg-kicker
.sg-body
.sg-card
.sg-card-soft
.sg-media-frame
.sg-btn
.sg-btn-primary
.sg-btn-secondary
.sg-btn-ghost
.sg-form-field
```

These should be wrappers over semantic tokens, not a full design system.

## Migration Order

### Step 1 - Add Tokens Only

- Add semantic tokens to `html.dark` and `html.light`.
- Keep current compatibility variables.
- Do not remove broad light-mode overrides yet.
- Do not change page markup yet.

### Step 2 - Migrate Shared Shell

Migrate first:

- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/SiteShell.tsx`
- shared CTA/button treatments

Reason: these appear on every page and currently contain repeated gold/dark hardcoding.

### Step 3 - Migrate Landing Page

Migrate:

- hero CTAs
- Blaze carousel card overlays
- Kolasi card surfaces
- venues CTA band
- collaborations cards
- final CTA

Reason: landing page is the highest-visibility page and currently mixes tokens, hardcoded whites, and global light-mode dependency.

### Step 4 - Migrate Core Pages

Migrate in this order:

1. `/blaze`
2. `/kolasi`
3. `/venues`
4. `/quote`
5. `/contact`
6. French mirrors

### Step 5 - Remove Broad Overrides

Only after the core pages are migrated:

- Remove `html.light [class*="text-white"]`.
- Remove `html.light [class*="border-white/"]`.
- Remove `html.light [class*="bg-black"]`.
- Remove global button/link recoloring in light mode.

## Non-Core Pages

Do not prioritize:

- `/about`
- `/press`
- `/journal`
- `/showreel`
- dynamic detail pages

They should either inherit the new primitives later or stay hidden/de-emphasized until they are useful.

## Acceptance Criteria

Phase 1 is not complete until:

- Core six pages no longer rely on broad light-mode class overrides.
- Primary CTAs use shared action tokens.
- Cards/media frames use shared surface and border tokens.
- Text hierarchy uses shared body/kicker/heading utilities.
- Dark mode remains the reference design.
- Light mode looks intentionally designed, not auto-inverted.
- `npx tsc --noEmit --pretty false`, `npm run lint`, and `npm run test` pass.

## Implementation Status

### 2026-06-27 - Step 1 Complete

Semantic tokens were added to `app/globals.css` for dark and light themes.

What changed:

- Added brand tokens: `--brand-gold`, `--brand-gold-soft`, `--brand-ivory`, `--brand-dark`, and `--brand-kolasi`.
- Added semantic surface, text, border, action, and media tokens.
- Preserved compatibility aliases such as `--bg`, `--text`, `--border`, and `--bg-card`.
- Left broad light-mode compatibility overrides in place.
- Did not migrate component markup yet.

The next implementation step should be Step 2: migrate the shared shell/header/footer and shared CTA treatments to semantic tokens or shared classes.

### 2026-06-27 - Step 2 Started

The shared shell has started moving to semantic tokens.

What changed:

- `Header` uses semantic surface, border, text, accent, and hover tokens for nav, dropdown, mobile menu, and theme toggle styling.
- `Footer` uses semantic surface, border, text, and accent hover tokens.
- `SiteShell` skip-link styling now uses action tokens.
- Added minimal shell utilities in `app/globals.css` instead of creating a large design system.

Remaining Step 2 work:

- Review shared CTA/button components outside the shell.
- Keep migrating only shared primitives before page-specific polish.

### 2026-06-27 - Step 3 Started

The landing page now uses the semantic primitives for non-media shell styling.

What changed:

- Added shared action classes for primary and secondary CTAs.
- Added shared card and media-frame classes.
- Migrated homepage section surfaces, CTA buttons, venue counter cards, collaboration cards, Kolasi panel, and media frame borders/shadows.
- Replaced remaining homepage compatibility aliases such as `--bg`, `--text`, `--text-dim`, `--text-mute`, and `--border` where they controlled non-media UI.

Intentional exceptions:

- White text remains inside dark image/video overlays.
- White carousel dots remain because they sit on media and communicate active state.
- Broad light-mode overrides still remain until `/blaze`, `/kolasi`, `/venues`, `/quote`, and `/contact` are migrated.

### 2026-06-27 - Step 4 Started

Blaze and Kolasi page clients now use the semantic primitive layer.

What changed:

- Added `sg-action-accent` for gold-accent CTAs.
- Migrated `/blaze` surfaces, CTA buttons, showcase media frame, selected-work selector, and final CTA.
- Migrated `/kolasi` hero CTA, manifesto media frame, expertise section, showcase cards, accordion states, venue-owner banner, and final CTA.
- Preserved white-on-media overlays where the text is part of the image/video treatment.

Remaining core pages:

- `/venues`
- `/quote`
- `/contact`
- French mirrors where they use separate components or wrappers
