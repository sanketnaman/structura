import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

interface ConsentBannerProps {
  onNavigateToPolicy?: (policy: 'privacy' | 'cookie-policy') => void;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ onNavigateToPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Preference state
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [adPersonalizationConsent, setAdPersonalizationConsent] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedConsent = window.localStorage.getItem('structura_cookie_consent');
        if (!savedConsent) {
          const timer = setTimeout(() => setIsVisible(true), 800);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // Ignore private browsing or storage quota exceptions
    }
  }, []);

  const saveToStorage = (data: object) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('structura_cookie_consent', JSON.stringify(data));
      }
    } catch {
      // Storage unavailable or blocked
    }
  };

  const handleAcceptAll = () => {
    saveToStorage({
      essential: true,
      analytics: true,
      advertising: true,
      timestamp: new Date().toISOString(),
    });
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    saveToStorage({
      essential: true,
      analytics: false,
      advertising: false,
      timestamp: new Date().toISOString(),
    });
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveToStorage({
      essential: true,
      analytics: analyticsConsent,
      advertising: adPersonalizationConsent,
      timestamp: new Date().toISOString(),
    });
    setIsVisible(false);
    setPreferencesOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and Privacy Consent Preferences"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50 p-5 rounded-tech-lg bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 shadow-2xl text-slate-900 dark:text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Cookie className="w-5 h-5 text-accent shrink-0" />
          <h3 className="text-body-sm font-bold tracking-tight">
            Privacy & Storage Preferences
          </h3>
        </div>
        <button
          type="button"
          onClick={handleAcceptEssential}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          aria-label="Dismiss banner with essential cookies only"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        Structura uses essential local browser storage to retain calculator dimensions, unit toggles (Imperial/Metric), and dark mode. We may also use privacy-focused analytics and advertising partners to maintain our free engineering tools.
      </p>

      {preferencesOpen ? (
        <div className="space-y-3 p-3 mb-4 rounded-tech bg-paper-100 dark:bg-charcoal-850 border border-paper-200 dark:border-charcoal-800 text-caption">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold block text-slate-900 dark:text-white">Essential Storage</span>
              <span className="text-micro text-slate-500">Unit preferences, theme, and calculator memory (Always active).</span>
            </div>
            <input type="checkbox" checked disabled className="accent-accent cursor-not-allowed" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-paper-200 dark:border-charcoal-800">
            <div>
              <span className="font-semibold block text-slate-900 dark:text-white">Anonymous Analytics</span>
              <span className="text-micro text-slate-500">Aggregated site usage metrics to improve calculator accuracy.</span>
            </div>
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="accent-accent cursor-pointer w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-paper-200 dark:border-charcoal-800">
            <div>
              <span className="font-semibold block text-slate-900 dark:text-white">Advertising Personalization</span>
              <span className="text-micro text-slate-500">Permits contextual and personalized partner advertising.</span>
            </div>
            <input
              type="checkbox"
              checked={adPersonalizationConsent}
              onChange={(e) => setAdPersonalizationConsent(e.target.checked)}
              className="accent-accent cursor-pointer w-4 h-4"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-3 py-1.5 rounded-tech bg-accent text-white font-medium text-caption hover:opacity-90 transition-opacity"
            >
              Save Choices
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-paper-200 dark:border-charcoal-800 text-caption">
        <div className="flex items-center gap-3 text-micro text-slate-500">
          <button
            type="button"
            onClick={() => onNavigateToPolicy?.('privacy')}
            className="hover:underline"
          >
            Privacy Policy
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigateToPolicy?.('cookie-policy')}
            className="hover:underline"
          >
            Cookie Policy
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!preferencesOpen && (
            <button
              type="button"
              onClick={() => setPreferencesOpen(true)}
              className="px-3 py-1.5 rounded-tech text-slate-700 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-charcoal-800 text-caption font-medium transition-colors"
            >
              Preferences
            </button>
          )}
          <button
            type="button"
            onClick={handleAcceptEssential}
            className="px-3 py-1.5 rounded-tech border border-paper-300 dark:border-charcoal-700 text-slate-800 dark:text-slate-200 hover:bg-paper-100 dark:hover:bg-charcoal-800 text-caption font-medium transition-colors"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-1.5 rounded-tech bg-accent text-white font-medium text-caption hover:opacity-90 transition-opacity shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
