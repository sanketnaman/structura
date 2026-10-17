import { describe, it, expect } from 'vitest';
import { calculatePaint, METRIC_PACKS } from '../src/lib/calculators/paint/calculator';
import { translate, en, dictionaries } from '../src/lib/i18n';

const localized = ['es', 'pt', 'fr', 'de'] as const;

const metricDefaults = {
  roomLength: 4.2,
  roomWidth: 3.6,
  wallHeight: 2.7,
  doorsCount: 1,
  windowsCount: 2,
  coats: 2,
  isMetric: true,
};

describe('paint per-locale pack sizes', () => {
  it('has per-metric-locale pack tables, largest first', () => {
    for (const code of localized) {
      const sizes = METRIC_PACKS[code];
      expect(sizes, code).toBeDefined();
      expect(sizes.length).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i - 1], code).toBeGreaterThan(sizes[i]);
      }
      expect(sizes.every((s) => s > 0)).toBe(true);
    }
  });

  it('default inputs (4.2 m × 3.6 m × 2.7 m, 1 door, 2 windows, 2 coats) need 9 L', () => {
    const r = calculatePaint({ ...metricDefaults, packSizes: METRIC_PACKS.es });
    expect(r.primaryQuantity).toBe(9);
  });

  it('packs + remainder reconcile with primaryQuantity for every locale', () => {
    for (const code of localized) {
      const sizes = METRIC_PACKS[code];
      const r = calculatePaint({ ...metricDefaults, packSizes: sizes });
      expect(r.packs.length, code).toBeGreaterThan(0);

      const covered = r.packs.reduce((sum, p) => sum + p.count * p.size, 0);
      expect(covered + r.remainder, code).toBeCloseTo(r.primaryQuantity, 9);

      // Greedy: counts are whole positive numbers, packs sorted largest first.
      expect(r.packs.every((p) => Number.isInteger(p.count) && p.count > 0), code).toBe(true);
      for (let i = 1; i < r.packs.length; i++) {
        expect(r.packs[i - 1].size, code).toBeGreaterThan(r.packs[i].size);
      }

      // The leftover is always smaller than one smallest pack (or the whole
      // quantity when the quantity fits in no pack at all).
      expect(r.remainder, code).toBeGreaterThanOrEqual(0);
      expect(r.remainder, code).toBeLessThan(Math.min(...sizes) + 1e-9);

      // Legacy compat fields keep their meaning: largest pack + leftover.
      expect(r.pails5Gal, code).toBe(r.packs[0]?.count ?? 0);
      expect(r.extraUnits, code).toBe(r.remainder);
    }
  });

  it('es worked example (14 m × 12 m × 9 m) packs as 5×19 + 3×4 + 2 L', () => {
    const r = calculatePaint({
      roomLength: 14,
      roomWidth: 12,
      wallHeight: 9,
      doorsCount: 1,
      windowsCount: 2,
      coats: 2,
      isMetric: true,
      packSizes: METRIC_PACKS.es,
    });
    expect(r.primaryQuantity).toBe(109);
    expect(r.packs).toEqual([
      { size: 19, count: 5 },
      { size: 4, count: 3 },
    ]);
    expect(r.remainder).toBe(2);

    const heading = r.packs
      .map((p) => translate('es', 'paint.pailsOf5Metric', { count: p.count, size: p.size }))
      .join(' + ');
    expect(heading).toBe('5 × 19 L + 3 × 4 L');
  });

  it('fractional packs render cleanly (pt 3.6 L / fr & de 2.5 L)', () => {
    const pt = calculatePaint({ ...metricDefaults, packSizes: METRIC_PACKS.pt });
    expect(pt.packs).toEqual([{ size: 3.6, count: 2 }]);
    expect(pt.remainder).toBeCloseTo(1.8, 9);
    expect(translate('pt', 'paint.pailsOf5Metric', { count: 2, size: 3.6 })).toBe('2 × 3,6 L');

    const fr = calculatePaint({ ...metricDefaults, packSizes: METRIC_PACKS.fr });
    expect(fr.packs).toEqual([{ size: 2.5, count: 3 }]);
    expect(fr.remainder).toBeCloseTo(1.5, 9);

    const de = calculatePaint({ ...metricDefaults, packSizes: METRIC_PACKS.de });
    expect(de.packs).toEqual([
      { size: 5, count: 1 },
      { size: 2.5, count: 1 },
    ]);
    expect(de.remainder).toBeCloseTo(1.5, 9);
  });

  it('quantity below the smallest pack falls back to one small can heading', () => {
    const r = calculatePaint({
      ...metricDefaults,
      roomLength: 0.5,
      roomWidth: 0.5,
      wallHeight: 2.5,
      doorsCount: 0,
      windowsCount: 0,
      coats: 1,
      packSizes: METRIC_PACKS.fr,
    });
    expect(r.primaryQuantity).toBeLessThan(Math.min(...METRIC_PACKS.fr));
    expect(r.packs).toEqual([]);
    expect(r.pails5Gal).toBe(0);
    expect(r.remainder).toBe(r.primaryQuantity);
    expect(translate('fr', 'paint.oneGalCansMetric', { size: 2.5 })).toBe('Pots de 2,5 L');
  });

  it('imperial and plain-metric defaults keep the legacy formulas', () => {
    const imperial = calculatePaint({
      roomLength: 14,
      roomWidth: 12,
      wallHeight: 9,
      doorsCount: 1,
      windowsCount: 2,
      coats: 2,
      isMetric: false,
    });
    expect(imperial.pails5Gal).toBe(Math.floor(imperial.primaryQuantity / 5));
    expect(imperial.extraUnits).toBe(imperial.primaryQuantity % 5);
    expect(imperial.remainder).toBe(imperial.extraUnits);

    const plainMetric = calculatePaint({ ...metricDefaults });
    expect(plainMetric.pails5Gal).toBe(Math.floor(plainMetric.primaryQuantity / 19));
    expect(plainMetric.extraUnits).toBe(plainMetric.primaryQuantity % 19);
  });
});

describe('paint pack copy keys', () => {
  it('en pack strings stay byte-identical', () => {
    expect(en['paint.headerBodyMetric']).toBe(
      'Calculate paint in liters, commercial 19-liter pails, and coverage requirements with opening deductions and real-time 3D cutaway room visualization.',
    );
    expect(en['paint.pailsOf5Metric']).toBe('{count} × 19 L');
    expect(en['paint.oneGalCansMetric']).toBe('Paint Cans (3.78 L)');
    expect(en['paint.extraCansMetric']).toBe('+ {count} L extra');
    expect(en['paint.cansTotalMetric']).toBe('{count} L total');
    expect(en['paint.copy.packagingMetric']).toBe(
      'Packaging Breakdown: {p} × 19 L Pails + {e} L',
    );
    expect(en['paint.pailsOf5']).toBe('{count} × 5-Gal');
    expect(en['paint.copy.packaging']).toBe(
      'Packaging Breakdown: {p} × 5-Gal Pails + {e} × 1-Gal Cans',
    );
  });

  it('non-en pack templates take a size/pack summary param, not a hard-coded 19', () => {
    for (const code of localized) {
      const dict = dictionaries[code];
      expect(dict['paint.pailsOf5Metric'], code).toContain('{size}');
      expect(dict['paint.oneGalCansMetric'], code).toContain('{size}');
      expect(dict['paint.copy.packagingMetric'], code).toContain('{p}');
      expect(dict['paint.copy.packagingMetric'], code).toContain('{e}');
      expect(dict['paint.copy.packagingMetric'], code).not.toContain('19');
      expect(dict['paint.pailsOf5Metric'], code).not.toContain('19 L');
    }
  });

  it('every localized intro names its own largest pack size', () => {
    expect(en['paint.headerBodyMetric']).toContain('19');
    for (const code of localized) {
      expect(dictionaries[code]['paint.headerBodyMetric'], code).toContain(
        String(METRIC_PACKS[code][0]),
      );
    }
  });
});
