import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Fabricated demo personas that must not appear as real credentials/proof.
const DEMO_PERSONA_NAMES = [
  'Kate Zubok',
  'DJ Marco',
  'Naya Sound',
  'Samir K',
  'Lina M',
  'Rami B',
  'Alex D',
  'Yasmine K',
];

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('static proof cleanup', () => {
  it('homepage collaborations expose no fabricated artist credentials', () => {
    const source = readProjectFile('app/(site)/home-content.ts');
    for (const name of DEMO_PERSONA_NAMES) {
      expect(source).not.toContain(name);
    }
    // Real collaborations remain (guard against over-removal).
    expect(source).toContain('Elie Saab');
    expect(source).toContain('STOUH BEIRUT');
  });

  it('showreel exposes no fabricated artist proof', () => {
    const source = readProjectFile('app/(site)/showreel/page.tsx');
    for (const name of DEMO_PERSONA_NAMES) {
      expect(source).not.toContain(name);
    }
  });

  it.each([
    'app/(site)/venues/page.tsx',
    'app/(site-fr)/fr/venues/page.tsx',
  ])('%s no longer ships a fabricated fallback roster', (path) => {
    const source = readProjectFile(path);
    expect(source).not.toContain('staticRoster');
    for (const name of DEMO_PERSONA_NAMES) {
      expect(source).not.toContain(name);
    }
  });
});
