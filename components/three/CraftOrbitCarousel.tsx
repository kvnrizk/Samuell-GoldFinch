'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { registerGSAP, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap-utils';
import type { WorkItem } from '@/app/(site)/home-content';

// Heavy three.js bundle: client-only, loaded only once this panel scrolls near.
const BrandCraftScene = dynamic(() => import('./BrandCraftScene'), { ssr: false });

interface CraftOrbitCarouselProps {
  items: WorkItem[];
  brand: 'blaze' | 'kolasi';
  onNavigate: (item: WorkItem) => void;
  seeMoreLabel: string;
}

export function CraftOrbitCarousel({ items, brand, onNavigate, seeMoreLabel }: CraftOrbitCarouselProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lazy-mount the 3D hub once near the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '400px 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Blaze clapperboard scrubs its open/close from this panel's scroll progress.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reducedMotion) {
      scrollProgressRef.current = 1;
      return;
    }
    registerGSAP();
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  // Auto-advance the orbiting cards.
  useEffect(() => {
    if (isPaused || reducedMotion || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5200);
    return () => clearInterval(interval);
  }, [isPaused, reducedMotion, items.length]);

  if (items.length === 0) return null;

  const next = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prev = () => setActiveIndex((cur) => (cur - 1 + items.length) % items.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) next();
    if (diff < -50) prev();
    setIsPaused(false);
  };

  const Rx = isMobile ? 130 : 305;
  const Ry = isMobile ? 84 : 118;

  return (
    <div ref={wrapRef} className="w-full" role="region" aria-label="Selected work carousel">
      <div
        className="relative mx-auto flex h-[500px] w-full items-center justify-center md:h-[720px]"
        style={{ perspective: '1300px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      {/* Center 3D hub — the objects orbit around this */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {shouldLoad ? (
          <BrandCraftScene
            brand={brand}
            scrollProgressRef={scrollProgressRef}
            activeIndex={activeIndex}
            itemCount={items.length}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: 'var(--brand-gold)' }} />
          </div>
        )}
      </div>

      {/* Cinematic vignette over the 3D stage (under the cards) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(ellipse 62% 55% at center, transparent 55%, color-mix(in srgb, var(--media-scrim) 55%, transparent) 100%)' }}
      />

      {/* Work cards orbiting the hub */}
      {items.map((item, index) => {
        const n = items.length;
        const offset = ((index - activeIndex) % n + n) % n;
        const theta = (offset / n) * Math.PI * 2; // 0 = front
        const depth = (Math.cos(theta) + 1) / 2; // 1 front, 0 back
        const isActive = offset === 0;
        // Round derived values so SSR and the client produce byte-identical
        // inline styles. Math.sin/cos may differ in the last bit between the
        // server and browser JS engines, which otherwise trips a hydration
        // mismatch on every card.
        const x = +(Math.sin(theta) * Rx).toFixed(2);
        const y = +(Math.cos(theta) * Ry).toFixed(2); // front card drops toward the bottom
        const scale = +((0.55 + depth * 0.45) * (isActive ? 1.15 : 1)).toFixed(4);
        const opacity = +(0.26 + depth * 0.74).toFixed(3);
        const zIndex = 10 + Math.round(depth * 40);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => (isActive ? onNavigate(item) : setActiveIndex(index))}
            className="group absolute left-1/2 top-1/2 cursor-pointer text-left transition-all duration-700 ease-out"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
              opacity,
              zIndex,
            }}
            aria-label={isActive ? `See more ${item.title} work` : `Show ${item.title}`}
            aria-hidden={!isActive}
          >
            <div
              className="relative aspect-[4/5] w-[172px] overflow-hidden rounded-2xl border shadow-2xl md:w-[256px]"
              style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
            >
              {item.video ? (
                <VideoPlayer
                  src={item.video}
                  poster={item.image}
                  autoPlay={isActive}
                  loop
                  muted
                  mode="hero"
                  className="absolute inset-0"
                />
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 768px) 172px, 256px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div
                className="absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--brand-dark) 88%, transparent), transparent 65%)' }}
              >
                {isActive && (
                  <>
                    {brand !== 'kolasi' && (
                      <>
                        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-on-media-dim">{item.category}</p>
                        <h4 className="text-lg font-serif text-on-media md:text-xl">{item.title}</h4>
                      </>
                    )}
                    <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-on-media backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-black">
                      {seeMoreLabel}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M7 17 17 7" />
                        <path d="M9 7h8v8" />
                      </svg>
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
        );
      })}

      </div>

      {/* Controls — in normal flow below the stage so they never overlap cards */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" onClick={prev} className="rounded-full border px-3 py-2 text-xs transition-colors sg-action-secondary" aria-label="Previous work">
          Prev
        </button>
        <div className="flex gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-500 ${index === activeIndex ? 'w-6' : 'w-2'}`}
              style={{ backgroundColor: index === activeIndex ? 'var(--text-primary)' : 'var(--text-muted)' }}
              aria-label={`Go to ${item.title}`}
            />
          ))}
        </div>
        <button type="button" onClick={next} className="rounded-full border px-3 py-2 text-xs transition-colors sg-action-secondary" aria-label="Next work">
          Next
        </button>
      </div>
    </div>
  );
}
