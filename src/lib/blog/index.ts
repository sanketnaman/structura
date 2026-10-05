/**
 * Blog content module — single entry point for routes, lookups, SEO and
 * structured data derived from the article registry.
 *
 * Import from here in components and from the individual modules in
 * `src/lib/seo.ts` / `src/lib/sitemap.ts` to keep dependency edges acyclic.
 */

export * from './types';
export * from './registry';
export {
  articleSeoTitle,
  resolveArticleRouteSEO,
} from './seo';
export {
  buildArticleSchemas,
  buildBlogListingSchemas,
} from './structuredData';
