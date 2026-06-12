import React from 'react';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { AudioPlayerProvider } from '@/components/providers/AudioPlayerProvider';
import { OrganizationJsonLd, PersonJsonLd } from '@/components/JsonLd';
import { getDictionary, type Locale } from '@/lib/i18n';
import { ClientEffects } from '@/components/layout/ClientEffects';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
});

export default function SiteShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const copy = getDictionary(locale);

  return (
    <html lang={locale} className={`dark ${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <Head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        <link rel="dns-prefetch" href="https://image.mux.com" />
        <link rel="alternate" type="application/rss+xml" title="Samuell Goldfinch Journal" href="/feed.xml" />
      </Head>
      <Script id="theme-init" strategy="afterInteractive">
        {`
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'light') {
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
            }
          })();
        `}
      </Script>
      <body className="site-scope antialiased overflow-x-hidden" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#c8a96e] focus:text-[#09090b] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          {copy.shell.skip}
        </a>
        <OrganizationJsonLd />
        <PersonJsonLd />
        <AudioPlayerProvider>
          <div className="relative min-h-screen">
            <ClientEffects />
            <Header locale={locale} />
            <PageTransition>
              <main id="main-content" className="relative z-10">{children}</main>
            </PageTransition>
            <Footer locale={locale} />
          </div>
        </AudioPlayerProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
