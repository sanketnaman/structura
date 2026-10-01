import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/lib/config/site';
import { DEFAULT_LOCALE, LOCALIZED_PREFIX_CODES } from '../src/lib/i18n/config';
import { localizePath, parseLocalePath } from '../src/lib/i18n/routing';
import { PAGE_ROUTE_PATHS, localizedRoutePaths } from '../src/lib/routes';
import { absoluteSiteUrl, getRouteSEO, seoRegistry } from '../src/lib/seo';
import { buildSitemapXml, sitemapEntries } from '../src/lib/sitemap';

const DOMAIN = siteConfig.domain;
const sitemapUrl = `${DOMAIN}/sitemap.xml`;
const filePath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url));
const xml = readFileSync(filePath, 'utf8');
const robotsTxt = readFileSync(
  fileURLToPath(new URL('../public/robots.txt', import.meta.url)),
  'utf8',
);

const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1]);

/** Path portion of an absolute sitemap URL (always at least `/`). */
function urlPath(url: string): string {
  return url.slice(DOMAIN.length) || '/';
}

/** Registered localized path for a sitemap URL, or `null` when invalid. */
function registeredPath(url: string): string | null {
  const raw = urlPath(url);
  // Locale homes are published with a trailing slash (`/es/`) while route
  // registration stays slash-free (`/es`) — both address the same route.
  const path = raw.length > 1 && raw.endsWith('/') ? raw.slice(0, -1) : raw;
  const known = localizedRoutePaths().some((route) => route.path === path);
  return known ? path : null;
}

const LOCALE_ORDER = [DEFAULT_LOCALE, ...LOCALIZED_PREFIX_CODES];

describe('sitemap.xml structure', () => {
  it('is valid XML with the sitemap namespace and one <loc> per <url>', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
    expect((xml.match(/<url>/g) ?? []).length).toBe(locs.length);
    expect((xml.match(/<\/url>/g) ?? []).length).toBe(locs.length);
    // Only <url>/<loc> elements exist — no lastmod/changefreq/priority/hreflang.
    const withoutLocEntries = xml
      .replace(/<\?xml[^?]*\?>/, '')
      .replace(/<urlset[^>]*>/, '')
      .replace(/<\/urlset>/, '')
      .replace(/<url>/g, '')
      .replace(/<\/url>/g, '')
      .replace(/<loc>[^<]*<\/loc>/g, '')
      .trim();
    expect(withoutLocEntries).toBe('');
    // No unescaped XML metacharacters inside <loc> values.
    for (const loc of locs) {
      expect(loc).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
      expect(loc).not.toMatch(/[<>"]/);
    }
  });

  it('is byte-identical to the generated output (never stale)', () => {
    expect(xml, 'public/sitemap.xml is stale — run `npm run sitemap`').toBe(buildSitemapXml());
  });

  it('declares the sitemap URL in robots.txt', () => {
    expect(robotsTxt).toContain(`Sitemap: ${sitemapUrl}`);
  });
});

describe('sitemap URL set', () => {
  it('contains exactly 65 URLs', () => {
    expect(locs).toHaveLength(65);
  });

  it('contains exactly 13 URLs per locale', () => {
    for (const locale of LOCALE_ORDER) {
      const forLocale = locs.filter((loc) => parseLocalePath(urlPath(loc)).locale === locale);
      expect(forLocale, locale).toHaveLength(13);
    }
  });

  it('lists English routes first, then es, pt, fr, de in PAGE_ROUTE_PATHS order', () => {
    const expected = LOCALE_ORDER.flatMap((locale) =>
      PAGE_ROUTE_PATHS.map((basePath) => absoluteSiteUrl(localizePath(locale, basePath))),
    );
    expect(locs).toEqual(expected);
  });

  it('never emits /en/ URLs', () => {
    for (const loc of locs) {
      expect(urlPath(loc), loc).not.toMatch(/^\/en(\/|$)/);
    }
    expect(locs.some((loc) => loc.includes('/en/'))).toBe(false);
  });

  it('declares every locale home with a trailing slash (English root unchanged)', () => {
    const homeLocs = locs.filter((loc) => parseLocalePath(urlPath(loc)).basePath === '/');
    expect(homeLocs).toEqual([
      `${DOMAIN}/`,
      `${DOMAIN}/es/`,
      `${DOMAIN}/pt/`,
      `${DOMAIN}/fr/`,
      `${DOMAIN}/de/`,
    ]);
    // …and no non-home URL carries a trailing slash.
    for (const loc of locs.filter((loc) => !homeLocs.includes(loc))) {
      expect(urlPath(loc).endsWith('/'), loc).toBe(false);
    }
  });

  it('never contains query strings or hash fragments', () => {
    for (const loc of locs) {
      expect(loc.includes('?'), loc).toBe(false);
      expect(loc.includes('#'), loc).toBe(false);
    }
  });

  it('contains no duplicate URLs', () => {
    expect(new Set(locs).size).toBe(locs.length);
  });

  it('uses only https://mixtally.com/', () => {
    for (const loc of locs) {
      expect(loc.startsWith(`${DOMAIN}/`), loc).toBe(true);
      expect(loc, loc).not.toMatch(/localhost|workers\.dev|http:\/\//);
    }
  });
});

describe('sitemap routes are valid and canonical', () => {
  it('maps every URL to a registered localized route', () => {
    for (const loc of locs) {
      expect(registeredPath(loc), loc).not.toBeNull();
    }
  });

  it('matches the self-referencing canonical from the SEO system', () => {
    for (const loc of locs) {
      const seo = getRouteSEO(urlPath(loc));
      expect(seo.canonicalPath, loc).toBeDefined();
      expect(absoluteSiteUrl(seo.canonicalPath!), loc).toBe(loc);
    }
  });

  it('includes only indexable routes — never 404/unknown entries', () => {
    for (const loc of locs) {
      const seo = getRouteSEO(urlPath(loc));
      expect(seo.noindex, loc).toBeFalsy();
      expect(seo.title, loc).not.toBe(seoRegistry['404'].title);
      expect(urlPath(loc), loc).not.toContain('not-a-real-page');
    }
    expect(Object.keys(seoRegistry).filter((key) => key !== '404')).toHaveLength(13);
  });

  it('covers every route in the centralized registry exactly once per locale', () => {
    for (const locale of LOCALE_ORDER) {
      const forLocale = locs.filter((loc) => parseLocalePath(urlPath(loc)).locale === locale);
      const basePathSet = new Set(forLocale.map((loc) => parseLocalePath(urlPath(loc)).basePath));
      expect([...basePathSet].sort()).toEqual([...PAGE_ROUTE_PATHS].sort());
    }
    expect(registeredPath(`${DOMAIN}/`)).toBe('/');
  });
});

describe('sitemap entries (generator)', () => {
  it('derives 65 entries from PAGE_ROUTE_PATHS across the 5 locales', () => {
    const entries = sitemapEntries();
    expect(entries).toHaveLength(65);
    expect(entries.every((entry) => entry.url.startsWith(DOMAIN))).toBe(true);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(65);
  });
});
