import React from 'react';
import { Link } from 'react-router-dom';
import { HeroInteractiveScene } from './HeroInteractiveScene';
import type { UnitSystem } from '../../types/layout';
import { TOOL_REGISTRY, CATEGORIES } from '../../lib/tools/registry';
import { useViewToPath } from '../../lib/routes';
import {
  Box,
  Layers,
  PaintBucket,
  ArrowRight,
  Calculator,
  Ruler,
  Maximize2,
  Truck,
  HelpCircle,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { AdSlot } from '../common/AdSlot';
import { useLocale } from '../../lib/i18n/context';
import { useToolText } from '../../lib/i18n/toolText';

interface HomePageProps {
  unitSystem: UnitSystem;
}

export const HomePage: React.FC<HomePageProps> = ({ unitSystem }) => {
  const isMetric = unitSystem === 'metric';
  const { t } = useLocale();
  const viewToPath = useViewToPath();
  const toolText = useToolText();

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION: Editorial Dark/Graphite Product Showcase */}
      <HeroInteractiveScene
        unitSystem={unitSystem}
        calculatorTo={viewToPath('concrete-slab-calculator')}
        onExploreTools={() => {
          const el = document.getElementById('production-calculators');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. CONSTRUCTION CATEGORY VISUAL SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-paper-300 dark:border-charcoal-750 pb-6">
          <div>
            <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{t('home.categoriesEyebrow1')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('home.categoriesEyebrow2')}</span>
            </div>
            <h2 className="text-display sm:text-display-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {t('home.categoriesTitle')}
            </h2>
            <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl mt-2">
              {t('home.categoriesBody')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1: Concrete */}
          <div className="group rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 overflow-hidden shadow-tech-card hover:border-accent transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-48 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent z-10" />
              {/* Local Image Asset with proper SEO attributes & fallback */}
              <img
                src="/images/construction/concrete-slab-construction.webp"
                alt={t('home.concreteAlt')}
                width={900}
                height={600}
                loading="lazy"
                onError={(e) => {
                  // Fallback visual container if image not yet generated
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
                <Box className="w-24 h-24 text-accent" />
              </div>
              <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between">
                <span className="text-micro font-mono uppercase px-2.5 py-1 rounded bg-accent/90 text-white font-semibold">
                  {t('home.concreteBadge')}
                </span>
                <span className="text-micro font-mono text-slate-300">{t('home.activeWorkspace')}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  {t('home.concreteTitle')}
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('home.concreteBody')}
                </p>
              </div>

              <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800">
                <Link
                  to={viewToPath('concrete-slab-calculator')}
                  className="w-full py-2.5 rounded-tech bg-paper-100 dark:bg-charcoal-800 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('home.openConcrete')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Category 2: Masonry */}
          <div className="group rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 overflow-hidden shadow-tech-card hover:border-accent transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-48 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent z-10" />
              <img
                src="/images/construction/brick-masonry-wall.webp"
                alt={t('home.masonryAlt')}
                width={900}
                height={600}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
                <Layers className="w-24 h-24 text-accent" />
              </div>
              <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between">
                <span className="text-micro font-mono uppercase px-2.5 py-1 rounded bg-accent/90 text-white font-semibold">
                  {t('home.masonryBadge')}
                </span>
                <span className="text-micro font-mono text-slate-300">{t('home.activeWorkspace')}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  {t('home.masonryTitle')}
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('home.masonryBody')}
                </p>
              </div>

              <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800">
                <Link
                  to={viewToPath('brick-mortar-calculator')}
                  className="w-full py-2.5 rounded-tech bg-paper-100 dark:bg-charcoal-800 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('home.openBrick')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Category 3: Finishes */}
          <div className="group rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 overflow-hidden shadow-tech-card hover:border-accent transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-48 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent z-10" />
              <img
                src="/images/construction/interior-wall-painting.webp"
                alt={t('home.paintAlt')}
                width={900}
                height={600}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
                <PaintBucket className="w-24 h-24 text-accent" />
              </div>
              <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between">
                <span className="text-micro font-mono uppercase px-2.5 py-1 rounded bg-accent/90 text-white font-semibold">
                  {t('home.paintBadge')}
                </span>
                <span className="text-micro font-mono text-slate-300">{t('home.activeWorkspace')}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  {t('home.paintTitle')}
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('home.paintBody')}
                </p>
              </div>

              <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800">
                <Link
                  to={viewToPath('paint-calculator')}
                  className="w-full py-2.5 rounded-tech bg-paper-100 dark:bg-charcoal-800 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('home.openPaint')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCTION CALCULATORS DIRECTORY SECTION */}
      <section id="production-calculators" className="space-y-8 p-8 rounded-tech-lg bg-[var(--production-bg)] text-[var(--production-heading)] border border-[var(--production-border)] shadow-tech-elevated">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--production-divider)] pb-6">
          <div>
            <div className="flex items-center gap-2 text-micro font-mono uppercase tracking-wider mb-2 text-[var(--production-eyebrow)]">
              <span>{t('home.productionEyebrow1')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('home.productionEyebrow2')}</span>
            </div>
            <h2 className="text-heading-lg sm:text-display font-bold">
              {t('home.productionTitle')}
            </h2>
            <p className="text-caption text-[var(--production-body)] max-w-xl mt-2">
              {t('home.productionBody')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOL_REGISTRY.filter((entry) => entry.implemented).map((tool) => (
            <div
              key={tool.slug}
              className="p-6 rounded-tech bg-[var(--production-card)] border border-[var(--production-card-border)] hover:border-accent transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-micro font-mono uppercase px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold">
                    {tool.category}
                  </span>
                  <span className="text-micro font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400" />
                    Live Workspace
                  </span>
                </div>
                <div>
                  <h3 className="text-heading-md font-bold text-[var(--production-card-heading)] group-hover:text-accent transition-colors">
                    {toolText(tool.slug, 'name', tool.name)}
                  </h3>
                  <p className="text-caption text-[var(--production-card-body)] mt-2 line-clamp-3">
                    {toolText(tool.slug, 'description', tool.description)}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--production-card-divider)] mt-6">
                <Link
                  to={viewToPath(tool.slug)}
                  className="w-full py-2.5 rounded-tech bg-charcoal-800 text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('home.launchCalculator')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AdSlot */}
      <AdSlot slotId="home-mid-content" />

      {/* 4. TECHNICAL WORKFLOW METHODOLOGY SECTION */}
      <section className="space-y-8">
        <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-2">
            <span>{t('home.workflowEyebrow1')}</span>
            <span aria-hidden="true">·</span>
            <span>{t('home.workflowEyebrow2')}</span>
          </div>
          <h2 className="text-display font-bold text-slate-900 dark:text-white">
            {t('home.workflowTitle')}
          </h2>
          <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl mt-2">
            {t('home.workflowBody')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">{t('home.step1Label')}</span>
              <Ruler className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('home.step1Title')}
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.step1Body')}
            </p>
          </div>

          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">{t('home.step2Label')}</span>
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('home.step2Title')}
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.step2Body')}
            </p>
          </div>

          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">{t('home.step3Label')}</span>
              <Calculator className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('home.step3Title')}
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.step3Body')}
            </p>
          </div>

          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">{t('home.step4Label')}</span>
              <Truck className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('home.step4Title')}
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.step4Body')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMPREHENSIVE DIRECTORY & FAQ */}
      <section className="p-8 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-8">
        <div className="border-b border-paper-200 dark:border-charcoal-800 pb-6">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{t('home.faqEyebrow')}</span>
          </div>
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            {t('home.faqTitle')}
          </h2>
          <p className="text-caption text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
            {t('home.faqBody')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-caption">
          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              {t('home.faq1Question')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.faq1Answer')}
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              {t('home.faq2Question')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.faq2Answer')}
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              {t('home.faq3Question')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.faq3Answer')}
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              {t('home.faq4Question')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.faq4Answer')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
