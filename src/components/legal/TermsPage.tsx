import React from 'react';
import { Scale, FileText, AlertCircle, ShieldAlert } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';

export const TermsPage: React.FC = () => {
  const { t } = useLocale();

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>{t('terms.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('terms.title')}
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          {t('terms.meta')}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('terms.s1Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('terms.s1Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('terms.s2Title')}
        </h2>
        <div className="p-4 rounded-tech bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2 text-caption text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {t('terms.s2Body1')}
          </p>
          <p>
            {t('terms.s2Body2')}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('terms.s3Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('terms.s3Lead')}
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-caption text-slate-600 dark:text-slate-400">
          <li>{t('terms.s3Item1')}</li>
          <li>{t('terms.s3Item2')}</li>
          <li>{t('terms.s3Item3')}</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('terms.s4Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('terms.s4Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('terms.s5Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('terms.s5Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('terms.s6Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('terms.contactLead')}
          <a href="mailto:support@mixtally.com" className="text-accent underline font-mono">
            support@mixtally.com
          </a>
          {t('terms.contactTail')}
        </p>
      </section>
    </article>
  );
};
