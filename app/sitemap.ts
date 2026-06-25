import type { MetadataRoute } from 'next';
import { getVenueSEOPages, getCaseStudies, getAllBlazeProjects, getAllKolasiEvents, getArtists, getAllPosts } from '@/lib/fetchers';

interface CMSDoc {
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuellgoldfinch.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ── Static routes ─────────────────────────────────── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/fr`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blaze`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/kolasi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/venues`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/fr/venues`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/fr/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/quote`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/fr/quote`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/showreel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/press`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  /* ── Dynamic CMS routes ────────────────────────────── */
  const [seoPages, caseStudies, blazeProjects, kolasiEvents, artists, posts] = await Promise.all([
    getVenueSEOPages().catch(() => [] as CMSDoc[]),
    getCaseStudies().catch(() => [] as CMSDoc[]),
    getAllBlazeProjects().catch(() => [] as CMSDoc[]),
    getAllKolasiEvents().catch(() => [] as CMSDoc[]),
    getArtists().catch(() => [] as CMSDoc[]),
    getAllPosts().catch(() => [] as CMSDoc[]),
  ]);

  const seoPageRoutes: MetadataRoute.Sitemap = (seoPages as CMSDoc[]).map((p) => ({
    url: `${BASE_URL}/venues/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = (caseStudies as CMSDoc[]).map((cs) => ({
    url: `${BASE_URL}/venues/case-studies/${cs.slug}`,
    lastModified: new Date(cs.updatedAt || cs.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blazeRoutes: MetadataRoute.Sitemap = (blazeProjects as CMSDoc[])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/blaze/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const kolasiRoutes: MetadataRoute.Sitemap = (kolasiEvents as CMSDoc[])
    .filter((e) => e.slug)
    .map((e) => ({
      url: `${BASE_URL}/kolasi/${e.slug}`,
      lastModified: new Date(e.updatedAt || e.createdAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const artistRoutes: MetadataRoute.Sitemap = (artists as CMSDoc[])
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${BASE_URL}/kolasi/artists/${a.slug}`,
      lastModified: new Date(a.updatedAt || a.createdAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const postRoutes: MetadataRoute.Sitemap = (posts as CMSDoc[])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/journal/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...seoPageRoutes, ...caseStudyRoutes, ...blazeRoutes, ...kolasiRoutes, ...artistRoutes, ...postRoutes];
}
