import { roundTo } from '../common/math';
import type { PaintInputs, PaintResult, PaintPack } from './types';

// Commercial container sizes (liters), largest first, per metric locale.
// English and imperial keep the historical 19 L / 5-gal + 1-gal behaviour.
export const METRIC_PACKS: Record<string, number[]> = {
  pt: [18, 3.6],
  es: [19, 4],
  fr: [10, 2.5],
  de: [10, 5, 2.5],
};

export function calculatePaint(inputs: PaintInputs): PaintResult {
  const {
    roomLength,
    roomWidth,
    wallHeight,
    doorsCount = 1,
    windowsCount = 2,
    coats = 2,
    coverageRate,
    isMetric,
    unitPrice = 0,
    packSizes,
  } = inputs;

  const safeL = Math.max(0, isNaN(roomLength) ? 0 : roomLength);
  const safeW = Math.max(0, isNaN(roomWidth) ? 0 : roomWidth);
  const safeH = Math.max(0, isNaN(wallHeight) ? 0 : wallHeight);
  const safeDoors = Math.max(0, isNaN(doorsCount) ? 0 : doorsCount);
  const safeWindows = Math.max(0, isNaN(windowsCount) ? 0 : windowsCount);
  const safeCoats = Math.max(1, isNaN(coats) ? 1 : coats);
  const safePrice = Math.max(0, isNaN(unitPrice) ? 0 : unitPrice);

  const perimeter = roundTo((safeL + safeW) * 2, 2);
  const grossWallArea = roundTo(perimeter * safeH, 2);

  let doorArea: number;
  let windowArea: number;
  let defaultRate: number;

  if (isMetric) {
    // Standard door = ~2.0 m², standard window = ~1.4 m²
    doorArea = 2.0;
    windowArea = 1.4;
    defaultRate = 8.5; // m² per liter
  } else {
    // Standard door = ~21 sq ft, standard window = ~15 sq ft
    doorArea = 21;
    windowArea = 15;
    defaultRate = 350; // sq ft per gallon
  }

  const rate = coverageRate && coverageRate > 0 ? coverageRate : defaultRate;
  const doorsDeduction = roundTo(safeDoors * doorArea, 2);
  const windowsDeduction = roundTo(safeWindows * windowArea, 2);
  const totalDeductions = roundTo(doorsDeduction + windowsDeduction, 2);

  const netWallArea = Math.max(0, roundTo(grossWallArea - totalDeductions, 2));
  const totalCoatedArea = roundTo(netWallArea * safeCoats, 2);

  const rawVolume = rate > 0 ? totalCoatedArea / rate : 0;
  const primaryQuantity = Math.ceil(rawVolume);

  // Greedy largest-first pack breakdown. Defaults preserve the historical
  // behaviour: 19 L pails (metric) / 5-gal pails (imperial).
  const sizes = [...(packSizes && packSizes.length > 0 ? packSizes : isMetric ? [19] : [5])]
    .filter((s) => s > 0)
    .sort((a, b) => b - a);

  const packs: PaintPack[] = [];
  let remaining = primaryQuantity;
  for (const size of sizes) {
    const count = Math.floor(remaining / size + 1e-9);
    if (count > 0) {
      packs.push({ size, count });
      const next = roundTo(remaining - count * size, 2);
      remaining = Math.abs(next) < 1e-9 ? 0 : next;
    }
  }
  const remainder = roundTo(remaining, 2);

  const pails5Gal = packs.length > 0 ? packs[0].count : 0;
  const extraUnits = remainder;

  const estimatedCost = safePrice > 0 ? roundTo(primaryQuantity * safePrice, 2) : 0;

  return {
    roomLength: safeL,
    roomWidth: safeW,
    wallHeight: safeH,
    perimeter,

    grossWallArea,
    doorsDeduction,
    windowsDeduction,
    totalDeductions,
    netWallArea,
    totalCoatedArea,

    coverageRate: rate,
    rawVolume: roundTo(rawVolume, 2),
    primaryQuantity,
    pails5Gal,
    extraUnits,
    packs,
    remainder,

    unitPrice: safePrice,
    estimatedCost,
  };
}
