// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SEO } from '../src/components/common/SEO';
import { StructuredData } from '../src/components/common/StructuredData';
import { getRouteSEO } from '../src/lib/seo';
import { ARTICLE_REGISTRY } from '../src/lib/blog/registry';

/**
 * Phase 4H-1 regression guard: the SEO and StructuredData effects now
 * consume the shared pure builders, but must keep writing document.head
 * with byte-identical values and the same upsert/remove semantics as
 * before the refactor.
 */

let container: HTMLDivElement;
let root: Root;
let rootUnmounted = false;

function renderSEO(pathname: string): void {
  const seo = getRouteSEO(pathname);
  act(() => {
    root.render(
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        noindex={seo.noindex}
        locale={seo.locale}
        alternates={seo.alternates}
        image={seo.image}
        ogType={seo.ogType}
      />,
    );
  });
}

beforeEach(() => {
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
  document.head.innerHTML = '';
  document.documentElement.lang = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  rootUnmounted = false;
});

afterEach(async () => {
  if (!rootUnmounted) {
    await act(async () => root.unmount());
  }
  container.remove();
});

describe('SEO effect (client document.head behavior unchanged)', () => {
  it('writes the full localized head for /pt/privacy', () => {
    renderSEO('/pt/privacy');

    expect(document.title).toBe('Política de privacidade — MixTally');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Leia a política de privacidade do MixTally sobre uso do site, dados das calculadoras, cookies, análise de dados, publicidade e práticas de privacidade.',
    );
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index, follow',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://mixtally.com/pt/privacy',
    );
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Política de privacidade — MixTally',
    );
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'website',
    );
    expect(document.querySelector('meta[property="og:site_name"]')?.getAttribute('content')).toBe(
      'MixTally',
    );
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://mixtally.com/pt/privacy',
    );
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(
      'Política de privacidade — MixTally',
    );
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(6);
    expect(
      document.querySelector('link[rel="alternate"][hreflang="x-default"]')?.getAttribute('href'),
    ).toBe('https://mixtally.com/privacy');
  });

  it('upserts in place (no duplicate tags) across route changes', () => {
    renderSEO('/pt/privacy');
    renderSEO('/es/privacy');

    expect(document.title).toBe('Política de privacidad — MixTally');
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(6);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://mixtally.com/es/privacy',
    );
    expect(document.documentElement.lang).toBe('es');
  });

  it('applies noindex 404 semantics and removes stale canonical/og:url/hreflang', () => {
    renderSEO('/pt/privacy');
    renderSEO('/definitely-not-a-page');

    expect(document.title).toBe('Page Not Found — MixTally');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, nofollow',
    );
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
    expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(0);
  });

  it('writes the article og/twitter image set and removes it on the next route', () => {
    const article = ARTICLE_REGISTRY[0];
    const imageUrl = `https://mixtally.com${article.ogImage.src}`;

    renderSEO(`/blog/${article.slug}`);
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      imageUrl,
    );
    expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe(
      String(article.ogImage.width),
    );
    expect(
      document.querySelector('meta[property="og:image:height"]')?.getAttribute('content'),
    ).toBe(String(article.ogImage.height));
    expect(document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toBe(
      article.ogImage.alt,
    );
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'article',
    );
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
      imageUrl,
    );
    expect(
      document.querySelector('meta[name="twitter:image:alt"]')?.getAttribute('content'),
    ).toBe(article.ogImage.alt);
    expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(6);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe(`https://mixtally.com/blog/${article.slug}`);

    renderSEO('/privacy');
    expect(document.querySelector('meta[property="og:image"]')).toBeNull();
    expect(document.querySelector('meta[property="og:image:width"]')).toBeNull();
    expect(document.querySelector('meta[property="og:image:height"]')).toBeNull();
    expect(document.querySelector('meta[property="og:image:alt"]')).toBeNull();
    expect(document.querySelector('meta[name="twitter:image"]')).toBeNull();
    expect(document.querySelector('meta[name="twitter:image:alt"]')).toBeNull();
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'website',
    );
    expect(document.querySelectorAll('meta[property^="og:image"]')).toHaveLength(0);
    expect(document.querySelectorAll('meta[name^="twitter:image"]')).toHaveLength(0);
  });
});

describe('StructuredData effect (client JSON-LD behavior unchanged)', () => {
  it('injects route schemas tagged data-mixtally-ld and cleans them up on unmount', async () => {
    await act(async () => {
      root.render(<StructuredData pathname="/de/calculators/concrete-slab-calculator" />);
    });

    const scripts = document.querySelectorAll('script[data-mixtally-ld="true"]');
    expect(scripts).toHaveLength(3);
    expect(scripts[0].getAttribute('type')).toBe('application/ld+json');
    const first = JSON.parse(scripts[0].textContent ?? '{}') as Record<string, unknown>;
    expect(first['@type']).toBe('WebApplication');
    expect(first.url).toBe('https://mixtally.com/de/calculators/concrete-slab-calculator');

    await act(async () => root.unmount());
    rootUnmounted = true;
    expect(document.querySelectorAll('script[data-mixtally-ld="true"]')).toHaveLength(0);
  });

  it('replaces stale schemas when the pathname changes', async () => {
    await act(async () => {
      root.render(<StructuredData pathname="/calculators/brick-mortar-calculator" />);
    });
    await act(async () => {
      root.render(<StructuredData pathname="/privacy" />);
    });

    // /privacy emits no dynamic schema — the brick scripts must be gone.
    expect(document.querySelectorAll('script[data-mixtally-ld="true"]')).toHaveLength(0);
  });

  it('emits Article + BreadcrumbList for a blog article and cleans them up', async () => {
    const article = ARTICLE_REGISTRY[0];

    await act(async () => {
      root.render(<StructuredData pathname={`/blog/${article.slug}`} />);
    });

    const scripts = document.querySelectorAll('script[data-mixtally-ld="true"]');
    expect(scripts).toHaveLength(2);

    const articleSchema = JSON.parse(scripts[0].textContent ?? '{}') as Record<string, unknown>;
    expect(articleSchema['@type']).toBe('Article');
    expect(articleSchema.headline).toBe(article.title);
    expect(articleSchema.datePublished).toBe(article.publishedAt);
    const mainEntity = articleSchema.mainEntityOfPage as { '@id': string };
    expect(mainEntity['@id']).toBe(`https://mixtally.com/blog/${article.slug}`);

    const breadcrumb = JSON.parse(scripts[1].textContent ?? '{}') as Record<string, unknown>;
    expect(breadcrumb['@type']).toBe('BreadcrumbList');

    await act(async () => root.unmount());
    rootUnmounted = true;
    expect(document.querySelectorAll('script[data-mixtally-ld="true"]')).toHaveLength(0);
  });
});
