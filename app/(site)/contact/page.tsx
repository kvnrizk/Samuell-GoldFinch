import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact — Get in Touch',
  description: 'Get in touch for wedding films, DJ bookings, event curation, or creative production. We respond within 48 hours.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
