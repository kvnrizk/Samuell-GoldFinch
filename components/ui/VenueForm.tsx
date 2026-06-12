'use client';

import { useState } from 'react';
import { submitVenueInquiry } from '@/lib/actions';
import { trackEvent } from '@/lib/analytics';
import { getUTMParams } from '@/lib/utm';
import { getDictionary, type Locale } from '@/lib/i18n';

type Step = 1 | 2 | 3;

const venueTypes = [
  { label: 'Bar', value: 'bar' },
  { label: 'Brasserie', value: 'brasserie' },
  { label: 'Club', value: 'club' },
  { label: 'Resto-Festif', value: 'resto-festif' },
  { label: 'Hybrid', value: 'hybrid' },
];

const goals = [
  { label: 'More Tables / Reservations', value: 'more-tables' },
  { label: 'Better Crowd', value: 'better-crowd' },
  { label: 'Stronger Brand', value: 'stronger-brand' },
  { label: 'Higher Average Spend', value: 'higher-spend' },
  { label: 'Create a Signature Night', value: 'signature-night' },
];

const budgets = [
  { label: 'Under €2,000/month', value: 'under-2k' },
  { label: '€2,000–5,000/month', value: '2k-5k' },
  { label: '€5,000–10,000/month', value: '5k-10k' },
  { label: '€10,000+/month', value: '10k-plus' },
];

const timelines = [
  { label: 'As soon as possible', value: 'asap' },
  { label: 'Next month', value: 'next-month' },
  { label: 'Next season', value: 'next-season' },
];

const inputClass =
  'w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#c8a96e]/40 transition-colors bg-[color:var(--bg-card)] border border-[color:var(--border)] text-[color:var(--text)] placeholder:text-[color:var(--text-mute)]';
const labelClass = 'text-[10px] font-mono uppercase tracking-[0.15em] text-[color:var(--text-mute)] mb-1.5 block';
const selectClass =
  'w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#c8a96e]/40 transition-colors appearance-none bg-[color:var(--bg-card)] border border-[color:var(--border)] text-[color:var(--text)]';

export function VenueForm({ locale = 'en' }: { locale?: Locale }) {
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [stepError, setStepError] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const t = getDictionary(locale).venueForm;

  const toggleGoal = (value: string) => {
    setSelectedGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value],
    );
  };

  const goToStep = (nextStep: Step) => {
    setStepError('');
    setStep(nextStep);
  };

  const requireFields = (fields: string[], nextStep: Step) => {
    const form = document.querySelector<HTMLFormElement>('[data-venue-form]');
    if (!form) return goToStep(nextStep);

    const isMissing = fields.some((name) => {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      return !field?.value?.trim();
    });

    if (isMissing) {
      setStepError(t.requiredError);
      return;
    }

    goToStep(nextStep);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Append multi-select goals
    formData.delete('goal');
    selectedGoals.forEach((g) => formData.append('goal', g));

    // Append UTM params
    const utm = getUTMParams();
    if (utm.utm_source) formData.append('utm_source', utm.utm_source);
    if (utm.utm_medium) formData.append('utm_medium', utm.utm_medium);
    if (utm.utm_campaign) formData.append('utm_campaign', utm.utm_campaign);

    const result = await submitVenueInquiry(formData);

    if (result.success) {
      setStatus('success');
      trackEvent('venue_form_submit', {
        venue_type: formData.get('venueType') as string,
        budget: formData.get('monthlyBudget') as string,
      });
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#c8a96e]/10 border border-[#c8a96e]/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-[#c8a96e] text-2xl">&#10003;</span>
        </div>
        <h3 className="font-serif text-2xl mb-3" style={{ color: 'var(--text)' }}>{t.successTitle}</h3>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-mute)' }}>
          {t.successText}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-venue-form>
      {/* Honeypot */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                s === step
                  ? 'bg-[#c8a96e] text-[#09090b] font-bold'
                  : s < step
                    ? 'bg-[#c8a96e]/20 text-[#c8a96e]'
                    : 'bg-[color:var(--bg-card)] text-[color:var(--text-mute)]'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-px ${s < step ? 'bg-[#c8a96e]/40' : 'bg-white/[0.08]'}`}
              />
            )}
          </div>
        ))}
        <span className="ml-3 text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-mute)' }}>
          {t.steps[step - 1]}
        </span>
      </div>

      {/* Step 1: Venue Info */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <label htmlFor="venue-name" className={labelClass}>{t.venueName}</label>
            <input id="venue-name" type="text" name="venueName" required className={inputClass} placeholder={t.venueNamePlaceholder} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venue-type" className={labelClass}>{t.venueType}</label>
              <select id="venue-type" name="venueType" className={selectClass}>
                <option value="">{t.select}</option>
                {venueTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="venue-capacity" className={labelClass}>{t.capacity}</label>
              <input id="venue-capacity" type="number" name="capacity" className={inputClass} placeholder="e.g. 200" />
            </div>
          </div>
          <div>
            <label htmlFor="venue-address" className={labelClass}>{t.address}</label>
            <input id="venue-address" type="text" name="address" className={inputClass} placeholder="City or full address" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venue-website" className={labelClass}>{t.website}</label>
              <input id="venue-website" type="text" name="website" className={inputClass} placeholder="https://" />
            </div>
            <div>
              <label htmlFor="venue-instagram" className={labelClass}>{t.instagram}</label>
              <input id="venue-instagram" type="text" name="instagram" className={inputClass} placeholder="@handle" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="hasDancePocket" id="hasDancePocket" className="accent-[#c8a96e]" />
            <label htmlFor="hasDancePocket" className="text-sm" style={{ color: 'var(--text-dim)' }}>
              {t.dance}
            </label>
          </div>
          <div>
            <label htmlFor="venue-current-programming" className={labelClass}>{t.programming}</label>
            <textarea id="venue-current-programming" name="currentProgramming" rows={3} className={inputClass} placeholder="Do you currently have DJ nights? What genre? How often?" />
          </div>
          <button
            type="button"
            onClick={() => requireFields(['venueName'], 2)}
            className="w-full bg-[#c8a96e] text-[#09090b] font-semibold text-sm py-3 rounded-lg hover:bg-[#d4b87a] active:scale-[0.98] transition-all"
          >
            {t.continue}
          </button>
          {stepError && <p className="text-red-400 text-xs text-center" aria-live="polite">{stepError}</p>}
        </div>
      )}

      {/* Step 2: Goals & Budget */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <label className={labelClass}>{t.goals}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {goals.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => toggleGoal(g.value)}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all ${
                    selectedGoals.includes(g.value)
                      ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#c8a96e]'
                      : 'border-[color:var(--border)] text-[color:var(--text-mute)] hover:border-[#c8a96e]/30'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="venue-budget" className={labelClass}>{t.budget}</label>
            <select id="venue-budget" name="monthlyBudget" required className={selectClass}>
              <option value="">{t.budgetSelect}</option>
              {budgets.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="venue-decision-maker" className={labelClass}>{t.decisionMaker}</label>
            <select id="venue-decision-maker" name="decisionMaker" className={selectClass}>
              <option value="">Select role...</option>
              <option value="owner">Owner</option>
              <option value="gm">General Manager</option>
              <option value="event-manager">Event Manager</option>
            </select>
          </div>
          <div>
            <label htmlFor="venue-timeline" className={labelClass}>{t.timeline}</label>
            <select id="venue-timeline" name="timeline" className={selectClass}>
              <option value="">{t.timelineSelect}</option>
              {timelines.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="flex-1 border border-[color:var(--border)] text-[color:var(--text-dim)] font-semibold text-sm py-3 rounded-lg hover:border-[#c8a96e]/30 transition-all"
            >
              {t.back}
            </button>
            <button
              type="button"
              onClick={() => requireFields(['monthlyBudget'], 3)}
              className="flex-1 bg-[#c8a96e] text-[#09090b] font-semibold text-sm py-3 rounded-lg hover:bg-[#d4b87a] active:scale-[0.98] transition-all"
            >
              {t.continue}
            </button>
          </div>
          {stepError && <p className="text-red-400 text-xs text-center" aria-live="polite">{stepError}</p>}
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <label htmlFor="venue-contact-name" className={labelClass}>{t.name}</label>
            <input id="venue-contact-name" type="text" name="contactName" required className={inputClass} placeholder="Full name" />
          </div>
          <div>
            <label htmlFor="venue-contact-whatsapp" className={labelClass}>{t.whatsapp}</label>
            <input id="venue-contact-whatsapp" type="tel" name="contactWhatsApp" required className={inputClass} placeholder="+33 6 00 00 00 00" />
          </div>
          <div>
            <label htmlFor="venue-contact-email" className={labelClass}>{t.email}</label>
            <input id="venue-contact-email" type="email" name="contactEmail" required className={inputClass} placeholder="you@venue.com" />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="flex-1 border border-[color:var(--border)] text-[color:var(--text-dim)] font-semibold text-sm py-3 rounded-lg hover:border-[#c8a96e]/30 transition-all"
            >
              {t.back}
            </button>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex-1 bg-[#c8a96e] text-[#09090b] font-semibold text-sm py-3 rounded-lg hover:bg-[#d4b87a] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {status === 'sending' ? t.submitting : t.submit}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-red-400 text-xs text-center">{errorMsg}</p>
          )}
        </div>
      )}
    </form>
  );
}
