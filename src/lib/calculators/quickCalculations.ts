// Pure mathematical conversion helpers and estimation logic for construction takeoffs

export interface ConcreteDetailedResult {
  // Primary Imperial Units
  baseVolumeCuFt: number;      // Exact net volume before waste (ft³)
  baseVolumeYards: number;     // Net volume in cubic yards (yd³)
  wastePercent: number;        // Over-order percentage (e.g. 10%)
  wasteVolumeCuFt: number;     // Allowance volume in ft³
  wasteVolumeYards: number;    // Allowance volume in yd³
  totalCuFt: number;           // Final estimated quantity (ft³)
  totalCubicYards: number;     // Final estimated quantity (yd³)

  // Primary Metric Units
  baseVolumeM3: number;        // Exact net volume before waste (m³)
  wasteVolumeM3: number;       // Allowance volume in m³
  totalVolumeM3: number;       // Final estimated quantity (m³)

  // Packaging & Logistics Breakdown
  bags80lb: number;            // 80 lb bags (0.60 cu ft yield)
  bags60lb: number;            // 60 lb bags (0.45 cu ft yield)
  truckLoads: number;          // Full ready-mix truck deliveries (~9 to 10 yd³ standard drum)

  // Step-by-step mathematical trace values
  thicknessInFeet: number;     // thickness / 12
  thicknessInMeters: number;   // thickness / 100
}

/**
 * Helper to round to specified decimal places without floating-point distortion
 */
export function roundTo(value: number, decimals: number = 2): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates concrete slab volume, over-order allowance, and packaging requirements
 */
export function calculateConcreteSlab(
  length: number,       // in feet (imperial) or meters (metric)
  width: number,        // in feet (imperial) or meters (metric)
  thickness: number,    // in inches (imperial) or centimeters (metric)
  wastePercent: number, // 0 to 100 (%)
  isMetric: boolean
): ConcreteDetailedResult {
  // Sanitize inputs against zero, negative, or invalid values
  const safeLength = Math.max(0, isNaN(length) ? 0 : length);
  const safeWidth = Math.max(0, isNaN(width) ? 0 : width);
  const safeThickness = Math.max(0, isNaN(thickness) ? 0 : thickness);
  const safeWaste = Math.max(0, isNaN(wastePercent) ? 0 : wastePercent);

  if (isMetric) {
    // Metric: length (m), width (m), thickness (cm)
    const thicknessInMeters = safeThickness / 100;
    const baseM3 = safeLength * safeWidth * thicknessInMeters;
    const wasteFactor = safeWaste / 100;
    const wasteM3 = baseM3 * wasteFactor;
    const totalM3 = baseM3 + wasteM3;

    // Unit conversion constants: 1 m³ = 1.30795 yd³, 1 m³ = 35.3147 ft³
    const baseCuFt = baseM3 * 35.31467;
    const wasteCuFt = wasteM3 * 35.31467;
    const totalCuFt = totalM3 * 35.31467;
    const totalYards = totalM3 * 1.30795;
    const baseYards = baseM3 * 1.30795;
    const wasteYards = wasteM3 * 1.30795;

    return {
      baseVolumeCuFt: roundTo(baseCuFt, 2),
      baseVolumeYards: roundTo(baseYards, 2),
      wastePercent: safeWaste,
      wasteVolumeCuFt: roundTo(wasteCuFt, 2),
      wasteVolumeYards: roundTo(wasteYards, 2),
      totalCuFt: roundTo(totalCuFt, 2),
      totalCubicYards: roundTo(totalYards, 2),

      baseVolumeM3: roundTo(baseM3, 2),
      wasteVolumeM3: roundTo(wasteM3, 2),
      totalVolumeM3: roundTo(totalM3, 2),

      bags80lb: totalCuFt > 0 ? Math.ceil(totalCuFt / 0.60) : 0,
      bags60lb: totalCuFt > 0 ? Math.ceil(totalCuFt / 0.45) : 0,
      truckLoads: totalYards > 0 ? roundTo(totalYards / 9, 1) : 0,

      thicknessInFeet: roundTo(safeThickness / 12, 3),
      thicknessInMeters: roundTo(thicknessInMeters, 3),
    };
  } else {
    // Imperial: length (ft), width (ft), thickness (inches)
    const thicknessInFeet = safeThickness / 12;
    const baseCuFt = safeLength * safeWidth * thicknessInFeet;
    const wasteFactor = safeWaste / 100;
    const wasteCuFt = baseCuFt * wasteFactor;
    const totalCuFt = baseCuFt + wasteCuFt;

    // Convert cubic feet to cubic yards (÷ 27)
    const baseYards = baseCuFt / 27;
    const wasteYards = wasteCuFt / 27;
    const totalYards = totalCuFt / 27;

    // Metric conversions for display flexibility (1 yd³ = 0.764555 m³)
    const baseM3 = baseYards * 0.7645549;
    const wasteM3 = wasteYards * 0.7645549;
    const totalM3 = totalYards * 0.7645549;

    return {
      baseVolumeCuFt: roundTo(baseCuFt, 2),
      baseVolumeYards: roundTo(baseYards, 2),
      wastePercent: safeWaste,
      wasteVolumeCuFt: roundTo(wasteCuFt, 2),
      wasteVolumeYards: roundTo(wasteYards, 2),
      totalCuFt: roundTo(totalCuFt, 2),
      totalCubicYards: roundTo(totalYards, 2),

      baseVolumeM3: roundTo(baseM3, 2),
      wasteVolumeM3: roundTo(wasteM3, 2),
      totalVolumeM3: roundTo(totalM3, 2),

      bags80lb: totalCuFt > 0 ? Math.ceil(totalCuFt / 0.60) : 0,
      bags60lb: totalCuFt > 0 ? Math.ceil(totalCuFt / 0.45) : 0,
      truckLoads: totalYards > 0 ? roundTo(totalYards / 9, 1) : 0,

      thicknessInFeet: roundTo(thicknessInFeet, 3),
      thicknessInMeters: roundTo((safeThickness * 2.54) / 100, 3),
    };
  }
}

/**
 * Calculates concrete material cost estimate based on user-provided unit price
 */
export function calculateConcreteCost(
  requiredVolume: number, // in cubic yards (or m³)
  unitPrice: number       // price per cubic yard (or per m³)
): number {
  if (isNaN(requiredVolume) || isNaN(unitPrice) || requiredVolume <= 0 || unitPrice <= 0) {
    return 0;
  }
  return roundTo(requiredVolume * unitPrice, 2);
}

export function calculateBrickWall(
  length: number, // ft or m
  height: number, // ft or m
  wastePercent: number,
  isMetric: boolean
) {
  const safeL = Math.max(0, isNaN(length) ? 0 : length);
  const safeH = Math.max(0, isNaN(height) ? 0 : height);
  const safeWaste = Math.max(0, isNaN(wastePercent) ? 0 : wastePercent);

  const area = safeL * safeH;
  // Standard modular brick nominal ~6.85 bricks per sq ft (Imperial) or ~52 per m² (Metric)
  const bricksPerArea = isMetric ? 52 : 6.85;
  const baseBricks = area * bricksPerArea;
  const totalBricks = Math.ceil(baseBricks * (1 + safeWaste / 100));
  // 1 bag of Type N mortar per ~120-140 modular bricks
  const mortarBags = totalBricks > 0 ? Math.ceil(totalBricks / 130) : 0;

  return {
    wallArea: roundTo(area, 2),
    totalBricks,
    baseBricks: Math.round(baseBricks),
    mortarBags,
  };
}

export function calculatePaintCoverage(
  roomLength: number,
  roomWidth: number,
  wallHeight: number,
  coats: number,
  isMetric: boolean
) {
  const safeL = Math.max(0, isNaN(roomLength) ? 0 : roomLength);
  const safeW = Math.max(0, isNaN(roomWidth) ? 0 : roomWidth);
  const safeH = Math.max(0, isNaN(wallHeight) ? 0 : wallHeight);
  const safeCoats = Math.max(1, isNaN(coats) ? 1 : coats);

  const perimeter = (safeL + safeW) * 2;
  const grossArea = perimeter * safeH;
  const deductions = isMetric ? 5 : 51; // Nominal 1 door + 2 windows
  const netArea = Math.max(0, grossArea - deductions);
  const totalCoatedArea = netArea * safeCoats;

  if (isMetric) {
    const liters = Math.ceil(totalCoatedArea / 8.5);
    return {
      netArea: roundTo(netArea, 2),
      totalCoverage: roundTo(totalCoatedArea, 2),
      primaryUnit: `${liters} L`,
      pails: Math.ceil(liters / 18.9),
      extraLiters: liters % 19,
    };
  } else {
    const gallons = totalCoatedArea / 350;
    const wholeGallons = Math.ceil(gallons);
    const pails5Gal = Math.floor(wholeGallons / 5);
    const extraGallons = wholeGallons % 5;
    return {
      netArea: roundTo(netArea, 2),
      totalCoverage: roundTo(totalCoatedArea, 2),
      primaryUnit: `${wholeGallons} gal`,
      pails: pails5Gal,
      extraGallons,
    };
  }
}
