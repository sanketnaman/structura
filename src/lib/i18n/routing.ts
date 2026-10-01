import { DEFAULT_LOCALE, isLocaleCode, LOCALIZED_PREFIX_CODES, type LocaleCode } from './config';

/**
 * Localized route shape:
 *
 *   /                                  -> default English (unchanged, always)
 *   /calculators                       -> default English (unchanged, always)
 *   /es/calculators                    -> Spanish
 *   /pt, /fr, /de ...                  -> same pattern
 *
 * English URLs are never prefixed with `/en/`. These helpers are the single
 * place that parses, strips, adds and converts locale prefixes — route
 * registration, SEO canonical/hreflang output, the language switcher and
 * internal links all go through them.
 */

export interface ParsedLocalePath {
  /** Locale implied by the first path segment (default when absent). */
  locale: LocaleCode;
  /** Path without the locale prefix — always the canonical English shape. */
  basePath: string;
}

/** A pathname split into its path, query and hash pieces. */
export interface SplitHref {
  pathname: string;
  /** Query string including the leading `?`, or an empty string. */
  search: string;
  /** Hash fragment including the leading `#`, or an empty string. */
  hash: string;
}

function normalizeBasePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutTrailingSlash =
    withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
      ? withLeadingSlash.slice(0, -1)
      : withLeadingSlash;
  return withoutTrailingSlash;
}

/**
 * Splits `path?query#hash` into its parts while preserving the query string
 * and hash fragment verbatim (order-independent: `?a=1#h` and `#h?a=1` both
 * round-trip through `joinSplitHref`).
 */
export function splitHref(href: string): SplitHref {
  const hashIndex = href.indexOf('#');
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const searchIndex = withoutHash.indexOf('?');
  const search = searchIndex >= 0 ? withoutHash.slice(searchIndex) : '';
  const pathname = searchIndex >= 0 ? withoutHash.slice(0, searchIndex) : withoutHash;
  return { pathname, search, hash };
}

/** Reassembles a `SplitHref` back into a full href. */
export function joinSplitHref(parts: SplitHref): string {
  return `${parts.pathname}${parts.search}${parts.hash}`;
}

/**
 * Reads a locale prefix from a pathname. English is never inferred from a
 * prefix because default-locale URLs must remain unprefixed — `/en/...` is
 * not a valid localized route and is treated as a plain (unknown) path.
 */
export function parseLocalePath(pathname: string): ParsedLocalePath {
  const normalized = normalizeBasePath(pathname);
  const segments = normalized.split('/').filter(Boolean);
  const first = segments[0];

  if (first && first !== DEFAULT_LOCALE && isLocaleCode(first) && LOCALIZED_PREFIX_CODES.includes(first)) {
    const basePath = segments.slice(1).join('/');
    return { locale: first, basePath: basePath ? `/${basePath}` : '/' };
  }

  return { locale: DEFAULT_LOCALE, basePath: normalized };
}

/** Locale carried by a pathname, or the default locale when unprefixed. */
export function getPathLocale(pathname: string): LocaleCode {
  return parseLocalePath(pathname).locale;
}

/** Removes a leading locale prefix; returns the path unchanged otherwise. */
export function stripLocalePrefix(pathname: string): string {
  return parseLocalePath(pathname).basePath;
}

/** Builds a locale-scoped path; default locale always yields the plain path. */
export function localizePath(locale: LocaleCode, basePath: string): string {
  const normalized = normalizeBasePath(basePath);
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

/**
 * Converts a pathname to another locale while keeping its base path:
 *   /calculators                -> /es/calculators
 *   /es/calculators             -> /pt/calculators
 *   /es/calculators/concrete... -> /de/calculators/concrete...
 */
export function convertPathLocale(pathname: string, target: LocaleCode): string {
  return localizePath(target, stripLocalePrefix(pathname));
}

/**
 * Converts a full href (path + optional query + optional hash) into a target
 * locale while preserving the query string and hash fragment:
 *   /es/calculators?unit=metric#top -> /pt/calculators?unit=metric#top
 *   /calculators?unit=metric        -> /es/calculators?unit=metric
 */
export function localizeHref(href: string, target: LocaleCode): string {
  const parts = splitHref(href);
  return joinSplitHref({ ...parts, pathname: convertPathLocale(parts.pathname, target) });
}

/** True when the pathname carries a non-default locale prefix. */
export function isLocalizedPathname(pathname: string): boolean {
  return parseLocalePath(pathname).locale !== DEFAULT_LOCALE;
}
