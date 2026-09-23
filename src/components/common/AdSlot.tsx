import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'rectangle' | 'leaderboard' | 'horizontal-responsive';
  className?: string;
  label?: string;
}

/**
 * AdSlot Component
 * 
 * Complies with Google AdSense Policies:
 * - Stable, reserved height preventing Layout Shifts (CLS)
 * - Clear, non-deceptive boundary distinctly labeled "ADVERTISEMENT"
 * - Does not overlap interactive controls, forms, or 3D viewports
 * - Configurable via VITE_ADSENSE_CLIENT_ID / VITE_ENABLE_ADS
 * - Development fallback clearly marks placeholder space without fake mock ads
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  format = 'horizontal-responsive',
  className = '',
  label = 'Advertisement',
}) => {
  // Check if live AdSense is enabled via environment variables
  const isAdsEnabled = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_ADS === 'true';
  const publisherId = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADSENSE_CLIENT_ID;

  // Reserved height classes based on standard IAB sizes to eliminate CLS
  const formatClasses = {
    rectangle: 'min-h-[250px] max-w-[300px]',
    leaderboard: 'min-h-[90px] max-w-[728px]',
    'horizontal-responsive': 'min-h-[100px] w-full max-w-4xl',
  }[format];

  return (
    <div
      className={`mx-auto my-8 flex flex-col items-center justify-center p-3 rounded-tech bg-paper-100/60 dark:bg-charcoal-900/60 border border-dashed border-paper-300 dark:border-charcoal-750 transition-colors ${formatClasses} ${className}`}
      aria-label={label}
      role="complementary"
    >
      {/* Policy requirement: Must clearly identify ad space */}
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 select-none">
        {label}
      </span>

      {isAdsEnabled && publisherId ? (
        // When production AdSense is active
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId || '0000000000'}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        // Non-deceptive reserved placeholder during evaluation / local development
        <div className="w-full flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-micro font-mono text-slate-400 dark:text-slate-500">
            Reserved Advertising Space
          </p>
          <p className="text-[11px] text-slate-400/80 max-w-sm mt-1">
            Display spaces are kept non-intrusive and separate from calculator inputs and 3D visual geometry.
          </p>
        </div>
      )}
    </div>
  );
};
