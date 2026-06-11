import type { Metadata } from 'next';
import { getGlobalSettings, getFeaturedBlazeProjects, getFeaturedKolasiEvents, getFeaturedArtists, getFeaturedTestimonials } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import HomeClient from './HomeClient';
import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60;

const fallbackSettings = {
  seoDefaults: {
    defaultTitle: 'Samuell Goldfinch - Creative Director, Filmmaker, DJ',
    defaultDescription: 'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await safeCms(getGlobalSettings() as Promise<typeof fallbackSettings>, fallbackSettings, 'home metadata');
  const meta = getDictionary('en').metadata;
  return buildPageMetadata({
    title: settings.seoDefaults?.defaultTitle || meta.homeTitle,
    description: settings.seoDefaults?.defaultDescription || meta.homeDescription,
    path: '/',
    languages: { en: '/', fr: '/fr' },
  });
}

export default async function HomePage() {
  const [settings, blazeProjects, kolasiEvents, artists, testimonials] = await Promise.all([
    safeCms(getGlobalSettings() as Promise<typeof fallbackSettings>, fallbackSettings, 'home settings'),
    safeCms(getFeaturedBlazeProjects(6), [], 'home blaze projects'),
    safeCms(getFeaturedKolasiEvents(4), [], 'home kolasi events'),
    safeCms(getFeaturedArtists(), [], 'home artists'),
    safeCms(getFeaturedTestimonials(), [], 'home testimonials'),
  ]);

  return (
    <HomeClient
      settings={settings as any}
      blazeProjects={blazeProjects as any}
      kolasiEvents={kolasiEvents as any}
      artists={artists as any}
      testimonials={testimonials as any}
      locale="en"
    />
  );
}
