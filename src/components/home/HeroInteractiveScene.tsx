import React, { useState } from 'react';
import { ConstructionScene } from '../3d/ConstructionScene';
import { ConcreteSlab } from '../3d/ConcreteSlab';
import { calculateConcrete } from '../../lib/calculators/concrete/calculator';
import type { UnitSystem } from '../../types/layout';
import { formatNumber } from '../../lib/calculators/common/math';
import { ArrowRight, Sliders, Box } from 'lucide-react';

interface HeroInteractiveSceneProps {
  unitSystem: UnitSystem;
  onLaunchCalculator: () => void;
  onExploreTools: () => void;
}

export const HeroInteractiveScene: React.FC<HeroInteractiveSceneProps> = ({
  unitSystem,
  onLaunchCalculator,
  onExploreTools,
}) => {
  const isMetric = unitSystem === 'metric';

  // Live interactive dimensions in hero - supports arbitrary numeric input (e.g. 37.42)
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
    <section className="relative pt-2 pb-8">
      {/* 2-Column Responsive Layout: Left Copy & Controls, Right 3D Scene */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Brand, Value Proposition & Live Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Interactive 3D Engine</span>
              <span aria-hidden="true">·</span>
              <span>Parametric Material Takeoff</span>
            </div>

            <h1 className="text-display sm:text-display-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans text-balance leading-none">
              CONSTRUCTION CALCULATORS & 3D MATERIAL ESTIMATION
            </h1>

            <p className="text-body sm:text-heading-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Transparent construction estimates with interactive 3D visualization. Physical dimensions directly drive live geometric models, formula-based material estimates, and purchasing takeoffs with clear calculation breakdowns.
            </p>
          </div>

          {/* Interactive Mini-Tool Controller in Hero */}
          <div className="p-4 sm:p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-charcoal-800 pb-2.5">
              <span className="text-heading-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                <span>Interactive 3D Slab Demo</span>
              </span>
              <span className="text-micro font-mono text-slate-500">
                Type arbitrary dimensions or slide
              </span>
            </div>

            {/* Direct Numeric Input Boxes + Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Length */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-micro font-mono">
                  <span className="text-slate-500">Length</span>
                  <span className="text-accent font-semibold">{formatNumber(heroLength)} {isMetric ? 'm' : 'ft'}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min={0.5}
                    max={300}
                    value={heroLength}
                    onChange={(e) => setHeroLength(Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm text-right pr-7 tech-focus"
                  />
                  <span className="absolute right-2 top-1.5 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
                <input
                  type="range"
                  min={isMetric ? 2 : 6}
                  max={isMetric ? 25 : 80}
                  step={isMetric ? 0.25 : 0.5}
                  value={heroLength}
                  onChange={(e) => setHeroLength(parseFloat(e.target.value) || 2)}
                  className="w-full accent-accent cursor-pointer tech-focus"
                />
              </div>

              {/* Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-micro font-mono">
                  <span className="text-slate-500">Width</span>
                  <span className="text-accent font-semibold">{formatNumber(heroWidth)} {isMetric ? 'm' : 'ft'}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min={0.5}
                    max={200}
                    value={heroWidth}
                    onChange={(e) => setHeroWidth(Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm text-right pr-7 tech-focus"
                  />
                  <span className="absolute right-2 top-1.5 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
                <input
                  type="range"
                  min={isMetric ? 1.5 : 4}
                  max={isMetric ? 15 : 50}
                  step={isMetric ? 0.25 : 0.5}
                  value={heroWidth}
                  onChange={(e) => setHeroWidth(parseFloat(e.target.value) || 1)}
                  className="w-full accent-accent cursor-pointer tech-focus"
                />
              </div>

              {/* Thickness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-micro font-mono">
                  <span className="text-slate-500">Thickness</span>
                  <span className="text-accent font-semibold">{formatNumber(heroThickness)} {isMetric ? 'cm' : 'in'}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min={0.5}
                    max={36}
                    value={heroThickness}
                    onChange={(e) => setHeroThickness(Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm text-right pr-7 tech-focus"
                  />
                  <span className="absolute right-2 top-1.5 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'cm' : 'in'}
                  </span>
                </div>
                <input
                  type="range"
                  min={isMetric ? 5 : 2}
                  max={isMetric ? 30 : 12}
                  step={isMetric ? 0.5 : 0.25}
                  value={heroThickness}
                  onChange={(e) => setHeroThickness(parseFloat(e.target.value) || 2)}
                  className="w-full accent-accent cursor-pointer tech-focus"
                />
              </div>
            </div>

            {/* Quick Presets for Demo */}
            <div className="flex items-center gap-1.5 pt-1 text-micro font-mono">
              <span className="text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setHeroLength(isMetric ? 10 : 30);
                  setHeroWidth(isMetric ? 1 : 3);
                  setHeroThickness(isMetric ? 10 : 4);
                }}
                className="px-2 py-0.5 rounded bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 text-slate-700 dark:text-slate-300 hover:text-accent"
              >
                Walkway
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroLength(isMetric ? 6 : 20);
                  setHeroWidth(isMetric ? 3 : 10);
                  setHeroThickness(isMetric ? 10 : 4);
                }}
                className="px-2 py-0.5 rounded bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 text-slate-700 dark:text-slate-300 hover:text-accent"
              >
                Patio
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroLength(isMetric ? 7.3 : 24);
                  setHeroWidth(isMetric ? 7.3 : 24);
                  setHeroThickness(isMetric ? 15 : 6);
                }}
                className="px-2 py-0.5 rounded bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 text-slate-700 dark:text-slate-300 hover:text-accent"
              >
                Garage
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroLength(37.42);
                  setHeroWidth(13.75);
                  setHeroThickness(5.5);
                }}
                className="px-2 py-0.5 rounded bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 text-slate-700 dark:text-slate-300 hover:text-accent"
              >
                Arbitrary Decimal (37.42′)
              </button>
            </div>

            {/* Live Computed Takeoff Pill */}
            <div className="pt-2 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-body-sm font-mono">
              <span className="text-slate-500 font-sans text-caption">Estimated Takeoff:</span>
              <div className="flex items-center gap-2">
                <span className="text-accent font-bold text-heading-sm tabular-nums">
                  {isMetric ? `${heroResult.totalVolumeM3} m³` : `${heroResult.totalCubicYards} yd³`}
                </span>
                <span className="text-micro text-slate-400 font-sans">
                  ({heroResult.bags80lb} bags / {heroResult.truckLoads} trucks)
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={onLaunchCalculator}
              className="px-5 py-3 rounded-tech bg-accent text-white font-medium text-body-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-tech-card"
            >
              <span>Launch Full Concrete Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onExploreTools}
              className="px-5 py-3 rounded-tech border border-paper-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-slate-800 dark:text-slate-200 font-medium text-body-sm hover:bg-paper-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              Explore 3D Calculators
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive 3D Viewport (6 cols) */}
        <div className="lg:col-span-6 w-full aspect-[4/3] rounded-tech-lg overflow-hidden border border-paper-300 dark:border-charcoal-750 shadow-tech-card bg-paper-200 dark:bg-charcoal-900 relative">
          <ConstructionScene cameraPosition={[7, 5.5, 8]}>
            <ConcreteSlab
              length={heroLength}
              width={heroWidth}
              thickness={heroThickness}
              unit={unitSystem}
            />
          </ConstructionScene>

          {/* Viewport Overlay Controls Callout */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-tech bg-charcoal-950/80 backdrop-blur-md border border-charcoal-700/60 text-white text-micro font-mono pointer-events-none">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Box className="w-3.5 h-3.5 text-accent" />
              <span>Rotate: Drag · Zoom: Scroll · Pan: Right-Click</span>
            </span>
            <span className="text-amber-400 font-semibold">
              Live Mesh Sync
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
