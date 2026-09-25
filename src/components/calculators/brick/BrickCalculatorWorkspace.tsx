import React, { useState, useId, useEffect } from 'react';
import { ConstructionScene } from '../../3d/ConstructionScene';
import { BrickWall } from '../../3d/BrickWall';
import { calculateBrick } from '../../../lib/calculators/brick/calculator';
import type { UnitSystem } from '../../../types/layout';
import { formatNumber } from '../../../lib/calculators/common/math';
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
  onNavigateToTool?: (toolSlug: string) => void;
}

export const BrickCalculatorWorkspace: React.FC<BrickCalculatorWorkspaceProps> = ({
  unitSystem,
  onUnitSystemChange,
  onNavigateToTool,
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
      `STRUCTURA BRICK & MORTAR TAKEOFF`,
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
      `Generated at ${new Date().toLocaleDateString()} via Structura Construction Technology`,
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
            <button
              type="button"
              onClick={() => onNavigateToTool?.('overview')}
              className="hover:text-accent transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3" />
            <button
              type="button"
              onClick={() => onNavigateToTool?.('calculators')}
              className="hover:text-accent transition-colors"
            >
              Calculators
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-white font-semibold" aria-current="page">Brick & Mortar</span>
          </nav>
          <h1 className="text-display font-bold text-slate-900 dark:text-white tracking-tight">
            Brick & Mortar Calculator
          </h1>
          <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Calculate facing brick counts, bed joint mortar volume, and Type N bag allowances with real-time 3D masonry wall coursing and dynamic dimensional verification.
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
                Live 3D Masonry Inspector
              </span>
              <span>Arbitrary Aspect Scale · Orbit 360°</span>
            </div>

            <ConstructionScene
              title="3D Masonry Wall Inspector"
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

      {/* 3. SEO-STRUCTURED ARCHITECTURAL GUIDE */}
      <section className="space-y-8 pt-4 border-t border-paper-300 dark:border-charcoal-750 text-body-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            How to Calculate Bricks and Mortar for Masonry Construction
          </h2>
          <p>
            Accurate brick estimation requires calculating the gross wall surface area, dividing by the modular brick face including bed and head mortar joints, and accounting for wythe depth. Standard U.S. modular bricks measure 7⅝" long by 2¼" high by 3⅝" deep. When laid with a standard ⅜" mortar joint, each modular brick occupies an effective wall face of 8" × 2⅝", yielding approximately 6.85 bricks per square foot of single-wythe wall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Single Wythe vs. Double Wythe
            </h3>
            <p>
              A single wythe (also termed a single skin or half-brick leaf) is one brick thick (nominally 4 inches / 10 cm). It is common in residential veneer siding over timber framing. Double wythe construction consists of two parallel brick leaves bonded together (nominally 8 inches / 20 cm), providing structural gravity load-bearing strength or perimeter fire barrier containment.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Mortar Bag Rules of Thumb
            </h3>
            <p>
              One 80 lb (36 kg) bag of pre-mixed Type N masonry cement typically bonds between 120 and 140 standard modular facing bricks when laid with standard ⅜" (10 mm) concave joints. For structural below-grade retaining walls, ASTM C270 Type S mortar is specified for elevated compressive bonding.
            </p>
          </div>
        </div>

        {/* Related Calculators Cross-links */}
        <div className="p-6 rounded-tech-lg bg-paper-100 dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-4">
          <h2 className="text-heading-sm font-bold text-slate-900 dark:text-white">
            Related Construction Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onNavigateToTool?.('concrete-slab-calculator')}
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
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTool?.('paint-calculator')}
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
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
