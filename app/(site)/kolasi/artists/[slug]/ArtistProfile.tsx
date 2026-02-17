'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import { useAudioPlayer } from '@/components/providers/AudioPlayerProvider';

interface MediaItem {
  url?: string;
}

interface GenreRow {
  genre?: string;
}

interface MixItem {
  title?: string;
  url?: string;
  platform?: string;
  duration?: string;
}

interface SocialLinks {
  instagram?: string;
  soundcloud?: string;
  spotify?: string;
}

interface ArtistData {
  name: string;
  slug: string;
  bio?: string;
  photo?: MediaItem;
  genres?: GenreRow[];
  rosterCategory?: string;
  socialLinks?: SocialLinks;
  mixes?: MixItem[];
  featured?: boolean;
}

interface EventRef {
  title: string;
  slug: string;
  date?: string;
  venue?: string;
}

interface AdjacentArtist {
  name: string;
  slug: string;
}

interface ArtistProfileProps {
  artist: ArtistData;
  events: EventRef[];
  prevArtist?: AdjacentArtist;
  nextArtist?: AdjacentArtist;
}

function categoryLabel(cat?: string) {
  const labels: Record<string, string> = {
    resident: 'Resident',
    headliner: 'Headliner',
    'live-act': 'Live Act',
    hybrid: 'Hybrid',
  };
  return labels[cat || ''] || cat || 'Artist';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return null;
  }
}

function platformIcon(platform?: string) {
  switch (platform) {
    case 'soundcloud':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 18V12h2v6H1zm3-1V11h2v6H4zm3 1V8h2v10H7zm3-2V6h2v10h-2zm3 2V4h2v14h-2zm3-1V7h2v9h-2zm3 1V3h2v14h-2z" />
        </svg>
      );
    case 'mixcloud':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 16V8h2l3 4 3-4h2v8h-2v-5l-3 4-3-4v5H2zm13-2v-4h6a2 2 0 010 4h-6z" />
        </svg>
      );
    case 'spotify':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
      );
  }
}

/* Social link icons */
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function SoundCloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 18V12h2v6H1zm3-1V11h2v6H4zm3 1V8h2v10H7zm3-2V6h2v10h-2zm3 2V4h2v14h-2zm3-1V7h2v9h-2zm3 1V3h2v14h-2z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function ArtistProfile({
  artist,
  events,
  prevArtist,
  nextArtist,
}: ArtistProfileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { play, currentTrack, isPlaying, toggle } = useAudioPlayer();

  const genres = (artist.genres || []).map((g) => g.genre || g).filter(Boolean) as string[];
  const hasSocials = artist.socialLinks?.instagram || artist.socialLinks?.soundcloud || artist.socialLinks?.spotify;
  const hasMixes = artist.mixes && artist.mixes.length > 0;
  const hasEvents = events && events.length > 0;

  const copyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/kolasi/artists/${artist.slug}`
      : `/kolasi/artists/${artist.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.artist-reveal').forEach((el, i) => {
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
      <section className="relative min-h-[80vh] md:min-h-screen w-full overflow-hidden">
        {artist.photo?.url ? (
          <div className="absolute inset-0">
            <Image
              src={artist.photo.url}
              alt={artist.name}
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="100vw"
              className="object-cover opacity-60 scale-105"
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-card)' }} />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--bg) 30%, transparent), transparent 30%, color-mix(in srgb, var(--bg) 70%, transparent) 70%, var(--bg))',
          }}
        />

        <div className="relative z-10 h-full min-h-[80vh] md:min-h-screen flex flex-col justify-end pb-16 md:pb-24 px-6 max-w-7xl mx-auto">
          <div className="artist-reveal">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] mb-6 border"
              style={{
                borderColor: 'color-mix(in srgb, #c8a96e 40%, transparent)',
                color: '#c8a96e',
                backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {categoryLabel(artist.rosterCategory)}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic leading-[0.95] tracking-tight mb-6 artist-reveal">
            {artist.name}
          </h1>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 artist-reveal">
              {genres.map((g) => (
                <span
                  key={g}
                  className="px-4 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-[0.1em] border"
                  style={{
                    borderColor: 'var(--border-hi)',
                    color: 'var(--text-dim)',
                    backgroundColor: 'color-mix(in srgb, var(--bg) 50%, transparent)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Social links */}
          {hasSocials && (
            <div className="flex items-center gap-4 artist-reveal">
              {artist.socialLinks?.instagram && (
                <a
                  href={artist.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {artist.socialLinks?.soundcloud && (
                <a
                  href={artist.socialLinks.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                  aria-label="SoundCloud"
                >
                  <SoundCloudIcon />
                </a>
              )}
              {artist.socialLinks?.spotify && (
                <a
                  href={artist.socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                  aria-label="Spotify"
                >
                  <SpotifyIcon />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Bio ── */}
      {artist.bio && (
        <section className="py-24 md:py-32 max-w-3xl mx-auto px-6">
          <div className="artist-reveal">
            <h2 className="text-2xl md:text-3xl font-serif italic mb-8">About</h2>
            <p className="text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
              {artist.bio}
            </p>
          </div>
          <div className="mt-10 artist-reveal">
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-full border text-xs font-medium transition-all hover:bg-white/5"
              style={{ borderColor: 'var(--border-hi)', color: copied ? '#c8a96e' : 'var(--text-dim)' }}
            >
              {copied ? 'Copied!' : 'Share Profile'}
            </button>
          </div>
        </section>
      )}

      {/* ── Mixes / Sets ── */}
      {hasMixes && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif italic mb-12 artist-reveal">Mixes &amp; Sets</h2>
            <div className="space-y-4">
              {artist.mixes!.map((mix, i) => {
                const isCurrentMix = currentTrack?.url === mix.url;
                return (
                  <div
                    key={i}
                    className="artist-reveal group flex items-center gap-5 p-5 rounded-2xl border transition-all hover:bg-white/[0.03]"
                    style={{ borderColor: isCurrentMix ? 'color-mix(in srgb, #c8a96e 40%, transparent)' : 'var(--border)' }}
                  >
                    {/* Play button */}
                    <button
                      onClick={() => {
                        if (isCurrentMix && isPlaying) {
                          toggle();
                        } else {
                          play({
                            title: mix.title || 'Untitled Mix',
                            artist: artist.name,
                            url: mix.url || '',
                            platform: mix.platform,
                          });
                        }
                      }}
                      className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors hover:border-[#c8a96e] hover:text-[#c8a96e]"
                      style={{
                        borderColor: isCurrentMix ? '#c8a96e' : 'var(--border-hi)',
                        color: isCurrentMix ? '#c8a96e' : 'var(--text-dim)',
                      }}
                      aria-label={isCurrentMix && isPlaying ? 'Pause' : 'Play'}
                    >
                      {isCurrentMix && isPlaying ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="8 5 19 12 8 19" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: isCurrentMix ? '#c8a96e' : 'var(--text)' }}>
                        {mix.title}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-mute)' }}>
                        {mix.platform && <span className="capitalize">{mix.platform}</span>}
                        {mix.platform && mix.duration && <span> &middot; </span>}
                        {mix.duration && <span>{mix.duration}</span>}
                      </p>
                    </div>

                    {/* Platform icon / external link */}
                    <a
                      href={mix.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 rounded-full transition-colors hover:text-[#c8a96e]"
                      style={{ color: 'var(--text-mute)' }}
                      aria-label={`Open on ${mix.platform || 'source'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {platformIcon(mix.platform)}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Event History ── */}
      {hasEvents && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif italic mb-12 artist-reveal">Past Events</h2>
            <div className="space-y-3">
              {events.map((evt, i) => (
                <Link
                  key={i}
                  href={`/kolasi/${evt.slug}`}
                  className="artist-reveal group flex items-center justify-between p-5 rounded-2xl border transition-all hover:bg-white/[0.03]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div>
                    <p className="text-sm font-serif group-hover:text-[#c8a96e] transition-colors" style={{ color: 'var(--text)' }}>
                      {evt.title}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-mute)' }}>
                      {evt.venue && <span>{evt.venue}</span>}
                      {evt.venue && evt.date && <span> &middot; </span>}
                      {evt.date && <span>{formatDate(evt.date)}</span>}
                    </p>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="flex-shrink-0 group-hover:translate-x-1 transition-transform"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Prev / Next Navigation ── */}
      <section className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2">
          {prevArtist ? (
            <Link
              href={`/kolasi/artists/${prevArtist.slug}`}
              className="group py-12 md:py-20 px-6 md:px-12 border-r transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] block mb-3" style={{ color: 'var(--text-mute)' }}>
                Previous Artist
              </span>
              <span className="text-lg md:text-2xl font-serif italic group-hover:translate-x-[-4px] transition-transform duration-300 block">
                {prevArtist.name}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextArtist ? (
            <Link
              href={`/kolasi/artists/${nextArtist.slug}`}
              className="group py-12 md:py-20 px-6 md:px-12 text-right transition-colors hover:bg-[var(--bg-hover)]"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] block mb-3" style={{ color: 'var(--text-mute)' }}>
                Next Artist
              </span>
              <span className="text-lg md:text-2xl font-serif italic group-hover:translate-x-[4px] transition-transform duration-300 block">
                {nextArtist.name}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      {/* ── Booking CTA ── */}
      <section
        className="py-32 md:py-40 text-center border-t"
        style={{
          background: 'linear-gradient(to bottom, var(--bg), var(--bg-card))',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 artist-reveal">
          <h2 className="text-4xl md:text-6xl font-serif italic leading-tight mb-6">
            Book {artist.name}
          </h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Interested in booking {artist.name} for your event? Get in touch with the Kolasi team.
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
