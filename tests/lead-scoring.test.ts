import { describe, expect, it } from 'vitest';
import { calculateInquiryScore, calculateVenueScore, parseBudgetRange } from '../lib/lead-scoring';

describe('lead scoring helpers', () => {
  it('parses freeform budget ranges', () => {
    expect(parseBudgetRange('EUR 5,000-10,000')).toEqual({
      min: 5000,
      max: 10000,
      tier: '5k-10k',
    });
  });

  it('scores detailed high-budget inquiries above sparse low-budget inquiries', () => {
    const high = calculateInquiryScore({
      email: 'lead@example.com',
      phone: '+33123456789',
      service: 'wedding-film',
      budget: '10k+',
      eventDate: 'asap',
      details: 'A'.repeat(600),
    });
    const low = calculateInquiryScore({
      email: 'lead@example.com',
      budget: 'under 2000',
      details: 'short',
    });

    expect(high.score).toBeGreaterThan(low.score);
    expect(high.tier).toBe('hot');
  });

  it('scores qualified venue budgets above under-budget venues', () => {
    const qualified = calculateVenueScore({
      monthlyBudget: '10k-plus',
      capacity: 500,
      decisionMaker: 'owner',
      timeline: 'asap',
      goal: ['more-tables', 'better-crowd', 'stronger-brand'],
      hasDancePocket: true,
      instagram: '@venue',
    });
    const underBudget = calculateVenueScore({
      monthlyBudget: 'under-2k',
    });

    expect(qualified.score).toBeGreaterThan(underBudget.score);
    expect(qualified.annualValue).toBeGreaterThan(underBudget.annualValue);
  });
});
