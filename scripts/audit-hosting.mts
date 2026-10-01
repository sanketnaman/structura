/**
 * HTTP audit for the prerendered static site served by `wrangler dev`.
 *
 * Run (server must already be up):
 *   npx tsx scripts/audit-hosting.mts [baseURL]
 * Default baseURL: http://127.0.0.1:8787
 *
 * Verifies against the SAME pure builders the prerender pipeline uses:
 *   1. All sitemap routes -> 200 with exact locale content + SEO metadata.
 *   2. Locale-root redirects -> 307 to the slash form, final URL === canonical === sitemap.
 *   3. Flat deep path slash-strip redirect.
 *   4. Unknown route/asset -> genuine HTTP 404 (route body noindexed, asset not HTML).
 *   5. Real built assets, robots.txt, sitemap.xml -> 200.
 *
 * Exits 1 when any check fails; prints exact URLs + evidence for each failure.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSeoHeadSpec, getRouteSEO } from '../src/lib/seo';
import { buildStructuredDataSchemas } from '../src/lib/structuredData';
import { sitemapEntries } from '../src/lib/sitemap';
import { translate } from '../src/lib/i18n/translate';

const BASE = (process.argv[2] ?? 'http://127.0.0.1:8787').replace(/\/$/, '');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const failures: string[] = [];
let checks = 0;
const fail = (where: string, detail: string) => failures.push(`${where}: ${detail}`);
const ok = () => {
  checks += 1;
};

const extract = (html: string, re: RegExp): string | null => html.match(re)?.[1] ?? null;
const unescape = (value: string): string =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const count = (html: string, re: RegExp): number => (html.match(re) ?? []).length;
const meta = (html: string, attr: 'name' | 'property', key: string): string | null => {
  const raw = extract(html, new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`));
  return raw === null ? null : unescape(raw);
};
const hreflangs = (html: string): { hreflang: string; href: string }[] =>
  [...html.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/g)].map((m) => ({
    hreflang: m[1],
    href: unescape(m[2]),
  }));

type Probe = { status: number; location: string | null; type: string | null; body: string };
async function fetchRaw(url: string, manualRedirect = false): Promise<Probe> {
  const res = await fetch(`${BASE}${url}`, {
    redirect: manualRedirect ? 'manual' : 'follow',
  });
  return {
    status: res.status,
    location: res.headers.get('location'),
    type: res.headers.get('content-type'),
    body: await res.text(),
  };
}

const canonicalRe = /<link rel="canonical" href="([^"]*)"/;

async function auditRoutes(): Promise<void> {
  const entries = sitemapEntries();
  console.log(`\n== 65-route audit against ${BASE} (${entries.length} sitemap URLs) ==`);
  for (const entry of entries) {
    const spec = buildSeoHeadSpec(getRouteSEO(new URL(entry.url).pathname));
    const urlPath = new URL(entry.url).pathname;
    let res: Probe;
    try {
      res = await fetchRaw(urlPath);
    } catch (error) {
      fail(urlPath, `request failed: ${String(error)}`);
      continue;
    }
    if (res.status !== 200) {
      fail(urlPath, `expected 200, got ${res.status}`);
      continue;
    }
    const html = res.body;
    const ctx = () => `GET ${urlPath}`;

    if (html.length < 10_000) fail(ctx(), `suspiciously small HTML (${html.length} B) — not prerendered?`);

    const lang = extract(html, /<html lang="([^"]*)">/);
    if (lang !== spec.htmlLang) fail(ctx(), `lang ${lang} !== ${spec.htmlLang}`);

    const title = unescape(extract(html, /<title>([^<]*)<\/title>/) ?? '');
    if (title !== spec.title) fail(ctx(), `title "${title}" !== "${spec.title}"`);

    const desc = meta(html, 'name', 'description');
    if (desc !== spec.description) fail(ctx(), 'meta description mismatch');

    const robots = meta(html, 'name', 'robots');
    if (robots !== spec.robots) fail(ctx(), `robots "${robots}" !== "${spec.robots}"`);

    const canonical = extract(html, canonicalRe);
    const expectedCanonical = spec.canonicalUrl ? unescape(spec.canonicalUrl) : null;
    if (canonical !== expectedCanonical)
      fail(ctx(), `canonical ${canonical} !== ${expectedCanonical}`);

    const ogUrl = meta(html, 'property', 'og:url');
    const expectedOg = spec.og.url ? unescape(spec.og.url) : null;
    if (ogUrl !== expectedOg) fail(ctx(), `og:url ${ogUrl} !== ${expectedOg}`);

    if (unescape(title) !== meta(html, 'property', 'og:title'))
      fail(ctx(), 'og:title !== <title>');
    if (desc !== meta(html, 'property', 'og:description')) fail(ctx(), 'og:description mismatch');

    const actualHrefs = JSON.stringify(
      hreflangs(html).sort((a, b) => a.hreflang.localeCompare(b.hreflang)),
    );
    const expectedHrefs = JSON.stringify(
      [...spec.hreflangs].sort((a, b) => a.hreflang.localeCompare(b.hreflang)),
    );
    if (actualHrefs !== expectedHrefs)
      fail(ctx(), `hreflang set mismatch (${hreflangs(html).length} entries)`);

    if (canonical !== entry.url)
      fail(ctx(), `canonical ${canonical} !== sitemap ${entry.url}`);

    if (count(html, /<title>/g) !== 1) fail(ctx(), `title count ${count(html, /<title>/g)}`);
    if (count(html, /<link rel="canonical"/g) !== (expectedCanonical ? 1 : 0))
      fail(ctx(), 'canonical count !== expected');
    if (count(html, /<meta name="robots"/g) !== 1) fail(ctx(), 'robots count !== 1');
    // og:title, og:description, og:type, og:site_name, og:url
    if (count(html, /<meta property="og:/g) !== 5) fail(ctx(), 'og count !== 5');
    if (count(html, /<meta name="twitter:/g) !== 3) fail(ctx(), 'twitter count !== 3');
    const expectedSchemas = buildStructuredDataSchemas(urlPath);
    const actualScripts = [
      ...html.matchAll(
        /<script type="application\/ld\+json" data-mixtally-ld="true">([\s\S]*?)<\/script>/g,
      ),
    ];
    if (actualScripts.length !== expectedSchemas.length)
      fail(
        ctx(),
        `builder JSON-LD script count ${actualScripts.length} !== expected ${expectedSchemas.length}`,
      );
    if (!/<script type="module"[^>]*src="\/assets\/index-[^"]+\.js"/.test(html))
      fail(ctx(), 'client boot script missing');

    const actualSchemas = actualScripts.map((m) => JSON.parse(m[1]));
    if (JSON.stringify(actualSchemas) !== JSON.stringify(expectedSchemas))
      fail(
        ctx(),
        `JSON-LD mismatch: got [${actualSchemas
          .map((s) => (s as { '@type'?: string })['@type'])
          .join(', ')}] expected [${expectedSchemas
          .map((s) => (s as { '@type'?: string })['@type'])
          .join(', ')}]`,
      );

    if (entry.locale !== 'en') {
      const marker = translate(entry.locale, 'nav.architecturalPaint');
      if (!html.includes(marker))
        fail(ctx(), `locale content marker missing: "${marker}"`);
      if (!html.includes(`href="/${entry.locale}/`))
        fail(ctx(), `missing /${entry.locale}/ internal links`);
    } else if (!html.includes('MixTally')) {
      fail(ctx(), 'English content marker missing');
    }

    ok();
  }
}

async function auditLocaleRoots(): Promise<void> {
  console.log('== locale-root redirect consistency ==');
  for (const locale of ['es', 'pt', 'fr', 'de']) {
    const bare = `/${locale}`;
    const slash = `/${locale}/`;
    const expected = `https://mixtally.com${slash}`;

    const res = await fetchRaw(bare, true);
    if (res.status !== 307) fail(bare, `expected 307, got ${res.status}`);
    else if (!res.location?.endsWith(slash))
      fail(bare, `Location "${res.location}" does not end with ${slash}`);
    else ok();

    const final = await fetchRaw(slash);
    if (final.status !== 200) fail(slash, `expected 200, got ${final.status}`);
    const canonical = extract(final.body, canonicalRe);
    if (canonical !== expected) fail(slash, `canonical ${canonical} !== ${expected}`);
    const hreflangSelf = hreflangs(final.body).find((h) => h.hreflang === locale)?.href;
    if (hreflangSelf !== expected) fail(slash, `hreflang self ${hreflangSelf} !== ${expected}`);
    if (meta(final.body, 'property', 'og:url') !== expected)
      fail(slash, `og:url ${meta(final.body, 'property', 'og:url')} !== ${expected}`);
    ok();
  }

  const root = await fetchRaw('/');
  if (root.status !== 200) fail('/', `expected 200, got ${root.status}`);
  const rootCanonical = extract(root.body, canonicalRe);
  if (rootCanonical !== 'https://mixtally.com/')
    fail('/', `canonical ${rootCanonical} !== https://mixtally.com/`);
  ok();

  // Flat deep path: slash form is stripped, canonical stays slash-free.
  const stripped = await fetchRaw('/privacy/', true);
  if (stripped.status !== 307) fail('/privacy/', `expected 307, got ${stripped.status}`);
  else if (!stripped.location?.endsWith('/privacy'))
    fail('/privacy/', `Location "${stripped.location}" does not end with /privacy`);
  else ok();
}

async function audit404s(): Promise<void> {
  console.log('== genuine HTTP 404 ==');
  const route404 = await fetchRaw('/this-route-does-not-exist');
  if (route404.status !== 404)
    fail('/this-route-does-not-exist', `expected 404, got ${route404.status}`);
  const body = route404.body;
  if (meta(body, 'name', 'robots') !== 'noindex, nofollow')
    fail('/this-route-does-not-exist', `robots "${meta(body, 'name', 'robots')}" — not noindex`);
  if (extract(body, canonicalRe) !== null)
    fail('/this-route-does-not-exist', '404 body must not have a canonical');
  if (hreflangs(body).length !== 0)
    fail('/this-route-does-not-exist', '404 body must not have hreflang alternates');
  if (meta(body, 'property', 'og:url') !== null)
    fail('/this-route-does-not-exist', '404 body must not have og:url');
  if (!unescape(extract(body, /<title>([^<]*)<\/title>/) ?? '').includes('Page Not Found'))
    fail('/this-route-does-not-exist', '404 title is not "Page Not Found …"');
  if (count(body, /<title>/g) !== 1)
    fail('/this-route-does-not-exist', `title count ${count(body, /<title>/g)}`);
  if (count(body, /<meta property="og:/g) !== 4)
    fail('/this-route-does-not-exist', `og count ${count(body, /<meta property="og:/g)} !== 4`);
  ok();

  const localized404 = await fetchRaw('/es/nope');
  if (localized404.status !== 404) fail('/es/nope', `expected 404, got ${localized404.status}`);
  else ok();

  // Workerd's `404-page` handler serves our noindexed 404 document for
  // unmatched asset paths too — genuine 404 status, noindex body.
  for (const assetPath of ['/assets/missing-xyz.js', '/missing.css']) {
    const asset404 = await fetchRaw(assetPath);
    if (asset404.status !== 404) {
      fail(assetPath, `expected 404, got ${asset404.status}`);
      continue;
    }
    if (meta(asset404.body, 'name', 'robots') !== 'noindex, nofollow')
      fail(assetPath, `404 body robots "${meta(asset404.body, 'name', 'robots')}" — not our noindex 404 page`);
    else if (!asset404.body.includes('Page Not Found'))
      fail(assetPath, '404 body is not the Page Not Found document');
    else ok();
  }

  console.log(
    `   evidence: unknown route -> ${route404.status} (${
      meta(body, 'name', 'robots') ?? 'no robots'
    }, canonical=${extract(body, canonicalRe) ?? 'absent'}, og=${
      count(body, /<meta property="og:/g)
    } tags, hreflang=${hreflangs(body).length}), ` +
      'unknown assets -> 404 with the same noindex 404 document',
  );
}

async function auditStaticFiles(): Promise<void> {
  console.log('== static files ==');
  const res = await fetchRaw('/sitemap.xml');
  if (res.status !== 200) fail('/sitemap.xml', `expected 200, got ${res.status}`);
  const locs = [...res.body.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  const expected = sitemapEntries().map((e) => e.url);
  const missing = expected.filter((u) => !locs.includes(u));
  const extra = locs.filter((u) => !expected.includes(u));
  if (missing.length) fail('/sitemap.xml', `missing locs: ${missing.join(', ')}`);
  if (extra.length) fail('/sitemap.xml', `unexpected locs: ${extra.join(', ')}`);
  if (locs.length !== 65) fail('/sitemap.xml', `${locs.length} locs !== 65`);
  ok();

  const robots = await fetchRaw('/robots.txt');
  if (robots.status !== 200) fail('/robots.txt', `expected 200, got ${robots.status}`);
  else if (!robots.body.includes('Sitemap: https://mixtally.com/sitemap.xml'))
    fail('/robots.txt', 'Sitemap directive missing');
  else ok();

  const assetsDir = path.join(ROOT, 'dist', 'assets');
  const assetFiles = readdirSync(assetsDir).filter((f) => /\.(js|css)$/.test(f));
  for (const file of assetFiles.slice(0, 4)) {
    const asset = await fetchRaw(`/assets/${file}`);
    if (asset.status !== 200) fail(`/assets/${file}`, `expected 200, got ${asset.status}`);
    else if (!asset.type || asset.type === 'text/html')
      fail(`/assets/${file}`, `bad content-type ${asset.type}`);
    else ok();
  }
  console.log(`   probed ${Math.min(4, assetFiles.length)} real assets: ${assetFiles.slice(0, 4).join(', ')}`);
}

async function main(): Promise<void> {
  console.log(`audit-hosting: base=${BASE}`);
  const t0 = Date.now();
  await auditRoutes();
  await auditLocaleRoots();
  await audit404s();
  await auditStaticFiles();

  console.log(
    `\nRESULT: ${checks} checks passed, ${failures.length} failed (${(
      (Date.now() - t0) /
      1000
    ).toFixed(1)}s)`,
  );
  for (const failure of failures) console.log(`  FAIL ${failure}`);
  process.exit(failures.length ? 1 : 0);
}

await main();
