/**
 * Batch upload static /assets/ images to Cloudinary
 * and output a JSON mapping of old path → new URL.
 *
 * Usage: node scripts/upload-to-cloudinary.mjs
 */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load .env manually
const envFile = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  const val = trimmed.slice(eqIdx + 1);
  if (!process.env[key]) process.env[key] = val;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = 'sg-platform/static';

// All 46 images that exist locally
const images = [
  '/assets/1st.png',
  '/assets/Elie_saab_logo.webp',
  '/assets/about/IMAGE_PORTRAIT.webp',
  '/assets/about/IMG_5840.JPG',
  '/assets/blaze/IMG_6050.JPG',
  '/assets/blaze/ambassy/0C5A9134.jpg',
  '/assets/blaze/ambassy/0C5A9139.jpg',
  '/assets/blaze/ambassy/0C5A9196.jpg',
  '/assets/blaze/ambassy/0C5A9206.jpg',
  '/assets/blaze/ambassy/4F8A9987.jpg',
  '/assets/blaze/ambassy/4F8A9996.jpg',
  '/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.JPG',
  '/assets/blaze/editorial_and_brand/pexels-amar-10288372.jpg',
  '/assets/blaze/editorial_and_brand/pexels-angel-ayala-321556-28976231.jpg',
  '/assets/blaze/editorial_and_brand/pexels-fabrice-busching-1777473881-30235864.jpg',
  '/assets/blaze/editorial_and_brand/pexels-valentina-maros-128709290-13283497.jpg',
  '/assets/blaze/stouh_beirut/2E2A1243.jpg',
  '/assets/blaze/stouh_beirut/2E2A1724.jpg',
  '/assets/blaze/stouh_beirut/2E2A2072.jpg',
  '/assets/blaze/stouh_beirut/4F8A9365.jpg',
  '/assets/blaze/stouh_beirut/IMG_6348.jpg',
  '/assets/blaze/stouh_beirut/IMG_6351.jpg',
  '/assets/blaze/weddings/0G0A7733.jpg',
  '/assets/blaze/weddings/0G0A7811.jpg',
  '/assets/blaze/weddings/DSCF2395.jpg',
  '/assets/blaze/weddings/IMG_0068.jpg',
  '/assets/blaze/weddings/IMG_0079.jpg',
  '/assets/blaze/weddings/IMG_0084.jpg',
  '/assets/blaze/weddings/IMG_0100.jpg',
  '/assets/kolasi/artists/4F8A3682.jpg',
  '/assets/kolasi/artists/IMG_6476.JPG',
  '/assets/kolasi/artists/IMG_6733.jpg',
  '/assets/kolasi/artists/artist-1.jpg',
  '/assets/kolasi/artists/artist-2.jpg',
  '/assets/kolasi/artists/artist-3.JPG',
  '/assets/kolasi/artists/artist-4.JPG',
  '/assets/kolasi/images/4F8A2882.jpg',
  '/assets/kolasi/images/4F8A2938.jpg',
  '/assets/kolasi/images/4F8A3195.jpg',
  '/assets/kolasi/images/4F8A3310.jpg',
  '/assets/kolasi/images/4F8A3750.jpg',
  '/assets/kolasi/images/4F8A3777.jpg',
  '/assets/kolasi/images/4F8A3801.jpg',
  '/assets/kolasi/logo_speakeasy.png',
  '/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.JPG',
  '/assets/stouth_beirut_logo.webp',
  '/assets/mipim logo.webp',
];

async function upload(assetPath) {
  const localFile = path.join(ROOT, 'public', assetPath);
  if (!fs.existsSync(localFile)) {
    console.log(`  SKIP (not found): ${assetPath}`);
    return null;
  }

  // Build a clean public_id from the path
  const publicId = FOLDER + assetPath
    .replace(/\.[^.]+$/, '') // remove extension
    .replace(/ /g, '_');     // spaces to underscores

  try {
    const result = await cloudinary.uploader.upload(localFile, {
      public_id: publicId,
      resource_type: 'image',
      overwrite: false, // skip if already uploaded
      unique_filename: false,
    });
    console.log(`  ✓ ${assetPath} → ${result.secure_url}`);
    return { path: assetPath, url: result.secure_url };
  } catch (err) {
    if (err.http_code === 400 && err.message?.includes('already exists')) {
      // Already uploaded — construct URL
      const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
      console.log(`  ✓ ${assetPath} → ${url} (already exists)`);
      return { path: assetPath, url };
    }
    console.log(`  ✗ FAILED: ${assetPath} — ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`Uploading ${images.length} images to Cloudinary (${FOLDER})...\n`);

  const mapping = {};
  // Upload 3 at a time to avoid rate limits
  for (let i = 0; i < images.length; i += 3) {
    const batch = images.slice(i, i + 3);
    const results = await Promise.all(batch.map(upload));
    for (const r of results) {
      if (r) mapping[r.path] = r.url;
    }
  }

  const outputPath = path.join(ROOT, 'scripts', 'cloudinary-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log(`\n✓ Done! ${Object.keys(mapping).length}/${images.length} uploaded.`);
  console.log(`Mapping saved to: scripts/cloudinary-mapping.json`);
}

main().catch(console.error);
