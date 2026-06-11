import type { Metadata } from 'next';
import { getVenuePackages, getCaseStudies, getVenueFAQ, getArtists, getGlobalSettings } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import VenuesClient from './VenuesClient';
import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60;

const meta = getDictionary('en').metadata;

export const metadata: Metadata = buildPageMetadata({
  title: meta.venuesTitle,
  description: meta.venuesDescription,
  path: '/venues',
  languages: { en: '/venues', fr: '/fr/venues' },
});

/* ── Static fallback roster (until CMS is seeded) ── */
const staticRoster = [
  { id: 'kate-zubok', name: 'Kate Zubok', slug: 'kate-zubok', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364188/sg-platform/static/assets/kolasi/artists/artist-1.jpg' }, genre: 'Deep House · Melodic Techno', rosterCategory: 'resident' },
  { id: 'dj-marco', name: 'DJ Marco', slug: 'dj-marco', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364228/sg-platform/static/assets/kolasi/artists/artist-2.jpg' }, genre: 'Afro House · Progressive', rosterCategory: 'resident' },
  { id: 'lina-m', name: 'Lina M', slug: 'lina-m', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364222/sg-platform/static/assets/kolasi/artists/IMG_6476.jpg' }, genre: 'Melodic House · Indie Dance', rosterCategory: 'resident' },
  { id: 'samir-k', name: 'Samir K', slug: 'samir-k', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364243/sg-platform/static/assets/kolasi/artists/artist-4.jpg' }, genre: 'Techno · Industrial', rosterCategory: 'headliner' },
  { id: 'naya-sound', name: 'Naya Sound', slug: 'naya-sound', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364230/sg-platform/static/assets/kolasi/artists/artist-3.jpg' }, genre: 'Live Act · Electronic Fusion', rosterCategory: 'live-act' },
  { id: 'rami-b', name: 'Rami B', slug: 'rami-b', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364210/sg-platform/static/assets/kolasi/artists/IMG_6733.jpg' }, genre: 'DJ + Live Vocals', rosterCategory: 'hybrid' },
  { id: 'alex-d', name: 'Alex D', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364184/sg-platform/static/assets/kolasi/artists/4F8A3682.jpg' }, genre: 'Tech House · Minimal', rosterCategory: 'resident' },
  { id: 'yasmine-k', name: 'Yasmine K', photo: { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364262/sg-platform/static/assets/kolasi/images/4F8A2882.jpg' }, genre: 'Organic House · Downtempo', rosterCategory: 'headliner' },
];

const fallbackSettings = {
  calendlyUrl: 'https://calendly.com/samuellgoldfinch/venue-discovery',
  whatsappNumber: '+33605883966',
};

export default async function VenuesPage() {
  const [packages, caseStudies, faq, cmsArtists, settings] = await Promise.all([
    safeCms(getVenuePackages(), [], 'venue packages'),
    safeCms(getCaseStudies(), [], 'venue case studies'),
    safeCms(getVenueFAQ(), [], 'venue faq'),
    safeCms(getArtists(), [], 'venue artists'),
    safeCms(getGlobalSettings() as unknown as Promise<Record<string, string>>, fallbackSettings, 'venue settings'),
  ]);

  const artists = (cmsArtists as any[]).length > 0 ? cmsArtists : staticRoster;

  return (
    <VenuesClient
      packages={packages as any}
      caseStudies={caseStudies as any}
      faq={faq as any}
      artists={artists as any}
      calendlyUrl={settings.calendlyUrl || 'https://calendly.com/samuellgoldfinch/venue-discovery'}
      whatsappNumber={settings.whatsappNumber || '+33605883966'}
      locale="en"
    />
  );
}
