import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LOCALE,
  LOCALES,
  dictionaries,
  en,
  isLocaleCode,
  localizePath,
  parseLocalePath,
  isLocalizedPathname,
  translate,
  hasTranslation,
  getInitialLocale,
  readStoredLocale,
  writeStoredLocale,
  type TranslationKey,
} from '../src/lib/i18n';

describe('Locale configuration', () => {
  it('exposes the five Phase 1 locales with English as default', () => {
    expect(LOCALES.map((locale) => locale.code)).toEqual(['en', 'es', 'pt', 'fr', 'de']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('keeps native display names and short codes without emoji flags', () => {
    const spanish = LOCALES.find((locale) => locale.code === 'es');
    expect(spanish?.nativeName).toBe('Español');
    expect(spanish?.shortCode).toBe('ES');
    expect(LOCALES.every((locale) => locale.nativeName.length > 0)).toBe(true);
    expect(LOCALES.every((locale) => !/\p{Extended_Pictographic}/u.test(locale.nativeName))).toBe(true);
  });

  it('reserves route prefixes for future localized routes', () => {
    expect(LOCALES.find((locale) => locale.code === 'en')?.routePrefix).toBe('');
    expect(LOCALES.filter((locale) => locale.code !== 'en').every((l) => l.routePrefix === `/${l.code}`)).toBe(true);
    expect(LOCALES.filter((locale) => locale.code !== 'en').every((l) => l.translationsAvailable === true)).toBe(true);
  });

  it('validates locale codes', () => {
    expect(isLocaleCode('es')).toBe(true);
    expect(isLocaleCode('it')).toBe(false);
    expect(isLocaleCode(undefined)).toBe(false);
  });
});

describe('Translation lookup with English fallback', () => {
  it('returns English strings for the default locale', () => {
    expect(translate('en', 'common.language')).toBe('Language');
    expect(translate('en', 'common.changeLanguage')).toBe('Change language');
  });

  it('returns localized strings for every translated locale', () => {
    expect(translate('es', 'common.language')).toBe('Idioma');
    expect(translate('pt', 'common.changeLanguage')).toBe('Alterar idioma');
    expect(translate('fr', 'common.language')).toBe('Langue');
    expect(translate('de', 'common.changeLanguage')).toBe('Sprache ändern');
  });

  it('falls back to English for decorative keys a locale does not translate', () => {
    for (const locale of ['es', 'pt', 'fr', 'de'] as const) {
      expect(translate(locale, 'paint.copy.separator')).toBe(translate('en', 'paint.copy.separator'));
      expect(translate(locale, 'concrete.copy.separator')).toBe(translate('en', 'concrete.copy.separator'));
    }
  });

  it('falls back to the key itself when no locale knows it', () => {
    const unknown = 'does.not.exist' as TranslationKey;
    expect(translate('es', unknown)).toBe('does.not.exist');
    expect(translate('en', unknown)).toBe('does.not.exist');
  });

  it('reports which locales actually have translations', () => {
    expect(hasTranslation('en', 'common.language')).toBe(true);
    expect(hasTranslation('es', 'common.language')).toBe(true);
    expect(hasTranslation('fr', 'common.language')).toBe(true);
    expect(hasTranslation('de', 'common.language')).toBe(true);
    expect(hasTranslation('es', 'paint.copy.separator')).toBe(false);
  });

  it('never returns an empty string', () => {
    for (const locale of LOCALES) {
      expect(translate(locale.code, 'common.language').length).toBeGreaterThan(0);
    }
  });
});

describe('Dictionary coverage', () => {
  const ALLOWED_MISSING = new Set(['paint.copy.separator', 'concrete.copy.separator']);

  it('covers every English key except the two decorative separators', () => {
    const enKeys = Object.keys(en);
    expect(enKeys).toHaveLength(644);

    for (const code of ['es', 'pt', 'fr', 'de'] as const) {
      const dict = dictionaries[code];
      const keys = Object.keys(dict);
      const missing = enKeys.filter((key) => !(key in dict));
      const extra = keys.filter((key) => !(key in en));

      expect(extra).toEqual([]);
      expect(missing.filter((key) => !ALLOWED_MISSING.has(key))).toEqual([]);
      expect(keys).toHaveLength(code === 'pt' ? 644 : 642);
    }
  });

  it('keeps every translated value a non-empty string', () => {
    for (const code of ['es', 'pt', 'fr', 'de'] as const) {
      const dict = dictionaries[code];
      for (const [key, value] of Object.entries(dict)) {
        expect(typeof value, `${code}.${key}`).toBe('string');
        expect((value as string).length, `${code}.${key}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('Localized path helpers (future routes)', () => {
  it('leaves existing English paths unprefixed', () => {
    expect(parseLocalePath('/')).toEqual({ locale: 'en', basePath: '/' });
    expect(parseLocalePath('/calculators')).toEqual({ locale: 'en', basePath: '/calculators' });
    expect(
      parseLocalePath('/calculators/concrete-slab-calculator'),
    ).toEqual({ locale: 'en', basePath: '/calculators/concrete-slab-calculator' });
    expect(isLocalizedPathname('/privacy')).toBe(false);
  });

  it('parses future locale prefixes', () => {
    expect(parseLocalePath('/es')).toEqual({ locale: 'es', basePath: '/' });
    expect(parseLocalePath('/es/calculators')).toEqual({ locale: 'es', basePath: '/calculators' });
    expect(parseLocalePath('/de/guides/')).toEqual({ locale: 'de', basePath: '/guides' });
    expect(isLocalizedPathname('/fr/about')).toBe(true);
  });

  it('builds locale-prefixed paths and keeps English paths unchanged', () => {
    expect(localizePath('en', '/')).toBe('/');
    expect(localizePath('en', '/calculators')).toBe('/calculators');
    expect(localizePath('es', '/')).toBe('/es');
    expect(localizePath('pt', '/calculators/paint-calculator')).toBe('/pt/calculators/paint-calculator');
  });
});

describe('Locale persistence', () => {
  it('defaults to English when nothing is stored or storage is unavailable', () => {
    expect(readStoredLocale()).toBeNull();
    expect(getInitialLocale()).toBe('en');
  });

  it('never throws when storage is unavailable', () => {
    expect(() => writeStoredLocale('fr')).not.toThrow();
  });
});
