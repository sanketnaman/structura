import { describe, it, expect } from 'vitest';
import { dictionaries, en, type LocaleCode } from '../src/lib/i18n';

const NON_EN_LOCALES: LocaleCode[] = ['es', 'pt', 'fr', 'de'];

// The imperial worked example is English-only editorial content; localized
// guides always render the metric variant (guideLocalized = locale !== 'en'
// gates the JSX), so these keys are intentionally absent from non-EN dicts.
// 6 concrete (exampleIntro/Step1-4/Note) + 11 brick (exampleInputsMeta…
// exampleNote) = the 17 keys explaining the brick 62-vs-51 and concrete
// 38-vs-32 guide-key count mismatches.
const EN_ONLY_GUIDE_KEYS = new Set([
  'concrete.guide.exampleIntro',
  'concrete.guide.exampleStep1',
  'concrete.guide.exampleStep2',
  'concrete.guide.exampleStep3',
  'concrete.guide.exampleStep4',
  'concrete.guide.exampleNote',
  'brick.guide.exampleInputsMeta',
  'brick.guide.exampleInput1',
  'brick.guide.exampleInput2',
  'brick.guide.exampleArea',
  'brick.guide.exampleFace',
  'brick.guide.exampleRate',
  'brick.guide.exampleBase',
  'brick.guide.exampleWaste',
  'brick.guide.exampleTotal',
  'brick.guide.exampleMortar',
  'brick.guide.exampleNote',
]);

// Keys whose non-EN value may legitimately equal the EN value (brand names,
// unit symbols, pure numbers). Only add entries the test proves are needed.
const IDENTICAL_VALUE_ALLOWLIST = new Set<string>([]);

const GUIDE_PREFIXES = ['concrete.guide.', 'paint.guide.', 'brick.guide.'];

const isGuideKey = (key: string) => GUIDE_PREFIXES.some((p) => key.startsWith(p));

describe('Guide key translation completeness', () => {
  const guideKeys = Object.keys(en).filter(isGuideKey);

  it('every guide key exists in every non-EN locale (or is a documented EN-only imperial example key)', () => {
    expect(guideKeys.length).toBeGreaterThan(0);
    for (const code of NON_EN_LOCALES) {
      const dict = dictionaries[code];
      const missing = guideKeys.filter((key) => !(key in dict) && !EN_ONLY_GUIDE_KEYS.has(key));
      expect(missing, `${code} missing guide keys`).toEqual([]);
    }
  });

  it('EN-only guide keys are exactly the imperial worked-example keys (explains the count mismatch)', () => {
    const missingFromEs = guideKeys.filter((key) => !(key in dictionaries.es));
    expect(new Set(missingFromEs)).toEqual(EN_ONLY_GUIDE_KEYS);
    // brick: 62 EN guide keys, 51 in non-EN (11 EN-only); concrete: 38 vs 32 (6 EN-only).
    const brickCount = guideKeys.filter((k) => k.startsWith('brick.guide.')).length;
    const concreteCount = guideKeys.filter((k) => k.startsWith('concrete.guide.')).length;
    const paintCount = guideKeys.filter((k) => k.startsWith('paint.guide.')).length;
    expect(brickCount).toBe(62);
    expect(concreteCount).toBe(38);
    expect(paintCount).toBe(6);
    expect(guideKeys.filter((k) => EN_ONLY_GUIDE_KEYS.has(k) && k.startsWith('brick.')).length).toBe(11);
    expect(guideKeys.filter((k) => EN_ONLY_GUIDE_KEYS.has(k) && k.startsWith('concrete.')).length).toBe(6);
  });

  it('no non-EN guide value is silently identical to English', () => {
    for (const code of NON_EN_LOCALES) {
      const dict = dictionaries[code] as Record<string, string | undefined>;
      for (const key of guideKeys) {
        if (!(key in dict)) continue;
        if (IDENTICAL_VALUE_ALLOWLIST.has(`${code}.${key}`)) continue;
        expect(dict[key], `${code}.${key}`).not.toBe(en[key as keyof typeof en]);
      }
    }
  });

  it('every non-EN guide value that carries words is a real translation (differs after stripping tags/numbers)', () => {
    const strip = (s: string) =>
      s
        .replace(/<[^>]*>/g, '')
        .replace(/[0-9]/g, '')
        .replace(/[\s.,;:()\-–—·×÷=%°³²/]+/g, '')
        .trim()
        .toLowerCase();
    for (const code of NON_EN_LOCALES) {
      const dict = dictionaries[code] as Record<string, string | undefined>;
      for (const key of guideKeys) {
        if (!(key in dict)) continue;
        if (IDENTICAL_VALUE_ALLOWLIST.has(`${code}.${key}`)) continue;
        const a = strip(dict[key]!);
        const b = strip(en[key as keyof typeof en]);
        // If the stripped word-content is non-empty and identical, it is an untranslated copy.
        if (a.length > 2) {
          expect(a, `${code}.${key} word content identical to EN`).not.toBe(b);
        }
      }
    }
  });
});

describe('HTML safety of dictionary strings rendered via dangerouslySetInnerHTML', () => {
  const ALLOWED_TAGS = new Set(['strong', 'span', 'em', 'code']);
  // Existing classes used across guide dictionaries.
  const ALLOWED_CLASSES = new Set([
    'text-slate-900 dark:text-white font-semibold',
    'text-slate-900 dark:text-white font-bold',
    'text-accent font-bold',
    'font-semibold',
    'font-bold',
    'text-accent',
  ]);

  const allLocales: Array<[string, Record<string, string | undefined>]> = [
    ['en', en as Record<string, string | undefined>],
    ...NON_EN_LOCALES.map(
      (code) => [code, dictionaries[code] as Record<string, string | undefined>] as [
        string,
        Record<string, string | undefined>,
      ],
    ),
  ];

  it('only allows strong/span/em/code tags with class attributes, balanced', () => {
    for (const [code, dict] of allLocales) {
      for (const [key, value] of Object.entries(dict)) {
        if (!value || !value.includes('<')) continue;
        const msg = `${code}.${key}`;
        // No dangerous elements or event handlers.
        expect(value, msg).not.toMatch(/<\s*(script|style|iframe|object|embed|link|meta|form|input|button|a)\b/i);
        expect(value, msg).not.toMatch(/\son[a-z]+\s*=/i);
        expect(value, msg).not.toMatch(/javascript\s*:/i);
        expect(value, msg).not.toMatch(/<[^>]*\sstyle\s*=/i);

        // Parse every tag.
        const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s[^<>]*)?)\/?>/g;
        const stack: string[] = [];
        let stripped = value;
        let m: RegExpExecArray | null;
        while ((m = tagRe.exec(value)) !== null) {
          const [full, closing, rawName, attrs] = m;
          const name = rawName.toLowerCase();
          expect(ALLOWED_TAGS.has(name), `${msg} disallowed tag <${name}>`).toBe(true);
          const attrStr = (attrs || '').trim();
          if (attrStr) {
            expect(attrStr, `${msg} unexpected attributes: ${attrStr}`).toMatch(
              /^class="[^"]*"$/,
            );
            const cls = attrStr.slice('class="'.length, -1);
            expect(ALLOWED_CLASSES.has(cls), `${msg} unexpected class "${cls}"`).toBe(true);
          }
          if (closing) {
            expect(stack.pop(), `${msg} unbalanced closing </${name}>`).toBe(name);
          } else if (!full.endsWith('/>')) {
            stack.push(name);
          }
          stripped = stripped.replace(full, '');
        }
        expect(stack, `${msg} unclosed tags: ${stack.join(',')}`).toEqual([]);
        // After removing valid tags, no stray angle brackets or entities that could smuggle markup.
        expect(stripped, `${msg} stray "<" after tag strip`).not.toContain('<');
        expect(stripped, `${msg} stray ">" after tag strip`).not.toContain('>');
        expect(stripped.toLowerCase(), `${msg} smuggled entity`).not.toMatch(/&lt;|&gt;|&#/);
      }
    }
  });
});
