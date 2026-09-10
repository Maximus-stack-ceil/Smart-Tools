import React, { useEffect } from 'react';
import { trackEvent } from '../../utils/analytics';

export type AdPosition = 'top' | 'content' | 'in-content' | 'result' | 'result-area' | 'bottom';

interface AdSlotProps {
  position: AdPosition;
  className?: string;
  adId?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ position, className = '', adId }) => {
  useEffect(() => {
    trackEvent('ad_slot_rendered', { position, adId: adId || `ad-slot-${position}` });
  }, [position, adId]);

  // Normalized position mapping
  const normPosition = position === 'content' ? 'in-content' : position === 'result' ? 'result-area' : position;

  // Configured reserved dimensions according to IAB / Adsterra standard banner sizes
  // to avoid Cumulative Layout Shift (CLS)
  const sizeConfig = {
    top: {
      minHeight: '90px',
      maxHeight: '90px',
      label: 'Advertisement (Leaderboard 728×90)',
      containerClass: 'w-full max-w-[728px] mx-auto min-h-[90px] my-4',
    },
    'in-content': {
      minHeight: '250px',
      maxHeight: '280px',
      label: 'Advertisement (Rectangle 300×250 / 336×280)',
      containerClass: 'w-full max-w-[336px] mx-auto min-h-[250px] my-6',
    },
    'result-area': {
      minHeight: '100px',
      maxHeight: '120px',
      label: 'Sponsor / Advertisement (728×90 or responsive banner)',
      containerClass: 'w-full max-w-[728px] mx-auto min-h-[100px] mt-6 mb-4',
    },
    bottom: {
      minHeight: '90px',
      maxHeight: '100px',
      label: 'Advertisement (Footer Banner 728×90)',
      containerClass: 'w-full max-w-[728px] mx-auto min-h-[90px] my-8',
    },
  }[normPosition];

  return (
    <aside
      id={adId || `ad-slot-${position}`}
      aria-label="Advertisement placeholder"
      className={`relative overflow-hidden rounded-lg border border-dashed border-gray-200 bg-gray-50/75 flex flex-col items-center justify-center p-3 text-center transition-opacity select-none ${sizeConfig.containerClass} ${className}`}
      style={{ minHeight: sizeConfig.minHeight }}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-400">
        <span>Ad Space</span>
        <span className="text-gray-300">•</span>
        <span className="hidden sm:inline">{sizeConfig.label}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">
        Clean reserved slot for ad networks. Prevents layout shift.
      </p>
    </aside>
  );
};
