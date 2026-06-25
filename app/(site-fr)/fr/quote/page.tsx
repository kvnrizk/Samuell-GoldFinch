import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import QuoteClient from '../../../(site)/quote/QuoteClient';

const meta = getDictionary('fr').metadata;

export const metadata: Metadata = {
  title: meta.quoteTitle,
  description: meta.quoteDescription,
  alternates: {
    canonical: '/fr/quote',
    languages: { en: '/quote', fr: '/fr/quote' },
  },
  openGraph: { locale: meta.ogLocale },
};

export default function FrenchQuotePage() {
  return <QuoteClient locale="fr" />;
}
