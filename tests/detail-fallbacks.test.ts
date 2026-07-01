import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const detailRouteFiles = [
  {
    label: 'Blaze project detail route',
    path: 'app/(site)/blaze/[slug]/page.tsx',
    forbidden: [
      'staticProjects',
      'getStaticAdjacent',
      'fallbackSlugs',
      'Stouh Beirut Rooftop',
      'embassy-of-lebanon',
    ],
  },
  {
    label: 'Kolasi event detail route',
    path: 'app/(site)/kolasi/[slug]/page.tsx',
    forbidden: [
      'staticEvents',
      'getStaticAdjacent',
      'fallbackSlugs',
      'Le Speakeasy',
      'kolasi-nights',
    ],
  },
  {
    label: 'Kolasi artist detail route',
    path: 'app/(site)/kolasi/artists/[slug]/page.tsx',
    forbidden: [
      'staticArtists',
      'staticArtistSlugs',
      'staticEventsByArtist',
      'Kate Zubok',
      'DJ Marco',
    ],
  },
];

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('public detail fallback proof', () => {
  it.each(detailRouteFiles)('$label does not expose static demo proof', ({ path, forbidden }) => {
    const source = readProjectFile(path);

    for (const token of forbidden) {
      expect(source).not.toContain(token);
    }
  });
});
