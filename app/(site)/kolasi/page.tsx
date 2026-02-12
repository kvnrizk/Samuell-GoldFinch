import type { Metadata } from 'next';
import { getAllKolasiEvents, getFeaturedArtists, getFeaturedTestimonials, getUpcomingEvents } from '@/lib/fetchers';
import KolasiClient from './KolasiClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kolasi Agency — DJ Booking, Event Curation & Content',
  description: 'Creative booking and talent agency. DJ & live show booking, event curation, and content creation across Europe and the Middle East.',
  alternates: { canonical: '/kolasi' },
};

export default async function KolasiPage() {
  const [events, artists, testimonials, upcomingEvents] = await Promise.all([
    getAllKolasiEvents(),
    getFeaturedArtists(),
    getFeaturedTestimonials('kolasi').catch(() => []),
    getUpcomingEvents().catch(() => []),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Payload returns generic JsonObject types
  return <KolasiClient events={events as any} artists={artists as any} testimonials={testimonials as any} upcomingEvents={upcomingEvents as any} />;
}
