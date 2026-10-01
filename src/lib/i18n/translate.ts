import { DEFAULT_LOCALE, type LocaleCode } from './config';
import { dictionaries, type TranslationKey } from './dictionaries';

/**
 * Resolves a translation key for a locale with a safe fallback chain:
 *
 *   requested locale  ->  default English  ->  the key itself
 *
 * The last step never renders blank UI if a key is ever missing.
 *
 * Optional `params` fill `{placeholder}` slots in the resolved string
 * (e.g. `{year}` in `footer.copyright`).
 */
export function translate(
  locale: LocaleCode,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const localized = dictionaries[locale]?.[key];
  if (typeof localized === 'string' && localized.length > 0) {
    return applyParams(localized, params);
  }

  const fallback = dictionaries[DEFAULT_LOCALE][key];
  if (typeof fallback === 'string' && fallback.length > 0) {
    return applyParams(fallback, params);
  }

  return key;
}

function applyParams(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

/** True when the locale has at least one non-English string for a key. */
export function hasTranslation(locale: LocaleCode, key: TranslationKey): boolean {
  const localized = dictionaries[locale]?.[key];
  return typeof localized === 'string' && localized.length > 0;
}
