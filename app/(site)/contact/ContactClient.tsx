'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import { submitContactForm } from '@/lib/actions';

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.reveal-up', {
      y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
    });
  }, { scope: containerRef });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await submitContactForm(formData);
    if (result.success) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Something went wrong.');
    }
  };

  return (
    <div ref={containerRef} className="pt-40 pb-32 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-32 reveal-up">
          <h1 className="text-6xl md:text-8xl font-serif mb-8 italic leading-none">
            Let&apos;s Start the <br /> Conversation
          </h1>
          <p className="text-white/40 text-sm md:text-base uppercase tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">
            Share your plans for a wedding film, live performance or curated event. We answer within 48 hours.
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid lg:grid-cols-12 gap-16 items-start reveal-up">
          {/* Form */}
          <div className="lg:col-span-7 p-8 md:p-14 border border-white/5 rounded-[2.5rem] bg-neutral-900/30 backdrop-blur-sm shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-serif mb-12">Project Snapshot</h2>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1">Name</label>
                <input type="text" name="name" required placeholder="Your name" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1">Email</label>
                <input type="email" name="email" required placeholder="Email address" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1">Project type</label>
                <select name="projectType" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-sm appearance-none text-white/60">
                  <option>Wedding Film</option>
                  <option>Editorial / Brand</option>
                  <option>DJ Booking / Live Performance</option>
                  <option>Event Curation</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-1">Details</label>
                <textarea name="details" placeholder="Tell us more about your vision..." rows={5} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-sm resize-none" />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto px-12 py-4 border border-white/20 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send Request'}
              </button>

              {status === 'success' && (
                <p className="text-green-400 text-[10px] uppercase tracking-widest">Thank you ~ we will reply within 48 hours.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-[10px] uppercase tracking-widest">{errorMsg}</p>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-16">
            <div className="reveal-up">
              <h3 className="text-[11px] uppercase tracking-[0.4em] text-white/30 mb-6 font-bold">Direct Contact</h3>
              <a href="mailto:contact@samuellgoldfinch.com" className="block text-2xl md:text-3xl font-serif hover:text-white/70 transition-colors mb-2 italic">contact@samuellgoldfinch.com</a>
              <a href="tel:+33605883966" className="block text-2xl md:text-3xl font-serif hover:text-white/70 transition-colors italic">+33 6 05 88 39 66</a>
            </div>

            <div className="reveal-up">
              <h3 className="text-[11px] uppercase tracking-[0.4em] text-white/30 mb-6 font-bold">Availability</h3>
              <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                Based in Paris. Frequently working across France, Europe, the Middle East and available worldwide.
              </p>
            </div>

            <div className="reveal-up">
              <h3 className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-10 font-bold">FOLLOW</h3>
              <div className="flex flex-col space-y-6">
                {[
                  { handle: '@samuellgoldfinch', url: 'https://instagram.com/samuellgoldfinch', hasRing: true },
                  { handle: '@kolasi.paris', url: 'https://instagram.com/kolasi.paris', hasRing: false },
                  { handle: '@blazeprd', url: 'https://instagram.com/blazeprd', hasRing: false },
                ].map((ig, i) => (
                  <a key={i} href={ig.url} target="_blank" rel="noreferrer" className="flex items-center space-x-6 group">
                    <div className="relative">
                      {ig.hasRing && <div className="absolute -inset-3 border border-white/10 rounded-full group-hover:border-white/30 transition-all" />}
                      <div className="w-14 h-14 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-2xl flex items-center justify-center text-white relative z-10 group-hover:scale-105 transition-transform shadow-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                        {ig.hasRing && <div className="absolute top-1 right-1 w-3 h-3 bg-[#4ade80] border-2 border-white/10 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                      </div>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors">{ig.handle}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="reveal-up p-10 border border-white/5 bg-neutral-900/40 rounded-[2rem] relative overflow-hidden group">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/60 text-center mb-6">Response Promise</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] leading-[2] text-center italic">
                &ldquo;Every enquiry receives a personalised reply with next steps, budget guidance and a proposed call time within two business days.&rdquo;
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Meeting Section */}
        <section className="mt-48 pt-32 border-t border-white/5 text-center reveal-up">
          <h2 className="text-4xl md:text-6xl font-serif mb-10 italic">Prefer to meet in person?</h2>
          <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.4em] mb-12 max-w-2xl mx-auto leading-relaxed">
            Schedule a studio session in Paris or a virtual call to explore how Blaze Production and Kolasi can elevate your project.
          </p>
          <Link href="/quote" className="inline-flex items-center space-x-4 px-14 py-4 border border-white/30 rounded-full text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all group">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-black">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>Book a Discovery Call</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
