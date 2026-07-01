import React from 'react';
import { stepLabels } from './quote-content';

export function InputField({ label, name, type = 'text', placeholder, value, onChange, required }: {
  label: string; name: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const id = `quote-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[0.78rem] font-medium ml-1" style={{ color: 'var(--text-muted)' }}>
        {label} {required && <span style={{ color: 'var(--text-accent)' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border rounded-xl px-4 py-3 text-[0.95rem] outline-none transition-all sg-form-field"
      />
    </div>
  );
}

export function SelectField({ label, name, value, onChange, options, required }: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; options: { label: string; value: string }[];
  required?: boolean;
}) {
  const id = `quote-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[0.78rem] font-medium ml-1" style={{ color: 'var(--text-muted)' }}>
        {label} {required && <span style={{ color: 'var(--text-accent)' }}>*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border rounded-xl px-4 py-3 text-[0.95rem] outline-none transition-all sg-form-field"
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function TextareaField({ label, name, placeholder, value, onChange, rows = 4 }: {
  label: string; name: string; placeholder?: string;
  value: string; onChange: (v: string) => void; rows?: number;
}) {
  const id = `quote-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[0.78rem] font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border rounded-xl px-4 py-3 text-[0.95rem] outline-none transition-all resize-none sg-form-field"
      />
    </div>
  );
}

export function ProgressBar({ currentStep, totalSteps, labels = stepLabels }: { currentStep: number; totalSteps: number; labels?: string[] }) {
  return (
    <div className="flex items-center gap-2 mb-12">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-medium transition-all duration-300"
              style={{
                borderColor: i <= currentStep ? 'var(--text-accent)' : 'var(--border-subtle)',
                backgroundColor: i < currentStep ? 'var(--text-accent)' : i === currentStep ? 'color-mix(in srgb, var(--text-accent) 15%, transparent)' : 'transparent',
                color: i < currentStep ? 'var(--text-inverse)' : i === currentStep ? 'var(--text-accent)' : 'var(--text-muted)',
              }}
            >
              {i < currentStep ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className="text-[9px] font-medium hidden md:block" style={{ color: i <= currentStep ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
              {labels[i]}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div
              className="flex-1 h-[1px] mt-[-14px] md:mt-[-4px] transition-all duration-500"
              style={{ backgroundColor: i < currentStep ? 'var(--text-accent)' : 'var(--border-subtle)' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
