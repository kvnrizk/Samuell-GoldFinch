'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import { BLUR_DATA_URL } from '@/lib/cloudinary';

interface Testimonial {
  clientName: string;
  role?: string;
  brand: string;
  quote: string;
  rating?: number;
  photo?: { url?: string };
  projectLink?: { slug?: string };
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  heading?: string;
  subheading?: string;
}

/* ── Static fallback testimonials ── */
const staticTestimonials: Testimonial[] = [
  {
    clientName: 'Sarah & Thomas',
    role: 'Bride & Groom',
    brand: 'blaze',
    quote: 'The most incredible wedding film we could have imagined. Every frame tells our story with a cinematic beauty that still moves us to tears every time we watch it.',
    rating: 5,
  },
  {
    clientName: 'Jean-Marc Duval',
    role: 'Venue Owner, Le Speakeasy',
    brand: 'kolasi',
    quote: 'Kolasi transformed our venue programming completely. The talent they bring, the production quality, the crowd — everything is elevated to a level we never thought possible.',
    rating: 5,
  },
  {
    clientName: 'Nadia El-Khoury',
    role: 'Event Director',
    brand: 'venues',
    quote: 'Working with Samuell\'s team on our embassy reception was flawless. The attention to detail, the discretion, and the caliber of the final product exceeded all expectations.',
    rating: 5,
  },
  {
    clientName: 'Marc Beaumont',
    role: 'Creative Director, Luxury Brand',
    brand: 'blaze',
    quote: 'We needed a filmmaker who understood luxury without being told. Samuell delivered a brand film that captured our essence in ways our brief couldn\'t articulate.',
    rating: 5,
  },
  {
    clientName: 'Layla Haddad',
    role: 'Festival Organizer',
    brand: 'kolasi',
    quote: 'The lineup Kolasi curated for our summer series was impeccable. Their network of international DJs and their understanding of crowd dynamics is unmatched.',
    rating: 5,
  },
  {
    clientName: 'Pierre & Camille',
    role: 'Bride & Groom',
    brand: 'blaze',
    quote: 'From the first meeting to the final edit, every interaction was thoughtful and professional. Our wedding film isn\'t just a video — it\'s a piece of art.',
    rating: 5,
  },
];

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? '#c8a96e' : 'none'}
          stroke="#c8a96e"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCarousel({
  testimonials,
  heading = 'What Our Clients Say',
  subheading,
}: TestimonialCarouselProps) {
  const items = testimonials.length > 0 ? testimonials : staticTestimonials;
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardCount = items.length;

  const scrollToIndex = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.children;
    if (!cards[idx]) return;
    const card = cards[idx] as HTMLElement;
    track.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' });
    setActiveIdx(idx);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isPaused || cardCount <= 1) return;
    autoplayRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % cardCount;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isPaused, cardCount, scrollToIndex]);

  // Sync activeIdx on manual scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const scrollLeft = track.scrollLeft;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - 24 - scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIdx(closest);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP entrance
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    const el = sectionRef.current;
    if (!el) return;
    gsap.from(el.querySelectorAll('.testi-reveal'), {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6 mb-14 testi-reveal">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-serif italic mb-4">{heading}</h2>
          {subheading && (
            <p className="text-xs font-medium" style={{ color: 'var(--text-mute)' }}>{subheading}</p>
          )}
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto px-6 pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left spacer for centering on wide screens */}
        <div className="flex-shrink-0 w-0 md:w-[calc((100vw-1280px)/2)]" />

        {items.map((t, i) => (
          <div
            key={i}
            className="testi-reveal flex-shrink-0 w-[85vw] md:w-[420px] snap-center rounded-2xl border p-8 md:p-10 flex flex-col justify-between"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'color-mix(in srgb, var(--bg-card) 50%, transparent)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Stars */}
            <div className="mb-6">
              <Stars count={t.rating || 5} />
            </div>

            {/* Quote */}
            <blockquote className="text-sm md:text-base leading-[1.8] font-light flex-1 mb-8" style={{ color: 'var(--text-dim)' }}>
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Client info */}
            <div className="flex items-center gap-4">
              {t.photo?.url ? (
                <Image
                  src={t.photo.url}
                  alt={t.clientName}
                  width={44}
                  height={44}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="w-11 h-11 rounded-full object-cover border"
                  style={{ borderColor: 'var(--border-hi)' }}
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center border text-sm font-serif"
                  style={{ borderColor: 'var(--border-hi)', color: '#c8a96e', backgroundColor: 'color-mix(in srgb, #c8a96e 10%, transparent)' }}
                >
                  {t.clientName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                  {t.clientName}
                </p>
                {t.role && (
                  <p className="text-[11px] truncate" style={{ color: 'var(--text-mute)' }}>
                    {t.role}
                  </p>
                )}
              </div>
              {t.projectLink?.slug && (
                <Link
                  href={`/blaze/${t.projectLink.slug}`}
                  className="text-[11px] font-medium whitespace-nowrap transition-colors hover:text-[#c8a96e]"
                  style={{ color: 'var(--text-dim)' }}
                >
                  View Project &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Right spacer */}
        <div className="flex-shrink-0 w-6 md:w-[calc((100vw-1280px)/2)]" />
      </div>

      {/* Dots */}
      {cardCount > 1 && (
        <div className="flex justify-center gap-2 mt-8 testi-reveal">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeIdx ? '#c8a96e' : 'var(--border-hi)',
                transform: i === activeIdx ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
