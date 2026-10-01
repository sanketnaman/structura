import React from 'react';
import { ShieldCheck, Lock, Eye, Server, Globe } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';

export const PrivacyPage: React.FC = () => {
  const { t } = useLocale();

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>{t('privacy.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('privacy.title')}
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          {t('privacy.meta')}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('privacy.s1Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('privacy.s1Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('privacy.s2Title')}
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            <strong>{t('privacy.processing1Label')}</strong>{' '}
            {t('privacy.processing1Body')}
          </p>
          <p>
            <strong>{t('privacy.processing2Label')}</strong>{' '}
            {t('privacy.processing2Body')}
          </p>
          <p>
            <strong>{t('privacy.processing3Label')}</strong>{' '}
            {t('privacy.processing3Body')}
          </p>
          <p>
            <strong>{t('privacy.processing4Label')}</strong>{' '}
            {t('privacy.processing4Body')}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('privacy.s3Title')}
        </h2>
        <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 text-caption text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            {t('privacy.ads1')}
          </p>
          <p>
            {t('privacy.ads2')}
          </p>
          <p>
            {t('privacy.ads3Lead')}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              {t('privacy.ads3Link')}
            </a>
            {t('privacy.ads3Tail')}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('privacy.s4Title')}
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            {t('privacy.s4Body')}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('privacy.s5Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('privacy.s5Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('privacy.s6Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('privacy.contactLead')}
          <a
            href="mailto:support@mixtally.com"
            className="text-accent underline font-mono"
          >
            support@mixtally.com
          </a>
          {t('privacy.contactTail')}
        </p>
      </section>
    </article>
  );
};
