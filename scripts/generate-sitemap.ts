import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSitemapXml, sitemapEntries } from '../src/lib/sitemap';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public', 'sitemap.xml');

writeFileSync(target, buildSitemapXml(), 'utf8');
console.log(`sitemap.xml: wrote ${sitemapEntries().length} URLs to public/sitemap.xml`);
