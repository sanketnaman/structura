import { DEFAULT_LOCALE, type LocaleCode } from './config';
import { dictionaries, type TranslationKey } from './dictionaries';
import { formatNumber } from '../calculators/common/math';

/**
 * Resolves a translation key for a locale with a safe fallback chain:
 *
 *   requested locale  ->  default English  ->  the key itself
 *
 * The last step never renders blank UI if a key is ever missing.
 *
 * Optional `params` fill `{placeholder}` slots in the resolved string
 * (e.g. `{year}` in `footer.copyright`). Numeric params are rendered
 * with the locale's decimal separator outside English; English keeps
 * the raw `String(value)` output so existing pages stay byte-identical.
 */
export function translate(
  locale: LocaleCode,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const localized = dictionaries[locale]?.[key];
  if (typeof localized === 'string' && localized.length > 0) {
    return applyParams(localized, params, locale);
  }

  const fallback = dictionaries[DEFAULT_LOCALE][key];
  if (typeof fallback === 'string' && fallback.length > 0) {
    return applyParams(fallback, params, locale);
  }

  return key;
}

function applyParams(
  template: string,
  params: Record<string, string | number> | undefined,
  locale: LocaleCode,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    if (!Object.prototype.hasOwnProperty.call(params, name)) return match;
    const value = params[name];
    if (typeof value !== 'number' || locale === DEFAULT_LOCALE) return String(value);
    return formatNumber(value, 2, locale);
  });
}

/** True when the locale has at least one non-English string for a key. */
export function hasTranslation(locale: LocaleCode, key: TranslationKey): boolean {
  const localized = dictionaries[locale]?.[key];
  return typeof localized === 'string' && localized.length > 0;
}
