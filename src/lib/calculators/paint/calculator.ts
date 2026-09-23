import { roundTo } from '../common/math';
import type { PaintInputs, PaintResult } from './types';

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

  let pails5Gal = 0;
  let extraUnits = 0;

  if (isMetric) {
    // 1 standard pail = 19 Liters (~5 Gallons)
    pails5Gal = Math.floor(primaryQuantity / 19);
    extraUnits = primaryQuantity % 19;
  } else {
    pails5Gal = Math.floor(primaryQuantity / 5);
    extraUnits = primaryQuantity % 5;
  }

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

    unitPrice: safePrice,
    estimatedCost,
  };
}
