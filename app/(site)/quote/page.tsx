import type { Metadata } from 'next';
import QuoteClient from './QuoteClient';
import { getDictionary } from '@/lib/i18n';

const meta = getDictionary('en').metadata;

export const metadata: Metadata = {
  title: meta.quoteTitle,
  description: meta.quoteDescription,
  alternates: {
    canonical: '/quote',
    languages: { en: '/quote', fr: '/fr/quote' },
  },
  openGraph: { locale: meta.ogLocale },
};

export default function QuotePage() {
  return <QuoteClient locale="en" />;
}
