'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Consent = 'granted' | 'denied' | null;

function getStoredConsent(): Consent {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem('cookie-consent');
  if (v === 'granted' || v === 'denied') return v;
  return null;
}

export function CookieConsent() {
  const [, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === null) {
      // Show banner after a short delay to avoid layout shift on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    setConsent(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'granted');
    setConsent('granted');
    setVisible(false);
    // Reload to activate analytics scripts
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'denied');
    setConsent('denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9998] p-4 md:p-6 animate-in slide-in-from-bottom"
    >
      <div className="max-w-2xl mx-auto bg-[#111114] border border-white/[0.08] rounded-xl p-5 md:p-6 backdrop-blur-xl shadow-2xl">
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          We use cookies for analytics (Google Analytics) and advertising measurement (Meta Pixel)
          to improve our site and measure campaign effectiveness.
          No personally identifiable data is collected.{' '}
          <Link href="/privacy" className="text-[#c8a96e] hover:underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="bg-[#c8a96e] text-[#09090b] font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-[#d4b87a] active:scale-[0.98] transition-all"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="border border-white/[0.12] text-zinc-400 font-medium text-xs px-5 py-2.5 rounded-lg hover:text-white hover:border-white/[0.2] transition-all"
          >
            Reject Non-Essential
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if analytics consent has been granted.
 * Use this in Analytics/MetaPixel components to conditionally load scripts.
 */
export function useAnalyticsConsent(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(getStoredConsent() === 'granted');
  }, []);

  return allowed;
}
