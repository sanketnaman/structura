import React from 'react';
import { ShieldCheck, Lock, Eye, Server, Globe } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate?: (view: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          Effective Date: September 2026 · Transparent data handling practices
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          1. Overview & Commitment
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          STRUCTURA ("we", "our", or "the Platform") respects your privacy. This Privacy Policy discloses what information is processed when you visit our website, utilize our interactive calculators, or communicate with us.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          2. Information We Process
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            <strong>Calculator Dimensions & Parameters:</strong> Dimensions entered into calculators (such as slab length, wall height, or coat counts) are executed client-side inside your web browser. We do not transmit or store your job site measurements on remote databases.
          </p>
          <p>
            <strong>Local Storage (Essential):</strong> We use browser localStorage solely to preserve your interface preferences: selected unit system (Imperial vs. Metric), color theme (Dark vs. Light mode), and cookie consent preferences.
          </p>
          <p>
            <strong>Voluntary Correspondence:</strong> If you contact us directly via email, we collect your email address and any text provided to respond to your inquiry.
          </p>
          <p>
            <strong>Technical Server Logs:</strong> Standard web hosting infrastructure automatically logs routine technical telemetry: IP address, browser user-agent, operating system, and HTTP request headers for security defense and denial-of-service prevention.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          3. Advertising & Google AdSense
        </h2>
        <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 text-caption text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            STRUCTURA may partner with third-party advertising vendors, including Google AdSense, to display non-intrusive advertisements that support the hosting of free construction engineering tools.
          </p>
          <p>
            Google and third-party vendors use cookies to serve ads based on prior visits to this website or other sites on the Internet. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to websites.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-accent underline">Ads Settings</a> or by utilizing our on-site Consent Preferences banner.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          4. International Data Rights (GDPR & CCPA/CPRA)
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Depending on your geographic jurisdiction (such as the European Economic Area, UK, or California), you may have statutory rights regarding your personal information, including the right to request access, rectification, erasure, or restriction of processing. Because STRUCTURA does not maintain user accounts or persistent identifiable profiles, we do not sell or share personal data.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          5. Children's Privacy
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          Our services are directed to adults, contractors, builders, and engineering students. We do not knowingly collect personal identifiable information from children under the age of 13 (or under 16 where applicable by law).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          6. Contact Information
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          For privacy inquiries or data rights requests, please contact our privacy compliance team via email at{' '}
          <a
            href="mailto:support@structura.build"
            className="text-accent underline font-mono"
          >
            support@structura.build
          </a>
          .
        </p>
      </section>
    </article>
  );
};
