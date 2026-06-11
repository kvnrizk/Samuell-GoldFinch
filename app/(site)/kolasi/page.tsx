import type { Metadata } from 'next';
import { getAllKolasiEvents, getFeaturedArtists, getFeaturedTestimonials, getUpcomingEvents } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import { buildPageMetadata } from '@/lib/seo';
import KolasiClient from './KolasiClient';

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'Kolasi Agency - DJ Booking, Event Curation & Content',
  description: 'Creative booking and talent agency. DJ & live show booking, event curation, and content creation across Europe and the Middle East.',
  path: '/kolasi',
});

export default async function KolasiPage() {
  const [events, artists, testimonials, upcomingEvents] = await Promise.all([
    safeCms(getAllKolasiEvents(), [], 'kolasi events'),
    safeCms(getFeaturedArtists(), [], 'kolasi artists'),
    safeCms(getFeaturedTestimonials('kolasi'), [], 'kolasi testimonials'),
    safeCms(getUpcomingEvents(), [], 'kolasi upcoming events'),
  ]);
  return <KolasiClient events={events as any} artists={artists as any} testimonials={testimonials as any} upcomingEvents={upcomingEvents as any} />;
}
