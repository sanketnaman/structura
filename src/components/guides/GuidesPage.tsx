import React from 'react';
import { BookOpen, Layers, Box, PaintBucket, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { AdSlot } from '../common/AdSlot';

interface GuidesPageProps {
  onNavigateToTool: (toolSlug: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigateToTool }) => {
  return (
    <article className="max-w-4xl mx-auto space-y-12 py-2 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Construction Reference & Guides</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Field Guides & Material Takeoff Principles
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          In-depth technical guides explaining volumetric calculation formulas, nominal waste factors, coursing geometry, and commercial ordering practices.
        </p>
      </div>

      {/* Guide 1: Concrete Volume */}
      <section className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase">
            <Box className="w-4 h-4" />
            <span>Concrete Guide 01</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTool('concrete-slab-calculator')}
            className="text-micro font-mono text-accent hover:underline flex items-center gap-1"
          >
            Launch Calculator <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          How to Calculate Concrete Slab Volume and Ready-Mix Orders
        </h2>

        <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            Poured concrete is measured and purchased in <strong>cubic yards</strong> (in the US Customary system) or <strong>cubic meters</strong> (in Metric jurisdictions). Because site dimensions are typically recorded as length and width in feet, but slab thickness in inches, proper unit conversion is essential:
          </p>
          <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 font-mono text-micro text-slate-900 dark:text-white">
            Volume (yd³) = [ Length (ft) × Width (ft) × (Thickness (in) ÷ 12) ] ÷ 27
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-body-sm pt-2">
            Why Subgrade Deflection Demands an Ordering Allowance
          </h3>
          <p>
            Ground excavation is rarely laser-flat. Subgrades dip, forms bow outwards under the heavy hydrostatic head of wet cement, and pump lines retain residual slurry. Ordering a customary 5% to 10% safety margin prevents cold joints, which occur when fresh concrete cannot be placed before the prior batch begins its initial set.
          </p>
        </div>
      </section>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="guides-middle-ad" />

      {/* Guide 2: Masonry Coursing */}
      <section className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase">
            <Layers className="w-4 h-4" />
            <span>Masonry Guide 02</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTool('brick-mortar-calculator')}
            className="text-micro font-mono text-accent hover:underline flex items-center gap-1"
          >
            Launch Calculator <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          Brick Wall Takeoffs: Coursing Geometry and Mortar Allowances
        </h2>

        <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            Estimating modular facing bricks requires accounting for mortar joint thickness (nominally 3/8 inch or 10 mm). Standard US modular bricks measure 7-5/8" × 2-1/4" × 3-5/8". When bed and head joints are added, the effective nominal footprint becomes 8" × 2-2/3".
          </p>
          <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 font-mono text-micro text-slate-900 dark:text-white">
            Effective Brick Area (sq ft) = [ (Length + Joint) × (Height + Joint) ] ÷ 144
          </div>
          <p>
            This yields the classic masonry estimation factor of approximately <strong>6.75 to 7.0 modular bricks per square foot</strong> of single-wythe wall surface. Type N masonry cement is customary for exterior veneers due to its balance of flexural bond strength and workability.
          </p>
        </div>
      </section>

      {/* Guide 3: Paint Coverage */}
      <section className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase">
            <PaintBucket className="w-4 h-4" />
            <span>Coatings Guide 03</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTool('paint-calculator')}
            className="text-micro font-mono text-accent hover:underline flex items-center gap-1"
          >
            Launch Calculator <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
          Architectural Paint Spreading Rates and Multi-Coat Takeoffs
        </h2>

        <div className="prose dark:prose-invert text-caption text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            Quality architectural interior latex paints typically spread between 350 and 400 square feet per gallon on pre-primed drywall. Deducting window and door openings ensures accurate purchasing:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
            <li>Standard interior passage doors deduct approximately 21 sq ft (2.0 m²).</li>
            <li>Standard residential windows deduct approximately 15 sq ft (1.4 m²).</li>
            <li>Unprimed or textured surfaces consume 20% to 30% more paint on the first coat.</li>
          </ul>
        </div>
      </section>
    </article>
  );
};
