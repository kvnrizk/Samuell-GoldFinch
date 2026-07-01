import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const KOLASI_LANDING = 'app/(site)/kolasi/KolasiClient.tsx';

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('Kolasi landing links', () => {
  const source = readProjectFile(KOLASI_LANDING);

  it('does not expose demo event detail links from static showcase clips', () => {
    // The event detail route is CMS-only and returns notFound() for unknown
    // slugs, so the static promo clips must not link to these demo slugs.
    expect(source).not.toContain('/kolasi/${clip.slug}');
    expect(source).not.toContain('clip.slug');
    expect(source).not.toContain('/kolasi/le-speakeasy');
    expect(source).not.toContain('/kolasi/2nd-sun');
    expect(source).not.toContain('/kolasi/kolasi-nights');
  });

  it('keeps real conversion CTAs to valid routes', () => {
    expect(source).toContain('/venues');
    expect(source).toContain('/contact');
  });
});
