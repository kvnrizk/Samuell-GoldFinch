# Motion System — Samuell Goldfinch Platform

## Duration Rules

| Context                  | Duration     | Notes                          |
|--------------------------|-------------|--------------------------------|
| Scroll reveal            | 0.8–1.2s    | Max 1s for most sections       |
| Hover / focus            | 0.2–0.4s    | Snappy, responsive             |
| Page transitions         | 0.4–0.6s    | In + out combined              |
| Carousel slide           | 0.6–0.7s    | Smooth but not sluggish        |
| Background grain/glow    | 8–20s       | Ambient, barely perceptible    |

## Property Rules

Only animate **`transform`** (translate, scale, rotate) and **`opacity`**.
These are GPU-composited and don't trigger layout/paint.

**NEVER animate:** width, height, top, left, margin, padding, font-size, border-width, box-shadow.

## Easing Standard

| Usage        | Easing           |
|--------------|-----------------|
| Reveals      | `power3.out`     |
| Transitions  | `power2.inOut`   |
| Hero title   | `expo.out`       |

## Concurrency

- Max 3 active GSAP ScrollTrigger instances in viewport simultaneously
- Use `ScrollTrigger.batch()` for groups of similar elements
- Below-fold elements start at `opacity: 0` via CSS, revealed by GSAP on scroll

## Reduced Motion

- CSS: `@media (prefers-reduced-motion: reduce)` disables all animations
- JS: `window.matchMedia('(prefers-reduced-motion: reduce)')` checked globally
- GSAP timelines killed; elements set to full opacity instantly
- Grain overlay animation paused
- Background orb drift paused

## Cleanup

- All GSAP contexts reverted on component unmount via `ctx.revert()`
- ScrollTrigger instances destroyed on route change
- Test: navigate between pages 10+ times rapidly — no orphaned instances
