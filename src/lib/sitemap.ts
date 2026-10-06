import { DEFAULT_LOCALE, LOCALIZED_PREFIX_CODES, type LocaleCode } from './i18n/config';
import { localizePath } from './i18n/routing';
import { ARTICLE_BASE_PATHS, getArticleBySlug, hasArticleTranslation } from './blog/registry';
import { PAGE_ROUTE_PATHS } from './routes';
import { absoluteSiteUrl } from './seo';

/** One sitemap entry: absolute URL plus the route it was derived from. */
export interface SitemapEntry {
  locale: LocaleCode;
  basePath: string;
  url: string;
  /**
   * ISO `YYYY-MM-DD` of the last content change. Present only for blog
   * articles, which carry real authoring dates in the registry. Every other
   * page has no maintained modification date, so none is published rather
   * than inventing one at build time.
   */
  lastmod?: string;
}

/**
 * Every indexable URL in deterministic order: English first, then each
 * localized prefix in registry order (es, pt, fr, de), and within a locale
 * the `PAGE_ROUTE_PATHS` order followed by that locale's blog articles.
 *
 * Blog articles are fully translated, so each language version is a real
 * self-canonicalizing page and is published in the sitemap: `/blog/<slug>`
 * for English, `/es/blog/<slug>` for Spanish, and so on. An article is
 * published for a locale only when that locale's translation exists — a
 * partial translation set never advertises a URL it cannot render in that
 * language. Category filter query strings are never produced.
 *
 * URLs are built with the same `localizePath` + `absoluteSiteUrl` helpers the
 * SEO system uses for canonicals, so the sitemap can never drift from the
 * self-referencing canonicals. English stays unprefixed — no `/en/` URLs —
 * and query/hash variants are never produced.
 */
export function sitemapEntries(): SitemapEntry[] {
  const locales: LocaleCode[] = [DEFAULT_LOCALE, ...LOCALIZED_PREFIX_CODES];

  return locales.flatMap((locale) => {
    const entries: SitemapEntry[] = PAGE_ROUTE_PATHS.map((basePath) => ({
      locale,
      basePath,
      url: absoluteSiteUrl(localizePath(locale, basePath)),
    }));

    for (const basePath of ARTICLE_BASE_PATHS) {
      const article = getArticleBySlug(basePath.slice('/blog/'.length));
      if (!article || !hasArticleTranslation(article, locale)) continue;

      entries.push({
        locale,
        basePath,
        url: absoluteSiteUrl(localizePath(locale, basePath)),
        lastmod: article.updatedAt ?? article.publishedAt,
      });
    }

    return entries;
  });
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
 * `<lastmod>` is emitted only where the entry carries a real, registry-owned
 * date (blog articles). Pages with no maintained modification date publish
 * none — inventing one on every build would be misleading. hreflang stays in
 * the HTML (Phase 4A), not here.
 */
export function buildSitemapXml(): string {
  const urls = sitemapEntries()
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : '';
      return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
