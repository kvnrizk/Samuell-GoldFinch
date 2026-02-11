import type { Metadata } from 'next';
import { getGlobalSettings, getFeaturedBlazeProjects, getFeaturedKolasiEvents, getFeaturedArtists } from '@/lib/fetchers';
import HomeClient from './HomeClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  return {
    title: settings.seoDefaults?.defaultTitle || 'Samuell Goldfinch — Creative Director · Filmmaker · DJ',
    description: settings.seoDefaults?.defaultDescription || 'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
  };
}

export default async function HomePage() {
  const [settings, blazeProjects, kolasiEvents, artists] = await Promise.all([
    getGlobalSettings(),
    getFeaturedBlazeProjects(6),
    getFeaturedKolasiEvents(4),
    getFeaturedArtists(),
  ]);

  /* eslint-disable @typescript-eslint/no-explicit-any -- Payload returns generic JsonObject types */
  return (
    <HomeClient
      settings={settings as any}
      blazeProjects={blazeProjects as any}
      kolasiEvents={kolasiEvents as any}
      artists={artists as any}
    />
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
