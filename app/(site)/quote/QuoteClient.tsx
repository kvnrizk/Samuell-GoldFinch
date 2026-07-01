'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';
import { useRouter } from 'next/navigation';
import { submitQuoteForm } from '@/lib/actions';
import { trackEvent } from '@/lib/analytics';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';
import { getLocalizedServiceOptions, initialForm, stepLabels, tx, type FormState } from './quote-content';
import { InputField, ProgressBar, SelectField, TextareaField } from './quote-fields';

/* ── Types ── */
export default function QuoteClient({ locale = 'en' }: { locale?: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(-1); // -1 = client type selector
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const t = getDictionary(locale).quote;
  const localizedServiceOptions = getLocalizedServiceOptions(locale);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.from('.reveal-up', {
      y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
    });
  }, { scope: containerRef });

  const animateStep = useCallback((direction: 'forward' | 'back') => {
    if (prefersReducedMotion() || !stepRef.current) return;
    const els = stepRef.current.querySelectorAll('.step-field');
    gsap.fromTo(els,
      { y: direction === 'forward' ? 30 : -30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out' },
    );
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => s + 1);
    setTimeout(() => animateStep('forward'), 50);
  }, [animateStep]);

  const goBack = useCallback(() => {
    setStep((s) => s - 1);
    setTimeout(() => animateStep('back'), 50);
  }, [animateStep]);

  /* Build the details string from service-specific fields */
  const buildDetails = useCallback(() => {
    const parts: string[] = [];
    switch (form.service) {
      case 'wedding-film':
        if (form.weddingDate) parts.push(`Wedding date: ${form.weddingDate}`);
        if (form.weddingVenue) parts.push(`Venue: ${form.weddingVenue}`);
        if (form.weddingHours) parts.push(`Hours of coverage: ${form.weddingHours}`);
        if (form.weddingStyle) parts.push(`Style: ${form.weddingStyle}`);
        break;
      case 'editorial-commercial':
        if (form.editorialBrand) parts.push(`Brand: ${form.editorialBrand}`);
        if (form.editorialDeliverables) parts.push(`Deliverables: ${form.editorialDeliverables}`);
        if (form.editorialUsage) parts.push(`Usage rights: ${form.editorialUsage}`);
        break;
      case 'dj-performance':
        if (form.djEventType) parts.push(`Event type: ${form.djEventType}`);
        if (form.djHours) parts.push(`Hours: ${form.djHours}`);
        if (form.djGenre) parts.push(`Genre: ${form.djGenre}`);
        if (form.djEquipment) parts.push(`Equipment: ${form.djEquipment}`);
        break;
      case 'event-production':
        if (form.eventScale) parts.push(`Scale: ${form.eventScale}`);
        if (form.eventServices.length) parts.push(`${tx(locale, 'Services needed', 'Services souhaites')}: ${form.eventServices.join(', ')}`);
        if (form.eventVenue) parts.push(`Venue: ${form.eventVenue}`);
        break;
      case 'hybrid-package':
        parts.push('Hybrid package requested');
        break;
    }
    if (form.details) parts.push(`\nAdditional notes: ${form.details}`);
    return parts.join('\n');
  }, [form, locale]);

  const handleSubmit = async () => {
    setStatus('sending');
    const formData = new FormData();
    formData.set('_hp', '');
    formData.set('name', form.name);
    formData.set('email', form.email);
    formData.set('phone', form.phone);
    formData.set('service', form.service);
    formData.set('eventDate', form.eventDate);
    formData.set('guestCount', form.guestCount);
    formData.set('budget', form.budget);
    formData.set('details', buildDetails());

    const result = await submitQuoteForm(formData);
    if (result.success) {
      setStatus('success');
      trackEvent('quote_form_submit', { service: form.service });
      setStep(4); // success step
      setTimeout(() => animateStep('forward'), 50);
    } else {
      setStatus('error');
      setErrorMsg(result.error || (locale === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'));
    }
  };

  /* Venue redirect */
  if (form.clientType === 'venue') {
    router.push(localizedPath('/venues', locale));
    return null;
  }

  /* ── Step -1: Client type selector ── */
  if (step === -1) {
    return (
      <div ref={containerRef} className="pt-32 pb-24 min-h-screen text-[0.95rem] md:text-base" style={{ backgroundColor: 'var(--surface-page)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="reveal-up">
            <p className="text-xs font-medium mb-4" style={{ color: 'var(--text-muted)' }}>{t.first}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-8 italic">{t.startTitle}</h1>
            <p className="ui-body-small md:ui-body max-w-lg mx-auto font-light mb-16" style={{ color: 'var(--text-secondary)' }}>
              {t.startText}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 reveal-up">
            <button
              data-halo
              onClick={() => { update('clientType', 'personal'); setStep(0); setTimeout(() => animateStep('forward'), 50); }}
              className="p-10 border rounded-[2rem] transition-all text-center group sg-hover-surface"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'color-mix(in srgb, var(--surface-card) 60%, transparent)' }}
            >
              <p className="text-3xl mb-4">🎬</p>
              <h3 className="text-lg font-serif mb-2">{t.personal}</h3>
              <p className="text-xs font-light" style={{ color: 'var(--text-secondary)' }}>{t.personalDesc}</p>
            </button>
            <button
              data-halo
              data-halo-color="var(--text-accent)"
              onClick={() => update('clientType', 'venue')}
              className="p-10 border rounded-[2rem] transition-all text-center group sg-hover-surface"
              style={{ borderColor: 'var(--border-accent)', backgroundColor: 'var(--brand-gold-soft)' }}
            >
              <p className="text-3xl mb-4">🍸</p>
              <h3 className="text-lg font-serif mb-2" style={{ color: 'var(--text-accent)' }}>{t.venue}</h3>
              <p className="text-xs font-light" style={{ color: 'var(--text-secondary)' }}>{t.venueDesc}</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 0: Service selector ── */
  const renderStep0 = () => (
    <div ref={stepRef}>
      <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{t.whatNeed}</h2>
      <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
        {t.serviceHelp}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {localizedServiceOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { update('service', opt.value); goNext(); }}
            className="step-field p-6 border rounded-2xl text-left transition-all group sg-hover-surface"
            style={{
              borderColor: form.service === opt.value ? 'var(--text-accent)' : 'var(--border-subtle)',
              backgroundColor: form.service === opt.value ? 'color-mix(in srgb, var(--text-accent) 8%, transparent)' : 'color-mix(in srgb, var(--surface-card) 60%, transparent)',
            }}
          >
            <span className="text-2xl block mb-3">{opt.icon}</span>
            <h3 className="text-sm font-semibold mb-1 transition-colors sg-group-hover-accent">{opt.label}</h3>
            <p className="text-[11px] font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Step 1: Service-specific questions ── */
  const renderStep1 = () => {
    switch (form.service) {
      case 'wedding-film':
        return (
          <div ref={stepRef}>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{tx(locale, 'Tell us about the wedding', 'Parlez-nous du mariage')}</h2>
            <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
              {tx(locale, 'These details help us plan the perfect crew and equipment.', 'Ces details nous aident a prevoir la bonne equipe et le bon materiel.')}
            </p>
            <div className="space-y-5">
              <div className="step-field">
                <InputField label={tx(locale, 'Wedding date', 'Date du mariage')} name="weddingDate" placeholder={tx(locale, 'e.g. 14 September 2026', 'ex. 14 septembre 2026')} value={form.weddingDate} onChange={(v) => update('weddingDate', v)} />
              </div>
              <div className="step-field">
                <InputField label={tx(locale, 'Venue / Location', 'Lieu / adresse')} name="weddingVenue" placeholder="e.g. Château de Versailles, Paris" value={form.weddingVenue} onChange={(v) => update('weddingVenue', v)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="step-field">
                  <SelectField label={tx(locale, 'Hours of coverage', 'Heures de couverture')} name="weddingHours" value={form.weddingHours} onChange={(v) => update('weddingHours', v)} options={[
                    { label: '4-6 hours', value: '4-6' },
                    { label: '8-10 hours', value: '8-10' },
                    { label: 'Full day (12+)', value: '12+' },
                    { label: 'Multi-day', value: 'multi-day' },
                  ]} />
                </div>
                <div className="step-field">
                  <SelectField label={tx(locale, 'Style preference', 'Style souhaite')} name="weddingStyle" value={form.weddingStyle} onChange={(v) => update('weddingStyle', v)} options={[
                    { label: 'Cinematic', value: 'cinematic' },
                    { label: 'Documentary', value: 'documentary' },
                    { label: 'Hybrid', value: 'hybrid' },
                    { label: 'Not sure yet', value: 'undecided' },
                  ]} />
                </div>
              </div>
              <div className="step-field">
                <TextareaField label={tx(locale, 'Anything else we should know?', 'Autre chose a savoir ?')} name="details" placeholder={tx(locale, 'Special moments to capture, cultural traditions, logistics...', 'Moments importants, traditions, logistique...')} value={form.details} onChange={(v) => update('details', v)} rows={3} />
              </div>
            </div>
          </div>
        );

      case 'editorial-commercial':
        return (
          <div ref={stepRef}>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{tx(locale, 'Tell us about the project', 'Parlez-nous du projet')}</h2>
            <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
              {tx(locale, 'Understanding your brand and deliverables helps us scope the project accurately.', 'Comprendre votre marque et les livrables nous aide a cadrer le projet avec precision.')}
            </p>
            <div className="space-y-5">
              <div className="step-field">
                <InputField label={tx(locale, 'Brand / Company', 'Marque / entreprise')} name="editorialBrand" placeholder="e.g. Dior, your startup name" value={form.editorialBrand} onChange={(v) => update('editorialBrand', v)} />
              </div>
              <div className="step-field">
                <SelectField label={tx(locale, 'Deliverables', 'Livrables')} name="editorialDeliverables" value={form.editorialDeliverables} onChange={(v) => update('editorialDeliverables', v)} options={[
                  { label: 'Brand film (1-3 min)', value: 'brand-film' },
                  { label: 'Social content package', value: 'social-content' },
                  { label: 'Product video', value: 'product' },
                  { label: 'Fashion / Editorial', value: 'fashion' },
                  { label: 'Full campaign', value: 'campaign' },
                ]} />
              </div>
              <div className="step-field">
                <SelectField label={tx(locale, 'Usage rights', 'Droits d usage')} name="editorialUsage" value={form.editorialUsage} onChange={(v) => update('editorialUsage', v)} options={[
                  { label: 'Social media only', value: 'social' },
                  { label: 'Web + social', value: 'web-social' },
                  { label: 'Full commercial (TV, ads)', value: 'full-commercial' },
                  { label: 'Not sure yet', value: 'undecided' },
                ]} />
              </div>
              <div className="step-field">
                <TextareaField label={tx(locale, 'Creative brief or notes', 'Brief creatif ou notes')} name="details" placeholder="Mood, references, key shots, locations..." value={form.details} onChange={(v) => update('details', v)} rows={3} />
              </div>
            </div>
          </div>
        );

      case 'dj-performance':
        return (
          <div ref={stepRef}>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{tx(locale, 'Tell us about the event', 'Parlez-nous de l evenement')}</h2>
            <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
              {tx(locale, 'Help us match you with the perfect artist from the Kolasi roster.', 'Aidez-nous a vous proposer le bon artiste du roster Kolasi.')}
            </p>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="step-field">
                  <SelectField label={tx(locale, 'Event type', 'Type d evenement')} name="djEventType" value={form.djEventType} onChange={(v) => update('djEventType', v)} options={[
                    { label: 'Wedding', value: 'wedding' },
                    { label: 'Private party', value: 'private' },
                    { label: 'Corporate event', value: 'corporate' },
                    { label: 'Festival', value: 'festival' },
                    { label: 'Club night', value: 'club' },
                  ]} />
                </div>
                <div className="step-field">
                  <SelectField label={tx(locale, 'Set duration', 'Duree du set')} name="djHours" value={form.djHours} onChange={(v) => update('djHours', v)} options={[
                    { label: '2-3 hours', value: '2-3' },
                    { label: '4-5 hours', value: '4-5' },
                    { label: '6+ hours', value: '6+' },
                    { label: 'Full night', value: 'full-night' },
                  ]} />
                </div>
              </div>
              <div className="step-field">
                <SelectField label={tx(locale, 'Genre preference', 'Genre souhaite')} name="djGenre" value={form.djGenre} onChange={(v) => update('djGenre', v)} options={[
                  { label: 'Deep House / Melodic', value: 'deep-melodic' },
                  { label: 'Afro House / Organic', value: 'afro-organic' },
                  { label: 'Techno', value: 'techno' },
                  { label: 'Commercial / Top 40', value: 'commercial' },
                  { label: 'Hip-Hop / R&B', value: 'hiphop' },
                  { label: 'Open / Mixed', value: 'mixed' },
                ]} />
              </div>
              <div className="step-field">
                <SelectField label={tx(locale, 'Equipment needed', 'Materiel necessaire')} name="djEquipment" value={form.djEquipment} onChange={(v) => update('djEquipment', v)} options={[
                  { label: 'DJ brings own equipment', value: 'artist-provided' },
                  { label: 'Venue provides sound', value: 'venue-provided' },
                  { label: 'Need full sound + lights', value: 'full-setup' },
                  { label: 'Not sure', value: 'undecided' },
                ]} />
              </div>
              <div className="step-field">
                <TextareaField label={tx(locale, 'Any specific requests?', 'Demandes specifiques ?')} name="details" placeholder="Specific DJs, vibe, crowd profile..." value={form.details} onChange={(v) => update('details', v)} rows={3} />
              </div>
            </div>
          </div>
        );

      case 'event-production':
        return (
          <div ref={stepRef}>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{tx(locale, 'Tell us about the event', 'Parlez-nous de l evenement')}</h2>
            <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
              {tx(locale, 'The more detail you share, the more accurate our proposal.', 'Plus vous partagez de details, plus notre proposition sera precise.')}
            </p>
            <div className="space-y-5">
              <div className="step-field">
                <SelectField label={tx(locale, 'Event scale', 'Taille de l evenement')} name="eventScale" value={form.eventScale} onChange={(v) => update('eventScale', v)} options={[
                  { label: 'Intimate (up to 50)', value: 'intimate' },
                  { label: 'Medium (50-200)', value: 'medium' },
                  { label: 'Large (200-500)', value: 'large' },
                  { label: 'Festival (500+)', value: 'festival' },
                ]} />
              </div>
              <div className="step-field space-y-2">
                <label className="text-xs font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{tx(locale, 'Services needed', 'Services souhaites')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Sound & lights', value: 'sound-lights' },
                    { label: 'DJ / Live acts', value: 'dj-live' },
                    { label: 'Stage design', value: 'stage' },
                    { label: 'Content creation', value: 'content' },
                    { label: 'Art direction', value: 'art-direction' },
                    { label: 'Guest management', value: 'guest-mgmt' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const next = form.eventServices.includes(opt.value)
                          ? form.eventServices.filter((s) => s !== opt.value)
                          : [...form.eventServices, opt.value];
                        update('eventServices', next);
                      }}
                      className="px-4 py-2.5 rounded-xl border text-xs font-medium text-left transition-all"
                      style={{
                        borderColor: form.eventServices.includes(opt.value) ? 'var(--text-accent)' : 'var(--border-strong)',
                        color: form.eventServices.includes(opt.value) ? 'var(--text-accent)' : 'var(--text-secondary)',
                        backgroundColor: form.eventServices.includes(opt.value) ? 'color-mix(in srgb, var(--text-accent) 10%, transparent)' : 'transparent',
                      }}
                    >
                      {form.eventServices.includes(opt.value) ? '✓ ' : ''}{opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="step-field">
                <InputField label={tx(locale, 'Venue or location', 'Lieu ou adresse')} name="eventVenue" placeholder="e.g. Rooftop in Paris 8e" value={form.eventVenue} onChange={(v) => update('eventVenue', v)} />
              </div>
              <div className="step-field">
                <TextareaField label={tx(locale, 'Vision and logistics', 'Vision et logistique')} name="details" placeholder="Theme, mood, run of show..." value={form.details} onChange={(v) => update('details', v)} rows={3} />
              </div>
            </div>
          </div>
        );

      case 'hybrid-package':
        return (
          <div ref={stepRef}>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{tx(locale, 'Tell us your vision', 'Parlez-nous de votre vision')}</h2>
            <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
              {tx(locale, 'A hybrid package combines multiple services. Describe what you have in mind and we will craft a bespoke proposal.', 'Un pack hybride combine plusieurs services. Decrivez votre idee et nous preparerons une proposition sur mesure.')}
            </p>
            <div className="space-y-5">
              <div className="step-field">
                <TextareaField
                  label={tx(locale, 'Describe your project', 'Decrivez votre projet')}
                  name="details"
                  placeholder="e.g. We need a DJ and a videographer for our wedding in the south of France. We also want a recap video for social media..."
                  value={form.details}
                  onChange={(v) => update('details', v)}
                  rows={6}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ── Step 2: Budget + Timeline ── */
  const renderStep2 = () => (
    <div ref={stepRef}>
      <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{t.budgetTitle}</h2>
      <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
        {t.budgetHelp}
      </p>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="step-field">
            <InputField label={tx(locale, 'Event date / Timeframe', 'Date / periode')} name="eventDate" placeholder="e.g. September 2026" value={form.eventDate} onChange={(v) => update('eventDate', v)} />
          </div>
          <div className="step-field">
            <InputField label={tx(locale, 'Expected guests', 'Nombre d invites')} name="guestCount" type="number" placeholder="Approx. count" value={form.guestCount} onChange={(v) => update('guestCount', v)} />
          </div>
        </div>
        <div className="step-field">
          <SelectField label={tx(locale, 'Budget range', 'Budget')} name="budget" value={form.budget} onChange={(v) => update('budget', v)} options={[
            { label: 'Under €2,000', value: 'under-2k' },
            { label: '€2,000 — €5,000', value: '2k-5k' },
            { label: '€5,000 — €10,000', value: '5k-10k' },
            { label: '€10,000 — €25,000', value: '10k-25k' },
            { label: '€25,000+', value: '25k+' },
            { label: 'Prefer not to say', value: 'undisclosed' },
          ]} />
        </div>
      </div>
    </div>
  );

  /* ── Step 3: Contact details ── */
  const renderStep3 = () => (
    <div ref={stepRef}>
      <h2 className="text-2xl md:text-3xl font-serif italic mb-3 step-field">{t.almost}</h2>
      <p className="text-sm font-light mb-10 step-field" style={{ color: 'var(--text-secondary)' }}>
        {t.contactHelp}
      </p>
      <div className="space-y-5">
        <div className="step-field">
          <InputField label={tx(locale, 'Full name', 'Nom complet')} name="name" placeholder="Your name" value={form.name} onChange={(v) => update('name', v)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="step-field">
            <InputField label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={(v) => update('email', v)} required />
          </div>
          <div className="step-field">
            <InputField label={tx(locale, 'Phone / WhatsApp', 'Telephone / WhatsApp')} name="phone" type="tel" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={(v) => update('phone', v)} />
          </div>
        </div>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-4 step-field">{errorMsg}</p>
      )}
    </div>
  );

  /* ── Step 4: Success ── */
  const renderSuccess = () => (
    <div ref={stepRef} className="text-center py-12">
      <div className="step-field mb-8">
        <div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
          style={{ backgroundColor: 'color-mix(in srgb, var(--text-accent) 15%, transparent)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-accent)" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-4xl font-serif italic mb-4">{t.sent}</h2>
        <p className="text-sm font-light max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t.successText.replace('{name}', form.name.split(' ')[0] || '')}
        </p>
      </div>

      <div className="step-field max-w-sm mx-auto mb-12">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] mb-6" style={{ color: 'var(--text-muted)' }}>
          {t.nextTitle}
        </h3>
        <div className="space-y-4 text-left">
          {[
            { num: '01', text: t.next[0] },
            { num: '02', text: t.next[1] },
            { num: '03', text: t.next[2] },
          ].map((item) => (
            <div key={item.num} className="flex items-start gap-4 p-4 rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-xs font-mono shrink-0 mt-0.5" style={{ color: 'var(--text-accent)' }}>{item.num}</span>
              <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="step-field flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={localizedPath('/', locale)}
          className="px-10 py-3.5 border rounded-full text-sm font-semibold transition-all sg-action-secondary"
        >
          {t.backHome}
        </Link>
        <Link
          href="/journal"
          className="px-10 py-3.5 text-sm font-light transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t.journal}
        </Link>
      </div>
    </div>
  );

  /* ── Determine which step to render ── */
  const steps = [renderStep0, renderStep1, renderStep2, renderStep3, renderSuccess];
  const totalSteps = 5;
  const canGoBack = step > 0 && step < 4;
  const canGoNext = step < 3;
  const isLastStep = step === 3;

  const isStepValid = () => {
    switch (step) {
      case 0: return !!form.service;
      case 1: return true; // service-specific fields are optional
      case 2: return true; // budget/timeline optional
      case 3: return !!form.name && !!form.email;
      default: return true;
    }
  };

  return (
    <div ref={containerRef} className="pt-32 pb-24 min-h-screen text-[0.95rem] md:text-base" style={{ backgroundColor: 'var(--surface-page)' }}>
      <div className="max-w-2xl mx-auto px-6">
        {step < 4 && (
          <div className="reveal-up">
            <ProgressBar currentStep={step} totalSteps={totalSteps - 1} labels={locale === 'fr' ? ['Service', 'Details', 'Calendrier', 'Contact', 'Termine'] : stepLabels} />
          </div>
        )}

        <div className="reveal-up">
          {steps[step]?.()}
        </div>

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-12 reveal-up">
            <div>
              {canGoBack && (
                <button
                  onClick={goBack}
                  className="px-6 py-3 text-sm font-medium transition-colors sg-hover-accent"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-2 -mt-0.5">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  {t.back}
                </button>
              )}
              {step === 0 && (
                <button
                  onClick={() => { setStep(-1); setForm(initialForm); }}
                  className="px-6 py-3 text-sm font-medium transition-colors sg-hover-accent"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-2 -mt-0.5">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  {t.back}
                </button>
              )}
            </div>
            <div>
              {canGoNext && step > 0 && (
                <button
                  onClick={goNext}
                  disabled={!isStepValid()}
                  className="px-8 py-3.5 border rounded-full text-sm font-semibold transition-all disabled:opacity-30"
                  style={{ borderColor: 'var(--border-strong)' }}
                >
                  {t.continue}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline ml-2 -mt-0.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              {isLastStep && (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || status === 'sending'}
                  className="px-10 py-3.5 border rounded-full text-sm font-semibold transition-all disabled:opacity-50 sg-action-secondary"
                >
                  {status === 'sending' ? t.sending : t.send}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
