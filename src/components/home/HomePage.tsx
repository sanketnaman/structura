import React from 'react';
import { HeroInteractiveScene } from './HeroInteractiveScene';
import type { UnitSystem } from '../../types/layout';
import { TOOL_REGISTRY, CATEGORIES } from '../../lib/tools/registry';
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
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION: Editorial Dark/Graphite Product Showcase */}
      <HeroInteractiveScene
        unitSystem={unitSystem}
        onLaunchCalculator={() => onNavigateToTool('concrete-slab-calculator')}
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
              <span>Architectural Ecosystem</span>
              <span aria-hidden="true">·</span>
              <span>Trade Categories</span>
            </div>
            <h2 className="text-display sm:text-display-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Tools for the way you build.
            </h2>
            <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl mt-2">
              Precision calculation workspaces built specifically for structural concrete, masonry coursing, and architectural surface coatings.
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
                alt="Concrete slab construction showing length, width, and depth measurements"
                width={600}
                height={400}
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
                  Structural Concrete
                </span>
                <span className="text-micro font-mono text-slate-300">Active Workspace</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  Concrete Slab & Volume
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calculate cubic yards, ready-mix truckloads, and 80lb/60lb pre-mix bags with subgrade gravel allowances and expansion joint calculations.
                </p>
              </div>

              <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={() => onNavigateToTool('concrete-slab-calculator')}
                  className="w-full py-2.5 rounded-tech bg-paper-100 dark:bg-charcoal-800 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Concrete Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category 2: Masonry */}
          <div className="group rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 overflow-hidden shadow-tech-card hover:border-accent transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-48 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent z-10" />
              <img
                src="/images/construction/brick-masonry-wall.webp"
                alt="Brick masonry wall showing coursing and mortar application"
                width={600}
                height={400}
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
                  Masonry & Walls
                </span>
                <span className="text-micro font-mono text-slate-300">Active Workspace</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  Brick & Mortar Estimator
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compute facing bricks and Type N mortar bag quantities with live running-bond masonry coursing across Modular, Queen, and King sizes.
                </p>
              </div>

              <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={() => onNavigateToTool('brick-mortar-calculator')}
                  className="w-full py-2.5 rounded-tech bg-paper-100 dark:bg-charcoal-800 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Brick Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category 3: Finishes */}
          <div className="group rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 overflow-hidden shadow-tech-card hover:border-accent transition-all duration-300 flex flex-col justify-between">
            <div className="relative h-48 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent z-10" />
              <img
                src="/images/construction/interior-wall-painting.webp"
                alt="Interior wall painting showing surface coating and roller application"
                width={600}
                height={400}
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
                  Surfaces & Coatings
                </span>
                <span className="text-micro font-mono text-slate-300">Active Workspace</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-heading-md font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  Architectural Paint Estimator
                </h3>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calculate required gallons and 5-gal commercial pails with door and window deductions, multi-coat coverage, and a 3D room cutaway.
                </p>
              </div>

              <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={() => onNavigateToTool('paint-calculator')}
                  className="w-full py-2.5 rounded-tech bg-paper-100 dark:bg-charcoal-800 text-slate-900 dark:text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Paint Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCTION CALCULATORS DIRECTORY SECTION */}
      <section id="production-calculators" className="space-y-8 p-8 rounded-tech-lg bg-charcoal-900 text-white border border-charcoal-750 shadow-tech-elevated">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-charcoal-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-2">
              <span>Production Suite</span>
              <span aria-hidden="true">·</span>
              <span>Active Calculators</span>
            </div>
            <h2 className="text-heading-lg sm:text-display font-bold">
              Production 3D Construction Calculators
            </h2>
            <p className="text-caption text-slate-400 max-w-xl mt-2">
              Interactive 3D spatial models paired with rigorous mathematical formulas and instant copy/print takeoffs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOL_REGISTRY.filter((t) => t.implemented).map((tool) => (
            <div
              key={tool.slug}
              className="p-6 rounded-tech bg-charcoal-850 border border-charcoal-750 hover:border-accent transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-micro font-mono uppercase px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold">
                    {tool.category}
                  </span>
                  <span className="text-micro font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live Workspace
                  </span>
                </div>
                <div>
                  <h3 className="text-heading-md font-bold text-white group-hover:text-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-caption text-slate-400 mt-2 line-clamp-3">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-charcoal-800 mt-6">
                <button
                  type="button"
                  onClick={() => onNavigateToTool(tool.slug)}
                  className="w-full py-2.5 rounded-tech bg-charcoal-800 text-white group-hover:bg-accent group-hover:text-white text-caption font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Launch Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
            <span>Engineering Workflow</span>
            <span aria-hidden="true">·</span>
            <span>Transparent Calculation Pipeline</span>
          </div>
          <h2 className="text-display font-bold text-slate-900 dark:text-white">
            See the calculation, not just the number.
          </h2>
          <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl mt-2">
            STRUCTURA connects physical site dimensions directly to parametric 3D geometry and verified mathematical formulas to provide clear planning estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">01. DIMENSIONS</span>
              <Ruler className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Field Measurements
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter real measurements in Imperial or Metric. Arbitrary decimal values are accepted with instant bounds validation.
            </p>
          </div>

          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">02. 3D SPATIAL MODEL</span>
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Parametric Visualization
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Mesh coordinates dynamically scale along X, Y, and Z axes. Dimension callouts visually verify proportions.
            </p>
          </div>

          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">03. FORMULA ENGINE</span>
              <Calculator className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Volume & Waste Math
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard geometric equations combined with configurable trade allowances for subgrade dips and cutting waste.
            </p>
          </div>

          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-micro font-mono text-accent font-bold">04. ORDER TAKEOFF</span>
              <Truck className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Purchasing Units
            </h3>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
              Volumes translate immediately into real commercial units: ready-mix truckloads, pre-mix bags, or commercial pails.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMPREHENSIVE DIRECTORY & FAQ */}
      <section className="p-8 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-8">
        <div className="border-b border-paper-200 dark:border-charcoal-800 pb-6">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Field Knowledge Base</span>
          </div>
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            Practical Construction Takeoff Principles
          </h2>
          <p className="text-caption text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
            Frequently asked questions about subgrade deflection, waste factors, mortar allowances, and opening deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-caption">
          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              Why must an ordering allowance be added to concrete slabs?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Excavated subgrades are rarely laser-level. Minor dips and depressions of even 1/2 inch across a 20×20 ft patio increase concrete consumption by nearly 0.6 cubic yards. Wooden formwork also flexes slightly outward under wet hydrostatic pressure. Adding 5% to 10% ordering margin prevents cold joints caused by short-pour emergencies.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              How many modular bricks are needed per square foot of wall?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard modular facing bricks (7-5/8" × 2-1/4" × 3-5/8") with a standard 3/8" bed and head joint yield an effective coursing face of 8" × 2-2/3". This mathematically equates to approximately 6.75 to 7.0 bricks per square foot of single-wythe wall area.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <h3 className="text-body-sm font-semibold text-slate-900 dark:text-white">
              When should openings be deducted in paint estimation?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard interior passage doors typically measure ~21 sq ft (2.0 m²) and standard residential windows occupy ~15 sq ft (1.4 m²). Deducting major openings prevents substantial paint over-purchasing on multi-room projects.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
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
