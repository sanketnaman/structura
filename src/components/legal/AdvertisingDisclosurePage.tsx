import React from 'react';
import { DollarSign, ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';

export const AdvertisingDisclosurePage: React.FC = () => {
  const { t } = useLocale();

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <DollarSign className="w-4 h-4" />
          <span>{t('advertising.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('advertising.title')}
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          {t('advertising.meta')}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('advertising.s1Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('advertising.s1Body')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('advertising.s2Title')}
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            {t('advertising.s2Lead')}
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>
              <strong>{t('advertising.p1Label')}</strong>{' '}
              {t('advertising.p1Body')}
            </li>
            <li>
              <strong>{t('advertising.p2Label')}</strong>{' '}
              {t('advertising.p2Body')}
            </li>
            <li>
              <strong>{t('advertising.p3Label')}</strong>{' '}
              {t('advertising.p3Body')}
            </li>
            <li>
              <strong>{t('advertising.p4Label')}</strong>{' '}
              {t('advertising.p4Body')}
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          {t('advertising.s3Title')}
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('advertising.s3Lead')}
          <a
            href="https://myadcenter.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline inline-flex items-center gap-1 font-medium"
          >
            {t('advertising.s3Link')} <ExternalLink className="w-3 h-3" />
          </a>
          {t('advertising.s3Tail')}
        </p>
      </section>
    </article>
  );
};
