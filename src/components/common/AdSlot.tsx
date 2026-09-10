import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';

export type AdPosition = 'top' | 'result' | 'result-area' | 'bottom' | 'content' | 'in-content';

interface AdSlotProps {
  position: AdPosition;
  className?: string;
  adId?: string;
}

/**
 * Extracts clean 32-character hex key if user pasted the entire <script> snippet
 * into the environment variable or Settings.
 */
function extractAdKey(rawKey?: string): string {
  if (!rawKey) return '';
  const match = rawKey.match(/[a-f0-9]{32}/i);
  return match ? match[0] : rawKey.trim();
}

export const AdSlot: React.FC<AdSlotProps> = ({ position, className = '', adId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const rawKey = import.meta.env.VITE_ADSTERRA_BANNER_KEY;
  const adKey = extractAdKey(rawKey);

  useEffect(() => {
    // If no ad key is configured, do not attempt injection
    if (!adKey) return;

    trackEvent('ad_slot_rendered', {
      position,
      adId: adId || `ad-slot-${position}`,
      path: location.pathname,
    });

    const container = containerRef.current;
    if (!container) return;

    // Clear previous ad content to prevent stacking or duplication on route transitions
    container.innerHTML = '';

    const atOptionsConfig = {
      key: adKey,
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    };

    // Ensure global atOptions is available on window
    (window as unknown as { atOptions?: unknown }).atOptions = atOptionsConfig;

    // Create script 1: atOptions config script using JSON.stringify + textContent
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.textContent = `atOptions = ${JSON.stringify(atOptionsConfig)};`;

    // Create script 2: invoke.js loader script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highrevenueformat.com/${adKey}/invoke.js`;
    invokeScript.async = true;

    // Append config script first, then invoke script
    container.appendChild(optionsScript);
    container.appendChild(invokeScript);

    // Cleanup on unmount or before re-injection to avoid duplicate ads
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [adKey, position, adId, location.pathname]);

  // If env variable is missing/empty, render nothing rather than a broken layout
  if (!adKey) {
    return null;
  }

  const slotIdentifier = adId || `ad-slot-${position}`;

  return (
    <aside
      id={slotIdentifier}
      aria-label="Advertisement"
      className={`w-full flex flex-col items-center justify-center my-6 ${className}`}
    >
      {/* Required Advertisement label to distinguish from real content */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2 select-none">
        <span>Advertisement</span>
      </div>

      {/* Reserved fixed container size (728x90) with responsive centering to prevent layout shift */}
      <div className="w-full max-w-[728px] overflow-x-auto sm:overflow-visible flex justify-center">
        <div
          ref={containerRef}
          id={`ad-container-${position}`}
          className="w-[728px] h-[90px] min-w-[728px] min-h-[90px] flex items-center justify-center bg-transparent"
          style={{ width: '728px', height: '90px' }}
        />
      </div>
    </aside>
  );
};

