'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';
import { CounterStat } from './_components/CounterStat';
import { WorkOrbitCarousel } from './_components/WorkOrbitCarousel';
import { homeCollaborations as collaborations, homeMedia as media, type WorkItem } from './home-content';

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

interface HomeClientProps {
  blazeProjects: CMSProject[];
  locale?: Locale;
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
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10"
      style={{ backgroundColor: 'color-mix(in srgb, var(--surface-page) 95%, black)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Signature Wedding Reel"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-md transition-colors sg-action-secondary"
      >
        Close
      </button>
      <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border sg-media-frame">
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

export default function HomeClient({ blazeProjects, locale = 'en' }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = getDictionary(locale).home;
  const [showReel, setShowReel] = useState(false);

  const curatedBlazeItems: WorkItem[] = [
    {
      id: 'embassy-of-lebanon',
      blazeWorkId: 'embassy',
      identity: 'blaze',
      title: 'Embassy of Lebanon',
      category: 'Institutional Event',
      meta: 'Institutional event coverage',
      image: media.embassy[0],
    },
    {
      id: 'blaze-weddings',
      blazeWorkId: 'weddings',
      identity: 'blaze',
      title: 'Weddings',
      category: 'Videography',
      meta: 'Cinematic wedding storytelling',
      image: media.weddings[4],
    },
    {
      id: 'stouh-beirut',
      blazeWorkId: 'stouh',
      identity: 'blaze',
      title: 'STOUH BEIRUT',
      category: 'Photography / Videography',
      meta: 'Rooftop event film and photography',
      image: media.stouh[4],
    },
    {
      id: 'creative-direction',
      blazeWorkId: 'editorial',
      identity: 'blaze',
      title: 'Creative Direction',
      category: 'Creative Direction',
      meta: 'Editorial and brand image-making',
      image: media.editorial[0],
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
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--media-scrim), transparent, var(--surface-page))' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <p className="hero-reveal ui-kicker font-medium" style={{ color: 'var(--text-muted)' }}>
              {t.eyebrow}
            </p>
            <h1 className="hero-reveal text-3xl sm:text-4xl md:text-5xl font-serif leading-tight tracking-tight max-w-4xl">
              {t.title}
            </h1>
            <p className="hero-reveal ui-body-small md:ui-body max-w-md font-light" style={{ color: 'var(--text-secondary)' }}>
              {t.intro}
            </p>
            <div className="hero-reveal flex flex-wrap gap-4 pt-4">
              <Link
                href="/blaze"
                className="px-8 py-3 border text-sm font-semibold transition-all rounded-sm backdrop-blur-md sg-action-secondary"
              >
                {t.ctaBlaze}
              </Link>
              <Link
                href="/kolasi"
                className="px-8 py-3 border text-sm font-semibold transition-all rounded-sm backdrop-blur-md sg-action-secondary"
              >
                {t.ctaKolasi}
              </Link>
            </div>
          </div>

          <div className="hero-reveal hidden md:block">
            <button
              type="button"
              onClick={() => setShowReel(true)}
              className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border text-left"
              style={{ borderColor: 'var(--media-border)', boxShadow: 'var(--media-shadow)' }}
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
              <div className="absolute inset-0 flex flex-col justify-end p-10" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--brand-dark) 92%, transparent), transparent, transparent)' }}>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-md transition-all sg-action-secondary sg-group-action-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="8 5 19 12 8 19" />
                  </svg>
                </div>
                <p className="text-xs font-medium mb-2 text-on-media-dim">Blaze Motion</p>
                <h3 className="text-xl font-serif italic mb-1 text-on-media">Signature Wedding Reel</h3>
                <p className="text-xs font-light border-t border-white/10 pt-4 mt-4 text-on-media-dim">
                  Paris &bull; Cinematic Weddings
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <div className="w-[1px] h-10" style={{ backgroundColor: 'var(--text-primary)' }} />
        </div>
      </section>

      <section className="py-16 md:py-40" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center reveal-section">
            <div className="space-y-10">
              <p className="ui-kicker font-medium" style={{ color: 'var(--text-muted)' }}>{t.blazeKicker}</p>
              <h2 className="text-2xl md:text-4xl font-serif leading-tight italic max-w-xl">
                {t.blazeTitle[0]} {t.blazeTitle[1]} <span className="not-italic">{t.blazeTitle[2]}</span>
              </h2>
              <p className="ui-body-small md:ui-body font-light max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                {t.blazeText}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2 border-l pl-6" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-xs font-semibold">Wedding films</p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Crafted with timeless elegance and emotional weight.</p>
                </div>
                <div className="space-y-2 border-l pl-6" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-xs font-semibold">Speakeasy Series</p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Capturing warmth, shadow, and nocturnal energy.</p>
                </div>
              </div>
              <Link href="/blaze" className="inline-block px-12 py-4 border text-sm font-semibold transition-all sg-action-secondary">
                {t.blazeCta}
              </Link>
            </div>
            <div className="relative">
              <WorkOrbitCarousel
                items={curatedBlazeItems}
                onNavigate={(item) => router.push(`/blaze?work=${item.blazeWorkId}#selected-work`)}
                seeMoreLabel={t.seeMore}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-40 overflow-hidden" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 reveal-section">
            <div className="p-6 md:p-12 rounded-3xl border backdrop-blur-xl sg-card">
              <p className="ui-kicker font-medium mb-8" style={{ color: 'var(--text-muted)' }}>{t.kolasiKicker}</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight italic">
                {t.kolasiTitle}
              </h2>
              <p className="ui-body-small md:ui-body font-light mb-10" style={{ color: 'var(--text-secondary)' }}>
                {t.kolasiText}
              </p>
              <ul className="space-y-4 mb-12">
                {['DJ booking & live performers worldwide', 'Tailor-made events with artistic direction and PR', 'Cinematic coverage and post-event media', 'Sound & Light Rental'].map((item, i) => (
                  <li key={i} className="text-xs flex items-center" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-1 rounded-full mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--text-muted)' }} /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4">
                <Link href="/kolasi" className="px-8 py-3 border text-sm font-semibold transition-all sg-action-secondary">
                  {t.kolasiCta}
                </Link>
                <Link href="/kolasi#services" className="px-8 py-3 border text-sm font-semibold transition-all sg-action-secondary">
                  {t.expertiseCta}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border relative sg-media-frame">
                <Image src={media.speakeasy[1]} alt="Kolasi event atmosphere" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border relative sg-media-frame">
                <Image src={media.artists[0]} alt="Kolasi artist direction" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden border sg-media-frame">
                <VideoPlayer muxPlaybackId="bzlHPIIz3L68lqg6fmMTH02GsYL1AeZnT6ewRQIlokaE" autoPlay loop muted mode="hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 reveal-section" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border p-6 md:p-16 sg-card">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="ui-kicker mb-5" style={{ color: 'var(--text-muted)' }}>{t.venuesKicker}</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>
                  {t.venuesTitle}
                </h2>
                <p className="ui-body-small md:ui-body mb-8" style={{ color: 'var(--text-secondary)' }}>
                  {t.venuesText}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={localizedPath('/venues', locale)}
                    className="border font-semibold text-sm px-8 py-3 rounded-lg active:scale-[0.98] transition-all sg-action-primary"
                  >
                    {t.learnMore}
                  </Link>
                  <Link
                    href={`${localizedPath('/venues', locale)}#venue-form`}
                    className="border font-semibold text-sm px-8 py-3 rounded-lg transition-all sg-action-secondary"
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

      <section className="py-20" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="reveal-section">
            <p className="ui-kicker font-medium mb-8" style={{ color: 'var(--text-muted)' }}>{t.trustedKicker}</p>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-10 md:mb-20">
              {t.trustedTitle}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-14">
              {collaborations.map((c) => (
                <div key={c.name} className="group flex flex-col items-center justify-center px-2 py-2 text-center">
                  <div className="h-12 flex items-center justify-center mb-5">
                    {c.logo ? (
                      <Image src={c.logo} alt={c.name} width={120} height={40} placeholder="blur" blurDataURL={BLUR_DATA_URL} className="h-10 w-auto object-contain mix-blend-screen opacity-60 group-hover:opacity-100 transition-opacity duration-500" sizes="120px" />
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-500" style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                    )}
                  </div>
                  <p className="ui-caption font-light transition-colors" style={{ color: 'var(--text-muted)' }}>{c.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center reveal-section">
          <h2 className="text-2xl md:text-4xl font-serif mb-10 italic">{t.finalTitle}</h2>
          <p className="ui-body-small md:ui-body font-light mb-12" style={{ color: 'var(--text-secondary)' }}>
            {t.finalText}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={localizedPath('/quote', locale)}
              className="inline-block px-12 py-4 rounded-full border text-sm font-semibold transition-all sg-action-primary"
            >
              {t.quoteCta}
            </Link>
            <Link
              href={localizedPath('/venues', locale)}
              className="inline-block px-12 py-4 border rounded-full text-sm font-semibold transition-all sg-action-secondary"
            >
              {t.venueOwnerCta}
            </Link>
          </div>
        </div>
      </section>

      {showReel && <ReelModal onClose={() => setShowReel(false)} />}
    </div>
  );
}
