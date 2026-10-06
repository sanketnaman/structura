import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { sitemapEntries } from '../src/lib/sitemap';
import { localizedArticleMirrorPaths } from '../src/lib/blog/registry';
import { buildSeoHeadSpec, getRouteSEO } from '../src/lib/seo';
import { buildStructuredDataSchemas } from '../src/lib/structuredData';
import { localizePath, parseLocalePath } from '../src/lib/i18n/routing';

/**
 * Static prerender pipeline core (Phase 4H-2).
 *
 * Pure and importable: tests inject a `render` function and a template, the
 * CLI (prerender-cli.ts) supplies the built SSR bundle and dist/index.html.
 * Every route document is assembled exclusively from the shared builders —
 * buildSeoHeadSpec() for head metadata and buildStructuredDataSchemas() for
 * JSON-LD — so build-time HTML can never drift from the client effects.
 */

/** One file written for one route. */
export interface PrerenderFile {
  /** Route pathname, e.g. `/pt/privacy`. */
  urlPath: string;
  /** Path relative to the output directory, e.g. `pt/privacy.html`. */
  outputPath: string;
  bytes: number;
}

export interface PrerenderResult {
  files: PrerenderFile[];
  count: number;
  /** Path (relative to outDir) of the generated genuine-404 document. */
  notFoundFile: string;
}

export interface PrerenderOptions {
  /** HTML template — the built dist/index.html in production. */
  templateHtml: string;
  /** Absolute output directory (dist in production, temp dirs in tests). */
  outDir: string;
  /** Server renderer, normally the built SSR bundle's `render(url)`. */
  render: (urlPath: string) => string;
  /** Route paths to render; defaults to the sitemap URLs (plus any article mirror not yet in it). */
  urlPaths?: string[];
}

/**
 * Flat Cloudflare-compatible output path for a route.
 *
 *   /                                        -> index.html
 *   /calculators                             -> calculators.html
 *   /es  and  /es/                           -> es/index.html   (locale roots are directories)
 *   /es/calculators/concrete-slab-calculator -> es/calculators/concrete-slab-calculator.html
 *   /pt/privacy                              -> pt/privacy.html
 *
 * Throws for non-absolute paths, any `/en/` route (never generated) and
 * unsafe segments (`.`, `..`, empty, or anything outside [A-Za-z0-9._-]),
 * so no input can ever escape the output directory.
 */
export function outputPathFor(urlPath: string): string {
  const withoutHash = urlPath.split('#')[0];
  const pathname = withoutHash.split('?')[0];

  if (!pathname.startsWith('/')) {
    throw new Error(`Prerender path must be absolute: "${urlPath}"`);
  }

  const rawFirstSegment = pathname.split('/').filter(Boolean)[0];
  if (rawFirstSegment === 'en') {
    throw new Error(`Never generate /en/ routes: "${urlPath}"`);
  }

  const { locale, basePath } = parseLocalePath(pathname);
  const routePath = localizePath(locale, basePath);
  const segments = routePath.split('/').filter(Boolean);

  for (const segment of segments) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(segment)) {
      throw new Error(`Unsafe path segment "${segment}" in "${urlPath}"`);
    }
  }

  if (basePath === '/') {
    // Locale roots (including the English root) become directory indexes.
    return segments.length === 0 ? 'index.html' : `${segments.join('/')}/index.html`;
  }
  return `${segments.join('/')}.html`;
}

/**
 * Resolves a relative output path inside `outDir` and hard-fails if the
 * result would fall outside it — defense in depth behind outputPathFor().
 */
export function resolveOutputPath(outDir: string, relativePath: string): string {
  const root = path.resolve(outDir);
  const absolute = path.resolve(root, relativePath);
  if (absolute !== root && !absolute.startsWith(root + path.sep)) {
    throw new Error(`Prerender output path escapes output directory: "${relativePath}"`);
  }
  return absolute;
}

/** Escapes a value for use inside a double-quoted HTML attribute. */
function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

/** Escapes a value for use as HTML text content. */
function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Unescapes the entities produced by escapeText()/escapeAttr() and React SSR. */
export function unescapeHtml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * Serializes JSON-LD for a <script> body. `<`, `>` and `&` become unicode
 * escapes so no schema string can ever terminate the script element; the
 * result stays valid JSON (JSON.parse round-trips to the original value).
 */
function jsonForScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Builds one complete prerendered document:
 *
 * 1. Strips every managed tag from the template (title, description,
 *    robots, canonical, all og:*, all twitter:*, all hreflang alternates)
 *    so stale or generic metadata can never survive.
 * 2. Rewrites `<html lang>`.
 * 3. Inserts exactly one route-specific instance of each managed tag plus
 *    the route's JSON-LD (tagged data-mixtally-ld so the client effect
 *    replaces rather than duplicates it), immediately before `</head>`.
 * 4. Fills the empty `<div id="root">` with the server-rendered body.
 *
 * Everything outside those slots (GA4, icons, fetch patch, Vite asset
 * tags, the site-level JSON-LD from index.html) passes through untouched.
 */
export function buildDocument(templateHtml: string, urlPath: string, bodyHtml: string): string {
  const spec = buildSeoHeadSpec(getRouteSEO(urlPath));
  const schemas = buildStructuredDataSchemas(urlPath);

  // 1. Remove all managed tags.
  let html = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<meta(?=[^>]*\sname="(?:description|robots|twitter:[^"]+)")[^>]*>/gi, '')
    .replace(/<meta(?=[^>]*\sproperty="og:[^"]+")[^>]*>/gi, '')
    .replace(/<link(?=[^>]*\srel="canonical")[^>]*>/gi, '')
    .replace(/<link(?=[^>]*\shreflang="[^"]*")[^>]*>/gi, '');

  // 2. <html lang>.
  if (!/<html lang="[^"]*">/.test(html)) {
    throw new Error('HTML template is missing <html lang="...">');
  }
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${escapeAttr(spec.htmlLang)}">`);

  // 3. Route-specific head tags, exactly one of each.
  const headTags: string[] = [
    `<title>${escapeText(spec.title)}</title>`,
    `<meta name="description" content="${escapeAttr(spec.description)}">`,
    `<meta name="robots" content="${escapeAttr(spec.robots)}">`,
  ];
  if (spec.canonicalUrl !== undefined) {
    headTags.push(`<link rel="canonical" href="${escapeAttr(spec.canonicalUrl)}">`);
  }
  headTags.push(`<meta property="og:title" content="${escapeAttr(spec.og.title)}">`);
  headTags.push(`<meta property="og:description" content="${escapeAttr(spec.og.description)}">`);
  headTags.push(`<meta property="og:type" content="${escapeAttr(spec.og.type)}">`);
  headTags.push(`<meta property="og:site_name" content="${escapeAttr(spec.og.siteName)}">`);
  if (spec.og.url !== undefined) {
    headTags.push(`<meta property="og:url" content="${escapeAttr(spec.og.url)}">`);
  }
  if (spec.og.image !== undefined) {
    headTags.push(`<meta property="og:image" content="${escapeAttr(spec.og.image.url)}">`);
    headTags.push(`<meta property="og:image:width" content="${escapeAttr(String(spec.og.image.width))}">`);
    headTags.push(`<meta property="og:image:height" content="${escapeAttr(String(spec.og.image.height))}">`);
    headTags.push(`<meta property="og:image:alt" content="${escapeAttr(spec.og.image.alt)}">`);
  }
  headTags.push(`<meta name="twitter:card" content="${escapeAttr(spec.twitter.card)}">`);
  headTags.push(`<meta name="twitter:title" content="${escapeAttr(spec.twitter.title)}">`);
  headTags.push(`<meta name="twitter:description" content="${escapeAttr(spec.twitter.description)}">`);
  if (spec.twitter.image !== undefined) {
    headTags.push(`<meta name="twitter:image" content="${escapeAttr(spec.twitter.image.url)}">`);
    headTags.push(`<meta name="twitter:image:alt" content="${escapeAttr(spec.twitter.image.alt)}">`);
  }
  for (const alternate of spec.hreflangs) {
    headTags.push(
      `<link rel="alternate" hreflang="${escapeAttr(alternate.hreflang)}" href="${escapeAttr(alternate.href)}">`,
    );
  }
  for (const schema of schemas) {
    headTags.push(
      `<script type="application/ld+json" data-mixtally-ld="true">${jsonForScript(schema)}</script>`,
    );
  }

  const headEnd = html.lastIndexOf('</head>');
  if (headEnd === -1) {
    throw new Error('HTML template is missing </head>');
  }
  html = `${html.slice(0, headEnd)}    ${headTags.join('\n    ')}\n  ${html.slice(headEnd)}`;

  // 4. Route body into the empty root.
  if (!/<div id="root"><\/div>/.test(html)) {
    throw new Error('HTML template root <div id="root"> is missing or not empty');
  }
  return html.replace(/<div id="root"><\/div>/, () => `<div id="root">${bodyHtml}</div>`);
}

/** Default route list: every sitemap URL plus any localized article mirror. */
export function defaultPrerenderPaths(): string[] {
  const sitemapPaths = sitemapEntries().map((entry) => new URL(entry.url).pathname);
  // Fully translated articles are already in the sitemap, so this loop is a
  // no-op for them. It still guarantees that every localized article mirror
  // exists as a real document — a language switch must never land on a 404,
  // even if a translation set were ever incomplete.
  const seen = new Set(sitemapPaths);
  for (const mirror of localizedArticleMirrorPaths()) {
    if (!seen.has(mirror)) {
      seen.add(mirror);
      sitemapPaths.push(mirror);
    }
  }
  return sitemapPaths;
}

/**
 * Cloudflare `not_found_handling: "404-page"` serves `404.html` from the
 * asset directory with a genuine HTTP 404 for any unknown path. The document
 * is prerendered from an unknown pathname so it carries the noindex 404
 * SEO entry (no canonical, hreflang or og:url) with the app boot script
 * intact for client-side takeover.
 */
export const NOT_FOUND_URL_PATH = '/404';
export const NOT_FOUND_OUTPUT = '404.html';

/**
 * Renders every route, writes one HTML file per route into outDir, plus the
 * dedicated `404.html` document Cloudflare serves for unknown paths under
 * `not_found_handling: "404-page"` (noindex, no canonical/hreflang/og:url,
 * boot script intact so the client NotFound page can take over).
 * Throws on duplicate output paths, unsafe paths or renderer errors so a
 * partial or colliding build can never pass silently.
 */
export function prerender(options: PrerenderOptions): PrerenderResult {
  const urlPaths = options.urlPaths ?? defaultPrerenderPaths();
  const seen = new Set<string>();
  const files: PrerenderFile[] = [];

  for (const urlPath of urlPaths) {
    const relative = outputPathFor(urlPath);
    if (seen.has(relative)) {
      throw new Error(`Duplicate prerender output path "${relative}" for "${urlPath}"`);
    }
    seen.add(relative);

    let bodyHtml: string;
    try {
      bodyHtml = options.render(urlPath);
    } catch (error) {
      throw new Error(`Server render failed for "${urlPath}": ${(error as Error).message}`);
    }

    const document = buildDocument(options.templateHtml, urlPath, bodyHtml);
    const absolute = resolveOutputPath(options.outDir, relative);
    mkdirSync(path.dirname(absolute), { recursive: true });
    writeFileSync(absolute, document, 'utf8');

    files.push({ urlPath, outputPath: relative, bytes: Buffer.byteLength(document, 'utf8') });
  }

  // Genuine 404 document — an unknown path resolves the noindex 404 SEO
  // entry (no canonical, no hreflang, no og:url) and renders Error404Page.
  if (seen.has(NOT_FOUND_OUTPUT)) {
    throw new Error(`404 document path "${NOT_FOUND_OUTPUT}" collides with a prerendered route`);
  }
  let notFoundBody: string;
  try {
    notFoundBody = options.render(NOT_FOUND_URL_PATH);
  } catch (error) {
    throw new Error(`Server render failed for "${NOT_FOUND_URL_PATH}": ${(error as Error).message}`);
  }
  const notFoundDocument = buildDocument(options.templateHtml, NOT_FOUND_URL_PATH, notFoundBody);
  writeFileSync(resolveOutputPath(options.outDir, NOT_FOUND_OUTPUT), notFoundDocument, 'utf8');

  return { files, count: files.length, notFoundFile: NOT_FOUND_OUTPUT };
}
