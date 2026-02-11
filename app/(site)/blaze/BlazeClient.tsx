'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import OrbitCarousel from '@/components/ui/OrbitCarousel';
import VideoPlayer from '@/components/ui/VideoPlayer';

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
  photo?: {
    url?: string;
  };
}

interface BlazeHeroVideo {
  muxPlaybackId?: string;
  posterUrl?: string;
}

interface BlazeProject {
  title: string;
  category: string;
  gallery?: BlazeGalleryItem[];
  heroVideo?: BlazeHeroVideo;
}

interface BlazeClientProps {
  projects: BlazeProject[];
}

function projectsToCarousel(projects: BlazeProject[], category: string) {
  const filtered = projects.filter((p) => p.category === category);
  if (filtered.length === 0) return null;
  return filtered.flatMap((p) =>
    (p.gallery || []).map((g) => ({
      url: g.photo?.url || '',
      title: p.title,
      category: p.category,
    })),
  ).filter((item) => item.url);
}

export default function BlazeClient({ projects }: BlazeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build carousels from CMS or fallback
  const hasCMS = projects.length > 0;
  const weddingItems = (hasCMS && projectsToCarousel(projects, 'Wedding')) || weddingsStatic;
  const editorialItems = (hasCMS && projectsToCarousel(projects, 'Editorial')) || editorialStatic;
  const eventItems = (hasCMS && projectsToCarousel(projects, 'Event')) || stouhBeirut;
  const diplomaticItems = (hasCMS && projectsToCarousel(projects, 'Diplomatic')) || embassy;

  // Hero video: from first project with heroVideo or fallback
  const heroProject = projects.find((p) => p.heroVideo?.muxPlaybackId);

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
    <div ref={containerRef} className="bg-[#0a0a0a]">
      {/* Full Screen Hero Video */}
      <section className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
        {heroProject?.heroVideo?.muxPlaybackId ? (
          <div className="absolute inset-0">
            <VideoPlayer
              muxPlaybackId={heroProject.heroVideo.muxPlaybackId}
              poster={heroProject.heroVideo.posterUrl}
              autoPlay
              loop
              muted
              mode="hero"
              className="opacity-60 scale-105"
            />
          </div>
        ) : (
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
            poster="/assets/blaze/weddings/DSCF2395.jpg"
            src="/assets/blaze/weddings/BLAZE_WEDDINGS_Demoreel.mp4"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-8xl font-serif mb-6 uppercase tracking-tighter leading-none reveal-up">
            Bringing Your <br />
            <span className="italic">Story to Life</span>
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/50 mb-10 reveal-up">
            Cinematic storytelling and visual precision for those who feel deeply.
          </p>
          <button className="px-12 py-4 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all reveal-up">
            Discover Blaze
          </button>
        </div>
      </section>

      {/* Manifesto + Logo Card */}
      <section className="py-40 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
        <div className="space-y-10 reveal-up">
          <h2 className="text-4xl md:text-6xl font-serif leading-tight italic">
            Bringing Your <br />
            <span className="not-italic">Story to Life</span>
          </h2>
          <div className="space-y-6 text-sm md:text-base text-white/50 leading-relaxed uppercase tracking-widest font-light">
            <p>
              Blaze Production is a full-service creative studio specialising in cinematic wedding films, editorial content and
              branded storytelling. With over 50 productions across 12 cities, we bring a director&apos;s eye and an editor&apos;s
              precision to every frame.
            </p>
            <p>
              Trusted by MIPIM Cannes, Brunch Festival, Transdev, France Tourisme, and renowned international artists, we bring
              your story to life with timeless visual impact.
            </p>
          </div>
        </div>

        <div className="reveal-up">
          <div className="aspect-[4/3] rounded-[2.5rem] bg-neutral-900 border border-white/5 shadow-2xl relative overflow-hidden group">
            <img
              src="/assets/blaze/IMG_6050.JPG"
              alt="Blaze Production — behind the scenes"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/80 flex items-center justify-center font-serif text-lg italic">B</div>
                <div className="h-[1px] w-8 bg-white/40" />
              </div>
              <p className="text-xl font-serif tracking-[0.2em] uppercase">Blaze</p>
              <p className="text-[9px] tracking-[0.3em] uppercase text-white/50 mt-1">Production</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blaze Showcase */}
      <section className="py-40 bg-[#070707] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-24 reveal-up">
            <h2 className="text-4xl md:text-6xl font-serif italic mb-4">Blaze Showcase</h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">Light, movement, and emotion captured through crafted moments.</p>
          </div>
          <div className="reveal-up max-w-4xl mx-auto">
            <div className="group relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[16/9] mb-12">
              <img src="/assets/blaze/IMG_6050.JPG" alt="Blaze Showcase" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12 text-center">
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-2">Featured Project</p>
                <h3 className="text-xl md:text-2xl font-serif italic uppercase tracking-tighter">STOUH BEIRUT Rooftop</h3>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30">Golden-hour diplomacy on the Parisian skyline</p>
              <p className="text-sm font-serif">Paris, France</p>
              <button className="mt-8 px-10 py-3 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">Coming Soon</button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Carousels */}
      <section className="py-40 space-y-40">
        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl font-serif mb-2 italic">STOUH BEIRUT Rooftop</h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">Golden-hour diplomacy and Parisian skyline energy.</p>
          </div>
          <OrbitCarousel items={eventItems} autoplayInterval={5200} />
          <div className="mt-28 mb-8 text-center">
            <button className="px-10 py-3 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">Coming Soon</button>
          </div>
        </div>

        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl font-serif mb-2 italic">Embassy of Lebanon &middot; Paris</h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">Diplomatic ceremonies captured with cinematic restraint.</p>
          </div>
          <OrbitCarousel items={diplomaticItems} autoplayInterval={5600} />
          <div className="mt-28 mb-8 text-center">
            <button className="px-10 py-3 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">Coming Soon</button>
          </div>
        </div>

        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl font-serif mb-2 italic">Weddings</h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">Stories of connection and timeless elegance.</p>
          </div>
          <OrbitCarousel items={weddingItems} autoplayInterval={5200} />
          <div className="mt-28 mb-8 text-center">
            <button className="px-10 py-3 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">Coming Soon</button>
          </div>
        </div>

        <div className="reveal-up">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl font-serif mb-2 italic">Editorial &amp; Brand</h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">The language of identity told through crafted imagery.</p>
          </div>
          <OrbitCarousel items={editorialItems} autoplayInterval={5400} />
          <div className="mt-28 mb-8 text-center">
            <button className="px-10 py-3 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">Coming Soon</button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 text-center bg-gradient-to-b from-black to-neutral-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 reveal-up">
          <h2 className="text-5xl md:text-7xl font-serif mb-10 italic leading-tight">Your Story Deserves a Cinematic Soul</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-12 max-w-lg mx-auto leading-relaxed">
            Let&apos;s create films that feel alive ~ crafted with depth and precision.
          </p>
          <Link href="/contact" className="px-14 py-4 border border-white/30 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
