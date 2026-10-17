import { describe, it, expect } from 'vitest';
import { calculateConcrete } from '../src/lib/calculators/concrete/calculator';
import { calculateBrick } from '../src/lib/calculators/brick/calculator';
import { en, dictionaries } from '../src/lib/i18n/dictionaries';

const localized = ['es', 'pt', 'fr', 'de'] as const;

// Every number quoted in a localized guide worked example must be produced by
// the app's own calculator functions — never hand-typed.

describe('guide worked-example numbers', () => {
  it('concrete metric example (6 m × 3 m × 10 cm, 10% waste) matches calculateConcrete', () => {
    const r = calculateConcrete({
      length: 6,
      width: 3,
      thickness: 10,
      wastePercent: 10,
      isMetric: true,
    });
    expect(r.baseVolumeM3).toBe(1.8);
    expect(r.totalVolumeM3).toBe(1.98);
    expect(r.totalCuFt).toBe(69.92);
    expect(r.bags80lb).toBe(117);
    expect(r.bags60lb).toBe(156);
    // The metric example strings must quote exactly these values
    // (localized dicts use decimal commas: 1,8 / 1,98).
    for (const code of localized) {
      const dict = dictionaries[code];
      expect(dict['concrete.guide.exampleStep2Metric']).toContain('1,8');
      expect(dict['concrete.guide.exampleStep3Metric']).toContain('1,98');
      expect(dict['concrete.guide.exampleStep4Metric']).toContain('117');
      expect(dict['concrete.guide.exampleNoteMetric']).toContain('117');
      expect(dict['concrete.guide.exampleNoteMetric']).toContain('156');
    }
  });

  it('concrete guide step5 m³→yd³ factor matches calculateConcrete (1.30795)', () => {
    const r = calculateConcrete({
      length: 6,
      width: 3,
      thickness: 10,
      wastePercent: 0,
      isMetric: true,
    });
    expect(r.baseVolumeM3).toBe(1.8);
    // 1.8 m³ × 1.30795 = 2.35431 yd³ → 2.35 (calculator.ts:25)
    expect(r.baseVolumeYards).toBe(2.35);
    // The quoted factor must round-trip to the calculator's own yards output
    expect(Math.round(1.8 * 1.308 * 100) / 100).toBe(2.35);
    for (const code of localized) {
      const dict = dictionaries[code];
      expect(dict['concrete.guide.step5']).toContain('1,308');
      expect(dict['concrete.guide.step5']).toContain('27');
    }
    // English keeps the ft³ ÷ 27 wording untouched
    expect(en['concrete.guide.step5']).toContain('Divide Cubic Feet by 27');
  });

  it('concrete imperial example (20 ft × 10 ft × 4 in, 10% waste) matches calculateConcrete', () => {
    const r = calculateConcrete({
      length: 20,
      width: 10,
      thickness: 4,
      wastePercent: 10,
      isMetric: false,
    });
    expect(r.baseVolumeCuFt).toBe(66.67);
    expect(r.totalCuFt).toBe(73.33);
    expect(r.totalCubicYards).toBe(2.72);
    expect(r.bags80lb).toBe(123);
    expect(en['concrete.guide.exampleStep2']).toContain('66.67');
    expect(en['concrete.guide.exampleStep3']).toContain('2.47');
    expect(en['concrete.guide.exampleStep4']).toContain('2.72');
    expect(en['concrete.guide.exampleNote']).toContain('123');
  });

  it('brick metric example (8 m × 2.5 m, modular 194×57 mm, 10 mm joint, 10% waste) matches calculateBrick', () => {
    const r = calculateBrick({
      wallLength: 8,
      wallHeight: 2.5,
      brickLength: 194,
      brickHeight: 57,
      jointThickness: 10,
      wythes: 1,
      wastePercent: 10,
      isMetric: true,
    });
    expect(r.wallArea).toBe(20);
    expect(r.bricksPerUnitArea).toBe(73.16);
    expect(r.baseBricks).toBe(1463);
    expect(r.wasteBricks).toBe(147);
    expect(r.totalBricks).toBe(1610);
    expect(r.mortarBags).toBe(13);
    // Localized dicts use decimal commas and locale thousand separators
    // (1463 / 1.463 / 1 463), so match the digits with an optional separator.
    for (const code of localized) {
      const dict = dictionaries[code];
      expect(dict['brick.guide.exampleAreaMetric']).toContain('20 m²');
      expect(dict['brick.guide.exampleRateMetric']).toContain('73,16');
      expect(dict['brick.guide.exampleBaseMetric']).toMatch(/1[.,\s]?463/);
      expect(dict['brick.guide.exampleTotalMetric']).toMatch(/1[.,\s]?610/);
      expect(dict['brick.guide.exampleMortarMetric']).toContain('13');
    }
  });

  it('brick imperial example (20 ft × 8 ft, modular, ⅜ in joint, 10% waste) matches calculateBrick', () => {
    const r = calculateBrick({
      wallLength: 20,
      wallHeight: 8,
      // imperial defaults: brick 7.625 in × 2.25 in, joint 0.375 in
      wythes: 1,
      wastePercent: 10,
      isMetric: false,
    });
    expect(r.wallArea).toBe(160);
    expect(r.bricksPerUnitArea).toBe(6.86);
    expect(r.baseBricks).toBe(1097);
    expect(r.wasteBricks).toBe(110);
    expect(r.totalBricks).toBe(1207);
    expect(r.mortarBags).toBe(10);
    expect(en['brick.guide.exampleRate']).toContain('6.86');
    expect(en['brick.guide.exampleBase']).toContain('1,097');
    expect(en['brick.guide.exampleTotal']).toContain('1,207');
    expect(en['brick.guide.exampleMortar']).toContain('10 × 80 lb');
  });
});
