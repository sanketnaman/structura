// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocument } from '../scripts/prerender';
import { render } from '../src/entry-server';
import { getRouteSEO } from '../src/lib/seo';
import { SEO } from '../src/components/common/SEO';
import { StructuredData } from '../src/components/common/StructuredData';

/**
 * Phase 4H-2 — client takeover over prerendered HTML.
 *
 * The static document (buildDocument output) is loaded into jsdom exactly
 * as a browser would see it before JavaScript, then the real client
 * effects (SEO + StructuredData) run over it. They must upsert in place:
 * no duplicated title/description/robots/canonical/og/twitter/hreflang
 * tags, and JSON-LD scripts replaced 1:1 rather than accumulated.
 */

const TEST_ROUTE = '/de/calculators/concrete-slab-calculator';
const LEGAL_ROUTE = '/pt/privacy';

// jsdom exposes window but no ResizeObserver; react-use-measure (used by
// the 3D canvas during renderToString) hard-throws without one. In plain
// Node (the real prerender pipeline) window is undefined and it no-ops.
if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as Record<string, unknown>).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fixtureTemplate(): string {
  const source = readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
  return source.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" crossorigin src="/assets/index-fixture.js"></script>',
  );
}

function countOccurrences(regex: RegExp): number {
  return (document.documentElement.outerHTML.match(regex) ?? []).length;
}

interface DocSnapshot {
  titles: number;
  descriptions: number;
  robots: number;
  canonicals: number;
  ogTotal: number;
  twitterTotal: number;
  hreflangs: number;
  taggedJsonLd: number;
  untaggedJsonLd: number;
}

function snapshot(): DocSnapshot {
  return {
    titles: document.querySelectorAll('title').length,
    descriptions: countOccurrences(/<meta\s+name="description"\s+content=/g),
    robots: countOccurrences(/<meta\s+name="robots"\s+content=/g),
    canonicals: countOccurrences(/<link\s+rel="canonical"\s+href=/g),
    ogTotal: countOccurrences(/<meta\s+property="og:/g),
    twitterTotal: countOccurrences(/<meta\s+name="twitter:/g),
    hreflangs: countOccurrences(/<link\s+rel="alternate"\s+hreflang=/g),
    taggedJsonLd: countOccurrences(/<script type="application\/ld\+json" data-mixtally-ld="true">/g),
    untaggedJsonLd: countOccurrences(/<script type="application\/ld\+json">/g),
  };
}

let container: HTMLDivElement | null = null;
let root: Root | null = null;

/** Adopt a generated prerendered document as the live jsdom document. */
function adoptDocument(urlPath: string): DocSnapshot {
  const doc = buildDocument(fixtureTemplate(), urlPath, render(urlPath));
  const parsed = new DOMParser().parseFromString(doc, 'text/html');
  document.head.innerHTML = parsed.head.innerHTML;
  document.documentElement.lang = parsed.documentElement.lang;
  document.body.innerHTML = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  return snapshot();
}

/** Run the real client effects for the route, as main.tsx would after takeover. */
function runEffects(urlPath: string): void {
  const seo = getRouteSEO(urlPath);
  act(() => {
    root?.render(
      <>
        <SEO
          title={seo.title}
          description={seo.description}
          canonicalPath={seo.canonicalPath}
          noindex={seo.noindex}
          locale={seo.locale}
          alternates={seo.alternates}
        />
        <StructuredData pathname={urlPath} />
      </>,
    );
  });
}

beforeAll(() => {
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(async () => {
  if (root) {
    await act(async () => root?.unmount());
    root = null;
  }
  container?.remove();
  container = null;
});

describe('client effects over prerendered HTML', () => {
  it('keeps exactly one of every head tag for the German calculator route', () => {
    const before = adoptDocument(TEST_ROUTE);
    expect(before).toEqual({
      titles: 1,
      descriptions: 1,
      robots: 1,
      canonicals: 1,
      ogTotal: 5,
      twitterTotal: 3,
      hreflangs: 6,
      taggedJsonLd: 3,
      untaggedJsonLd: 1,
    });
    expect(document.documentElement.lang).toBe('de');

    runEffects(TEST_ROUTE);

    expect(snapshot()).toEqual(before);
    expect(document.title).toBe(
      'Betonplatten-Rechner — 3D-Volumen & Materialschätzung | MixTally',
    );
    expect(document.documentElement.lang).toBe('de');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://mixtally.com/de/calculators/concrete-slab-calculator');
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ).toBe('https://mixtally.com/de/calculators/concrete-slab-calculator');
    expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(6);
  });

  it('keeps head tags singular for a localized legal route (no JSON-LD routes)', () => {
    const before = adoptDocument(LEGAL_ROUTE);
    expect(before.taggedJsonLd).toBe(0);
    expect(before.hreflangs).toBe(6);
    expect(document.documentElement.lang).toBe('pt-BR');

    runEffects(LEGAL_ROUTE);

    expect(snapshot()).toEqual(before);
    expect(document.title).toBe('Política de privacidade — MixTally');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://mixtally.com/pt/privacy');
    expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(6);
  });

  it('replaces prerendered JSON-LD 1:1 when the route changes (never accumulates)', () => {
    adoptDocument(TEST_ROUTE);
    runEffects(TEST_ROUTE);
    expect(snapshot().taggedJsonLd).toBe(3);

    // Simulate SPA navigation: the paint calculator route has 2 schemas.
    act(() => {
      root?.render(<StructuredData pathname="/calculators/paint-calculator" />);
    });
    expect(snapshot().taggedJsonLd).toBe(2);

    act(() => {
      root?.render(<StructuredData pathname="/pt/privacy" />);
    });
    expect(snapshot().taggedJsonLd).toBe(0);
  });
});
