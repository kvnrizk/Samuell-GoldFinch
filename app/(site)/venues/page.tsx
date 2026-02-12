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

/* ── Static fallback roster (until CMS is seeded) ── */
const staticRoster = [
  { id: 'kate-zubok', name: 'Kate Zubok', slug: 'kate-zubok', photo: { url: '/assets/kolasi/artists/artist-1.jpg' }, genre: 'Deep House · Melodic Techno', rosterCategory: 'resident' },
  { id: 'dj-marco', name: 'DJ Marco', slug: 'dj-marco', photo: { url: '/assets/kolasi/artists/artist-2.jpg' }, genre: 'Afro House · Progressive', rosterCategory: 'resident' },
  { id: 'lina-m', name: 'Lina M', slug: 'lina-m', photo: { url: '/assets/kolasi/artists/IMG_6476.JPG' }, genre: 'Melodic House · Indie Dance', rosterCategory: 'resident' },
  { id: 'samir-k', name: 'Samir K', slug: 'samir-k', photo: { url: '/assets/kolasi/artists/artist-4.JPG' }, genre: 'Techno · Industrial', rosterCategory: 'headliner' },
  { id: 'naya-sound', name: 'Naya Sound', slug: 'naya-sound', photo: { url: '/assets/kolasi/artists/artist-3.JPG' }, genre: 'Live Act · Electronic Fusion', rosterCategory: 'live-act' },
  { id: 'rami-b', name: 'Rami B', slug: 'rami-b', photo: { url: '/assets/kolasi/artists/IMG_6733.jpg' }, genre: 'DJ + Live Vocals', rosterCategory: 'hybrid' },
  { id: 'alex-d', name: 'Alex D', photo: { url: '/assets/kolasi/artists/4F8A3682.jpg' }, genre: 'Tech House · Minimal', rosterCategory: 'resident' },
  { id: 'yasmine-k', name: 'Yasmine K', photo: { url: '/assets/kolasi/images/4F8A2882.jpg' }, genre: 'Organic House · Downtempo', rosterCategory: 'headliner' },
];

export default async function VenuesPage() {
  const [packages, caseStudies, faq, cmsArtists, settings] = await Promise.all([
    getVenuePackages(),
    getCaseStudies(),
    getVenueFAQ(),
    getArtists(),
    getGlobalSettings(),
  ]);

  const artists = (cmsArtists as any[]).length > 0 ? cmsArtists : staticRoster;

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
