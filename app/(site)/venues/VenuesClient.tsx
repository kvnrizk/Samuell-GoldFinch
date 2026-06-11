'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { SectionKicker } from '@/components/ui/SectionKicker';
import { GlassCard } from '@/components/ui/GlassCard';
import { PricingCard } from '@/components/ui/PricingCard';
import { CaseStudyCard } from '@/components/ui/CaseStudyCard';
import { ProcessTimeline } from '@/components/ui/ProcessTimeline';
import { AccordionFAQ } from '@/components/ui/AccordionFAQ';
import { TrustStrip } from '@/components/ui/TrustStrip';
import { VenueForm } from '@/components/ui/VenueForm';
import { StickyMobileCTA } from '@/components/ui/StickyMobileCTA';
import { trackEvent } from '@/lib/analytics';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { getDictionary, type Locale } from '@/lib/i18n';

interface Deliverable {
  item?: string;
}

interface VenuePackage {
  id: string;
  name: string;
  tagline?: string;
  deliverables?: Deliverable[];
  priceRange?: string;
  featured?: boolean;
}

interface CaseStudy {
  id: string;
  venueName: string;
  slug: string;
  coverImage?: { url?: string };
  role?: string;
  frequency?: string;
  outcome?: string;
}

interface FAQItem {
  question: string;
  answer: string | Record<string, unknown>;
}

interface Artist {
  id: string;
  name?: string;
  slug?: string;
  photo?: { url?: string };
  genre?: string;
  rosterCategory?: string;
}

interface VenuesClientProps {
  packages: VenuePackage[];
  caseStudies: CaseStudy[];
  faq: FAQItem[];
  artists: Artist[];
  calendlyUrl: string;
  whatsappNumber: string;
  locale?: Locale;
}

export default function VenuesClient({
  packages,
  caseStudies,
  faq,
  artists,
  calendlyUrl,
  whatsappNumber,
  locale = 'en',
}: VenuesClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getDictionary(locale).venues;

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.venue-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  const handleCallClick = () => {
    trackEvent('venue_call_click', { source: 'venues-page' });
    window.open(calendlyUrl, '_blank');
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_click', { source: 'venues-page' });
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <div ref={containerRef}>
      {/* ─── HERO ─── */}
      <section id="venue-hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <VideoPlayer
            muxPlaybackId="uar02cwjF78qfyUUvSQIMcnQyHVImiF6sJP3Izh7D01JU"
            autoPlay
            loop
            muted
            mode="hero"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, color-mix(in srgb, var(--bg) 95%, transparent) 0%, color-mix(in srgb, var(--bg) 40%, transparent) 50%, color-mix(in srgb, var(--bg) 60%, transparent) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="max-w-3xl venue-reveal">
            <SectionKicker label={t.heroKicker} />
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 leading-tight mb-6">
              {t.heroTitle}
            </h1>
            <ul className="space-y-2 mb-8">
              {t.bullets.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm md:text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] mt-2 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleCallClick}
                className="bg-[#c8a96e] text-[#09090b] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#d4b87a] active:scale-[0.98] transition-all"
              >
                {t.bookCall}
              </button>
              <a
                href="#venue-form"
                className="border border-[#c8a96e] text-[#c8a96e] font-semibold text-sm px-8 py-3.5 rounded-lg text-center hover:bg-[#c8a96e]/[0.08] transition-all"
              >
                {t.applyNow}
              </a>
            </div>

            {/* WhatsApp micro-CTA */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 ui-caption text-zinc-500 hover:text-[#c8a96e] transition-colors mb-8"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.whatsapp}: {whatsappNumber}
            </button>

            <TrustStrip locale={locale} />
          </div>
        </div>
      </section>

      {/* ─── Visual break ─── */}
      <div className="relative h-40 md:h-64 overflow-hidden">
        <Image src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364276/sg-platform/static/assets/kolasi/images/4F8A3777.jpg" alt="" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg), transparent 30%, transparent 70%, var(--bg))' }} />
      </div>

      {/* ─── PACKAGES ─── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] pointer-events-none" style={{ background: '#c8a96e' }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 venue-reveal">
            <SectionKicker label={t.packages} />
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-stone-100 mb-4">
              {t.packagesTitle}
            </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto ui-body-small md:ui-body">
                {t.packagesText}
              </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 venue-reveal">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <PricingCard
                  key={pkg.id}
                  name={pkg.name}
                  tagline={pkg.tagline}
                  deliverables={pkg.deliverables?.map((d: Deliverable | string) => typeof d === 'string' ? d : d.item || '') || []}
                  priceRange={pkg.priceRange}
                  featured={pkg.featured}
                  onCTA={handleCallClick}
                  ctaLabel={t.getStarted}
                />
              ))
            ) : (
              <>
                <PricingCard
                  name="Starter Night"
                  tagline="Test the waters with a curated weekly session"
                  deliverables={[
                    '1 DJ night per week',
                    'Artist booking & scheduling',
                    'Monthly content recap',
                    'WhatsApp support line',
                  ]}
                  priceRange="From €1,500/mo"
                  onCTA={handleCallClick}
                  ctaLabel={t.getStarted}
                />
                <PricingCard
                  name="Core Identity"
                  tagline="Build a weekly identity that attracts a loyal crowd"
                  deliverables={[
                    '2–3 nights per week',
                    'Full booking + sound rider',
                    'Social content per session',
                    'Monthly strategy call',
                    'Dedicated WhatsApp channel',
                  ]}
                  priceRange="From €3,500/mo"
                  featured
                  onCTA={handleCallClick}
                  ctaLabel={t.getStarted}
                />
                <PricingCard
                  name="Flagship"
                  tagline="Full creative direction for your venue's nightlife brand"
                  deliverables={[
                    '4+ nights per week',
                    'Headliner bookings',
                    'Video + photo content',
                    'Brand strategy & design',
                    'Weekly reporting dashboard',
                    'Priority artist access',
                  ]}
                  priceRange="From €7,500/mo"
                  onCTA={handleCallClick}
                  ctaLabel={t.getStarted}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── CASE STUDIES ─── */}
      {(caseStudies.length > 0 || true) && (
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Background image accent */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364262/sg-platform/static/assets/kolasi/images/4F8A2882.jpg" alt="" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" className="object-cover opacity-[0.06]" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg), transparent 20%, transparent 80%, var(--bg))' }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 venue-reveal">
              <SectionKicker label={t.caseStudies} />
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-stone-100 mb-4">
                {t.caseStudiesTitle}
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto ui-body-small md:ui-body">
                {t.caseStudiesText}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 venue-reveal">
              {caseStudies.length > 0 ? (
                caseStudies.map((cs) => (
                  <CaseStudyCard
                    key={cs.id}
                    venueName={cs.venueName}
                    slug={cs.slug}
                    coverImageUrl={cs.coverImage?.url}
                    role={cs.role}
                    frequency={cs.frequency}
                    outcome={cs.outcome}
                  />
                ))
              ) : (
                <>
                  <CaseStudyCard
                    venueName="Le Speakeasy"
                    slug="le-speakeasy"
                    role="Booking / DA / Content"
                    frequency="3 nights/week"
                    outcome="+45% reservation rate in 3 months"
                  />
                  <CaseStudyCard
                    venueName="Calypso Club"
                    slug="calypso-club"
                    role="Full Programming"
                    frequency="Every Saturday"
                    outcome="Sold out 12 weeks in a row"
                  />
                  <CaseStudyCard
                    venueName="Hotel Costes Bar"
                    slug="hotel-costes"
                    role="Curation / Content"
                    frequency="2 nights/week"
                    outcome="2x social engagement in 60 days"
                  />
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Visual break ─── */}
      <div className="relative h-40 md:h-64 overflow-hidden">
        <Image src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364184/sg-platform/static/assets/kolasi/artists/4F8A3682.jpg" alt="" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg), transparent 30%, transparent 70%, var(--bg))' }} />
      </div>

      {/* ─── ROSTER ─── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[100px] pointer-events-none" style={{ background: '#a78bfa' }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 venue-reveal">
            <SectionKicker label={t.roster} />
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-stone-100 mb-4">
              {t.rosterTitle}
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto ui-body-small md:ui-body">
              {t.rosterText}
            </p>
          </div>

          {artists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 venue-reveal">
              {artists.map((artist) => {
                const catLabel =
                  artist.rosterCategory === 'live-act' ? 'Live Act'
                    : artist.rosterCategory === 'hybrid' ? 'Hybrid'
                    : artist.rosterCategory === 'headliner' ? 'Headliner'
                    : 'Resident';

                const card = (
                  <>
                    {artist.photo?.url ? (
                      <Image
                        src={artist.photo.url}
                        alt={artist.name || 'Artist'}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <span className="text-4xl font-serif italic" style={{ color: 'var(--text-mute)' }}>
                          {artist.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, var(--bg) 5%, color-mix(in srgb, var(--bg) 60%, transparent) 45%, transparent)' }}
                    />
                    {/* Category badge */}
                    <span
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.12em] border"
                      style={{
                        borderColor: 'color-mix(in srgb, #c8a96e 30%, transparent)',
                        color: '#c8a96e',
                        backgroundColor: 'color-mix(in srgb, var(--bg) 70%, transparent)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {catLabel}
                    </span>
                    {/* Name + genre */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-sm font-serif font-medium" style={{ color: 'var(--text)' }}>{artist.name}</p>
                      {artist.genre && (
                        <p className="ui-caption mt-1" style={{ color: 'var(--text-mute)' }}>{artist.genre}</p>
                      )}
                    </div>
                  </>
                );

                return artist.slug ? (
                  <Link
                    key={artist.id}
                    href={`/kolasi/artists/${artist.slug}`}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border block transition-colors hover:border-[#c8a96e]/30"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {card}
                  </Link>
                ) : (
                  <div
                    key={artist.id}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {card}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 venue-reveal">
              <p className="text-zinc-600 ui-body-small">
                Roster coming soon. Book a call to discuss your programming needs.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 50%, var(--bg))' }}>
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.03] blur-[100px] pointer-events-none" style={{ background: '#c8a96e' }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionKicker label={t.process} />
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-stone-100 mb-4">
              {t.processTitle}
            </h2>
          </div>
          <ProcessTimeline locale={locale} />
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 venue-reveal">
            <SectionKicker label={t.faq} />
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-stone-100 mb-4">
              {t.faqTitle}
            </h2>
          </div>
          <div className="venue-reveal">
            <AccordionFAQ
              items={
                faq.length > 0
                  ? faq.map((item) => ({
                      question: item.question,
                      answer: typeof item.answer === 'string' ? item.answer : 'See details in our venue deck.',
                    }))
                  : [
                      {
                        question: 'What genres do you programme?',
                        answer:
                          'We cover the full spectrum — from deep house and afro beats to disco, funk, Latin, and live jazz. Every programme is tailored to your venue and crowd.',
                      },
                      {
                        question: 'Do you work outside Paris?',
                        answer:
                          'Yes. We have active partnerships across France and regularly work in London, Dubai, and Ibiza. Travel fees may apply for remote locations.',
                      },
                      {
                        question: 'How fast can you launch?',
                        answer:
                          'After the audit call, we typically deliver a programming plan within 5 business days. First night can happen 2–3 weeks after sign-off.',
                      },
                      {
                        question: 'What if we already have DJs booked?',
                        answer:
                          'No problem. We can work alongside your existing roster, upgrade the quality, or gradually transition to our curated programming.',
                      },
                      {
                        question: "What's included in content production?",
                        answer:
                          'Depending on your tier: professional photo/video at each session, social-ready edits, story highlights, and a monthly performance report.',
                      },
                    ]
              }
            />
          </div>
        </div>
      </section>

      {/* ─── Visual break ─── */}
      <div className="relative h-40 md:h-56 overflow-hidden">
        <Image src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364297/sg-platform/static/assets/kolasi/images/4F8A3801.jpg" alt="" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg), transparent 30%, transparent 70%, var(--bg))' }} />
      </div>

      {/* ─── VENUE FORM / FINAL CTA ─── */}
      <section id="venue-form" className="py-24 md:py-32 relative overflow-hidden">
        {/* Background photo accent */}
        <div className="absolute inset-0 pointer-events-none">
          <Image src="https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364247/sg-platform/static/assets/kolasi/images/4F8A2938.jpg" alt="" fill placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" className="object-cover opacity-[0.04]" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--bg) 40%, transparent 80%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: CTA copy */}
            <div className="venue-reveal">
              <SectionKicker label={t.getStarted} />
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-stone-100 mb-6">
                {t.finalTitle}
              </h2>
              <p className="text-zinc-400 ui-body-small md:ui-body mb-8 max-w-lg">
                {t.finalText}
              </p>

              <div className="space-y-4 mb-8">
                <button
                  onClick={handleCallClick}
                  className="flex items-center gap-3 text-[#c8a96e] hover:text-[#d4b87a] transition-colors text-sm font-medium"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  {t.bookDirect}
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-3 text-zinc-500 hover:text-[#c8a96e] transition-colors text-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.messageWhatsApp}
                </button>
              </div>

              <GlassCard className="!p-6">
                <p className="ui-kicker font-medium text-[#c8a96e] mb-3">
                  {t.promiseTitle}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  &ldquo;{t.promise}&rdquo;
                </p>
              </GlassCard>
            </div>

            {/* Right: Form */}
            <div className="venue-reveal">
              <GlassCard className="!p-8">
                <h3 className="font-serif text-xl font-semibold text-stone-100 mb-2">
                  {t.formTitle}
                </h3>
                <p className="ui-caption text-zinc-500 mb-8">
                  {t.formIntro}
                </p>
                <VenueForm locale={locale} />
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA calendlyUrl={calendlyUrl} whatsappNumber={whatsappNumber} locale={locale} />
    </div>
  );
}
