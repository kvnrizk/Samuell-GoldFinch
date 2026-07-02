'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import OrbitCarousel from '@/components/ui/OrbitCarousel';
import VideoPlayer from '@/components/ui/VideoPlayer';

// Static fallbacks
const stouhBeirut = [
  { url: '/assets/blaze/stouh_beirut/2E2A0578.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/2E2A1101.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/2E2A1243.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/2E2A1637.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/2E2A1724.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/2E2A2072.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/4F8A9363.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/4F8A9365.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/IMG_6348.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/IMG_6350.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  { url: '/assets/blaze/stouh_beirut/IMG_6351.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
];

const weddingsStatic = [
  { url: '/assets/blaze/weddings/images/0G0A7343.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/0G0A7376(1).jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/0G0A7733.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/0G0A7774(1).jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/0G0A7811.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/0G0A7820.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/0G0A7828.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/0G0A7833.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/9V5A4101.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/9V5A8531.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/9V5A9337.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/9V5A9365.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/DSCF2395.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_0025.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_0068.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_0079.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_0084.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_0100.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_0158.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_0206.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_5025.JPG', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_6049.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_6051.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_6052.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_6054.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_6055.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_9986.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/IMG_9991.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/pexels-amar-10288372.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/pexels-angel-ayala-321556-28976231.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/pexels-cuneyt-efe-bural-1257409288-23940968.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/pexels-fabrice-busching-1777473881-30235864.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/pexels-leeloothefirst-5038645.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/pexels-mastercowley-1128782.jpg', title: 'Weddings', category: 'Cinematic' },
  { url: '/assets/blaze/weddings/images/pexels-valentina-maros-128709290-13283497.jpg', title: 'Weddings', category: 'Cinematic' },
];

const editorialStatic = [
  { url: '/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.JPG', title: 'Creative Direction', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-amar-10288372.jpg', title: 'Creative Direction', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-angel-ayala-321556-28976231.jpg', title: 'Creative Direction', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-fabrice-busching-1777473881-30235864.jpg', title: 'Creative Direction', category: 'Editorial' },
  { url: '/assets/blaze/editorial_and_brand/pexels-valentina-maros-128709290-13283497.jpg', title: 'Creative Direction', category: 'Editorial' },
];

// Real Embassy of Lebanon event assets (public/assets/blaze/ambassy).
const embassyStatic = [
  { url: '/assets/blaze/ambassy/0C5A9134.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9139.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9189.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9194.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9196.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9203.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9206.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9210.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9214.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/0C5A9228.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/4F8A9963.jpg', title: 'Embassy of Lebanon', category: 'Event' },
  { url: '/assets/blaze/ambassy/4F8A9974.jpg', title: 'Embassy of Lebanon', category: 'Event' },
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
}

function firstSlugForCategory(projects: BlazeProject[], category: string): string | null {
  const match = projects.find((p) => p.category === category && p.slug);
  return match?.slug || null;
}

export default function BlazeClient({ projects }: BlazeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // This selected-work module is curated until the final CMS media pass.
  const weddingItems = weddingsStatic;
  const editorialItems = editorialStatic;
  const eventItems = stouhBeirut;
  const embassyItems = embassyStatic;
  const selectedWork = [
    {
      id: 'embassy',
      label: 'Embassy of Lebanon',
      title: 'Embassy of Lebanon',
      category: 'Institutional Event',
      description: 'Institutional event coverage in Paris.',
      items: embassyItems,
      autoplayInterval: 5200,
    },
    {
      id: 'stouh',
      label: 'STOUH BEIRUT',
      title: 'STOUH BEIRUT Rooftop',
      category: 'Event',
      description: 'Golden-hour diplomacy and Parisian skyline energy.',
      items: eventItems,
      autoplayInterval: 5200,
    },
    {
      id: 'weddings',
      label: 'Weddings',
      title: 'Weddings',
      category: 'Cinematic',
      description: 'Stories of connection and timeless elegance.',
      items: weddingItems,
      autoplayInterval: 5200,
    },
    {
      id: 'editorial',
      label: 'Creative Direction',
      title: 'Creative Direction',
      category: 'Editorial',
      description: 'The language of identity told through crafted imagery.',
      items: editorialItems,
      autoplayInterval: 5400,
    },
  ];
  const [selectedWorkId, setSelectedWorkId] = useState(selectedWork[0].id);
  const activeWork = selectedWork.find((item) => item.id === selectedWorkId) || selectedWork[0];

  // Hero video: from first project with heroVideo or fallback
  const heroProject = projects.find((p) => p.heroVideo?.muxPlaybackId || p.heroVideo?.cloudinaryVideoId);

  useEffect(() => {
    const requestedWork = new URLSearchParams(window.location.search).get('work');
    if (requestedWork && ['embassy', 'stouh', 'weddings', 'editorial'].includes(requestedWork)) {
      setSelectedWorkId(requestedWork);
    }
  }, []);

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
    <div ref={containerRef} style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Full Screen Hero Video */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--media-scrim)' }}>
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
              poster="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364170/sg-platform/static/assets/blaze/weddings/DSCF2395.jpg"
              autoPlay
              loop
              muted
              mode="hero"
              className="opacity-60 scale-105"
            />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--media-scrim) 60%, transparent), transparent, var(--surface-page))' }} />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 uppercase tracking-tighter leading-none reveal-up text-on-media">
            Bringing Your <br />
            <span className="italic">Story to Life</span>
          </h1>
          <p className="text-xs md:text-sm font-medium mb-10 reveal-up text-on-media-dim">
            Cinematic storytelling and visual precision for those who feel deeply.
          </p>
          <button className="px-12 py-4 border rounded-full text-sm font-semibold transition-all reveal-up backdrop-blur-sm sg-action-secondary">
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
          <div className="space-y-5 text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Blaze Production is a full-service creative studio specialising in cinematic wedding films, editorial content and
              branded storytelling. With over 50 productions across 12 cities, we bring a director&apos;s eye and an editor&apos;s
              precision to every frame.
            </p>
            <p>
              Trusted by <span className="font-medium" style={{ color: 'var(--text-primary)' }}>MIPIM Cannes</span>, <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Brunch Festival</span>, <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Transdev</span>, <span className="font-medium" style={{ color: 'var(--text-primary)' }}>France Tourisme</span>, and renowned international artists, we bring
              your story to life with timeless visual impact.
            </p>
          </div>
        </div>

        <div className="reveal-up">
          <div className="aspect-[4/3] rounded-[2.5rem] border relative overflow-hidden group sg-media-frame">
            <Image
              src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363947/sg-platform/static/assets/blaze/IMG_6050.jpg"
              alt="Blaze Production — behind the scenes"
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--media-scrim) 85%, transparent), transparent)' }} />
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/80 flex items-center justify-center font-serif text-lg italic text-on-media">B</div>
                <div className="h-[1px] w-8 bg-white/40" />
              </div>
              <p className="text-xl font-serif tracking-[0.2em] uppercase text-on-media">Blaze</p>
              <p className="text-[10px] font-light mt-1 text-on-media-dim">Production</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blaze Showcase */}
      <section className="py-16 md:py-40 border-y" style={{ backgroundColor: 'var(--surface-page)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12 md:mb-24 reveal-up">
            <h2 className="text-4xl md:text-6xl font-serif italic mb-4">Blaze Showcase</h2>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Light, movement, and emotion captured through crafted moments.</p>
          </div>
          <div className="reveal-up max-w-4xl mx-auto">
            <div className="group relative rounded-[2rem] overflow-hidden border aspect-[16/9] mb-12 sg-media-frame">
              <Image src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363947/sg-platform/static/assets/blaze/IMG_6050.jpg" alt="Blaze Showcase" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" className="object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-center" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--media-scrim) 85%, transparent), transparent)' }}>
                <p className="text-xs font-medium mb-2 text-on-media-dim">Featured Project</p>
                <h3 className="text-xl md:text-2xl font-serif italic uppercase tracking-tighter text-on-media">STOUH BEIRUT Rooftop</h3>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>Golden-hour diplomacy on the Parisian skyline</p>
              <p className="text-sm font-serif">Paris, France</p>
              <Link href={`/blaze/${firstSlugForCategory(projects, 'Event') || 'stouh-beirut'}`} className="mt-8 inline-block px-10 py-3 border rounded-full text-sm font-semibold transition-all sg-action-secondary">
                View Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section id="selected-work" className="py-16 md:py-40 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 reveal-up">
          <div className="mb-10 md:mb-16 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] mb-4" style={{ color: 'var(--text-muted)' }}>Selected Work</p>
            <h2 className="text-3xl md:text-5xl font-serif italic mb-5">Choose a project</h2>
            <p className="max-w-xl mx-auto text-sm font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Select a project below. The full image set appears here in the same cinematic carousel.
            </p>
          </div>

          <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {selectedWork.map((work) => {
              const isSelected = work.id === activeWork.id;
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => setSelectedWorkId(work.id)}
                  className="rounded-2xl border px-4 py-5 text-left transition-all duration-300 sg-hover-surface"
                  style={{
                    borderColor: isSelected ? 'var(--border-accent)' : 'var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--brand-gold-soft)' : 'var(--surface-card-soft)',
                  }}
                  aria-pressed={isSelected}
                >
                  <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>
                    {work.category}
                  </span>
                  <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{work.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-muted)' }}>{activeWork.category}</p>
            <h3 className="text-3xl font-serif mb-3 italic">{activeWork.title}</h3>
            <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>{activeWork.description}</p>
          </div>
        </div>

        <div className="reveal-up">
          <OrbitCarousel
            key={activeWork.id}
            items={activeWork.items}
            autoplayInterval={activeWork.autoplayInterval}
            disableLightbox
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-40 text-center border-t" style={{ background: 'linear-gradient(to bottom, var(--surface-page), var(--surface-card))', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-3xl mx-auto px-6 reveal-up">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-10 italic leading-tight">Your Story Deserves a Cinematic Soul</h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Let&apos;s create films that feel alive ~ crafted with depth and precision.
          </p>
          <Link href="/contact" className="px-14 py-4 border rounded-full text-sm font-semibold transition-all sg-action-secondary">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
