import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { prerender } from './prerender';

/**
 * Prerender CLI (Phase 4H-2). Runs as the final step of `npm run build`
 * via the `postbuild` hook:
 *
 *   sitemap -> vite build (client) -> vite build --ssr (entry) -> this
 *
 * Loads the built SSR bundle from node_modules/.cache/mixtally-ssr and the
 * HTML template from dist/index.html, then writes one static HTML file per
 * sitemap route into dist. Kept separate from prerender.ts so importing
 * the pure pipeline from tests never triggers a CLI run.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist');
const templatePath = path.join(outDir, 'index.html');
const ssrDir = path.join(root, 'node_modules', '.cache', 'mixtally-ssr');

function findSsrEntry(): string {
  if (!existsSync(ssrDir)) {
    throw new Error(
      `SSR bundle directory not found at ${path.relative(root, ssrDir)} — run \`npm run build:ssr\` first.`,
    );
  }
  const entry = readdirSync(ssrDir).find((name) => /^entry-server\.(js|mjs|cjs)$/.test(name));
  if (!entry) {
    throw new Error('SSR bundle entry-server.(js|mjs|cjs) not found — run `npm run build:ssr` first.');
  }
  return path.join(ssrDir, entry);
}

if (!existsSync(templatePath)) {
  throw new Error(
    `Template ${path.relative(root, templatePath)} not found — run \`npm run build\` (client build) first.`,
  );
}

const templateHtml = readFileSync(templatePath, 'utf8');
const ssrEntry = findSsrEntry();
const bundle = (await import(pathToFileURL(ssrEntry).href)) as {
  render: (urlPath: string) => string;
};

if (typeof bundle.render !== 'function') {
  throw new Error(`SSR bundle at ${ssrEntry} does not export render(url).`);
}

const result = prerender({ templateHtml, outDir, render: bundle.render });
const notFoundBytes = Buffer.byteLength(
  readFileSync(path.join(outDir, result.notFoundFile), 'utf8'),
  'utf8',
);
const totalBytes = result.files.reduce((sum, file) => sum + file.bytes, 0) + notFoundBytes;
console.log(
  `prerender: wrote ${result.count} route files + ${result.notFoundFile} (${(totalBytes / 1024).toFixed(0)} kB) to dist/`,
);
