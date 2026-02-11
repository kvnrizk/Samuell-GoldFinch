'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import OrbitCarousel from '@/components/ui/OrbitCarousel';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { SectionKicker } from '@/components/ui/SectionKicker';

// Static fallbacks when CMS is empty
const staticFeaturedSets = [
  { url: '/assets/blaze/stouh_beirut/2E2A1724.jpg', title: 'STOUH BEIRUT', category: 'Rooftop Event' },
  { url: '/assets/blaze/ambassy/0C5A9134.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic Event' },
  { url: '/assets/blaze/weddings/DSCF2395.jpg', title: 'Blaze Weddings', category: 'Cinematic Wedding' },
  { url: '/assets/blaze/editorial_and_brand/pexels-amar-10288372.jpg', title: 'Editorial & Brand', category: 'Brand Campaign' },
];

const collaborations: { name: string; location: string; logo?: string }[] = [
  { name: 'Embassy of Lebanon', location: 'Paris' },
  { name: 'STOUH BEIRUT', location: 'Paris', logo: '/assets/stouth_beirut_logo.webp' },
  { name: 'MIPIM Cannes', location: 'Cannes', logo: '/assets/mipim logo.webp' },
  { name: 'Elie Saab', location: 'Beirut', logo: '/assets/Elie_saab_logo.webp' },
  { name: 'Kate Zubok', location: 'International' },
  { name: 'Transdev', location: 'France' },
  { name: 'Le Speakeasy', location: 'Paris', logo: '/assets/kolasi/logo_speakeasy.png' },
  { name: 'Chloe Khalife', location: 'International' },
  { name: 'Brunch Festival', location: 'Paris' },
  { name: 'France Tourisme', location: 'France' },
];

interface CMSPhoto {
  url?: string;
}

interface CMSGalleryItem {
  photo?: CMSPhoto;
  [key: string]: unknown;
}

interface CMSProject {
  slug?: string;
  title?: string;
  heroVideo?: { muxPlaybackId?: string; posterUrl?: string };
  gallery?: CMSGalleryItem[];
  category?: string;
  [key: string]: unknown;
}

interface CMSArtist {
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface HomeClientProps {
  settings: Record<string, unknown>;
  blazeProjects: CMSProject[];
  kolasiEvents: CMSProject[];
  artists: CMSArtist[];
}

export default function HomeClient({ blazeProjects, kolasiEvents }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build carousel items from CMS or fallback
  const carouselItems = blazeProjects.length > 0
    ? blazeProjects.map((p: CMSProject) => ({
        url: p.gallery?.[0]?.photo?.url || p.heroVideo?.posterUrl || '/assets/blaze/stouh_beirut/2E2A1724.jpg',
        title: p.title || 'Untitled',
        category: p.category || 'Production',
      }))
    : staticFeaturedSets;

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();

    gsap.from('.hero-reveal', {
      y: 80,
      opacity: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: 'expo.out',
    });

    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: 'top 85%' },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Cinematic Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <VideoPlayer
            src="/assets/blaze/weddings/BLAZE_WEDDINGS_Demoreel.mp4"
            poster="/assets/blaze/weddings/0G0A7811.jpg"
            autoPlay
            loop
            muted
            mode="hero"
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <p className="hero-reveal text-[10px] tracking-[0.5em] uppercase text-white/50">
              Artistic Director &bull; DJ &bull; Event Curator
            </p>
            <h1 className="hero-reveal text-6xl md:text-8xl font-serif leading-[0.9] tracking-tight">
              Visionary <br />
              <span className="italic">Storyteller</span> <br />
              Experience <br />
              <span className="italic">Curator</span>
            </h1>
            <p className="hero-reveal text-sm text-white/40 max-w-md uppercase tracking-widest leading-relaxed">
              Paris-based creative director blending cinematic storytelling with curated live experiences across Europe, the Middle East, and beyond.
            </p>
            <div className="hero-reveal flex flex-wrap gap-4 pt-4">
              <Link
                href="/blaze"
                className="px-8 py-3 border border-white/20 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all rounded-sm backdrop-blur-md"
              >
                View Blaze Work
              </Link>
              <Link
                href="/kolasi"
                className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all rounded-sm backdrop-blur-md"
              >
                Discover Kolasi
              </Link>
            </div>
          </div>

          <div className="hero-reveal hidden md:block">
            <div className="group relative w-full aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={blazeProjects[0]?.gallery?.[0]?.photo?.url || '/assets/blaze/weddings/0G0A7811.jpg'}
                alt="Blaze Motion — Signature Wedding Reel"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black via-transparent to-transparent">
                <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Blaze Motion</p>
                <h3 className="text-xl font-serif italic mb-1 uppercase tracking-tighter">Signature Wedding Reel</h3>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 border-t border-white/10 pt-4 mt-4">
                  Paris &bull; Cinematic Weddings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <div className="w-[1px] h-10 bg-white" />
        </div>
      </section>

      {/* Featured Sets */}
      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal-section">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-6">Featured Sets</p>
            <h2 className="text-4xl md:text-6xl font-serif max-w-4xl mx-auto leading-tight italic">
              Three Blaze coverages orbiting between <br />
              <span className="not-italic">
                STOUH BEIRUT, Parisian diplomacy, <br />
                and MIPIM Cannes.
              </span>
            </h2>
          </div>
          <div className="reveal-section">
            <OrbitCarousel items={carouselItems} />
          </div>
        </div>
      </section>

      {/* Blaze Section Split */}
      <section className="py-40 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center reveal-section">
            <div className="space-y-10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">Blaze Production</p>
              <h2 className="text-5xl md:text-7xl font-serif leading-none italic">
                Where <br /> Emotion <br /> <span className="not-italic">Meets Craft</span>
              </h2>
              <p className="text-sm text-white/50 leading-relaxed uppercase tracking-widest max-w-sm">
                Cinematic storytelling and visual precision for those who feel deeply. From intimate weddings to editorial campaigns, Blaze turns life into moving art.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2 border-l border-white/10 pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Wedding films</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">Crafted with timeless elegance and emotional weight.</p>
                </div>
                <div className="space-y-2 border-l border-white/10 pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Speakeasy Series</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">Capturing warmth, shadow, and nocturnal energy.</p>
                </div>
              </div>
              <Link href="/blaze" className="inline-block px-12 py-4 border border-white/20 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                Explore Blaze
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl transform md:translate-x-12 relative z-10">
                <img src={blazeProjects[0]?.gallery?.[0]?.photo?.url || '/assets/blaze/stouh_beirut/2E2A1724.jpg'} alt="STOUH BEIRUT" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 -left-12 -translate-y-1/2 aspect-[4/5] w-2/3 bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl opacity-40">
                <img src={blazeProjects[1]?.gallery?.[0]?.photo?.url || '/assets/blaze/ambassy/0C5A9134.jpg'} alt="Embassy of Lebanon" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kolasi Section */}
      <section className="py-40 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 reveal-section">
            <div className="bg-neutral-900/40 p-12 rounded-3xl border border-white/5 backdrop-blur-xl">
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-8">Kolasi Agency</p>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                DJ &amp; Live Show <br /> Booking &bull; Event <br /> Curation &bull; Content <br /> Creation
              </h2>
              <p className="text-sm text-white/40 uppercase tracking-widest leading-relaxed mb-10">
                Kolasi curates nightlife, festivals and cultural happenings through bespoke talent booking, scenography and media production.
              </p>
              <ul className="space-y-4 mb-12">
                {['DJ booking & live performers worldwide', 'Tailor-made events with artistic direction and PR', 'Cinematic coverage and post-event media', 'Sound & Light Rental'].map((item, i) => (
                  <li key={i} className="text-[10px] text-white uppercase tracking-widest flex items-center">
                    <span className="w-1 h-1 bg-white rounded-full mr-4" /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4">
                <Link href="/kolasi" className="px-8 py-3 border border-white/20 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                  Discover Kolasi
                </Link>
                <Link href="/kolasi#services" className="px-8 py-3 border border-white/10 bg-white/5 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                  View Expertise
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                <img src={kolasiEvents[0]?.gallery?.[0]?.photo?.url || '/assets/kolasi/images/4F8A2882.jpg'} alt="Kolasi event" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl mt-12">
                <img src={kolasiEvents[1]?.gallery?.[0]?.photo?.url || '/assets/kolasi/images/4F8A3195.jpg'} alt="Kolasi artist" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl -mt-6">
                <img src="/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.JPG" alt="Le Speakeasy" className="w-full h-full object-cover transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Venues CTA */}
      <section className="py-32 bg-[#070707] reveal-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#c8a96e]/20 bg-gradient-to-br from-[#c8a96e]/[0.06] to-transparent p-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <SectionKicker label="For Venues" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-100 mb-4">
                  Give your venue a weekly identity
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                  Curated DJ programming, monthly content production, and brand strategy for bars, clubs, and restaurants.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/venues"
                    className="bg-[#c8a96e] text-[#09090b] font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#d4b87a] active:scale-[0.98] transition-all"
                  >
                    Learn More
                  </Link>
                  <Link
                    href="/venues#venue-form"
                    className="border border-[#c8a96e] text-[#c8a96e] font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#c8a96e]/[0.08] transition-all"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { stat: '150+', label: 'Live sessions' },
                    { stat: '12+', label: 'Venues' },
                    { stat: '3x', label: 'Avg. engagement lift' },
                  ].map((s, i) => (
                    <div key={i} className="p-4">
                      <p className="font-serif text-2xl text-[#c8a96e] font-bold">{s.stat}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#c8a96e]/[0.04] rounded-full blur-[80px]" />
          </div>
        </div>
      </section>

      {/* Trusted Collaborations */}
      <section className="py-40 bg-[#070707]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="reveal-section">
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-8">Trusted Collaborations</p>
            <h2 className="text-3xl md:text-4xl font-serif italic mb-20 leading-snug">
              From Parisian diplomacy to Cannes <br /> summits, we safeguard the chemistry <br /> between story, guests, and spotlight.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {collaborations.map((c, i) => (
                <div key={i} className="group flex flex-col items-center justify-center p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#c8a96e]/20 hover:bg-[#c8a96e]/[0.03] transition-all duration-500">
                  <div className="h-12 flex items-center justify-center mb-5">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className="h-10 w-auto object-contain mix-blend-screen opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    ) : (
                      <span className="text-lg font-serif italic text-white/20 group-hover:text-white/50 transition-colors duration-500">{c.name.split(' ').map(w => w[0]).join('')}</span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1 text-white/70 group-hover:text-white transition-colors">{c.name}</p>
                  <p className="text-[9px] text-white/25 uppercase tracking-[0.2em] group-hover:text-[#c8a96e]/60 transition-colors">{c.location}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 flex justify-center space-x-12 py-10 border-y border-white/5">
              <div className="text-center">
                <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Cities Filmed</p>
                <p className="text-3xl font-serif">12+</p>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Live Experiences</p>
                <p className="text-3xl font-serif">150+ sets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center reveal-section">
          <h2 className="text-5xl md:text-7xl font-serif mb-10 italic">Let&apos;s Create Together</h2>
          <p className="text-sm text-white/40 uppercase tracking-[0.3em] mb-12">
            Tell me about your vision ~ weddings, films or events.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote"
              className="inline-block px-12 py-4 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
              Request a Quote
            </Link>
            <Link
              href="/venues"
              className="inline-block px-12 py-4 bg-[#c8a96e]/10 border border-[#c8a96e]/30 rounded-full text-[10px] tracking-widest uppercase text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#09090b] transition-all"
            >
              I&apos;m a Venue Owner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
