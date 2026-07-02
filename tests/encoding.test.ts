import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Byte sequences that only appear when UTF-8 is mis-decoded as Latin-1
// (mojibake). None of these occur in correctly-encoded source.
const MOJIBAKE = ['ðŸ', 'â€', 'Ã©', 'Ã¨', 'Ã ', 'Ã§', 'Ã´', 'Ã®', 'Ã¢', 'âœ'];

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx)$/.test(entry)) acc.push(full);
  }
  return acc;
}

describe('source encoding', () => {
  const files = ['app', 'lib'].flatMap((d) => walk(join(process.cwd(), d)));

  it('has no UTF-8 mojibake in app/ or lib/ sources', () => {
    const offenders: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      for (const m of MOJIBAKE) {
        if (src.includes(m)) offenders.push(`${f} → "${m}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('quote service icons use real emoji', () => {
    const src = readFileSync(join(process.cwd(), 'app/(site)/quote/quote-content.ts'), 'utf8');
    expect(src).toContain('🎬');
    expect(src).toContain('✨');
  });
});
