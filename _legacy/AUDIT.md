## Project Audit — Samuell Goldfinch Website

Summary
-------
- Location: repository root (static site). Key pages: index.html, blaze.html, kolasi.html, about.html, contact.html, quote.html.
- Assets: large collection of images and videos under `assets/` (Blaze, Kolasi, etc.).
- Styles: `css/main.css` (single large stylesheet) and `assets/css/style.css` (page overrides).
- Scripts: `js/main.js`, `js/blaze.js`, `js/home.js`, `js/kolasi.js`, `js/heroAutoplay.js`, `js/theme-bootstrap.js`.
- Hosting: `netlify.toml` present with caching/security headers.

What has been done (complete)
--------------------------------
- Structural scan of top-level files and folders.
- Read and analyzed: `index.html`, `netlify.toml`, `css/main.css`, `js/main.js`, `js/blaze.js`, `assets/css/style.css`, `js/theme-bootstrap.js`.
- Identified performance and accessibility patterns (preconnect, preload, deferred scripts, ARIA, keyboard handlers).

Key findings
------------
- Good practices: preconnect/preload, deferred JS, Netlify caching headers, theme bootstrap to avoid flash, keyboard-friendly UI components.
- Risks/opportunities:
  - Heavy media (many large images/videos) — primary performance bottleneck.
  - No CSP or SRI for external CDNs (e.g., GSAP, possible Tailwind CDN) in `netlify.toml`.
  - `css/main.css` is large; consider splitting critical vs non-critical CSS or using a build pipeline.
  - Some potential path typos (verify `stouh_beirut` vs `stouth` naming) — double-check references to avoid 404s.

Prioritized next steps (short list)
----------------------------------
1) Inventory heavy media (automated list of largest files under `assets/`).
2) Add a draft `Content-Security-Policy` and SRI suggestions for CDN scripts in `netlify.toml` (review before deploy).
3) Create an image/video optimization plan: webp/AVIF, responsive `srcset`, lower-bitrate video encodes + Cloudinary transforms.
4) Introduce a minimal build step: content-hash filenames for `css/` and `js/`, and CSS splitting for critical CSS.
5) Run Lighthouse/performance audits locally and store results.

Quick commands
--------------
- PowerShell: list 25 largest files under `assets/` (run in repository root):

```powershell
Get-ChildItem -Path .\assets -Recurse -File | Sort-Object Length -Descending | Select-Object FullName, @{n='SizeMB';e={[math]::Round($_.Length/1MB,2)}} -First 25 | Format-Table -AutoSize
```

- Node (cross-platform): using `npx` helper (install helper as needed):

```bash
npx local-file-size --path ./assets --top 25
```

Notes on making changes safely
-----------------------------
- Work in a feature branch when introducing build steps or renaming assets.
- Use content-hash filenames and update references in HTML/JS automatically (simple script or build tool).
- When changing `netlify.toml`, validate headers on a staging deploy before updating production.

Where to next (I can do one of these now)
---------------------------------------
- Run the media inventory and return a size-sorted CSV or list.
- Draft a compact `Content-Security-Policy` + SRI snippet for `netlify.toml`.
- Draft an `npm`-based build pipeline (minimal `package.json` and scripts) to hash assets and split CSS.

File references
---------------
- See `index.html`, `netlify.toml`, `css/main.css`, and `js/main.js` for the core implementation.

Keep this file updated as tasks complete. Use the repo root `AUDIT.md` and the todo list to track progress.
