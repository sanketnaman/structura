import React from 'react';
import { Cookie, Settings, ShieldCheck, Database } from 'lucide-react';

interface CookiePolicyPageProps {
  onNavigate?: (view: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onNavigate }) => {
  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Cookie className="w-4 h-4" />
          <span>Storage & Tracking Technologies</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Cookie & Local Storage Policy
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          Last revised: September 2026 · Technical transparency
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          1. What Are Cookies and Local Storage?
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          Cookies and HTML5 local storage are standard web technologies that store small strings of text or configuration values inside your device's browser. They allow web applications to remember your selected preferences across page reloads and browsing sessions.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          2. How STRUCTURA Uses Local Storage
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Unlike heavy multi-tenant platforms, STRUCTURA operates primarily client-side. We utilize browser <code>localStorage</code> for the following essential operational purposes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <span className="text-micro font-mono text-accent font-bold">ESSENTIAL</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">Unit System</h3>
              <p className="text-micro text-slate-500">
                Remembers whether you selected Imperial (feet/inches) or Metric (meters/cm).
              </p>
            </div>

            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <span className="text-micro font-mono text-accent font-bold">ESSENTIAL</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">Theme Mode</h3>
              <p className="text-micro text-slate-500">
                Remembers your Dark or Light UI color theme preference.
              </p>
            </div>

            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <span className="text-micro font-mono text-accent font-bold">ESSENTIAL</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">Consent State</h3>
              <p className="text-micro text-slate-500">
                Stores your saved privacy choices to prevent repeated banner prompts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          3. Third-Party Advertising & Partner Cookies
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          When advertisements are delivered via Google AdSense or certified network partners, those third parties may place and read cookies on your browser or use web beacons to collect information as a result of ad serving on the website. These cookies enable relevant advertising and frequency capping.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          4. Managing Your Preferences
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          You can configure or block cookies at any time through your web browser settings. Most browsers allow you to refuse cookies or delete specific cookies. Note that disabling essential storage may cause your unit system or theme choices to reset on every visit.
        </p>
      </section>
    </article>
  );
};
