import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const detailRouteFiles = [
  {
    label: 'Blaze project detail route',
    path: 'app/(site)/blaze/[slug]/page.tsx',
    required: ['getBlazeProjectBySlug', 'getAllBlazeProjects', 'notFound()'],
    forbidden: [
      'staticProjects',
      'staticOrder',
      'getStaticAdjacent',
      'fallbackSlugs',
      'Stouh Beirut Rooftop',
      'embassy-of-lebanon',
      'editorial-brand',
    ],
  },
  {
    label: 'Kolasi event detail route',
    path: 'app/(site)/kolasi/[slug]/page.tsx',
    required: ['getKolasiEventBySlug', 'getAllKolasiEvents', 'notFound()'],
    forbidden: [
      'staticEvents',
      'staticOrder',
      'getStaticAdjacent',
      'fallbackSlugs',
      'Le Speakeasy',
      'kolasi-nights',
      '2nd-sun',
    ],
  },
  {
    label: 'Kolasi artist detail route',
    path: 'app/(site)/kolasi/artists/[slug]/page.tsx',
    required: ['getArtistBySlug', 'getArtists', 'notFound()'],
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
  it.each(detailRouteFiles)('$label does not expose static demo proof', ({ path, required, forbidden }) => {
    const source = readProjectFile(path);

    for (const token of required) {
      expect(source).toContain(token);
    }

    for (const token of forbidden) {
      expect(source).not.toContain(token);
    }
  });
});
