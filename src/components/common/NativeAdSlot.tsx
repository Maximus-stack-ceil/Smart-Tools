import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';

interface NativeAdSlotProps {
  className?: string;
  id?: string;
}

/**
 * Safely extracts clean script src URL if HTML snippet was pasted.
 */
function extractScriptUrl(raw?: string): string {
  if (!raw) return 'https://pl31274775.profitableratecpmnetwork.com/7712ccdb07740650a00967418bf56619/invoke.js';
  const match = raw.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : raw.trim();
}

/**
 * Safely extracts clean container ID if HTML snippet was pasted.
 */
function extractContainerId(raw?: string): string {
  if (!raw) return 'container-7712ccdb07740650a00967418bf56619';
  const match = raw.match(/id=["']([^"']+)["']/i);
  return match ? match[1] : raw.trim();
}

export const NativeAdSlot: React.FC<NativeAdSlotProps> = ({ className = '', id }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const scriptUrl = extractScriptUrl(import.meta.env.VITE_ADSTERRA_NATIVE_SCRIPT_URL);
  const containerId = extractContainerId(import.meta.env.VITE_ADSTERRA_NATIVE_CONTAINER_ID);

  useEffect(() => {
    if (!scriptUrl || !containerId) return;

    trackEvent('native_ad_slot_rendered', {
      containerId,
      path: location.pathname,
    });

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Clear previous ad content inside container
    const adContainer = document.getElementById(containerId);
    if (adContainer) {
      adContainer.innerHTML = '';
    }

    // Remove any previously appended native ad script
    const existingScripts = wrapper.querySelectorAll('script');
    existingScripts.forEach((s) => s.remove());

    // Create and append the native ad invoke script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    wrapper.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const el = document.getElementById(containerId);
      if (el) {
        el.innerHTML = '';
      }
    };
  }, [scriptUrl, containerId, location.pathname]);

  return (
    <aside
      id={id || 'native-ad-sidebar-unit'}
      aria-label="Sponsored Recommendations"
      className={`w-full rounded-2xl bg-white border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 transition-all ${className}`}
    >
      {/* Editorial Sponsored Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-100 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Sponsored Content
          </span>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100/80 px-1.5 py-0.5 rounded">
          Ad
        </span>
      </div>

      {/* Container holding Adsterra Native Ad */}
      <div ref={wrapperRef} className="w-full min-h-[160px] flex flex-col justify-center items-center overflow-hidden">
        <div id={containerId} className="w-full" />
      </div>
    </aside>
  );
};
