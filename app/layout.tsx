import type { Metadata } from 'next';
import './globals.css';
import { getDictionary, siteUrl } from '@/lib/i18n';

const meta = getDictionary('en').metadata;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: meta.homeTitle,
    template: '%s | Samuell Goldfinch',
  },
  description: meta.homeDescription,
  alternates: {
    canonical: siteUrl,
    languages: {
      en: siteUrl,
      fr: `${siteUrl}/fr`,
    },
  },
  openGraph: {
    title: meta.homeTitle,
    description: meta.homeDescription,
    type: 'website',
    url: siteUrl,
    siteName: 'Samuell Goldfinch',
    locale: meta.ogLocale,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Samuell Goldfinch - Creative Director, Filmmaker, DJ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
