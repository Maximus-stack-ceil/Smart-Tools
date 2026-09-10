// SmartTools Centralized Analytics Service
// Pure browser-compatible event tracker ready for Google Analytics, Plausible, or Adsterra

export interface AnalyticsEventParams {
  tool?: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}): void {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    ...params,
  };

  // Dispatch custom DOM event for any embedded tracking listeners
  try {
    const customEvent = new CustomEvent('smarttools:analytics', { detail: payload });
    window.dispatchEvent(customEvent);
  } catch {
    // Silently ignore if window/CustomEvent is not available
  }

  // Google Analytics (gtag) hook if present
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    try {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, params);
    } catch {
      // Ignored
    }
  }

  // Development debug logging
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    // console.debug('[Analytics]', eventName, payload);
  }
}
