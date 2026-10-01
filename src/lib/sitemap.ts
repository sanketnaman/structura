import { DEFAULT_LOCALE, LOCALIZED_PREFIX_CODES, type LocaleCode } from './i18n/config';
import { localizePath } from './i18n/routing';
import { PAGE_ROUTE_PATHS } from './routes';
import { absoluteSiteUrl } from './seo';

/** One sitemap entry: absolute URL plus the route it was derived from. */
export interface SitemapEntry {
  locale: LocaleCode;
  basePath: string;
  url: string;
}

/**
 * Every indexable URL in deterministic order: English first, then each
 * localized prefix in registry order (es, pt, fr, de), and within a locale
 * the `PAGE_ROUTE_PATHS` order.
 *
 * URLs are built with the same `localizePath` + `absoluteSiteUrl` helpers the
 * SEO system uses for canonicals, so the sitemap can never drift from the
 * self-referencing canonicals. English stays unprefixed — no `/en/` URLs —
 * and query/hash variants are never produced.
 */
export function sitemapEntries(): SitemapEntry[] {
  const locales: LocaleCode[] = [DEFAULT_LOCALE, ...LOCALIZED_PREFIX_CODES];
  return locales.flatMap((locale) =>
    PAGE_ROUTE_PATHS.map((basePath) => ({
      locale,
      basePath,
      url: absoluteSiteUrl(localizePath(locale, basePath)),
    })),
  );
}

/** Escapes the five XML metacharacters so any future URL stays well-formed. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Serializes the sitemap as valid UTF-8 XML.
 *
 * Deliberately contains no `<lastmod>`: no page modification dates are
 * maintained anywhere in the project, and inventing them would be misleading.
 * hreflang stays in the HTML (Phase 4A), not here.
 */
export function buildSitemapXml(): string {
  const urls = sitemapEntries()
    .map((entry) => `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
