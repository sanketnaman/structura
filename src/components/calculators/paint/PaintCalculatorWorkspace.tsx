import React, { useState, useId, useEffect } from 'react';
import { ConstructionScene } from '../../3d/ConstructionScene';
import { RoomModel } from '../../3d/RoomModel';
import { calculatePaint } from '../../../lib/calculators/paint/calculator';
import type { UnitSystem } from '../../../types/layout';
import { formatNumber } from '../../../lib/calculators/common/math';
import { AdSlot } from '../../common/AdSlot';
import {
  PaintBucket,
  Copy,
  Share2,
  Printer,
  ChevronRight,
  Info,
  DollarSign,
  ArrowRight,
  Check,
  DoorOpen,
  Layers,
  Box,
  Home,
} from 'lucide-react';

interface PaintCalculatorWorkspaceProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  onNavigateToTool?: (toolSlug: string) => void;
}

export const PaintCalculatorWorkspace: React.FC<PaintCalculatorWorkspaceProps> = ({
  unitSystem,
  onUnitSystemChange,
  onNavigateToTool,
}) => {
  const isMetric = unitSystem === 'metric';

  // Form IDs
  const lengthId = useId();
  const widthId = useId();
  const heightId = useId();
  const doorsId = useId();
  const windowsId = useId();
  const priceId = useId();

  // Dynamic Room Dimension States (arbitrary floats allowed)
  const [roomLength, setRoomLength] = useState<number>(isMetric ? 4.5 : 14);
  const [roomWidth, setRoomWidth] = useState<number>(isMetric ? 3.8 : 12);
  const [wallHeight, setWallHeight] = useState<number>(isMetric ? 2.8 : 9);
  const [doorsCount, setDoorsCount] = useState<number>(1);
  const [windowsCount, setWindowsCount] = useState<number>(2);
  const [coats, setCoats] = useState<number>(2);

  // Optional Cost State
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
      if (params.get('tool') === 'paint-calculator') {
        const l = params.get('l');
        const w = params.get('w');
        const h = params.get('h');
        const d = params.get('d');
        const win = params.get('win');
        const c = params.get('c');
        const p = params.get('price');

        if (l) setRoomLength(parseFloat(l) || roomLength);
        if (w) setRoomWidth(parseFloat(w) || roomWidth);
        if (h) setWallHeight(parseFloat(h) || wallHeight);
        if (d) setDoorsCount(parseInt(d) || doorsCount);
        if (win) setWindowsCount(parseInt(win) || windowsCount);
        if (c) setCoats(parseInt(c) || coats);
        if (p) {
          setUnitPrice(p);
          setEnableCost(true);
        }
      }
    }
  }, []);

  // Calculation
  const parsedPrice = parseFloat(unitPrice) || 0;
  const result = calculatePaint({
    roomLength,
    roomWidth,
    wallHeight,
    doorsCount,
    windowsCount,
    coats,
    isMetric,
    unitPrice: enableCost ? parsedPrice : 0,
  });

  // Copy estimate
  const handleCopyEstimate = () => {
    const unitText = isMetric ? 'm' : 'ft';
    const summary = [
      `STRUCTURA ARCHITECTURAL PAINT TAKEOFF`,
      `----------------------------------------`,
      `Room Dimensions: ${roomLength} ${unitText} L × ${roomWidth} ${unitText} W × ${wallHeight} ${unitText} Ceiling H`,
      `Wall Perimeter: ${result.perimeter} ${unitText}`,
      `Gross Wall Area: ${result.grossWallArea} ${isMetric ? 'm²' : 'sq ft'}`,
      `Opening Deductions: -${result.totalDeductions} ${isMetric ? 'm²' : 'sq ft'} (${doorsCount} doors, ${windowsCount} windows)`,
      `Net Wall Surface: ${result.netWallArea} ${isMetric ? 'm²' : 'sq ft'}`,
      `Total Coated Surface (${coats} coats): ${result.totalCoatedArea} ${isMetric ? 'm²' : 'sq ft'}`,
      `Paint Volume Required: ${result.primaryQuantity} ${isMetric ? 'Liters' : 'Gallons'}`,
      `Packaging Breakdown: ${result.pails5Gal} × 5-Gal Pails + ${result.extraUnits} × 1-Gal Cans`,
      enableCost && parsedPrice > 0
        ? `Estimated Paint Material Cost: $${result.estimatedCost.toFixed(2)} (@ $${parsedPrice.toFixed(2)}/${isMetric ? 'L' : 'gal'})`
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
      tool: 'paint-calculator',
      unit: unitSystem,
      l: roomLength.toString(),
      w: roomWidth.toString(),
      h: wallHeight.toString(),
      d: doorsCount.toString(),
      win: windowsCount.toString(),
      c: coats.toString(),
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
            <span className="text-slate-900 dark:text-white font-semibold" aria-current="page">Architectural Paint</span>
          </nav>
          <h1 className="text-display font-bold text-slate-900 dark:text-white tracking-tight">
            Architectural Paint Calculator
          </h1>
          <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Calculate paint gallons, commercial 5-gallon pails, and coverage requirements with opening deductions and real-time 3D cutaway room visualization.
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
              Imperial (ft / gal)
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
              Metric (m / L)
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-5">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-charcoal-800 pb-3">
              <span className="text-caption font-semibold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300">
                Room Parameters & Openings
              </span>
              <span className="text-micro font-mono text-accent">Real-time Takeoff</span>
            </div>

            {/* 1. Room Length */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={lengthId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Room Length
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {formatNumber(roomLength)} {isMetric ? 'm' : 'ft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={isMetric ? 1.5 : 5}
                  max={isMetric ? 15 : 50}
                  step={isMetric ? 0.25 : 1}
                  value={roomLength}
                  onChange={(e) => setRoomLength(parseFloat(e.target.value) || 1.5)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={lengthId}
                    type="number"
                    step="any"
                    min={1}
                    max={150}
                    value={roomLength}
                    onChange={(e) => setRoomLength(Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Room Width */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={widthId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Room Width
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {formatNumber(roomWidth)} {isMetric ? 'm' : 'ft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={isMetric ? 1.5 : 5}
                  max={isMetric ? 15 : 50}
                  step={isMetric ? 0.25 : 1}
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 1.5)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={widthId}
                    type="number"
                    step="any"
                    min={1}
                    max={150}
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Ceiling Height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={heightId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Ceiling Height
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {formatNumber(wallHeight)} {isMetric ? 'm' : 'ft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={isMetric ? 2 : 7}
                  max={isMetric ? 6 : 20}
                  step={isMetric ? 0.1 : 0.5}
                  value={wallHeight}
                  onChange={(e) => setWallHeight(parseFloat(e.target.value) || 2)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={heightId}
                    type="number"
                    step="any"
                    min={1}
                    max={50}
                    value={wallHeight}
                    onChange={(e) => setWallHeight(Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Opening Deductions (Doors & Windows) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label htmlFor={doorsId} className="text-micro font-mono uppercase text-slate-500 flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5" />
                  <span>Doors (-{isMetric ? '2.0m²' : '21 sq ft'})</span>
                </label>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDoorsCount(d)}
                      className={`flex-1 py-1 rounded text-micro font-mono border transition-colors ${
                        doorsCount === d
                          ? 'bg-accent text-white border-accent font-semibold'
                          : 'bg-paper-100 dark:bg-charcoal-900 text-slate-600 dark:text-slate-400 border-paper-300 dark:border-charcoal-750'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor={windowsId} className="text-micro font-mono uppercase text-slate-500 flex items-center gap-1">
                  <span>Windows (-{isMetric ? '1.4m²' : '15 sq ft'})</span>
                </label>
                <div className="flex gap-1">
                  {[0, 1, 2, 4].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWindowsCount(w)}
                      className={`flex-1 py-1 rounded text-micro font-mono border transition-colors ${
                        windowsCount === w
                          ? 'bg-accent text-white border-accent font-semibold'
                          : 'bg-paper-100 dark:bg-charcoal-900 text-slate-600 dark:text-slate-400 border-paper-300 dark:border-charcoal-750'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Number of Coats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Number of Finish Coats
                </span>
                <span className="text-caption font-mono text-accent font-semibold">
                  {coats} {coats === 1 ? 'Coat (Primer/Recolor)' : 'Coats (Recommended Standard)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCoats(c)}
                    className={`py-2 rounded-tech text-micro font-mono border transition-colors ${
                      coats === c
                        ? 'bg-accent text-white border-accent font-semibold shadow-tech-subtle'
                        : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                    }`}
                  >
                    {c} {c === 1 ? 'Coat' : 'Coats'}
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
                  Paint Material Cost Estimate
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
                  Paint Price ($ per {isMetric ? 'Liter' : 'Gallon'}):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-caption font-mono text-slate-400">$</span>
                  <input
                    id={priceId}
                    type="number"
                    step="any"
                    placeholder="e.g. 52.00"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-body-sm tech-focus"
                  />
                </div>
                {parsedPrice > 0 && (
                  <div className="flex justify-between items-center text-caption font-mono pt-1 text-slate-700 dark:text-slate-300">
                    <span>Estimated Paint Cost:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-body-sm">
                      ${result.estimatedCost.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 3D Parametric Cutaway Room (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-micro text-slate-500 font-mono px-1">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live 3D Cutaway Room Inspector
              </span>
              <span>Visual Deductions · Orbit 360°</span>
            </div>

            <ConstructionScene
              title="3D Room Paint Inspector"
              className="w-full h-[400px] sm:h-[480px] lg:h-[500px]"
              cameraPosition={[6.2, 5.0, 7.8]}
            >
              <RoomModel
                length={roomLength}
                width={roomWidth}
                height={wallHeight}
                unit={unitSystem}
                coats={coats}
                doorsCount={doorsCount}
                windowsCount={windowsCount}
              />
            </ConstructionScene>

            <div className="flex items-center justify-between text-micro text-slate-500 px-1 font-mono">
              <span>
                Net Area: {formatNumber(result.netWallArea)} {isMetric ? 'm²' : 'sq ft'} · Deductions: -{formatNumber(result.totalDeductions)} {isMetric ? 'm²' : 'sq ft'}
              </span>
              <span className="text-accent">Coverage: {result.coverageRate} {isMetric ? 'm²/L' : 'sq ft/gal'}</span>
            </div>
          </div>

          {/* PRIMARY RESULTS TAKEOFF CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Card: Gallons / Liters */}
            <div className="sm:col-span-2 p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border-2 border-accent shadow-tech-card relative overflow-hidden">
              <div className="text-micro font-mono uppercase tracking-wider text-accent font-semibold mb-1">
                Paint Required ({coats} Finish {coats === 1 ? 'Coat' : 'Coats'})
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-display font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {result.primaryQuantity}
                </span>
                <span className="text-heading-sm font-mono text-slate-600 dark:text-slate-400">
                  {isMetric ? 'Liters' : 'Gallons'}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-mono text-slate-600 dark:text-slate-400">
                <span>Exact: {result.rawVolume} {isMetric ? 'L' : 'gal'}</span>
                <span className="text-accent">Total Coated: {formatNumber(result.totalCoatedArea)} {isMetric ? 'm²' : 'sq ft'}</span>
              </div>
            </div>

            {/* Secondary Card: Commercial Packaging */}
            <div className="p-5 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle flex flex-col justify-between">
              <div>
                <div className="text-micro font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Packaging Strategy
                </div>
                <div className="text-heading-md font-bold font-mono text-slate-900 dark:text-white">
                  {result.pails5Gal > 0 ? `${result.pails5Gal} × 5-Gal` : '1-Gal Cans'}
                </div>
                <div className="text-micro font-mono text-slate-400 mt-0.5">
                  {result.pails5Gal > 0 && result.extraUnits > 0
                    ? `+ ${result.extraUnits} × 1-Gal cans`
                    : `${result.primaryQuantity} cans total`}
                </div>
              </div>
              <div className="text-micro font-mono text-slate-500 pt-2 border-t border-paper-200 dark:border-charcoal-800">
                Prevents over-buying pails
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

      {/* 2. CALCULATION BREAKDOWN */}
      <section className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card space-y-4">
        <div className="flex items-center gap-2 border-b border-paper-200 dark:border-charcoal-800 pb-3">
          <Info className="w-5 h-5 text-accent" />
          <h2 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
            Transparent Paint & Surface Calculation Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-caption">
          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              Step 1: Gross Wall Perimeter & Area
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              Perimeter = ({formatNumber(roomLength)} + {formatNumber(roomWidth)}) × 2 = {result.perimeter} {isMetric ? 'm' : 'ft'}
            </p>
            <p className="text-slate-500">
              Gross Area = {result.perimeter} × {formatNumber(wallHeight)} = <span className="text-slate-900 dark:text-white font-bold">{formatNumber(result.grossWallArea)} {isMetric ? 'm²' : 'sq ft'}</span>
            </p>
          </div>

          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              Step 2: Architectural Deductions
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {doorsCount} Doors ({result.doorsDeduction}) + {windowsCount} Windows ({result.windowsDeduction})
            </p>
            <p className="text-slate-500">
              Net Wall Surface = {result.grossWallArea} - {result.totalDeductions} = <span className="text-slate-900 dark:text-white font-bold">{formatNumber(result.netWallArea)} {isMetric ? 'm²' : 'sq ft'}</span>
            </p>
          </div>

          <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-2">
            <span className="font-mono text-micro uppercase text-accent font-semibold block">
              Step 3: Coverage & Volume Takeoff
            </span>
            <p className="font-mono text-slate-800 dark:text-slate-200">
              {formatNumber(result.netWallArea)} × {coats} coats ÷ {result.coverageRate} {isMetric ? 'm²/L' : 'sq ft/gal'}
            </p>
            <p className="text-slate-500">
              = <span className="text-accent font-bold">{result.primaryQuantity} {isMetric ? 'Liters' : 'Gallons'}</span> total required.
            </p>
          </div>
        </div>
      </section>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="paint-calc-mid-ad" />

      {/* 3. SEO-STRUCTURED ARCHITECTURAL GUIDE */}
      <section className="space-y-8 pt-4 border-t border-paper-300 dark:border-charcoal-750 text-body-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white tracking-tight">
            How to Calculate Paint for Interior Walls and Ceilings
          </h2>
          <p>
            Estimating interior architectural coatings requires determining the net paintable drywall or plaster surface area. One standard U.S. gallon of interior latex or acrylic paint covers approximately 350 to 400 square feet on smooth primed drywall (or 8.5 to 10 square meters per liter). Unprimed fresh drywall, textured ceilings, or stucco absorb more coating, reducing spreading rate to approximately 250 to 300 sq ft/gallon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Why Two Coats Are Standard Practice
            </h3>
            <p>
              Two coats provide uniform film thickness (mil build), conceal underlying patches or contrasting pigment, and produce true manufacturer sheen (eggshell, satin, semi-gloss). While some commercial paints are advertised as "one-coat coverage," professional painting contractors consistently specify two finish coats over primer for warranty compliance and scrub resistance.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              Standard Opening Deduction Allowances
            </h3>
            <p>
              Architectural takeoffs deduct 21 sq ft (2.0 m²) for each standard interior door (3'-0" × 7'-0") and 15 sq ft (1.4 m²) for each standard double-hung or casement window (3'-0" × 5'-0"). For expansive picture windows or sliding patio doors, measure exact dimensions and deduct manually.
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
              onClick={() => onNavigateToTool?.('brick-mortar-calculator')}
              className="p-4 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 hover:border-accent text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-caption font-semibold text-slate-900 dark:text-white block">
                  Brick & Mortar Calculator
                </span>
                <span className="text-micro font-mono text-slate-500">
                  Masonry coursing & mortar bags
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
