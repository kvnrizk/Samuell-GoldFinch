import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <AnimatedBackground />
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
