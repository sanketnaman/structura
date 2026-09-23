export interface BrickInputs {
  wallLength: number;      // ft or m
  wallHeight: number;      // ft or m
  brickLength?: number;    // inches or mm (default: standard modular 7.625" or 194mm)
  brickHeight?: number;    // inches or mm (default: standard modular 2.25" or 57mm)
  jointThickness?: number; // inches or mm (default: 3/8" = 0.375" or 10mm)
  wythes: 1 | 2;           // 1 = single wythe (4" nominal), 2 = double wythe (8" nominal)
  wastePercent: number;    // 0 to 25
  isMetric: boolean;
  unitPrice?: number;      // Price per brick
}

export interface BrickResult {
  wallLength: number;
  wallHeight: number;
  wallArea: number;        // sq ft or m²
  wythes: 1 | 2;
  wastePercent: number;

  effectiveBrickLength: number;
  effectiveBrickHeight: number;
  bricksPerUnitArea: number;

  baseBricks: number;
  wasteBricks: number;
  totalBricks: number;

  mortarBags: number;      // 80 lb Type N bags
  mortarVolumeCuFt: number;

  unitPrice: number;
  estimatedCost: number;
}
