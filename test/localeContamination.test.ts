import { describe, expect, it } from 'vitest';
import { dictionaries, localizePath } from '../src/lib/i18n';
import { PAGE_ROUTE_PATHS } from '../src/lib/routes';
import { getRouteSEO } from '../src/lib/seo';

/**
 * Cross-locale contamination guard: words from one language that must never
 * appear in another locale's copy. Tokens are word-bounded so substrings
 * (e.g. "laje" inside "embalaje") don't false-positive.
 */
const FORBIDDEN_TOKENS: Record<'es' | 'pt', RegExp[]> = {
  // Portuguese must not carry Spanish vocabulary, nor the bare truncation
  // "estimas" that once leaked into the pt calculators description.
  pt: [
    /\bestimas\b/,
    /\bmamposter[íi]a\b/,
    /\bladrillo/,
    /\bmortero\b/,
    /\blosa\b/,
    /\bpintura\b/,
  ],
  // Spanish must not carry Portuguese vocabulary.
  es: [
    /\balvenaria\b/,
    /\btijolo/,
    /\bargamassa\b/,
    /\blaje\b/,
    /\btinta\b/,
    /\bdem[áa]o\b/,
  ],
};

describe('Cross-locale contamination guard', () => {
  for (const [locale, tokens] of Object.entries(FORBIDDEN_TOKENS)) {
    it(`keeps forbidden tokens out of the ${locale} dictionary`, () => {
      const dict = dictionaries[locale as 'es' | 'pt'];
      const offenders: string[] = [];
      for (const [key, value] of Object.entries(dict)) {
        if (typeof value !== 'string') continue;
        for (const token of tokens) {
          const match = value.match(token);
          if (match) offenders.push(`${key}: "${match[0]}"`);
        }
      }
      expect(offenders).toEqual([]);
    });
  }

  for (const locale of ['es', 'pt'] as const) {
    it(`keeps forbidden tokens out of localized ${locale} SEO titles and descriptions`, () => {
      const offenders: string[] = [];
      for (const basePath of PAGE_ROUTE_PATHS) {
        const seo = getRouteSEO(localizePath(locale, basePath));
        for (const field of [seo.title, seo.description]) {
          if (!field) continue;
          for (const token of FORBIDDEN_TOKENS[locale]) {
            const match = field.match(token);
            if (match) offenders.push(`${locale} ${basePath}: "${match[0]}"`);
          }
        }
      }
      expect(offenders).toEqual([]);
    });
  }

  it('spells the pt calculators description with "estimativas" (never bare "estimas")', () => {
    const seo = getRouteSEO('/pt/calculators');
    expect(seo.description).toContain('outras estimativas de materiais');
  });
});
