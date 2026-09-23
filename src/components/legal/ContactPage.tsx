import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';

interface ContactPageProps {
  onNavigate?: (view: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  // Use configurable contact email from environment variable or standard platform address
  const contactEmail =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL) ||
    'support@structura.build';

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Provide a direct mailto flow so user message is reliably sent to the real address
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject || 'STRUCTURA Inquiry'
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <article className="max-w-3xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Technical Support & Inquiries</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Contact STRUCTURA
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 leading-relaxed">
          Questions regarding calculator formulas, bug reports, feature requests, or technical partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Direct Email Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-4">
            <h2 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Direct Contact
            </h2>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              We respond to inquiries regarding calculation methodologies, unit rounding, and platform enhancements.
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-micro font-mono text-slate-500 uppercase block">
                Primary Engineering Email
              </span>
              <a
                href={`mailto:${contactEmail}`}
                className="text-body-sm font-mono text-accent hover:underline font-semibold block"
              >
                {contactEmail}
              </a>
            </div>

            <div className="pt-2 border-t border-paper-200 dark:border-charcoal-800 text-micro text-slate-500 leading-relaxed flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Direct communication · No third-party ticketing queues</span>
            </div>
          </div>
        </div>

        {/* Contact Form / Mailto Launcher */}
        <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card">
          {submitted ? (
            <div className="space-y-4 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-heading-sm font-bold text-slate-900 dark:text-white">
                Email Client Launched
              </h3>
              <p className="text-caption text-slate-600 dark:text-slate-400">
                Your email client was opened addressed to {contactEmail}. You can also write to us directly at any time.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-tech bg-paper-100 dark:bg-charcoal-800 text-slate-800 dark:text-slate-200 text-caption font-medium hover:bg-paper-200 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-heading-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                <span>Send a Message</span>
              </h2>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-micro font-mono text-slate-600 dark:text-slate-400">
                  Topic / Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="e.g. Concrete slab formula inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-body-sm tech-focus"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-micro font-mono text-slate-600 dark:text-slate-400">
                  Message Details
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Describe your question or suggestion..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-body-sm tech-focus"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-tech bg-accent text-white font-medium text-caption hover:opacity-90 transition-opacity"
              >
                Send via Email
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
};
