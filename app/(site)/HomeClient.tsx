'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';

const media = {
  stouh: [
    '/assets/blaze/stouh_beirut/2E2A0578.jpg',
    '/assets/blaze/stouh_beirut/2E2A1101.jpg',
    '/assets/blaze/stouh_beirut/2E2A1243.jpg',
    '/assets/blaze/stouh_beirut/2E2A1637.jpg',
    '/assets/blaze/stouh_beirut/2E2A1724.jpg',
    '/assets/blaze/stouh_beirut/2E2A2072.jpg',
    '/assets/blaze/stouh_beirut/4F8A9363.jpg',
    '/assets/blaze/stouh_beirut/4F8A9365.jpg',
    '/assets/blaze/stouh_beirut/IMG_6348.jpg',
    '/assets/blaze/stouh_beirut/IMG_6350.jpg',
    '/assets/blaze/stouh_beirut/IMG_6351.jpg',
  ],
  weddings: [
    '/assets/blaze/weddings/images/0G0A7343.jpg',
    '/assets/blaze/weddings/images/0G0A7376(1).jpg',
    '/assets/blaze/weddings/images/0G0A7733.jpg',
    '/assets/blaze/weddings/images/0G0A7774(1).jpg',
    '/assets/blaze/weddings/images/0G0A7811.jpg',
    '/assets/blaze/weddings/images/0G0A7820.jpg',
    '/assets/blaze/weddings/images/0G0A7828.jpg',
    '/assets/blaze/weddings/images/0G0A7833.jpg',
    '/assets/blaze/weddings/images/9V5A4101.jpg',
    '/assets/blaze/weddings/images/9V5A8531.jpg',
    '/assets/blaze/weddings/images/9V5A9337.jpg',
    '/assets/blaze/weddings/images/9V5A9365.jpg',
    '/assets/blaze/weddings/images/DSCF2395.jpg',
    '/assets/blaze/weddings/images/IMG_0025.jpg',
    '/assets/blaze/weddings/images/IMG_0068.jpg',
    '/assets/blaze/weddings/images/IMG_0079.jpg',
    '/assets/blaze/weddings/images/IMG_0084.jpg',
    '/assets/blaze/weddings/images/IMG_0100.jpg',
    '/assets/blaze/weddings/images/IMG_0158.jpg',
    '/assets/blaze/weddings/images/IMG_0206.jpg',
    '/assets/blaze/weddings/images/IMG_5025.JPG',
    '/assets/blaze/weddings/images/IMG_6049.jpg',
    '/assets/blaze/weddings/images/IMG_6051.jpg',
    '/assets/blaze/weddings/images/IMG_6052.jpg',
    '/assets/blaze/weddings/images/IMG_6054.jpg',
    '/assets/blaze/weddings/images/IMG_6055.jpg',
    '/assets/blaze/weddings/images/IMG_9986.jpg',
    '/assets/blaze/weddings/images/IMG_9991.jpg',
    '/assets/blaze/weddings/images/pexels-amar-10288372.jpg',
    '/assets/blaze/weddings/images/pexels-angel-ayala-321556-28976231.jpg',
    '/assets/blaze/weddings/images/pexels-cuneyt-efe-bural-1257409288-23940968.jpg',
    '/assets/blaze/weddings/images/pexels-fabrice-busching-1777473881-30235864.jpg',
    '/assets/blaze/weddings/images/pexels-leeloothefirst-5038645.jpg',
    '/assets/blaze/weddings/images/pexels-mastercowley-1128782.jpg',
    '/assets/blaze/weddings/images/pexels-valentina-maros-128709290-13283497.jpg',
  ],
  editorial: [
    '/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.JPG',
    '/assets/blaze/editorial_and_brand/pexels-amar-10288372.jpg',
    '/assets/blaze/editorial_and_brand/pexels-angel-ayala-321556-28976231.jpg',
    '/assets/blaze/editorial_and_brand/pexels-fabrice-busching-1777473881-30235864.jpg',
    '/assets/blaze/editorial_and_brand/pexels-valentina-maros-128709290-13283497.jpg',
  ],
  speakeasy: [
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364299/sg-platform/static/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.jpg',
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364262/sg-platform/static/assets/kolasi/images/4F8A2882.jpg',
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364266/sg-platform/static/assets/kolasi/images/4F8A3195.jpg',
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364281/sg-platform/static/assets/kolasi/images/4F8A3310.jpg',
  ],
  kolasiNights: [
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364282/sg-platform/static/assets/kolasi/images/4F8A3750.jpg',
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364276/sg-platform/static/assets/kolasi/images/4F8A3777.jpg',
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364297/sg-platform/static/assets/kolasi/images/4F8A3801.jpg',
  ],
  artists: [
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364184/sg-platform/static/assets/kolasi/artists/4F8A3682.jpg',
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364188/sg-platform/static/assets/kolasi/artists/artist-1.jpg',
    'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364228/sg-platform/static/assets/kolasi/artists/artist-2.jpg',
  ],
};

const collaborations: { name: string; location: string; logo?: string }[] = [
  { name: 'Embassy of Lebanon', location: 'Paris' },
  { name: 'STOUH BEIRUT', location: 'Paris', logo: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364300/sg-platform/static/assets/stouth_beirut_logo.webp' },
  { name: 'MIPIM Cannes', location: 'Cannes', logo: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364300/sg-platform/static/assets/mipim_logo.webp' },
  { name: 'Elie Saab', location: 'Beirut', logo: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363933/sg-platform/static/assets/Elie_saab_logo.webp' },
  { name: 'Kate Zubok', location: 'International' },
  { name: 'Transdev', location: 'France' },
  { name: 'Le Speakeasy', location: 'Paris', logo: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364284/sg-platform/static/assets/kolasi/logo_speakeasy.png' },
  { name: 'Chloe Khalife', location: 'International' },
  { name: 'Brunch Festival', location: 'Paris' },
  { name: 'France Tourisme', location: 'France' },
];

interface CMSPhoto {
  url?: string;
}

interface CMSGalleryItem {
  image?: CMSPhoto;
}

interface CMSProject {
  slug?: string;
  title?: string;
  heroVideo?: { muxPlaybackId?: string; posterUrl?: string };
  gallery?: CMSGalleryItem[];
  category?: string;
  eventType?: string;
  venue?: string;
}

type WorkIdentity = 'blaze' | 'kolasi';

interface WorkItem {
  id: string;
  identity: WorkIdentity;
  title: string;
  category: string;
  meta: string;
  image: string;
  gallery: string[];
}

interface HomeClientProps {
  blazeProjects: CMSProject[];
  locale?: Locale;
}

function useRevealCounter(target: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    setValue(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startedAt = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return { ref, value };
}

function CounterStat({ value, label }: { value: number; label: string }) {
  const counter = useRevealCounter(value);
  return (
    <div className="p-4 border-l" style={{ borderColor: 'var(--border)' }}>
      <p className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
        <span ref={counter.ref}>{counter.value}</span>+
      </p>
      <p className="ui-caption mt-1" style={{ color: 'var(--text-dim)' }}>{label}</p>
    </div>
  );
}

function WorkGalleryModal({
  item,
  onClose,
}: {
  item: WorkItem;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setActive((prev) => (prev + 1) % item.gallery.length);
      if (event.key === 'ArrowLeft') setActive((prev) => (prev - 1 + item.gallery.length) % item.gallery.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [item.gallery.length, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[70] bg-black/95 px-4 py-6 md:p-10" role="dialog" aria-modal="true" aria-label={item.title}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
      >
        Close
      </button>
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-5">
        <div className="flex flex-col gap-2 pr-20">
          <p className="ui-kicker" style={{ color: item.identity === 'blaze' ? '#c8a96e' : 'var(--text-mute)' }}>
            {item.identity === 'blaze' ? 'Blaze' : 'Kolasi'} / {item.category}
          </p>
          <h3 className="text-2xl md:text-4xl font-serif">{item.title}</h3>
          <p className="ui-body-small" style={{ color: 'var(--text-dim)' }}>{item.meta}</p>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <Image
            src={item.gallery[active]}
            alt={`${item.title} ${active + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {item.gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border transition-opacity"
              style={{ borderColor: index === active ? '#c8a96e' : 'rgba(255,255,255,0.12)', opacity: index === active ? 1 : 0.55 }}
              aria-label={`Show image ${index + 1}`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ReelModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 md:p-10" role="dialog" aria-modal="true" aria-label="Signature Wedding Reel">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
      >
        Close
      </button>
      <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black">
        <VideoPlayer
          muxPlaybackId="ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A"
          poster={media.weddings[0]}
          autoPlay
          loop={false}
          muted={false}
          mode="showcase"
        />
      </div>
    </div>,
    document.body,
  );
}

function WorkOrbitCarousel({
  items,
  onOpen,
}: {
  items: WorkItem[];
  onOpen: (item: WorkItem) => void;
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
            onClick={() => (isActive ? onOpen(item) : setActiveIndex(index))}
            className="group absolute cursor-pointer text-left transition-all duration-700 ease-out"
            style={{ transform, opacity, zIndex }}
            aria-label={isActive ? `Open ${item.title} gallery` : `Show ${item.title}`}
          >
            <div
              className="relative aspect-[4/5] w-[240px] overflow-hidden rounded-2xl border shadow-2xl md:w-[450px]"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
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
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--bg) 84%, transparent), transparent, transparent)' }}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                  {item.category}
                </p>
                <h4 className="text-2xl font-serif text-white">{item.title}</h4>
                <p className="mt-3 text-xs leading-relaxed text-white/55">{item.meta}</p>
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
          className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white hover:text-black"
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
              className={`h-2 rounded-full transition-all duration-500 ${index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/25'}`}
              aria-label={`Go to ${item.title}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white hover:text-black"
          aria-label="Next selected work"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function HomeClient({ blazeProjects, locale = 'en' }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getDictionary(locale).home;
  const [activeWork, setActiveWork] = useState<WorkItem | null>(null);
  const [showReel, setShowReel] = useState(false);

  const curatedBlazeItems: WorkItem[] = [
    {
      id: 'blaze-weddings',
      identity: 'blaze',
      title: 'Weddings',
      category: 'Videography',
      meta: 'Cinematic wedding storytelling',
      image: media.weddings[4],
      gallery: media.weddings,
    },
    {
      id: 'stouh-beirut',
      identity: 'blaze',
      title: 'STOUH BEIRUT',
      category: 'Photography / Videography',
      meta: 'Rooftop event film and photography',
      image: media.stouh[4],
      gallery: media.stouh,
    },
    {
      id: 'creative-direction',
      identity: 'blaze',
      title: 'Creative Direction',
      category: 'Creative Direction',
      meta: 'Editorial and brand image-making',
      image: media.editorial[0],
      gallery: media.editorial,
    },
  ];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();

    gsap.from('.hero-reveal', {
      y: 80,
      opacity: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: 'expo.out',
    });

    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: 'top 85%' },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <VideoPlayer
            muxPlaybackId="ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A"
            poster={media.weddings[0]}
            autoPlay
            loop
            muted
            mode="hero"
            className="opacity-40"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg), transparent, var(--bg))' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <p className="hero-reveal ui-kicker font-medium" style={{ color: 'var(--text-mute)' }}>
              {t.eyebrow}
            </p>
            <h1 className="hero-reveal text-3xl sm:text-4xl md:text-5xl font-serif leading-tight tracking-tight max-w-4xl">
              {t.title}
            </h1>
            <p className="hero-reveal ui-body-small md:ui-body max-w-md font-light" style={{ color: 'var(--text-dim)' }}>
              {t.intro}
            </p>
            <div className="hero-reveal flex flex-wrap gap-4 pt-4">
              <Link
                href="/blaze"
                className="px-8 py-3 border border-white/20 text-sm font-semibold hover:bg-white hover:text-black transition-all rounded-sm backdrop-blur-md"
              >
                {t.ctaBlaze}
              </Link>
              <Link
                href="/kolasi"
                className="px-8 py-3 bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white hover:text-black transition-all rounded-sm backdrop-blur-md"
              >
                {t.ctaKolasi}
              </Link>
            </div>
          </div>

          <div className="hero-reveal hidden md:block">
            <button
              type="button"
              onClick={() => setShowReel(true)}
              className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl text-left"
              aria-label="Play Signature Wedding Reel"
            >
              <Image
                src={blazeProjects[0]?.gallery?.[0]?.image?.url || media.weddings[0]}
                alt="Blaze Motion - Signature Wedding Reel"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-all duration-700"
                priority
              />
              <div className="absolute inset-0 flex flex-col justify-end p-10" style={{ background: 'linear-gradient(to top, var(--bg), transparent, transparent)' }}>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all group-hover:bg-white group-hover:text-black">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="8 5 19 12 8 19" />
                  </svg>
                </div>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-mute)' }}>Blaze Motion</p>
                <h3 className="text-xl font-serif italic mb-1">Signature Wedding Reel</h3>
                <p className="text-xs font-light border-t border-white/10 pt-4 mt-4" style={{ color: 'var(--text-mute)' }}>
                  Paris &bull; Cinematic Weddings
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <div className="w-[1px] h-10 bg-white" />
        </div>
      </section>

      <section className="py-16 md:py-40" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center reveal-section">
            <div className="space-y-10">
              <p className="ui-kicker font-medium" style={{ color: 'var(--text-mute)' }}>{t.blazeKicker}</p>
              <h2 className="text-2xl md:text-4xl font-serif leading-tight italic max-w-xl">
                {t.blazeTitle[0]} {t.blazeTitle[1]} <span className="not-italic">{t.blazeTitle[2]}</span>
              </h2>
              <p className="ui-body-small md:ui-body font-light max-w-sm" style={{ color: 'var(--text-dim)' }}>
                {t.blazeText}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2 border-l border-white/10 pl-6">
                  <p className="text-xs font-semibold">Wedding films</p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>Crafted with timeless elegance and emotional weight.</p>
                </div>
                <div className="space-y-2 border-l border-white/10 pl-6">
                  <p className="text-xs font-semibold">Speakeasy Series</p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>Capturing warmth, shadow, and nocturnal energy.</p>
                </div>
              </div>
              <Link href="/blaze" className="inline-block px-12 py-4 border border-white/20 text-sm font-semibold hover:bg-white hover:text-black transition-all">
                {t.blazeCta}
              </Link>
            </div>
            <div className="relative">
              <WorkOrbitCarousel items={curatedBlazeItems} onOpen={setActiveWork} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-40 overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 reveal-section">
            <div className="bg-neutral-900/40 p-6 md:p-12 rounded-3xl border border-white/5 backdrop-blur-xl">
              <p className="ui-kicker font-medium mb-8" style={{ color: 'var(--text-mute)' }}>{t.kolasiKicker}</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight italic">
                {t.kolasiTitle}
              </h2>
              <p className="ui-body-small md:ui-body font-light mb-10" style={{ color: 'var(--text-dim)' }}>
                {t.kolasiText}
              </p>
              <ul className="space-y-4 mb-12">
                {['DJ booking & live performers worldwide', 'Tailor-made events with artistic direction and PR', 'Cinematic coverage and post-event media', 'Sound & Light Rental'].map((item, i) => (
                  <li key={i} className="text-xs flex items-center" style={{ color: 'var(--text)' }}>
                    <span className="w-1 h-1 rounded-full mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--text-mute)' }} /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4">
                <Link href="/kolasi" className="px-8 py-3 border border-white/20 text-sm font-semibold hover:bg-white hover:text-black transition-all">
                  {t.kolasiCta}
                </Link>
                <Link href="/kolasi#services" className="px-8 py-3 border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white hover:text-black transition-all">
                  {t.expertiseCta}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl relative">
                <Image src={media.speakeasy[1]} alt="Kolasi event atmosphere" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl relative">
                <Image src={media.artists[0]} alt="Kolasi artist direction" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                <VideoPlayer muxPlaybackId="bzlHPIIz3L68lqg6fmMTH02GsYL1AeZnT6ewRQIlokaE" autoPlay loop muted mode="hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 reveal-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="ui-kicker mb-5" style={{ color: 'var(--text-mute)' }}>{t.venuesKicker}</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-4" style={{ color: 'var(--text)' }}>
                  {t.venuesTitle}
                </h2>
                <p className="ui-body-small md:ui-body mb-8" style={{ color: 'var(--text-dim)' }}>
                  {t.venuesText}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={localizedPath('/venues', locale)}
                    className="border border-white/20 bg-white text-[#09090b] font-semibold text-sm px-8 py-3 rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all"
                  >
                    {t.learnMore}
                  </Link>
                  <Link
                    href={`${localizedPath('/venues', locale)}#venue-form`}
                    className="border border-white/15 text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-white/[0.08] transition-all"
                  >
                    {t.applyNow}
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <CounterStat value={150} label={t.experiences} />
                <CounterStat value={12} label={t.cities} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="reveal-section">
            <p className="ui-kicker font-medium mb-8" style={{ color: 'var(--text-mute)' }}>{t.trustedKicker}</p>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-10 md:mb-20">
              {t.trustedTitle}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {collaborations.map((c) => (
                <div key={c.name} className="group flex flex-col items-center justify-center p-4 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500">
                  <div className="h-12 flex items-center justify-center mb-5">
                    {c.logo ? (
                      <Image src={c.logo} alt={c.name} width={120} height={40} placeholder="blur" blurDataURL={BLUR_DATA_URL} className="h-10 w-auto object-contain mix-blend-screen opacity-60 group-hover:opacity-100 transition-opacity duration-500" sizes="120px" />
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45 group-hover:text-white/70 transition-colors duration-500">{c.name}</span>
                    )}
                  </div>
                  {c.logo && <p className="text-xs font-semibold mb-1 text-white/70 group-hover:text-white transition-colors">{c.name}</p>}
                  <p className="ui-caption font-light transition-colors" style={{ color: 'var(--text-mute)' }}>{c.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center reveal-section">
          <h2 className="text-2xl md:text-4xl font-serif mb-10 italic">{t.finalTitle}</h2>
          <p className="ui-body-small md:ui-body font-light mb-12" style={{ color: 'var(--text-dim)' }}>
            {t.finalText}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={localizedPath('/quote', locale)}
              className="inline-block px-12 py-4 rounded-full text-sm font-semibold transition-all"
              style={{ border: '1px solid var(--border-hi)', color: 'var(--text)' }}
            >
              {t.quoteCta}
            </Link>
            <Link
              href={localizedPath('/venues', locale)}
              className="inline-block px-12 py-4 bg-white/[0.04] border border-white/15 rounded-full text-sm font-semibold text-white hover:bg-white hover:text-[#09090b] transition-all"
            >
              {t.venueOwnerCta}
            </Link>
          </div>
        </div>
      </section>

      {activeWork && <WorkGalleryModal item={activeWork} onClose={() => setActiveWork(null)} />}
      {showReel && <ReelModal onClose={() => setShowReel(false)} />}
    </div>
  );
}
