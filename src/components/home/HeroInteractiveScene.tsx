import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConstructionScene } from '../3d/ConstructionScene';
import { ConcreteSlab } from '../3d/ConcreteSlab';
import { calculateConcrete } from '../../lib/calculators/concrete/calculator';
import type { UnitSystem } from '../../types/layout';
import { formatNumber } from '../../lib/calculators/common/math';
import { ArrowRight, Sliders, Box, Compass } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';

interface HeroInteractiveSceneProps {
  unitSystem: UnitSystem;
  calculatorTo: string;
  onExploreTools: () => void;
}

export const HeroInteractiveScene: React.FC<HeroInteractiveSceneProps> = ({
  unitSystem,
  calculatorTo,
  onExploreTools,
}) => {
  const isMetric = unitSystem === 'metric';
  const { t } = useLocale();

  const [heroLength, setHeroLength] = useState<number>(isMetric ? 6 : 20);
  const [heroWidth, setHeroWidth] = useState<number>(isMetric ? 3 : 10);
  const [heroThickness, setHeroThickness] = useState<number>(isMetric ? 10 : 4);
  const [heroWaste] = useState<number>(10);

  const heroResult = calculateConcrete({
    length: heroLength,
    width: heroWidth,
    thickness: heroThickness,
    wastePercent: heroWaste,
    isMetric,
  });

  return (
    <section className="relative pt-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Editorial SaaS Typography & Direct Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-micro font-mono text-accent uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-display sm:text-display-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-sans leading-[1.05]">
              {t('hero.titleLine1')} <br />
              <span className="text-accent">{t('hero.titleAccent')}</span>
            </h1>

            <p className="text-body sm:text-heading-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {t('hero.body')}
            </p>
          </div>

          {/* Interactive Mini-Tool Controller in Hero */}
          <div className="p-5 sm:p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-elevated space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-charcoal-800 pb-3">
              <span className="text-heading-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                <span>{t('hero.previewTitle')}</span>
              </span>
              <span className="text-micro font-mono text-slate-400">
                {t('hero.previewHint')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Length */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-micro font-mono">
                  <span className="text-slate-500">{t('hero.length')}</span>
                  <span className="text-accent font-semibold">{formatNumber(heroLength)} {isMetric ? 'm' : 'ft'}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  min={0.5}
                  max={300}
                  value={heroLength}
                  onChange={(e) => setHeroLength(Math.max(0.5, parseFloat(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm text-right tech-focus"
                />
              </div>

              {/* Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-micro font-mono">
                  <span className="text-slate-500">{t('hero.width')}</span>
                  <span className="text-accent font-semibold">{formatNumber(heroWidth)} {isMetric ? 'm' : 'ft'}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  min={0.5}
                  max={200}
                  value={heroWidth}
                  onChange={(e) => setHeroWidth(Math.max(0.5, parseFloat(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm text-right tech-focus"
                />
              </div>

              {/* Thickness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-micro font-mono">
                  <span className="text-slate-500">{t('hero.thickness')}</span>
                  <span className="text-accent font-semibold">{formatNumber(heroThickness)} {isMetric ? 'cm' : 'in'}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  min={0.5}
                  max={36}
                  value={heroThickness}
                  onChange={(e) => setHeroThickness(Math.max(0.5, parseFloat(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm text-right tech-focus"
                />
              </div>
            </div>

            {/* Live Computed Takeoff Pill */}
            <div className="pt-3 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-body-sm font-mono">
              <span className="text-slate-500 font-sans text-caption">{t('hero.estimatedTakeoff')}</span>
              <div className="flex items-center gap-2">
                <span className="text-accent font-bold text-heading-md tabular-nums">
                  {isMetric ? `${heroResult.totalVolumeM3} m³` : `${heroResult.totalCubicYards} yd³`}
                </span>
                <span className="text-micro text-slate-400 font-sans">
                  {t('hero.bags', { count: heroResult.bags80lb })}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={calculatorTo}
              className="px-6 py-3.5 rounded-tech bg-accent text-white font-semibold text-body-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-tech-elevated"
            >
              <span>{t('hero.exploreCalculators')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={onExploreTools}
              className="px-6 py-3.5 rounded-tech border border-paper-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-slate-800 dark:text-slate-200 font-semibold text-body-sm hover:bg-paper-100 dark:hover:bg-charcoal-800 transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-accent" />
              <span>{t('hero.browseGuides')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Rich 3D Viewport with Architectural Grid Framing (6 cols) */}
        <div className="lg:col-span-6">
          <div className="relative rounded-tech-lg overflow-hidden border border-paper-300 dark:border-charcoal-750 shadow-tech-elevated bg-paper-200 dark:bg-charcoal-900">
            {/* Architectural Grid Corner Accents */}
            <div className="absolute top-3 left-3 z-20 w-3 h-3 border-t-2 border-l-2 border-accent pointer-events-none" />
            <div className="absolute top-3 right-3 z-20 w-3 h-3 border-t-2 border-r-2 border-accent pointer-events-none" />
            <div className="absolute bottom-3 left-3 z-20 w-3 h-3 border-b-2 border-l-2 border-accent pointer-events-none" />
            <div className="absolute bottom-3 right-3 z-20 w-3 h-3 border-b-2 border-r-2 border-accent pointer-events-none" />

            <div className="w-full aspect-[4/3]">
              <ConstructionScene cameraPosition={[7, 5.5, 8]}>
                <ConcreteSlab
                  length={heroLength}
                  width={heroWidth}
                  thickness={heroThickness}
                  unit={unitSystem}
                />
              </ConstructionScene>
            </div>

            {/* Viewport Overlay Metadata */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-tech bg-charcoal-950/90 backdrop-blur-md border border-charcoal-700/60 text-white text-micro font-mono pointer-events-none">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Box className="w-3.5 h-3.5 text-accent" />
                <span>{t('hero.viewport')}</span>
              </span>
              <span className="text-amber-400 font-semibold">
                {t('hero.meshSync')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
