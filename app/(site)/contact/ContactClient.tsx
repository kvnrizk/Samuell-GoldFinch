'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import { submitContactForm } from '@/lib/actions';
import { trackEvent } from '@/lib/analytics';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';

export default function ContactClient({ locale = 'en' }: { locale?: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const t = getDictionary(locale).contact;

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
      trackEvent('contact_form_submit', { project_type: formData.get('projectType') as string });
      form.reset();
    } else {
      setStatus('error');
      setErrorMsg(result.error || t.fallbackError);
    }
  };

  return (
    <div ref={containerRef} className="pt-28 pb-16 md:pt-40 md:pb-32 min-h-screen text-[0.95rem] md:text-base" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-32 reveal-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-8 italic leading-tight">
            {t.title}
          </h1>
          <p className="ui-body-small md:ui-body max-w-2xl mx-auto font-light" style={{ color: 'var(--text-dim)' }}>
            {t.intro}
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid lg:grid-cols-12 gap-16 items-stretch reveal-up">
          {/* Form */}
          <div data-halo className="lg:col-span-7 p-8 md:p-14 border rounded-[2.5rem] backdrop-blur-sm shadow-2xl" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-card) 60%, transparent)' }}>
            <h2 className="text-2xl md:text-3xl font-serif mb-12">{t.formTitle}</h2>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-[0.78rem] font-medium ml-1" style={{ color: 'var(--text-mute)' }}>{t.name}</label>
                <input id="contact-name" type="text" name="name" required placeholder={t.namePlaceholder} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-[0.95rem]" />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-[0.78rem] font-medium ml-1" style={{ color: 'var(--text-mute)' }}>{t.email}</label>
                <input id="contact-email" type="email" name="email" required placeholder={t.emailPlaceholder} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-[0.95rem]" />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-project-type" className="text-[0.78rem] font-medium ml-1" style={{ color: 'var(--text-mute)' }}>{t.projectType}</label>
                <select id="contact-project-type" name="projectType" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-[0.95rem] appearance-none text-white/60">
                  <option>Wedding Film</option>
                  <option>Editorial / Brand</option>
                  <option>DJ Booking / Live Performance</option>
                  <option>Event Curation</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-details" className="text-[0.78rem] font-medium ml-1" style={{ color: 'var(--text-mute)' }}>{t.details}</label>
                <textarea id="contact-details" name="details" placeholder={t.detailsPlaceholder} rows={5} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-white/30 transition-all text-[0.95rem] resize-none" />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto px-12 py-4 border border-white/20 rounded-full font-semibold text-[0.95rem] hover:bg-white hover:text-black transition-all disabled:opacity-50"
              >
                {status === 'sending' ? t.sending : t.send}
              </button>

              {status === 'success' && (
                <p className="text-green-400 text-sm" aria-live="polite">{t.success}</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm" aria-live="polite">{errorMsg || t.fallbackError}</p>
              )}
            </form>
          </div>

          {/* Sidebar — single cohesive card */}
          <div className="lg:col-span-5 reveal-up flex flex-col">
            <div data-halo className="border rounded-[2.5rem] overflow-hidden flex-1 flex flex-col" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-card) 60%, transparent)' }}>

              {/* {t.direct} */}
              <div className="p-10 md:p-12">
                <p className="ui-kicker font-medium mb-8" style={{ color: 'var(--text-mute)' }}>{t.direct}</p>
                <div className="space-y-5">
                  <a href="mailto:contact@samuellgoldfinch.com" className="group flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40 group-hover:opacity-100 transition-opacity">
                        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: 'var(--text-dim)' }}>contact@samuellgoldfinch.com</p>
                      <p className="ui-caption mt-0.5" style={{ color: 'var(--text-mute)' }}>Email</p>
                    </div>
                  </a>
                  <a href="tel:+33605883966" className="group flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40 group-hover:opacity-100 transition-opacity">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: 'var(--text-dim)' }}>+33 6 05 88 39 66</p>
                      <p className="ui-caption mt-0.5" style={{ color: 'var(--text-mute)' }}>{t.phone}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-10 md:mx-12 h-[1px]" style={{ backgroundColor: 'var(--border)' }} />

              {/* Availability */}
              <div className="p-10 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#4ade80] animate-ping opacity-40" />
                  </div>
                  <p className="ui-kicker font-medium" style={{ color: '#4ade80' }}>{t.available}</p>
                </div>
                <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--text-dim)' }}>
                  {t.availableText}
                </p>
              </div>

              {/* Divider */}
              <div className="mx-10 md:mx-12 h-[1px]" style={{ backgroundColor: 'var(--border)' }} />

              {/* Social */}
              <div className="p-10 md:p-12">
                <p className="ui-kicker font-medium mb-6" style={{ color: 'var(--text-mute)' }}>{t.follow}</p>
                <div className="flex flex-col gap-4">
                  {[
                    { handle: '@samuellgoldfinch', url: 'https://instagram.com/samuellgoldfinch', label: 'Personal', accent: 'var(--text)' },
                    { handle: '@kolasi.paris', url: 'https://instagram.com/kolasi.paris', label: 'Kolasi Agency', accent: '#a78bfa' },
                    { handle: '@blazeprd', url: 'https://instagram.com/blazeprd', label: 'Blaze Production', accent: '#c8a96e' },
                  ].map((ig, i) => (
                    <a key={i} href={ig.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                        style={{ borderColor: 'var(--border)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = ig.accent; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity duration-300" style={{ color: ig.accent }}>
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: 'var(--text-dim)' }}>{ig.handle}</p>
                        <p className="ui-caption mt-0.5" style={{ color: 'var(--text-mute)' }}>{ig.label}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Spacer to push footer down */}
              <div className="flex-1" />

              {/* Response Promise — footer */}
              <div className="p-10 md:p-12 border-t mt-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-card) 40%, transparent)' }}>
                <p className="text-center text-sm leading-[1.9] italic font-light" style={{ color: 'var(--text-dim)' }}>
                  &ldquo;{t.promise}&rdquo;
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Meeting Section */}
        <section className="mt-24 md:mt-48 pt-16 md:pt-32 border-t text-center reveal-up" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-2xl md:text-4xl font-serif mb-10 italic">{t.meetingTitle}</h2>
          <p className="ui-body-small md:ui-body mb-12 max-w-2xl mx-auto font-light" style={{ color: 'var(--text-dim)' }}>
            {t.meetingText}
          </p>
          <Link href={localizedPath('/quote', locale)} className="inline-flex items-center space-x-4 px-14 py-4 border border-white/30 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all group">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-black">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{t.bookCall}</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
