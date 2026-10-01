import { DEFAULT_LOCALE, isLocaleCode, type LocaleCode } from './config';

/** Follows the existing `mixtally_*` localStorage naming convention. */
export const LOCALE_STORAGE_KEY = 'mixtally_locale';

/** Returns the persisted locale, or null when absent/invalid/ unavailable. */
export function readStoredLocale(): LocaleCode | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocaleCode(stored) ? stored : null;
  } catch {
    // Private mode / disabled storage: behave as if nothing was stored.
    return null;
  }
}

/** Persists the locale preference; never throws (storage may be blocked). */
export function writeStoredLocale(locale: LocaleCode): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore quota/security errors — selection still applies for the session.
  }
}

/**
 * Initial locale: stored preference, otherwise the default locale.
 * English stays the default even when the browser language differs,
 * so existing visitors never see an unexpected language change.
 */
export function getInitialLocale(): LocaleCode {
  return readStoredLocale() ?? DEFAULT_LOCALE;
}
