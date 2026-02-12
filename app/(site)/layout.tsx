import React from 'react';
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

export default function SiteLayout({ children }: { children: React.ReactNode }) {
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
        <AudioPlayerProvider>
          <div className="relative min-h-screen">
            <CustomCursor />
            <CursorHalo />
            <AnimatedBackground />
            <Header />
            <PageTransition>
              <main id="main-content" className="relative z-10">{children}</main>
            </PageTransition>
            <Footer />
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
