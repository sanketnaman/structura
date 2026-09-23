import React from 'react';
import { HeroInteractiveScene } from './HeroInteractiveScene';
import type { UnitSystem } from '../../types/layout';
import { TOOL_REGISTRY, CATEGORIES } from '../../lib/tools/registry';
import {
  Box,
  Layers,
  PaintBucket,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Calculator,
  Compass,
  Hammer,
  Truck,
  FileSpreadsheet,
  Ruler,
  AlertTriangle,
} from 'lucide-react';
import { AdSlot } from '../common/AdSlot';

interface HomePageProps {
  unitSystem: UnitSystem;
  onNavigateToTool: (toolSlug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  unitSystem,
  onNavigateToTool,
}) => {
  const isMetric = unitSystem === 'metric';

  return (
    <div className="space-y-20">
      {/* 1. HERO SECTION: Interactive 3D Parametric Demo */}
      <HeroInteractiveScene
        unitSystem={unitSystem}
        onLaunchCalculator={() => onNavigateToTool('concrete-slab-calculator')}
        onExploreTools={() => {
          const el = document.getElementById('mvp-tools');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. CORE METHODOLOGY: 4-Step Technical Takeoff Pipeline */}
      <section className="p-6 sm:p-8 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-6">
        <div className="border-b border-paper-200 dark:border-charcoal-800 pb-4">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-1">
            <span>Engineering Workflow</span>
            <span aria-hidden="true">·</span>
            <span>Transparent Calculation Breakdowns</span>
          </div>
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            How Visual Construction Estimation Works
          </h2>
          <p className="text-caption text-slate-600 dark:text-slate-400 max-w-2xl">
            STRUCTURA connects physical site dimensions directly to parametric 3D geometry and verified mathematical formulas to provide clear planning estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="space-y-2.5 p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">01. ARBITRARY INPUT</span>
              <Ruler className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Field Dimensions
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter real measurements in Imperial or Metric. Arbitrary decimal values (e.g. 37.42 ft, 5.5 in) are accepted with instant bounds validation.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2.5 p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">02. 3D SPATIAL MODEL</span>
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Parametric Visuals
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Mesh coordinates dynamically scale along X, Y, and Z axes. Dimension callouts visually verify proportions, preventing unit confusion.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2.5 p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">03. FORMULA ENGINE</span>
              <Calculator className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Volume & Waste Math
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard geometric equations ($L \times W \times H$) combined with configurable trade allowances for subgrade dips, form deflection, and cuts.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-2.5 p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">04. ORDER TAKEOFF</span>
              <Truck className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Purchasing Units
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Volumes translate immediately into real commercial units: ready-mix truckloads (~9 yd³), 80 lb / 60 lb bags, or 5-gal commercial pails.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PHASE 1 MVP TOOLS WORKSPACE SHOWCASE */}
      <section id="mvp-tools" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-paper-300 dark:border-charcoal-750 pb-4">
          <div>
            <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-1">
              <span>Production Tools</span>
              <span aria-hidden="true">·</span>
              <span>Phase 1 Workspaces</span>
            </div>
            <h2 className="text-heading-xl font-bold text-slate-900 dark:text-white">
              Production 3D Construction Calculators
            </h2>
            <p className="text-caption text-slate-600 dark:text-slate-400 max-w-xl">
              Each workspace features real-time 3D parametric rendering, unit conversions, customizable allowances, and instant copy/print takeoffs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool Card 1: Concrete */}
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card hover:border-accent dark:hover:border-accent transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-tech bg-amber-50 dark:bg-amber-950/50 text-accent flex items-center justify-center border border-amber-200/50 dark:border-amber-800/40">
                  <Box className="w-6 h-6" />
                </div>
                <span className="text-micro font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Active Tool
                </span>
              </div>

              <div>
                <span className="text-micro font-mono text-slate-500 uppercase">Concrete & Masonry</span>
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  Concrete Slab Calculator
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Calculate cubic yards, cubic meters, ready-mix truckloads, and 80lb/60lb pre-mix bags. Features subgrade gravel layers, expansion joints, and optional unit pricing.
                </p>
              </div>

              <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-200 dark:border-charcoal-800 text-micro font-mono space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>3D Model:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Parametric Slab + Base</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Units:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">yd³ · m³ · 80 lb Bags</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-paper-200 dark:border-charcoal-800 mt-6">
              <button
                type="button"
                onClick={() => onNavigateToTool('concrete-slab-calculator')}
                className="w-full py-2.5 rounded-tech bg-paper-200 dark:bg-charcoal-750 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Open Concrete Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tool Card 2: Brick */}
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card hover:border-accent dark:hover:border-accent transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-tech bg-amber-50 dark:bg-amber-950/50 text-accent flex items-center justify-center border border-amber-200/50 dark:border-amber-800/40">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-micro font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Active Tool
                </span>
              </div>

              <div>
                <span className="text-micro font-mono text-slate-500 uppercase">Masonry & Finishes</span>
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  Brick & Mortar Calculator
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Calculate facing bricks and Type N mortar bag allowances with live running-bond masonry coursing. Supports Modular, Queen, King, and double wythe walls.
                </p>
              </div>

              <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-200 dark:border-charcoal-800 text-micro font-mono space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>3D Model:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Coursed Wall + Footing</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Outputs:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Bricks · Mortar Bags · ft²</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-paper-200 dark:border-charcoal-800 mt-6">
              <button
                type="button"
                onClick={() => onNavigateToTool('brick-mortar-calculator')}
                className="w-full py-2.5 rounded-tech bg-paper-200 dark:bg-charcoal-750 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Open Brick Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tool Card 3: Paint */}
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card hover:border-accent dark:hover:border-accent transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-tech bg-amber-50 dark:bg-amber-950/50 text-accent flex items-center justify-center border border-amber-200/50 dark:border-amber-800/40">
                  <PaintBucket className="w-6 h-6" />
                </div>
                <span className="text-micro font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Active Tool
                </span>
              </div>

              <div>
                <span className="text-micro font-mono text-slate-500 uppercase">Surfaces & Coatings</span>
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  Architectural Paint Calculator
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Calculate required paint gallons and commercial 5-gal pails with door and window deductions, multi-coat coverage, and a 3D cutaway room view.
                </p>
              </div>

              <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-200 dark:border-charcoal-800 text-micro font-mono space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>3D Model:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Room Cutaway + Openings</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Outputs:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">5-Gal Pails · Gallons · m²</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-paper-200 dark:border-charcoal-800 mt-6">
              <button
                type="button"
                onClick={() => onNavigateToTool('paint-calculator')}
                className="w-full py-2.5 rounded-tech bg-paper-200 dark:bg-charcoal-750 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Open Paint Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Non-intrusive AdSlot between main sections */}
      <AdSlot slotId="home-mid-content" />

      {/* 4. EXPANDED TAXONOMY & ROADMAP CATALOG */}
      <section className="space-y-6">
        <div className="border-b border-paper-300 dark:border-charcoal-750 pb-4">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-1">
            <span>Engineering Taxonomy</span>
            <span aria-hidden="true">·</span>
            <span>Comprehensive Directory</span>
          </div>
          <h2 className="text-heading-xl font-bold text-slate-900 dark:text-white">
            Construction Technology Directory
          </h2>
          <p className="text-caption text-slate-600 dark:text-slate-400 max-w-xl">
            Browse our complete catalog of active 3D calculators alongside upcoming engineering modules currently in development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const catTools = TOOL_REGISTRY.filter((t) => t.category === cat.id);
            return (
              <div
                key={cat.id}
                className="p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 flex flex-col justify-between"
              >
                <div>
                  <span className="text-micro font-mono text-accent font-bold uppercase block mb-1">
                    {cat.id.replace('-', ' ')}
                  </span>
                  <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-caption text-slate-500 mb-4 line-clamp-2">
                    {cat.description}
                  </p>

                  <ul className="space-y-2 border-t border-paper-200 dark:border-charcoal-800 pt-3">
                    {catTools.map((tool) => (
                      <li key={tool.slug} className="flex items-center justify-between text-micro">
                        {tool.implemented ? (
                          <button
                            type="button"
                            onClick={() => onNavigateToTool(tool.slug)}
                            className="font-medium text-slate-800 dark:text-slate-200 hover:text-accent text-left flex items-center gap-1.5 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{tool.name}</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>{tool.name}</span>
                          </span>
                        )}

                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                            tool.implemented
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                              : 'bg-paper-200 dark:bg-charcoal-800 text-slate-400'
                          }`}
                        >
                          {tool.implemented ? 'Active' : 'Roadmap'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PRACTICAL FIELD CONSIDERATIONS & FAQ */}
      <section className="p-6 sm:p-8 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-6">
        <div className="border-b border-paper-200 dark:border-charcoal-800 pb-4">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Field Knowledge Base</span>
          </div>
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            Practical Construction Takeoff Principles
          </h2>
          <p className="text-caption text-slate-600 dark:text-slate-400 max-w-2xl">
            Frequently asked questions about subgrade deflection, waste factors, mortar allowances, and opening deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-caption">
          <div className="space-y-2 p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              Why must an ordering allowance be added to concrete slabs?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Excavated subgrades are rarely laser-level. Minor dips and depressions of even 1/2 inch across a 20×20 ft patio increase concrete consumption by nearly 0.6 cubic yards. Wooden formwork also flexes slightly outward under wet hydrostatic pressure. Adding 5% to 10% ordering margin prevents cold joints caused by short-pour emergencies.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              How many modular bricks are needed per square foot of wall?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard modular facing bricks (7-5/8" × 2-1/4" × 3-5/8") with a standard 3/8" bed and head joint yield an effective coursing face of 8" × 2-2/3". This mathematically equates to approximately 6.75 to 7.0 bricks per square foot of single-wythe wall area.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              When should openings be deducted in paint estimation?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard interior passage doors typically measure ~21 sq ft (2.0 m²) and standard residential windows occupy ~15 sq ft (1.4 m²). Deducting major openings prevents substantial paint over-purchasing on multi-room projects.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              How do bag yields compare to delivered ready-mix trucks?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              One cubic yard contains 27 cubic feet. A standard 80 lb pre-mix concrete bag yields approximately 0.60 cubic feet, meaning it requires 45 bags of 80 lb concrete (or 60 bags of 60 lb concrete) to make one cubic yard. For pours over 2 cubic yards, delivered ready-mix trucks are typically more economical.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
