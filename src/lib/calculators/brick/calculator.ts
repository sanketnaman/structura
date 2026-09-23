import { roundTo } from '../common/math';
import type { BrickInputs, BrickResult } from './types';

export function calculateBrick(inputs: BrickInputs): BrickResult {
  const {
    wallLength,
    wallHeight,
    brickLength,
    brickHeight,
    jointThickness,
    wythes = 1,
    wastePercent,
    isMetric,
    unitPrice = 0,
  } = inputs;

  const safeLength = Math.max(0, isNaN(wallLength) ? 0 : wallLength);
  const safeHeight = Math.max(0, isNaN(wallHeight) ? 0 : wallHeight);
  const safeWaste = Math.max(0, isNaN(wastePercent) ? 0 : wastePercent);
  const safePrice = Math.max(0, isNaN(unitPrice) ? 0 : unitPrice);
  const safeWythes: 1 | 2 = wythes === 2 ? 2 : 1;

  const wallArea = roundTo(safeLength * safeHeight, 2);

  let bricksPerUnitArea: number;
  let effLength: number;
  let effHeight: number;

  if (isMetric) {
    // Length & height of brick in mm. Standard modular: 194mm x 57mm with 10mm joint
    const bL = brickLength ?? 194;
    const bH = brickHeight ?? 57;
    const jT = jointThickness ?? 10;

    effLength = (bL + jT) / 1000; // in meters
    effHeight = (bH + jT) / 1000; // in meters

    const brickFaceArea = effLength * effHeight;
    bricksPerUnitArea = brickFaceArea > 0 ? 1 / brickFaceArea : 52;
  } else {
    // Length & height in inches. Standard modular: 7.625" x 2.25" with 0.375" (3/8") joint
    const bL = brickLength ?? 7.625;
    const bH = brickHeight ?? 2.25;
    const jT = jointThickness ?? 0.375;

    effLength = (bL + jT) / 12; // in feet
    effHeight = (bH + jT) / 12; // in feet

    const brickFaceArea = effLength * effHeight;
    bricksPerUnitArea = brickFaceArea > 0 ? 1 / brickFaceArea : 6.85;
  }

  const singleWytheBase = Math.round(wallArea * bricksPerUnitArea);
  const baseBricks = singleWytheBase * safeWythes;
  const wasteBricks = Math.ceil(baseBricks * (safeWaste / 100));
  const totalBricks = baseBricks + wasteBricks;

  // 1 bag of 80 lb Type N mortar per ~130 modular bricks
  const mortarBags = totalBricks > 0 ? Math.ceil(totalBricks / 130) : 0;
  const mortarVolumeCuFt = roundTo(mortarBags * 0.75, 2);

  const estimatedCost = safePrice > 0 ? roundTo(totalBricks * safePrice, 2) : 0;

  return {
    wallLength: safeLength,
    wallHeight: safeHeight,
    wallArea,
    wythes: safeWythes,
    wastePercent: safeWaste,

    effectiveBrickLength: roundTo(effLength, 3),
    effectiveBrickHeight: roundTo(effHeight, 3),
    bricksPerUnitArea: roundTo(bricksPerUnitArea, 2),

    baseBricks,
    wasteBricks,
    totalBricks,

    mortarBags,
    mortarVolumeCuFt,

    unitPrice: safePrice,
    estimatedCost,
  };
}
