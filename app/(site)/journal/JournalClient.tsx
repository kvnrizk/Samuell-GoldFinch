'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';

interface Post {
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  coverImage?: { url?: string };
  publishedAt?: string;
  featured?: boolean;
  tags?: { tag?: string }[];
}

interface JournalClientProps {
  posts: Post[];
}

const categories = [
  { label: 'All', value: '' },
  { label: 'Behind the Scenes', value: 'behind-the-scenes' },
  { label: 'Tips & Guides', value: 'tips' },
  { label: 'Industry', value: 'industry' },
  { label: 'News', value: 'news' },
  { label: 'Client Stories', value: 'client-stories' },
];

function categoryLabel(value?: string) {
  const match = categories.find((c) => c.value === value);
  return match?.label || value || '';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

function estimateReadTime(excerpt?: string) {
  // Rough estimate based on excerpt length (full content unavailable on listing)
  const words = (excerpt || '').split(/\s+/).length;
  return Math.max(3, Math.round(words / 40)) + ' min read';
}

export default function JournalClient({ posts }: JournalClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('');

  const filteredPosts = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const gridPosts = filteredPosts.filter((p) => p.slug !== featuredPost?.slug);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.journal-reveal').forEach((el) => {
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
      {/* ── Hero ── */}
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic leading-[0.95] tracking-tight mb-4">
              Journal
            </h1>
            <p className="text-sm font-light max-w-xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              Stories, insights and behind-the-scenes from the world of cinematic filmmaking and nightlife curation.
            </p>
          </div>

          {/* Featured post */}
          {featuredPost && !activeCategory && (
            <Link
              href={`/journal/${featuredPost.slug}`}
              className="journal-reveal group block rounded-2xl overflow-hidden border relative aspect-[21/9] md:aspect-[3/1]"
              style={{ borderColor: 'var(--border)' }}
            >
              {featuredPost.coverImage?.url ? (
                <Image
                  src={featuredPost.coverImage.url}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1280px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: 'var(--bg-card)' }} />
              )}
              <div
                className="absolute inset-0 flex flex-col justify-end p-8 md:p-12"
                style={{ background: 'linear-gradient(to top, var(--bg) 10%, color-mix(in srgb, var(--bg) 60%, transparent) 50%, transparent)' }}
              >
                <span
                  className="inline-block self-start px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.12em] mb-4 border"
                  style={{
                    borderColor: 'color-mix(in srgb, #c8a96e 40%, transparent)',
                    color: '#c8a96e',
                    backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {categoryLabel(featuredPost.category)}
                </span>
                <h2 className="text-2xl md:text-4xl font-serif italic leading-tight mb-3 group-hover:text-[#c8a96e] transition-colors">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="text-sm font-light max-w-2xl leading-relaxed hidden md:block" style={{ color: 'var(--text-dim)' }}>
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-4 text-[11px]" style={{ color: 'var(--text-mute)' }}>
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                  <span>&middot;</span>
                  <span>{estimateReadTime(featuredPost.excerpt)}</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ── Category Filter ── */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="journal-reveal flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-5 py-2 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: activeCategory === cat.value ? 'color-mix(in srgb, #c8a96e 15%, transparent)' : 'transparent',
                  borderColor: activeCategory === cat.value ? '#c8a96e' : 'var(--border-hi)',
                  color: activeCategory === cat.value ? '#c8a96e' : 'var(--text-dim)',
                  border: '1px solid',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {gridPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/journal/${post.slug}`}
                  className="journal-reveal group rounded-2xl overflow-hidden border flex flex-col transition-colors hover:border-[#c8a96e]/20"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Cover image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.coverImage?.url ? (
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: 'var(--bg-card)' }} />
                    )}
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.12em] border"
                      style={{
                        borderColor: 'color-mix(in srgb, #c8a96e 30%, transparent)',
                        color: '#c8a96e',
                        backgroundColor: 'color-mix(in srgb, var(--bg) 70%, transparent)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {categoryLabel(post.category)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <h3 className="text-lg font-serif mb-3 group-hover:text-[#c8a96e] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs font-light leading-relaxed flex-1 mb-4 line-clamp-3" style={{ color: 'var(--text-dim)' }}>
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-mute)' }}>
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>&middot;</span>
                      <span>{estimateReadTime(post.excerpt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-sm font-light" style={{ color: 'var(--text-mute)' }}>
                No posts in this category yet.
              </p>
            </div>
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
        <div className="max-w-3xl mx-auto px-6 journal-reveal">
          <h2 className="text-4xl md:text-6xl font-serif italic leading-tight mb-6">
            Have a Story to Tell?
          </h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Whether it&apos;s a wedding, a brand, or a night to remember — let&apos;s create something worth writing about.
          </p>
          <Link
            href="/contact"
            className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
