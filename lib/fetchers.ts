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

export async function getArtistsByCategory(category: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'artists',
    where: { rosterCategory: { equals: category } },
    sort: 'name',
    limit: 20,
  });
  return result.docs;
}

export async function getPageSeo(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] || null;
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
  const all = await getAllKolasiEvents();
  const idx = all.findIndex((e: any) => e.slug === currentSlug);
  return {
    prev: idx > 0 ? all[idx - 1] : all[all.length - 1],
    next: idx < all.length - 1 ? all[idx + 1] : all[0],
  };
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
  const all = await getAllBlazeProjects();
  const idx = all.findIndex((p: any) => p.slug === currentSlug);
  return {
    prev: idx > 0 ? all[idx - 1] : all[all.length - 1],
    next: idx < all.length - 1 ? all[idx + 1] : all[0],
  };
}

export async function getAllPosts(category?: string, limit = 12) {
  const payload = await getPayload();
  const where: any = { publishedAt: { less_than_equal: new Date().toISOString() } };
  if (category) where.category = { equals: category };
  const result = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit,
    depth: 2,
  });
  return result.docs;
}

export async function getPostBySlug(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getRelatedPosts(category: string, excludeSlug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { category: { equals: category } },
        { slug: { not_equals: excludeSlug } },
      ],
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 2,
  });
  return result.docs;
}

export async function getUpcomingEvents(limit = 10) {
  const payload = await getPayload();
  const now = new Date().toISOString();
  const result = await payload.find({
    collection: 'kolasi-events',
    where: {
      and: [
        { date: { greater_than: now } },
        { status: { equals: 'upcoming' } },
      ],
    },
    sort: 'date',
    limit,
    depth: 2,
  });
  return result.docs;
}

export async function getPressKit() {
  const payload = await getPayload();
  return payload.findGlobal({ slug: 'press-kit', depth: 2 });
}

export async function getFeaturedTestimonials(brand?: string) {
  const payload = await getPayload();
  const where: any = { featured: { equals: true } };
  if (brand) where.brand = { equals: brand };
  const result = await payload.find({
    collection: 'testimonials',
    where,
    sort: 'sortOrder',
    limit: 12,
    depth: 2,
  });
  return result.docs;
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
  const all = await getArtists();
  const idx = all.findIndex((a: any) => a.slug === currentSlug);
  return {
    prev: idx > 0 ? all[idx - 1] : all[all.length - 1],
    next: idx < all.length - 1 ? all[idx + 1] : all[0],
  };
}
