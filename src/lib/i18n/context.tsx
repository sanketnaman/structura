import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_LOCALE, LOCALES, type LocaleCode, type LocaleDefinition } from './config';
import type { TranslationKey } from './dictionaries';
import { parseLocalePath } from './routing';
import { getInitialLocale, writeStoredLocale } from './storage';
import { translate } from './translate';

export interface LocaleContextValue {
  /** Currently rendered locale (URL prefix > stored preference > English). */
  locale: LocaleCode;
  /**
   * Locale explicitly requested by the URL prefix, or the default locale when
   * the URL is unprefixed. Differs from `locale` only when an unprefixed URL
   * is rendered with a stored non-default preference.
   */
  urlLocale: LocaleCode;
  /** Updates the persisted locale preference and re-renders the app. */
  setLocale: (locale: LocaleCode) => void;
  /** Translation lookup with automatic English fallback. */
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  /** Full locale registry for rendering selectors. */
  locales: LocaleDefinition[];
  /** The default (untranslated-fallback) locale. */
  defaultLocale: LocaleCode;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Locale resolution order:
 *   1. Explicit locale prefix in the URL (/es/... always renders Spanish)
 *   2. Saved `mixtally_locale` preference
 *   3. English default
 *
 * The URL always wins, and an unprefixed English URL is never rewritten to a
 * prefixed one — no locale-driven redirects happen here.
 */
export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const urlLocale = parseLocalePath(location.pathname).locale;
  const hasUrlLocale = urlLocale !== DEFAULT_LOCALE;

  const [storedLocale, setStoredLocale] = useState<LocaleCode>(getInitialLocale);

  const locale = hasUrlLocale ? urlLocale : storedLocale;

  // Visiting a localized URL synchronizes the stored preference to it, so the
  // language selector stays consistent with what the user is looking at.
  //
  // Dependencies are intentionally limited to the URL locale: the sync must
  // react to URL changes only. If `storedLocale` were a dependency, a freshly
  // selected preference would be overwritten by the (still unchanged) locale
  // of the outgoing URL during the same click — for example selecting English
  // while on /pt/... would be reverted to pt before the navigation lands.
  // Reading `storedLocale` from the latest render when this effect does run
  // keeps the comparison current without re-triggering it.
  useEffect(() => {
    if (hasUrlLocale && storedLocale !== urlLocale) {
      setStoredLocale(urlLocale);
      writeStoredLocale(urlLocale);
    }
    // `storedLocale` is deliberately not a dependency — see the comment above.
  }, [hasUrlLocale, urlLocale]);

  const setLocale = useCallback((next: LocaleCode) => {
    setStoredLocale(next);
    writeStoredLocale(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      urlLocale,
      setLocale,
      t,
      locales: LOCALES,
      defaultLocale: DEFAULT_LOCALE,
    }),
    [locale, urlLocale, setLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
