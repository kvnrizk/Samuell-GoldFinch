import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('venues page cleanup & polish', () => {
  it('tier cards no longer display pricing', () => {
    // The "Choose your tier" cards are tailored after a discovery call, so no
    // hardcoded prices should be shown.
    const pricingCard = readProjectFile('components/ui/PricingCard.tsx');
    expect(pricingCard).not.toContain('priceRange');

    const venues = readProjectFile('app/(site)/venues/VenuesClient.tsx');
    expect(venues).not.toContain('priceRange');
    expect(venues).not.toContain('From €');
  });

  it('venues page uses the ivory section scope, not gold accents', () => {
    const venues = readProjectFile('app/(site)/venues/VenuesClient.tsx');
    expect(venues).not.toContain('#c8a96e');
    expect(venues).toContain('venues-section');
  });
});
