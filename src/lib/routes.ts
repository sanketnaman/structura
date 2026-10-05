import { useCallback } from 'react';
import { DEFAULT_LOCALE, LOCALIZED_PREFIX_CODES, type LocaleCode } from './i18n/config';
import { localizePath } from './i18n/routing';
import { useLocale } from './i18n/context';

/**
 * Every page path the router serves, in its canonical (unprefixed) English
 * shape. Localized variants are derived from this single list, so adding a
 * page automatically adds `/es/...`, `/pt/...`, `/fr/...` and `/de/...`.
 * Invalid paths (anything not listed here) fall through to the 404 route.
 */
export const PAGE_ROUTE_PATHS = [
  '/',
  '/calculators/concrete-slab-calculator',
  '/calculators/brick-mortar-calculator',
  '/calculators/paint-calculator',
  '/calculators',
  '/guides',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/cookie-policy',
  '/advertising',
] as const;

export type PageRoutePath = (typeof PAGE_ROUTE_PATHS)[number];

export interface RouteRegistration {
  /** Canonical English base path — key into the element map. */
  basePath: PageRoutePath;
  /** Fully localized path to register with the router. */
  path: string;
  /** Locale that owns `path`. */
  locale: LocaleCode;
}

/**
 * Expands the canonical route list into every route the router registers:
 * the unchanged English URLs plus one prefixed variant per localized locale.
 * No `/en/` variants are ever produced.
 */
export function localizedRoutePaths(): RouteRegistration[] {
  return PAGE_ROUTE_PATHS.flatMap((basePath) => [
    { basePath, path: localizePath(DEFAULT_LOCALE, basePath), locale: DEFAULT_LOCALE },
    ...LOCALIZED_PREFIX_CODES.map((locale) => ({
      basePath,
      path: localizePath(locale, basePath),
      locale,
    })),
  ]);
}

/**
 * Maps legacy view/tool slugs to their canonical route paths.
 * Used to render crawlable React Router <Link>/<NavLink> targets.
 *
 * Pass the active locale to localize the result; the default locale always
 * yields the existing unprefixed English paths.
 */
export function viewToPath(view: string, locale: LocaleCode = DEFAULT_LOCALE): string {
  if (view === 'overview' || view === 'home') return localizePath(locale, '/');
  if (view === 'calculators') return localizePath(locale, '/calculators');
  if (view === 'concrete' || view === 'concrete-slab-calculator') {
    return localizePath(locale, '/calculators/concrete-slab-calculator');
  }
  if (view === 'brick' || view === 'brick-mortar-calculator') {
    return localizePath(locale, '/calculators/brick-mortar-calculator');
  }
  if (view === 'paint' || view === 'paint-calculator') {
    return localizePath(locale, '/calculators/paint-calculator');
  }
  return localizePath(locale, `/${view}`);
}

/**
 * Locale-aware `viewToPath` bound to the active locale, so internal links
 * follow the page language: on `/es/...` a related-calculator link becomes
 * `/es/calculators/...`, on English pages it stays unprefixed.
 */
export function useViewToPath(): (view: string) => string {
  const { locale } = useLocale();
  return useCallback((view: string) => viewToPath(view, locale), [locale]);
}
