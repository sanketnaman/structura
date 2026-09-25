import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TechnicalDiagramProps {
  type: 'concrete' | 'brick' | 'paint';
}

export const TechnicalDiagram: React.FC<TechnicalDiagramProps> = ({ type }) => {
  if (type === 'concrete') {
    return (
      <div className="p-4 sm:p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-4">
        <div className="flex items-center justify-between text-micro font-mono text-accent uppercase tracking-wider">
          <span>Technical Workflow Diagram</span>
          <span>Concrete Slab Takeoff</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-center">
          <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <span className="text-micro font-mono text-slate-500 block mb-1">Dimensions</span>
            <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">L × W × Depth</strong>
          </div>
          <div className="flex justify-center text-accent">
            <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
          </div>
          <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <span className="text-micro font-mono text-slate-500 block mb-1">Base Volume</span>
            <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">Net ft³ / m³</strong>
          </div>
          <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <span className="text-micro font-mono text-slate-500 block mb-1">Order Total</span>
            <strong className="text-body-sm font-semibold text-accent">+ Waste % → yd³ / Trucks</strong>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'brick') {
    return (
      <div className="p-4 sm:p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-4">
        <div className="flex items-center justify-between text-micro font-mono text-accent uppercase tracking-wider">
          <span>Technical Workflow Diagram</span>
          <span>Masonry Coursing Takeoff</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-center">
          <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <span className="text-micro font-mono text-slate-500 block mb-1">Wall Area</span>
            <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">Length × Height</strong>
          </div>
          <div className="flex justify-center text-accent">
            <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
          </div>
          <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <span className="text-micro font-mono text-slate-500 block mb-1">Brick Count</span>
            <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">Face Coursing + Waste</strong>
          </div>
          <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <span className="text-micro font-mono text-slate-500 block mb-1">Mortar Yield</span>
            <strong className="text-body-sm font-semibold text-accent">Bed/Head Joints → Bags</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-4">
      <div className="flex items-center justify-between text-micro font-mono text-accent uppercase tracking-wider">
        <span>Technical Workflow Diagram</span>
        <span>Paint & Coating Takeoff</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-center">
        <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
          <span className="text-micro font-mono text-slate-500 block mb-1">Surface Area</span>
          <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">Perimeter × Height</strong>
        </div>
        <div className="flex justify-center text-accent">
          <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
        </div>
        <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
          <span className="text-micro font-mono text-slate-500 block mb-1">Net Coverage</span>
          <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">Minus Openings</strong>
        </div>
        <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
          <span className="text-micro font-mono text-slate-500 block mb-1">Paint Quantity</span>
          <strong className="text-body-sm font-semibold text-accent">Coats ÷ Spread Rate</strong>
        </div>
      </div>
    </div>
  );
};
