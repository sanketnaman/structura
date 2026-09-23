import React from 'react';
import { Compass, Box, Layers, Calculator, ShieldAlert, Users, Target } from 'lucide-react';

interface AboutPageProps {
  onNavigate?: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <article className="max-w-4xl mx-auto space-y-12 py-4 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>About The Platform</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          About STRUCTURA
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          STRUCTURA is an open construction technology platform providing formula-based material quantity estimation paired with real-time interactive 3D spatial visualization.
        </p>
      </div>

      {/* The Problem We Solve */}
      <section className="space-y-4">
        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          The Problem We Solve
        </h2>
        <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            Traditional building material calculators present users with flat numerical web forms. When entering multi-unit dimensions—such as a concrete slab measured in feet for length and width, but inches for thickness—clerical mistakes happen frequently. A misplaced decimal point or confused unit yields an answer off by a factor of 12.
          </p>
          <p>
            In physical construction, ordering mistakes cause immediate project disruptions: under-ordering concrete leads to emergency short-load delivery fees or weak cold joints, while over-ordering results in wasted budget and difficult slurry disposal.
          </p>
        </div>
      </section>

      {/* Why 3D Visualization */}
      <section className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Box className="w-5 h-5 text-accent" />
          <span>Why Interactive 3D Spatial Modeling Matters</span>
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          By coupling numerical input fields directly to a parametric WebGL 3D model, STRUCTURA provides immediate visual feedback. If a user accidentally enters a 4-inch slab as 4.0 feet, the slab physically morphs into a monolithic cube in the viewport, catching the input error before any material orders are placed.
        </p>
      </section>

      {/* Methodology */}
      <section className="space-y-4">
        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          How Calculations Are Generated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-caption">
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="text-micro font-mono text-accent font-bold">1. PURE GEOMETRY</span>
            <h3 className="font-semibold text-slate-900 dark:text-white">Dimensional Equations</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard volumetric mathematics ($L \times W \times H$) converted accurately across Imperial ($ft^3 \to yd^3$) and Metric ($m^3$) systems.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="text-micro font-mono text-accent font-bold">2. CLEAR ALLOWANCES</span>
            <h3 className="font-semibold text-slate-900 dark:text-white">Configurable Waste</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent, user-adjustable percentages account for subgrade settlement, form deflection, masonry cuts, and chute loss.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="text-micro font-mono text-accent font-bold">3. REAL PACKAGING</span>
            <h3 className="font-semibold text-slate-900 dark:text-white">Commercial Takeoffs</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Raw volumes translate into real commercial packaging units: ready-mix drum trucks (~9 yd³), 80 lb / 60 lb bags, pallets, and 5-gallon pails.
            </p>
          </div>
        </div>
      </section>

      {/* Who Uses Structura */}
      <section className="space-y-4">
        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          Who the Platform is Designed For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-caption">
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">General Contractors & Builders</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Rapid material takeoffs, sanity-checking subcontractor bids, and planning delivery logistics.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Architects & Estimators</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Preliminary volumetric verification, masonry coursing checks, and architectural coating schedules.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Trade Craftsmen</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Masonry workers, concrete placers, and painters requiring exact unit breakdowns and bag counts.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Self-Builders & DIYers</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Clear purchasing guidance that avoids repeated hardware store trips and pallet overstock.
            </p>
          </div>
        </div>
      </section>

      {/* Scope Limitations */}
      <section className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-3">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-accent" />
          <span>Platform Scope & Limitations</span>
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          STRUCTURA provides mathematical estimates for budgeting and purchasing. We do not provide licensed structural engineering, load calculations, or stamped permit drawings. Consult a licensed civil engineer or architect for structural safety decisions. Review our full{' '}
          <button
            type="button"
            onClick={() => onNavigate?.('disclaimer')}
            className="text-accent underline font-medium"
          >
            Construction Disclaimer
          </button>
          .
        </p>
      </section>
    </article>
  );
};
