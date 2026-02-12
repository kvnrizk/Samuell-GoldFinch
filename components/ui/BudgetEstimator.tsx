'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';

/* ── Types ── */
interface SliderFactor {
  type: 'slider';
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  pricePerUnit: number;
}

interface ToggleFactor {
  type: 'toggle';
  name: string;
  description: string;
  price: number;
  default: boolean;
}

interface SelectFactor {
  type: 'select';
  name: string;
  options: { label: string; value: string; multiplier: number }[];
  default: string;
}

type Factor = SliderFactor | ToggleFactor | SelectFactor;

interface ServiceConfig {
  label: string;
  basePrice: number;
  factors: Factor[];
  note: string;
}

/* ── Static pricing configs ── */
const blazePricing: ServiceConfig = {
  label: 'Wedding & Event Film',
  basePrice: 2500,
  note: 'Starting prices. Final quote depends on specific requirements.',
  factors: [
    { type: 'slider', name: 'Hours of Coverage', unit: 'hours', min: 4, max: 16, step: 2, default: 8, pricePerUnit: 200 },
    { type: 'select', name: 'Crew Size', options: [
      { label: 'Solo Filmmaker', value: '1', multiplier: 1 },
      { label: '2-Person Crew', value: '2', multiplier: 1.6 },
      { label: '3+ Full Crew', value: '3', multiplier: 2.2 },
    ], default: '1' },
    { type: 'toggle', name: 'Drone Footage', description: 'Aerial cinematography with licensed pilot', price: 500, default: false },
    { type: 'toggle', name: 'Same-Day Edit', description: 'Highlight reel delivered on the day', price: 800, default: false },
    { type: 'select', name: 'Deliverables', options: [
      { label: 'Highlight Reel (3-5 min)', value: 'highlight', multiplier: 1 },
      { label: 'Full Film (10-15 min)', value: 'full', multiplier: 1.4 },
      { label: 'Full Film + Social Cuts', value: 'full-social', multiplier: 1.7 },
    ], default: 'highlight' },
    { type: 'toggle', name: 'Destination Travel', description: 'Travel & accommodation outside local area', price: 1200, default: false },
  ],
};

const kolasiPricing: ServiceConfig = {
  label: 'DJ Booking & Event Production',
  basePrice: 1500,
  note: 'Starting prices. Artist fees vary by roster level.',
  factors: [
    { type: 'slider', name: 'Set Duration', unit: 'hours', min: 2, max: 8, step: 1, default: 4, pricePerUnit: 250 },
    { type: 'select', name: 'Artist Tier', options: [
      { label: 'Resident DJ', value: 'resident', multiplier: 1 },
      { label: 'Featured Artist', value: 'featured', multiplier: 1.8 },
      { label: 'International Headliner', value: 'headliner', multiplier: 3 },
    ], default: 'resident' },
    { type: 'toggle', name: 'Sound System', description: 'Professional sound system rental + engineer', price: 800, default: false },
    { type: 'toggle', name: 'Lighting Package', description: 'Dynamic LED lighting with DMX control', price: 600, default: false },
    { type: 'toggle', name: 'Event Content', description: 'Photo + video recap for social media', price: 900, default: false },
    { type: 'select', name: 'Event Type', options: [
      { label: 'Private Party', value: 'private', multiplier: 1 },
      { label: 'Corporate Event', value: 'corporate', multiplier: 1.3 },
      { label: 'Festival / Multi-Stage', value: 'festival', multiplier: 2 },
    ], default: 'private' },
  ],
};

/* ── Component ── */
interface BudgetEstimatorProps {
  brand: 'blaze' | 'kolasi';
}

export default function BudgetEstimator({ brand }: BudgetEstimatorProps) {
  const config = brand === 'blaze' ? blazePricing : kolasiPricing;
  const containerRef = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize state from defaults
  const [values, setValues] = useState<Record<string, number | boolean | string>>(() => {
    const init: Record<string, number | boolean | string> = {};
    config.factors.forEach((f) => {
      if (f.type === 'slider') init[f.name] = f.default;
      if (f.type === 'toggle') init[f.name] = f.default;
      if (f.type === 'select') init[f.name] = f.default;
    });
    return init;
  });

  const updateValue = (name: string, value: number | boolean | string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate estimate
  const estimate = useMemo(() => {
    let total = config.basePrice;
    let selectMultiplier = 1;

    config.factors.forEach((f) => {
      const val = values[f.name];
      if (f.type === 'slider') {
        total += (val as number) * f.pricePerUnit;
      }
      if (f.type === 'toggle' && val) {
        total += f.price;
      }
      if (f.type === 'select') {
        const opt = f.options.find((o) => o.value === val);
        if (opt) selectMultiplier *= opt.multiplier;
      }
    });

    total *= selectMultiplier;
    // Return a range (±15%)
    const low = Math.round(total * 0.85 / 100) * 100;
    const high = Math.round(total * 1.15 / 100) * 100;
    return { low, high };
  }, [values, config]);

  const toggleExpand = () => {
    if (!contentRef.current) return;
    if (isExpanded) {
      gsap.to(contentRef.current, { height: 0, duration: 0.5, ease: 'power3.inOut' });
    } else {
      gsap.set(contentRef.current, { height: 'auto' });
      const h = contentRef.current.offsetHeight;
      gsap.fromTo(contentRef.current, { height: 0 }, { height: h, duration: 0.6, ease: 'power3.inOut' });
    }
    setIsExpanded(!isExpanded);
  };

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.estimator-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const serviceParam = brand === 'blaze' ? 'wedding-film' : 'dj-performance';

  return (
    <section ref={containerRef} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="estimator-reveal rounded-3xl border overflow-hidden"
          style={{
            borderColor: 'color-mix(in srgb, #c8a96e 20%, var(--border))',
            background: 'linear-gradient(135deg, color-mix(in srgb, #c8a96e 4%, var(--bg)), var(--bg-card))',
          }}
        >
          {/* Header — always visible */}
          <button
            onClick={toggleExpand}
            className="w-full p-8 md:p-10 flex items-center justify-between text-left group"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: '#c8a96e' }}>
                Budget Estimator
              </p>
              <h3 className="text-xl md:text-2xl font-serif italic">
                {config.label}
              </h3>
              <p className="text-xs font-light mt-2" style={{ color: 'var(--text-dim)' }}>
                Adjust the options to get an instant estimate
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!isExpanded && (
                <div className="hidden md:block text-right">
                  <p className="text-xs" style={{ color: 'var(--text-mute)' }}>From</p>
                  <p className="text-xl font-serif" style={{ color: '#c8a96e' }}>{formatPrice(config.basePrice)}</p>
                </div>
              )}
              <div
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:border-[#c8a96e]"
                style={{
                  borderColor: 'var(--border-hi)',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </button>

          {/* Expandable content */}
          <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
            <div className="px-8 md:px-10 pb-10">
              <div className="h-[1px] mb-8" style={{ backgroundColor: 'var(--border)' }} />

              {/* Factors */}
              <div className="space-y-8">
                {config.factors.map((factor) => {
                  if (factor.type === 'slider') {
                    const val = values[factor.name] as number;
                    return (
                      <div key={factor.name}>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium">{factor.name}</label>
                          <span className="text-sm font-serif" style={{ color: '#c8a96e' }}>
                            {val} {factor.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={factor.min}
                          max={factor.max}
                          step={factor.step}
                          value={val}
                          onChange={(e) => updateValue(factor.name, parseInt(e.target.value))}
                          className="w-full accent-[#c8a96e]"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>{factor.min} {factor.unit}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>{factor.max} {factor.unit}</span>
                        </div>
                      </div>
                    );
                  }

                  if (factor.type === 'toggle') {
                    const val = values[factor.name] as boolean;
                    return (
                      <div key={factor.name} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{factor.name}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{factor.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium" style={{ color: 'var(--text-mute)' }}>+{formatPrice(factor.price)}</span>
                          <button
                            onClick={() => updateValue(factor.name, !val)}
                            className="w-12 h-6 rounded-full relative transition-all duration-300"
                            style={{
                              backgroundColor: val ? '#c8a96e' : 'var(--bg)',
                              border: `1px solid ${val ? '#c8a96e' : 'var(--border-hi)'}`,
                            }}
                            aria-label={`Toggle ${factor.name}`}
                          >
                            <div
                              className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                              style={{
                                left: val ? '24px' : '1px',
                                backgroundColor: val ? '#09090b' : 'var(--text-dim)',
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (factor.type === 'select') {
                    const val = values[factor.name] as string;
                    return (
                      <div key={factor.name}>
                        <label className="text-sm font-medium block mb-3">{factor.name}</label>
                        <div className="grid grid-cols-3 gap-2">
                          {factor.options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateValue(factor.name, opt.value)}
                              className="px-4 py-3 rounded-xl border text-xs font-medium transition-all text-center"
                              style={{
                                borderColor: val === opt.value ? '#c8a96e' : 'var(--border)',
                                color: val === opt.value ? '#c8a96e' : 'var(--text-dim)',
                                backgroundColor: val === opt.value ? 'color-mix(in srgb, #c8a96e 10%, transparent)' : 'transparent',
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Price result */}
              <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--text-mute)' }}>
                      Estimated Range
                    </p>
                    <p className="text-3xl md:text-4xl font-serif">
                      <span style={{ color: '#c8a96e' }}>{formatPrice(estimate.low)}</span>
                      <span className="text-base mx-2" style={{ color: 'var(--text-mute)' }}>—</span>
                      <span style={{ color: '#c8a96e' }}>{formatPrice(estimate.high)}</span>
                    </p>
                    <p className="text-[11px] font-light mt-2" style={{ color: 'var(--text-mute)' }}>
                      {config.note}
                    </p>
                  </div>
                  <Link
                    href={`/quote?service=${serviceParam}`}
                    className="px-10 py-3.5 border rounded-full text-sm font-semibold transition-all hover:bg-white hover:text-black whitespace-nowrap"
                    style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                  >
                    Get Exact Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
