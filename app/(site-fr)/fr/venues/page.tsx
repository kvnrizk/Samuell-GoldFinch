import type { Metadata } from 'next';
import { getVenuePackages, getCaseStudies, getVenueFAQ, getArtists, getGlobalSettings } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import VenuesClient from '../../../(site)/venues/VenuesClient';
import { getDictionary } from '@/lib/i18n';

export const revalidate = 60;

const meta = getDictionary('fr').metadata;

export const metadata: Metadata = {
  title: meta.venuesTitle,
  description: meta.venuesDescription,
  alternates: {
    canonical: '/fr/venues',
    languages: { en: '/venues', fr: '/fr/venues' },
  },
  openGraph: {
    title: 'Pour les lieux - Samuell Goldfinch',
    description: meta.venuesDescription,
    locale: meta.ogLocale,
  },
};

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

  // CMS-only roster: never present fabricated demo artists as real proof.
  // VenuesClient shows a credible "Roster coming soon" empty state when empty.
  const artists = cmsArtists;

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
