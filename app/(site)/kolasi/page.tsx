import type { Metadata } from 'next';
import KolasiClient from './KolasiClient';

export const metadata: Metadata = {
  title: 'Kolasi Agency — DJ Booking, Event Curation & Content | Samuell Goldfinch',
  description: 'Creative booking and talent agency. DJ & live show booking, event curation, and content creation across Europe and the Middle East.',
};

export const revalidate = 60;

export default function KolasiPage() {
  return <KolasiClient />;
}
