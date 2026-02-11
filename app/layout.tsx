import type { Metadata } from 'next';
import './globals.css';
import { GoogleAnalytics } from '@/components/Analytics';
import { MetaPixel } from '@/components/MetaPixel';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { OrganizationJsonLd, PersonJsonLd } from '@/components/JsonLd';

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
        url: `${SITE_URL}/assets/about/IMG_5840.JPG`,
        width: 1200,
        height: 630,
        alt: 'Samuell Goldfinch — Creative Director, Filmmaker, DJ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${SITE_URL}/assets/about/IMG_5840.JPG`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        <link rel="dns-prefetch" href="https://image.mux.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#c8a96e] focus:text-[#09090b] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <OrganizationJsonLd />
        <PersonJsonLd />
        {children}
        <div className="grain" aria-hidden="true" />
        <GoogleAnalytics />
        <MetaPixel />
        <CookieConsent />
      </body>
    </html>
  );
}
