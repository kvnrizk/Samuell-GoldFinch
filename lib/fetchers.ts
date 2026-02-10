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

export async function getPageSeo(slug: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] || null;
}
