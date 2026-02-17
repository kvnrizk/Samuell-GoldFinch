'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import OrbitCarousel from '@/components/ui/OrbitCarousel';
import VideoPlayer from '@/components/ui/VideoPlayer';
import TestimonialCarousel from '@/components/ui/TestimonialCarousel';
import BudgetEstimator from '@/components/ui/BudgetEstimator';

// Static fallbacks
const stouhBeirut = [
  { url: '/assets/blaze/stouh_beirut/2E2A1724.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/2E2A2072.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/2E2A1243.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/4F8A9365.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/IMG_6348.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/IMG_6351.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
];

const embassy = [
  { url: '/assets/blaze/ambassy/0C5A9134.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
  { url: '/assets/blaze/ambassy/0C5A9139.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
  { url: '/assets/blaze/ambassy/0C5A9196.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
  { url: '/assets/blaze/ambassy/4F8A9987.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
  { url: '/assets/blaze/ambassy/4F8A9996.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
  { url: '/assets/blaze/ambassy/0C5A9206.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
];

const weddingsStatic = [
  { url: '/assets/blaze/weddings/DSCF2395.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/IMG_0100.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/IMG_0084.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/IMG_0068.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/IMG_0079.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/0G0A7811.jpg', title: 'Weddings', category: 'Cinematic' },
];

const editorialStatic = [
  { url: '/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.JPG', title: 'Editorial & Brand', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-amar-10288372.jpg', title: 'Editorial & Brand', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-angel-ayala-321556-28976231.jpg', title: 'Editorial & Brand', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-fabrice-busching-1777473881-30235864.jpg', title: 'Editorial & Brand', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-valentina-maros-128709290-13283497.jpg', title: 'Editorial & Brand', category: 'Editorial' },
];

interface BlazeGalleryItem {
  image?: {
    url?: string;
  };
}

interface BlazeHeroVideo {
  videoSource?: 'mux' | 'cloudinary';
  muxPlaybackId?: string;
  cloudinaryVideoId?: string;
  posterUrl?: string;
}

interface BlazeProject {
  title: string;
  slug?: string;
  category: string;
  gallery?: BlazeGalleryItem[];
  heroVideo?: BlazeHeroVideo;
}

interface BlazeClientProps {
  projects: BlazeProject[];
  testimonials?: any[];
}

function projectsToCarousel(projects: BlazeProject[], category: string) {
  const filtered = projects.filter((p) => p.category === category);
  if (filtered.length === 0) return null;
  return filtered.flatMap((p) =>
    (p.gallery || []).map((g) => ({
      url: g.image?.url || '',
      title: p.title,
      category: p.category,
    })),
  ).filter((item) => item.url);
}

function firstSlugForCategory(projects: BlazeProject[], category: string): string | null {
  const match = projects.find((p) => p.category === category && p.slug);
  return match?.slug || null;
}

export default function BlazeClient({ projects, testimonials = [] }: BlazeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build carousels from CMS or fallback
  const hasCMS = projects.length > 0;
  const weddingItems = (hasCMS && projectsToCarousel(projects, 'Wedding')) || weddingsStatic;
  const editorialItems = (hasCMS && projectsToCarousel(projects, 'Editorial')) || editorialStatic;
  const eventItems = (hasCMS && projectsToCarousel(projects, 'Event')) || stouhBeirut;
  const diplomaticItems = (hasCMS && projectsToCarousel(projects, 'Diplomatic')) || embassy;

  // Hero video: from first project with heroVideo or fallback
  const heroProject = projects.find((p) => p.heroVideo?.muxPlaybackId || p.heroVideo?.cloudinaryVideoId);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();

    gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--bg)' }}>
      {/* Full Screen Hero Video */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        {(heroProject?.heroVideo?.muxPlaybackId || heroProject?.heroVideo?.cloudinaryVideoId) ? (
          <div className="absolute inset-0">
            <VideoPlayer
              muxPlaybackId={heroProject.heroVideo.videoSource !== 'cloudinary' ? heroProject.heroVideo.muxPlaybackId : undefined}
              cloudinaryVideoId={heroProject.heroVideo.videoSource === 'cloudinary' ? heroProject.heroVideo.cloudinaryVideoId : undefined}
              poster={heroProject.heroVideo.posterUrl}
              autoPlay
              loop
              muted
              mode="hero"
              className="opacity-60 scale-105"
            />
          </div>
        ) : (
          <div className="absolute inset-0">
            <VideoPlayer
              muxPlaybackId="ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A"
              poster="/assets/blaze/weddings/DSCF2395.jpg"
              autoPlay
              loop
              muted
              mode="hero"
              className="opacity-60 scale-105"
            />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--bg) 60%, transparent), transparent, var(--bg))' }} />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-serif mb-6 uppercase tracking-tighter leading-none reveal-up">
            Bringing Your <br />
            <span className="italic">Story to Life</span>
          </h1>
          <p className="text-xs md:text-sm font-medium mb-10 reveal-up" style={{ color: 'var(--text-mute)' }}>
            Cinematic storytelling and visual precision for those who feel deeply.
          </p>
          <button className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all reveal-up backdrop-blur-sm">
            Discover Blaze
          </button>
        </div>
      </section>

      {/* Manifesto + Logo Card */}
      <section className="py-16 md:py-40 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-24 items-center">
        <div className="space-y-10 reveal-up">
          <h2 className="text-3xl md:text-6xl font-serif leading-tight italic">
            Where Emotion <br />
            <span className="not-italic">Meets Craft</span>
          </h2>
          <div className="space-y-5 text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
            <p>
              Blaze Production is a full-service creative studio specialising in cinematic wedding films, editorial content and
              branded storytelling. With over 50 productions across 12 cities, we bring a director&apos;s eye and an editor&apos;s
              precision to every frame.
            </p>
            <p>
              Trusted by <span className="font-medium" style={{ color: 'var(--text)' }}>MIPIM Cannes</span>, <span className="font-medium" style={{ color: 'var(--text)' }}>Brunch Festival</span>, <span className="font-medium" style={{ color: 'var(--text)' }}>Transdev</span>, <span className="font-medium" style={{ color: 'var(--text)' }}>France Tourisme</span>, and renowned international artists, we bring
              your story to life with timeless visual impact.
            </p>
          </div>
        </div>

        <div className="reveal-up">
          <div className="aspect-[4/3] rounded-[2.5rem] bg-neutral-900 border border-white/5 shadow-2xl relative overflow-hidden group">
            <Image
              src="/assets/blaze/IMG_6050.JPG"
              alt="Blaze Production — behind the scenes"
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/80 flex items-center justify-center font-serif text-lg italic">B</div>
                <div className="h-[1px] w-8 bg-white/40" />
              </div>
              <p className="text-xl font-serif tracking-[0.2em] uppercase">Blaze</p>
              <p className="text-[10px] font-light mt-1" style={{ color: 'var(--text-dim)' }}>Production</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blaze Showcase */}
      <section className="py-16 md:py-40 border-y" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12 md:mb-24 reveal-up">
            <h2 className="text-4xl md:text-6xl font-serif italic mb-4">Blaze Showcase</h2>
            <p className="text-xs font-medium" style={{ color: 'var(--text-mute)' }}>Light, movement, and emotion captured through crafted moments.</p>
          </div>
          <div className="reveal-up max-w-4xl mx-auto">
            <div className="group relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[16/9] mb-12">
              <Image src="/assets/blaze/IMG_6050.JPG" alt="Blaze Showcase" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" className="object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-12 text-center">
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-mute)' }}>Featured Project</p>
                <h3 className="text-xl md:text-2xl font-serif italic uppercase tracking-tighter">STOUH BEIRUT Rooftop</h3>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-light" style={{ color: 'var(--text-mute)' }}>Golden-hour diplomacy on the Parisian skyline</p>
              <p className="text-sm font-serif">Paris, France</p>
              <Link href={`/blaze/${firstSlugForCategory(projects, 'Event') || 'stouh-beirut'}`} className="mt-8 inline-block px-10 py-3 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all">
                View Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Carousels */}
      <section className="py-16 md:py-40 space-y-20 md:space-y-40">
        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h3 className="text-3xl font-serif mb-2 italic">STOUH BEIRUT Rooftop</h3>
            <p className="text-xs font-light" style={{ color: 'var(--text-mute)' }}>Golden-hour diplomacy and Parisian skyline energy.</p>
          </div>
          <OrbitCarousel items={eventItems} autoplayInterval={5200} />
          <div className="mt-12 md:mt-28 mb-8 text-center">
            <Link href={`/blaze/${firstSlugForCategory(projects, 'Event') || 'stouh-beirut'}`} className="px-10 py-3 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all">
              View Project
            </Link>
          </div>
        </div>

        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h3 className="text-3xl font-serif mb-2 italic">Embassy of Lebanon &middot; Paris</h3>
            <p className="text-xs font-light" style={{ color: 'var(--text-mute)' }}>Diplomatic ceremonies captured with cinematic restraint.</p>
          </div>
          <OrbitCarousel items={diplomaticItems} autoplayInterval={5600} />
          <div className="mt-12 md:mt-28 mb-8 text-center">
            <Link href={`/blaze/${firstSlugForCategory(projects, 'Diplomatic') || 'embassy-of-lebanon'}`} className="px-10 py-3 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all">
              View Project
            </Link>
          </div>
        </div>

        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h3 className="text-3xl font-serif mb-2 italic">Weddings</h3>
            <p className="text-xs font-light" style={{ color: 'var(--text-mute)' }}>Stories of connection and timeless elegance.</p>
          </div>
          <OrbitCarousel items={weddingItems} autoplayInterval={5200} />
          <div className="mt-12 md:mt-28 mb-8 text-center">
            <Link href={`/blaze/${firstSlugForCategory(projects, 'Wedding') || 'weddings'}`} className="px-10 py-3 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all">
              View Project
            </Link>
          </div>
        </div>

        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h3 className="text-3xl font-serif mb-2 italic">Editorial &amp; Brand</h3>
            <p className="text-xs font-light" style={{ color: 'var(--text-mute)' }}>The language of identity told through crafted imagery.</p>
          </div>
          <OrbitCarousel items={editorialItems} autoplayInterval={5400} />
          <div className="mt-12 md:mt-28 mb-8 text-center">
            <Link href={`/blaze/${firstSlugForCategory(projects, 'Editorial') || 'editorial-brand'}`} className="px-10 py-3 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all">
              View Project
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel
        testimonials={testimonials}
        heading="Client Stories"
        subheading="From couples to brands — hear from the people behind the projects."
      />

      {/* Budget Estimator */}
      <BudgetEstimator brand="blaze" />

      {/* Final CTA */}
      <section className="py-16 md:py-40 text-center border-t" style={{ background: 'linear-gradient(to bottom, var(--bg), var(--bg-card))', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 reveal-up">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-10 italic leading-tight">Your Story Deserves a Cinematic Soul</h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Let&apos;s create films that feel alive ~ crafted with depth and precision.
          </p>
          <Link href="/contact" className="px-14 py-4 border border-white/30 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
