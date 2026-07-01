import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Demo article slugs that must never be served as real public journal content.
const DEMO_POST_SLUGS = [
  'behind-the-scenes-beirut-wedding',
  '5-questions-wedding-videographer',
  'art-of-nightlife-programming',
  'kolasi-season-3',
  'embassy-of-lebanon-bts',
];

const journalSurfaces = [
  'app/(site)/journal/[slug]/page.tsx',
  'app/(site)/journal/page.tsx',
  'app/feed.xml/route.ts',
];

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('public journal fallback proof', () => {
  it.each(journalSurfaces)('%s exposes no static/demo journal posts', (path) => {
    const source = readProjectFile(path);
    expect(source).not.toContain('staticPosts');
    expect(source).not.toContain('staticAllPosts');
    for (const slug of DEMO_POST_SLUGS) {
      expect(source).not.toContain(slug);
    }
  });

  it('journal detail route is CMS-only and returns notFound() when missing', () => {
    const source = readProjectFile('app/(site)/journal/[slug]/page.tsx');
    expect(source).toContain('getPostBySlug');
    expect(source).toContain('getAllPosts');
    expect(source).toContain('notFound()');
  });
});
