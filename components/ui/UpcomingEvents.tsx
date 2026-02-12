'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';

interface ArtistRef {
  name?: string;
  slug?: string;
}

interface UpcomingEvent {
  title: string;
  slug?: string;
  venue?: string;
  date?: string;
  doorsTime?: string;
  endTime?: string;
  ticketUrl?: string;
  ticketPrice?: string;
  eventType?: string;
  artists?: ArtistRef[];
}

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

/* ── Static fallback upcoming events ── */
const staticUpcoming: UpcomingEvent[] = [
  {
    title: 'Le Speakeasy — Vol. 14',
    slug: 'le-speakeasy',
    venue: 'Le Speakeasy, Paris',
    date: '2026-03-07',
    doorsTime: '23:00',
    endTime: '06:00',
    ticketPrice: '15€ advance / 20€ door',
    eventType: 'club',
    artists: [{ name: 'Kate Zubok', slug: 'kate-zubok' }, { name: 'DJ Marco', slug: 'dj-marco' }],
  },
  {
    title: 'Kolasi x Warehouse',
    slug: 'kolasi-nights',
    venue: 'La Machine du Moulin Rouge, Paris',
    date: '2026-03-21',
    doorsTime: '23:30',
    endTime: '07:00',
    ticketPrice: '18€',
    eventType: 'club',
    artists: [{ name: 'Samir K', slug: 'samir-k' }, { name: 'Naya Sound', slug: 'naya-sound' }, { name: 'Lina M', slug: 'lina-m' }],
  },
  {
    title: '2nd Sun — Spring Edition',
    slug: '2nd-sun',
    venue: 'Rooftop Venue, Paris',
    date: '2026-04-12',
    doorsTime: '16:00',
    endTime: '00:00',
    ticketPrice: 'Free before 18h / 12€ after',
    eventType: 'rooftop',
    artists: [{ name: 'Lina M', slug: 'lina-m' }],
  },
];

function formatEventDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate().toString().padStart(2, '0'),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    };
  } catch {
    return null;
  }
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const items = events.length > 0 ? events : staticUpcoming;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.upcoming-reveal').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out',
      });
    });
  }, { scope: sectionRef });

  if (items.length === 0) {
    return (
      <section ref={sectionRef} className="py-24 md:py-32 px-6" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif italic mb-6">Upcoming Events</h2>
          <p className="text-sm font-light" style={{ color: 'var(--text-mute)' }}>
            No upcoming events right now. Follow us on Instagram for announcements.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 upcoming-reveal">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] mb-6 border"
            style={{
              borderColor: 'color-mix(in srgb, #c8a96e 40%, transparent)',
              color: '#c8a96e',
            }}
          >
            Upcoming Events
          </span>
          <h2 className="text-3xl md:text-5xl font-serif italic">What&apos;s Next</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[27px] md:left-[31px] top-0 bottom-0 w-px hidden sm:block"
            style={{ backgroundColor: 'var(--border)' }}
          />

          <div className="space-y-6">
            {items.map((evt, i) => {
              const dateParts = formatEventDate(evt.date);
              const artistNames = (evt.artists || []).slice(0, 4).map((a) => a.name).filter(Boolean);

              return (
                <div key={i} className="upcoming-reveal flex gap-5 sm:gap-8">
                  {/* Date badge */}
                  <div className="flex-shrink-0 w-14 md:w-16 text-center relative">
                    <div
                      className="w-14 md:w-16 rounded-2xl border p-2 relative z-10"
                      style={{
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--bg)',
                      }}
                    >
                      {dateParts ? (
                        <>
                          <p className="text-[9px] font-semibold tracking-[0.1em]" style={{ color: '#c8a96e' }}>
                            {dateParts.month}
                          </p>
                          <p className="text-xl md:text-2xl font-serif leading-none mt-0.5" style={{ color: 'var(--text)' }}>
                            {dateParts.day}
                          </p>
                          <p className="text-[9px] font-medium mt-0.5" style={{ color: 'var(--text-mute)' }}>
                            {dateParts.weekday}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs" style={{ color: 'var(--text-mute)' }}>TBA</p>
                      )}
                    </div>
                  </div>

                  {/* Event card */}
                  <div
                    className="flex-1 rounded-2xl border p-6 md:p-8 transition-colors hover:border-[#c8a96e]/20"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'color-mix(in srgb, var(--bg-card) 40%, transparent)',
                    }}
                  >
                    {/* Title + venue */}
                    <div className="mb-4">
                      {evt.slug ? (
                        <Link href={`/kolasi/${evt.slug}`} className="text-lg md:text-xl font-serif hover:text-[#c8a96e] transition-colors">
                          {evt.title}
                        </Link>
                      ) : (
                        <p className="text-lg md:text-xl font-serif">{evt.title}</p>
                      )}
                      {evt.venue && (
                        <p className="text-xs mt-1.5" style={{ color: 'var(--text-mute)' }}>{evt.venue}</p>
                      )}
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] mb-5" style={{ color: 'var(--text-dim)' }}>
                      {(evt.doorsTime || evt.endTime) && (
                        <span>
                          {evt.doorsTime && `Doors ${evt.doorsTime}`}
                          {evt.doorsTime && evt.endTime && ' → '}
                          {evt.endTime}
                        </span>
                      )}
                      {evt.ticketPrice && <span>{evt.ticketPrice}</span>}
                    </div>

                    {/* Artists */}
                    {artistNames.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {artistNames.map((name) => (
                          <span
                            key={name}
                            className="px-3 py-1 rounded-full text-[10px] font-medium border"
                            style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Ticket button */}
                    {evt.ticketUrl ? (
                      <a
                        href={evt.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.02]"
                        style={{
                          backgroundColor: 'color-mix(in srgb, #c8a96e 15%, transparent)',
                          border: '1px solid color-mix(in srgb, #c8a96e 30%, transparent)',
                          color: '#c8a96e',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                          <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
                        </svg>
                        Get Tickets
                      </a>
                    ) : (
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-medium transition-all hover:bg-white/5"
                        style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                      >
                        Request Invite
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
