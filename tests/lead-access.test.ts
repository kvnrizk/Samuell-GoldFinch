import { describe, expect, it } from 'vitest';

import { Inquiries } from '../collections/Inquiries';
import { VenueInquiries } from '../collections/VenueInquiries';

async function canCreate(collection: typeof Inquiries, user: unknown) {
  const create = collection.access?.create;
  if (typeof create !== 'function') return create;

  return create({ req: { user } } as Parameters<typeof create>[0]);
}

describe('lead collection access', () => {
  it('blocks anonymous direct Payload create for inquiries', async () => {
    await expect(canCreate(Inquiries, null)).resolves.toBe(false);
  });

  it('blocks anonymous direct Payload create for venue inquiries', async () => {
    await expect(canCreate(VenueInquiries, null)).resolves.toBe(false);
  });

  it('allows authenticated admin create for lead collections', async () => {
    const adminUser = { role: 'admin' };

    await expect(canCreate(Inquiries, adminUser)).resolves.toBe(true);
    await expect(canCreate(VenueInquiries, adminUser)).resolves.toBe(true);
  });
});