'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import type { WorkItem } from '../home-content';

export function WorkOrbitCarousel({
  items,
  onNavigate,
  seeMoreLabel,
}: {
  items: WorkItem[];
  onNavigate: (item: WorkItem) => void;
  seeMoreLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5600);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  if (items.length === 0) return null;

  const next = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prev = () => setActiveIndex((current) => (current - 1 + items.length) % items.length);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = event.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) next();
    if (diff < -threshold) prev();
    setIsPaused(false);
  };

  return (
    <div
      className="relative mx-auto flex h-[430px] w-full max-w-5xl items-center justify-center md:h-[620px]"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Selected work carousel"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const isLeft = index === (activeIndex - 1 + items.length) % items.length;
        const isRight = index === (activeIndex + 1) % items.length;

        let transform = 'translateX(0) scale(0.5) rotateY(0)';
        let opacity = '0';
        let zIndex = '0';

        if (isActive) {
          transform = 'translateX(0) scale(1) rotateY(0)';
          opacity = '1';
          zIndex = '10';
        } else if (isLeft) {
          transform = 'translateX(-55%) scale(0.65) rotateY(25deg)';
          opacity = '0.35';
          zIndex = '5';
        } else if (isRight) {
          transform = 'translateX(55%) scale(0.65) rotateY(-25deg)';
          opacity = '0.35';
          zIndex = '5';
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => (isActive ? onNavigate(item) : setActiveIndex(index))}
            className="group absolute cursor-pointer text-left transition-all duration-700 ease-out"
            style={{ transform, opacity, zIndex }}
            aria-label={isActive ? `See more ${item.title} work` : `Show ${item.title}`}
          >
            <div
              className="relative aspect-[4/5] w-[240px] overflow-hidden rounded-2xl border shadow-2xl md:w-[450px]"
              style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 768px) 240px, 450px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--brand-dark) 84%, transparent), transparent, transparent)' }}>
                {isActive && (
                  <>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-on-media-dim">
                      {item.category}
                    </p>
                    <h4 className="text-2xl font-serif text-on-media">{item.title}</h4>
                    <p className="mt-3 text-xs leading-relaxed text-on-media-dim">{item.meta}</p>
                  </>
                )}
                {isActive && (
                  <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-on-media backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-black">
                    {seeMoreLabel}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 17 17 7" />
                      <path d="M9 7h8v8" />
                    </svg>
                  </span>
                )}
              </div>
              {isActive && (
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}

      <div className="absolute -bottom-3 flex items-center gap-3 md:-bottom-4">
        <button
          type="button"
          onClick={prev}
          className="rounded-full border px-3 py-2 text-xs transition-colors sg-action-secondary"
          aria-label="Previous selected work"
        >
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
        <button
          type="button"
          onClick={next}
          className="rounded-full border px-3 py-2 text-xs transition-colors sg-action-secondary"
          aria-label="Next selected work"
        >
          Next
        </button>
      </div>
    </div>
  );
}
