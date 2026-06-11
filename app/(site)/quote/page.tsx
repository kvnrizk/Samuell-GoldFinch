import QuoteClient from './QuoteClient';
import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

const meta = getDictionary('en').metadata;

export const metadata = buildPageMetadata({
  title: meta.quoteTitle,
  description: meta.quoteDescription,
  path: '/quote',
  languages: { en: '/quote', fr: '/fr/quote' },
});

export default function QuotePage() {
  return <QuoteClient locale="en" />;
}
