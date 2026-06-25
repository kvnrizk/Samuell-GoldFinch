import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { getDictionary } from '@/lib/i18n';

const meta = getDictionary('en').metadata;

export const metadata: Metadata = {
  title: meta.contactTitle,
  description: meta.contactDescription,
  alternates: {
    canonical: '/contact',
    languages: { en: '/contact', fr: '/fr/contact' },
  },
  openGraph: { locale: meta.ogLocale },
};

export default function ContactPage() {
  return <ContactClient locale="en" />;
}
