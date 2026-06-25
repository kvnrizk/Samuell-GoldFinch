'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';

interface CarouselItem {
  url: string;
  title: string;
  category?: string;
}

interface OrbitCarouselProps {
  items: CarouselItem[];
  autoplayInterval?: number;
  disableLightbox?: boolean;
}

export default function OrbitCarousel({ items, autoplayInterval = 5600, disableLightbox = false }: OrbitCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % items.length),
    [items.length],
  );
  const prev = useCallback(
    () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    if (isPaused || !autoplayInterval || lightbox !== null) return;
    const interval = setInterval(next, autoplayInterval);
    return () => clearInterval(interval);
  }, [next, isPaused, autoplayInterval, lightbox]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null) {
        if (e.key === 'Escape') setLightbox(null);
        if (e.key === 'ArrowRight') setLightbox((prev) => ((prev ?? 0) + 1) % items.length);
        if (e.key === 'ArrowLeft') setLightbox((prev) => ((prev ?? 0) - 1 + items.length) % items.length);
        return;
      }
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, lightbox, items.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [lightbox]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (lightbox !== null) {
      if (diff > threshold) setLightbox((prev) => ((prev ?? 0) + 1) % items.length);
      else if (diff < -threshold) setLightbox((prev) => ((prev ?? 0) - 1 + items.length) % items.length);
    } else {
      if (diff > threshold) next();
      else if (diff < -threshold) prev();
    }
    setIsPaused(false);
  };

  const handleCardClick = (index: number) => {
    if (disableLightbox) {
      setActiveIndex(index);
      return;
    }

    if (index === activeIndex) {
      setLightbox(index);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <>
      <div
        className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[600px] flex items-center justify-center"
        style={{ perspective: '1000px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Image carousel"
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
            <div
              key={index}
              className="absolute transition-all duration-700 ease-out cursor-pointer"
              style={{ transform, opacity, zIndex }}
              onClick={() => handleCardClick(index)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl w-[240px] md:w-[450px] aspect-[4/5] border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 768px) 240px, 450px"
                  className="object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--bg) 80%, transparent), transparent, transparent)' }}>
                  {item.category && (
                    <p className="text-xs tracking-widest uppercase text-white/50 mb-2">
                      {item.category}
                    </p>
                  )}
                  <h3 className="text-2xl font-serif text-white">{item.title}</h3>
                </div>
                {/* Tap-to-expand hint on active card */}
                {isActive && !disableLightbox && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dot indicators */}
        <div className="absolute -bottom-10 md:-bottom-14 flex space-x-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'bg-white w-6' : 'bg-white/25'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox — portaled to body to escape main's z-10 stacking context */}
      {lightbox !== null && createPortal(
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-[90vw] h-[80vh] md:w-[70vw] md:h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[lightbox].url}
              alt={items[lightbox].title}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            {items[lightbox].category && (
              <p className="text-xs tracking-widest uppercase text-white/40 mb-2">{items[lightbox].category}</p>
            )}
            <h3 className="text-xl font-serif text-white">{items[lightbox].title}</h3>
            <p className="text-xs text-white/30 mt-3">{lightbox + 1} / {items.length}</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
