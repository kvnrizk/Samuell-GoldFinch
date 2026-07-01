'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { SectionKicker } from '@/components/ui/SectionKicker';
import { GlassCard } from '@/components/ui/GlassCard';

interface CaseStudyData {
  venueName: string;
  slug: string;
  role?: string;
  frequency?: string;
  outcome?: string;
  deliverables?: string;
  fullContent?: string;
  coverVideoSource?: 'mux' | 'cloudinary';
  coverVideo?: string;
  coverVideoCloudinaryId?: string;
  coverImage?: { url: string };
}

interface CaseStudyDetailProps {
  caseStudy: CaseStudyData;
}

export default function CaseStudyDetail({ caseStudy }: CaseStudyDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.cs-reveal', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pt-32 pb-24 venues-section">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/venues"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-[#f7f7f5] transition-colors mb-12 cs-reveal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Venues
        </Link>

        {/* Header */}
        <div className="cs-reveal mb-12">
          <SectionKicker label="Case Study" />
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-stone-100 mb-4">
            {caseStudy.venueName}
          </h1>

          {/* Meta strip */}
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
            {caseStudy.role && (
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#f7f7f5]" />
                {caseStudy.role}
              </span>
            )}
            {caseStudy.frequency && (
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#f7f7f5]" />
                {caseStudy.frequency}
              </span>
            )}
          </div>
        </div>

        {/* Cover media */}
        {(caseStudy.coverVideo || caseStudy.coverVideoCloudinaryId || caseStudy.coverImage?.url) && (
          <div className="relative rounded-2xl overflow-hidden mb-12 cs-reveal aspect-video">
            {(caseStudy.coverVideo || caseStudy.coverVideoCloudinaryId) ? (
              <VideoPlayer
                muxPlaybackId={caseStudy.coverVideoSource !== 'cloudinary' ? caseStudy.coverVideo : undefined}
                cloudinaryVideoId={caseStudy.coverVideoSource === 'cloudinary' ? caseStudy.coverVideoCloudinaryId : undefined}
                autoPlay
                loop
                muted
                mode="showcase"
                className="aspect-video"
              />
            ) : (
              <Image
                src={caseStudy.coverImage!.url}
                alt={caseStudy.venueName}
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
              />
            )}
          </div>
        )}

        {/* Outcome highlight */}
        {caseStudy.outcome && (
          <GlassCard featured className="!p-8 mb-12 cs-reveal">
            <p className="text-xs font-medium text-[#f7f7f5] mb-2">
              Key Result
            </p>
            <p className="font-serif text-2xl md:text-3xl text-stone-100 font-semibold">
              {caseStudy.outcome}
            </p>
          </GlassCard>
        )}

        {/* Deliverables */}
        {caseStudy.deliverables && (
          <div className="mb-12 cs-reveal">
            <h2 className="font-serif text-xl font-semibold text-stone-100 mb-4">
              What We Delivered
            </h2>
            <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
              {caseStudy.deliverables}
            </div>
          </div>
        )}

        {/* Rich text content */}
        {caseStudy.fullContent && (
          <div className="prose prose-invert prose-sm max-w-none cs-reveal mb-16">
            {/* Payload richText renders as a structured object. For now, render as plain text if string. */}
            {typeof caseStudy.fullContent === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: caseStudy.fullContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/on\w+="[^"]*"/gi, '') }} />
            ) : (
              <p className="text-zinc-400">Full case study content available soon.</p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-12 border-t border-white/[0.08] cs-reveal">
          <p className="text-zinc-500 text-sm mb-6">
            Want similar results for your venue?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/venues#venue-form"
              className="bg-[#f7f7f5] text-[#09090b] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#e4e4e7] transition-all"
            >
              Apply Now
            </Link>
            <Link
              href="/venues"
              className="border border-white/[0.08] text-zinc-400 font-semibold text-sm px-8 py-3.5 rounded-lg hover:border-white/[0.15] transition-all"
            >
              See All Venues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
