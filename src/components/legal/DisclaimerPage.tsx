import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, Scale, FileText } from 'lucide-react';
import { useViewToPath } from '../../lib/routes';
import { useLocale } from '../../lib/i18n/context';

export const DisclaimerPage: React.FC = () => {
  const viewToPath = useViewToPath();
  const { t } = useLocale();

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>{t('disclaimer.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('disclaimer.title')}
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          {t('disclaimer.meta')}
        </p>
      </div>

      {/* Prominent Warning Callout */}
      <div className="p-6 rounded-tech-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-3">
        <div className="flex items-center gap-2 text-accent font-semibold text-body-sm">
          <Scale className="w-5 h-5 shrink-0" />
          <span>{t('disclaimer.noticeTitle')}</span>
        </div>
        <p className="text-caption text-slate-700 dark:text-slate-300 leading-relaxed">
          {t('disclaimer.noticeLead')}
          <strong>{t('disclaimer.noticeStrong')}</strong>
          {t('disclaimer.noticeTail')}
        </p>
      </div>

      {/* Key Scope Limitations */}
      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('disclaimer.s1Title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-caption">
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {t('disclaimer.card1Title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('disclaimer.card1Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {t('disclaimer.card2Title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('disclaimer.card2Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {t('disclaimer.card3Title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('disclaimer.card3Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {t('disclaimer.card4Title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('disclaimer.card4Body')}
            </p>
          </div>
        </div>
      </section>

      {/* Field Conditions & Material Variance */}
      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('disclaimer.s2Title')}
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            {t('disclaimer.s2Lead')}
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>
              <strong>{t('disclaimer.var1Label')}</strong>{' '}
              {t('disclaimer.var1Body')}
            </li>
            <li>
              <strong>{t('disclaimer.var2Label')}</strong>{' '}
              {t('disclaimer.var2Body')}
            </li>
            <li>
              <strong>{t('disclaimer.var3Label')}</strong>{' '}
              {t('disclaimer.var3Body')}
            </li>
            <li>
              <strong>{t('disclaimer.var4Label')}</strong>{' '}
              {t('disclaimer.var4Body')}
            </li>
            <li>
              <strong>{t('disclaimer.var5Label')}</strong>{' '}
              {t('disclaimer.var5Body')}
            </li>
          </ul>
        </div>
      </section>

      {/* User Responsibility */}
      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('disclaimer.s3Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('disclaimer.s3Body')}
        </p>
      </section>

      {/* Related Legal Links */}
      <div className="pt-6 border-t border-paper-300 dark:border-charcoal-750 flex flex-wrap gap-4 text-micro font-mono text-accent">
        <Link
          to={viewToPath('terms')}
          className="hover:underline flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('terms.title')}</span>
        </Link>
        <span>·</span>
        <Link
          to={viewToPath('privacy')}
          className="hover:underline flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('privacy.title')}</span>
        </Link>
      </div>
    </article>
  );
};
