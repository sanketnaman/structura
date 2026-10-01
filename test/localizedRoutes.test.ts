import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALIZED_PREFIX_CODES,
  LOCALE_BY_CODE,
  convertPathLocale,
  getPathLocale,
  isLocalizedPathname,
  joinSplitHref,
  localizeHref,
  localizePath,
  parseLocalePath,
  splitHref,
  stripLocalePrefix,
} from '../src/lib/i18n';
import { PAGE_ROUTE_PATHS, localizedRoutePaths, viewToPath } from '../src/lib/routes';

describe('Locale parsing from a pathname', () => {
  it('returns the locale carried by the URL prefix', () => {
    expect(getPathLocale('/es/calculators')).toBe('es');
    expect(getPathLocale('/pt')).toBe('pt');
    expect(getPathLocale('/fr/about')).toBe('fr');
    expect(getPathLocale('/de/calculators/concrete-slab-calculator')).toBe('de');
  });

  it('defaults to English for unprefixed English URLs', () => {
    expect(getPathLocale('/')).toBe('en');
    expect(getPathLocale('/calculators')).toBe('en');
    expect(getPathLocale('/calculators/concrete-slab-calculator')).toBe('en');
    expect(isLocalizedPathname('/privacy')).toBe(false);
  });

  it('strips the locale prefix to recover the canonical English path', () => {
    expect(stripLocalePrefix('/es/calculators')).toBe('/calculators');
    expect(stripLocalePrefix('/de/')).toBe('/');
    expect(stripLocalePrefix('/calculators')).toBe('/calculators');
    expect(stripLocalePrefix('/')).toBe('/');
  });

  it('does not treat an unknown prefix as a locale', () => {
    expect(parseLocalePath('/it/calculators')).toEqual({ locale: 'en', basePath: '/it/calculators' });
    expect(parseLocalePath('/xx')).toEqual({ locale: 'en', basePath: '/xx' });
    expect(isLocalizedPathname('/it/calculators')).toBe(false);
  });

  it('never treats /en/... as a localized route', () => {
    expect(parseLocalePath('/en/calculators')).toEqual({ locale: 'en', basePath: '/en/calculators' });
    expect(isLocalizedPathname('/en/calculators')).toBe(false);
  });
});

describe('Localized route generation', () => {
  const routes = localizedRoutePaths();

  it('registers the 13 English routes exactly once, unprefixed', () => {
    const englishPaths = routes.filter((route) => route.locale === 'en').map((route) => route.path);
    expect(englishPaths).toEqual([...PAGE_ROUTE_PATHS]);
    expect(englishPaths.some((path) => path.startsWith('/en'))).toBe(false);
  });

  it('adds one prefixed variant per localized locale for every English route', () => {
    expect(PAGE_ROUTE_PATHS).toHaveLength(13);
    expect(routes).toHaveLength(PAGE_ROUTE_PATHS.length * LOCALES.length);

    for (const locale of LOCALIZED_PREFIX_CODES) {
      for (const basePath of PAGE_ROUTE_PATHS) {
        expect(routes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ basePath, locale, path: localizePath(locale, basePath) }),
          ]),
        );
      }
    }
  });

  it('produces unique paths with no /en/ prefix anywhere', () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.some((path) => path === '/en' || path.startsWith('/en/'))).toBe(false);
  });

  it('covers the required localized routes', () => {
    const paths = routes.map((route) => route.path);
    expect(paths).toContain('/es');
    expect(paths).toContain('/es/calculators');
    expect(paths).toContain('/es/calculators/concrete-slab-calculator');
    expect(paths).toContain('/es/advertising');
    expect(paths).toContain('/pt/calculators/brick-mortar-calculator');
    expect(paths).toContain('/fr/guides');
    expect(paths).toContain('/de/cookie-policy');
  });

  it('never generates a route for a path without an English equivalent', () => {
    for (const route of routes) {
      expect(PAGE_ROUTE_PATHS).toContain(route.basePath);
    }
  });
});

describe('Locale switching between equivalent routes', () => {
  it('converts an English path to a localized one', () => {
    expect(convertPathLocale('/calculators', 'es')).toBe('/es/calculators');
    expect(convertPathLocale('/', 'es')).toBe('/es');
    expect(
      convertPathLocale('/calculators/concrete-slab-calculator', 'de'),
    ).toBe('/de/calculators/concrete-slab-calculator');
  });

  it('converts between localized prefixes', () => {
    expect(convertPathLocale('/es/calculators', 'pt')).toBe('/pt/calculators');
    expect(
      convertPathLocale('/es/calculators/concrete-slab-calculator', 'de'),
    ).toBe('/de/calculators/concrete-slab-calculator');
    expect(convertPathLocale('/fr/guides', 'en')).toBe('/guides');
    expect(convertPathLocale('/pt', 'en')).toBe('/');
  });

  it('keeps trailing-slash and unknown paths stable while swapping the prefix', () => {
    expect(convertPathLocale('/es/guides/', 'pt')).toBe('/pt/guides');
    expect(convertPathLocale('/es/not-a-real-page', 'fr')).toBe('/fr/not-a-real-page');
  });
});

describe('Query parameter and hash preservation', () => {
  it('keeps the query string when switching locale', () => {
    expect(localizeHref('/es/calculators/concrete-slab-calculator?unit=metric', 'pt')).toBe(
      '/pt/calculators/concrete-slab-calculator?unit=metric',
    );
    expect(localizeHref('/calculators?unit=imperial', 'es')).toBe('/es/calculators?unit=imperial');
    expect(localizeHref('/de/paint-calculator?a=1&b=2', 'en')).toBe(
      '/paint-calculator?a=1&b=2',
    );
  });

  it('keeps the hash fragment when switching locale', () => {
    expect(localizeHref('/es/guides#materials', 'fr')).toBe('/fr/guides#materials');
    expect(localizeHref('/calculators?unit=metric#results', 'de')).toBe(
      '/de/calculators?unit=metric#results',
    );
  });

  it('splits and rejoins hrefs without losing anything', () => {
    expect(splitHref('/es/calculators?unit=metric#top')).toEqual({
      pathname: '/es/calculators',
      search: '?unit=metric',
      hash: '#top',
    });
    expect(joinSplitHref(splitHref('/es/calculators?unit=metric#top'))).toBe(
      '/es/calculators?unit=metric#top',
    );
    expect(joinSplitHref(splitHref('/es'))).toBe('/es');
  });
});

describe('Localized internal link mapping (viewToPath)', () => {
  it('keeps existing English targets unchanged by default', () => {
    expect(viewToPath('overview')).toBe('/');
    expect(viewToPath('home')).toBe('/');
    expect(viewToPath('calculators')).toBe('/calculators');
    expect(viewToPath('concrete-slab-calculator')).toBe('/calculators/concrete-slab-calculator');
    expect(viewToPath('brick-mortar-calculator')).toBe('/calculators/brick-mortar-calculator');
    expect(viewToPath('paint-calculator')).toBe('/calculators/paint-calculator');
    expect(viewToPath('privacy')).toBe('/privacy');
    expect(viewToPath('terms')).toBe('/terms');
    expect(viewToPath('unmapped-view')).toBe('/unmapped-view');
  });

  it('localizes targets for a localized locale', () => {
    expect(viewToPath('overview', 'es')).toBe('/es');
    expect(viewToPath('privacy', 'es')).toBe('/es/privacy');
    expect(viewToPath('brick-mortar-calculator', 'pt')).toBe('/pt/calculators/brick-mortar-calculator');
    expect(viewToPath('guides', 'fr')).toBe('/fr/guides');
    expect(viewToPath('advertising', 'de')).toBe('/de/advertising');
  });

  it('keeps English targets when explicitly asked for the default locale', () => {
    expect(viewToPath('privacy', DEFAULT_LOCALE)).toBe('/privacy');
    expect(viewToPath('overview', 'en')).toBe('/');
  });
});

describe('HTML lang / hreflang values from the locale registry', () => {
  it('provides the documented <html lang> values', () => {
    expect(LOCALE_BY_CODE.en.htmlLang).toBe('en');
    expect(LOCALE_BY_CODE.es.htmlLang).toBe('es');
    expect(LOCALE_BY_CODE.pt.htmlLang).toBe('pt-BR');
    expect(LOCALE_BY_CODE.fr.htmlLang).toBe('fr');
    expect(LOCALE_BY_CODE.de.htmlLang).toBe('de');
  });

  it('provides hreflang codes matching the URL prefixes', () => {
    expect(LOCALES.map((locale) => locale.hreflang)).toEqual(['en', 'es', 'pt', 'fr', 'de']);
    expect(LOCALE_BY_CODE.pt.hreflang).toBe('pt');
  });
});
