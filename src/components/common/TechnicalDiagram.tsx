import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';
import type { TranslationKey } from '../../lib/i18n/dictionaries';

interface TechnicalDiagramProps {
  type: 'concrete' | 'brick' | 'paint';
  metricWording?: boolean;
}

interface DiagramStep {
  labelKey: TranslationKey;
  valueKey: TranslationKey;
}

const DIAGRAM_STEPS: Record<TechnicalDiagramProps['type'], DiagramStep[]> = {
  concrete: [
    { labelKey: 'diagram.dimensions', valueKey: 'diagram.lwDepth' },
    { labelKey: 'diagram.baseVolume', valueKey: 'diagram.netVolume' },
    { labelKey: 'diagram.orderTotal', valueKey: 'diagram.orderValue' },
  ],
  brick: [
    { labelKey: 'diagram.wallArea', valueKey: 'diagram.wallAreaValue' },
    { labelKey: 'diagram.brickCount', valueKey: 'diagram.brickCountValue' },
    { labelKey: 'diagram.mortarYield', valueKey: 'diagram.mortarYieldValue' },
  ],
  paint: [
    { labelKey: 'diagram.surfaceArea', valueKey: 'diagram.surfaceAreaValue' },
    { labelKey: 'diagram.netCoverage', valueKey: 'diagram.netCoverageValue' },
    { labelKey: 'diagram.paintQuantity', valueKey: 'diagram.paintQuantityValue' },
  ],
};

const TAKEOFF_LABELS: Record<TechnicalDiagramProps['type'], TranslationKey> = {
  concrete: 'diagram.concreteTakeoff',
  brick: 'diagram.brickTakeoff',
  paint: 'diagram.paintTakeoff',
};

// Metric variants of diagram value keys that quote US customary units in
// their base wording. Only keys without a mapping (brick, paint) are
// unit-neutral and render the same string in both modes.
const DIAGRAM_METRIC_VALUE_KEYS: Readonly<Partial<Record<TranslationKey, TranslationKey>>> = {
  'diagram.netVolume': 'diagram.netVolumeMetric',
  'diagram.orderValue': 'diagram.orderValueMetric',
};

export const TechnicalDiagram: React.FC<TechnicalDiagramProps> = ({
  type,
  metricWording = false,
}) => {
  const { t } = useLocale();
  const steps = DIAGRAM_STEPS[type].map(({ labelKey, valueKey }) => ({
    labelKey,
    valueKey: metricWording ? (DIAGRAM_METRIC_VALUE_KEYS[valueKey] ?? valueKey) : valueKey,
  }));

  return (
    <div className="p-4 sm:p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-4">
      <div className="flex items-center justify-between text-micro font-mono text-accent uppercase tracking-wider">
        <span>{t('diagram.title')}</span>
        <span>{t(TAKEOFF_LABELS[type])}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-center">
        <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
          <span className="text-micro font-mono text-slate-500 block mb-1">{t(steps[0].labelKey)}</span>
          <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">{t(steps[0].valueKey)}</strong>
        </div>
        <div className="flex justify-center text-accent">
          <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
        </div>
        <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
          <span className="text-micro font-mono text-slate-500 block mb-1">{t(steps[1].labelKey)}</span>
          <strong className="text-body-sm font-semibold text-slate-900 dark:text-white">{t(steps[1].valueKey)}</strong>
        </div>
        <div className="p-3 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
          <span className="text-micro font-mono text-slate-500 block mb-1">{t(steps[2].labelKey)}</span>
          <strong className="text-body-sm font-semibold text-accent">{t(steps[2].valueKey)}</strong>
        </div>
      </div>
    </div>
  );
};
