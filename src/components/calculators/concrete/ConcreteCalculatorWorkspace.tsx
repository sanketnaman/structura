import React, { useState, useEffect, useId } from 'react';
import { ConstructionScene } from '../../3d/ConstructionScene';
import { ConcreteSlab } from '../../3d/ConcreteSlab';
import {
  calculateConcreteSlab,
  calculateConcreteCost,
  roundTo,
} from '../../../lib/calculators/quickCalculations';
import type { UnitSystem } from '../../../types/layout';
import { AdSlot } from '../../common/AdSlot';
import {
  Box,
  Truck,
  Copy,
  Check,
  Share2,
  Printer,
  DollarSign,
  Info,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Layers,
  PaintBucket,
  ChevronRight,
  AlertCircle,
  Home,
} from 'lucide-react';

interface ConcreteCalculatorWorkspaceProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  onNavigateToTool?: (tool: string) => void;
}

type PresetType = 'walkway' | 'standard' | 'garage' | 'custom';

export const ConcreteCalculatorWorkspace: React.FC<ConcreteCalculatorWorkspaceProps> = ({
  unitSystem,
  onUnitSystemChange,
  onNavigateToTool,
}) => {
  const isMetric = unitSystem === 'metric';

  // Form IDs for accessibility
  const lengthId = useId();
  const widthId = useId();
  const thicknessId = useId();
  const wasteId = useId();
  const priceId = useId();

  // Dimension States (Defaults: 20 ft x 10 ft x 4 in or 6m x 3m x 10cm)
  const [length, setLength] = useState<number>(isMetric ? 6 : 20);
  const [width, setWidth] = useState<number>(isMetric ? 3 : 10);
  const [thickness, setThickness] = useState<number>(isMetric ? 10 : 4);
  const [waste, setWaste] = useState<number>(10);
  const [activePreset, setActivePreset] = useState<PresetType>('standard');

  // Optional Cost Estimation State (User MUST explicitly provide price)
  const [enableCost, setEnableCost] = useState<boolean>(false);
  const [unitPrice, setUnitPrice] = useState<string>(''); // Empty by default, no invented price

  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore state from URL query parameters if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const l = params.get('l');
      const w = params.get('w');
      const t = params.get('t');
      const wasteParam = params.get('waste');
      const priceParam = params.get('price');

      if (l) setLength(parseFloat(l) || length);
      if (w) setWidth(parseFloat(w) || width);
      if (t) setThickness(parseFloat(t) || thickness);
      if (wasteParam) setWaste(parseInt(wasteParam) || waste);
      if (priceParam) {
        setUnitPrice(priceParam);
        setEnableCost(true);
      }
      if (l || w || t) {
        setActivePreset('custom');
      }
    }
  }, []);

  // Sync unit switch defaults
  const handleUnitToggle = (newUnit: UnitSystem) => {
    onUnitSystemChange(newUnit);
    if (newUnit === 'metric' && !isMetric) {
      setLength(6);
      setWidth(3);
      setThickness(10);
      setActivePreset('standard');
    } else if (newUnit === 'imperial' && isMetric) {
      setLength(20);
      setWidth(10);
      setThickness(4);
      setActivePreset('standard');
    }
  };

  // Apply Presets
  const applyPreset = (preset: PresetType) => {
    setActivePreset(preset);
    if (preset === 'walkway') {
      setLength(isMetric ? 4 : 12);
      setWidth(isMetric ? 3 : 10);
      setThickness(isMetric ? 10 : 4);
    } else if (preset === 'standard') {
      setLength(isMetric ? 6 : 20);
      setWidth(isMetric ? 3 : 10);
      setThickness(isMetric ? 10 : 4);
    } else if (preset === 'garage') {
      setLength(isMetric ? 7 : 24);
      setWidth(isMetric ? 6 : 20);
      setThickness(isMetric ? 15 : 6);
    }
  };

  // Handle manual input change (switches preset to 'custom')
  const handleDimensionChange = (setter: (val: number) => void, val: number) => {
    setter(val);
    setActivePreset('custom');
  };

  // Calculations
  const result = calculateConcreteSlab(length, width, thickness, waste, isMetric);

  // Cost calculation
  const parsedPrice = parseFloat(unitPrice) || 0;
  const estimatedCost = enableCost
    ? calculateConcreteCost(
        isMetric ? result.totalVolumeM3 : result.totalCubicYards,
        parsedPrice
      )
    : 0;

  // Copy Estimate to Clipboard
  const handleCopyEstimate = () => {
    const unitText = isMetric ? 'm' : 'ft';
    const thickText = isMetric ? `${thickness} cm` : `${thickness} in`;
    const primaryVolume = isMetric ? `${result.totalVolumeM3} m³` : `${result.totalCubicYards} yd³`;
    const baseVolume = isMetric ? `${result.baseVolumeM3} m³` : `${result.baseVolumeCuFt} ft³ (${result.baseVolumeYards} yd³)`;

    const summary = [
      `STRUCTURA CONCRETE SLAB TAKEOFF`,
      `----------------------------------------`,
      `Project Dimensions: ${length} ${unitText} × ${width} ${unitText} × ${thickText}`,
      `Base Volume: ${baseVolume}`,
      `Waste / Over-order Allowance: ${waste}% (${isMetric ? result.wasteVolumeM3 + ' m³' : result.wasteVolumeCuFt + ' ft³'})`,
      `Final Quantity Required: ${primaryVolume} (${isMetric ? result.totalVolumeM3 + ' m³' : result.totalCuFt + ' ft³'})`,
      `Bagged Concrete Mix: ${result.bags80lb} × 80 lb bags (or ${result.bags60lb} × 60 lb bags)`,
      `Ready-Mix Truck Deliveries: ~${result.truckLoads} truck loads (~9 yd³ drum capacity)`,
      enableCost && parsedPrice > 0
        ? `Estimated Material Cost: $${estimatedCost.toFixed(2)} (@ $${parsedPrice.toFixed(2)}/${isMetric ? 'm³' : 'yd³'})`
        : null,
      `----------------------------------------`,
      `Generated at ${new Date().toLocaleDateString()} via Structura Construction Technology`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summary);
    showToast('Takeoff estimate copied to clipboard');
  };

  // Share via URL State
  const handleShare = () => {
    const params = new URLSearchParams({
      tool: 'concrete',
      unit: unitSystem,
      l: length.toString(),
      w: width.toString(),
      t: thickness.toString(),
      waste: waste.toString(),
    });
    if (enableCost && parsedPrice > 0) {
      params.set('price', parsedPrice.toString());
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Shareable project URL copied to clipboard');
  };

  // Print Action
  const handlePrint = () => {
    window.print();
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

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-micro font-mono text-slate-500">
        <button
          type="button"
          onClick={() => onNavigateToTool?.('overview')}
          className="hover:text-accent flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigateToTool?.('calculators')}
          className="hover:text-accent"
        >
          Calculators
        </button>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold" aria-current="page">
          Concrete Slab Calculator
        </span>
      </nav>

      {/* 1. TITLE & WORKSPACE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-paper-300 dark:border-charcoal-750 pb-4">
        <div>
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider mb-1">
            <span>Volumetric Material Takeoff</span>
            <span aria-hidden="true">·</span>
            <span>3D Spatial Engine</span>
          </div>
          <h1 className="text-display font-bold text-slate-900 dark:text-white tracking-tight">
            Concrete Slab Calculator
          </h1>
          <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Compute cubic yards, cubic feet, pre-mix bags, and supplier orders with real-time 3D dimensional verification and transparent mathematical formulas.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-micro font-mono text-slate-500 uppercase">Units:</span>
          <div className="flex p-0.5 rounded-tech bg-paper-200 dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 text-micro font-medium">
            <button
              type="button"
              onClick={() => handleUnitToggle('imperial')}
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
              onClick={() => handleUnitToggle('metric')}
              className={`px-3 py-1 rounded-tech transition-colors ${
                isMetric
                  ? 'bg-white dark:bg-charcoal-700 text-slate-900 dark:text-white shadow-tech-subtle font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Metric (m / cm)
            </button>
          </div>
        </div>
      </div>

      {/* 2. SPLIT WORKSPACE: INPUTS & 3D VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-charcoal-800 pb-3">
              <span className="text-heading-sm font-semibold text-slate-900 dark:text-white">
                Slab Dimensions
              </span>
              <span className="text-micro font-mono text-slate-500">
                {isMetric ? 'Metric (Meters / Centimeters)' : 'US Customary (Feet / Inches)'}
              </span>
            </div>

            {/* PRESETS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-micro text-slate-500 font-mono uppercase">
                  Project Presets:
                </span>
                {activePreset === 'custom' && (
                  <span className="text-micro font-mono text-accent font-semibold">
                    Custom Project Active
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('walkway')}
                  className={`px-2.5 py-2 rounded-tech text-micro font-medium border transition-colors text-center ${
                    activePreset === 'walkway'
                      ? 'bg-accent text-white border-accent font-semibold shadow-tech-subtle'
                      : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {isMetric ? 'Walkway (4×3m)' : 'Walkway / Patio (12×10\')'}
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('standard')}
                  className={`px-2.5 py-2 rounded-tech text-micro font-medium border transition-colors text-center ${
                    activePreset === 'standard'
                      ? 'bg-accent text-white border-accent font-semibold shadow-tech-subtle'
                      : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {isMetric ? 'Standard (6×3m)' : 'Standard Slab (20×10\')'}
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('garage')}
                  className={`px-2.5 py-2 rounded-tech text-micro font-medium border transition-colors text-center ${
                    activePreset === 'garage'
                      ? 'bg-accent text-white border-accent font-semibold shadow-tech-subtle'
                      : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {isMetric ? 'Garage (7×6m, 15cm)' : '2-Car Garage (24×20\', 6")'}
                </button>
              </div>
            </div>

            {/* 1. LENGTH INPUT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={lengthId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Length
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {length} {isMetric ? 'm' : 'ft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slab length slider"
                  min={isMetric ? 1 : 4}
                  max={isMetric ? 25 : 80}
                  step={isMetric ? 0.5 : 1}
                  value={length}
                  onChange={(e) => handleDimensionChange(setLength, parseFloat(e.target.value) || 1)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={lengthId}
                    type="number"
                    min={0.5}
                    max={500}
                    step="any"
                    value={length}
                    onChange={(e) => handleDimensionChange(setLength, Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. WIDTH INPUT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={widthId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                  Width
                </label>
                <span className="text-caption font-mono font-semibold text-accent">
                  {width} {isMetric ? 'm' : 'ft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="Slab width slider"
                  min={isMetric ? 1 : 3}
                  max={isMetric ? 15 : 50}
                  step={isMetric ? 0.5 : 1}
                  value={width}
                  onChange={(e) => handleDimensionChange(setWidth, parseFloat(e.target.value) || 1)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={widthId}
                    type="number"
                    min={0.5}
                    max={300}
                    step="any"
                    value={width}
                    onChange={(e) => handleDimensionChange(setWidth, Math.max(0.5, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'm' : 'ft'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. THICKNESS INPUT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor={thicknessId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                    Thickness / Depth
                  </label>
                  <span className="text-micro text-slate-500 block">
                    {thickness <= 4 ? 'Standard sidewalk / patio' : thickness <= 6 ? 'Vehicle driveway / garage floor' : 'Heavy commercial pad'}
                  </span>
                </div>
                <span className="text-caption font-mono font-semibold text-accent">
                  {thickness} {isMetric ? 'cm' : 'in'}
                </span>
              </div>

              {/* Fast thickness shortcut buttons */}
              <div className="flex gap-2">
                {isMetric ? (
                  [8, 10, 15, 20].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleDimensionChange(setThickness, t)}
                      className={`flex-1 py-1.5 rounded-tech text-micro font-mono font-medium border transition-colors ${
                        thickness === t
                          ? 'bg-accent text-white border-accent font-semibold'
                          : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                      }`}
                    >
                      {t} cm
                    </button>
                  ))
                ) : (
                  [3.5, 4, 6, 8].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleDimensionChange(setThickness, t)}
                      className={`flex-1 py-1.5 rounded-tech text-micro font-mono font-medium border transition-colors ${
                        thickness === t
                          ? 'bg-accent text-white border-accent font-semibold'
                          : 'bg-paper-100 dark:bg-charcoal-900 text-slate-700 dark:text-slate-300 border-paper-300 dark:border-charcoal-750 hover:bg-paper-200 dark:hover:bg-charcoal-800'
                      }`}
                    >
                      {t}"
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  aria-label="Slab thickness slider"
                  min={isMetric ? 5 : 2}
                  max={isMetric ? 40 : 16}
                  step={isMetric ? 1 : 0.5}
                  value={thickness}
                  onChange={(e) => handleDimensionChange(setThickness, parseFloat(e.target.value) || 2)}
                  className="flex-1 accent-accent cursor-pointer tech-focus"
                />
                <div className="relative w-28 shrink-0">
                  <input
                    id={thicknessId}
                    type="number"
                    min={0.5}
                    max={60}
                    step="any"
                    value={thickness}
                    onChange={(e) => handleDimensionChange(setThickness, Math.max(0.25, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm text-right pr-8 tech-focus"
                  />
                  <span className="absolute right-2.5 top-2 text-micro font-mono text-slate-400 pointer-events-none">
                    {isMetric ? 'cm' : 'in'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. WASTE / OVER-ORDER ALLOWANCE */}
            <div className="space-y-2 pt-2 border-t border-paper-200 dark:border-charcoal-800">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor={wasteId} className="text-body-sm font-medium text-slate-800 dark:text-slate-200">
                    Waste / Over-order Allowance
                  </label>
                  <span className="text-micro text-slate-500 block">
                    Additional quantity to account for placement losses, uneven forms and ordering margin.
                  </span>
                </div>
                <span className="text-caption font-mono font-semibold text-accent">
                  {waste}%
                </span>
              </div>
              <input
                id={wasteId}
                type="range"
                aria-label="Waste and over-order percentage slider"
                min={0}
                max={25}
                step={1}
                value={waste}
                onChange={(e) => setWaste(parseInt(e.target.value) || 0)}
                className="w-full accent-accent cursor-pointer tech-focus"
              />
              <div className="flex justify-between text-micro text-slate-400 font-mono">
                <span>0% (Exact CAD)</span>
                <span>10% (Trade Standard)</span>
                <span>20% (Rough Ground)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Visualization (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-caption text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live Parametric 3D Slab
            </span>
            <span className="text-micro font-mono text-slate-500">
              Dimensions: {length}×{width} {isMetric ? 'm' : 'ft'}, {thickness} {isMetric ? 'cm' : 'in'} thick
            </span>
          </div>

          {/* 3D Scene Viewport */}
          <div
            role="region"
            aria-label="3D Parametric Concrete Slab Model"
            className="w-full"
          >
            <ConstructionScene
              title="3D Slab Dimension Inspector"
              className="w-full h-[380px] sm:h-[440px] lg:h-[480px]"
              cameraPosition={[6.8, 5.2, 7.8]}
            >
              <ConcreteSlab
                length={length}
                width={width}
                thickness={thickness}
                unit={unitSystem}
                showSubgrade
              />
            </ConstructionScene>
          </div>

          {/* Screen-reader accessible dimension summary */}
          <div className="sr-only" aria-live="polite">
            Current slab geometry: length {length} {isMetric ? 'meters' : 'feet'}, width {width} {isMetric ? 'meters' : 'feet'}, thickness {thickness} {isMetric ? 'centimeters' : 'inches'}. Total required concrete volume is {isMetric ? `${result.totalVolumeM3} cubic meters` : `${result.totalCubicYards} cubic yards`}.
          </div>

          <div className="p-3 rounded-tech bg-paper-200/60 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-800 text-micro text-slate-500 flex items-center justify-between">
            <span>Left-click / touch to rotate 360° · Scroll / pinch to zoom</span>
            <span className="font-mono text-accent">Dimensions update automatically</span>
          </div>
        </div>
      </div>

      {/* 3. COMPLETE RESULTS SECTION */}
      <section aria-live="polite" className="space-y-6 pt-6 border-t border-paper-300 dark:border-charcoal-750">
        <div className="flex items-baseline justify-between border-b border-paper-200 dark:border-charcoal-800 pb-3">
          <div>
            <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
              Estimated Concrete Required
            </h2>
            <p className="text-caption text-slate-600 dark:text-slate-400">
              Rational precision with trade-calibrated over-order margin
            </p>
          </div>
          <span className="text-micro font-mono text-slate-500">
            ASTM Ready-Mix & Pre-Mix Equivalents
          </span>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Primary Result - Concrete Required */}
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border-2 border-accent dark:border-accent shadow-tech-card flex flex-col justify-between">
            <div>
              <span className="text-micro font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Order Quantity (With {waste}% Allowance)
              </span>
              <div className="text-display-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight mt-2">
                {isMetric ? `${result.totalVolumeM3} m³` : `${result.totalCubicYards} yd³`}
              </div>
              <div className="text-heading-sm font-semibold text-accent font-mono tabular-nums mt-1">
                {isMetric ? `${Math.round(result.totalVolumeM3 * 1000)} Liters` : `${result.totalCuFt} ft³`}
              </div>
              <p className="text-caption text-slate-600 dark:text-slate-400 mt-2">
                Final estimated volume to place with your ready-mix concrete supplier or bulk distributor.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-mono">
              <span className="text-slate-500">Ready-Mix Deliveries:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ~{result.truckLoads} Trucks (~9 yd³ drum)
              </span>
            </div>
          </div>

          {/* Card 2: Base Volume vs Allowance */}
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle flex flex-col justify-between">
            <div>
              <span className="text-micro font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Base Geometric Volume
              </span>
              <div className="text-display font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums tracking-tight mt-2">
                {isMetric
                  ? `${result.baseVolumeM3} m³`
                  : `${result.baseVolumeCuFt} ft³`}
              </div>
              <div className="text-heading-sm text-slate-500 font-mono tabular-nums mt-1">
                {isMetric
                  ? `${result.baseVolumeYards} yd³`
                  : `${result.baseVolumeYards} yd³ net`}
              </div>
              <p className="text-caption text-slate-600 dark:text-slate-400 mt-2">
                Theoretical geometric volume from entered dimensions before accounting for planning allowances.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-mono">
              <span className="text-slate-500">Over-Order Allowance ({waste}%):</span>
              <span className="font-semibold text-accent">
                +{isMetric ? `${result.wasteVolumeM3} m³` : `${result.wasteVolumeCuFt} ft³ (${result.wasteVolumeYards} yd³)`}
              </span>
            </div>
          </div>

          {/* Card 3: Bagged Pre-Mix Alternative */}
          <div className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle flex flex-col justify-between">
            <div>
              <span className="text-micro font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pre-Mix Dry Bag Alternative
              </span>
              <div className="text-display font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums tracking-tight mt-2">
                {result.bags80lb} <span className="text-heading-sm font-normal text-slate-500">Bags (80 lb)</span>
              </div>
              <div className="text-heading-sm text-slate-500 font-mono tabular-nums mt-1">
                or {result.bags60lb} Bags (60 lb)
              </div>
              <p className="text-caption text-slate-600 dark:text-slate-400 mt-2">
                If mixing dry concrete bags on site with a portable drum mixer or wheelbarrow.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-mono">
              <span className="text-slate-500">Yield Factors:</span>
              <span className="text-slate-600 dark:text-slate-400 text-micro">
                80lb = 0.60 ft³ · 60lb = 0.45 ft³
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALCULATION BREAKDOWN & STEP-BY-STEP PROOF */}
      <section className="p-6 sm:p-8 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-6">
        <div className="flex items-center gap-2 border-b border-paper-200 dark:border-charcoal-800 pb-3">
          <Info className="w-4 h-4 text-accent" />
          <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
            Transparent Calculation Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-caption">
          {/* Step 1: Unit Conversion */}
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-950 border border-paper-300 dark:border-charcoal-800 space-y-2">
            <span className="text-micro font-mono uppercase text-accent font-bold">
              Step 1: Convert Thickness
            </span>
            <div className="font-mono text-body-sm text-slate-900 dark:text-white font-semibold">
              {isMetric
                ? `${thickness} cm ÷ 100 = ${result.thicknessInMeters} m`
                : `${thickness} in ÷ 12 = ${result.thicknessInFeet} ft`}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-micro leading-relaxed">
              Thickness must be in the same dimensional units as length and width before computing volume.
            </p>
          </div>

          {/* Step 2: Base Geometric Volume */}
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-950 border border-paper-300 dark:border-charcoal-800 space-y-2">
            <span className="text-micro font-mono uppercase text-accent font-bold">
              Step 2: Net Base Volume
            </span>
            <div className="font-mono text-body-sm text-slate-900 dark:text-white font-semibold">
              {isMetric
                ? `${length} × ${width} × ${result.thicknessInMeters} = ${result.baseVolumeM3} m³`
                : `${length} × ${width} × ${result.thicknessInFeet} = ${result.baseVolumeCuFt} ft³`}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-micro leading-relaxed">
              {isMetric
                ? `Net geometric displacement: ${result.baseVolumeM3} m³ (${result.baseVolumeYards} yd³).`
                : `${result.baseVolumeCuFt} ft³ ÷ 27 = ${result.baseVolumeYards} cubic yards net.`}
            </p>
          </div>

          {/* Step 3: Allowance Addition */}
          <div className="p-4 rounded-tech bg-white dark:bg-charcoal-950 border border-paper-300 dark:border-charcoal-800 space-y-2">
            <span className="text-micro font-mono uppercase text-accent font-bold">
              Step 3: Add Over-Order ({waste}%)
            </span>
            <div className="font-mono text-body-sm text-slate-900 dark:text-white font-semibold">
              {isMetric
                ? `${result.baseVolumeM3} × 1.${waste < 10 ? '0' + waste : waste} = ${result.totalVolumeM3} m³`
                : `${result.baseVolumeCuFt} × 1.${waste < 10 ? '0' + waste : waste} = ${result.totalCuFt} ft³`}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-micro leading-relaxed">
              {isMetric
                ? `Final volume with safety margin: ${result.totalVolumeM3} m³.`
                : `${result.totalCuFt} ft³ ÷ 27 = ${result.totalCubicYards} cubic yards to order.`}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-paper-200 dark:border-charcoal-800 flex items-start gap-2.5 text-micro text-slate-600 dark:text-slate-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span>
            <strong>Practical Field Note:</strong> Ground subgrades are never laser-flat. Minor depressions, formwork deflection under wet hydrostatic pressure, and residual concrete stuck inside the delivery truck chute routinely consume 5% to 10% more volume than theoretical drawings. Always order with adequate margin.
          </span>
        </div>
      </section>

      {/* 5. OPTIONAL MATERIAL COST ESTIMATE SECTION */}
      <section className="p-6 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper-200 dark:border-charcoal-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <h3 className="text-heading-sm font-semibold text-slate-900 dark:text-white">
                Optional Material Cost Estimate
              </h3>
            </div>
            <p className="text-caption text-slate-600 dark:text-slate-400">
              Provide your local supplier quote to calculate estimated material costs
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-body-sm font-medium text-slate-800 dark:text-slate-200 select-none">
            <input
              type="checkbox"
              checked={enableCost}
              onChange={(e) => setEnableCost(e.target.checked)}
              className="rounded accent-accent w-4 h-4 cursor-pointer"
            />
            <span>Enable Cost Calculation</span>
          </label>
        </div>

        {enableCost ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Price Input */}
            <div className="space-y-1.5">
              <label htmlFor={priceId} className="text-caption font-medium text-slate-700 dark:text-slate-300 block">
                Local Concrete Price ({isMetric ? '$ / m³' : '$ / yd³'})
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-2.5 text-caption font-mono text-slate-400 pointer-events-none">
                  $
                </span>
                <input
                  id={priceId}
                  type="number"
                  min={0}
                  step={5}
                  placeholder={isMetric ? 'e.g. 150.00' : 'e.g. 145.00'}
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full pl-8 pr-16 py-2 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono tabular-nums text-body-sm tech-focus"
                />
                <span className="absolute right-3 top-2.5 text-micro font-mono text-slate-400 pointer-events-none">
                  {isMetric ? '/ m³' : '/ yd³'}
                </span>
              </div>
              <span className="text-micro text-slate-500 block">
                Contact your local batch plant for current delivered pricing.
              </span>
            </div>

            {/* Estimated Total */}
            <div className="p-4 rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 flex flex-col justify-between">
              <div>
                <span className="text-micro font-mono uppercase text-slate-500">
                  Estimated Concrete Material Cost
                </span>
                <div className="text-display font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
                  ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-micro text-slate-500 mt-2">
                Estimate only. Excludes supplier environmental charges, short-load fees, pumping costs, form lumber, rebar, and finishing labor.
              </span>
            </div>
          </div>
        ) : (
          <p className="text-caption text-slate-500 dark:text-slate-400 italic">
            Check the box above to enter your supplier's per-yard (or per-cubic-meter) quote and compute material cost.
          </p>
        )}
      </section>

      {/* 6. LIGHTWEIGHT UTILITY ACTIONS: COPY / SHARE / PRINT */}
      <section className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 no-print">
        <div className="text-caption font-medium text-slate-700 dark:text-slate-300">
          Save or export this concrete takeoff:
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopyEstimate}
            className="px-4 py-2 rounded-tech text-body-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-charcoal-800 hover:bg-paper-200 dark:hover:bg-charcoal-750 border border-paper-300 dark:border-charcoal-700 transition-colors flex items-center gap-1.5 shadow-tech-subtle"
          >
            <Copy className="w-3.5 h-3.5 text-accent" />
            <span>Copy Estimate</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-tech text-body-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-charcoal-800 hover:bg-paper-200 dark:hover:bg-charcoal-750 border border-paper-300 dark:border-charcoal-700 transition-colors flex items-center gap-1.5 shadow-tech-subtle"
          >
            <Share2 className="w-3.5 h-3.5 text-accent" />
            <span>Share Project</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-tech text-body-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-charcoal-800 hover:bg-paper-200 dark:hover:bg-charcoal-750 border border-paper-300 dark:border-charcoal-700 transition-colors flex items-center gap-1.5 shadow-tech-subtle"
          >
            <Printer className="w-3.5 h-3.5 text-accent" />
            <span>Print Sheet</span>
          </button>
        </div>
      </section>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="concrete-calc-mid-ad" />

      {/* 7. STRUCTURED SEO CONTENT SPECIFICATION */}
      <article className="space-y-10 pt-8 border-t border-paper-300 dark:border-charcoal-750 text-slate-700 dark:text-slate-300">
        <header className="space-y-3">
          <h2 className="text-display font-bold text-slate-900 dark:text-white tracking-tight">
            Concrete Slab Calculator Guide
          </h2>
          <p className="text-body text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Whether pouring a residential patio, sidewalk, equipment pad, or detached garage slab, calculating estimated concrete volume is fundamental to avoiding costly cold joints or excess disposal fees. This guide outlines standard geometric formulas, typical trade waste assumptions, and practical batching tips.
          </p>
        </header>

        {/* Section 1: How to Calculate */}
        <section className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            How to Calculate Concrete for a Slab
          </h2>
          <p className="text-body-sm leading-relaxed">
            Concrete is measured and sold in <strong>cubic yards</strong> ($yd^3$) in the United States and <strong>cubic meters</strong> ($m^3$) internationally. To calculate the volume required for a rectangular slab:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-body-sm pl-2">
            <li><strong>Measure the Length and Width</strong> in feet (or meters).</li>
            <li><strong>Determine the Slab Thickness</strong> in inches (or centimeters).</li>
            <li><strong>Convert Thickness to Feet</strong> by dividing by 12 (or to meters by dividing by 100).</li>
            <li><strong>Multiply Length × Width × Thickness</strong> to find the cubic feet (or cubic meters).</li>
            <li><strong>Divide Cubic Feet by 27</strong> to convert into cubic yards.</li>
            <li><strong>Add a Waste Allowance</strong> of 10% to account for subgrade unevenness and form flexure.</li>
          </ol>
        </section>

        {/* Section 2: Concrete Volume Formula */}
        <section className="space-y-4">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            Concrete Volume Formula
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
              <span className="text-micro font-mono uppercase text-accent font-bold">Imperial Formula (Cubic Yards)</span>
              <div className="p-3 rounded bg-paper-100 dark:bg-charcoal-950 font-mono text-body-sm text-slate-900 dark:text-white">
                Volume (yd³) = [ Length (ft) × Width (ft) × (Thickness (in) ÷ 12) ] ÷ 27 × (1 + Waste %)
              </div>
            </div>
            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-2">
              <span className="text-micro font-mono uppercase text-accent font-bold">Metric Formula (Cubic Meters)</span>
              <div className="p-3 rounded bg-paper-100 dark:bg-charcoal-950 font-mono text-body-sm text-slate-900 dark:text-white">
                Volume (m³) = Length (m) × Width (m) × (Thickness (cm) ÷ 100) × (1 + Waste %)
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Worked Example */}
        <section className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            Worked Example
          </h2>
          <div className="p-5 rounded-tech-lg bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 space-y-3">
            <p className="text-body-sm leading-relaxed">
              Suppose you are pouring a backyard patio measuring <strong>20 feet long by 10 feet wide with a standard 4-inch depth</strong>:
            </p>
            <div className="font-mono text-body-sm p-4 rounded bg-white dark:bg-charcoal-950 border border-paper-300 dark:border-charcoal-800 space-y-1">
              <div>1. Convert thickness: 4 in ÷ 12 = 0.333 ft</div>
              <div>2. Calculate net cubic feet: 20 ft × 10 ft × 0.333 ft = 66.67 ft³</div>
              <div>3. Convert to cubic yards: 66.67 ft³ ÷ 27 = 2.47 yd³ net</div>
              <div>4. Add 10% waste: 2.47 yd³ × 1.10 = 2.72 yd³ final order</div>
            </div>
            <p className="text-micro text-slate-500">
              For bulk delivery, you would round this order up to 2.75 or 3.0 cubic yards. For bagged concrete, 73.33 ft³ ÷ 0.60 ft³ requires 123 eighty-pound bags.
            </p>
          </div>
        </section>

        {/* Section 4: How Much Extra Concrete Should I Order? */}
        <section className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            How Much Extra Concrete Should I Order?
          </h2>
          <p className="text-body-sm leading-relaxed">
            Running short of concrete during a pour is a contractor's worst nightmare—it forces an emergency delivery and risks a weak, unsightly "cold joint" where new wet concrete cures against already-stiffened concrete. Standard trade guidelines recommend:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-body-sm pl-2">
            <li><strong>Standard Slabs on Flat Ground:</strong> Order <strong>10% extra</strong>.</li>
            <li><strong>Deep Footings or Irregular Excavations:</strong> Order <strong>12% to 15% extra</strong> due to soil sloughing and trench variations.</li>
            <li><strong>Smooth Pre-formed Raised Decks:</strong> Order <strong>5% extra</strong>.</li>
          </ul>
        </section>

        {/* Section 5: Important Considerations */}
        <section className="space-y-3">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            Important Considerations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm">
            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <h4 className="font-semibold text-slate-900 dark:text-white">Minimum Ready-Mix Surcharges</h4>
              <p className="text-slate-600 dark:text-slate-400 text-caption leading-relaxed">
                Most ready-mix concrete suppliers require a minimum order (typically 4 to 5 cubic yards). Orders below this threshold incur "short-load" delivery fees.
              </p>
            </div>
            <div className="p-4 rounded-tech bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 space-y-1.5">
              <h4 className="font-semibold text-slate-900 dark:text-white">Subgrade Compaction</h4>
              <p className="text-slate-600 dark:text-slate-400 text-caption leading-relaxed">
                A 4-inch compacted gravel base (crushed stone #57 or road base) prevents subgrade settlement, frost heaving, and uncontrolled slab cracking.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="space-y-4">
          <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-paper-200 dark:divide-charcoal-800">
            <div className="py-3.5 space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white text-body-sm">
                How many 80 lb bags of concrete equal one cubic yard?
              </h4>
              <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                One 80-pound bag yields approximately 0.60 cubic feet. Since one cubic yard contains 27 cubic feet, it mathematically requires approximately 45 bags of 80 lb concrete (or 60 bags of 60 lb concrete) per cubic yard based on this planning assumption.
              </p>
            </div>
            <div className="py-3.5 space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white text-body-sm">
                How thick should a concrete slab be?
              </h4>
              <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                Sidewalks, walkways, and patios typically require 4 inches (10 cm). Vehicle driveways, garage slabs, and heavy storage pads require a minimum of 5 to 6 inches (13 to 15 cm) with steel rebar or wire mesh reinforcement.
              </p>
            </div>
            <div className="py-3.5 space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white text-body-sm">
                What does a cubic yard of concrete weigh?
              </h4>
              <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                Standard normal-weight concrete weighs approximately 4,050 lbs (about 2 tons or 1,840 kg) per cubic yard when wet.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Related Calculators */}
        {onNavigateToTool && (
          <section className="space-y-4 pt-4 border-t border-paper-300 dark:border-charcoal-750">
            <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white">
              Related Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigateToTool('brick')}
                className="p-4 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 hover:border-accent dark:hover:border-accent text-left transition-colors flex items-center justify-between group shadow-tech-subtle"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-amber-50 dark:bg-amber-950/40 text-accent flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-body-sm font-semibold text-slate-900 dark:text-white block group-hover:text-accent transition-colors">
                      Brick & Mortar Calculator
                    </span>
                    <span className="text-micro text-slate-500">
                      Standard modular coursing and Type N mortar takeoffs
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTool('paint')}
                className="p-4 rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 hover:border-accent dark:hover:border-accent text-left transition-colors flex items-center justify-between group shadow-tech-subtle"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-amber-50 dark:bg-amber-950/40 text-accent flex items-center justify-center">
                    <PaintBucket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-body-sm font-semibold text-slate-900 dark:text-white block group-hover:text-accent transition-colors">
                      Architectural Paint Calculator
                    </span>
                    <span className="text-micro text-slate-500">
                      Multi-coat wall coverage and commercial packaging
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
              </button>
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
