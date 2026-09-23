import React from 'react';
import { Scale, FileText, AlertCircle, ShieldAlert } from 'lucide-react';

interface TermsPageProps {
  onNavigate?: (view: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Terms of Use
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          Last revised: September 2026 · Agreement between user and platform
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          1. Agreement to Terms
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          By accessing or using STRUCTURA, you agree to be bound by these Terms of Use and our Construction Disclaimer. If you disagree with any portion of these terms, your sole remedy is to cease using the platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          2. No Professional Engineering or Architectural Relationship
        </h2>
        <div className="p-4 rounded-tech bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2 text-caption text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            The software, interactive calculators, 3D representations, and material estimations provided on STRUCTURA do not create a professional engineer-client or architect-client relationship. STRUCTURA is an informational calculation tool designed for preliminary logistical planning and purchasing estimates.
          </p>
          <p>
            Users are strictly responsible for having critical construction specifications, load designs, foundation depths, and structural framing evaluated and stamped by a licensed professional engineer (PE) or registered architect in their jurisdiction.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          3. Permitted & Acceptable Use
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          You may use our calculators for personal, commercial, educational, and business estimation tasks. You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-caption text-slate-600 dark:text-slate-400">
          <li>Attempt to reverse-engineer, exploit, or disrupt the underlying web infrastructure.</li>
          <li>Scrape or bulk-extract proprietary 3D geometry algorithms via automated crawlers.</li>
          <li>Represent generated visual renderings as licensed permit drawings.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          4. Limitation of Liability
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          To the maximum extent permitted by applicable law, STRUCTURA, its creators, and contributors shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages—including but not limited to material shortages, overages, contractor delays, demolition costs, structural defects, or lost profits—arising out of or in connection with the use of this website.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          5. Governing Law
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          These Terms of Use shall be governed by and construed in accordance with standard commercial laws without regard to conflict of law principles. Any dispute arising under these terms shall be resolved through good-faith negotiation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          6. Contact
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          For legal inquiries, contact{' '}
          <a href="mailto:support@structura.build" className="text-accent underline font-mono">
            support@structura.build
          </a>
          .
        </p>
      </section>
    </article>
  );
};
