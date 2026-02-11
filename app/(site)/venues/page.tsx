import type { Metadata } from 'next';
import { getVenuePackages, getCaseStudies, getVenueFAQ, getArtists, getGlobalSettings } from '@/lib/fetchers';
import VenuesClient from './VenuesClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'For Venues — DJ Programming & Event Curation',
  description:
    'Give your venue a weekly identity. Curated DJ programming, content production, and brand strategy for bars, clubs, and restaurants across Paris.',
  alternates: { canonical: '/venues' },
  openGraph: {
    title: 'For Venues — Samuell Goldfinch',
    description:
      'Give your venue a weekly identity. Curated DJ programming, content production, and brand strategy.',
  },
};

export default async function VenuesPage() {
  const [packages, caseStudies, faq, artists, settings] = await Promise.all([
    getVenuePackages(),
    getCaseStudies(),
    getVenueFAQ(),
    getArtists(),
    getGlobalSettings(),
  ]);

  /* eslint-disable @typescript-eslint/no-explicit-any -- Payload returns generic JsonObject types */
  return (
    <VenuesClient
      packages={packages as any}
      caseStudies={caseStudies as any}
      faq={faq as any}
      artists={artists as any}
      calendlyUrl={(settings as Record<string, string>).calendlyUrl || 'https://calendly.com/samuellgoldfinch/venue-discovery'}
      whatsappNumber={(settings as Record<string, string>).whatsappNumber || '+33605883966'}
    />
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
