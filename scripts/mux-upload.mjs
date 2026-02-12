/**
 * Upload all local MP4 files to Mux and output playback IDs.
 * Usage: node scripts/mux-upload.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Mux credentials from .env — NEVER hardcode secrets
import 'dotenv/config';

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.error('ERROR: MUX_TOKEN_ID and MUX_TOKEN_SECRET must be set in .env');
  process.exit(1);
}

const AUTH = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

const VIDEOS = [
  { key: 'blaze-art-direction', file: 'blaze/art direction1.mp4' },
  { key: 'blaze-transdev-aftermovie', file: 'blaze/events/website_aftermovie_transdev.mp4' },
  { key: 'blaze-weddings-demoreel', file: 'blaze/weddings/BLAZE_WEDDINGS_Demoreel.mp4' },
  { key: 'blaze-weddings-video3', file: 'blaze/weddings/video-3.mp4' },
  { key: 'kolasi-kate-zubok-artist', file: 'kolasi/artists/kolasi kate zubok.mp4' },
  { key: 'kolasi-chateau-chantilly', file: 'kolasi/chateau chantilly kate zubok.mp4' },
  { key: 'kolasi-2ndsun', file: 'kolasi/events/2ndsun/2nd_sun.mp4' },
  { key: 'kolasi-hangar-solomun', file: 'kolasi/events/hangar_y/hangar y solomun.mp4' },
  { key: 'kolasi-hangar-kate', file: 'kolasi/events/hangar_y/kate zubok.mp4' },
  { key: 'kolasi-chantilly-festival', file: 'kolasi/kate zubok festival chantilly.mp4' },
  { key: 'kolasi-panorama', file: 'kolasi/panorama voitture.mp4' },
  { key: 'kolasi-speakeasy-ads', file: 'kolasi/Speakeasy_Ads/le speakeasy ads.mp4' },
  { key: 'kolasi-speakeasy-barman', file: 'kolasi/Speakeasy_Ads/le speakeasy ads2 barman.mp4' },
  { key: 'kolasi-speakeasy-g500', file: 'kolasi/Speakeasy_Ads/lespeakeasy g500 mercedes.mp4' },
  { key: 'kolasi-speakeasy-vid', file: 'kolasi/Speakeasy_Ads/LeSpeakeasyVid.mp4' },
];

async function muxApi(method, endpoint, body) {
  const res = await fetch(`https://api.mux.com${endpoint}`, {
    method,
    headers: {
      'Authorization': `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mux API ${method} ${endpoint} failed ${res.status}: ${text}`);
  }
  return res.json();
}

async function createDirectUpload() {
  const result = await muxApi('POST', '/video/v1/uploads', {
    new_asset_settings: { playback_policy: ['public'] },
    cors_origin: '*',
  });
  return result.data; // { id, url, ... }
}

async function uploadFile(uploadUrl, filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: fileBuffer,
  });
  if (!res.ok) {
    throw new Error(`Upload PUT failed ${res.status}: ${await res.text()}`);
  }
}

async function waitForAsset(uploadId, maxWait = 300000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const result = await muxApi('GET', `/video/v1/uploads/${uploadId}`);
    const upload = result.data;
    if (upload.asset_id) {
      // Get the asset to find playback_id
      const assetResult = await muxApi('GET', `/video/v1/assets/${upload.asset_id}`);
      const asset = assetResult.data;
      if (asset.playback_ids && asset.playback_ids.length > 0) {
        return {
          assetId: asset.id,
          playbackId: asset.playback_ids[0].id,
          status: asset.status,
        };
      }
    }
    // Wait 3 seconds before polling again
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error(`Timed out waiting for asset from upload ${uploadId}`);
}

async function main() {
  const results = {};

  for (const video of VIDEOS) {
    const filePath = path.join(ROOT, 'public', 'assets', video.file);
    const sizeMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1);
    console.log(`\n[${'='.repeat(50)}]`);
    console.log(`Uploading: ${video.key} (${sizeMB}MB)`);
    console.log(`File: ${video.file}`);

    try {
      // 1. Create direct upload
      console.log('  Creating upload URL...');
      const upload = await createDirectUpload();
      console.log(`  Upload ID: ${upload.id}`);

      // 2. Upload file
      console.log(`  Uploading ${sizeMB}MB...`);
      await uploadFile(upload.url, filePath);
      console.log('  Upload complete. Waiting for processing...');

      // 3. Wait for asset
      const asset = await waitForAsset(upload.id);
      console.log(`  Asset ID: ${asset.assetId}`);
      console.log(`  Playback ID: ${asset.playbackId}`);
      console.log(`  Status: ${asset.status}`);

      results[video.key] = {
        file: video.file,
        playbackId: asset.playbackId,
        assetId: asset.assetId,
      };
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results[video.key] = { file: video.file, error: err.message };
    }
  }

  // Write results
  const outPath = path.join(ROOT, 'scripts', 'mux-playback-ids.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n\nResults written to ${outPath}`);
  console.log('\nSummary:');
  for (const [key, val] of Object.entries(results)) {
    if (val.playbackId) {
      console.log(`  ${key}: ${val.playbackId}`);
    } else {
      console.log(`  ${key}: FAILED - ${val.error}`);
    }
  }
}

main().catch(console.error);
