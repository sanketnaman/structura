import React from 'react';
import { DollarSign, ShieldCheck, Info, ExternalLink } from 'lucide-react';

interface AdvertisingDisclosurePageProps {
  onNavigate?: (view: string) => void;
}

export const AdvertisingDisclosurePage: React.FC<AdvertisingDisclosurePageProps> = ({ onNavigate }) => {
  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <DollarSign className="w-4 h-4" />
          <span>Transparency & Monetization</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Advertising Disclosure
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          Last updated: September 2026 · Transparent funding model
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          1. Why We Display Advertisements
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          STRUCTURA provides professional-grade 3D construction calculators, material takeoffs, and engineering reference tools free of charge to contractors, architects, students, and homebuilders worldwide. To offset ongoing cloud hosting, GPU WebGL rendering bandwidth, and domain infrastructure expenses, STRUCTURA may display advertisements served by third-party advertising partners, such as Google AdSense.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          2. Placement & User Experience Commitment
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            We strictly enforce the following advertising principles across our platform:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Clear Labeling:</strong> All ad placements are explicitly labeled "ADVERTISEMENT" and visually separated from tool inputs and formulas.
            </li>
            <li>
              <strong>Zero Deception:</strong> Advertisements never mimic calculator download buttons, calculation triggers, or measurement inputs.
            </li>
            <li>
              <strong>No Disruptive Overlays:</strong> We do not deploy intrusive popups, full-screen interstitials, or floating overlays that block 3D viewports.
            </li>
            <li>
              <strong>Formula Integrity:</strong> Advertisers have no editorial influence over mathematical equations, nominal ratios, or calculation outputs.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          3. Third-Party Networks & Cookie Controls
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other sites. You may review your ad personalization preferences or opt out of personalized advertising by visiting Google's official{' '}
          <a
            href="https://myadcenter.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline inline-flex items-center gap-1 font-medium"
          >
            My Ad Center <ExternalLink className="w-3 h-3" />
          </a>
          .
        </p>
      </section>
    </article>
  );
};
