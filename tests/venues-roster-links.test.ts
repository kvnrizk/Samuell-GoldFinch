import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const VENUES_PAGES = [
  'app/(site)/venues/page.tsx',
  'app/(site-fr)/fr/venues/page.tsx',
];

const VENUES_CLIENT = 'app/(site)/venues/VenuesClient.tsx';

// Demo roster slugs that must never become public artist detail links: the
// artist detail route is CMS-only and returns notFound() for unknown slugs.
const DEMO_ARTIST_SLUGS = ['kate-zubok', 'dj-marco', 'lina-m', 'samir-k', 'naya-sound', 'rami-b'];

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('Venues static roster links', () => {
  it.each(VENUES_PAGES)('%s static roster exposes no demo artist detail slugs', (path) => {
    const source = readProjectFile(path);
    for (const slug of DEMO_ARTIST_SLUGS) {
      // A `slug` field is what turns a static roster card into a
      // /kolasi/artists/<slug> link, so none of the demo slugs may be present.
      expect(source).not.toContain(`slug: '${slug}'`);
    }
  });

  it('VenuesClient still links real CMS artists that have a slug', () => {
    const source = readProjectFile(VENUES_CLIENT);
    expect(source).toContain('/kolasi/artists/${artist.slug}');
    expect(source).toContain('artist.slug ?');
  });

  it('VenuesClient keeps venue conversion paths', () => {
    const source = readProjectFile(VENUES_CLIENT);
    expect(source).toContain('#venue-form');
    expect(source).toContain('handleWhatsApp');
    expect(source).toContain('calendlyUrl');
  });
});
