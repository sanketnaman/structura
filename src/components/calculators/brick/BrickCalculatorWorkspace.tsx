import React, { useState, useId, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConstructionScene } from '../../3d/ConstructionScene';
import { BrickWall } from '../../3d/BrickWall';
import { calculateBrick } from '../../../lib/calculators/brick/calculator';
import type { UnitSystem } from '../../../types/layout';
import { formatNumber } from '../../../lib/calculators/common/math';
import { useViewToPath } from '../../../lib/routes';
import {
  BRICK_FAQ_ANSWER_KEYS,
  BRICK_FAQ_METRIC_OVERRIDES,
  BRICK_FAQ_QUESTION_KEYS,
} from '../../../lib/calculators/brick/faq';
import { AdSlot } from '../../common/AdSlot';
import { TechnicalDiagram } from '../../common/TechnicalDiagram';
import { useLocale } from '../../../lib/i18n/context';
import {
  Layers,
  Copy,
  Share2,
  Printer,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Box,
  PaintBucket,
  Home,
} from 'lucide-react';

interface BrickCalculatorWorkspaceProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

export const BrickCalculatorWorkspace: React.FC<BrickCalculatorWorkspaceProps> = ({
  unitSystem,
  onUnitSystemChange,
}) => {
  const isMetric = unitSystem === 'metric';
  const { t, locale } = useLocale();
  // Metric pages outside English state mortar in kg and dry mix in m³.
  const metricWording = isMetric && locale !== 'en';
  // Guide and FAQ content is always metric-first outside English, regardless
  // of the in-page unit toggle.
  const metricNative = locale !== 'en';
  const viewToPath = useViewToPath();

  // Form IDs
  const lengthId = useId();
  const heightId = useId();
  const jointId = useId();
  const wasteId = useId();
  const priceId = useId();

  // Dynamic Dimension States (arbitrary floats allowed)
  const [wallLength, setWallLength] = useState<number>(isMetric ? 8 : 25);
  const [wallHeight, setWallHeight] = useState<number>(isMetric ? 2.5 : 8);
  const [wythes, setWythes] = useState<1 | 2>(1);
  const [waste, setWaste] = useState<number>(8);
  const [brickPreset, setBrickPreset] = useState<'modular' | 'queen' | 'king' | 'custom'>('modular');

  // Brick dimensions
  const [brickLength, setBrickLength] = useState<number>(isMetric ? 194 : 7.625);
  const [brickHeight, setBrickHeight] = useState<number>(isMetric ? 57 : 2.25);
  const [jointThickness, setJointThickness] = useState<number>(isMetric ? 10 : 0.375);

  // Optional Cost State (strictly user-provided)
  const [enableCost, setEnableCost] = useState<boolean>(false);
  const [unitPrice, setUnitPrice] = useState<string>('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore URL state if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tool') === 'brick-mortar-calculator') {
        const l = params.get('l');
        const h = params.get('h');
        const wy = params.get('wy');
        const w = params.get('waste');
        const p = params.get('price');
        if (l) setWallLength(parseFloat(l) || wallLength);
        if (h) setWallHeight(parseFloat(h) || wallHeight);
        if (wy) setWythes(wy === '2' ? 2 : 1);
        if (w) setWaste(parseInt(w) || waste);
        if (p) {
          setUnitPrice(p);
          setEnableCost(true);
        }
      }
    }
  }, []);

  // Preset Handler
  const handleBrickPresetChange = (preset: 'modular' | 'queen' | 'king' | 'custom') => {
    setBrickPreset(preset);
    if (preset === 'modular') {
      setBrickLength(isMetric ? 194 : 7.625);
      setBrickHeight(isMetric ? 57 : 2.25);
      setJointThickness(isMetric ? 10 : 0.375);
    } else if (preset === 'queen') {
      setBrickLength(isMetric ? 200 : 7.625);
      setBrickHeight(isMetric ? 70 : 2.75);
      setJointThickness(isMetric ? 10 : 0.375);
    } else if (preset === 'king') {
      setBrickLength(isMetric ? 245 : 9.625);
      setBrickHeight(isMetric ? 68 : 2.625);
      setJointThickness(isMetric ? 10 : 0.375);
    }
  };

  // Calculations
  const parsedPrice = parseFloat(unitPrice) || 0;
  const result = calculateBrick({
    wallLength,
    wallHeight,
    brickLength,
    brickHeight,
    jointThickness,
    wythes,
    wastePercent: waste,
    isMetric,
    unitPrice: enableCost ? parsedPrice : 0,
  });

  // Copy estimate
  const handleCopyEstimate = () => {
    const unitText = isMetric ? 'm' : 'ft';
    const summary = [
      t('brick.copy.header'),
      t('concrete.copy.separator'),
      t('brick.copy.dimensions', {
        l: wallLength,
        u: unitText,
        h: wallHeight,
      }),
      t('brick.copy.faceArea', {
        v: result.wallArea,
        u: isMetric ? 'm²' : 'sq ft',
        wythe: wythes === 2 ? t('brick.doubleWytheTag') : t('brick.singleWytheTag'),
      }),
      t('brick.copy.baseCount', { count: result.baseBricks }),
      t('brick.copy.waste', { pct: waste, count: result.wasteBricks }),
      t('brick.copy.total', { count: result.totalBricks }),
      metricWording
        ? t('brick.copy.mortarMetric', {
            bags: result.mortarBags,
            m3: formatNumber(result.mortarVolumeCuFt * 0.0283168, 2, locale),
          })
        : t('brick.copy.mortar', {
            bags: result.mortarBags,
            cuft: result.mortarVolumeCuFt,
          }),
      enableCost && parsedPrice > 0
        ? t('brick.copy.cost', {
            cost: formatNumber(result.estimatedCost, 2, locale, 2),
            price: formatNumber(parsedPrice, 2, locale, 2),
          })
        : null,
      t('concrete.copy.separator'),
      t('common.copyGenerated', { date: new Date().toLocaleDateString() }),
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summary);
    showToast(t('common.copied'));
  };

  // Share URL
  const handleShare = () => {
    const params = new URLSearchParams({
      tool: 'brick-mortar-calculator',
      unit: unitSystem,
      l: wallLength.toString(),
      h: wallHeight.toString(),
      wy: wythes.toString(),
      waste: waste.toString(),
    });
    if (enableCost && parsedPrice > 0) {
      params.set('price', parsedPrice.toString());
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    showToast(t('common.shared'));
  };

  return (
    <div className="space-y-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-tech bg-slate-900 dark:bg-charcoal-950 text-white border border-amber-500/60 shadow-tech-card flex items-center gap-2.5 text-body-sm font-mono animate-in fade-in slide-in-from-bottom-2"
        >
          <Check className="w-4 h-4 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-paper-300 dark:border-charcoal-750 pb-4">
        <div>
          <nav aria-label={t('common.breadcrumb')} className="flex items-center gap-2 text-micro font-mono text-slate-500 mb-1">
            <Link
              to={viewToPath('overview')}
              className="hover:text-accent transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('common.home')}</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              to={viewToPath('calculators')}
              className="hover:text-accent transition-colors"
            >
              {t('common.calculators')}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-white font-semibold" aria-current="page">{t('brick.breadcrumb')}</span>
          </nav>
          <h1 className="text-display font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.h1')}
          </h1>
          <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {t('brick.headerBody')}
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-micro font-mono text-slate-500 uppercase">{t('common.units')}</span>
          <div className="flex p-0.5 rounded-tech bg-paper-200 dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 text-micro font-medium">
            <button
              type="button"
              onClick={() => onUnitSystemChange('imperial')}
              className={`px-3 py-1 rounded-tech transition-colors ${
                !isMetric
                  ? 'bg-white dark:bg-charcoal-700 text-slate-900 dark:text-white shadow-tech-subtle font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('brick.imperial')}
            </button>
            <button
              type="button"
              onClick={() => onUnitSystemChange('metric')}
              className={`px-3 py-1 rounded-tech transition-colors ${
                isMetric
                  ? 'bg-white dark:bg-charcoal-700 text-slate-900 dark:text-white shadow-tech-subtle font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('brick.metric')}
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Dimension Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-5">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-charcoal-800 pb-3">
              <span className="text-caption font-semibold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300">
                {t('brick.wallSpecs')}
              </span>
              <span className="text-micro font-mono text-accent">{t('brick.realtimeTakeoff')}</span>
            </div>

            {/* Brick Size Standard Selector */}
            <div>
              <span className="text-micro text-slate-500 font-mono uppercase block mb-2">
                {t('brick.standardLabel')}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleBrickPresetChange('modular')}
                  className={`px-2 py-2 rounded-tech text-micro font-medium border transition-colors text-center ${
                    brickPreset === 'modular'
                      ? 'bg-accent text-white border-accent font-semibold shadow-tech-subtle'
                      : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {t('brick.presetModular', { dims: isMetric ? '194×57mm' : '7⅝"×2¼"' })}
                </button>
                <button
                  type="button"
                  onClick={() => handleBrickPresetChange('queen')}
                  className={`px-2 py-2 rounded-tech text-micro font-medium border transition-colors text-center ${
                    brickPreset === 'queen'
                      ? 'bg-accent text-white border-accent font-semibold shadow-tech-subtle'
                      : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {t('brick.presetQueen', { dims: isMetric ? '200×70mm' : '7⅝"×2¾"' })}
                </button>
                <button
                  type="button"
                  onClick={() => handleBrickPresetChange('king')}
                  className={`px-2 py-2 rounded-tech text-micro font-medium border transition-colors text-center ${
                    brickPreset === 'king'
                      ? 'bg-accent text-white border-accent font-semibold shadow-tech-subtle'
                      : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {t('brick.presetKing', { dims: isMetric ? '245×68mm' : '9⅝"×2⅝"' })}
                </button>
              </div>
            </div>

            {/* 1. Wall Length */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={lengthId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  {t('brick.wallLength')}
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {formatNumber(wallLength, 2, locale)} {isMetric ? 'm' : 'ft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={isMetric ? 1 : 4}
                  max={isMetric ? 30 : 100}
                  step={isMetric ? 0.25 : 1}
                  value={wallLength}
                  onChange={(e) => setWallLength(parseFloat(e.target.value) || 1)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={lengthId}
                    type="number"
                    step="any"
                    min={0.5}
                    max={500}
                    value={wallLength}
                    onChange={(e) => setWallLength(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Wall Height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={heightId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  {t('brick.wallHeight')}
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {formatNumber(wallHeight, 2, locale)} {isMetric ? 'm' : 'ft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={isMetric ? 0.5 : 2}
                  max={isMetric ? 10 : 30}
                  step={isMetric ? 0.1 : 0.5}
                  value={wallHeight}
                  onChange={(e) => setWallHeight(parseFloat(e.target.value) || 0.5)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={heightId}
                    type="number"
                    step="any"
                    min={0.2}
                    max={100}
                    value={wallHeight}
                    onChange={(e) => setWallHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Wythe Selection */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-slate-800 dark:text-slate-200 block">
                {t('brick.wythesLabel')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWythes(1)}
                  className={`p-2.5 rounded-tech border text-left transition-colors ${
                    wythes === 1
                      ? 'bg-accent/10 border-accent text-slate-900 dark:text-white'
                      : 'bg-paper-100 dark:bg-charcoal-900 border-paper-300 dark:border-charcoal-750 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-caption">{t('brick.singleWythe')}</div>
                  <div className="text-micro font-mono text-slate-500">
                    {isMetric ? t('brick.singleWytheMetric') : t('brick.singleWytheImperial')}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setWythes(2)}
                  className={`p-2.5 rounded-tech border text-left transition-colors ${
                    wythes === 2
                      ? 'bg-accent/10 border-accent text-slate-900 dark:text-white'
                      : 'bg-paper-100 dark:bg-charcoal-900 border-paper-300 dark:border-charcoal-750 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-caption">{t('brick.doubleWythe')}</div>
                  <div className="text-micro font-mono text-slate-500">
                    {isMetric ? t('brick.doubleWytheMetric') : t('brick.doubleWytheImperial')}
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Waste Allowance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={wasteId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  {t('brick.wasteLabel')}
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  +{waste}%
                </span>
              </div>
              <div className="flex gap-2">
                {[5, 8, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setWaste(pct)}
                    className={`flex-1 py-1.5 rounded text-micro font-mono transition-colors border ${
                      waste === pct
                        ? 'bg-accent text-white border-accent font-semibold'
                        : 'bg-paper-100 dark:bg-charcoal-900 text-slate-600 dark:text-slate-400 border-paper-300 dark:border-charcoal-750'
                    }`}
                  >
                    +{pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Cost Estimation */}
          <div className="p-4 sm:p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-accent" />
                <span className="text-caption font-semibold text-slate-900 dark:text-white">
                  {t('brick.costTitle')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEnableCost(!enableCost)}
                className={`text-micro font-mono px-2.5 py-1 rounded transition-colors ${
                  enableCost
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'bg-paper-200 dark:bg-charcoal-800 text-slate-500'
                }`}
              >
                {enableCost ? t('brick.active') : t('brick.addUnitPrice')}
              </button>
            </div>

            {enableCost && (
              <div className="pt-2 border-t border-paper-200 dark:border-charcoal-800 space-y-2 animate-in fade-in">
                <label htmlFor={priceId} className="text-micro font-mono text-slate-500 block">
                  {t('brick.priceLabel')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-caption font-mono text-slate-400">$</span>
                  <input
                    id={priceId}
                    type="number"
                    step="any"
                    placeholder={t('brick.pricePlaceholder')}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm tech-focus"
                  />
                </div>
                {parsedPrice > 0 && (
                  <div className="flex justify-between items-center text-caption font-mono pt-1 text-slate-700 dark:text-slate-300">
                    <span>{t('brick.estTakeoffLabel')}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-body-sm">
                      ${formatNumber(result.estimatedCost, 2, locale, 2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 3D Parametric Brick Wall (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-micro text-slate-500 font-mono px-1">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {t('brick.vizTitle')}
              </span>
              <span>{t('brick.vizMeta')}</span>
            </div>

            <ConstructionScene
              title={t('brick.sceneTitle')}
              className="w-full h-[400px] sm:h-[480px] lg:h-[500px]"
              cameraPosition={[6.0, 4.0, 7.5]}
            >
              <BrickWall
                length={wallLength}
                height={wallHeight}
                unit={unitSystem}
                isDoubleWythe={wythes === 2}
                brickLength={brickLength}
                brickHeight={brickHeight}
                jointThickness={jointThickness}
                labelLocale={locale}
              />
            </ConstructionScene>

            <div className="flex items-center justify-between text-micro text-slate-500 px-1 font-mono">
              <span>
                {t('brick.surfaceLine', {
                  area: formatNumber(result.wallArea, 2, locale),
                  unit: isMetric ? 'm²' : 'sq ft',
                  wythe: wythes === 2 ? t('brick.doubleWytheTag') : t('brick.singleWytheTag'),
                })}
              </span>
              <span className="text-accent">{t('brick.bedJoints', { joint: isMetric ? '10mm' : '⅜"' })}</span>
            </div>
          </div>

          {/* PRIMARY RESULTS TAKEOFF CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Card: Total Bricks */}
            <div className="sm:col-span-2 p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border-2 border-accent shadow-tech-card relative overflow-hidden">
              <div className="text-micro font-mono uppercase tracking-wider text-accent font-semibold mb-1">
                {t('brick.totalLabel')}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-display font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {formatNumber(result.totalBricks, 0, locale)}
                </span>
                <span className="text-caption font-mono text-slate-500">
                  {t('brick.units')}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-mono text-slate-600 dark:text-slate-400">
                <span>{t('brick.baseLine', { count: formatNumber(result.baseBricks, 0, locale) })}</span>
                <span className="text-accent">
                  {t('brick.cutsLine', {
                    pct: waste,
                    count: formatNumber(result.wasteBricks, 0, locale),
                  })}
                </span>
              </div>
            </div>

            {/* Secondary Card: Mortar Bags */}
            <div className="p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle flex flex-col justify-between">
              <div>
                <div className="text-micro font-mono uppercase tracking-wider text-slate-500 mb-1">
                  {t('brick.typeN')}
                </div>
                <div className="text-heading-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {result.mortarBags}
                </div>
                <div className="text-micro font-mono text-slate-400 mt-0.5">
                  {metricWording ? t('brick.bagsLabelMetric') : t('brick.bagsLabel')}
                </div>
              </div>
              <div className="text-micro font-mono text-slate-500 pt-2 border-t border-paper-200 dark:border-charcoal-800">
                {metricWording
                  ? t('brick.dryMixMetric', { v: formatNumber(result.mortarVolumeCuFt * 0.0283168, 2, locale) })
                  : t('brick.dryMix', { v: result.mortarVolumeCuFt })}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-tech-lg bg-paper-100 dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEstimate}
                className="px-3.5 py-2 rounded-tech bg-white dark:bg-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-700 text-slate-800 dark:text-slate-200 border border-paper-300 dark:border-charcoal-700 text-body-sm font-medium transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4 text-accent" />
                <span>{t('common.copyEstimate')}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-3.5 py-2 rounded-tech bg-white dark:bg-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-700 text-slate-800 dark:text-slate-200 border border-paper-300 dark:border-charcoal-700 text-body-sm font-medium transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-accent" />
                <span>{t('common.shareProject')}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-tech bg-white dark:bg-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-700 text-slate-800 dark:text-slate-200 border border-paper-300 dark:border-charcoal-700 text-body-sm font-medium transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>{t('common.printSheet')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Technical Workflow Diagram */}
      <TechnicalDiagram type="brick" />

      {/* 2. CALCULATION BREAKDOWN */}
      <section className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-4">
        <div className="flex items-center gap-2 border-b border-paper-200 dark:border-charcoal-800 pb-3">
          <Info className="w-5 h-5 text-accent" />
          <h2 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
            {t('brick.breakdownTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-caption">
          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              {t('brick.step1Title')}
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {formatNumber(wallLength, 2, locale)} {isMetric ? 'm' : 'ft'} × {formatNumber(wallHeight, 2, locale)} {isMetric ? 'm' : 'ft'}
            </p>
            <p className="text-slate-500">
              = <span className="text-slate-900 dark:text-white font-bold">{formatNumber(result.wallArea, 2, locale)} {isMetric ? 'm²' : 'sq ft'}</span> {t('brick.grossSurface')}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              {t('brick.step2Title')}
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {t('brick.bricksPerUnit', {
                count: result.bricksPerUnitArea,
                unit: isMetric ? 'm²' : 'sq ft',
              })}
            </p>
            <p className="text-slate-500">
              {t('brick.step2Note', { joint: isMetric ? '10mm' : '⅜"' })}
            </p>
          </div>

          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              {t('brick.step3Title')}
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {formatNumber(result.baseBricks, 0, locale)} base × {formatNumber(1 + waste / 100, 2, locale, 2)}
            </p>
            <p className="text-slate-500">
              = <span className="text-accent font-bold">{formatNumber(result.totalBricks, 0, locale)} {t('brick.bricksWord')}</span> + {result.mortarBags}{' '}
                {metricWording ? t('brick.typeNBagsMetric') : t('brick.typeNBags')}
            </p>
          </div>
        </div>
      </section>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="brick-calc-mid-ad" />

      {/* 3. SEO-STRUCTURED MASONRY GUIDE */}
      <section className="space-y-8 pt-4 border-t border-paper-300 dark:border-charcoal-750 text-body-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div className="space-y-3 max-w-3xl">
          <p>{t('brick.guide.intro')}</p>
        </div>

        {/* How many bricks do I need */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.guide.howManyTitle')}
          </h2>
          <p>{t('brick.guide.howManyIntro')}</p>
          <ol className="space-y-2 list-decimal list-inside marker:text-accent marker:font-semibold">
            <li dangerouslySetInnerHTML={{ __html: t('brick.guide.howManyStep1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('brick.guide.howManyStep2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('brick.guide.howManyStep3') }} />
            <li dangerouslySetInnerHTML={{ __html: t('brick.guide.howManyStep4') }} />
            <li dangerouslySetInnerHTML={{ __html: t('brick.guide.howManyStep5') }} />
          </ol>
        </div>

        {/* Methodology */}
        <div className="space-y-5">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.guide.methodologyTitle')}
          </h2>
          <p>{t('brick.guide.methodologyIntro')}</p>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('brick.guide.step1Title')}
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>{t('brick.guide.step1Formula')}</p>
              <p className="text-slate-500 dark:text-slate-400">{t('brick.guide.step1Example')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('brick.guide.step2Title')}
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>{t('brick.guide.step2Formula1')}</p>
              <p>{t('brick.guide.step2Formula2')}</p>
              <p>{t('brick.guide.step2Formula3')}</p>
              <p>{t('brick.guide.step2Formula4')}</p>
            </div>
            <p>{t('brick.guide.step2Note')}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('brick.guide.step3Title')}
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>{t('brick.guide.step3Formula1')}</p>
              <p>{t('brick.guide.step3Formula2')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {t('brick.guide.step4Title')}
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>{t('brick.guide.step4Formula1')}</p>
              <p>{t('brick.guide.step4Formula2')}</p>
            </div>
          </div>
        </div>

        {/* Worked Example */}
        <div className="space-y-4">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.guide.exampleTitle')}
          </h2>
          <p className="italic">{t('brick.guide.exampleIntro')}</p>
          <div className="p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-charcoal-800 pb-2">
              <span className="text-micro font-mono uppercase tracking-wider text-accent font-semibold">
                {t('brick.guide.exampleInputsLabel')}
              </span>
              <span className="text-micro font-mono text-slate-500">
                {metricNative
                  ? t('brick.guide.exampleInputsMetaMetric')
                  : t('brick.guide.exampleInputsMeta')}
              </span>
            </div>
            <ul className="space-y-1.5 font-mono text-caption text-slate-700 dark:text-slate-300">
              <li>
                {metricNative ? t('brick.guide.exampleInput1Metric') : t('brick.guide.exampleInput1')}
              </li>
              <li>
                {metricNative ? t('brick.guide.exampleInput2Metric') : t('brick.guide.exampleInput2')}
              </li>
            </ul>
            <div className="pt-2 border-t border-paper-200 dark:border-charcoal-800 space-y-1.5 font-mono text-caption text-slate-700 dark:text-slate-300">
              <p
                dangerouslySetInnerHTML={{
                  __html: metricNative
                    ? t('brick.guide.exampleAreaMetric')
                    : t('brick.guide.exampleArea'),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: metricNative
                    ? t('brick.guide.exampleFaceMetric')
                    : t('brick.guide.exampleFace'),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: metricNative
                    ? t('brick.guide.exampleRateMetric')
                    : t('brick.guide.exampleRate'),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: metricNative
                    ? t('brick.guide.exampleBaseMetric')
                    : t('brick.guide.exampleBase'),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: metricNative
                    ? t('brick.guide.exampleWasteMetric')
                    : t('brick.guide.exampleWaste'),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: metricNative
                    ? t('brick.guide.exampleTotalMetric')
                    : t('brick.guide.exampleTotal'),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: metricNative
                    ? t('brick.guide.exampleMortarMetric')
                    : t('brick.guide.exampleMortar'),
                }}
              />
            </div>
            <p className="text-micro text-slate-500 pt-1">
              {metricNative ? t('brick.guide.exampleNoteMetric') : t('brick.guide.exampleNote')}
            </p>
          </div>
        </div>

        {/* Mortar */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.guide.mortarTitle')}
          </h2>
          <p dangerouslySetInnerHTML={{ __html: t('brick.guide.mortarIntro') }} />
          <p>{t('brick.guide.mortarCaveat')}</p>
        </div>

        {/* Wythe */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.guide.wytheTitle')}
          </h2>
          <p dangerouslySetInnerHTML={{ __html: t('brick.guide.wytheP1') }} />
          <p>{t('brick.guide.wytheP2')}</p>
        </div>

        {/* Sizes & joints */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.guide.sizesTitle')}
          </h2>
          <p dangerouslySetInnerHTML={{ __html: t('brick.guide.sizesP1') }} />
          <p>{t('brick.guide.sizesP2')}</p>
        </div>

        {/* Bond */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brick.guide.bondTitle')}
          </h2>
          <p dangerouslySetInnerHTML={{ __html: t('brick.guide.bondP1') }} />
          <p>{t('brick.guide.bondP2')}</p>
        </div>

        {/* FAQ */}
        <div className="space-y-5">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('common.faqTitle')}
          </h2>
          <div className="space-y-5">
            {BRICK_FAQ_QUESTION_KEYS.map((questionKey, index) => {
              const override = metricNative ? BRICK_FAQ_METRIC_OVERRIDES[index] : undefined;
              return (
                <div key={questionKey} className="space-y-1.5">
                  <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
                    {t(override?.question ?? questionKey)}
                  </h3>
                  <p>{t(override?.answer ?? BRICK_FAQ_ANSWER_KEYS[index])}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Calculators Cross-links */}
        <div className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-4">
          <h2 className="text-heading-sm font-bold text-slate-900 dark:text-white">
            {t('common.relatedConstructionCalculators')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={viewToPath('concrete-slab-calculator')}
              className="p-4 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 hover:border-accent text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-caption font-semibold text-slate-900 dark:text-white block">
                  {t('tool.concrete-slab-calculator.name')}
                </span>
                <span className="text-micro font-mono text-slate-500">
                  {t('brick.relatedConcreteSub')}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>
            <Link
              to={viewToPath('paint-calculator')}
              className="p-4 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 hover:border-accent text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-caption font-semibold text-slate-900 dark:text-white block">
                  {t('tool.paint-calculator.name')}
                </span>
                <span className="text-micro font-mono text-slate-500">
                  {t('brick.relatedPaintSub')}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
