/**
 * Replace all /assets/ paths in code with Cloudinary URLs
 * using the mapping from cloudinary-mapping.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/cloudinary-mapping.json'), 'utf8'));

const files = [
  'app/(site)/HomeClient.tsx',
  'app/(site)/blaze/BlazeClient.tsx',
  'app/(site)/blaze/[slug]/page.tsx',
  'app/(site)/kolasi/KolasiClient.tsx',
  'app/(site)/kolasi/[slug]/page.tsx',
  'app/(site)/kolasi/artists/[slug]/page.tsx',
  'app/(site)/about/AboutClient.tsx',
  'app/(site)/journal/page.tsx',
  'app/(site)/journal/[slug]/page.tsx',
  'app/(site)/venues/page.tsx',
  'app/(site)/venues/VenuesClient.tsx',
  'app/(site)/showreel/page.tsx',
  'components/JsonLd.tsx',
];

// Sort paths longest-first to avoid partial replacements
const sortedPaths = Object.keys(mapping).sort((a, b) => b.length - a.length);

let totalReplacements = 0;

for (const file of files) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) {
    console.log('SKIP (not found):', file);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let count = 0;

  for (const oldPath of sortedPaths) {
    const newUrl = mapping[oldPath];
    while (content.includes(oldPath)) {
      content = content.replace(oldPath, newUrl);
      count++;
    }
  }

  // Also fix the missing DSCF2471.jpg — replace with DSCF2395 Cloudinary URL
  const missingImg = '/assets/blaze/weddings/DSCF2471.jpg';
  const replacement = mapping['/assets/blaze/weddings/DSCF2395.jpg'];
  while (content.includes(missingImg)) {
    content = content.replace(missingImg, replacement);
    count++;
  }

  if (count > 0) {
    fs.writeFileSync(fullPath, content);
    console.log(`OK  ${file} — ${count} replacements`);
    totalReplacements += count;
  } else {
    console.log(`    (no changes): ${file}`);
  }
}

console.log(`\nTotal: ${totalReplacements} replacements across ${files.length} files`);
