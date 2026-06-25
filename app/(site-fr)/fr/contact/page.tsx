import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import ContactClient from '../../../(site)/contact/ContactClient';

const meta = getDictionary('fr').metadata;

export const metadata: Metadata = {
  title: meta.contactTitle,
  description: meta.contactDescription,
  alternates: {
    canonical: '/fr/contact',
    languages: { en: '/contact', fr: '/fr/contact' },
  },
  openGraph: { locale: meta.ogLocale },
};

export default function FrenchContactPage() {
  return <ContactClient locale="fr" />;
}
