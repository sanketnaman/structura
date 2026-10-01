import React from 'react';
import { Cookie, Settings, ShieldCheck, Database } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';

export const CookiePolicyPage: React.FC = () => {
  const { t } = useLocale();

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Cookie className="w-4 h-4" />
          <span>{t('cookiePolicy.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('cookiePolicy.title')}
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          {t('cookiePolicy.meta')}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('cookiePolicy.s1Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('cookiePolicy.s1Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('cookiePolicy.s2Title')}
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            {t('cookiePolicy.s2LeadA')}
            <code>{t('cookiePolicy.s2Code')}</code>
            {t('cookiePolicy.s2LeadB')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <span className="text-micro font-mono text-accent font-bold">{t('cookiePolicy.essential')}</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">{t('cookiePolicy.unitTitle')}</h3>
              <p className="text-micro text-slate-500">
                {t('cookiePolicy.unitBody')}
              </p>
            </div>

            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <span className="text-micro font-mono text-accent font-bold">{t('cookiePolicy.essential')}</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">{t('cookiePolicy.themeTitle')}</h3>
              <p className="text-micro text-slate-500">
                {t('cookiePolicy.themeBody')}
              </p>
            </div>

            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <span className="text-micro font-mono text-accent font-bold">{t('cookiePolicy.essential')}</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">{t('cookiePolicy.consentTitle')}</h3>
              <p className="text-micro text-slate-500">
                {t('cookiePolicy.consentBody')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('cookiePolicy.s3Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('cookiePolicy.s3Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('cookiePolicy.s4Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('cookiePolicy.s4Body')}
        </p>
      </section>
    </article>
  );
};
