'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import { submitQuoteForm } from '@/lib/actions';

export default function QuoteClient() {
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
    const result = await submitQuoteForm(formData);
    if (result.success) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Something went wrong.');
    }
  };

  return (
    <div ref={containerRef} className="pt-32 pb-24 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20 reveal-up">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">Tailored Production &amp; Experiences</p>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 italic">Request a Bespoke Quote</h1>
          <p className="text-white/50 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-relaxed">
            Share the atmosphere, scale and story you want to tell. We coordinate cinematic films, curated events, and live performances for unforgettable moments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-neutral-900/30 p-8 md:p-12 rounded-[2.5rem] border border-white/5 reveal-up">
          {/* Left info column */}
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-serif mb-6">What we orchestrate</h3>
              <ul className="space-y-4 text-sm text-white/60">
                <li className="flex items-start"><span className="mr-3 mt-1 w-1 h-1 bg-white rounded-full flex-shrink-0" /> Wedding &amp; commercial film direction with cinematic crews</li>
                <li className="flex items-start"><span className="mr-3 mt-1 w-1 h-1 bg-white rounded-full flex-shrink-0" /> Event design, production, and artist booking through Kolasi</li>
                <li className="flex items-start"><span className="mr-3 mt-1 w-1 h-1 bg-white rounded-full flex-shrink-0" /> DJ performances, live acts, and bespoke audio-visual setups</li>
                <li className="flex items-start"><span className="mr-3 mt-1 w-1 h-1 bg-white rounded-full flex-shrink-0" /> Creative consulting, mood boards, and run-of-show management</li>
                <li className="flex items-start"><span className="mr-3 mt-1 w-1 h-1 bg-white rounded-full flex-shrink-0" /> Destination planning and international coordination</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10 text-[10px] uppercase tracking-widest text-white/30">Lookbook coming soon</div>
              <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10 text-[10px] uppercase tracking-widest text-white/30">Mood board coming soon</div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Prefer a direct line?</p>
              <a href="mailto:contact@samuellgoldfinch.com" className="text-sm font-serif italic hover:text-white/70 transition-colors">contact@samuellgoldfinch.com</a>
              <br />
              <a href="tel:+33605883966" className="text-sm font-serif italic hover:text-white/70 transition-colors">+33 6 05 88 39 66</a>
            </div>
          </div>

          {/* Form column */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Name</label>
                <input type="text" name="name" required placeholder="Full name" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Email</label>
                <input type="email" name="email" required placeholder="you@example.com" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Phone / WhatsApp</label>
                <input type="tel" name="phone" placeholder="+33 6 00 00 00 00" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Service focus</label>
                <select name="service" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all">
                  <option value="wedding-film">Wedding film</option>
                  <option value="editorial-commercial">Editorial / Commercial</option>
                  <option value="event-production">Event Production</option>
                  <option value="dj-performance">DJ Performance</option>
                  <option value="hybrid-package">Hybrid Package</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Date / Timeframe</label>
                <input type="text" name="eventDate" placeholder="Ex: 14 September 2026" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Guests / Audience</label>
                <input type="number" name="guestCount" min="1" placeholder="Approx. count" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40">Budget range</label>
              <input type="text" name="budget" placeholder="EUR / USD (optional)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40">Creative direction &amp; logistics</label>
              <textarea name="details" rows={5} placeholder="Venue, mood, technical needs, schedule..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40 outline-none transition-all resize-none" />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send Request'}
            </button>

            {status === 'success' && (
              <p className="text-green-400 text-[10px] uppercase tracking-widest text-center">Thank you ~ we will reply within 48 hours.</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-[10px] uppercase tracking-widest text-center">{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
