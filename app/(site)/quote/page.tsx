import type { Metadata } from 'next';
import QuoteClient from './QuoteClient';

export const metadata: Metadata = {
  title: 'Request a Bespoke Quote — Samuell Goldfinch',
  description: 'Share your vision for a wedding film, curated event, or live performance. Tailored production and experiences.',
};

export default function QuotePage() {
  return <QuoteClient />;
}
