'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap-utils';
import UpcomingEvents from '@/components/ui/UpcomingEvents';
import VideoPlayer from '@/components/ui/VideoPlayer';

const expertise = [
  { icon: 'music', title: 'DJ Booking', description: 'Connecting world-class DJs and live performers with venues, festivals and private events globally.', image: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364184/sg-platform/static/assets/kolasi/artists/4F8A3682.jpg', video: '/assets/kolasi/artists/kolasi%20kate%20zubok.mp4' },
  { icon: 'layout', title: 'Event Curation', description: 'Art direction, programming and press relations to shape cultural experiences and narratives.', image: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364262/sg-platform/static/assets/kolasi/images/4F8A2882.jpg', video: '/assets/kolasi/events/2ndsun/2nd_sun.mp4' },
  { icon: 'camera', title: 'Content Creation', description: 'Cinematic capture, editing and campaign-ready media for events and promotions.', image: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364281/sg-platform/static/assets/kolasi/images/4F8A3310.jpg', video: '/assets/kolasi/Speakeasy_Ads/LeSpeakeasyVid.mp4' },
];

const galleryRow1 = [
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364262/sg-platform/static/assets/kolasi/images/4F8A2882.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364266/sg-platform/static/assets/kolasi/images/4F8A3195.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364281/sg-platform/static/assets/kolasi/images/4F8A3310.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364247/sg-platform/static/assets/kolasi/images/4F8A2938.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364282/sg-platform/static/assets/kolasi/images/4F8A3750.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364276/sg-platform/static/assets/kolasi/images/4F8A3777.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364297/sg-platform/static/assets/kolasi/images/4F8A3801.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364299/sg-platform/static/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.jpg',
];

const galleryRow2 = [
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364188/sg-platform/static/assets/kolasi/artists/artist-1.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364228/sg-platform/static/assets/kolasi/artists/artist-2.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364230/sg-platform/static/assets/kolasi/artists/artist-3.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364243/sg-platform/static/assets/kolasi/artists/artist-4.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364222/sg-platform/static/assets/kolasi/artists/IMG_6476.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364210/sg-platform/static/assets/kolasi/artists/IMG_6733.jpg',
  'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364184/sg-platform/static/assets/kolasi/artists/4F8A3682.jpg',
];

const IconMusic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);
const IconLayout = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
);
const IconCamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
);

function getIcon(name: string) {
  switch (name) {
    case 'music': return <IconMusic />;
    case 'layout': return <IconLayout />;
    case 'camera': return <IconCamera />;
    default: return null;
  }
}

interface GalleryPhoto {
  image?: { url: string };
}

interface KolasiEvent {
  gallery?: GalleryPhoto[];
}

interface KolasiClientProps {
  events: KolasiEvent[];
  upcomingEvents?: any[];
}

/* Static promo clips — brand media previews only (autoplay, muted, not linked out). */
const showcasePoster = 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364299/sg-platform/static/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.jpg';
const showcaseClips: { src: string; poster?: string; loopEnd?: number }[] = [
  { src: '/assets/kolasi/Speakeasy_Ads/le%20speakeasy%20ads2%20barman.mp4', poster: showcasePoster },
  { src: '/assets/kolasi/Speakeasy_Ads/lespeakeasy%20g500%20mercedes.mp4', poster: showcasePoster, loopEnd: 24 },
  { src: '/assets/kolasi/Speakeasy_Ads/le%20speakeasy%20ads.mp4', poster: showcasePoster },
];

function ShowcaseCard({ clip }: { clip: typeof showcaseClips[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="reveal-up aspect-[4/3] rounded-3xl overflow-hidden border relative group sg-media-frame"
    >
      <div className="w-full h-full">
        <VideoPlayer
          src={clip.src}
          poster={clip.poster}
          loopEnd={clip.loopEnd}
          autoPlay
          loop
          muted
          mode="hero"
        />
      </div>
    </div>
  );
}

function ShowcaseSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 reveal-up">
          <h2 className="text-4xl font-serif mb-4 italic">Kolasi Showcase</h2>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Selected clips and promos from Kolasi nights.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcaseClips.map((clip) => (
            <ShowcaseCard key={clip.src} clip={clip} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Marquee Gallery ── */
function MarqueeRow({ images, direction = 'left', speed = 1 }: { images: string[]; direction?: 'left' | 'right'; speed?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    registerGSAP();
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    if (!track) return;

    // Wait for all images in this row to load before measuring
    const imgs = Array.from(track.querySelectorAll('img'));
    const allLoaded = () => {
      const gap = 16;
      // Measure one set (first half of children, since we render 2x in JSX)
      const halfCount = imgs.length / 2;
      let totalWidth = 0;
      for (let i = 0; i < halfCount; i++) {
        totalWidth += imgs[i].parentElement!.offsetWidth + gap;
      }
      if (totalWidth <= 0) return;

      // Simple infinite tween: slide by one set width
      const tween = gsap.fromTo(track,
        { x: direction === 'left' ? 0 : -totalWidth },
        {
          x: direction === 'left' ? -totalWidth : 0,
          duration: totalWidth / (50 * speed),
          ease: 'none',
          repeat: -1,
        },
      );
      tweenRef.current = tween;

      // Scroll-velocity boost
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = Math.abs(self.getVelocity()) / 1000;
          gsap.to(tween, { timeScale: 1 + v * 0.5, duration: 0.3, overwrite: true });
        },
      });
    };

    // Check if all loaded, otherwise wait
    const pending = imgs.filter((img) => !img.complete);
    if (pending.length === 0) {
      allLoaded();
    } else {
      let loadedCount = 0;
      const onLoad = () => {
        loadedCount++;
        if (loadedCount >= pending.length) allLoaded();
      };
      pending.forEach((img) => img.addEventListener('load', onLoad, { once: true }));
    }
  }, { scope: wrapperRef });

  return (
    <div ref={wrapperRef} className="overflow-hidden">
      <div ref={trackRef} className="flex gap-4 will-change-transform w-max">
        {/* Original set */}
        {images.map((src, i) => (
          <div
            key={`a-${i}`}
            className="flex-shrink-0 rounded-2xl overflow-hidden"
          >
            <Image src={src} alt="Kolasi event" className="h-56 md:h-72 w-auto object-cover pointer-events-none" width={400} height={288} placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="300px" />
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {images.map((src, i) => (
          <div
            key={`b-${i}`}
            className="flex-shrink-0 rounded-2xl overflow-hidden"
          >
            <Image src={src} alt="Kolasi event" className="h-56 md:h-72 w-auto object-cover pointer-events-none" width={400} height={288} placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="300px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Services Accordion ── */
const services = [
  {
    num: '01',
    title: 'DJ & Live Show Booking',
    description: 'Talent sourcing, rider negotiation and international bookings for clubs, festivals and private events across Europe, the Middle East, and South America.',
    tags: ['Clubs', 'Festivals', 'Private Events', 'International Tours'],
    image: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364184/sg-platform/static/assets/kolasi/artists/4F8A3682.jpg',
  },
  {
    num: '02',
    title: 'Event Curation & PR',
    description: 'Art direction, programming and press relations to shape cultural experiences and narratives that resonate with audiences worldwide.',
    tags: ['Art Direction', 'Programming', 'Press Relations', 'Brand Strategy'],
    image: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364266/sg-platform/static/assets/kolasi/images/4F8A3195.jpg',
  },
  {
    num: '03',
    title: 'Content Creation & Production',
    description: 'Cinematic capture, editing and campaign-ready media for events and promotions — from music videos to social content and brand films.',
    tags: ['Music Videos', 'Event Recaps', 'Social Content', 'Brand Films'],
    image: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364281/sg-platform/static/assets/kolasi/images/4F8A3310.jpg',
  },
  {
    num: '+',
    title: 'Sound & Light Design',
    description: 'Full technical production — sound engineering and lighting design that transforms any venue into an immersive experience.',
    tags: ['Sound Engineering', 'Lighting Design', 'Venue Setup', 'Technical Production'],
    image: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364282/sg-platform/static/assets/kolasi/images/4F8A3750.jpg',
  },
];

function ServicesAccordion() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const toggle = useCallback((idx: number) => {
    const isClosing = activeIdx === idx;
    const prevIdx = activeIdx;

    // Close previous
    if (prevIdx !== null && prevIdx !== idx) {
      const prevContent = contentRefs.current[prevIdx];
      const prevImg = imgRefs.current[prevIdx];
      if (prevContent) gsap.to(prevContent, { height: 0, duration: 0.6, ease: 'power3.inOut' });
      if (prevImg) gsap.to(prevImg, { opacity: 0, scale: 1.1, duration: 0.5 });
    }

    if (isClosing) {
      // Close current
      const content = contentRefs.current[idx];
      const img = imgRefs.current[idx];
      if (content) gsap.to(content, { height: 0, duration: 0.6, ease: 'power3.inOut' });
      if (img) gsap.to(img, { opacity: 0, scale: 1.1, duration: 0.5 });
      setActiveIdx(null);
    } else {
      // Open new
      const content = contentRefs.current[idx];
      const img = imgRefs.current[idx];
      if (content) {
        gsap.set(content, { height: 'auto' });
        const h = content.offsetHeight;
        gsap.fromTo(content, { height: 0 }, { height: h, duration: 0.7, ease: 'power3.inOut' });
      }
      if (img) {
        gsap.fromTo(img, { opacity: 0, scale: 1.15 }, { opacity: 0.35, scale: 1, duration: 1, ease: 'power2.out' });
      }
      // Stagger text elements
      const textEls = content?.querySelectorAll('.acc-reveal');
      if (textEls) {
        gsap.fromTo(textEls, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, delay: 0.2, ease: 'power2.out' });
      }
      setActiveIdx(idx);
    }
  }, [activeIdx]);

  return (
    <section ref={sectionRef} className="py-20 border-y" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 reveal-up italic">Services &amp; Capabilities</h2>
        <div className="reveal-up">
          {services.map((svc, i) => (
            <div
              key={i}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="border-b cursor-pointer group relative overflow-hidden"
              style={{ borderColor: 'var(--border-subtle)' }}
              onClick={() => toggle(i)}
            >
              {/* Background image (absolute, behind content) */}
              <Image
                ref={(el) => { imgRefs.current[i] = el; }}
                src={svc.image}
                alt=""
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ opacity: 0, transform: 'scale(1.15)' }}
                sizes="(max-width: 768px) 100vw, 960px"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--surface-page) 30%, color-mix(in srgb, var(--surface-page) 70%, transparent))' }} />

              {/* Collapsed header — always visible */}
              <div className="relative z-10 flex items-center justify-between py-7 md:py-8">
                <div className="flex items-center gap-6 md:gap-8">
                  <span className="text-2xl md:text-3xl font-serif italic transition-colors duration-300" style={{ color: activeIdx === i ? 'var(--text-accent)' : 'var(--text-muted)' }}>
                    {svc.num}
                  </span>
                  <h3 className="text-lg md:text-xl font-serif transition-colors duration-300" style={{ color: activeIdx === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {svc.title}
                  </h3>
                </div>
                <div
                  className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: activeIdx === i ? 'var(--text-accent)' : 'var(--border-strong)', transform: activeIdx === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>

              {/* Expandable content */}
              <div
                ref={(el) => { contentRefs.current[i] = el; }}
                className="relative z-10 overflow-hidden"
                style={{ height: 0 }}
              >
                <div className="pb-10 pl-8 md:pl-16 pr-6 max-w-2xl">
                  <p className="acc-reveal text-sm md:text-base leading-relaxed font-light mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {svc.description}
                  </p>
                  <div className="acc-reveal flex flex-wrap gap-2">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-4 py-2 rounded-full border"
                        style={{ borderColor: 'color-mix(in srgb, var(--text-accent) 30%, transparent)', color: 'var(--text-accent)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeGallery({ row1, row2 }: { row1: string[]; row2: string[] }) {
  return (
    <section className="py-20 overflow-hidden">
      <div className="text-center mb-16 reveal-up px-6">
        <h2 className="text-4xl font-serif italic mb-4">Kolasi Gallery</h2>
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          A glimpse into our nights ~ sound, light and emotion captured in motion.
        </p>
      </div>
      <div className="space-y-4">
        <MarqueeRow images={row1} direction="left" speed={1} />
        <MarqueeRow images={row2} direction="right" speed={0.8} />
      </div>
    </section>
  );
}

export default function KolasiClient({ events, upcomingEvents = [] }: KolasiClientProps) {
  // Build gallery from CMS events or fallback
  const cmsGallery = events.flatMap((e: KolasiEvent) =>
    (e.gallery || []).map((g: GalleryPhoto) => g.image?.url).filter((u): u is string => Boolean(u)),
  );
  const row1 = cmsGallery.length > 0 ? cmsGallery.slice(0, Math.ceil(cmsGallery.length / 2)) : galleryRow1;
  const row2 = cmsGallery.length > 0 ? cmsGallery.slice(Math.ceil(cmsGallery.length / 2)) : galleryRow2;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGSAP();
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pt-20" style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="absolute inset-0">
          <VideoPlayer
            muxPlaybackId="RcF8cn9OBkB6iEkU6SYZb3SE00noBIWdVOneK5fqJuWo"
            poster="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364266/sg-platform/static/assets/kolasi/images/4F8A3195.jpg"
            autoPlay
            loop
            muted
            mode="hero"
            className="opacity-60 scale-105"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--media-scrim) 60%, transparent), transparent, var(--surface-page))' }} />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 uppercase tracking-tighter leading-none reveal-up">
            Creative Booking <br />
            <span className="italic">and Talent Agency</span>
          </h1>
          <p className="text-xs md:text-sm font-medium mb-10 reveal-up" style={{ color: 'var(--text-muted)' }}>
            DJ &amp; Live Show Booking &bull; Event Curation &bull; Content Creation &bull; Production Services
          </p>
          <a href="#services" className="px-10 py-4 border rounded-full text-sm font-semibold transition-all reveal-up backdrop-blur-sm inline-block sg-action-secondary">
            Explore Services
          </a>
        </div>
      </section>

      {/* Manifesto + Logo */}
      <section className="py-16 md:py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="space-y-10 reveal-up">
          <h2 className="text-4xl md:text-5xl font-serif leading-tight italic">
            Curating Nights <br />
            <span className="not-italic">That Move People</span>
          </h2>
          <div className="space-y-5 text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-secondary)' }}>
            <p>At Kolasi, we craft your brand&apos;s visual and audio identity through artistic direction, DJ bookings, live shows with top-tier singers, and PR strategy.</p>
            <p>Our agency creates events and collaborates with renowned curators to deliver unforgettable experiences.</p>
            <p>With a network of over <span className="font-medium" style={{ color: 'var(--text-primary)' }}>50 international DJs</span> and partnerships across Europe, the Middle East, and South America, Kolasi bridges music, performance, and innovation to elevate every moment.</p>
          </div>
        </div>
        <div className="reveal-up">
          <div className="aspect-[4/3] rounded-[2.5rem] border relative overflow-hidden group sg-media-frame">
            <Image
              src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364266/sg-platform/static/assets/kolasi/images/4F8A3195.jpg"
              alt="Kolasi — behind the scenes"
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--brand-dark) 88%, transparent), transparent)' }} />
            <div className="absolute bottom-8 left-8 z-10">
              <p className="text-xl font-serif tracking-[0.2em] uppercase text-on-media">Kolasi</p>
              <p className="text-[10px] font-light mt-1 text-on-media-dim">Agency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section id="services" className="py-20 border-y" style={{ backgroundColor: 'var(--surface-page)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-24 reveal-up">
            <h2 className="text-4xl md:text-6xl font-serif italic mb-4">Our Expertise</h2>
            <div className="w-20 h-[1px] mx-auto" style={{ backgroundColor: 'var(--border-strong)' }} />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {expertise.map((exp, i) => (
              <div key={i} className="reveal-up rounded-[2rem] overflow-hidden relative group aspect-[3/4] cursor-pointer">
                <VideoPlayer
                  src={exp.video}
                  poster={exp.image}
                  autoPlay
                  loop
                  muted
                  mode="hero"
                  className="absolute inset-0 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--brand-dark) 92%, transparent) 10%, color-mix(in srgb, var(--brand-dark) 60%, transparent) 50%, transparent)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                  <div className="mb-4 p-3 rounded-full inline-flex" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-dark) 60%, transparent)', color: 'var(--brand-ivory)' }}>
                    {getIcon(exp.icon)}
                  </div>
                  <h3 className="text-xl font-serif mb-3 text-on-media">{exp.title}</h3>
                  <p className="text-sm leading-relaxed font-light text-on-media-dim">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kolasi Showcase */}
      <ShowcaseSection />

      {/* Upcoming Events */}
      <UpcomingEvents events={upcomingEvents} />

      {/* Services & Capabilities — Accordion */}
      <ServicesAccordion />

      {/* Gallery — Infinite Marquee */}
      <MarqueeGallery row1={row1} row2={row2} />

      {/* For Venue Owners Banner */}
      <section className="py-20 reveal-up" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border p-8 md:p-12 flex flex-col md:flex-row items-center gap-8" style={{ borderColor: 'var(--border-accent)', background: 'linear-gradient(to right, var(--brand-gold-soft), transparent)' }}>
            <div className="flex-1">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-accent)' }}>For Venue Owners</p>
              <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Looking for weekly programming?
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                We offer full-service venue programming — DJ booking, content production, and brand strategy tailored to your crowd.
              </p>
            </div>
            <Link
              href="/venues"
              className="border font-semibold text-sm px-8 py-3 rounded-lg active:scale-[0.98] transition-all whitespace-nowrap sg-action-accent"
            >
              Explore Venue Packages
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-40 text-center border-t" style={{ background: 'linear-gradient(to bottom, var(--surface-page), var(--surface-card))', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-3xl mx-auto px-6 reveal-up">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-10 italic">Let&apos;s Create the Night</h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            From concept to performance, Kolasi curates experiences that transcend nightlife.
          </p>
          <Link href="/contact" className="px-14 py-4 border rounded-full text-sm font-semibold transition-all sg-action-secondary">
            Contact Kolasi
          </Link>
        </div>
      </section>
    </div>
  );
}
