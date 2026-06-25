import type { Metadata } from 'next';
import { getAllKolasiEvents, getUpcomingEvents } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import KolasiClient from './KolasiClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kolasi Agency — DJ Booking, Event Curation & Content',
  description: 'Creative booking and talent agency. DJ & live show booking, event curation, and content creation across Europe and the Middle East.',
  alternates: { canonical: '/kolasi' },
};

export default async function KolasiPage() {
  const [events, upcomingEvents] = await Promise.all([
    safeCms(getAllKolasiEvents(), [], 'kolasi events'),
    safeCms(getUpcomingEvents(), [], 'kolasi upcoming events'),
  ]);
  return <KolasiClient events={events as any} upcomingEvents={upcomingEvents as any} />;
}
