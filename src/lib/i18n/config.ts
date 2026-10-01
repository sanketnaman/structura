/**
 * Central locale registry for MixTally internationalization.
 *
 * Adding a language is a single entry here plus its dictionary.
 * Routing (`routing.ts`), SEO (`lib/seo.ts`) and `<html lang>` all read
 * their locale metadata from this file — it is the single source of truth.
 */

export type LocaleCode = 'en' | 'es' | 'pt' | 'fr' | 'de';

export interface LocaleDefinition {
  /** BCP-47-ish locale code used across the app (URL prefix, storage, keys). */
  code: LocaleCode;
  /** Name in English (stable labels for menus and analytics). */
  name: string;
  /** Name in the language itself — shown in the language selector. */
  nativeName: string;
  /** Short uppercase token shown on compact surfaces (e.g. "EN"). */
  shortCode: string;
  /** Value used for the runtime <html lang> attribute (e.g. "pt-BR"). */
  htmlLang: string;
  /**
   * Value used for hreflang alternate links (e.g. "en", "es", "pt").
   * Differs from `htmlLang` for Portuguese, which renders as `pt-BR`
   * but is targeted with the generic `pt` hreflang.
   */
  hreflang: string;
  /**
   * URL prefix for localized routes: "/es", "/pt", "/fr", "/de".
   * Empty string for the default locale, which keeps the existing
   * unprefixed English URLs (/calculators, /about, ...) untouched.
   */
  routePrefix: string;
  /**
   * True once human-reviewed translations exist for this locale.
   * English plus Spanish, Portuguese, French and German ship complete
   * dictionaries; a few purely decorative keys (separator rules) stay on
   * the English fallback by design. Missing strings still fall back to
   * English, so the selector can safely list every locale.
   */
  translationsAvailable: boolean;
}

export const DEFAULT_LOCALE: LocaleCode = 'en';

export const LOCALES: LocaleDefinition[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    shortCode: 'EN',
    htmlLang: 'en',
    hreflang: 'en',
    routePrefix: '',
    translationsAvailable: true,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    shortCode: 'ES',
    htmlLang: 'es',
    hreflang: 'es',
    routePrefix: '/es',
    translationsAvailable: true,
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    shortCode: 'PT',
    htmlLang: 'pt-BR',
    hreflang: 'pt',
    routePrefix: '/pt',
    translationsAvailable: true,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    shortCode: 'FR',
    htmlLang: 'fr',
    hreflang: 'fr',
    routePrefix: '/fr',
    translationsAvailable: true,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    shortCode: 'DE',
    htmlLang: 'de',
    hreflang: 'de',
    routePrefix: '/de',
    translationsAvailable: true,
  },
];

export const LOCALE_BY_CODE: Record<LocaleCode, LocaleDefinition> = LOCALES.reduce(
  (acc, locale) => {
    acc[locale.code] = locale;
    return acc;
  },
  {} as Record<LocaleCode, LocaleDefinition>,
);

/** Locales that own a `/xx/...` route prefix (English stays unprefixed). */
export const LOCALIZED_PREFIX_CODES: LocaleCode[] = LOCALES.filter(
  (locale) => locale.code !== DEFAULT_LOCALE,
).map((locale) => locale.code);

export function isLocaleCode(value: unknown): value is LocaleCode {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LOCALE_BY_CODE, value);
}

export function getLocaleDefinition(code: LocaleCode): LocaleDefinition {
  return LOCALE_BY_CODE[code] ?? LOCALE_BY_CODE[DEFAULT_LOCALE];
}
