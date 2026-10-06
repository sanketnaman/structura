import { describe, it, expect } from 'vitest';
import {
  absoluteSiteUrl,
  buildHreflangAlternates,
  buildSeoHeadSpec,
  getRouteSEO,
  seoRegistry,
} from '../src/lib/seo';
import { buildStructuredDataSchemas } from '../src/lib/structuredData';
import { sitemapEntries } from '../src/lib/sitemap';
import { siteConfig } from '../src/lib/config/site';
import { ARTICLE_REGISTRY, articleBasePath, resolveArticleForLocale } from '../src/lib/blog/registry';

const LOCALIZED_LOCALES = ['es', 'pt', 'fr', 'de'] as const;
const SAMPLE_BASE_PATHS = [
  '/',
  '/calculators',
  '/calculators/concrete-slab-calculator',
  '/calculators/brick-mortar-calculator',
  '/calculators/paint-calculator',
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

describe('English SEO stays unchanged', () => {
  it('keeps the exact English titles and descriptions', () => {
    const concrete = getRouteSEO('/calculators/concrete-slab-calculator');
    expect(concrete.title).toBe(
      'Concrete Slab Calculator — 3D Volume & Material Estimate | MixTally',
    );
    expect(concrete.description).toBe(
      'Calculate concrete slab volume, cubic yards, cubic feet, material quantities, and planning estimates with an interactive 3D slab visualization.',
    );
    expect(getRouteSEO('/').title).toBe(
      'MixTally — Construction Calculators & 3D Estimation Tools',
    );
    expect(getRouteSEO('/privacy').title).toBe('Privacy Policy — MixTally');
  });

  it('keeps every English route on its original unprefixed canonical', () => {
    for (const basePath of SAMPLE_BASE_PATHS) {
      const seo = getRouteSEO(basePath);
      expect(seo.canonicalPath, basePath).toBe(basePath);
      expect(seo.noindex, basePath).toBeFalsy();
      expect(seo.locale).toBe('en');
      expect(seo.title).toBe(seoRegistry[basePath].title);
      expect(seo.description).toBe(seoRegistry[basePath].description);
    }
  });

  it('keeps the English 404 behavior: noindex, no canonical, no alternates', () => {
    const seo = getRouteSEO('/definitely-not-a-page');
    expect(seo.title).toBe('Page Not Found — MixTally');
    expect(seo.noindex).toBe(true);
    expect(seo.canonicalPath).toBeUndefined();
    expect(seo.alternates).toEqual([]);
  });
});

describe('Localized canonical URLs', () => {
  it('produces a self-referencing canonical for every localized route', () => {
    for (const locale of LOCALIZED_LOCALES) {
      for (const basePath of SAMPLE_BASE_PATHS) {
        const expected = basePath === '/' ? `/${locale}` : `/${locale}${basePath}`;
        const seo = getRouteSEO(expected);
        expect(seo.canonicalPath, `${locale} ${basePath}`).toBe(expected);
        expect(seo.locale).toBe(locale);
        expect(seo.noindex).toBeFalsy();
      }
    }
  });

  it('matches the documented examples exactly', () => {
    expect(getRouteSEO('/calculators/concrete-slab-calculator').canonicalPath).toBe(
      '/calculators/concrete-slab-calculator',
    );
    expect(getRouteSEO('/es/calculators/concrete-slab-calculator').canonicalPath).toBe(
      '/es/calculators/concrete-slab-calculator',
    );
    expect(getRouteSEO('/pt/calculators/concrete-slab-calculator').canonicalPath).toBe(
      '/pt/calculators/concrete-slab-calculator',
    );
    expect(getRouteSEO('/fr/calculators/concrete-slab-calculator').canonicalPath).toBe(
      '/fr/calculators/concrete-slab-calculator',
    );
    expect(getRouteSEO('/de/calculators/concrete-slab-calculator').canonicalPath).toBe(
      '/de/calculators/concrete-slab-calculator',
    );
  });

  it('never puts query parameters in the canonical', () => {
    expect(getRouteSEO('/es/calculators/concrete-slab-calculator?unit=metric').canonicalPath).toBe(
      '/es/calculators/concrete-slab-calculator',
    );
    expect(getRouteSEO('/calculators/concrete-slab-calculator?unit=metric').canonicalPath).toBe(
      '/calculators/concrete-slab-calculator',
    );
    expect(absoluteSiteUrl('/es/calculators')).not.toContain('?');
  });

  it('builds absolute URLs from the production domain', () => {
    expect(absoluteSiteUrl('/')).toBe(`${siteConfig.domain}/`);
    expect(absoluteSiteUrl('/es')).toBe(`${siteConfig.domain}/es/`);
    expect(absoluteSiteUrl('/pt/calculators')).toBe(`${siteConfig.domain}/pt/calculators`);
  });
});

describe('locale-home URLs consistently use the trailing slash', () => {
  const DOMAIN = siteConfig.domain;

  it('canonicalizes every locale home with a trailing slash, English root unchanged', () => {
    expect(buildSeoHeadSpec(getRouteSEO('/')).canonicalUrl).toBe(`${DOMAIN}/`);
    for (const locale of LOCALIZED_LOCALES) {
      expect(buildSeoHeadSpec(getRouteSEO(`/${locale}`)).canonicalUrl, locale).toBe(
        `${DOMAIN}/${locale}/`,
      );
      expect(buildSeoHeadSpec(getRouteSEO(`/${locale}/`)).canonicalUrl, locale).toBe(
        `${DOMAIN}/${locale}/`,
      );
      // No /en/ anywhere.
      expect(buildSeoHeadSpec(getRouteSEO(`/${locale}`)).canonicalUrl).not.toContain('/en/');
    }
  });

  it('matches og:url to the canonical on every locale home', () => {
    for (const locale of LOCALIZED_LOCALES) {
      const spec = buildSeoHeadSpec(getRouteSEO(`/${locale}/`));
      expect(spec.og.url, locale).toBe(spec.canonicalUrl);
      expect(spec.og.url, locale).toBe(`${DOMAIN}/${locale}/`);
    }
  });

  it('lists the trailing-slash locale homes in every hreflang cluster', () => {
    // Home cluster: every locale home entry carries the trailing slash.
    const homeAlternates = buildSeoHeadSpec(getRouteSEO('/')).hreflangs;
    for (const locale of LOCALIZED_LOCALES) {
      expect(homeAlternates.find((a) => a.hreflang === locale)?.href, locale).toBe(
        `${DOMAIN}/${locale}/`,
      );
    }
    expect(homeAlternates.find((a) => a.hreflang === 'en')?.href).toBe(`${DOMAIN}/`);
    expect(homeAlternates.find((a) => a.hreflang === 'x-default')?.href).toBe(`${DOMAIN}/`);

    // Deep-page cluster: localized non-home URLs stay slash-free.
    const privacyAlternates = buildSeoHeadSpec(getRouteSEO('/privacy')).hreflangs;
    for (const locale of LOCALIZED_LOCALES) {
      expect(privacyAlternates.find((a) => a.hreflang === locale)?.href, locale).toBe(
        `${DOMAIN}/${locale}/privacy`,
      );
    }
    expect(privacyAlternates.find((a) => a.hreflang === 'en')?.href).toBe(`${DOMAIN}/privacy`);
    expect(privacyAlternates.find((a) => a.hreflang === 'x-default')?.href).toBe(
      `${DOMAIN}/privacy`,
    );
  });

  it('publishes the same trailing-slash URLs in the sitemap', () => {
    const homeEntries = sitemapEntries().filter((entry) => entry.basePath === '/');
    expect(homeEntries.map((entry) => entry.url)).toEqual([
      `${DOMAIN}/`,
      `${DOMAIN}/es/`,
      `${DOMAIN}/pt/`,
      `${DOMAIN}/fr/`,
      `${DOMAIN}/de/`,
    ]);
    for (const locale of LOCALIZED_LOCALES) {
      expect(sitemapEntries().find((e) => e.locale === locale && e.basePath === '/')?.url).toBe(
        `${DOMAIN}/${locale}/`,
      );
    }
  });

  it('emits the trailing-slash URL in the localized home JSON-LD', () => {
    for (const locale of LOCALIZED_LOCALES) {
      const schemas = buildStructuredDataSchemas(`/${locale}/`);
      expect(schemas, locale).toHaveLength(1);
      expect(schemas[0]['@type'], locale).toBe('WebSite');
      expect(schemas[0].url, locale).toBe(`${DOMAIN}/${locale}/`);
    }
    expect(buildStructuredDataSchemas('/')[0].url).toBe(`${DOMAIN}/`);
  });

  it('keeps every non-home localized URL on the no-trailing-slash form', () => {
    expect(absoluteSiteUrl('/es/privacy')).toBe(`${DOMAIN}/es/privacy`);
    expect(absoluteSiteUrl('/pt')).toBe(`${DOMAIN}/pt/`);
    expect(absoluteSiteUrl('/pt/calculators')).toBe(`${DOMAIN}/pt/calculators`);
    expect(absoluteSiteUrl('/de/calculators/concrete-slab-calculator')).toBe(
      `${DOMAIN}/de/calculators/concrete-slab-calculator`,
    );
  });
});

describe('hreflang alternates', () => {
  it('generates the full reciprocal set for a localized calculator page', () => {
    const { alternates } = getRouteSEO('/es/calculators/concrete-slab-calculator');
    const base = '/calculators/concrete-slab-calculator';
    expect(alternates).toEqual([
      { hreflang: 'en', href: `${siteConfig.domain}${base}` },
      { hreflang: 'es', href: `${siteConfig.domain}/es${base}` },
      { hreflang: 'pt', href: `${siteConfig.domain}/pt${base}` },
      { hreflang: 'fr', href: `${siteConfig.domain}/fr${base}` },
      { hreflang: 'de', href: `${siteConfig.domain}/de${base}` },
      { hreflang: 'x-default', href: `${siteConfig.domain}${base}` },
    ]);
  });

  it('generates the same reciprocal set from any member of the cluster', () => {
    const english = getRouteSEO('/guides').alternates;
    for (const locale of LOCALIZED_LOCALES) {
      expect(getRouteSEO(`/${locale}/guides`).alternates).toEqual(english);
    }
    expect(english).toHaveLength(6);
    expect(english.map((entry) => entry.hreflang)).toEqual([
      'en',
      'es',
      'pt',
      'fr',
      'de',
      'x-default',
    ]);
    expect(english[0].href).toBe(`${siteConfig.domain}/guides`);
    expect(english[5].href).toBe(`${siteConfig.domain}/guides`);
    expect(getRouteSEO('/').alternates[0].href).toBe(`${siteConfig.domain}/`);
    expect(getRouteSEO('/es').alternates[5].href).toBe(`${siteConfig.domain}/`);
  });

  it('always uses absolute https URLs without query parameters', () => {
    const { alternates } = getRouteSEO('/de/calculators/paint-calculator?unit=metric');
    for (const alternate of alternates) {
      expect(alternate.href.startsWith('https://mixtally.com/')).toBe(true);
      expect(alternate.href).not.toContain('?');
    }
  });

  it('never advertises routes that do not exist', () => {
    expect(getRouteSEO('/es/not-a-real-page').alternates).toEqual([]);
    expect(getRouteSEO('/not-a-real-page').alternates).toEqual([]);
    expect(getRouteSEO('/it/calculators').alternates).toEqual([]);
    expect(buildHreflangAlternates('/not-a-real-page')).toEqual([]);
    expect(buildHreflangAlternates('/es/not-a-real-page')).toEqual([]);
  });
});

describe('Invalid and localized-but-unknown routes', () => {
  it('treats an unknown localized path as the localized 404', () => {
    const seo = getRouteSEO('/es/not-a-real-page');
    expect(seo.noindex).toBe(true);
    expect(seo.title).toBe('Page Not Found — MixTally');
    expect(seo.canonicalPath).toBeUndefined();
    expect(seo.alternates).toEqual([]);
    expect(seo.locale).toBe('es');
  });

  it('treats an unknown locale prefix as an unknown English path', () => {
    const seo = getRouteSEO('/it/calculators');
    expect(seo.noindex).toBe(true);
    expect(seo.canonicalPath).toBeUndefined();
    expect(seo.alternates).toEqual([]);
    expect(seo.locale).toBe('en');
  });
});

describe('Localized SEO metadata', () => {
  it('provides a title and description for every route and locale', () => {
    let localizedCount = 0;
    for (const basePath of SAMPLE_BASE_PATHS) {
      const entry = seoRegistry[basePath];
      expect(entry.localized, basePath).toBeDefined();
      for (const locale of LOCALIZED_LOCALES) {
        const fields = entry.localized?.[locale];
        expect(fields, `${locale} ${basePath}`).toBeDefined();
        expect(fields?.title?.trim(), `${locale} ${basePath}`).toBeTruthy();
        expect(fields?.description?.trim(), `${locale} ${basePath}`).toBeTruthy();
        localizedCount += 1;
      }
    }
    expect(localizedCount).toBe(SAMPLE_BASE_PATHS.length * LOCALIZED_LOCALES.length);
  });

  it('never reuses the English strings for a translated locale', () => {
    for (const locale of LOCALIZED_LOCALES) {
      for (const basePath of SAMPLE_BASE_PATHS) {
        const localizedSeo = getRouteSEO(
          basePath === '/' ? `/${locale}` : `/${locale}${basePath}`,
        );
        const englishSeo = getRouteSEO(basePath);
        expect(localizedSeo.title, `${locale} ${basePath}`).not.toBe(englishSeo.title);
        expect(localizedSeo.description, `${locale} ${basePath}`).not.toBe(
          englishSeo.description,
        );
      }
    }
  });

  it('returns locale-specific metadata for each localized route', () => {
    for (const locale of LOCALIZED_LOCALES) {
      for (const basePath of SAMPLE_BASE_PATHS) {
        const path = basePath === '/' ? `/${locale}` : `/${locale}${basePath}`;
        const seo = getRouteSEO(path);
        expect(seo.locale, path).toBe(locale);
        expect(seo.title, path).toBe(seoRegistry[basePath].localized?.[locale]?.title);
        expect(seo.description, path).toBe(
          seoRegistry[basePath].localized?.[locale]?.description,
        );
      }
    }
  });

  it('matches the documented translation example exactly', () => {
    expect(getRouteSEO('/es').title).toBe(
      'MixTally — Calculadoras de construcción y herramientas de estimación 3D',
    );
    expect(getRouteSEO('/pt').title).toBe(
      'MixTally — Calculadoras de construção e ferramentas de estimativa 3D',
    );
    expect(getRouteSEO('/fr').title).toBe(
      "MixTally — Calculatrices de construction et outils d'estimation 3D",
    );
    expect(getRouteSEO('/de').title).toBe('MixTally — Bau-Rechner & 3D-Schätzwerkzeuge');
  });

  it('keeps the MixTally branding in every localized title', () => {
    for (const locale of LOCALIZED_LOCALES) {
      for (const basePath of SAMPLE_BASE_PATHS) {
        const fields = seoRegistry[basePath].localized?.[locale];
        expect(fields?.title, `${locale} ${basePath}`).toContain('MixTally');
      }
    }
  });

  it('avoids promotional claims in localized metadata', () => {
    const banned = /\b(best|#1|guaranteed|certified|professional-grade)\b/i;
    for (const locale of LOCALIZED_LOCALES) {
      for (const basePath of SAMPLE_BASE_PATHS) {
        const fields = seoRegistry[basePath].localized?.[locale];
        expect(banned.test(fields?.title ?? ''), `${locale} ${basePath} title`).toBe(false);
        expect(banned.test(fields?.description ?? ''), `${locale} ${basePath} description`).toBe(
          false,
        );
      }
    }
  });

  it('keeps the English 404 metadata unchanged for unknown localized routes', () => {
    for (const locale of LOCALIZED_LOCALES) {
      const seo = getRouteSEO(`/${locale}/not-a-real-page`);
      expect(seo.title, locale).toBe('Page Not Found — MixTally');
      expect(seo.description, locale).toBe(
        "The page you're looking for could not be found on MixTally.",
      );
      expect(seo.noindex, locale).toBe(true);
    }
  });

  it('leaves the 404 registry entry without localized overrides', () => {
    expect(seoRegistry['404'].localized).toBeUndefined();
  });
});

describe('Article SEO (fully translated bodies)', () => {
  const article = ARTICLE_REGISTRY[0];
  const basePath = articleBasePath(article.slug);

  it('self-canonicalizes each locale with its own copy and the full hreflang cluster', () => {
    const locales = ['en', ...LOCALIZED_LOCALES] as const;
    for (const locale of locales) {
      const path = locale === 'en' ? basePath : `/${locale}${basePath}`;
      const seo = getRouteSEO(path);
      const resolved = resolveArticleForLocale(article, locale);

      expect(seo.canonicalPath, path).toBe(path);
      expect(seo.noindex, path).toBeFalsy();
      expect(seo.locale, path).toBe(locale);
      expect(seo.title, path).toBe(`${resolved.title} — MixTally`);
      expect(seo.description, path).toBe(resolved.description);

      expect(seo.alternates.map((entry) => entry.hreflang), path).toEqual([
        'en',
        'es',
        'pt',
        'fr',
        'de',
        'x-default',
      ]);
      expect(seo.alternates.find((entry) => entry.hreflang === locale)?.href, path).toBe(
        `${siteConfig.domain}${path}`,
      );
      expect(seo.alternates.find((entry) => entry.hreflang === 'x-default')?.href, path).toBe(
        `${siteConfig.domain}${basePath}`,
      );
      for (const alternate of seo.alternates) {
        expect(alternate.href, alternate.href).not.toContain('/en/');
      }
    }
  });

  it('carries the social image and og:type=article through the head spec', () => {
    const spec = buildSeoHeadSpec(getRouteSEO(basePath));
    const imageUrl = `${siteConfig.domain}${article.ogImage.src}`;

    expect(spec.og.type).toBe('article');
    expect(spec.og.url).toBe(`${siteConfig.domain}${basePath}`);
    expect(spec.og.image).toEqual({
      url: imageUrl,
      width: article.ogImage.width,
      height: article.ogImage.height,
      alt: article.ogImage.alt,
    });
    expect(spec.twitter.image).toEqual({ url: imageUrl, alt: article.ogImage.alt });
  });

  it('leaves every other route free of social image tags', () => {
    for (const path of ['/', '/blog', '/guides', '/es/blog', '/definitely-not-a-page']) {
      const spec = buildSeoHeadSpec(getRouteSEO(path));
      expect(spec.og.image, path).toBeUndefined();
      expect(spec.twitter.image, path).toBeUndefined();
      expect(spec.og.type, path).toBe('website');
    }
  });

  it('treats unknown and malformed article paths as the noindex 404', () => {
    const failures = ['/blog/does-not-exist', '/blog/does/not/exist', '/es/blog/does-not-exist'];
    for (const path of failures) {
      const seo = getRouteSEO(path);
      expect(seo.noindex, path).toBe(true);
      expect(seo.canonicalPath, path).toBeUndefined();
      expect(seo.alternates, path).toEqual([]);
      expect(seo.title, path).toBe('Page Not Found — MixTally');
    }
  });

  it('keeps category filter query strings out of the canonical URL', () => {
    expect(getRouteSEO('/blog?category=concrete').canonicalPath).toBe('/blog');
    expect(getRouteSEO('/blog?category=not-a-category').canonicalPath).toBe('/blog');
    expect(getRouteSEO('/es/blog?category=paint').canonicalPath).toBe('/es/blog');
  });

  it('emits blog structured data only on blog routes', () => {
    expect(buildStructuredDataSchemas('/blog').map((schema) => schema['@type'])).toEqual([
      'BreadcrumbList',
    ]);
    expect(buildStructuredDataSchemas(basePath).map((schema) => schema['@type'])).toEqual([
      'Article',
      'BreadcrumbList',
    ]);
    expect(buildStructuredDataSchemas('/es' + basePath)).toHaveLength(2);
    expect(buildStructuredDataSchemas('/guides')).toEqual([]);
    expect(buildStructuredDataSchemas('/about')).toEqual([]);
  });
});
