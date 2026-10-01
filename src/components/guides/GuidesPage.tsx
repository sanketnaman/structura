import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Box, PaintBucket, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { AdSlot } from '../common/AdSlot';
import { useViewToPath } from '../../lib/routes';
import { useLocale } from '../../lib/i18n/context';

export const GuidesPage: React.FC = () => {
  const { t } = useLocale();
  const viewToPath = useViewToPath();

  return (
    <article className="max-w-4xl mx-auto space-y-12 py-2 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>{t('guides.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('guides.title')}
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t('guides.body')}
        </p>
      </div>

      {/* Guide 1: Concrete Volume */}
      <section className="rounded-tech-lg overflow-hidden bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card">
        <div className="relative h-44 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/45 via-transparent to-transparent z-10" />
          <img
            src="/images/guides/construction-estimation-guide.webp"
            alt={t('guides.concreteAlt')}
            width={900}
            height={600}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase">
              <Box className="w-4 h-4" />
              <span>{t('guides.concreteBadge')}</span>
            </div>
            <Link
              to={viewToPath('concrete-slab-calculator')}
              className="flex items-center gap-1 text-micro font-mono text-accent hover:underline"
            >
              {t('guides.launchCalculator')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            {t('guides.concreteTitle')}
          </h2>

          <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: t('guides.concreteIntro') }} />
            <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 font-mono text-micro text-slate-900 dark:text-white">
              Volume (yd³) = [ Length (ft) × Width (ft) × (Thickness (in) ÷ 12) ] ÷ 27
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-body-sm pt-2">
              {t('guides.concreteSubhead')}
            </h3>
            <p>
              {t('guides.concreteBody')}
            </p>
            <figure className="pt-1">
              <div className="relative rounded-tech overflow-hidden border border-paper-300 dark:border-charcoal-750 bg-paper-200 dark:bg-charcoal-900 h-48 sm:h-56">
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/35 via-transparent to-transparent z-10" />
                <img
                  src="/images/guides/concrete-subgrade-guide.webp"
                  alt={t('guides.concreteCaptionAlt')}
                  width={900}
                  height={600}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-micro font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('guides.concreteCaption')}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="guides-middle-ad" />

      {/* Guide 2: Masonry Coursing */}
      <section className="rounded-tech-lg overflow-hidden bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card">
        <div className="relative h-44 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/45 via-transparent to-transparent z-10" />
          <img
            src="/images/guides/masonry-coursing-guide.webp"
            alt={t('guides.masonryAlt')}
            width={900}
            height={600}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase">
              <Layers className="w-4 h-4" />
              <span>{t('guides.masonryBadge')}</span>
            </div>
            <Link
              to={viewToPath('brick-mortar-calculator')}
              className="flex items-center gap-1 text-micro font-mono text-accent hover:underline"
            >
              {t('guides.launchCalculator')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            {t('guides.masonryTitle')}
          </h2>

          <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
            <p>
              {t('guides.masonryIntro')}
            </p>
            <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 font-mono text-micro text-slate-900 dark:text-white">
              Effective Brick Area (sq ft) = [ (Length + Joint) × (Height + Joint) ] ÷ 144
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('guides.masonryBody1') }} />
          </div>
        </div>
      </section>

      {/* Guide 3: Paint Coverage */}
      <section className="rounded-tech-lg overflow-hidden bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card">
        <div className="relative h-44 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/45 via-transparent to-transparent z-10" />
          <img
            src="/images/guides/paint-coverage-guide.webp"
            alt={t('guides.paintAlt')}
            width={900}
            height={600}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase">
              <PaintBucket className="w-4 h-4" />
              <span>{t('guides.paintBadge')}</span>
            </div>
            <Link
              to={viewToPath('paint-calculator')}
              className="flex items-center gap-1 text-micro font-mono text-accent hover:underline"
            >
              {t('guides.launchCalculator')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            {t('guides.paintTitle')}
          </h2>

          <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
            <p>
              {t('guides.paintIntro')}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
              <li>{t('guides.paintBullet1')}</li>
              <li>{t('guides.paintBullet2')}</li>
              <li>{t('guides.paintBullet3')}</li>
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
};
