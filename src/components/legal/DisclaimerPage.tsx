import React from 'react';
import { AlertTriangle, ShieldCheck, Scale, FileText } from 'lucide-react';

interface DisclaimerPageProps {
  onNavigate?: (view: string) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Construction Engineering & Usage Notice</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Construction Disclaimer & Limitations of Estimates
        </h1>
        <p className="text-caption text-slate-600 dark:text-slate-400">
          Last revised: September 2026 · Transparent estimation guidelines
        </p>
      </div>

      {/* Prominent Warning Callout */}
      <div className="p-6 rounded-tech-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-3">
        <div className="flex items-center gap-2 text-accent font-semibold text-body-sm">
          <Scale className="w-5 h-5 shrink-0" />
          <span>General Construction & Planning Estimates Notice</span>
        </div>
        <p className="text-caption text-slate-700 dark:text-slate-300 leading-relaxed">
          STRUCTURA provides mathematical quantity and material estimates created solely for preliminary planning, purchasing logistics, and budgetary coordination. STRUCTURA does <strong>not</strong> provide licensed structural engineering, certified architectural specifications, stamped drawings, geotechnical foundation analysis, or building-code compliance certifications.
        </p>
      </div>

      {/* Key Scope Limitations */}
      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          1. What STRUCTURA Does Not Provide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-caption">
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No Structural Engineering Services
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculations do not assess soil bearing capacity, frost line depth, dead/live structural loads, seismic hazard categories, or rebar sizing requirements.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No Stamped or Permitted Drawings
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Visual 3D renderings and generated takeoff summaries cannot be submitted to municipal building departments as permit drawings or architectural plans.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No Geotechnical / Soil Analysis
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Actual subgrade condition, gravel base compaction, drainage gradient, and sub-base stability vary significantly by geographic location and site topography.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No Building Code Compliance Guarantee
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Local jurisdictions adopt varying editions of the International Building Code (IBC), International Residential Code (IRC), or local municipal amendments.
            </p>
          </div>
        </div>
      </section>

      {/* Field Conditions & Material Variance */}
      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          2. Field Conditions & Material Allowances
        </h2>
        <div className="space-y-3 text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Real construction environments diverge from idealized mathematical formulas. Factors that introduce material variance include:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Subgrade Irregularities:</strong> Excavations and gravel bases are never perfectly flat; subgrade depressions routinely require 5% to 10% additional concrete.
            </li>
            <li>
              <strong>Formwork Flex & Deflection:</strong> Wet concrete exerts high hydrostatic head pressure on wooden forms, creating bowing that increases volume consumption.
            </li>
            <li>
              <strong>Manufacturer Packaging Differences:</strong> Bag yields (such as 80 lb or 60 lb pre-mix bags) vary by manufacturer blend, aggregate density, and water addition.
            </li>
            <li>
              <strong>Masonry & Mortar Waste:</strong> Bricks chipped during transport, cut pieces at wall corners, and mortar dropped on scaffolding require realistic field margins.
            </li>
            <li>
              <strong>Substrate Porosity:</strong> Unprimed drywall, textured stucco, or porous masonry absorb significantly more paint than smooth sealed surfaces.
            </li>
          </ul>
        </div>
      </section>

      {/* User Responsibility */}
      <section className="space-y-4">
        <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
          3. Verification Responsibility
        </h2>
        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          The user assumes full responsibility for independently verifying all measurements on the physical job site prior to placing orders with suppliers or pouring concrete. Always consult a licensed professional engineer (PE), registered architect, or licensed building contractor for safety-critical and load-bearing decisions.
        </p>
      </section>

      {/* Related Legal Links */}
      <div className="pt-6 border-t border-paper-300 dark:border-charcoal-750 flex flex-wrap gap-4 text-micro font-mono text-accent">
        <button
          type="button"
          onClick={() => onNavigate?.('terms')}
          className="hover:underline flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Use</span>
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={() => onNavigate?.('privacy')}
          className="hover:underline flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>
      </div>
    </article>
  );
};
