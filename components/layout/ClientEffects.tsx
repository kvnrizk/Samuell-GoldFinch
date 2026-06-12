'use client';

import dynamic from 'next/dynamic';

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });
const CursorHalo = dynamic(() => import('@/components/ui/CursorHalo'), { ssr: false });
const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), { ssr: false });
const WhatsAppFloat = dynamic(() => import('@/components/ui/WhatsAppFloat'), { ssr: false });
const AudioPlayer = dynamic(() => import('@/components/ui/AudioPlayer'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/ui/CookieConsent').then((mod) => mod.CookieConsent), { ssr: false });
const GoogleAnalytics = dynamic(() => import('@/components/Analytics').then((mod) => mod.GoogleAnalytics), { ssr: false });
const MetaPixel = dynamic(() => import('@/components/MetaPixel').then((mod) => mod.MetaPixel), { ssr: false });

export function ClientEffects() {
  return (
    <>
      <CustomCursor />
      <CursorHalo />
      <AnimatedBackground />
      <WhatsAppFloat />
      <AudioPlayer />
      <GoogleAnalytics />
      <MetaPixel />
      <CookieConsent />
    </>
  );
}