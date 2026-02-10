'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';

const expertise = [
  { icon: 'music', title: 'DJ Booking', description: 'Connecting world-class DJs and live performers with venues, festivals and private events globally.' },
  { icon: 'layout', title: 'Event Curation', description: 'Art direction, programming and press relations to shape cultural experiences and narratives.' },
  { icon: 'camera', title: 'Content Creation', description: 'Cinematic capture, editing and campaign-ready media for events and promotions.' },
];

const gallery = [
  '/assets/kolasi/images/4F8A2882.jpg',
  '/assets/kolasi/images/4F8A3195.jpg',
  '/assets/kolasi/images/4F8A3310.jpg',
  '/assets/kolasi/images/4F8A2938.jpg',
  '/assets/kolasi/images/4F8A3750.jpg',
  '/assets/kolasi/images/4F8A3777.jpg',
  '/assets/kolasi/images/4F8A3801.jpg',
  '/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.JPG',
  '/assets/kolasi/artists/artist-1.jpg',
  '/assets/kolasi/artists/artist-2.jpg',
  '/assets/kolasi/artists/artist-3.JPG',
  '/assets/kolasi/artists/artist-4.JPG',
  '/assets/kolasi/artists/IMG_6476.JPG',
  '/assets/kolasi/artists/IMG_6733.jpg',
  '/assets/kolasi/artists/4F8A3682.jpg',
];

const IconMusic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);
const IconLayout = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
);
const IconCamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
);

function getIcon(name: string) {
  switch (name) {
    case 'music': return <IconMusic />;
    case 'layout': return <IconLayout />;
    case 'camera': return <IconCamera />;
    default: return null;
  }
}

export default function KolasiClient() {
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
    <div ref={containerRef} className="pt-20 bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          poster="/assets/kolasi/images/4F8A3195.jpg"
          src="/assets/kolasi/events/2ndsun/2nd_sun.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-8xl font-serif mb-6 uppercase tracking-tighter leading-none reveal-up">
            Creative Booking <br />
            <span className="italic">and Talent Agency</span>
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/50 mb-10 reveal-up">
            DJ &amp; Live Show Booking &bull; Event Curation &bull; Content Creation &bull; Production Services
          </p>
          <a href="#services" className="px-10 py-4 border border-white/20 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all reveal-up backdrop-blur-sm inline-block">
            Explore Services
          </a>
        </div>
      </section>

      {/* Manifesto + Logo */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 reveal-up">
          <h2 className="text-4xl md:text-5xl font-serif leading-tight italic">
            Creative Booking &amp; <br />
            <span className="not-italic">Talent Agency</span>
          </h2>
          <div className="space-y-6 text-sm md:text-base text-white/50 leading-relaxed uppercase tracking-widest font-light">
            <p>At Kolasi, we craft your brand&apos;s visual and audio identity through artistic direction, DJ bookings, live shows with top-tier singers, and PR strategy.</p>
            <p>Our agency creates events and collaborates with renowned curators to deliver unforgettable experiences.</p>
            <p>With a network of over 50 international DJs and partnerships across Europe, the Middle East, and South America, Kolasi bridges music, performance, and innovation to elevate every moment.</p>
          </div>
        </div>
        <div className="reveal-up">
          <div className="aspect-[4/3] rounded-[2.5rem] bg-neutral-900 border border-white/5 shadow-2xl flex items-center justify-center p-20 relative overflow-hidden group">
            <div className="relative z-10 text-center space-y-6 transform group-hover:scale-110 transition-transform duration-700">
              <div className="w-16 h-24 mx-auto border-x-2 border-b-2 border-white relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-24 bg-white" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
              </div>
              <p className="text-2xl font-serif tracking-[0.3em] uppercase">Kolasi</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section id="services" className="py-40 bg-[#070707] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal-up">
            <h2 className="text-4xl md:text-6xl font-serif italic mb-4">Our Expertise</h2>
            <div className="w-20 h-[1px] bg-white/20 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {expertise.map((exp, i) => (
              <div key={i} className="reveal-up p-12 border border-white/5 bg-neutral-900/40 rounded-[2rem] hover:bg-neutral-900 transition-all group flex flex-col items-center text-center">
                <div className="mb-8 p-6 bg-white/5 rounded-full text-white/40 group-hover:text-white transition-all">
                  {getIcon(exp.icon)}
                </div>
                <h3 className="text-xl font-serif uppercase tracking-widest mb-4">{exp.title}</h3>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kolasi Showcase */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal-up">
            <h2 className="text-4xl font-serif mb-4 italic">Kolasi Showcase</h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">Selected clips and promos from Kolasi nights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['le speakeasy ads.mp4', 'le speakeasy ads2 barman.mp4', 'lespeakeasy g500 mercedes.mp4'].map((clip, i) => (
              <div key={i} className="reveal-up aspect-video bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 relative group cursor-pointer shadow-2xl">
                <video
                  muted playsInline loop
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  src={`/assets/kolasi/Speakeasy_Ads/${clip}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Clip 0{i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Capabilities */}
      <section className="py-40 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-24 reveal-up">Services &amp; Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-16 reveal-up">
            <div className="space-y-8">
              <h3 className="text-xl font-serif border-b border-white/10 pb-6 uppercase tracking-widest">DJ &amp; Live Show Booking</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Talent sourcing, rider negotiation and international bookings for clubs, festivals and private events.</p>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-serif border-b border-white/10 pb-6 uppercase tracking-widest">Event Curation &amp; PR</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Art direction, programming and press relations to shape cultural experiences and narratives.</p>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-serif border-b border-white/10 pb-6 uppercase tracking-widest">Content Creation &amp; Production</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Cinematic capture, editing and campaign-ready media for events and promotions.</p>
            </div>
          </div>
          <div className="mt-24 text-center reveal-up">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-8">Integrated Plus Services</p>
            <div className="flex justify-center space-x-12 text-sm uppercase tracking-[0.3em] font-light">
              <span>&bull; Sound</span>
              <span>&bull; Light</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal-up">
            <h2 className="text-4xl font-serif italic mb-4">Kolasi Gallery</h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">A glimpse into our nights ~ sound, light and emotion captured in motion.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 reveal-up">
            {gallery.map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl group relative ${i % 3 === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-[3/4]'}`}>
                <img
                  src={img}
                  alt="Kolasi event"
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 text-center bg-gradient-to-b from-black to-neutral-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 reveal-up">
          <h2 className="text-5xl md:text-7xl font-serif mb-10 italic">Let&apos;s Create the Night</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-12 max-w-lg mx-auto leading-relaxed">
            From concept to performance, Kolasi curates experiences that transcend nightlife.
          </p>
          <Link href="/contact" className="px-14 py-4 border border-white/30 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
            Contact Kolasi
          </Link>
        </div>
      </section>
    </div>
  );
}
