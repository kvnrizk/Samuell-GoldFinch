'use client';

import React, { useRef, useEffect } from 'react';

export default function AnimatedBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleScroll = () => {
      if (!glowRef.current) return;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      // Glow follows scroll position vertically
      glowRef.current.style.top = `${20 + progress * 60}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Warm gold ambient */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-[#c8a96e]/[0.03] blur-[160px] rounded-full animate-float-1 dark:opacity-100 opacity-50" />
      {/* Purple accent */}
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-purple-900/[0.04] blur-[160px] rounded-full animate-float-2 dark:opacity-100 opacity-30" />
      {/* Scroll-following gold glow */}
      <div
        ref={glowRef}
        className="absolute left-[30%] w-[40%] h-[30%] bg-[#c8a96e]/[0.02] blur-[200px] rounded-full transition-[top] duration-[2s] ease-out"
        style={{ top: '20%' }}
      />
      {/* Subtle warm highlight */}
      <div className="absolute top-[40%] right-[15%] w-[25%] h-[25%] bg-amber-900/[0.02] blur-[140px] rounded-full animate-float-3 dark:opacity-100 opacity-30" />
    </div>
  );
}
