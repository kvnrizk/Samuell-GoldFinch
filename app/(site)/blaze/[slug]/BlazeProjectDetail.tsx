'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface MediaItem {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface GalleryRow {
  image?: MediaItem;
}

interface HeroVideo {
  muxPlaybackId?: string;
  posterUrl?: string;
}

interface Project {
  title: string;
  slug: string;
  category: string;
  client?: string;
  date?: string;
  location?: string;
  description?: any;
  heroVideo?: HeroVideo;
  gallery?: GalleryRow[];
  comingSoon?: boolean;
}

interface AdjacentProject {
  title: string;
  slug: string;
  category?: string;
}

interface BlazeProjectDetailProps {
  project: Project;
  prevProject?: AdjacentProject;
  nextProject?: AdjacentProject;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(new Date(dateStr));
  } catch {
    return null;
  }
}

function categoryLabel(cat: string) {
  const labels: Record<string, string> = {
    wedding: 'Wedding',
    editorial: 'Editorial',
    event: 'Event',
    documentary: 'Documentary',
    diplomatic: 'Diplomatic',
  };
  return labels[cat?.toLowerCase()] || cat;
}

function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;

  // Payload Lexical rich text stores content as { root: { children: [...] } }
  const root = content?.root?.children;
  if (!root || !Array.isArray(root)) {
    // If it's a plain string fallback
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
          const Tag = (node.tag || 'h3') as keyof React.JSX.IntrinsicElements;
          return (
            <Tag key={i} className="text-xl md:text-2xl font-serif italic mt-8 mb-4">
              {text}
            </Tag>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function BlazeProjectDetail({
  project,
  prevProject,
  nextProject,
}: BlazeProjectDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const galleryImages = (project.gallery || [])
    .map((row) => row.image)
    .filter((img): img is MediaItem => Boolean(img?.url));

  const heroImage = galleryImages[0];
  const hasVideo = Boolean(project.heroVideo?.muxPlaybackId);
  const formattedDate = formatDate(project.date);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();

    gsap.utils.toArray<HTMLElement>('.detail-reveal').forEach((el, i) => {
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
        {hasVideo ? (
          <div className="absolute inset-0">
            <VideoPlayer
              muxPlaybackId={project.heroVideo!.muxPlaybackId!}
              poster={project.heroVideo!.posterUrl}
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
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover opacity-70 scale-105"
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-card)' }} />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--bg) 40%, transparent), transparent 40%, color-mix(in srgb, var(--bg) 80%, transparent) 80%, var(--bg))',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 max-w-7xl mx-auto">
          <div className="detail-reveal">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] mb-6 border"
              style={{
                borderColor: 'var(--border-hi)',
                color: 'var(--text-dim)',
                backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {categoryLabel(project.category)}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif italic leading-[0.95] tracking-tight mb-6 detail-reveal">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-light detail-reveal" style={{ color: 'var(--text-dim)' }}>
            {project.client && <span>{project.client}</span>}
            {project.client && (formattedDate || project.location) && (
              <span style={{ color: 'var(--text-mute)' }}>&middot;</span>
            )}
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && project.location && (
              <span style={{ color: 'var(--text-mute)' }}>&middot;</span>
            )}
            {project.location && <span>{project.location}</span>}
          </div>
        </div>
      </section>

      {/* ── Description ── */}
      {project.description && (
        <section className="py-24 md:py-32 max-w-3xl mx-auto px-6">
          <div className="detail-reveal">
            <RichTextRenderer content={project.description} />
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {galleryImages.length > 0 && (
        <section className="pb-24 md:pb-40 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif italic mb-12 detail-reveal">Gallery</h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="detail-reveal break-inside-avoid rounded-2xl overflow-hidden border group"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Image
                    src={img.url!}
                    alt={`${project.title} — ${i + 1}`}
                    width={img.width || 800}
                    height={img.height || 600}
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
      <section
        className="border-t"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2">
          {/* Previous */}
          {prevProject ? (
            <Link
              href={`/blaze/${prevProject.slug}`}
              className="group py-12 md:py-20 px-6 md:px-12 border-r transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] block mb-3" style={{ color: 'var(--text-mute)' }}>
                Previous
              </span>
              <span className="text-lg md:text-2xl font-serif italic group-hover:translate-x-[-4px] transition-transform duration-300 block">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {/* Next */}
          {nextProject ? (
            <Link
              href={`/blaze/${nextProject.slug}`}
              className="group py-12 md:py-20 px-6 md:px-12 text-right transition-colors hover:bg-[var(--bg-hover)]"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] block mb-3" style={{ color: 'var(--text-mute)' }}>
                Next
              </span>
              <span className="text-lg md:text-2xl font-serif italic group-hover:translate-x-[4px] transition-transform duration-300 block">
                {nextProject.title}
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
        <div className="max-w-3xl mx-auto px-6 detail-reveal">
          <h2 className="text-4xl md:text-6xl font-serif italic leading-tight mb-6">
            Let&apos;s Create Something Extraordinary
          </h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Every project begins with a conversation. Tell us about your vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="/blaze"
              className="px-12 py-4 text-sm font-light transition-colors"
              style={{ color: 'var(--text-dim)' }}
            >
              Back to All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
