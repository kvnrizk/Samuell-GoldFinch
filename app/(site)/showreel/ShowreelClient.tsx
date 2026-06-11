'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import VideoPlayer from '@/components/ui/VideoPlayer';

registerGSAP();

interface Highlight {
  title: string;
  videoSource?: 'mux' | 'cloudinary';
  muxPlaybackId?: string;
  cloudinaryVideoId?: string;
  posterUrl?: string;
  category?: string;
  slug?: string | null;
  linkedProject?: { slug: string } | string | null;
}

interface ShowreelClientProps {
  heroReel: {
    videoSource?: 'mux' | 'cloudinary';
    muxPlaybackId?: string;
    cloudinaryVideoId?: string;
    posterUrl?: string;
    title?: string;
  };
  highlights: Highlight[];
}

const categoryColors: Record<string, string> = {
  wedding: '#c8a96e',
  editorial: '#e5e5e5',
  event: '#a78bfa',
  music: '#a78bfa',
  brand: '#60a5fa',
};

export default function ShowreelClient({ heroReel, highlights }: ShowreelClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(highlights.map(h => h.category).filter((c): c is string => Boolean(c))))];

  const filtered = activeFilter === 'all'
    ? highlights
    : highlights.filter(h => h.category === activeFilter);

  function getVideoKey(h: Highlight): string {
    return h.cloudinaryVideoId || h.muxPlaybackId || h.title;
  }

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.reel-reveal', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
      gsap.utils.toArray<HTMLElement>('.highlight-card').forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, { scope: containerRef, dependencies: [activeFilter] });

  function getProjectLink(h: Highlight): string | null {
    if (h.linkedProject && typeof h.linkedProject === 'object' && h.linkedProject.slug) {
      return `/blaze/${h.linkedProject.slug}`;
    }
    if (h.slug) return `/blaze/${h.slug}`;
    return null;
  }

  return (
    <div ref={containerRef} className="pt-20" style={{ backgroundColor: 'var(--bg)' }}>
      {/* ── Hero Reel ── */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <VideoPlayer
            muxPlaybackId={heroReel.videoSource !== 'cloudinary' ? heroReel.muxPlaybackId : undefined}
            cloudinaryVideoId={heroReel.videoSource === 'cloudinary' ? heroReel.cloudinaryVideoId : undefined}
            poster={heroReel.posterUrl}
            autoPlay
            loop
            muted
            mode="hero"
            className="opacity-70"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--bg) 40%, transparent), transparent 40%, color-mix(in srgb, var(--bg) 80%, transparent))' }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="reel-reveal text-xs font-medium tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--text-mute)' }}>
            Blaze Production &times; Kolasi Agency
          </p>
          <h1 className="reel-reveal text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-tighter leading-none mb-8">
            {heroReel.title || 'Showreel'}
          </h1>
          <p className="reel-reveal text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed mb-10" style={{ color: 'var(--text-dim)' }}>
            A curated selection of our finest cinematic work — weddings, events, editorial, and branded content from Paris to Beirut.
          </p>
          <div className="reel-reveal flex items-center justify-center gap-6">
            <a
              href="#highlights"
              className="px-10 py-4 border rounded-full text-sm font-semibold transition-all hover:bg-white hover:text-black backdrop-blur-sm"
              style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              View Highlights
            </a>
            <Link
              href="/quote"
              className="px-10 py-4 text-sm font-semibold rounded-full transition-all"
              style={{ backgroundColor: '#c8a96e', color: '#000' }}
            >
              Start a Project
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reel-reveal">
          <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-mute)' }}>Scroll</p>
          <div className="w-[1px] h-8" style={{ background: 'linear-gradient(to bottom, var(--text-mute), transparent)' }} />
        </div>
      </section>

      {/* ── Highlights Section ── */}
      <section id="highlights" className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] font-medium mb-4" style={{ color: '#c8a96e' }}>Selected Work</p>
          <h2 className="text-3xl md:text-5xl font-serif italic tracking-tight">Highlight Clips</h2>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="px-5 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all border"
              style={{
                backgroundColor: activeFilter === cat ? 'var(--text)' : 'transparent',
                color: activeFilter === cat ? 'var(--bg)' : 'var(--text-dim)',
                borderColor: activeFilter === cat ? 'var(--text)' : 'var(--border)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((h, i) => {
            const link = getProjectLink(h);
            const videoKey = getVideoKey(h);
            const isPlaying = playingId === videoKey;
            const isCloudinary = h.videoSource === 'cloudinary';
            const thumbnailSrc = h.posterUrl || (isCloudinary ? undefined : `https://image.mux.com/${h.muxPlaybackId}/thumbnail.jpg?time=2`);

            return (
              <div
                key={videoKey + i}
                className="highlight-card group relative rounded-2xl overflow-hidden border"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
              >
                {/* Video area */}
                <div className="aspect-video relative">
                  {isPlaying ? (
                    <VideoPlayer
                      muxPlaybackId={!isCloudinary ? h.muxPlaybackId : undefined}
                      cloudinaryVideoId={isCloudinary ? h.cloudinaryVideoId : undefined}
                      poster={thumbnailSrc}
                      autoPlay
                      loop={false}
                      muted={false}
                      mode="showcase"
                    />
                  ) : (
                    <>
                      {thumbnailSrc && (
                        <Image
                          src={thumbnailSrc}
                          alt={h.title}
                          fill
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                      <button
                        onClick={() => setPlayingId(videoKey)}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-label={`Play ${h.title}`}
                      >
                        <div
                          className="w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110"
                          style={{ borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(0,0,0,0.3)' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <polygon points="8 5 20 12 8 19" />
                          </svg>
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {/* Info bar */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{h.title}</h3>
                    {h.category && (
                      <span
                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                        style={{ color: categoryColors[h.category] || 'var(--text-mute)' }}
                      >
                        {h.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isPlaying && (
                      <button
                        onClick={() => setPlayingId(null)}
                        className="text-xs uppercase tracking-wider font-medium transition-colors"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        Close
                      </button>
                    )}
                    {link && (
                      <Link
                        href={link}
                        className="text-xs uppercase tracking-wider font-medium transition-colors hover:underline"
                        style={{ color: '#c8a96e' }}
                      >
                        View Project &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 md:py-32 text-center px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs uppercase tracking-[0.3em] font-medium mb-6" style={{ color: '#c8a96e' }}>
          Like What You See?
        </p>
        <h2 className="text-3xl md:text-5xl font-serif italic tracking-tight mb-8">
          Let&apos;s Create Together
        </h2>
        <p className="text-sm max-w-lg mx-auto mb-12 font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          Whether it&apos;s a cinematic wedding film, a brand campaign, or curating the perfect event — we&apos;d love to hear your vision.
        </p>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Link
            href="/quote"
            className="px-10 py-4 text-sm font-semibold rounded-full transition-all hover:opacity-90"
            style={{ backgroundColor: '#c8a96e', color: '#000' }}
          >
            Get a Quote
          </Link>
          <Link
            href="/contact"
            className="px-10 py-4 border rounded-full text-sm font-semibold transition-all hover:bg-white hover:text-black"
            style={{ borderColor: 'var(--border)' }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
