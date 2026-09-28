import React, { useState, useId, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConstructionScene } from '../../3d/ConstructionScene';
import { BrickWall } from '../../3d/BrickWall';
import { calculateBrick } from '../../../lib/calculators/brick/calculator';
import type { UnitSystem } from '../../../types/layout';
import { formatNumber } from '../../../lib/calculators/common/math';
import { viewToPath } from '../../../lib/routes';
import { BRICK_FAQ } from '../../../lib/calculators/brick/faq';
import { AdSlot } from '../../common/AdSlot';
import { TechnicalDiagram } from '../../common/TechnicalDiagram';
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
      `MIXTALLY BRICK & MORTAR TAKEOFF`,
      `----------------------------------------`,
      `Wall Dimensions: ${wallLength} ${unitText} L × ${wallHeight} ${unitText} H`,
      `Wall Face Area: ${result.wallArea} ${isMetric ? 'm²' : 'sq ft'} (${wythes === 2 ? 'Double Wythe' : 'Single Wythe'})`,
      `Base Brick Count: ${result.baseBricks} units`,
      `Waste Allowance (${waste}%): +${result.wasteBricks} units`,
      `Total Bricks Required: ${result.totalBricks} units`,
      `Type N Mortar (80 lb bags): ${result.mortarBags} bags (~${result.mortarVolumeCuFt} cu ft)`,
      enableCost && parsedPrice > 0
        ? `Estimated Brick Material Cost: $${result.estimatedCost.toFixed(2)} (@ $${parsedPrice.toFixed(2)}/brick)`
        : null,
      `----------------------------------------`,
      `Generated at ${new Date().toLocaleDateString()} via MixTally Construction Technology`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summary);
    showToast('Takeoff estimate copied to clipboard');
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
    showToast('Shareable project URL copied to clipboard');
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
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-micro font-mono text-slate-500 mb-1">
            <Link
              to={viewToPath('overview')}
              className="hover:text-accent transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              to={viewToPath('calculators')}
              className="hover:text-accent transition-colors"
            >
              Calculators
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-white font-semibold" aria-current="page">Brick Calculator</span>
          </nav>
          <h1 className="text-display font-bold text-slate-900 dark:text-white tracking-tight">
            Brick Calculator
          </h1>
          <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Estimate bricks required, wall area, mortar allowance, and optional brick material cost for single or
            double wythe walls. Enter metric or imperial dimensions and review an interactive 3D masonry wall
            visualization before you order materials.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-micro font-mono text-slate-500 uppercase">Units:</span>
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
              Imperial (ft / in)
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
              Metric (m / mm)
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
                Wall Dimensions & Masonry Specs
              </span>
              <span className="text-micro font-mono text-accent">Real-time Takeoff</span>
            </div>

            {/* Brick Size Standard Selector */}
            <div>
              <span className="text-micro text-slate-500 font-mono uppercase block mb-2">
                Brick Standard:
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
                  Modular ({isMetric ? '194×57mm' : '7⅝"×2¼"'})
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
                  Queen ({isMetric ? '200×70mm' : '7⅝"×2¾"'})
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
                  King ({isMetric ? '245×68mm' : '9⅝"×2⅝"'})
                </button>
              </div>
            </div>

            {/* 1. Wall Length */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={lengthId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Wall Length
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {formatNumber(wallLength)} {isMetric ? 'm' : 'ft'}
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
                  Wall Height
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {formatNumber(wallHeight)} {isMetric ? 'm' : 'ft'}
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
                Wall Thickness (Wythes)
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
                  <div className="font-semibold text-caption">Single Wythe (1 Leaf)</div>
                  <div className="text-micro font-mono text-slate-500">
                    {isMetric ? '10 cm nominal facing' : '4" nominal facing veneer'}
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
                  <div className="font-semibold text-caption">Double Wythe (2 Leaves)</div>
                  <div className="text-micro font-mono text-slate-500">
                    {isMetric ? '20 cm structural masonry' : '8" structural cavity/solid'}
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Waste Allowance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={wasteId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Cutting Waste & Breakage Margin
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
                  Brick Material Cost Estimate
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
                {enableCost ? 'Active' : '+ Add Unit Price'}
              </button>
            </div>

            {enableCost && (
              <div className="pt-2 border-t border-paper-200 dark:border-charcoal-800 space-y-2 animate-in fade-in">
                <label htmlFor={priceId} className="text-micro font-mono text-slate-500 block">
                  Brick Unit Price ($ / brick delivered):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-caption font-mono text-slate-400">$</span>
                  <input
                    id={priceId}
                    type="number"
                    step="any"
                    placeholder="e.g. 0.85"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm tech-focus"
                  />
                </div>
                {parsedPrice > 0 && (
                  <div className="flex justify-between items-center text-caption font-mono pt-1 text-slate-700 dark:text-slate-300">
                    <span>Estimated Brick Takeoff:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-body-sm">
                      ${result.estimatedCost.toFixed(2)}
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
                Interactive 3D Masonry Wall Visualization
              </span>
              <span>Arbitrary Aspect Scale · Orbit 360°</span>
            </div>

            <ConstructionScene
              title="3D Masonry Wall Visualization"
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
              />
            </ConstructionScene>

            <div className="flex items-center justify-between text-micro text-slate-500 px-1 font-mono">
              <span>
                Surface: {formatNumber(result.wallArea)} {isMetric ? 'm²' : 'sq ft'} · {wythes === 2 ? 'Double Wythe' : 'Single Wythe'}
              </span>
              <span className="text-accent">Bed Joints: {isMetric ? '10mm' : '⅜"'} standard</span>
            </div>
          </div>

          {/* PRIMARY RESULTS TAKEOFF CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Card: Total Bricks */}
            <div className="sm:col-span-2 p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border-2 border-accent shadow-tech-card relative overflow-hidden">
              <div className="text-micro font-mono uppercase tracking-wider text-accent font-semibold mb-1">
                Total Bricks Required (With Waste)
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-display font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {formatNumber(result.totalBricks, 0)}
                </span>
                <span className="text-caption font-mono text-slate-500">
                  modular units
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-mono text-slate-600 dark:text-slate-400">
                <span>Base: {formatNumber(result.baseBricks, 0)} units</span>
                <span className="text-accent">+{waste}% ({formatNumber(result.wasteBricks, 0)} cuts)</span>
              </div>
            </div>

            {/* Secondary Card: Mortar Bags */}
            <div className="p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle flex flex-col justify-between">
              <div>
                <div className="text-micro font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Type N Mortar
                </div>
                <div className="text-heading-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {result.mortarBags}
                </div>
                <div className="text-micro font-mono text-slate-400 mt-0.5">
                  80 lb pre-mix bags
                </div>
              </div>
              <div className="text-micro font-mono text-slate-500 pt-2 border-t border-paper-200 dark:border-charcoal-800">
                ~{result.mortarVolumeCuFt} cu ft dry mix
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
                <span>Copy Estimate</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-3.5 py-2 rounded-tech bg-white dark:bg-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-700 text-slate-800 dark:text-slate-200 border border-paper-300 dark:border-charcoal-700 text-body-sm font-medium transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-accent" />
                <span>Share Project</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-tech bg-white dark:bg-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-700 text-slate-800 dark:text-slate-200 border border-paper-300 dark:border-charcoal-700 text-body-sm font-medium transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Sheet</span>
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
            Transparent Masonry Calculation Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-caption">
          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              Step 1: Wall Face Area
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {formatNumber(wallLength)} {isMetric ? 'm' : 'ft'} × {formatNumber(wallHeight)} {isMetric ? 'm' : 'ft'}
            </p>
            <p className="text-slate-500">
              = <span className="text-slate-900 dark:text-white font-bold">{formatNumber(result.wallArea)} {isMetric ? 'm²' : 'sq ft'}</span> gross surface
            </p>
          </div>

          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              Step 2: Effective Brick Area
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {result.bricksPerUnitArea} bricks per {isMetric ? 'm²' : 'sq ft'}
            </p>
            <p className="text-slate-500">
              Accounting for {isMetric ? '10mm' : '⅜"'} horizontal bed and vertical head joints.
            </p>
          </div>

          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              Step 3: Waste & Mortar Takeoff
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {formatNumber(result.baseBricks, 0)} base × 1.{waste < 10 ? `0${waste}` : waste}
            </p>
            <p className="text-slate-500">
              = <span className="text-accent font-bold">{formatNumber(result.totalBricks, 0)} bricks</span> + {result.mortarBags} Type N bags.
            </p>
          </div>
        </div>
      </section>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="brick-calc-mid-ad" />

      {/* 3. SEO-STRUCTURED MASONRY GUIDE */}
      <section className="space-y-8 pt-4 border-t border-paper-300 dark:border-charcoal-750 text-body-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div className="space-y-3 max-w-3xl">
          <p>
            This brick calculator estimates how many bricks you need for a wall from wall length, wall height, brick
            dimensions, mortar joint thickness, wythe count, and waste allowance. Wall dimensions and allowances are
            entered directly, while brick dimensions and joint thickness are loaded from the brick preset you choose.
            From those values it reports wall face area, a mortar allowance for planning, and an optional brick material
            cost, alongside an interactive 3D masonry wall visualization. Metric and imperial dimensions are supported
            throughout, and every result updates as you change an input.
          </p>
        </div>

        {/* How many bricks do I need */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            How Many Bricks Do I Need for a Wall?
          </h2>
          <p>
            A brick takeoff for a wall follows the same five steps whether you work them out by hand or use the
            calculator above:
          </p>
          <ol className="space-y-2 list-decimal list-inside marker:text-accent marker:font-semibold">
            <li>
              <strong className="text-slate-900 dark:text-white font-semibold">Calculate the wall face area</strong> by
              multiplying wall length by wall height.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white font-semibold">Determine the effective brick face
              area</strong> by adding mortar joint thickness to the brick length and brick height, then multiplying the
              two results.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white font-semibold">Divide the wall area by the effective
              brick face area</strong> to get the base brick quantity.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white font-semibold">Multiply for additional wythes</strong> —
              a double-wythe wall needs twice the bricks of a single-wythe wall with the same face area.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white font-semibold">Add a waste allowance</strong> for cuts,
              breakage, and handling to reach the number of bricks to order.
            </li>
          </ol>
        </div>

        {/* Methodology */}
        <div className="space-y-5">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            How to Calculate Bricks for a Wall
          </h2>
          <p>
            The formulas below are the same ones this calculator runs. They produce a planning estimate from the
            dimensions you enter, using the wall face area, effective brick area, base bricks, waste bricks, and total
            bricks terminology shown in the calculation breakdown.
          </p>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Step 1: Calculate Wall Area
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>wall face area = wall length × wall height</p>
              <p className="text-slate-500 dark:text-slate-400">
                example: 20 ft × 8 ft = 160 sq ft (metric: m × m = m²)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Step 2: Account for Brick Dimensions and Mortar Joints
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>effective brick length = brick length + mortar joint thickness</p>
              <p>effective brick height = brick height + mortar joint thickness</p>
              <p>effective brick area = effective brick length × effective brick height</p>
              <p>bricks per unit area = 1 ÷ effective brick area</p>
            </div>
            <p>
              A modular brick (7⅝ in × 2¼ in) laid with a ⅜ in joint covers an effective face of 8 in × 2⅝ in, which
              is about 6.86 bricks per square foot. In metric units the modular preset (194 mm × 57 mm) with a 10 mm
              joint covers 204 mm × 67 mm, or roughly 70 bricks per square metre.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Step 3: Calculate Base Brick Quantity
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>single-wythe bricks = wall face area × bricks per square foot (rounded)</p>
              <p>base bricks = single-wythe bricks × number of wythes</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Step 4: Add Waste Allowance
            </h3>
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 font-mono text-caption text-slate-800 dark:text-slate-200 space-y-1">
              <p>waste bricks = base bricks × waste percentage, rounded up</p>
              <p>total bricks = base bricks + waste bricks</p>
            </div>
          </div>
        </div>

        {/* Worked Example */}
        <div className="space-y-4">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Brick Calculator Worked Example
          </h2>
          <p className="italic">
            Illustrative example only — it shows how one set of inputs flows through the calculation above. Your own
            result depends on your dimensions, joint thickness, wythe count, and waste allowance, so treat it as a
            planning estimate rather than a fixed answer for every wall.
          </p>
          <div className="p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-charcoal-800 pb-2">
              <span className="text-micro font-mono uppercase tracking-wider text-accent font-semibold">
                Inputs
              </span>
              <span className="text-micro font-mono text-slate-500">
                Imperial · single wythe · 10% waste
              </span>
            </div>
            <ul className="space-y-1.5 font-mono text-caption text-slate-700 dark:text-slate-300">
              <li>Wall length: 20 ft · Wall height: 8 ft</li>
              <li>Brick: standard modular · Mortar joint: ⅜ in</li>
            </ul>
            <div className="pt-2 border-t border-paper-200 dark:border-charcoal-800 space-y-1.5 font-mono text-caption text-slate-700 dark:text-slate-300">
              <p>
                Wall area: <span className="text-slate-900 dark:text-white font-bold">20 × 8 = 160 sq ft</span>
              </p>
              <p>
                Effective brick face: <span className="text-slate-900 dark:text-white font-bold">8 in × 2⅝ in</span>
              </p>
              <p>
                Bricks per square foot: <span className="text-slate-900 dark:text-white font-bold">approximately 6.86</span>
              </p>
              <p>
                Base brick quantity: <span className="text-slate-900 dark:text-white font-bold">approximately 1,097 bricks</span>
              </p>
              <p>
                10% waste: <span className="text-accent font-bold">approximately 110 bricks</span>
              </p>
              <p>
                Total: <span className="text-accent font-bold">approximately 1,207 bricks</span>
              </p>
              <p>
                Mortar (planning assumption): <span className="text-slate-900 dark:text-white font-bold">10 × 80 lb Type N bags</span>
              </p>
            </div>
            <p className="text-micro text-slate-500 pt-1">
              Rounding the rate to 6.86 bricks per square foot first gives roughly 1,098 base bricks — a single brick
              difference from the unrounded rate this calculator uses.
            </p>
          </div>
        </div>

        {/* Mortar */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            How Much Mortar Do I Need?
          </h2>
          <p>
            The calculator converts your total brick count into 80 lb bags of pre-mixed Type N mortar using a planning
            assumption of approximately <strong className="text-slate-900 dark:text-white font-semibold">130 modular
            bricks per bag</strong>, and shows the approximate dry mix volume alongside the bag count. This is a
            planning assumption used by this tool, not a universal construction standard.
          </p>
          <p>
            Actual mortar requirements vary with brick dimensions, joint thickness, wall construction, workmanship, and
            product yield. The mortar quantity displayed here is an estimate for planning purposes, so confirm coverage
            on the product you intend to buy and keep a margin on hand for site conditions.
          </p>
        </div>

        {/* Wythe */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Single Wythe vs. Double Wythe
          </h2>
          <p>
            A <strong className="text-slate-900 dark:text-white font-semibold">single wythe</strong> is one layer
            (also called a leaf or skin) of brick — the thickness of a single course laid face to face. A{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">double wythe</strong> is two layers of
            brick placed together, so two leaves are built for every square foot of wall face.
          </p>
          <p>
            The calculator multiplies the base brick quantity by the selected wythe count, so choosing two wythes
            roughly doubles the bricks and the mortar estimate for the same wall area. Select the option that matches
            the wall you are planning; the tool reports material quantities only and does not evaluate whether a
            particular wall is structurally adequate or code-compliant.
          </p>
        </div>

        {/* Sizes & joints */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Brick Sizes and Mortar Joints
          </h2>
          <p>
            The calculator offers three brick presets — <strong className="text-slate-900 dark:text-white font-semibold">Modular</strong>,{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">Queen</strong>, and{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">King</strong>. Each preset loads a
            matching brick length and brick height plus a default mortar joint thickness, in metric (mm) or imperial
            (in) units depending on the unit control, so switching presets changes the effective brick face and the
            resulting brick count.
          </p>
          <p>
            Mortar joint thickness is part of the effective brick face, so it directly affects the estimated brick
            quantity. A thicker joint increases the area each brick covers and lowers the count per unit of wall; a
            thinner joint does the opposite. The joint thickness in use is shown beneath the 3D wall and in the
            calculation breakdown, together with the bricks per unit area it produces.
          </p>
        </div>

        {/* Bond */}
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Brick Bond Considerations
          </h2>
          <p>
            The pattern bricks are laid in is called the bond. Common examples include{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">stretcher bond</strong> (every course
            runs with stretchers and half-bond offsets),{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">English bond</strong> (alternating
            courses of stretchers and headers), and{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">Flemish bond</strong> (stretchers and
            headers alternating within each course).
          </p>
          <p>
            Bond and layout can affect cuts, detailing, and material usage at corners, openings, and coursing changes.
            This calculator estimates quantity primarily from wall dimensions, brick dimensions, mortar joint
            thickness, and wythe count, plus the waste allowance you select — it does not model a specific bond
            pattern, and no bond selector has been added to the tool.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-5">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {BRICK_FAQ.map((item) => (
              <div key={item.question} className="space-y-1.5">
                <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
                  {item.question}
                </h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Calculators Cross-links */}
        <div className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-4">
          <h2 className="text-heading-sm font-bold text-slate-900 dark:text-white">
            Related Construction Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={viewToPath('concrete-slab-calculator')}
              className="p-4 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 hover:border-accent text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-caption font-semibold text-slate-900 dark:text-white block">
                  Concrete Slab Calculator
                </span>
                <span className="text-micro font-mono text-slate-500">
                  Volumetric 3D slab takeoff
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
                  Architectural Paint Calculator
                </span>
                <span className="text-micro font-mono text-slate-500">
                  Room surface coatings & openings
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
