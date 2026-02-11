'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface CarouselItem {
  url: string;
  title: string;
  category?: string;
}

interface OrbitCarouselProps {
  items: CarouselItem[];
  autoplayInterval?: number;
}

export default function OrbitCarousel({ items, autoplayInterval = 5600 }: OrbitCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % items.length),
    [items.length],
  );
  const prev = useCallback(
    () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    if (isPaused || !autoplayInterval) return;
    const interval = setInterval(next, autoplayInterval);
    return () => clearInterval(interval);
  }, [next, isPaused, autoplayInterval]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[600px] flex items-center justify-center"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
          transform = 'translateX(-40%) scale(0.7) rotateY(25deg)';
          opacity = '0.4';
          zIndex = '5';
        } else if (isRight) {
          transform = 'translateX(40%) scale(0.7) rotateY(-25deg)';
          opacity = '0.4';
          zIndex = '5';
        }

        return (
          <div
            key={index}
            className="absolute transition-all duration-700 ease-out cursor-pointer"
            style={{ transform, opacity, zIndex }}
            onClick={() => setActiveIndex(index)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl w-[280px] md:w-[450px] aspect-[4/5] bg-neutral-900 border border-white/10">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                {item.category && (
                  <p className="text-xs tracking-widest uppercase text-white/50 mb-2">
                    {item.category}
                  </p>
                )}
                <h3 className="text-2xl font-serif text-white">{item.title}</h3>
                {isActive && (
                  <button className="mt-4 px-4 py-2 border border-white/20 text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all self-start">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute -bottom-4 md:bottom-[-100px] flex space-x-4">
        <button
          onClick={prev}
          className="p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
