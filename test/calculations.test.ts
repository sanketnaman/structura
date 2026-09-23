import { describe, it, expect } from 'vitest';
import {
  calculateConcreteSlab,
  calculateConcreteCost,
  roundTo,
  calculateBrickWall,
  calculatePaintCoverage,
} from '../src/lib/calculators/quickCalculations';

describe('Concrete Slab Calculator Engine', () => {
  it('calculates 20ft x 10ft x 4in slab accurately with 10% waste (Imperial)', () => {
    // 20 * 10 * (4/12) = 66.666... cu ft base
    // Base volume cu yd = 66.67 / 27 = 2.47 yd³
    // With 10% waste = 66.666... * 1.10 = 73.33 cu ft
    // Total volume cu yd = 73.33 / 27 = 2.72 yd³
    const result = calculateConcreteSlab(20, 10, 4, 10, false);

    expect(result.baseVolumeCuFt).toBe(66.67);
    expect(result.baseVolumeYards).toBe(2.47);
    expect(result.wastePercent).toBe(10);
    expect(result.wasteVolumeCuFt).toBe(6.67);
    expect(result.wasteVolumeYards).toBe(0.25);
    expect(result.totalCuFt).toBe(73.33);
    expect(result.totalCubicYards).toBe(2.72);
    expect(result.thicknessInFeet).toBe(0.333);

    // Bagged mix equivalents
    expect(result.bags80lb).toBe(Math.ceil(73.33 / 0.60)); // 123
    expect(result.bags60lb).toBe(Math.ceil(73.33 / 0.45)); // 163
    expect(result.truckLoads).toBeCloseTo(0.3, 1);
  });

  it('calculates 6m x 3m x 10cm slab with 10% waste (Metric)', () => {
    // 6 * 3 * 0.10 = 1.80 m³ base
    // 10% waste = 0.18 m³
    // Total = 1.98 m³
    const result = calculateConcreteSlab(6, 3, 10, 10, true);

    expect(result.baseVolumeM3).toBe(1.80);
    expect(result.wasteVolumeM3).toBe(0.18);
    expect(result.totalVolumeM3).toBe(1.98);
    expect(result.thicknessInMeters).toBe(0.10);
  });

  it('handles decimal dimensions precisely (e.g. 15.5 ft x 8.25 ft x 3.5 in)', () => {
    const result = calculateConcreteSlab(15.5, 8.25, 3.5, 10, false);
    // 15.5 * 8.25 * (3.5 / 12) = 37.296875 cu ft base
    expect(result.baseVolumeCuFt).toBe(37.3);
    expect(result.totalCuFt).toBeGreaterThan(result.baseVolumeCuFt);
    expect(result.totalCubicYards).toBe(roundTo(result.totalCuFt / 27, 2));
  });

  it('handles zero values gracefully without NaN or Infinity', () => {
    const result = calculateConcreteSlab(0, 10, 4, 10, false);
    expect(result.baseVolumeCuFt).toBe(0);
    expect(result.totalCubicYards).toBe(0);
    expect(result.bags80lb).toBe(0);
    expect(result.truckLoads).toBe(0);
    expect(Number.isNaN(result.totalCuFt)).toBe(false);
  });

  it('safely clamps negative values to zero without failing', () => {
    const result = calculateConcreteSlab(-20, 10, 4, -5, false);
    expect(result.baseVolumeCuFt).toBe(0);
    expect(result.totalCubicYards).toBe(0);
    expect(result.wastePercent).toBe(0);
  });

  it('handles NaN or invalid inputs safely', () => {
    const result = calculateConcreteSlab(Number.NaN, 10, Number.NaN, 10, false);
    expect(result.baseVolumeCuFt).toBe(0);
    expect(result.totalCubicYards).toBe(0);
    expect(Number.isNaN(result.totalCuFt)).toBe(false);
  });

  it('accurately tests waste percentages from 0% to 25%', () => {
    const zeroWaste = calculateConcreteSlab(20, 10, 4, 0, false);
    expect(zeroWaste.totalCuFt).toBe(zeroWaste.baseVolumeCuFt);
    expect(zeroWaste.wasteVolumeCuFt).toBe(0);

    const fullWaste = calculateConcreteSlab(20, 10, 4, 25, false);
    expect(fullWaste.totalCuFt).toBeCloseTo(zeroWaste.baseVolumeCuFt * 1.25, 1);
  });

  it('enforces sensible rounding and avoids excessive decimal places', () => {
    const rawVal = 66.6666666667;
    const rounded = roundTo(rawVal, 2);
    expect(rounded).toBe(66.67);
    expect(rounded.toString()).toBe('66.67');
  });

  it('reflects thickness changes on volume directly (proportional scaling)', () => {
    const thin = calculateConcreteSlab(20, 10, 4, 0, false);
    const thick = calculateConcreteSlab(20, 10, 8, 0, false);
    // Doubling thickness from 4 to 8 inches must double volume exactly
    expect(thick.baseVolumeCuFt).toBeCloseTo(thin.baseVolumeCuFt * 2, 1);
  });
});

describe('Material Cost Engine', () => {
  it('calculates material cost based on user-provided unit price', () => {
    // 2.72 yd³ at $145.00/yd³ = $394.40
    const cost = calculateConcreteCost(2.72, 145);
    expect(cost).toBe(394.40);
  });

  it('returns 0 for unprovided or zero unit prices without defaulting', () => {
    expect(calculateConcreteCost(2.72, 0)).toBe(0);
    expect(calculateConcreteCost(2.72, Number.NaN)).toBe(0);
    expect(calculateConcreteCost(0, 145)).toBe(0);
  });
});

describe('Brick Wall Calculator Engine', () => {
  it('calculates brick count for 25ft x 8ft wall with 8% waste', () => {
    const result = calculateBrickWall(25, 8, 8, false);
    expect(result.wallArea).toBe(200);
    expect(result.totalBricks).toBeGreaterThan(1400);
    expect(result.mortarBags).toBeGreaterThan(10);
  });
});

describe('Paint Calculator Engine', () => {
  it('calculates paint volume with 2 coats for 14x12x9 room', () => {
    const result = calculatePaintCoverage(14, 12, 9, 2, false);
    expect(result.netArea).toBeGreaterThan(400);
    expect(result.primaryUnit).toContain('gal');
  });
});
