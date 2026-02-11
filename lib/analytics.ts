declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Meta Pixel
  if (window.fbq) {
    if (
      eventName === 'venue_form_submit' ||
      eventName === 'contact_form_submit' ||
      eventName === 'quote_form_submit' ||
      eventName === 'deck_download'
    ) {
      window.fbq('track', 'Lead', params);
    }
    if (eventName === 'venue_call_click') {
      window.fbq('track', 'Schedule', params);
    }
  }
}
