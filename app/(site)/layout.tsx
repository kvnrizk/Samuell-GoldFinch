import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { PageTransition } from '@/components/ui/PageTransition';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <AnimatedBackground />
      <Header />
      <PageTransition>
        <main id="main-content" className="relative z-10">{children}</main>
      </PageTransition>
      <Footer />
    </div>
  );
}
