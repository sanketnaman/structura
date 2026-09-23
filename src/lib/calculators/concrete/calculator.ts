import { roundTo } from '../common/math';
import type { ConcreteInputs, ConcreteResult } from './types';

export function calculateConcrete(inputs: ConcreteInputs): ConcreteResult {
  const { length, width, thickness, wastePercent, isMetric, unitPrice = 0 } = inputs;

  const safeLength = Math.max(0, isNaN(length) ? 0 : length);
  const safeWidth = Math.max(0, isNaN(width) ? 0 : width);
  const safeThickness = Math.max(0, isNaN(thickness) ? 0 : thickness);
  const safeWaste = Math.max(0, isNaN(wastePercent) ? 0 : wastePercent);
  const safePrice = Math.max(0, isNaN(unitPrice) ? 0 : unitPrice);

  if (isMetric) {
    // Metric: length (m), width (m), thickness (cm)
    const thicknessInMeters = safeThickness / 100;
    const baseM3 = safeLength * safeWidth * thicknessInMeters;
    const wasteFactor = safeWaste / 100;
    const wasteM3 = baseM3 * wasteFactor;
    const totalM3 = baseM3 + wasteM3;

    // Unit conversion: 1 m³ = 1.30795062 yd³, 1 m³ = 35.3146667 ft³
    const baseCuFt = baseM3 * 35.31467;
    const wasteCuFt = wasteM3 * 35.31467;
    const totalCuFt = totalM3 * 35.31467;
    const baseYards = baseM3 * 1.30795;
    const wasteYards = wasteM3 * 1.30795;
    const totalYards = totalM3 * 1.30795;

    const estimatedCost = safePrice > 0 ? roundTo(totalM3 * safePrice, 2) : 0;

    return {
      length: safeLength,
      width: safeWidth,
      thickness: safeThickness,
      isMetric: true,

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

      unitPrice: safePrice,
      estimatedCost,
    };
  } else {
    // Imperial: length (ft), width (ft), thickness (in)
    const thicknessInFeet = safeThickness / 12;
    const baseCuFt = safeLength * safeWidth * thicknessInFeet;
    const wasteFactor = safeWaste / 100;
    const wasteCuFt = baseCuFt * wasteFactor;
    const totalCuFt = baseCuFt + wasteCuFt;

    const baseYards = baseCuFt / 27;
    const wasteYards = wasteCuFt / 27;
    const totalYards = totalCuFt / 27;

    const baseM3 = baseYards * 0.764555;
    const wasteM3 = wasteYards * 0.764555;
    const totalM3 = totalYards * 0.764555;

    const estimatedCost = safePrice > 0 ? roundTo(totalYards * safePrice, 2) : 0;

    return {
      length: safeLength,
      width: safeWidth,
      thickness: safeThickness,
      isMetric: false,

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

      unitPrice: safePrice,
      estimatedCost,
    };
  }
}
