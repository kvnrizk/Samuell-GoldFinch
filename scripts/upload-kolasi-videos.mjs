/**
 * Upload the Kolasi homepage-carousel videos to Cloudinary.
 *
 * The homepage Kolasi craft-carousel cards reference these clips by
 * `cloudinaryVideoId` (see app/(site)/HomeClient.tsx → curatedKolasiItems).
 * Run this once with real Cloudinary credentials in .env to publish them so
 * they play in production (they live under the gitignored public/assets/, so
 * they don't deploy with the repo).
 *
 * Usage:  node --import tsx scripts/upload-kolasi-videos.mjs
 * Requires in .env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Load .env
const envFile = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
for (const line of envFile.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  const k = t.slice(0, i);
  if (!process.env[k]) process.env[k] = t.slice(i + 1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// file → public_id (public_id must match curatedKolasiItems' cloudinaryVideoId)
const videos = [
  { file: 'public/assets/kolasi/Speakeasy_Ads/LeSpeakeasyVid.mp4', id: 'sg-platform/static/assets/kolasi/Speakeasy_Ads/LeSpeakeasyVid' },
  { file: 'public/assets/kolasi/kate zubok festival chantilly.mp4', id: 'sg-platform/static/assets/kolasi/kate_zubok_festival_chantilly' },
  { file: 'public/assets/kolasi/panorama voitture.mp4', id: 'sg-platform/static/assets/kolasi/panorama_voitture' },
];

async function main() {
  if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'local-placeholder') {
    console.error('✗ CLOUDINARY_API_KEY missing or placeholder in .env — set real credentials first.');
    process.exit(1);
  }
  for (const v of videos) {
    const abs = path.join(ROOT, v.file);
    if (!fs.existsSync(abs)) { console.log(`SKIP (missing): ${v.file}`); continue; }
    try {
      const res = await cloudinary.uploader.upload(abs, {
        public_id: v.id,
        resource_type: 'video',
        overwrite: true,
        unique_filename: false,
        timeout: 600000,
      });
      console.log(`✓ ${v.id}  (${(res.bytes / 1048576).toFixed(1)} MB)`);
    } catch (err) {
      console.log(`✗ FAILED ${v.id} — ${err?.message || err}`);
    }
  }
  console.log('\nDone. These now play on the deployed site (optimized via f_auto,q_auto).');
}

main().catch(console.error);
