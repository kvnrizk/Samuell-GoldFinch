import type { Metadata } from 'next';
import { getGlobalSettings, getFeaturedBlazeProjects, getFeaturedKolasiEvents, getFeaturedArtists, getFeaturedTestimonials } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import HomeClient from '../../(site)/HomeClient';

export const revalidate = 60;

const fallbackSettings = {
  seoDefaults: {
    defaultTitle: getDictionary('fr').metadata.homeTitle,
    defaultDescription: getDictionary('fr').metadata.homeDescription,
  },
};

export const metadata: Metadata = buildPageMetadata({
  title: getDictionary('fr').metadata.homeTitle,
  description: getDictionary('fr').metadata.homeDescription,
  path: '/fr',
  locale: 'fr',
  languages: { en: '/', fr: '/fr' },
});

export default async function FrenchHomePage() {
  const [settings, blazeProjects, kolasiEvents, artists, testimonials] = await Promise.all([
    safeCms(getGlobalSettings() as Promise<typeof fallbackSettings>, fallbackSettings, 'fr home settings'),
    safeCms(getFeaturedBlazeProjects(6), [], 'fr home blaze projects'),
    safeCms(getFeaturedKolasiEvents(4), [], 'fr home kolasi events'),
    safeCms(getFeaturedArtists(), [], 'fr home artists'),
    safeCms(getFeaturedTestimonials(), [], 'fr home testimonials'),
  ]);

  return (
    <HomeClient
      settings={settings as any}
      blazeProjects={blazeProjects as any}
      kolasiEvents={kolasiEvents as any}
      artists={artists as any}
      testimonials={testimonials as any}
      locale="fr"
    />
  );
}
