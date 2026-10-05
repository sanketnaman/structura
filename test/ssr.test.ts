import { describe, it, expect } from 'vitest';
import { render } from '../src/entry-server';
import { buildSeoHeadSpec, getRouteSEO } from '../src/lib/seo';
import { buildStructuredDataSchemas } from '../src/lib/structuredData';
import { translate } from '../src/lib/i18n/translate';
import { BRICK_FAQ } from '../src/lib/calculators/brick/faq';

/**
 * Phase 4H-1 — representative server rendering (renderToString) for
 * English, localized, legal and 3D calculator routes. Runs in Vitest's
 * default node environment on purpose: no window/document means any
 * browser-global access inside the render path throws and fails the test.
 */

function countAnchors(html: string): number {
  return (html.match(/<a\s[^>]*href=/g) ?? []).length;
}

describe('server rendering environment', () => {
  it('has no browser globals available', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });
});

describe('representative route rendering', () => {
  it('renders / with English content and crawlable internal links', () => {
    const html = render('/');

    expect(html.length).toBeGreaterThan(10_000);
    expect(html).toContain(translate('en', 'hero.titleLine1'));
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/calculators/concrete-slab-calculator"');
    expect(countAnchors(html)).toBeGreaterThanOrEqual(20);
    expect(html).not.toContain('href="/en/');
    // No analytics/consent side effects in server markup
    expect(html).not.toContain('googletagmanager');
  });

  it('renders /es/ as a Spanish home page with localized links', () => {
    const html = render('/es/');

    expect(html.length).toBeGreaterThan(10_000);
    expect(html).toContain(translate('es', 'hero.titleLine1'));
    expect(html).toContain('href="/es/privacy"');
    expect(html).toContain('href="/es/calculators"');
    expect(countAnchors(html)).toBeGreaterThanOrEqual(20);
    expect(html).not.toContain('href="/en/');
  });

  it('renders /pt/privacy with the Portuguese heading and links only', () => {
    const html = render('/pt/privacy');

    expect(html.length).toBeGreaterThan(5_000);
    expect(html).toContain(translate('pt', 'privacy.title'));
    expect(html).toContain('href="/pt/');
    expect(countAnchors(html)).toBeGreaterThanOrEqual(10);
    expect(html).not.toContain('href="/privacy"');
    expect(html).not.toContain('href="/en/');
  });

  it('renders /fr/calculators/paint-calculator with French heading and 3D HUD', () => {
    const html = render('/fr/calculators/paint-calculator');

    expect(html.length).toBeGreaterThan(10_000);
    expect(html).toContain(translate('fr', 'nav.paintCalculator'));
    expect(html).toContain('Reset View');
    expect(html).toContain('href="/fr/');
    expect(countAnchors(html)).toBeGreaterThanOrEqual(10);
    expect(html).not.toContain('href="/en/');
  });

  it('renders /de/calculators/concrete-slab-calculator with German heading and 3D HUD', () => {
    const html = render('/de/calculators/concrete-slab-calculator');

    expect(html.length).toBeGreaterThan(10_000);
    expect(html).toContain(translate('de', 'nav.concreteSlabCalculator'));
    expect(html).toContain('Reset View');
    expect(html).toContain('href="/de/');
    expect(countAnchors(html)).toBeGreaterThanOrEqual(10);
    expect(html).not.toContain('href="/en/');
  });

  it('renders /calculators/brick-mortar-calculator with English heading and 3D HUD', () => {
    const html = render('/calculators/brick-mortar-calculator');

    expect(html.length).toBeGreaterThan(10_000);
    expect(html).toContain(translate('en', 'brick.h1'));
    expect(html).toContain('Reset View');
    expect(html).toContain('href="/privacy"');
    expect(countAnchors(html)).toBeGreaterThanOrEqual(20);
    expect(html).not.toContain('href="/en/');
  });

  it('renders /blog as a crawlable listing with category anchors', () => {
    const html = render('/blog');

    expect(html.length).toBeGreaterThan(5_000);
    expect(html).toContain(translate('en', 'blog.title'));
    expect(html).toContain('href="/blog?category=concrete"');
    expect(html).toContain('href="/blog/how-to-calculate-concrete-volume-for-a-slab"');
    expect(html).toContain('<h1');
    expect(countAnchors(html)).toBeGreaterThanOrEqual(10);
    expect(html).not.toContain('href="/en/');
  });

  it('renders an article with English body markup and localized chrome', () => {
    const html = render('/de/blog/how-to-calculate-concrete-volume-for-a-slab');

    expect(html.length).toBeGreaterThan(10_000);
    expect(html).toContain('<article lang="en"');
    expect(html).toContain('How to Calculate Concrete Volume for a Slab');
    expect(html).toContain('id="volume-formula"');
    expect(html).toContain(translate('de', 'blog.backToListing'));
    expect(html).toContain('href="/de/blog"');
    expect(html).not.toContain('href="/en/');
  });
});

describe('buildSeoHeadSpec', () => {
  it('builds exact head values for /pt/privacy (title, description, canonical, og, twitter)', () => {
    const spec = buildSeoHeadSpec(getRouteSEO('/pt/privacy'));

    expect(spec.title).toBe('Política de privacidade — MixTally');
    expect(spec.description).toBe(
      'Leia a política de privacidade do MixTally sobre uso do site, dados das calculadoras, cookies, análise de dados, publicidade e práticas de privacidade.',
    );
    expect(spec.robots).toBe('index, follow');
    expect(spec.canonicalUrl).toBe('https://mixtally.com/pt/privacy');
    expect(spec.htmlLang).toBe('pt-BR');
    expect(spec.og).toEqual({
      title: 'Política de privacidade — MixTally',
      description:
        'Leia a política de privacidade do MixTally sobre uso do site, dados das calculadoras, cookies, análise de dados, publicidade e práticas de privacidade.',
      type: 'website',
      siteName: 'MixTally',
      url: 'https://mixtally.com/pt/privacy',
    });
    expect(spec.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Política de privacidade — MixTally',
      description:
        'Leia a política de privacidade do MixTally sobre uso do site, dados das calculadoras, cookies, análise de dados, publicidade e práticas de privacidade.',
    });
  });

  it('returns all six reciprocal hreflang entries for a localized route', () => {
    const spec = buildSeoHeadSpec(getRouteSEO('/pt/privacy'));

    expect(spec.hreflangs).toEqual([
      { hreflang: 'en', href: 'https://mixtally.com/privacy' },
      { hreflang: 'es', href: 'https://mixtally.com/es/privacy' },
      { hreflang: 'pt', href: 'https://mixtally.com/pt/privacy' },
      { hreflang: 'fr', href: 'https://mixtally.com/fr/privacy' },
      { hreflang: 'de', href: 'https://mixtally.com/de/privacy' },
      { hreflang: 'x-default', href: 'https://mixtally.com/privacy' },
    ]);
  });

  it('keeps the English home canonical on the trailing-slash root form', () => {
    const spec = buildSeoHeadSpec(getRouteSEO('/'));

    expect(spec.canonicalUrl).toBe('https://mixtally.com/');
    expect(spec.og.url).toBe('https://mixtally.com/');
    expect(spec.htmlLang).toBe('en');
    expect(spec.hreflangs).toHaveLength(6);
    expect(spec.hreflangs.find((a) => a.hreflang === 'x-default')?.href).toBe(
      'https://mixtally.com/',
    );
  });

  it('canonicalizes the locale home with a trailing slash from either URL form', () => {
    expect(buildSeoHeadSpec(getRouteSEO('/es/')).canonicalUrl).toBe('https://mixtally.com/es/');
    expect(buildSeoHeadSpec(getRouteSEO('/es')).canonicalUrl).toBe('https://mixtally.com/es/');
    expect(buildSeoHeadSpec(getRouteSEO('/es/')).og.url).toBe('https://mixtally.com/es/');
    expect(buildSeoHeadSpec(getRouteSEO('/pt')).canonicalUrl).toBe('https://mixtally.com/pt/');
    expect(buildSeoHeadSpec(getRouteSEO('/fr')).canonicalUrl).toBe('https://mixtally.com/fr/');
    expect(buildSeoHeadSpec(getRouteSEO('/de')).canonicalUrl).toBe('https://mixtally.com/de/');
  });

  it('derives the correct html lang for every locale', () => {
    expect(buildSeoHeadSpec(getRouteSEO('/privacy')).htmlLang).toBe('en');
    expect(buildSeoHeadSpec(getRouteSEO('/es/privacy')).htmlLang).toBe('es');
    expect(buildSeoHeadSpec(getRouteSEO('/pt/privacy')).htmlLang).toBe('pt-BR');
    expect(buildSeoHeadSpec(getRouteSEO('/fr/privacy')).htmlLang).toBe('fr');
    expect(buildSeoHeadSpec(getRouteSEO('/de/privacy')).htmlLang).toBe('de');
  });

  it('marks unknown routes noindex with no canonical, og:url or alternates', () => {
    const spec = buildSeoHeadSpec(getRouteSEO('/definitely-not-a-page'));

    expect(spec.title).toBe('Page Not Found — MixTally');
    expect(spec.robots).toBe('noindex, nofollow');
    expect(spec.canonicalUrl).toBeUndefined();
    expect(spec.og.url).toBeUndefined();
    expect(spec.hreflangs).toEqual([]);
    expect(spec.htmlLang).toBe('en');
  });
});

describe('buildStructuredDataSchemas', () => {
  it('emits a localized WebSite schema on the localized home', () => {
    const schemas = buildStructuredDataSchemas('/es/');

    expect(schemas).toHaveLength(1);
    expect(schemas[0]).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'MixTally',
      url: 'https://mixtally.com/es/',
    });
  });

  it('emits WebApplication + BreadcrumbList + FAQPage for /de concrete with localized URLs', () => {
    const schemas = buildStructuredDataSchemas('/de/calculators/concrete-slab-calculator');

    expect(schemas).toHaveLength(3);
    expect(schemas.map((s) => s['@type'])).toEqual([
      'WebApplication',
      'BreadcrumbList',
      'FAQPage',
    ]);
    expect(schemas[0]).toMatchObject({
      name: 'Concrete Slab Calculator',
      url: 'https://mixtally.com/de/calculators/concrete-slab-calculator',
    });
    const breadcrumb = schemas[1] as { itemListElement: { item: string }[] };
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[2].item).toBe(
      'https://mixtally.com/de/calculators/concrete-slab-calculator',
    );
    const faq = schemas[2] as { mainEntity: unknown[] };
    expect(faq.mainEntity).toHaveLength(3);
  });

  it('emits the full BRICK_FAQ FAQPage for the English brick calculator', () => {
    const schemas = buildStructuredDataSchemas('/calculators/brick-mortar-calculator');

    expect(schemas).toHaveLength(3);
    expect(schemas.map((s) => s['@type'])).toEqual([
      'WebApplication',
      'BreadcrumbList',
      'FAQPage',
    ]);
    const faq = schemas[2] as { mainEntity: unknown[] };
    expect(faq.mainEntity).toHaveLength(BRICK_FAQ.length);
    expect(BRICK_FAQ.length).toBeGreaterThan(0);
  });

  it('emits WebApplication + BreadcrumbList (no FAQ) for the French paint calculator', () => {
    const schemas = buildStructuredDataSchemas('/fr/calculators/paint-calculator');

    expect(schemas).toHaveLength(2);
    expect(schemas.map((s) => s['@type'])).toEqual(['WebApplication', 'BreadcrumbList']);
    expect(schemas[0]).toMatchObject({
      name: 'Paint Calculator',
      url: 'https://mixtally.com/fr/calculators/paint-calculator',
    });
  });

  it('emits a breadcrumb only for the calculators directory', () => {
    const schemas = buildStructuredDataSchemas('/pt/calculators');

    expect(schemas).toHaveLength(1);
    expect(schemas[0]).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mixtally.com/pt/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Calculators',
          item: 'https://mixtally.com/pt/calculators',
        },
      ],
    });
  });

  it('emits no dynamic schema on legal routes (historic behavior)', () => {
    expect(buildStructuredDataSchemas('/pt/privacy')).toEqual([]);
    expect(buildStructuredDataSchemas('/terms')).toEqual([]);
    expect(buildStructuredDataSchemas('/guides')).toEqual([]);
  });

  it('emits a localized breadcrumb for the blog listing', () => {
    const schemas = buildStructuredDataSchemas('/pt/blog');

    expect(schemas).toHaveLength(1);
    expect(schemas[0]).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://mixtally.com/pt/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://mixtally.com/pt/blog',
        },
      ],
    });
  });

  it('emits Article + BreadcrumbList with the English canonical for a mirror', () => {
    const schemas = buildStructuredDataSchemas('/fr/blog/how-to-calculate-concrete-volume-for-a-slab');

    expect(schemas).toHaveLength(2);
    expect(schemas.map((s) => s['@type'])).toEqual(['Article', 'BreadcrumbList']);
    expect(schemas[0]).toMatchObject({
      headline: 'How to Calculate Concrete Volume for a Slab',
      datePublished: '2026-10-04',
      dateModified: '2026-10-04',
      author: { '@type': 'Organization', name: 'MixTally' },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://mixtally.com/blog/how-to-calculate-concrete-volume-for-a-slab',
      },
    });
    const breadcrumb = schemas[1] as { itemListElement: { name: string; item: string }[] };
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[0].name).toBe(translate('fr', 'common.home'));
    expect(breadcrumb.itemListElement[2].item).toBe(
      'https://mixtally.com/blog/how-to-calculate-concrete-volume-for-a-slab',
    );
  });
});
