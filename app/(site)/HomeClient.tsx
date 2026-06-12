'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import OrbitCarousel from '@/components/ui/OrbitCarousel';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { SectionKicker } from '@/components/ui/SectionKicker';
import TestimonialCarousel from '@/components/ui/TestimonialCarousel';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';
import { fallbackMedia, homeCollaborations, homeFeaturedSets } from '@/lib/fallback-media';

interface CMSPhoto {
  url?: string;
}

interface CMSGalleryItem {
  image?: CMSPhoto;
  [key: string]: unknown;
}

interface CMSProject {
  slug?: string;
  title?: string;
  heroVideo?: { muxPlaybackId?: string; posterUrl?: string };
  gallery?: CMSGalleryItem[];
  category?: string;
  [key: string]: unknown;
}

interface CMSArtist {
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface HomeClientProps {
  settings: Record<string, unknown>;
  blazeProjects: CMSProject[];
  kolasiEvents: CMSProject[];
  artists: CMSArtist[];
  testimonials?: any[];
  locale?: Locale;
}

export default function HomeClient({ blazeProjects, testimonials = [], locale = 'en' }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getDictionary(locale).home;

  // Blaze section cycling images
  const blazeImages = [
    blazeProjects[0]?.gallery?.[0]?.image?.url || fallbackMedia.blaze.stouhHero,
    blazeProjects[1]?.gallery?.[0]?.image?.url || fallbackMedia.blaze.embassyHero,
    fallbackMedia.blaze.weddingHero,
  ];
  const [blazeIdx, setBlazeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBlazeIdx((prev) => (prev + 1) % blazeImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [blazeImages.length]);

  // Build carousel items from CMS or fallback
  const carouselItems = blazeProjects.length > 0
    ? blazeProjects.map((p: CMSProject) => ({
        url: p.gallery?.[0]?.image?.url || p.heroVideo?.posterUrl || fallbackMedia.blaze.stouhHero,
        title: p.title || 'Untitled',
        category: p.category || 'Production',
      }))
    : homeFeaturedSets;

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
      {/* Cinematic Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <VideoPlayer
            muxPlaybackId="ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A"
            poster={fallbackMedia.blaze.weddingPoster}
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
              {t.title[0]} <span className="italic">{t.title[1]}</span> {t.title[2]} <span className="italic">{t.title[3]}</span>
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
            <div className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={blazeProjects[0]?.gallery?.[0]?.image?.url || fallbackMedia.blaze.weddingPoster}
                alt="Blaze Motion â€” Signature Wedding Reel"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-all duration-700"
                priority
              />
              <div className="absolute inset-0 flex flex-col justify-end p-10" style={{ background: 'linear-gradient(to top, var(--bg), transparent, transparent)' }}>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-mute)' }}>Blaze Motion</p>
                <h3 className="text-xl font-serif italic mb-1">Signature Wedding Reel</h3>
                <p className="text-xs font-light border-t border-white/10 pt-4 mt-4" style={{ color: 'var(--text-mute)' }}>
                  Paris &bull; Cinematic Weddings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <div className="w-[1px] h-10 bg-white" />
        </div>
      </section>

      {/* Featured Sets */}
      <section className="py-16 md:py-40 overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-24 reveal-section">
            <p className="ui-kicker font-medium mb-6" style={{ color: 'var(--text-mute)' }}>{t.featuredKicker}</p>
            <h2 className="text-3xl md:text-4xl font-serif max-w-4xl mx-auto leading-tight italic">
              {t.featuredTitleA} <span className="not-italic">{t.featuredTitleB}</span>
            </h2>
          </div>
          <div className="reveal-section pb-16 md:pb-24">
            <OrbitCarousel items={carouselItems} />
          </div>
        </div>
      </section>

      {/* Blaze Section Split */}
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
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transform md:translate-x-12 relative z-10">
                {blazeImages.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt="Blaze Production"
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: i === blazeIdx ? 1 : 0 }}
                  />
                ))}
              </div>
              <div className="hidden md:block absolute top-1/2 -left-12 -translate-y-1/2 aspect-[4/5] w-2/3 rounded-3xl overflow-hidden shadow-2xl opacity-40">
                {blazeImages.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt="Blaze Production"
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: i === (blazeIdx + 1) % blazeImages.length ? 1 : 0 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kolasi Section */}
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
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                <VideoPlayer muxPlaybackId="uar02cwjF78qfyUUvSQIMcnQyHVImiF6sJP3Izh7D01JU" autoPlay loop muted mode="hero" lazy />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                <VideoPlayer muxPlaybackId="RcF8cn9OBkB6iEkU6SYZb3SE00noBIWdVOneK5fqJuWo" autoPlay loop muted mode="hero" lazy />
              </div>
              <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                <VideoPlayer muxPlaybackId="bzlHPIIz3L68lqg6fmMTH02GsYL1AeZnT6ewRQIlokaE" autoPlay loop muted mode="hero" lazy />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Venues CTA */}
      <section className="py-16 reveal-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#c8a96e]/20 bg-gradient-to-br from-[#c8a96e]/[0.06] to-transparent p-6 md:p-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <SectionKicker label={t.venuesKicker} />
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                  {t.venuesTitle}
                </h2>
                <p className="ui-body-small md:ui-body mb-8" style={{ color: 'var(--text-dim)' }}>
                  {t.venuesText}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={localizedPath('/venues', locale)}
                    className="bg-[#c8a96e] text-[#09090b] font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#d4b87a] active:scale-[0.98] transition-all"
                  >
                    {t.learnMore}
                  </Link>
                  <Link
                    href={`${localizedPath('/venues', locale)}#venue-form`}
                    className="border border-[#c8a96e] text-[#c8a96e] font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#c8a96e]/[0.08] transition-all"
                  >
                    {t.applyNow}
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { stat: '150+', label: 'Live sessions' },
                    { stat: '12+', label: 'Venues' },
                    { stat: '3x', label: 'Avg. engagement lift' },
                  ].map((s, i) => (
                    <div key={i} className="p-4">
                      <p className="font-serif text-2xl text-[#c8a96e] font-bold">{s.stat}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-mute)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#c8a96e]/[0.04] rounded-full blur-[80px]" />
          </div>
        </div>
      </section>

      {/* Trusted Collaborations */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="reveal-section">
            <p className="ui-kicker font-medium mb-8" style={{ color: 'var(--text-mute)' }}>{t.trustedKicker}</p>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-10 md:mb-20">
              {t.trustedTitle}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {homeCollaborations.map((c, i) => (
                <div key={i} className="group flex flex-col items-center justify-center p-4 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#c8a96e]/20 hover:bg-[#c8a96e]/[0.03] transition-all duration-500">
                  <div className="h-12 flex items-center justify-center mb-5">
                    {c.logo ? (
                      <Image src={c.logo} alt={c.name} width={120} height={40} placeholder="blur" blurDataURL={BLUR_DATA_URL} className="h-10 w-auto object-contain mix-blend-screen opacity-60 group-hover:opacity-100 transition-opacity duration-500" sizes="120px" />
                    ) : (
                      <span className="text-lg font-serif italic text-white/20 group-hover:text-white/50 transition-colors duration-500">{c.name.split(' ').map(w => w[0]).join('')}</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold mb-1 text-white/70 group-hover:text-white transition-colors">{c.name}</p>
                  <p className="ui-caption font-light group-hover:text-[#c8a96e]/60 transition-colors" style={{ color: 'var(--text-mute)' }}>{c.location}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 flex justify-center space-x-6 md:space-x-12 py-10 border-y border-white/5">
              <div className="text-center">
                <p className="ui-kicker font-medium mb-2" style={{ color: 'var(--text-mute)' }}>{t.cities}</p>
                <p className="text-3xl font-serif">12+</p>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div className="text-center">
                <p className="ui-kicker font-medium mb-2" style={{ color: 'var(--text-mute)' }}>{t.experiences}</p>
                <p className="text-3xl font-serif">150+ sets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel
        testimonials={testimonials}
        heading={t.testimonialsTitle}
        subheading={t.testimonialsSub}
      />

      {/* CTA */}
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
              className="inline-block px-12 py-4 bg-[#c8a96e]/10 border border-[#c8a96e]/30 rounded-full text-sm font-semibold text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#09090b] transition-all"
            >
              {t.venueOwnerCta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
