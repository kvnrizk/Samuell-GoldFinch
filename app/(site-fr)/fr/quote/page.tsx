import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import QuoteClient from '../../../(site)/quote/QuoteClient';

const meta = getDictionary('fr').metadata;

export const metadata = buildPageMetadata({
  title: meta.quoteTitle,
  description: meta.quoteDescription,
  path: '/fr/quote',
  locale: 'fr',
  languages: { en: '/quote', fr: '/fr/quote' },
});

export default function FrenchQuotePage() {
  return <QuoteClient locale="fr" />;
}
