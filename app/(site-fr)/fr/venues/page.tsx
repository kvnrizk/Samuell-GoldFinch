import type { Metadata } from 'next';
import { getVenuePackages, getCaseStudies, getVenueFAQ, getArtists, getGlobalSettings } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import VenuesClient from '../../../(site)/venues/VenuesClient';
import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { venueFallbackRoster } from '@/lib/fallback-media';

export const revalidate = 60;

const meta = getDictionary('fr').metadata;

export const metadata: Metadata = buildPageMetadata({
  title: meta.venuesTitle,
  description: meta.venuesDescription,
  path: '/fr/venues',
  locale: 'fr',
  languages: { en: '/venues', fr: '/fr/venues' },
});

const fallbackSettings = {
  calendlyUrl: 'https://calendly.com/samuellgoldfinch/venue-discovery',
  whatsappNumber: '+33605883966',
};

export default async function FrenchVenuesPage() {
  const [packages, caseStudies, faq, cmsArtists, settings] = await Promise.all([
    safeCms(getVenuePackages(), [], 'venue packages'),
    safeCms(getCaseStudies(), [], 'venue case studies'),
    safeCms(getVenueFAQ(), [], 'venue faq'),
    safeCms(getArtists(), [], 'venue artists'),
    safeCms(getGlobalSettings() as unknown as Promise<Record<string, string>>, fallbackSettings, 'venue settings'),
  ]);

  const artists = (cmsArtists as any[]).length > 0 ? cmsArtists : venueFallbackRoster;

  return (
    <VenuesClient
      packages={packages as any}
      caseStudies={caseStudies as any}
      faq={faq as any}
      artists={artists as any}
      calendlyUrl={settings.calendlyUrl || 'https://calendly.com/samuellgoldfinch/venue-discovery'}
      whatsappNumber={settings.whatsappNumber || '+33605883966'}
      locale="fr"
    />
  );
}
