import React from 'react';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import CursorHalo from '@/components/ui/CursorHalo';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { PageTransition } from '@/components/ui/PageTransition';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import { AudioPlayerProvider } from '@/components/providers/AudioPlayerProvider';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { GoogleAnalytics } from '@/components/Analytics';
import { MetaPixel } from '@/components/MetaPixel';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { OrganizationJsonLd, PersonJsonLd } from '@/components/JsonLd';
import { getDictionary, type Locale } from '@/lib/i18n';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal'],
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] sg-skip-link focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          {copy.shell.skip}
        </a>
        <OrganizationJsonLd />
        <PersonJsonLd />
        <AudioPlayerProvider>
          <div className="relative min-h-screen">
            <CustomCursor />
            <CursorHalo />
            <AnimatedBackground />
            <Header locale={locale} />
            <PageTransition>
              <main id="main-content" className="relative z-10">{children}</main>
            </PageTransition>
            <Footer locale={locale} />
            <WhatsAppFloat />
            <AudioPlayer />
          </div>
        </AudioPlayerProvider>
        <div className="grain" aria-hidden="true" />
        <GoogleAnalytics />
        <MetaPixel />
        <CookieConsent />
      </body>
    </html>
  );
}
