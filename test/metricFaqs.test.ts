import { describe, it, expect } from 'vitest';
import { calculateConcrete } from '../src/lib/calculators/concrete/calculator';
import {
  BRICK_FAQ_ANSWER_KEYS,
  BRICK_FAQ_METRIC_OVERRIDES,
  BRICK_FAQ_QUESTION_KEYS,
} from '../src/lib/calculators/brick/faq';
import { en, dictionaries } from '../src/lib/i18n/dictionaries';
import { translate } from '../src/lib/i18n/translate';
import { buildStructuredDataSchemas } from '../src/lib/structuredData';

const localized = ['es', 'pt', 'fr', 'de'] as const;
type Locale = (typeof localized)[number];

// Metric-native FAQ variants are selected by locale (same rule as the guide
// examples): non-English locales render them regardless of the unit toggle,
// English never does. Every quoted number must be derived from the app's own
// calculators or from constants already present in the dictionary.

const BAG_M3 = 0.6 * 0.0283168; // one 80 lb bag = 0.60 ft³ (en faqA1) in m³
const KG_PER_YD3 = 1840; // 1,840 kg/yd³ (en faqA3)
const YD3_M3 = 0.764555;
const BRICKS_PER_M2 = 1 / ((0.194 + 0.01) * (0.057 + 0.01));

interface FaqSchema {
  mainEntity: { name: string; acceptedAnswer: { text: string } }[];
}

function faqPage(pathname: string): FaqSchema {
  const schema = buildStructuredDataSchemas(pathname).find(
    (s) => s['@type'] === 'FAQPage',
  );
  expect(schema, pathname).toBeDefined();
  return schema as unknown as FaqSchema;
}

describe('metric-native FAQ content', () => {
  it('keeps the English base FAQ byte-identical', () => {
    expect(en['concrete.faqQ1']).toBe(
      'How many 80 lb bags of concrete equal one cubic yard?',
    );
    expect(en['concrete.faqA1']).toBe(
      'One 80-pound bag yields approximately 0.60 cubic feet. Since one cubic yard contains 27 cubic feet, it mathematically requires approximately 45 bags of 80 lb concrete (or 60 bags of 60 lb concrete) per cubic yard based on this planning assumption.',
    );
    expect(en['concrete.faqQ2']).toBe('How thick should a concrete slab be?');
    expect(en['concrete.faqA2']).toBe(
      'Sidewalks, walkways, and patios typically require 4 inches (10 cm). Vehicle driveways, garage slabs, and heavy storage pads require a minimum of 5 to 6 inches (13 to 15 cm) with steel rebar or wire mesh reinforcement.',
    );
    expect(en['concrete.faqQ3']).toBe('What does a cubic yard of concrete weigh?');
    expect(en['concrete.faqA3']).toBe(
      'Standard normal-weight concrete weighs approximately 4,050 lbs (about 2 tons or 1,840 kg) per cubic yard when wet.',
    );
    expect(en['brick.faqQ2']).toBe('How many bricks are needed per square foot?');
    expect(en['brick.faqA2']).toBe(
      'With the default modular brick (7 5/8 in by 2 1/4 in) laid in a 3/8 in mortar joint, the calculator uses approximately 6.86 bricks per square foot of single-wythe wall. In metric units the default is a 194 mm by 57 mm brick with a 10 mm joint.',
    );
    expect(en['brick.faqA4']).toBe(
      'The calculator uses a planning assumption of approximately 130 modular bricks per 80 lb bag of Type N mortar and reports the bag count plus the approximate dry mix volume. Actual mortar requirements vary with brick dimensions, joint thickness, wall construction, workmanship, and product yield.',
    );
    expect(en['concrete.costDisabledNote']).toBe(
      "Check the box above to enter your supplier's per-yard (or per-cubic-meter) quote and compute material cost.",
    );
    expect(en['diagram.netVolume']).toBe('Net ft³ / m³');
    expect(en['diagram.orderValue']).toBe('+ Waste % → yd³ / Trucks');
  });

  it('defines the metric FAQ/diagram keys in every locale dictionary', () => {
    const keys = [
      'concrete.faqQ1Metric',
      'concrete.faqA1Metric',
      'concrete.faqA2Metric',
      'concrete.faqQ3Metric',
      'concrete.faqA3Metric',
      'brick.faqQ2Metric',
      'brick.faqA2Metric',
      'brick.faqA4Metric',
      'diagram.netVolumeMetric',
      'diagram.orderValueMetric',
    ] as const;
    for (const key of keys) {
      expect(en[key], key).toEqual(expect.any(String));
      for (const code of localized) {
        const value = dictionaries[code][key];
        expect(value, `${code}.${key}`).toEqual(expect.any(String));
        expect(value, `${code}.${key}`).not.toBe(en[key]);
      }
    }
  });

  it('faqA1Metric quotes only calculator-derived numbers (59 bags, 1.8/1.98 m³)', () => {
    const r = calculateConcrete({
      length: 6,
      width: 3,
      thickness: 10,
      wastePercent: 10,
      isMetric: true,
    });
    expect(r.baseVolumeM3).toBe(1.8);
    expect(r.totalVolumeM3).toBe(1.98);
    // 1 m³ ÷ (0.60 ft³ per 80 lb bag in m³) = 58.5 → 59
    expect(Math.round(1 / BAG_M3)).toBe(59);

    for (const code of localized) {
      const answer = dictionaries[code]['concrete.faqA1Metric'];
      expect(answer, code).toContain('59');
      expect(answer, code).toContain('1,8');
      expect(answer, code).toContain('1,98');
      expect(answer, code).toContain(code === 'fr' || code === 'de' ? '10 %' : '10%');
      expect(answer, code).not.toMatch(/80[\s-]*(lb|pound|libra|livre|Pfund)/);
    }
    const enAnswer = en['concrete.faqA1Metric'];
    expect(enAnswer).toContain('59');
    expect(enAnswer).toContain('1.8 m³');
    expect(enAnswer).toContain('1.98 m³');
    expect(enAnswer).toContain('10%');
    expect(enAnswer).not.toContain('80 lb');
  });

  it('faqA2Metric leads with 10 cm in every locale', () => {
    const inchProbe: Record<string, string> = {
      en: '4 inches',
      es: '4 pulgadas',
      pt: '4 polegadas',
      fr: '4 pouces',
      de: '4 Zoll',
    };
    for (const code of ['en', ...localized] as const) {
      const answer = dictionaries[code]['concrete.faqA2Metric'];
      expect(answer, code).toContain('10 cm');
      expect(answer, code).toContain('15 cm');
      expect(answer!.indexOf('10 cm'), code).toBeLessThan(
        answer!.indexOf(inchProbe[code]),
      );
    }
    // cm-first ordering: the metric thickness comes before the inch
    // conversion inside the answer.
    expect(en['concrete.faqA2Metric'].indexOf('10 cm')).toBeLessThan(
      en['concrete.faqA2Metric'].indexOf('4 inches'),
    );
  });

  it('faqA3Metric quotes 2,407 kg/m³ derived from the dictionary constant', () => {
    expect(Math.round(KG_PER_YD3 / YD3_M3)).toBe(2407);
    expect(dictionaries.es['concrete.faqA3Metric']).toContain('2.407');
    expect(dictionaries.pt['concrete.faqA3Metric']).toContain('2.407');
    expect(dictionaries.de['concrete.faqA3Metric']).toContain('2.407');
    expect(dictionaries.fr['concrete.faqA3Metric']).toContain('2 407');
    expect(en['concrete.faqA3Metric']).toContain('2,407');
    const m3Word: Record<Locale, string> = {
      es: 'metro cúbico',
      pt: 'metro cúbico',
      fr: 'mètre cube',
      de: 'Kubikmeter',
    };
    const yardWord: Record<Locale, string> = {
      es: 'yarda',
      pt: 'jarda',
      fr: 'yard',
      de: 'Kubikyard',
    };
    for (const code of localized) {
      const answer = dictionaries[code]['concrete.faqA3Metric'];
      expect(answer, code).toContain('2,4');
      expect(answer, code).toContain(m3Word[code]);
      expect(answer, code).not.toContain(yardWord[code]);
    }
  });

  it('brick faqA2Metric quotes 73.16 bricks/m² from the metric preset', () => {
    expect(BRICKS_PER_M2.toFixed(2)).toBe('73.16');
    expect(en['brick.faqQ2Metric']).toBe('How many bricks are needed per square metre?');
    expect(en['brick.faqA2Metric']).toContain('73.16');
    for (const code of localized) {
      expect(dictionaries[code]['brick.faqA2Metric'], code).toContain('73,16');
      expect(dictionaries[code]['brick.faqQ2Metric'], code).toMatch(
        /metro cuadrado|metro quadrado|mètre carré|Quadratmeter/,
      );
    }
    // The answer must not fall back to square feet.
    for (const code of localized) {
      expect(dictionaries[code]['brick.faqA2Metric'], code).not.toMatch(
        /pie cuadrado|pé quadrado|pied carré|Quadratfuß/,
      );
    }
  });

  it('brick faqA4Metric replaces the 80 lb bag with the 36.3 kg bag', () => {
    expect(en['brick.faqA4Metric']).toContain('130');
    expect(en['brick.faqA4Metric']).toContain('36.3 kg');
    expect(en['brick.faqA4Metric']).toContain('m³');
    expect(en['brick.faqA4Metric']).not.toContain('80 lb');
    for (const code of localized) {
      const answer = dictionaries[code]['brick.faqA4Metric'];
      expect(answer, code).toContain('130');
      expect(answer, code).toContain('36,3');
      expect(answer, code).toContain('m³');
      expect(answer, code).not.toContain('80 lb');
    }
  });

  it('exposes metric overrides only for the unit-dependent brick FAQ entries', () => {
    expect(Object.keys(BRICK_FAQ_METRIC_OVERRIDES)).toEqual(['1', '3']);
    expect(BRICK_FAQ_METRIC_OVERRIDES[1]).toEqual({
      question: 'brick.faqQ2Metric',
      answer: 'brick.faqA2Metric',
    });
    expect(BRICK_FAQ_METRIC_OVERRIDES[3]).toEqual({ answer: 'brick.faqA4Metric' });
    for (const index of [0, 2, 4, 5, 6, 7]) {
      expect(BRICK_FAQ_METRIC_OVERRIDES[index], String(index)).toBeUndefined();
    }
    // Every override key exists and stays inside the FAQ key arrays' domain.
    expect(BRICK_FAQ_QUESTION_KEYS[1]).toBe('brick.faqQ2');
    expect(BRICK_FAQ_ANSWER_KEYS[3]).toBe('brick.faqA4');
  });

  it('renders the metric diagram values without ft³/yd³ outside English', () => {
    expect(en['diagram.netVolumeMetric']).toBe('Net m³');
    expect(en['diagram.orderValueMetric']).toBe('+ Waste % → m³');
    for (const code of localized) {
      const net = dictionaries[code]['diagram.netVolumeMetric'];
      const order = dictionaries[code]['diagram.orderValueMetric'];
      expect(net, code).toContain('m³');
      expect(net, code).not.toMatch(/ft³|yd³/);
      expect(order, code).not.toMatch(/ft³|yd³|ft²|yd²/);
    }
  });

  it('reorders the localized cost note to lead with the cubic metre', () => {
    const probe: Record<Locale, [string, string]> = {
      es: ['metro cúbico', 'yarda'],
      pt: ['metro cúbico', 'jarda'],
      fr: ['mètre cube', 'yard'],
      de: ['Kubikmeter', 'Yard'],
    };
    for (const code of localized) {
      const note = dictionaries[code]['concrete.costDisabledNote'];
      const m3Index = note!.indexOf(probe[code][0]);
      const yardIndex = note!.indexOf(probe[code][1]);
      expect(m3Index, code).toBeGreaterThanOrEqual(0);
      expect(yardIndex, code).toBeGreaterThan(m3Index);
    }
  });
});

describe('FAQ JSON-LD follows the locale metric rule', () => {
  it('emits metric concrete FAQ keys on localized routes and base keys on English routes', () => {
    const es = faqPage('/es/calculators/concrete-slab-calculator');
    expect(es.mainEntity[0].name).toBe(translate('es', 'concrete.faqQ1Metric'));
    expect(es.mainEntity[0].acceptedAnswer.text).toBe(
      translate('es', 'concrete.faqA1Metric'),
    );
    // Q2 has no metric variant — neutral wording in both modes.
    expect(es.mainEntity[1].name).toBe(translate('es', 'concrete.faqQ2'));
    expect(es.mainEntity[1].acceptedAnswer.text).toBe(
      translate('es', 'concrete.faqA2Metric'),
    );
    expect(es.mainEntity[2].name).toBe(translate('es', 'concrete.faqQ3Metric'));
    expect(es.mainEntity[2].acceptedAnswer.text).toBe(
      translate('es', 'concrete.faqA3Metric'),
    );

    const enFaq = faqPage('/calculators/concrete-slab-calculator');
    expect(enFaq.mainEntity[0].name).toBe(translate('en', 'concrete.faqQ1'));
    expect(enFaq.mainEntity[0].acceptedAnswer.text).toBe(
      translate('en', 'concrete.faqA1'),
    );
    expect(enFaq.mainEntity[2].acceptedAnswer.text).toBe(
      translate('en', 'concrete.faqA3'),
    );
  });

  it('applies the brick override map to localized FAQ schema entries', () => {
    const de = faqPage('/de/calculators/brick-mortar-calculator');
    expect(de.mainEntity[1].name).toBe(translate('de', 'brick.faqQ2Metric'));
    expect(de.mainEntity[1].acceptedAnswer.text).toBe(
      translate('de', 'brick.faqA2Metric'),
    );
    expect(de.mainEntity[3].name).toBe(translate('de', 'brick.faqQ4'));
    expect(de.mainEntity[3].acceptedAnswer.text).toBe(
      translate('de', 'brick.faqA4Metric'),
    );
    // Entries without an override stay on the base keys.
    expect(de.mainEntity[4].acceptedAnswer.text).toBe(
      translate('de', 'brick.faqA5'),
    );

    const enFaq = faqPage('/calculators/brick-mortar-calculator');
    expect(enFaq.mainEntity[1].name).toBe(translate('en', 'brick.faqQ2'));
    expect(enFaq.mainEntity[1].acceptedAnswer.text).toBe(
      translate('en', 'brick.faqA2'),
    );
    expect(enFaq.mainEntity[3].acceptedAnswer.text).toBe(
      translate('en', 'brick.faqA4'),
    );
  });
});
