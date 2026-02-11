'use client';
import Script from 'next/script';
import { useAnalyticsConsent } from '@/components/ui/CookieConsent';

export function GoogleAnalytics() {
  const consent = useAnalyticsConsent();
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  if (!gaId || !consent) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
