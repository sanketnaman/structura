import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Box, Layers, Calculator, ShieldAlert, Users, Target } from 'lucide-react';
import { useViewToPath } from '../../lib/routes';
import { useLocale } from '../../lib/i18n/context';

export const AboutPage: React.FC = () => {
  const { t } = useLocale();
  const viewToPath = useViewToPath();

  return (
    <article className="max-w-4xl mx-auto space-y-12 py-4 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>{t('about.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('about.title')}
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t('about.body')}
        </p>
      </div>

      {/* Brand visual */}
      <div className="relative h-56 sm:h-72 lg:h-80 rounded-tech-lg overflow-hidden border border-paper-300 dark:border-charcoal-750 bg-paper-200 dark:bg-charcoal-900 shadow-tech-card">
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/35 via-transparent to-transparent z-10" />
        <img
          src="/images/about/mixtally-construction-planning.webp"
          alt={t('about.imageAlt')}
          width={900}
          height={600}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* The Problem We Solve */}
      <section className="space-y-4">
        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          {t('about.problemTitle')}
        </h2>
        <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            {t('about.problemBody1')}
          </p>
          <p>
            {t('about.problemBody2')}
          </p>
        </div>
      </section>

      {/* Why 3D Visualization */}
      <section className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Box className="w-5 h-5 text-accent" />
          <span>{t('about.why3dTitle')}</span>
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('about.why3dBody')}
        </p>
      </section>

      {/* Methodology */}
      <section className="space-y-4">
        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          {t('about.methodTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-caption">
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="text-micro font-mono text-accent font-bold">{t('about.method1Label')}</span>
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('about.method1Title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.method1Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="text-micro font-mono text-accent font-bold">{t('about.method2Label')}</span>
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('about.method2Title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.method2Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="text-micro font-mono text-accent font-bold">{t('about.method3Label')}</span>
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('about.method3Title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.method3Body')}
            </p>
          </div>
        </div>
      </section>

      {/* Who Uses MixTally */}
      <section className="space-y-4">
        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          {t('about.audienceTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-caption">
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('about.audience1Title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.audience1Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('about.audience2Title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.audience2Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('about.audience3Title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.audience3Body')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('about.audience4Title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about.audience4Body')}
            </p>
          </div>
        </div>
      </section>

      {/* Scope Limitations */}
      <section className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-3">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-accent" />
          <span>{t('about.scopeTitle')}</span>
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('about.scopeBodyLead')}
          <Link
            to={viewToPath('disclaimer')}
            className="inline-block text-accent underline font-medium"
          >
            {t('about.constructionDisclaimer')}
          </Link>
          .
        </p>
      </section>
    </article>
  );
};
