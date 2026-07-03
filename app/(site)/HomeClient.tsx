'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';
import { CounterStat } from './_components/CounterStat';
import { CraftOrbitCarousel } from '@/components/three/CraftOrbitCarousel';
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

export default function HomeClient({ blazeProjects, locale = 'en' }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = getDictionary(locale).home;

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

  const curatedKolasiItems: WorkItem[] = [
    {
      id: 'le-speakeasy',
      blazeWorkId: '',
      identity: 'kolasi',
      title: 'Le Speakeasy',
      category: 'Residency',
      meta: 'Weekly programming and content',
      image: media.speakeasy[0],
      video: '/assets/kolasi/Speakeasy_Ads/LeSpeakeasyVid.mp4',
    },
    {
      id: 'kolasi-nights',
      blazeWorkId: '',
      identity: 'kolasi',
      title: 'Kolasi Nights',
      category: 'Events',
      meta: 'Curated club nights and festivals',
      image: media.kolasiNights[0],
      video: '/assets/kolasi/kate%20zubok%20festival%20chantilly.mp4',
    },
    {
      id: 'artist-direction',
      blazeWorkId: '',
      identity: 'kolasi',
      title: 'Artist Direction',
      category: 'Booking',
      meta: 'DJ and live performer roster',
      image: media.artists[1],
      video: '/assets/kolasi/panorama%20voitture.mp4',
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
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--media-scrim)' }}>
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
            <p className="hero-reveal ui-kicker font-medium text-on-media-dim">
              {t.eyebrow}
            </p>
            <h1 className="hero-reveal text-3xl sm:text-4xl md:text-5xl font-serif leading-tight tracking-tight max-w-4xl text-on-media">
              {t.title}
            </h1>
            <p className="hero-reveal ui-body-small md:ui-body max-w-md font-light text-on-media-dim">
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
            <div
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border"
              style={{ borderColor: 'var(--media-border)', boxShadow: 'var(--media-shadow)' }}
            >
              <Image
                src={blazeProjects[0]?.gallery?.[0]?.image?.url || media.weddings[0]}
                alt="Blaze Motion - Signature Wedding"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex flex-col justify-end p-10" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--brand-dark) 92%, transparent), transparent, transparent)' }}>
                <p className="text-xs font-medium mb-2 text-on-media-dim">Blaze Motion</p>
                <h3 className="text-xl font-serif mb-1 text-on-media">Signature Wedding</h3>
                <p className="text-xs font-light border-t border-white/10 pt-4 mt-4 text-on-media-dim">
                  Paris &bull; Cinematic Weddings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <div className="w-[1px] h-10" style={{ backgroundColor: 'var(--text-primary)' }} />
        </div>
      </section>

      <section className="py-16 md:py-40" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-[0.68fr_1.32fr] gap-10 md:gap-14 items-center reveal-section">
            <div className="space-y-10 text-center">
              <Image src="/assets/blaze/LOGO_BLAZE.png" alt="Blaze Production" width={512} height={512} className="logo-monochrome mx-auto h-28 md:h-52 w-auto object-contain" sizes="(max-width: 768px) 448px, 640px" />
              <p className="ui-kicker font-medium" style={{ color: 'var(--text-muted)' }}>{t.blazeKicker}</p>
              <h2 className="text-2xl md:text-4xl font-serif leading-tight max-w-xl mx-auto">
                {t.blazeTitle[0]} {t.blazeTitle[1]} <span>{t.blazeTitle[2]}</span>
              </h2>
              <p className="ui-body-small md:ui-body font-light max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                {t.blazeText}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-xs font-semibold">Wedding films</p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Crafted with timeless elegance and emotional weight.</p>
                </div>
                <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-xs font-semibold">Speakeasy Series</p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Capturing warmth, shadow, and nocturnal energy.</p>
                </div>
              </div>
              <Link href="/blaze" className="inline-block px-12 py-4 border text-sm font-semibold transition-all sg-action-secondary">
                {t.blazeCta}
              </Link>
            </div>
            <div className="relative">
              <CraftOrbitCarousel
                items={curatedBlazeItems}
                brand="blaze"
                onNavigate={(item) => router.push(`/blaze?work=${item.blazeWorkId}#selected-work`)}
                seeMoreLabel={t.seeMore}
              />
            </div>
          </div>

          <div className="mt-16 md:mt-28 reveal-section max-w-3xl mx-auto">
            <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border sg-media-frame">
              <VideoPlayer
                src="/assets/blaze/events/website_aftermovie_transdev.mp4"
                autoPlay
                loop
                muted
                mode="hero"
              />
              <div className="absolute left-5 top-5 z-10 rounded-lg px-3 py-2 shadow-md" style={{ backgroundColor: '#ffffff' }}>
                <Image src="/assets/blaze/events/transdev_logo.webp" alt="Transdev" width={140} height={56} className="h-6 md:h-8 w-auto object-contain" sizes="140px" />
              </div>
            </div>
            <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.24em]" style={{ color: 'var(--text-muted)' }}>
              Transdev — Event Aftermovie
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-40 overflow-hidden" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-[0.68fr_1.32fr] gap-12 md:gap-14 reveal-section items-center">
            <div className="p-6 md:p-12 rounded-3xl border backdrop-blur-xl sg-card text-center">
              <Image src="/assets/kolasi/LOGO%20KOLASI.png" alt="Kolasi" width={640} height={452} className="logo-monochrome mx-auto h-28 md:h-44 w-auto object-contain mb-8" sizes="(max-width: 768px) 400px, 560px" />
              <p className="ui-kicker font-medium mb-8" style={{ color: 'var(--text-muted)' }}>{t.kolasiKicker}</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight">
                {t.kolasiTitle}
              </h2>
              <p className="ui-body-small md:ui-body font-light mb-10" style={{ color: 'var(--text-secondary)' }}>
                {t.kolasiText}
              </p>
              <ul className="space-y-4 mb-12">
                {['DJ booking & live performers worldwide', 'Tailor-made events with artistic direction and PR', 'Cinematic coverage and post-event media', 'Sound & Light Rental'].map((item, i) => (
                  <li key={i} className="text-xs flex items-center justify-center" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-1 rounded-full mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--text-muted)' }} /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4 justify-center">
                <Link href="/kolasi" className="px-8 py-3 border text-sm font-semibold transition-all sg-action-secondary">
                  {t.kolasiCta}
                </Link>
                <Link href="/kolasi#services" className="px-8 py-3 border text-sm font-semibold transition-all sg-action-secondary">
                  {t.expertiseCta}
                </Link>
              </div>
            </div>

            <div className="relative">
              <CraftOrbitCarousel
                items={curatedKolasiItems}
                brand="kolasi"
                onNavigate={() => router.push('/kolasi')}
                seeMoreLabel={t.seeMore}
              />
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
            <h2 className="text-2xl md:text-3xl font-serif mb-10 md:mb-20">
              {t.trustedTitle}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-14">
              {collaborations.map((c) => (
                <div key={c.name} className="group flex flex-col items-center justify-start text-center rounded-2xl border border-transparent p-4 md:p-6 transition-all duration-500 hover:-translate-y-1 sg-hover-card">
                  <div className="h-14 md:h-16 flex items-center justify-center mb-4">
                    {!c.logo ? (
                      <span className="font-serif text-lg md:text-xl" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                    ) : c.logoStyle === 'photo' ? (
                      <span className="block h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-xl">
                        <Image src={c.logo} alt={c.name} width={160} height={160} placeholder="blur" blurDataURL={BLUR_DATA_URL} className="h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" sizes="80px" />
                      </span>
                    ) : c.logoStyle === 'chip' ? (
                      <span className="flex h-14 md:h-16 items-center justify-center overflow-hidden rounded-xl px-3 py-2" style={{ backgroundColor: '#ffffff' }}>
                        <Image src={c.logo} alt={c.name} width={160} height={64} placeholder="blur" blurDataURL={BLUR_DATA_URL} className="h-10 md:h-12 w-auto max-w-[130px] object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500" sizes="160px" />
                      </span>
                    ) : (
                      <Image src={c.logo} alt={c.name} width={160} height={64} placeholder="blur" blurDataURL={BLUR_DATA_URL} className={`${c.logoStyle === 'mono' ? 'logo-monochrome ' : ''}h-12 md:h-14 w-auto max-w-[150px] object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500`} sizes="160px" />
                    )}
                  </div>
                  {c.logo && (
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>{c.name}</p>
                  )}
                  <p className="ui-caption font-light mt-1" style={{ color: 'var(--text-muted)' }}>{c.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center reveal-section">
          <h2 className="text-2xl md:text-4xl font-serif mb-10">{t.finalTitle}</h2>
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
    </div>
  );
}
