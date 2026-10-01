import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDocument,
  defaultPrerenderPaths,
  outputPathFor,
  prerender,
  resolveOutputPath,
  unescapeHtml,
  type PrerenderResult,
} from '../scripts/prerender';
import { render } from '../src/entry-server';
import { sitemapEntries } from '../src/lib/sitemap';
import { buildSeoHeadSpec, getRouteSEO } from '../src/lib/seo';
import { buildStructuredDataSchemas } from '../src/lib/structuredData';
import { getLocaleDefinition } from '../src/lib/i18n/config';
import { parseLocalePath } from '../src/lib/i18n/routing';
import { translate } from '../src/lib/i18n/translate';
import { BRICK_FAQ } from '../src/lib/calculators/brick/faq';

/**
 * Phase 4H-2 — static prerendering of all 65 routes.
 *
 * Generates the full output twice into OS temp directories (never the
 * repo), then validates every generated document: exact file set and
 * paths, localized head metadata, hreflang/robots/canonical, JSON-LD,
 * real body content, no SPA shells, no /en/, no dev URLs, no duplicate
 * tags, and byte-identical determinism across repeated generation.
 */

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Template shaped exactly like a built dist/index.html (hashed assets). */
function makeFixtureTemplate(): string {
  const source = readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
  const fixture = source
    .replace(
      '<script type="module" src="/src/main.tsx"></script>',
      '<script type="module" crossorigin src="/assets/index-fixture.js"></script>',
    )
    .replace(
      '</head>',
      '    <link rel="stylesheet" crossorigin href="/assets/index-fixture.css">\n  </head>',
    );
  if (fixture.includes('/src/main.tsx') || !fixture.includes('/assets/index-fixture.js')) {
    throw new Error('Fixture template failed: index.html structure changed unexpectedly');
  }
  return fixture;
}

function listHtmlFiles(dir: string, prefix = ''): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(path.join(dir, prefix), { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...listHtmlFiles(dir, rel));
    else if (entry.name.endsWith('.html')) out.push(rel);
  }
  return out.sort();
}

function countMatches(value: string, regex: RegExp): number {
  return (value.match(regex) ?? []).length;
}

function extract(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractMeta(html: string, attr: 'name' | 'property', key: string): string | null {
  const raw = extract(html, new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`));
  return raw === null ? null : unescapeHtml(raw);
}

function extractTitle(html: string): string | null {
  const raw = extract(html, /<title>([\s\S]*?)<\/title>/);
  return raw === null ? null : unescapeHtml(raw);
}

function extractHreflangs(html: string): { hreflang: string; href: string }[] {
  const out: { hreflang: string; href: string }[] = [];
  const regex = /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g;
  for (const match of html.matchAll(regex)) {
    out.push({ hreflang: match[1], href: unescapeHtml(match[2]) });
  }
  return out;
}

function extractRootContent(html: string): string {
  const start = html.indexOf('<div id="root">');
  const end = html.indexOf('</body>');
  if (start === -1 || end === -1) throw new Error('Document is missing root div or </body>');
  return html.slice(start, end);
}

function extractTaggedJsonLd(html: string): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const regex = /<script type="application\/ld\+json" data-mixtally-ld="true">([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(regex)) {
    out.push(JSON.parse(match[1]) as Record<string, unknown>);
  }
  return out;
}

const fixtureTemplate = makeFixtureTemplate();
const urlPaths = defaultPrerenderPaths();

interface Expectation {
  urlPath: string;
  outputPath: string;
  htmlLang: string;
  title: string;
  description: string;
  robots: string;
  canonicalUrl?: string;
  hreflangs: { hreflang: string; href: string }[];
  taggedSchemas: number;
}

const expectations: Expectation[] = urlPaths.map((urlPath) => {
  const spec = buildSeoHeadSpec(getRouteSEO(urlPath));
  return {
    urlPath,
    outputPath: outputPathFor(urlPath),
    htmlLang: spec.htmlLang,
    title: spec.title,
    description: spec.description,
    robots: spec.robots,
    canonicalUrl: spec.canonicalUrl,
    hreflangs: spec.hreflangs,
    taggedSchemas: buildStructuredDataSchemas(urlPath).length,
  };
});

let outDirA: string;
let outDirB: string;
let resultA: PrerenderResult;

const documents = new Map<string, string>();
function docFor(urlPath: string): string {
  const cached = documents.get(urlPath);
  if (cached !== undefined) return cached;
  const rel = outputPathFor(urlPath);
  const content = readFileSync(path.join(outDirA, ...rel.split('/')), 'utf8');
  documents.set(urlPath, content);
  return content;
}

beforeAll(() => {
  outDirA = mkdtempSync(path.join(tmpdir(), 'mixtally-prerender-a-'));
  outDirB = mkdtempSync(path.join(tmpdir(), 'mixtally-prerender-b-'));
  resultA = prerender({ templateHtml: fixtureTemplate, outDir: outDirA, render });
  for (const expectation of expectations) {
    documents.set(expectation.urlPath, readFileSync(
      path.join(outDirA, ...expectation.outputPath.split('/')),
      'utf8',
    ));
  }
}, 240_000);

afterAll(() => {
  rmSync(outDirA, { recursive: true, force: true });
  rmSync(outDirB, { recursive: true, force: true });
});

describe('route enumeration and output paths', () => {
  it('enumerates exactly the 65 sitemap routes with unique output paths', () => {
    expect(sitemapEntries()).toHaveLength(65);
    expect(urlPaths).toHaveLength(65);
    expect(new Set(urlPaths).size).toBe(65);
    expect(new Set(expectations.map((e) => e.outputPath)).size).toBe(65);
    expect(resultA.count).toBe(65);
  });

  it('maps every spec example to its exact output path', () => {
    expect(outputPathFor('/')).toBe('index.html');
    expect(outputPathFor('/calculators')).toBe('calculators.html');
    expect(outputPathFor('/es/')).toBe('es/index.html');
    expect(outputPathFor('/es')).toBe('es/index.html');
    expect(outputPathFor('/es/calculators/concrete-slab-calculator')).toBe(
      'es/calculators/concrete-slab-calculator.html',
    );
    expect(outputPathFor('/pt/privacy')).toBe('pt/privacy.html');
    expect(outputPathFor('/de/calculators/paint-calculator')).toBe(
      'de/calculators/paint-calculator.html',
    );
  });

  it('generates exactly those files on disk, nothing missing or extra', () => {
    const onDisk = listHtmlFiles(outDirA);
    const expectedSet = [...expectations.map((e) => e.outputPath), '404.html'].sort();
    expect(onDisk).toEqual(expectedSet);
    expect(resultA.notFoundFile).toBe('404.html');
    expect(existsSync(path.join(outDirA, 'index.html'))).toBe(true);
    expect(existsSync(path.join(outDirA, '404.html'))).toBe(true);
    expect(existsSync(path.join(outDirA, 'es', 'index.html'))).toBe(true);
    expect(existsSync(path.join(outDirA, 'pt', 'privacy.html'))).toBe(true);
    expect(existsSync(path.join(outDirA, 'de', 'calculators', 'paint-calculator.html'))).toBe(true);
    expect(existsSync(path.join(outDirA, 'es', 'calculators', 'concrete-slab-calculator.html'))).toBe(true);
  });

  it('never generates /en/ output', () => {
    for (const rel of listHtmlFiles(outDirA)) {
      expect(rel.startsWith('en/') || rel.includes('/en/')).toBe(false);
    }
    expect(() => outputPathFor('/en/privacy')).toThrow(/\/en\//);
    expect(() => outputPathFor('/en')).toThrow(/\/en\//);
  });

  it('rejects every path that could escape dist', () => {
    expect(() => outputPathFor('../secret')).toThrow(/absolute/);
    expect(() => outputPathFor('/pt/../../etc/passwd')).toThrow(/Unsafe/);
    expect(() => outputPathFor('/pt/./privacy')).toThrow(/Unsafe/);
    expect(() => outputPathFor('/pt/privacy/..')).toThrow(/Unsafe/);
    expect(() => resolveOutputPath(outDirA, '../escape.html')).toThrow(/escapes/);
    expect(resolveOutputPath(outDirA, 'a/b.html')).toBe(
      path.resolve(outDirA, 'a', 'b.html'),
    );
  });
});

describe('head validation for all 65 documents', () => {
  it('matches the pure builders: lang, title, description, robots, canonical, hreflang', () => {
    const failures: string[] = [];
    for (const expectation of expectations) {
      const html = docFor(expectation.urlPath);
      const lang = extract(html, /<html lang="([^"]*)">/);
      const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/);

      if (lang !== expectation.htmlLang) {
        failures.push(`${expectation.urlPath}: lang ${lang} !== ${expectation.htmlLang}`);
      }
      if (extractTitle(html) !== expectation.title) {
        failures.push(`${expectation.urlPath}: title mismatch (${extractTitle(html)})`);
      }
      if (extractMeta(html, 'name', 'description') !== expectation.description) {
        failures.push(`${expectation.urlPath}: description mismatch`);
      }
      if (extractMeta(html, 'name', 'robots') !== expectation.robots) {
        failures.push(`${expectation.urlPath}: robots mismatch`);
      }
      if (canonical !== (expectation.canonicalUrl ? unescapeHtml(expectation.canonicalUrl) : null)) {
        failures.push(`${expectation.urlPath}: canonical ${canonical} !== ${expectation.canonicalUrl}`);
      }
      const hreflangs = extractHreflangs(html);
      if (JSON.stringify(hreflangs) !== JSON.stringify(expectation.hreflangs)) {
        failures.push(`${expectation.urlPath}: hreflang set mismatch (${hreflangs.length} entries)`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('has exactly one of every managed tag per document (no duplicates, none missing)', () => {
    const failures: string[] = [];
    for (const expectation of expectations) {
      const html = docFor(expectation.urlPath);
      const checks: [string, number, number][] = [
        ['<title>', countMatches(html, /<title>/g), 1],
        ['meta description', countMatches(html, /<meta\s+name="description"\s+content=/g), 1],
        ['meta robots', countMatches(html, /<meta\s+name="robots"\s+content=/g), 1],
        ['canonical', countMatches(html, /<link\s+rel="canonical"\s+href=/g), 1],
        ['og:* total', countMatches(html, /<meta\s+property="og:/g), 5],
        ['og:url', countMatches(html, /<meta\s+property="og:url"\s+content=/g), 1],
        ['twitter:* total', countMatches(html, /<meta\s+name="twitter:/g), 3],
        ['hreflang', countMatches(html, /<link\s+rel="alternate"\s+hreflang=/g), 6],
        ['site-level JSON-LD', countMatches(html, /<script type="application\/ld\+json">/g), 1],
        [
          'route JSON-LD',
          countMatches(html, /<script type="application\/ld\+json" data-mixtally-ld="true">/g),
          expectation.taggedSchemas,
        ],
      ];
      for (const [label, actual, wanted] of checks) {
        if (actual !== wanted) {
          failures.push(`${expectation.urlPath}: ${label} count ${actual} !== ${wanted}`);
        }
      }
      const htmlLangCount = countMatches(html, /<html lang=/g);
      if (htmlLangCount !== 1) failures.push(`${expectation.urlPath}: <html lang> count ${htmlLangCount}`);
    }
    expect(failures).toEqual([]);
  });

  it('contains no localhost, Worker dev, port or Vite dev URLs', () => {
    const forbidden = /localhost|127\.0\.0\.1|:\d{4}\b|workers\.dev|\/src\//;
    const failures: string[] = [];
    for (const expectation of expectations) {
      const html = docFor(expectation.urlPath);
      const match = html.match(forbidden);
      if (match) failures.push(`${expectation.urlPath}: forbidden URL fragment "${match[0]}"`);
    }
    expect(failures).toEqual([]);
  });

  it('contains no /en/ links and no empty SPA root shell in any document', () => {
    const failures: string[] = [];
    for (const expectation of expectations) {
      const html = docFor(expectation.urlPath);
      const root = extractRootContent(html);
      const anchors = countMatches(root, /<a\s[^>]*href=/g);

      if (html.includes('href="/en/')) failures.push(`${expectation.urlPath}: /en/ link present`);
      if (!root.includes('<h1')) failures.push(`${expectation.urlPath}: no <h1> in body`);
      if (root.length < 3_000) {
        failures.push(`${expectation.urlPath}: root body only ${root.length} chars (SPA shell?)`);
      }
      if (anchors < 10) {
        failures.push(`${expectation.urlPath}: only ${anchors} internal anchors`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('JSON-LD content for all 65 documents', () => {
  it('emits exactly the builder schemas, parseable and with correct localized URLs', () => {
    const failures: string[] = [];
    for (const expectation of expectations) {
      const html = docFor(expectation.urlPath);
      let schemas: Record<string, unknown>[];
      try {
        schemas = extractTaggedJsonLd(html);
      } catch (error) {
        failures.push(`${expectation.urlPath}: unparseable JSON-LD (${(error as Error).message})`);
        continue;
      }
      const wanted = buildStructuredDataSchemas(expectation.urlPath);
      if (schemas.length !== wanted.length) {
        failures.push(`${expectation.urlPath}: ${schemas.length} JSON-LD scripts !== ${wanted.length}`);
        continue;
      }
      if (JSON.stringify(schemas) !== JSON.stringify(wanted)) {
        failures.push(`${expectation.urlPath}: JSON-LD content differs from builder output`);
      }
      const { locale } = parseLocalePath(expectation.urlPath);
      const app = schemas.find((s) => s['@type'] === 'WebApplication');
      if (app && typeof app.url === 'string' && locale !== 'en' && app.url.includes('/en/')) {
        failures.push(`${expectation.urlPath}: localized JSON-LD URL contains /en/`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('representative routes (all five locales)', () => {
  it('/ — English home', () => {
    const html = docFor('/');
    expect(extractTitle(html)).toBe('MixTally — Construction Calculators & 3D Estimation Tools');
    expect(extract(html, /<html lang="([^"]*)">/)).toBe('en');
    expect(extractRootContent(html)).toContain(translate('en', 'hero.titleLine1'));
    expect(extractRootContent(html)).toContain('href="/privacy"');
    const schemas = extractTaggedJsonLd(html);
    expect(schemas).toHaveLength(1);
    expect(schemas[0]['@type']).toBe('WebSite');
    expect(schemas[0].url).toBe('https://mixtally.com/');
  });

  it('/es/ — Spanish home', () => {
    const html = docFor('/es');
    expect(extractTitle(html)).toBe(
      'MixTally — Calculadoras de construcción y herramientas de estimación 3D',
    );
    expect(extract(html, /<html lang="([^"]*)">/)).toBe('es');
    expect(extractRootContent(html)).toContain(translate('es', 'hero.titleLine1'));
    expect(extractRootContent(html)).toContain('href="/es/privacy"');
    expect(html).not.toContain('href="/en/');
    expect(extractMeta(html, 'property', 'og:url')).toBe('https://mixtally.com/es/');
  });

  it('/pt/privacy — Portuguese legal page', () => {
    const html = docFor('/pt/privacy');
    expect(extractTitle(html)).toBe('Política de privacidade — MixTally');
    expect(extract(html, /<html lang="([^"]*)">/)).toBe('pt-BR');
    expect(extractMeta(html, 'name', 'robots')).toBe('index, follow');
    expect(extractRootContent(html)).toContain(translate('pt', 'privacy.title'));
    expect(extractRootContent(html)).toContain('href="/pt/');
    expect(extractRootContent(html)).not.toContain('href="/privacy"');
    expect(extractTaggedJsonLd(html)).toHaveLength(0);
    expect(extractHreflangs(html)).toEqual([
      { hreflang: 'en', href: 'https://mixtally.com/privacy' },
      { hreflang: 'es', href: 'https://mixtally.com/es/privacy' },
      { hreflang: 'pt', href: 'https://mixtally.com/pt/privacy' },
      { hreflang: 'fr', href: 'https://mixtally.com/fr/privacy' },
      { hreflang: 'de', href: 'https://mixtally.com/de/privacy' },
      { hreflang: 'x-default', href: 'https://mixtally.com/privacy' },
    ]);
  });

  it('/fr/calculators/paint-calculator — French calculator', () => {
    const html = docFor('/fr/calculators/paint-calculator');
    expect(extractTitle(html)).toBe(
      'Calculateur de peinture — Quantité de peinture par pièce | MixTally',
    );
    expect(extract(html, /<html lang="([^"]*)">/)).toBe('fr');
    const root = extractRootContent(html);
    expect(root).toContain(translate('fr', 'nav.paintCalculator'));
    expect(root).toContain('Reset View');
    expect(root).toContain('href="/fr/');
    const schemas = extractTaggedJsonLd(html);
    expect(schemas.map((s) => s['@type'])).toEqual(['WebApplication', 'BreadcrumbList']);
    expect(schemas[0].url).toBe('https://mixtally.com/fr/calculators/paint-calculator');
  });

  it('/de/calculators/concrete-slab-calculator — German 3D calculator', () => {
    const html = docFor('/de/calculators/concrete-slab-calculator');
    expect(extractTitle(html)).toBe(
      'Betonplatten-Rechner — 3D-Volumen & Materialschätzung | MixTally',
    );
    expect(extract(html, /<html lang="([^"]*)">/)).toBe('de');
    const root = extractRootContent(html);
    expect(root).toContain(translate('de', 'nav.concreteSlabCalculator'));
    expect(root).toContain('Reset View');
    expect(root).toContain('href="/de/');
    const schemas = extractTaggedJsonLd(html);
    expect(schemas.map((s) => s['@type'])).toEqual([
      'WebApplication',
      'BreadcrumbList',
      'FAQPage',
    ]);
    const faq = schemas[2] as { mainEntity: unknown[] };
    expect(faq.mainEntity).toHaveLength(3);
    const breadcrumb = schemas[1] as { itemListElement: { item: string }[] };
    expect(breadcrumb.itemListElement[2].item).toBe(
      'https://mixtally.com/de/calculators/concrete-slab-calculator',
    );
  });

  it('/calculators/brick-mortar-calculator — English 3D calculator', () => {
    const html = docFor('/calculators/brick-mortar-calculator');
    expect(extractTitle(html)).toBe('Brick Calculator — Bricks & Mortar Estimate | MixTally');
    expect(extract(html, /<html lang="([^"]*)">/)).toBe('en');
    const root = extractRootContent(html);
    expect(root).toContain(translate('en', 'brick.h1'));
    expect(root).toContain('Reset View');
    expect(root).toContain('href="/privacy"');
    const schemas = extractTaggedJsonLd(html);
    expect(schemas.map((s) => s['@type'])).toEqual([
      'WebApplication',
      'BreadcrumbList',
      'FAQPage',
    ]);
    const faq = schemas[2] as { mainEntity: unknown[] };
    expect(faq.mainEntity).toHaveLength(BRICK_FAQ.length);
  });
});

describe('locale-home documents use the trailing-slash URL everywhere', () => {
  const HOMES = ['es', 'pt', 'fr', 'de'] as const;

  it('matches canonical, og:url, hreflang and sitemap for every locale home document', () => {
    const sitemapUrls = new Set(sitemapEntries().map((entry) => entry.url));
    const failures: string[] = [];
    for (const locale of HOMES) {
      const html = docFor(`/${locale}`);
      const canonical = unescapeHtml(
        extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/) ?? '',
      );
      const ogUrl = unescapeHtml(extractMeta(html, 'property', 'og:url') ?? '');
      const expected = `https://mixtally.com/${locale}/`;
      const selfAlternate = extractHreflangs(html).find((h) => h.hreflang === locale)?.href;

      if (canonical !== expected) failures.push(`${locale}: canonical ${canonical}`);
      if (ogUrl !== expected) failures.push(`${locale}: og:url ${ogUrl}`);
      if (selfAlternate !== expected) failures.push(`${locale}: hreflang ${selfAlternate}`);
      if (!sitemapUrls.has(expected)) failures.push(`${locale}: sitemap missing ${expected}`);
      if (canonical.includes(`/en/`)) failures.push(`${locale}: /en/ leaked`);
    }
    // English root stays slash-only; its sitemap entry matches too.
    const enHtml = docFor('/');
    const enCanonical = unescapeHtml(extract(enHtml, /<link\s+rel="canonical"\s+href="([^"]*)"/) ?? '');
    if (enCanonical !== 'https://mixtally.com/') failures.push(`en: canonical ${enCanonical}`);
    if (!sitemapUrls.has('https://mixtally.com/')) failures.push('en: sitemap missing root');
    expect(failures).toEqual([]);
  });

  it('keeps non-home localized URLs slash-free in generated documents', () => {
    const html = docFor('/es/privacy');
    expect(unescapeHtml(extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/) ?? '')).toBe(
      'https://mixtally.com/es/privacy',
    );
    expect(extractMeta(html, 'property', 'og:url')).toBe('https://mixtally.com/es/privacy');
  });
});

describe('genuine 404 document (404.html)', () => {
  const notFoundHtml = () => readFileSync(path.join(outDirA, '404.html'), 'utf8');

  it('carries the noindex 404 SEO entry with no canonical, hreflang or og:url', () => {
    const html = notFoundHtml();
    expect(extractTitle(html)).toBe('Page Not Found — MixTally');
    expect(extract(html, /<html lang="([^"]*)">/)).toBe('en');
    expect(extractMeta(html, 'name', 'robots')).toBe('noindex, nofollow');
    expect(extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/)).toBeNull();
    expect(extractMeta(html, 'property', 'og:url')).toBeNull();
    expect(extractHreflangs(html)).toEqual([]);
    expect(countMatches(html, /<title>/g)).toBe(1);
    expect(countMatches(html, /<meta\s+name="description"\s+content=/g)).toBe(1);
    expect(countMatches(html, /<meta\s+name="robots"\s+content=/g)).toBe(1);
    expect(countMatches(html, /<meta\s+property="og:/g)).toBe(4);
    expect(countMatches(html, /<meta\s+name="twitter:/g)).toBe(3);
    expect(
      countMatches(html, /<script type="application\/ld\+json" data-mixtally-ld="true">/g),
    ).toBe(0);
  });

  it('preserves the application boot script and a real NotFound body', () => {
    const html = notFoundHtml();
    expect(html).toMatch(/<script type="module"[^>]*src="\/assets\/index-[^"]+\.js"/);
    expect(html).toMatch(/<link rel="stylesheet"[^>]*href="\/assets\/index-[^"]+\.css"/);
    const root = extractRootContent(html);
    expect(root).toContain('<h1');
    expect(root.length).toBeGreaterThan(1_000);
  });

  it('is byte-identical across repeated generation', () => {
    const tmp = mkdtempSync(path.join(tmpdir(), 'mixtally-404-'));
    try {
      // urlPaths: [] renders only the 404 document — a fast, isolated repeat.
      prerender({ templateHtml: fixtureTemplate, outDir: tmp, render, urlPaths: [] });
      const a = readFileSync(path.join(outDirA, '404.html'));
      const b = readFileSync(path.join(tmp, '404.html'));
      expect(a.equals(b)).toBe(true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});

describe('deterministic generation', () => {
  it('produces byte-identical files across repeated generation', () => {
    const second = prerender({ templateHtml: fixtureTemplate, outDir: outDirB, render });
    expect(second.count).toBe(65);
    expect(second.notFoundFile).toBe('404.html');

    const failures: string[] = [];
    for (const expectation of expectations) {
      const a = readFileSync(path.join(outDirA, ...expectation.outputPath.split('/')));
      const b = readFileSync(path.join(outDirB, ...expectation.outputPath.split('/')));
      if (!a.equals(b)) failures.push(`${expectation.urlPath}: bytes differ between runs`);
    }
    expect(failures).toEqual([]);
  }, 240_000);
});

describe('single-route document builder', () => {
  it('is deterministic for repeated calls', () => {
    const body = render('/pt/privacy');
    const one = buildDocument(fixtureTemplate, '/pt/privacy', body);
    const two = buildDocument(fixtureTemplate, '/pt/privacy', body);
    expect(one).toBe(two);
  });

  it('refuses templates without an empty root div', () => {
    const broken = fixtureTemplate.replace('<div id="root"></div>', '<div id="root">x</div>');
    expect(() => buildDocument(broken, '/', '<p>y</p>')).toThrow(/root/);
  });
});
