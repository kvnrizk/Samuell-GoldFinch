'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';

const milestones = [
  {
    title: 'About Samuell Goldfinch',
    description: 'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production (cinematic film and photography) and Kolasi Agency (DJ booking, event curation, and content creation). With over 50 productions across 12 cities and a roster of 50+ international DJs, Samuell bridges art, technology, and music to create experiences that move people.',
  },
  {
    title: 'About Kolasi',
    description: 'Kolasi is a creative booking and talent agency based in Paris. We craft visual and audio identities through artistic direction, DJ bookings, live shows, and PR strategy. With partnerships spanning over 20 venues across Europe, the Middle East, and South America, Kolasi delivers unforgettable cultural experiences.',
  },
  {
    title: 'About Blaze Production',
    description: 'Blaze Production is a full-service creative studio specialising in cinematic wedding films, editorial content, and branded storytelling. Trusted by MIPIM Cannes, Brunch Festival, Transdev, and France Tourisme, Blaze brings a director\'s eye and an editor\'s precision to every frame.',
  },
];

const drives = [
  { title: 'Film', description: 'Emotion-first direction for weddings, commercials and editorial films that are made to last.' },
  { title: 'Music', description: 'Melodic and commercial house sets that blend culture and mood into a dancefloor journey.' },
  { title: 'Experiences', description: 'Kolasi curates multi-sensory events, from scenography to PR, turning moments into memories.' },
];

const notableCredits = {
  credits: ['Le Speakeasy Paris & Cannes', 'Brunch Festival Paris', 'Solomun / Carl Cox (warm-up sets)', 'MIPIM Cannes / France Tourisme'],
  genres: ['Melodic house, deep house, warm techno, commercial house, live vocal sets'],
  assets: ['DJ press photos (high-res)', 'Bio / rider (PDF)', 'Set recordings (SoundCloud)'],
};

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <section className="pt-40 pb-32 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl font-serif mb-10 leading-none reveal-up">
          The Story <br />
          <span className="italic">Behind the Vision</span>
        </h1>
        <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/40 leading-relaxed reveal-up">
          Film director, international DJ and curator, Samuell Goldfinch crafts cinematic worlds and live experiences that move people.
        </p>
        <div className="mt-16 reveal-up">
          <div className="w-10 h-10 rounded-full border border-white/10 mx-auto flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Portrait & Bio */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
        <div className="reveal-up">
          <div className="rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl bg-neutral-900 border border-white/5 group">
            <img
              src="/assets/about/IMG_5840.JPG"
              alt="Samuell Goldfinch"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            />
          </div>
        </div>
        <div className="space-y-12 reveal-up">
          <h2 className="text-4xl font-serif italic mb-6">About Samuell</h2>
          <p className="text-sm md:text-base text-white/50 leading-[2] uppercase tracking-[0.2em] font-light">
            Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production (cinematic film and photography) and Kolasi Agency (DJ booking, event curation, and content creation). With over 50 productions across 12 cities — including work for MIPIM Cannes, Brunch Festival, Transdev, and France Tourisme — and a network of 50+ international DJs across 20+ venues, Samuell bridges art, technology, and music.
          </p>
          <p className="text-sm md:text-base text-white/50 leading-[2] uppercase tracking-[0.2em] font-light">
            Known for performances at Le Speakeasy Paris &amp; Cannes, Gate Club, Silencio, Saint-Tropez, San Sebasti&aacute;n, and Hard Rock Hotel Punta Cana, Samuell continues to unite art, technology, and music to create experiences that move people.
          </p>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-40 max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-32 reveal-up italic">Milestones</h2>
        <div className="space-y-24 relative">
          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
          {milestones.map((item, i) => (
            <div key={i} className="relative reveal-up flex flex-col md:flex-row items-start md:items-center">
              <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10" />
              <div className={`md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:order-2 md:pl-20'}`}>
                <h3 className="text-xl font-serif mb-4 uppercase tracking-widest">{item.title}</h3>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Drives the Work */}
      <section className="py-40 bg-[#070707] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-24 reveal-up italic">What Drives the Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {drives.map((drive, i) => (
              <div key={i} className="reveal-up p-12 border border-white/5 bg-neutral-900/40 rounded-[2rem] text-center hover:bg-neutral-900 transition-all group">
                <h3 className="text-2xl font-serif mb-6 italic">{drive.title}</h3>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">{drive.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Statement & Credits */}
      <section className="py-40 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="reveal-up p-16 border border-white/5 bg-neutral-900/20 rounded-[3rem] space-y-10">
            <h3 className="text-2xl font-serif text-center mb-8 italic">Artist Statement</h3>
            <p className="text-[10px] text-white/40 leading-[2] uppercase tracking-[0.2em] font-light text-center">
              I believe the most powerful stories are felt before they&apos;re understood. Whether through a lens or a live set, my work explores the space between emotion and craft — where a perfectly timed cut mirrors the drop in a melody, where light and sound dissolve the boundary between observer and participant.
            </p>
            <div className="pt-10 border-t border-white/5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4">Quick facts</p>
              <div className="space-y-2 text-[10px] text-white/40 uppercase tracking-widest">
                <p>Artist: Samuell Goldfinch (Kolasi)</p>
                <p>Base: Paris, France (available worldwide)</p>
                <p>Formats: DJ sets, Live programming, Curated line-ups</p>
                <p>Booking: <Link href="/contact" className="text-white hover:underline">contact form</Link> or <a href="mailto:contact@samuellgoldfinch.com" className="text-white hover:underline">email</a></p>
              </div>
            </div>
          </div>

          <div className="reveal-up p-16 border border-white/5 bg-neutral-900/40 rounded-[3rem] space-y-10 flex flex-col justify-between">
            <div className="text-center space-y-10">
              <h3 className="text-2xl font-serif italic">Notable credits &amp; assets</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Selected collaborations, events and press resources to support editorial use and bookings.</p>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-white">Notable credits</p>
                  <ul className="text-[10px] text-white/40 uppercase tracking-widest space-y-1">
                    {notableCredits.credits.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-white">Genres</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest max-w-xs mx-auto">{notableCredits.genres[0]}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-white">Press assets</p>
                  <ul className="text-[10px] text-white/40 uppercase tracking-widest space-y-1">
                    {notableCredits.assets.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-10 text-center">
              <button className="px-10 py-4 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all mb-4">
                Request Press Kit
              </button>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">
                Or email <a href="mailto:contact@samuellgoldfinch.com" className="hover:text-white transition-colors">contact@samuellgoldfinch.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 text-center bg-gradient-to-b from-black to-neutral-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 reveal-up">
          <h2 className="text-5xl md:text-7xl font-serif mb-10 italic">Let&apos;s Create Together</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-12 max-w-lg mx-auto leading-relaxed">
            Ready to craft films, events or live performances that resonate? Share your vision, we&apos;ll design the atmosphere, sound and narrative to match.
          </p>
          <Link href="/contact" className="px-14 py-4 border border-white/30 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
            Contact Samuell
          </Link>
        </div>
      </section>
    </div>
  );
}
