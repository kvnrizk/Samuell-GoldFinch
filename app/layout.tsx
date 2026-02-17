import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuellgoldfinch.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Samuell Goldfinch — Creative Director · Filmmaker · DJ',
    template: '%s | Samuell Goldfinch',
  },
  description:
    'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Samuell Goldfinch — Creative Director · Filmmaker · DJ',
    description:
      'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Samuell Goldfinch',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Samuell Goldfinch — Creative Director, Filmmaker, DJ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
