'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';

interface LogoItem {
  brand?: string;
  file?: { url?: string; filename?: string };
  format?: string;
  variant?: string;
}

interface PhotoItem {
  image?: { url?: string; filename?: string };
  caption?: string;
  credit?: string;
}

interface AppearanceItem {
  title: string;
  publication: string;
  url?: string;
  date?: string;
  type?: string;
}

interface PressContact {
  name?: string;
  email?: string;
  phone?: string;
}

interface PressKitData {
  shortBio?: string;
  mediumBio?: string;
  fullBio?: any;
  logos?: LogoItem[];
  pressPhotos?: PhotoItem[];
  mediaAppearances?: AppearanceItem[];
  pressContact?: PressContact;
}

interface PressClientProps {
  pressKit: PressKitData;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(new Date(dateStr));
  } catch {
    return null;
  }
}

function typeLabel(type?: string) {
  const labels: Record<string, string> = {
    article: 'Article',
    interview: 'Interview',
    feature: 'Feature',
    podcast: 'Podcast',
    video: 'Video',
  };
  return labels[type || ''] || 'Press';
}

function brandLabel(brand?: string) {
  const labels: Record<string, string> = {
    sg: 'Samuell Goldfinch',
    blaze: 'Blaze',
    kolasi: 'Kolasi',
  };
  return labels[brand || ''] || brand || '';
}

export default function PressClient({ pressKit }: PressClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bioMode, setBioMode] = useState<'short' | 'medium' | 'full'>('medium');
  const [copied, setCopied] = useState(false);

  const hasLogos = pressKit.logos && pressKit.logos.length > 0;
  const hasPhotos = pressKit.pressPhotos && pressKit.pressPhotos.length > 0;
  const hasAppearances = pressKit.mediaAppearances && pressKit.mediaAppearances.length > 0;
  const hasContact = pressKit.pressContact?.email;

  const currentBio =
    bioMode === 'short' ? pressKit.shortBio
      : bioMode === 'full' ? (pressKit.mediumBio || pressKit.shortBio) // fullBio is richText, fall back to medium for now
      : pressKit.mediumBio;

  const copyBio = () => {
    if (!currentBio) return;
    navigator.clipboard.writeText(currentBio).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.press-reveal').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40,
        opacity: 0,
        duration: 1,
        delay: i * 0.04,
        ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--bg)' }}>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 md:pt-48 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="press-reveal inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] mb-8 border"
            style={{
              borderColor: 'color-mix(in srgb, #c8a96e 40%, transparent)',
              color: '#c8a96e',
            }}
          >
            Press Kit
          </span>
          <h1 className="press-reveal text-4xl md:text-6xl lg:text-7xl font-serif italic leading-[0.95] tracking-tight mb-6">
            Media Resources
          </h1>
          <p className="press-reveal text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Bios, logos, press photos and media appearances for editorial use and bookings. All assets are free to use for press and media purposes.
          </p>
        </div>
      </section>

      {/* ── Bio Section ── */}
      {(pressKit.shortBio || pressKit.mediumBio) && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="press-reveal text-2xl md:text-3xl font-serif italic mb-8">Biography</h2>

            {/* Bio toggle */}
            <div className="press-reveal flex gap-2 mb-8">
              {pressKit.shortBio && (
                <button
                  onClick={() => setBioMode('short')}
                  className="px-4 py-2 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: bioMode === 'short' ? 'color-mix(in srgb, #c8a96e 15%, transparent)' : 'transparent',
                    borderColor: bioMode === 'short' ? '#c8a96e' : 'var(--border-hi)',
                    color: bioMode === 'short' ? '#c8a96e' : 'var(--text-dim)',
                    border: '1px solid',
                  }}
                >
                  Short
                </button>
              )}
              {pressKit.mediumBio && (
                <button
                  onClick={() => setBioMode('medium')}
                  className="px-4 py-2 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: bioMode === 'medium' ? 'color-mix(in srgb, #c8a96e 15%, transparent)' : 'transparent',
                    borderColor: bioMode === 'medium' ? '#c8a96e' : 'var(--border-hi)',
                    color: bioMode === 'medium' ? '#c8a96e' : 'var(--text-dim)',
                    border: '1px solid',
                  }}
                >
                  Medium
                </button>
              )}
            </div>

            {/* Bio text */}
            <div className="press-reveal rounded-2xl border p-8 md:p-10" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-card) 50%, transparent)' }}>
              <p className="text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
                {currentBio}
              </p>
              <div className="mt-6 pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[11px]" style={{ color: 'var(--text-mute)' }}>
                  {bioMode === 'short' ? '~30 words' : '~80 words'} — ready for editorial use
                </p>
                <button
                  onClick={copyBio}
                  className="px-4 py-2 rounded-full border text-xs font-medium transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border-hi)', color: copied ? '#c8a96e' : 'var(--text-dim)' }}
                >
                  {copied ? 'Copied!' : 'Copy Bio'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Logos ── */}
      {hasLogos && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="press-reveal text-2xl md:text-3xl font-serif italic mb-12">Brand Logos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {pressKit.logos!.map((logo, i) => (
                <div
                  key={i}
                  className="press-reveal rounded-2xl border p-8 flex flex-col items-center gap-4 group"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-card) 50%, transparent)' }}
                >
                  {logo.file?.url && (
                    <Image src={logo.file.url} alt={brandLabel(logo.brand)} width={160} height={64} className="h-16 w-auto object-contain" />
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{brandLabel(logo.brand)}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-mute)' }}>
                      {logo.format?.toUpperCase()} &middot; {logo.variant}
                    </p>
                  </div>
                  {logo.file?.url && (
                    <a
                      href={logo.file.url}
                      download={logo.file.filename || `${logo.brand}-logo.${logo.format || 'png'}`}
                      className="px-4 py-2 rounded-full border text-[11px] font-medium transition-all hover:bg-white/5 hover:border-[#c8a96e]/30"
                      style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                    >
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Press Photos ── */}
      {hasPhotos && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="press-reveal text-2xl md:text-3xl font-serif italic mb-12">Press Photos</h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
              {pressKit.pressPhotos!.map((photo, i) => (
                <div
                  key={i}
                  className="press-reveal break-inside-avoid rounded-2xl overflow-hidden border group relative"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {photo.image?.url && (
                    <Image src={photo.image.url} alt={photo.caption || 'Press photo'} width={800} height={600} sizes="(max-width: 768px) 100vw, 33vw" className="w-full h-auto object-cover" loading="lazy" />
                  )}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, var(--bg) 10%, transparent 60%)' }}
                  >
                    {photo.caption && (
                      <p className="text-xs font-light mb-2" style={{ color: 'var(--text-dim)' }}>{photo.caption}</p>
                    )}
                    {photo.credit && (
                      <p className="text-[10px]" style={{ color: 'var(--text-mute)' }}>Credit: {photo.credit}</p>
                    )}
                    {photo.image?.url && (
                      <a
                        href={photo.image.url}
                        download={photo.image.filename || 'press-photo.jpg'}
                        className="mt-3 inline-block px-4 py-2 rounded-full border text-[11px] font-medium self-start hover:bg-white/5"
                        style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                      >
                        Download Hi-Res
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Media Appearances ── */}
      {hasAppearances && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="press-reveal text-2xl md:text-3xl font-serif italic mb-12">Media Appearances</h2>
            <div className="space-y-3">
              {pressKit.mediaAppearances!.map((item, i) => {
                const inner = (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-[#c8a96e] transition-colors" style={{ color: 'var(--text)' }}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium" style={{ color: 'var(--text-dim)' }}>{item.publication}</span>
                        {item.date && (
                          <>
                            <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>&middot;</span>
                            <span className="text-[11px]" style={{ color: 'var(--text-mute)' }}>{formatDate(item.date)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className="flex-shrink-0 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.1em] border"
                      style={{ borderColor: 'var(--border-hi)', color: 'var(--text-mute)' }}
                    >
                      {typeLabel(item.type)}
                    </span>
                  </div>
                );

                return item.url && item.url !== '#' ? (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press-reveal group block p-5 rounded-2xl border transition-all hover:bg-white/[0.03]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={i}
                    className="press-reveal group p-5 rounded-2xl border"
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

      {/* ── Press Contact ── */}
      {hasContact && (
        <section className="pb-24 md:pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="press-reveal rounded-2xl border p-10 md:p-14 text-center"
              style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-card) 50%, transparent)' }}
            >
              <h2 className="text-2xl md:text-3xl font-serif italic mb-4">Press Contact</h2>
              <p className="text-sm font-light mb-8" style={{ color: 'var(--text-dim)' }}>
                For interview requests, high-res assets, or editorial inquiries.
              </p>
              <div className="space-y-2">
                {pressKit.pressContact?.name && (
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{pressKit.pressContact.name}</p>
                )}
                {pressKit.pressContact?.email && (
                  <a
                    href={`mailto:${pressKit.pressContact.email}`}
                    className="text-sm transition-colors hover:text-[#c8a96e] block"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {pressKit.pressContact.email}
                  </a>
                )}
                {pressKit.pressContact?.phone && (
                  <p className="text-xs" style={{ color: 'var(--text-mute)' }}>{pressKit.pressContact.phone}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        className="py-32 md:py-40 text-center border-t"
        style={{
          background: 'linear-gradient(to bottom, var(--bg), var(--bg-card))',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 press-reveal">
          <h2 className="text-4xl md:text-6xl font-serif italic leading-tight mb-6">
            Need Something Specific?
          </h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Custom assets, interview requests, or high-res files — we&apos;re happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="/about"
              className="px-12 py-4 text-sm font-light transition-colors"
              style={{ color: 'var(--text-dim)' }}
            >
              Back to About
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
