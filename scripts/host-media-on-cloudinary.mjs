/**
 * Host every locally-referenced /assets media file on Cloudinary.
 *
 * Scans app/, components/, lib/ for `/assets/...` references, then uploads each
 * matching file from public/assets/ to Cloudinary under the project's public-id
 * convention (`sg-platform/static/<path without ext, spaces→_>`), as image or
 * video. Files already on Cloudinary are left as-is (overwrite: false).
 *
 * These files live under the gitignored public/assets/, so they don't deploy
 * with the repo — this publishes them so the deployed site can serve them.
 * After running, the app code is rewired to reference the Cloudinary versions.
 *
 * Usage:  node --import tsx scripts/host-media-on-cloudinary.mjs
 * Requires REAL creds in .env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * (get them via `vercel env pull` or from the Vercel dashboard).
 */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['app', 'components', 'lib'];
const CODE_EXT = new Set(['.ts', '.tsx']);
const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

// Load .env
for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  const k = t.slice(0, i);
  if (!process.env[k]) process.env[k] = t.slice(i + 1);
}

if (!process.env.CLOUDINARY_API_KEY || /placeholder/i.test(process.env.CLOUDINARY_API_KEY)) {
  console.error('✗ CLOUDINARY_API_KEY is missing or a placeholder in .env.');
  console.error('  Get real credentials first: `vercel env pull` (or copy from the Vercel dashboard).');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (CODE_EXT.has(path.extname(e.name))) out.push(p);
  }
  return out;
}

const re = /\/assets\/[^"'`\s]+?\.(?:mp4|mov|webm|jpe?g|png|webp)/gi;
const refs = new Set();
for (const f of DIRS.flatMap((d) => walk(path.join(ROOT, d)))) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(re)) refs.add(m[0]);
}

const publicId = (assetPath) =>
  ('sg-platform/static' + assetPath).replace(/\.[^.]+$/, '').replace(/%20/g, '_').replace(/ /g, '_');

let uploaded = 0, skipped = 0, failed = 0;
for (const ref of [...refs].sort()) {
  const disk = decodeURIComponent(ref);
  const abs = path.join(ROOT, 'public', disk);
  if (!fs.existsSync(abs)) { console.log(`MISSING ON DISK  ${disk}`); continue; }
  const id = publicId(ref);
  const type = VIDEO_EXT.test(ref) ? 'video' : 'image';
  try {
    const res = await cloudinary.uploader.upload(abs, {
      public_id: id, resource_type: type, overwrite: false, unique_filename: false, timeout: 600000,
    });
    if (res.existing) { skipped++; console.log(`= exists  ${id}`); }
    else { uploaded++; console.log(`✓ ${type.padEnd(5)}  ${id}  (${(res.bytes / 1048576).toFixed(1)} MB)`); }
  } catch (err) {
    if (/already exists/i.test(err?.message || '')) { skipped++; console.log(`= exists  ${id}`); }
    else { failed++; console.log(`✗ FAIL   ${id} — ${err?.message || err}`); }
  }
}

console.log(`\nDone. uploaded=${uploaded}  already-there=${skipped}  failed=${failed}`);
