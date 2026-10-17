export interface PaintInputs {
  roomLength: number;    // ft or m
  roomWidth: number;     // ft or m
  wallHeight: number;    // ft or m
  doorsCount: number;    // number of doors to deduct
  windowsCount: number;  // number of windows to deduct
  coats: number;         // 1, 2, 3...
  coverageRate?: number; // sq ft per gallon (default: 350) or m² per liter (default: 8.5)
  isMetric: boolean;
  unitPrice?: number;    // Price per gallon or per liter
  packSizes?: number[];  // Commercial container sizes (liters), largest first; metric locales only
}

export interface PaintPack {
  size: number; // liters (or gallons for the imperial default)
  count: number;
}

export interface PaintResult {
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  perimeter: number;

  grossWallArea: number;     // sq ft or m²
  doorsDeduction: number;
  windowsDeduction: number;
  totalDeductions: number;
  netWallArea: number;       // sq ft or m²
  totalCoatedArea: number;   // netWallArea * coats

  coverageRate: number;      // sq ft/gal or m²/L
  rawVolume: number;
  primaryQuantity: number;   // whole gallons or liters
  pails5Gal: number;         // count of the largest pack (compat field)
  extraUnits: number;        // liters/gallons left after the pack breakdown
  packs: PaintPack[];        // greedy largest-first pack breakdown
  remainder: number;         // primaryQuantity - sum(count × size)

  unitPrice: number;
  estimatedCost: number;
}
