import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuellgoldfinch.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/blaze', '/kolasi', '/about', '/contact', '/quote'];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
