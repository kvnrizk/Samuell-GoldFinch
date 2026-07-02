'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface MediaItem {
  url?: string;
}

interface GalleryRow {
  image?: MediaItem;
}

interface VideoItem {
  title?: string;
  videoSource?: 'mux' | 'cloudinary';
  muxPlaybackId?: string;
  cloudinaryVideoId?: string;
  loopEnd?: number;
}

interface ArtistRef {
  name?: string;
  slug?: string;
  photo?: MediaItem;
  genres?: string[];
}

interface KolasiEvent {
  title: string;
  slug: string;
  eventType?: string;
  venue?: string;
  date?: string;
  description?: any;
  gallery?: GalleryRow[];
  videos?: VideoItem[];
  artists?: ArtistRef[];
}

interface AdjacentEvent {
  title: string;
  slug: string;
}

interface KolasiEventDetailProps {
  event: KolasiEvent;
  prevEvent?: AdjacentEvent;
  nextEvent?: AdjacentEvent;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return null;
  }
}

function eventTypeLabel(type?: string) {
  const labels: Record<string, string> = {
    club: 'Club Night',
    festival: 'Festival',
    private: 'Private Event',
    corporate: 'Corporate',
    rooftop: 'Rooftop',
  };
  return labels[type || ''] || type || 'Event';
}

function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;
  const root = content?.root?.children;
  if (!root || !Array.isArray(root)) {
    if (typeof content === 'string') {
      return <p className="text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>{content}</p>;
    }
    return null;
  }
  return (
    <div className="space-y-4">
      {root.map((node: any, i: number) => {
        if (node.type === 'paragraph') {
          const text = node.children?.map((c: any) => c.text || '').join('') || '';
          if (!text.trim()) return null;
          return (
            <p key={i} className="text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
              {text}
            </p>
          );
        }
        if (node.type === 'heading') {
          const text = node.children?.map((c: any) => c.text || '').join('') || '';
          return (
            <h3 key={i} className="text-xl md:text-2xl font-serif mt-8 mb-4">
              {text}
            </h3>
          );
        }
        return null;
      })}
    </div>
  );
}

function ShareBar({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/kolasi/${slug}`
    : `/kolasi/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={copyLink}
        className="px-4 py-2 rounded-full border text-xs font-medium transition-all hover:bg-white/5"
        style={{ borderColor: 'var(--border-hi)', color: copied ? '#c8a96e' : 'var(--text-dim)' }}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full border text-xs font-medium transition-all hover:bg-white/5"
        style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
      >
        Share on WhatsApp
      </a>
    </div>
  );
}

export default function KolasiEventDetail({
  event,
  prevEvent,
  nextEvent,
}: KolasiEventDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const galleryImages = (event.gallery || [])
    .map((row) => row.image)
    .filter((img): img is MediaItem => Boolean(img?.url));

  const heroImage = galleryImages[0];
  const heroVideo = event.videos?.[0];
  const formattedDate = formatDate(event.date);
  const hasArtists = event.artists && event.artists.length > 0;

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.event-reveal').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40,
        opacity: 0,
        duration: 1,
        delay: i * 0.05,
        ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--bg)' }}>
      {/* ── Hero ── */}
      <section className="relative h-[70vh] md:h-screen w-full overflow-hidden">
        {(heroVideo?.muxPlaybackId || heroVideo?.cloudinaryVideoId) ? (
          <div className="absolute inset-0">
            <VideoPlayer
              muxPlaybackId={heroVideo.videoSource !== 'cloudinary' ? heroVideo.muxPlaybackId : undefined}
              cloudinaryVideoId={heroVideo.videoSource === 'cloudinary' ? heroVideo.cloudinaryVideoId : undefined}
              autoPlay
              loop
              muted
              mode="hero"
              className="opacity-70 scale-105"
            />
          </div>
        ) : heroImage?.url ? (
          <div className="absolute inset-0">
            <Image
              src={heroImage.url}
              alt={event.title}
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="100vw"
              className="object-cover opacity-70 scale-105"
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-card)' }} />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--bg) 40%, transparent), transparent 40%, color-mix(in srgb, var(--bg) 80%, transparent) 80%, var(--bg))',
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 max-w-7xl mx-auto">
          <div className="event-reveal">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] mb-6 border"
              style={{
                borderColor: 'color-mix(in srgb, #c8a96e 40%, transparent)',
                color: '#c8a96e',
                backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {eventTypeLabel(event.eventType)}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif leading-[0.95] tracking-tight mb-6 event-reveal">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-light event-reveal" style={{ color: 'var(--text-dim)' }}>
            {event.venue && <span>{event.venue}</span>}
            {event.venue && formattedDate && (
              <span style={{ color: 'var(--text-mute)' }}>&middot;</span>
            )}
            {formattedDate && <span>{formattedDate}</span>}
          </div>
        </div>
      </section>

      {/* ── Description + Share ── */}
      {event.description && (
        <section className="py-24 md:py-32 max-w-3xl mx-auto px-6">
          <div className="event-reveal">
            <RichTextRenderer content={event.description} />
          </div>
          <div className="mt-10 event-reveal">
            <ShareBar title={event.title} slug={event.slug} />
          </div>
        </section>
      )}

      {/* ── Artist Lineup ── */}
      {hasArtists && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif mb-12 event-reveal">Lineup</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {event.artists!.map((artist, i) => {
                const inner = (
                  <>
                    {artist.photo?.url ? (
                      <Image
                        src={artist.photo.url}
                        alt={artist.name || 'Artist'}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <span className="text-3xl font-serif" style={{ color: 'var(--text-mute)' }}>
                          {artist.name?.[0] || '?'}
                        </span>
                      </div>
                    )}
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-5"
                      style={{ background: 'linear-gradient(to top, var(--bg) 5%, color-mix(in srgb, var(--bg) 60%, transparent) 40%, transparent)' }}
                    >
                      <p className="text-sm font-serif" style={{ color: 'var(--text)' }}>{artist.name}</p>
                      {artist.genres && artist.genres.length > 0 && (
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-mute)' }}>
                          {artist.genres.slice(0, 2).join(' · ')}
                        </p>
                      )}
                    </div>
                  </>
                );

                return artist.slug ? (
                  <Link
                    key={i}
                    href={`/kolasi/artists/${artist.slug}`}
                    className="event-reveal group rounded-2xl overflow-hidden border relative aspect-[3/4] block"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div
                    key={i}
                    className="event-reveal group rounded-2xl overflow-hidden border relative aspect-[3/4]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {galleryImages.length > 0 && (
        <section className="pb-24 md:pb-40 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif mb-12 event-reveal">Gallery</h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="event-reveal break-inside-avoid rounded-2xl overflow-hidden border group"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Image
                    src={img.url!}
                    alt={`${event.title} — ${i + 1}`}
                    width={800}
                    height={600}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Prev / Next Navigation ── */}
      <section className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2">
          {prevEvent ? (
            <Link
              href={`/kolasi/${prevEvent.slug}`}
              className="group py-12 md:py-20 px-6 md:px-12 border-r transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] block mb-3" style={{ color: 'var(--text-mute)' }}>
                Previous Event
              </span>
              <span className="text-lg md:text-2xl font-serif group-hover:translate-x-[-4px] transition-transform duration-300 block">
                {prevEvent.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextEvent ? (
            <Link
              href={`/kolasi/${nextEvent.slug}`}
              className="group py-12 md:py-20 px-6 md:px-12 text-right transition-colors hover:bg-[var(--bg-hover)]"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] block mb-3" style={{ color: 'var(--text-mute)' }}>
                Next Event
              </span>
              <span className="text-lg md:text-2xl font-serif group-hover:translate-x-[4px] transition-transform duration-300 block">
                {nextEvent.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-32 md:py-40 text-center border-t"
        style={{
          background: 'linear-gradient(to bottom, var(--bg), var(--bg-card))',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 event-reveal">
          <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
            Want Kolasi at Your Venue?
          </h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            We bring the lineup, the production, and the crowd. Tell us about your space.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="/kolasi"
              className="px-12 py-4 text-sm font-light transition-colors"
              style={{ color: 'var(--text-dim)' }}
            >
              Back to Kolasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
