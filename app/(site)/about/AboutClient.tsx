'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap-utils';

interface BrandPillar {
  num: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  stats: { value: string; label: string }[];
  link: string;
  visual: { type: 'image' | 'video'; src: string; muxPlaybackId?: string };
}

const brandPillars: BrandPillar[] = [
  {
    num: '01',
    name: 'Samuell Goldfinch',
    tagline: 'The creative force behind every frame and frequency.',
    description: 'Paris-based creative director, filmmaker, and international DJ. Bridging art, technology, and music to create experiences that move people.',
    accent: 'var(--text)',
    stats: [
      { value: '50+', label: 'Productions' },
      { value: '12', label: 'Cities' },
      { value: '50+', label: 'Intl DJs' },
    ],
    link: '/about',
    visual: { type: 'image', src: '/assets/1st.png' },
  },
  {
    num: '02',
    name: 'Kolasi Agency',
    tagline: 'Where culture meets the night.',
    description: 'Creative booking and talent agency crafting visual and audio identities through DJ bookings, event curation, and PR strategy across three continents.',
    accent: '#a78bfa',
    stats: [
      { value: '20+', label: 'Venue Partners' },
      { value: '3', label: 'Continents' },
      { value: '50+', label: 'DJs Booked' },
    ],
    link: '/kolasi',
    visual: { type: 'video', src: '/assets/kolasi/events/2ndsun/2nd_sun.mp4', muxPlaybackId: 'RcF8cn9OBkB6iEkU6SYZb3SE00noBIWdVOneK5fqJuWo' },
  },
  {
    num: '03',
    name: 'Blaze Production',
    tagline: 'Bringing your story to life.',
    description: 'Full-service creative studio specialising in cinematic wedding films, editorial content, and branded storytelling with a director\'s eye in every frame.',
    accent: '#c8a96e',
    stats: [
      { value: '50+', label: 'Films' },
      { value: '4', label: 'Major Brands' },
      { value: '12', label: 'Cities' },
    ],
    link: '/blaze',
    visual: { type: 'image', src: '/assets/blaze/weddings/DSCF2395.jpg' },
  },
];

const drives = [
  {
    title: 'Film',
    description: 'Emotion-first direction for weddings, commercials and editorial films that are made to last.',
    accent: '#c8a96e',
    link: '/blaze',
    image: '/assets/blaze/weddings/DSCF2395.jpg',
  },
  {
    title: 'Music',
    description: 'Melodic and commercial house sets that blend culture and mood into a dancefloor journey.',
    accent: '#a78bfa',
    link: '/kolasi',
    image: '/assets/kolasi/artists/4F8A3682.jpg',
  },
  {
    title: 'Experiences',
    description: 'Kolasi curates multi-sensory events, from scenography to PR, turning moments into memories.',
    accent: '#c8a96e',
    link: '/kolasi',
    image: '/assets/kolasi/images/4F8A2882.jpg',
  },
];

const notableCredits = {
  credits: ['Le Speakeasy Paris & Cannes', 'Brunch Festival Paris', 'Solomun / Carl Cox (warm-up sets)', 'MIPIM Cannes / France Tourisme'],
  genres: ['Melodic house, deep house, warm techno, commercial house, live vocal sets'],
  assets: ['DJ press photos (high-res)', 'Bio / rider (PDF)', 'Set recordings (SoundCloud)'],
};

interface CmsMilestone {
  title?: string;
  name?: string;
  description?: string;
  brand?: string;
  tagline?: string;
}

interface AboutClientProps {
  cmsMilestones: CmsMilestone[];
  settings: Record<string, unknown>;
}

const accentMap: Record<string, string> = {
  blaze: '#c8a96e',
  kolasi: '#a78bfa',
  personal: 'var(--text)',
  both: 'var(--text)',
};

export default function AboutClient({ cmsMilestones }: AboutClientProps) {
  // Use CMS milestones if populated, otherwise static fallback
  const displayPillars: BrandPillar[] = cmsMilestones.length > 0
    ? cmsMilestones.map((m, i) => ({
        num: String(i + 1).padStart(2, '0'),
        name: m.title || m.name || '',
        tagline: m.tagline || '',
        description: m.description || '',
        accent: accentMap[m.brand || 'personal'] || 'var(--text)',
        stats: [],
        link: '/about',
        visual: brandPillars[i]?.visual || { type: 'image' as const, src: '/assets/about/IMAGE_PORTRAIT.webp' },
      }))
    : brandPillars;
  const containerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  // Brand Pillars — scroll-drawn line + staggered card reveals
  useGSAP(() => {
    registerGSAP();
    const section = pillarsRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    if (prefersReducedMotion()) {
      line.style.height = '100%';
      return;
    }

    // Scroll-drawn vertical line
    ScrollTrigger.create({
      trigger: section.querySelector('.pillar-track'),
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 0.3,
      animation: gsap.fromTo(line, { height: '0%' }, { height: '100%', ease: 'none' }),
    });

    // Per-card timeline animations
    section.querySelectorAll<HTMLElement>('.pillar-card').forEach((card) => {
      const dot = card.querySelector('.pillar-dot') as HTMLElement | null;
      const glass = card.querySelector('.pillar-glass') as HTMLElement | null;
      const num = card.querySelector('.pillar-num') as HTMLElement | null;
      const inner = card.querySelectorAll('.pillar-reveal');

      // Set initial states
      if (dot) gsap.set(dot, { scale: 0 });
      if (glass) gsap.set(glass, { y: 50, opacity: 0 });
      if (inner.length) gsap.set(inner, { y: 20, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 85%' },
      });

      if (dot) tl.to(dot, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
      if (glass) tl.to(glass, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.2');
      if (num) tl.fromTo(num, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4');
      if (inner.length) tl.to(inner, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    });
  }, { scope: pillarsRef });

  return (
    <div ref={containerRef} className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-32 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif mb-10 leading-none reveal-up">
          The Story <br />
          <span className="italic">Behind the Vision</span>
        </h1>
        <p className="text-xs md:text-sm font-medium leading-relaxed reveal-up" style={{ color: 'var(--text-mute)' }}>
          Film director, international DJ and curator, Samuell Goldfinch crafts cinematic worlds and live experiences that move people.
        </p>
        <div className="mt-16 reveal-up">
          <div className="w-10 h-10 rounded-full border border-white/10 mx-auto flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Portrait & Bio */}
      <section className="py-12 md:py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-24 items-center">
        <div className="reveal-up">
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl bg-neutral-900 border border-white/5 group">
            <Image
              src="/assets/about/IMG_5840.JPG"
              alt="Samuell Goldfinch"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-all duration-700"
            />
          </div>
        </div>
        <div className="space-y-12 reveal-up">
          <h2 className="text-4xl font-serif italic mb-6">About Samuell</h2>
          <div className="space-y-5 text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
            <p>
              Paris-based creative director, filmmaker, and international DJ. Founder of <span className="font-medium" style={{ color: 'var(--text)' }}>Blaze Production</span> (cinematic film and photography) and <span className="font-medium" style={{ color: 'var(--text)' }}>Kolasi Agency</span> (DJ booking, event curation, and content creation).
            </p>
            <p>
              With over 50 productions across 12 cities — including work for <span className="font-medium" style={{ color: 'var(--text)' }}>MIPIM Cannes</span>, <span className="font-medium" style={{ color: 'var(--text)' }}>Brunch Festival</span>, <span className="font-medium" style={{ color: 'var(--text)' }}>Transdev</span>, and <span className="font-medium" style={{ color: 'var(--text)' }}>France Tourisme</span> — and a network of 50+ international DJs across 20+ venues, Samuell bridges art, technology, and music.
            </p>
            <p>
              Known for performances at <span className="font-medium" style={{ color: 'var(--text)' }}>Le Speakeasy Paris &amp; Cannes</span>, Gate Club, Silencio, Saint-Tropez, San Sebasti&aacute;n, and Hard Rock Hotel Punta Cana, Samuell continues to unite art, technology, and music to create experiences that move people.
            </p>
          </div>
        </div>
      </section>

      {/* The Universe — Brand Pillars */}
      <section ref={pillarsRef} className="py-16 md:py-40 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-32 reveal-up">
          <p className="text-xs font-medium mb-6" style={{ color: 'var(--text-mute)' }}>
            Three Pillars
          </p>
          <h2 className="text-4xl md:text-5xl font-serif italic">The Universe</h2>
        </div>

        {/* Timeline container */}
        <div className="relative pillar-track">
          {/* Background line (static) */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px]" style={{ backgroundColor: 'var(--border)' }} />
          {/* Foreground line (scroll-drawn) */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 w-[1px] overflow-hidden" style={{ height: '100%' }}>
            <div ref={lineRef} className="w-full origin-top" style={{ height: '0%', background: 'linear-gradient(to bottom, var(--text), var(--text-mute))' }} />
          </div>

          {/* Pillar cards — alternating left/right with visuals */}
          <div className="space-y-16 md:space-y-36">
            {displayPillars.map((pillar, i) => {
              const isLeft = i % 2 === 0;

              const cardContent = (
                <div
                  className="pillar-glass border rounded-2xl p-8 md:p-12 overflow-hidden relative group transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-hi)',
                  }}
                  onMouseEnter={(e) => {
                    if (pillar.accent !== 'var(--text)') {
                      e.currentTarget.style.borderColor = pillar.accent;
                      e.currentTarget.style.boxShadow = `0 0 40px color-mix(in srgb, ${pillar.accent} 10%, transparent)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: pillar.accent }} />
                  <span
                    className="pillar-num text-5xl md:text-6xl font-serif italic absolute top-6 right-8 opacity-15"
                    style={{ color: pillar.accent }}
                  >
                    {pillar.num}
                  </span>
                  <div className="relative z-10 space-y-5">
                    <h3 className="pillar-reveal text-2xl md:text-3xl font-serif">{pillar.name}</h3>
                    <p className="pillar-reveal text-sm font-light italic" style={{ color: pillar.accent !== 'var(--text)' ? pillar.accent : 'var(--text-dim)' }}>
                      {pillar.tagline}
                    </p>
                    <p className="pillar-reveal text-sm leading-relaxed font-light" style={{ color: 'var(--text-dim)' }}>
                      {pillar.description}
                    </p>
                    {pillar.stats.length > 0 && (
                      <div className="pillar-reveal grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                        {pillar.stats.map((stat, si) => (
                          <div key={si} className="text-center md:text-left">
                            <p className="text-2xl md:text-3xl font-serif" style={{ color: pillar.accent !== 'var(--text)' ? pillar.accent : 'var(--text)' }}>
                              {stat.value}
                            </p>
                            <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-mute)' }}>{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {pillar.link !== '/about' && (
                      <Link
                        href={pillar.link}
                        className="pillar-reveal inline-flex items-center gap-2 text-xs font-medium pt-2 group/link"
                        style={{ color: pillar.accent }}
                      >
                        <span>Explore {pillar.name.split(' ')[0]}</span>
                        <svg className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              );

              const isSignature = i === 0;
              const visualContent = (
                <div
                  className={`hidden md:block relative overflow-hidden group ${isSignature ? '' : 'rounded-2xl border'}`}
                  style={{
                    borderColor: isSignature ? undefined : 'var(--border)',
                    minHeight: isSignature ? undefined : '100%',
                  }}
                >
                  {pillar.visual.type === 'video' ? (
                    <div className="absolute inset-0">
                      <VideoPlayer
                        muxPlaybackId={pillar.visual.muxPlaybackId}
                        src={pillar.visual.muxPlaybackId ? undefined : pillar.visual.src}
                        autoPlay
                        loop
                        muted
                        mode="hero"
                        className="group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : (
                    <Image
                      src={pillar.visual.src}
                      alt={pillar.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={
                        isSignature
                          ? 'object-contain group-hover:scale-[1.03] transition-transform duration-700 drop-shadow-2xl'
                          : 'object-cover group-hover:scale-105 transition-transform duration-700'
                      }
                    />
                  )}
                </div>
              );

              return (
                <div key={i} className="pillar-card relative">
                  {/* Pulsing dot on the center line */}
                  <div className="pillar-dot absolute left-6 md:left-1/2 -translate-x-1/2 top-10 z-20">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.accent }} />
                    <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-30" style={{ backgroundColor: pillar.accent }} />
                  </div>

                  {/* Two-column: card + visual, alternating order */}
                  <div className="ml-16 md:ml-0 md:grid md:grid-cols-2 md:gap-8 md:items-stretch">
                    {isLeft ? (
                      <>
                        <div className="md:pr-10">{cardContent}</div>
                        <div className="md:pl-10 h-full">{visualContent}</div>
                      </>
                    ) : (
                      <>
                        <div className="md:pr-10 h-full">{visualContent}</div>
                        <div className="md:pl-10">{cardContent}</div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Drives the Work */}
      <section className="py-16 md:py-40 border-y" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-20 reveal-up">
            <p className="text-xs font-medium mb-4" style={{ color: 'var(--text-mute)' }}>The Foundation</p>
            <h2 className="text-4xl md:text-5xl font-serif italic">What Drives the Work</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {drives.map((drive, i) => (
              <Link
                key={i}
                href={drive.link}
                className="reveal-up group relative overflow-hidden rounded-[2rem] aspect-[3/4] cursor-pointer block"
              >
                {/* Background image */}
                <Image
                  src={drive.image}
                  alt={drive.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${drive.accent === '#c8a96e' ? 'rgba(30,25,18,0.95)' : 'rgba(20,15,35,0.95)'} 5%, ${drive.accent === '#c8a96e' ? 'rgba(30,25,18,0.5)' : 'rgba(20,15,35,0.5)'} 50%, transparent)`,
                  }}
                />

                {/* Accent line at top on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                  style={{ backgroundColor: drive.accent }}
                />

                {/* Number watermark */}
                <span
                  className="absolute top-6 right-8 text-5xl md:text-6xl font-serif italic opacity-20 z-10"
                  style={{ color: drive.accent }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Content pinned to bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10">
                  <h3 className="text-2xl font-serif mb-3 italic group-hover:translate-x-1 transition-transform duration-300">
                    {drive.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-light opacity-80 mb-5">
                    {drive.description}
                  </p>

                  {/* Explore CTA */}
                  <div
                    className="flex items-center gap-2 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    style={{ color: drive.accent }}
                  >
                    <span>Explore</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Statement & Credits */}
      <section className="py-16 md:py-40 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div data-halo className="reveal-up p-8 md:p-16 border border-white/5 bg-neutral-900/20 rounded-[3rem] space-y-10">
            <h3 className="text-2xl font-serif text-center mb-8 italic">Artist Statement</h3>
            <p className="text-sm leading-[1.9] font-light text-center" style={{ color: 'var(--text-dim)' }}>
              I believe the most powerful stories are felt before they&apos;re understood. Whether through a lens or a live set, my work explores the space between emotion and craft — where a perfectly timed cut mirrors the drop in a melody, where light and sound dissolve the boundary between observer and participant.
            </p>
            <div className="pt-10 border-t border-white/5 text-center">
              <p className="text-xs font-semibold mb-4" style={{ color: 'var(--text)' }}>Quick Facts</p>
              <div className="space-y-2 text-sm font-light" style={{ color: 'var(--text-dim)' }}>
                <p>Artist: Samuell Goldfinch (Kolasi)</p>
                <p>Base: Paris, France (available worldwide)</p>
                <p>Formats: DJ sets, Live programming, Curated line-ups</p>
                <p>Booking: <Link href="/contact" className="text-white hover:underline">contact form</Link> or <a href="mailto:contact@samuellgoldfinch.com" className="text-white hover:underline">email</a></p>
              </div>
            </div>
          </div>

          <div data-halo className="reveal-up p-8 md:p-16 border border-white/5 bg-neutral-900/40 rounded-[3rem] space-y-10 flex flex-col justify-between">
            <div className="text-center space-y-10">
              <h3 className="text-2xl font-serif italic">Notable credits &amp; assets</h3>
              <p className="text-sm font-light" style={{ color: 'var(--text-dim)' }}>Selected collaborations, events and press resources to support editorial use and bookings.</p>
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text)' }}>Notable Credits</p>
                  <ul className="text-sm font-light space-y-1" style={{ color: 'var(--text-dim)' }}>
                    {notableCredits.credits.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text)' }}>Genres</p>
                  <p className="text-sm font-light max-w-xs mx-auto" style={{ color: 'var(--text-dim)' }}>{notableCredits.genres[0]}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text)' }}>Press Assets</p>
                  <ul className="text-sm font-light space-y-1" style={{ color: 'var(--text-dim)' }}>
                    {notableCredits.assets.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-10 text-center">
              <Link href="/press" className="inline-block px-10 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all mb-4">
                Press Kit
              </Link>
              <p className="text-xs font-light" style={{ color: 'var(--text-mute)' }}>
                Or email <a href="mailto:contact@samuellgoldfinch.com" className="hover:text-white transition-colors">contact@samuellgoldfinch.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-40 text-center border-t" style={{ background: 'linear-gradient(to bottom, var(--bg), var(--bg-card))', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 reveal-up">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-10 italic">Let&apos;s Create Together</h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Ready to craft films, events or live performances that resonate? Share your vision, we&apos;ll design the atmosphere, sound and narrative to match.
          </p>
          <Link href="/contact" className="px-14 py-4 border border-white/30 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all">
            Contact Samuell
          </Link>
        </div>
      </section>
    </div>
  );
}
