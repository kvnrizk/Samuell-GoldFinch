import { getPayload } from './payload';

export async function getGlobalSettings() {
  const payload = await getPayload();
  return payload.findGlobal({ slug: 'global-settings' });
}

export async function getFeaturedBlazeProjects(limit = 6) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'blaze-projects',
    where: { featured: { equals: true } },
    sort: '-date',
    limit,
  });
  return result.docs;
}

export async function getAllBlazeProjects() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'blaze-projects',
    sort: '-date',
    limit: 50,
  });
  return result.docs;
}

export async function getFeaturedKolasiEvents(limit = 6) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'kolasi-events',
    where: { featured: { equals: true } },
    sort: '-date',
    limit,
  });
  return result.docs;
}

export async function getAllKolasiEvents() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'kolasi-events',
    sort: '-date',
    limit: 50,
  });
  return result.docs;
}

export async function getArtists() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'artists',
    sort: 'name',
    limit: 50,
  });
  return result.docs;
}

export async function getFeaturedArtists() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'artists',
    where: { featured: { equals: true } },
    sort: 'name',
    limit: 20,
  });
  return result.docs;
}

export async function getMilestones() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'milestones',
    sort: 'sortOrder',
    limit: 20,
  });
  return result.docs;
}

export async function getVenuePackages() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'venue-packages',
    sort: 'sortOrder',
    limit: 10,
  });
  return result.docs;
}

export async function getCaseStudies() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'case-studies',
    sort: 'sortOrder',
    limit: 20,
  });
  return result.docs;
}

export async function getCaseStudyBySlug(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] || null;
}

export async function getVenueFAQ() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'venue-faq',
    sort: 'sortOrder',
    limit: 20,
  });
  return result.docs;
}

export async function getVenueSEOPages() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'venue-seo-pages',
    sort: 'sortOrder',
    limit: 20,
  });
  return result.docs;
}

export async function getVenueSEOPageBySlug(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'venue-seo-pages',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] || null;
}

export async function getKolasiEventBySlug(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'kolasi-events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getAdjacentKolasiEvents(currentSlug: string) {
  return getAdjacentByDate('kolasi-events', currentSlug);
}

export async function getBlazeProjectBySlug(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'blaze-projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getAdjacentBlazeProjects(currentSlug: string) {
  return getAdjacentByDate('blaze-projects', currentSlug);
}

export async function getArtistBySlug(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'artists',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getEventsByArtist(artistId: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'kolasi-events',
    where: { artists: { contains: artistId } },
    sort: '-date',
    limit: 20,
  });
  return result.docs;
}

export async function getShowreel() {
  const payload = await getPayload();
  return payload.findGlobal({ slug: 'showreel', depth: 2 });
}

export async function getAdjacentArtists(currentSlug: string) {
  const payload = await getPayload();
  const current = await payload.find({
    collection: 'artists',
    where: { slug: { equals: currentSlug } },
    limit: 1,
    depth: 0,
  });
  const currentItem = current.docs[0];
  if (!currentItem) return { prev: null, next: null };

  const [newer, older, oldestWrap, newestWrap] = await Promise.all([
    payload.find({
      collection: 'artists',
      where: { name: { less_than: currentItem.name } },
      sort: '-name',
      limit: 1,
    }),
    payload.find({
      collection: 'artists',
      where: { name: { greater_than: currentItem.name } },
      sort: 'name',
      limit: 1,
    }),
    payload.find({ collection: 'artists', sort: '-name', limit: 1 }),
    payload.find({ collection: 'artists', sort: 'name', limit: 1 }),
  ]);

  return {
    prev: newer.docs[0] || oldestWrap.docs[0] || null,
    next: older.docs[0] || newestWrap.docs[0] || null,
  };
}

// ---- Cursor-based adjacency for date-sorted collections -------------------

async function getAdjacentByDate(
  collection: 'kolasi-events' | 'blaze-projects',
  currentSlug: string,
) {
  const payload = await getPayload();
  const current = await payload.find({
    collection,
    where: { slug: { equals: currentSlug } },
    limit: 1,
    depth: 0,
  });
  const currentItem = current.docs[0];
  if (!currentItem) return { prev: null, next: null };

  const currentDate = (currentItem as { date?: string }).date;
  if (!currentDate) return { prev: null, next: null };

  // Lists are sorted '-date' (newest first). "prev" in that UI is the newer
  // item (date > current). "next" is the older (date < current). Wrap at the
  // ends by falling back to oldest/newest.
  const [newer, older, oldestWrap, newestWrap] = await Promise.all([
    payload.find({
      collection,
      where: { date: { greater_than: currentDate } },
      sort: 'date',
      limit: 1,
    }),
    payload.find({
      collection,
      where: { date: { less_than: currentDate } },
      sort: '-date',
      limit: 1,
    }),
    payload.find({ collection, sort: 'date', limit: 1 }),
    payload.find({ collection, sort: '-date', limit: 1 }),
  ]);

  return {
    prev: newer.docs[0] || oldestWrap.docs[0] || null,
    next: older.docs[0] || newestWrap.docs[0] || null,
  };
}
