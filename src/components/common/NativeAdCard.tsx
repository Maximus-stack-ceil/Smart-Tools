import React, { useEffect, useRef } from 'react';

export const NativeAdCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef<boolean>(false);
  const scriptNodeRef = useRef<HTMLScriptElement | null>(null);

  const containerId =
    import.meta.env.VITE_ADSTERRA_NATIVE_CONTAINER_ID ||
    'container-7712ccdb07740650a00967418bf56619';
  const scriptSrc =
    import.meta.env.VITE_ADSTERRA_NATIVE_SRC ||
    'https://pl31274775.profitableratecpmnetwork.com/7712ccdb07740650a00967418bf56619/invoke.js';

  useEffect(() => {
    // Prevent duplicate injection on re-renders
    if (injectedRef.current) return;
    if (!containerRef.current) return;
    if (!scriptSrc) return;

    // Confirm the container exists in the DOM by ID
    const targetDiv = document.getElementById(containerId);
    if (!targetDiv) return;

    // Create and append the native ad script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    targetDiv.appendChild(script);
    scriptNodeRef.current = script;
    injectedRef.current = true;

    return () => {
      // Clean up script node and container contents on unmount
      if (scriptNodeRef.current) {
        scriptNodeRef.current.remove();
        scriptNodeRef.current = null;
      }
      injectedRef.current = false;
      const el = document.getElementById(containerId);
      if (el) {
        el.innerHTML = '';
      }
    };
  }, [containerId, scriptSrc]);

  return (
    <div
      id="native-ad-card"
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-black/[0.08] hover:shadow-md p-5 overflow-hidden"
    >
      <div>
        {/* Header with Sponsored badge in top-left */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border bg-amber-50 text-amber-700 border-amber-200/80">
            Sponsored
          </span>
          <span className="text-[11px] font-medium text-gray-400">Advertisement</span>
        </div>

        {/* Content area holding the exact container div */}
        <div className="min-h-[140px] flex items-center justify-center overflow-hidden">
          <div
            ref={containerRef}
            id={containerId}
            className="w-full flex items-center justify-center overflow-hidden text-center"
          />
        </div>
      </div>

      <div className="mt-4 pt-1 flex items-center justify-between text-xs text-gray-400">
        <span className="text-[11px] text-gray-400">Featured Partner</span>
      </div>
    </div>
  );
};
