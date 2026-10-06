import type { LocaleCode } from '../i18n/config';
import { localizePath } from '../i18n/routing';
import type { HreflangAlternate, RouteSEO } from '../seo';
import {
  articleBasePath,
  articleSlugFromBasePath,
  getArticleBySlug,
  resolveArticleForLocale,
} from './registry';
import type { ArticleDefinition } from './types';

/**
 * Article SEO resolution.
 *
 * Every article is published in English, Spanish, Portuguese, French and
 * German, so each language version is a genuine alternation of the others and
 * the head tags say exactly what the body delivers:
 *
 *  - the canonical is self-referencing in the URL locale — `/blog/<slug>` for
 *    English, `/es/blog/<slug>` for Spanish, and so on;
 *  - the title, description and social text come from the localized copy, so
 *    `<title>` and `og:description` match the rendered language;
 *  - `alternates` carries the full reciprocal hreflang cluster (`en`, `es`,
 *    `pt`, `fr`, `de` plus `x-default` → English). It is assembled by
 *    `buildArticleHreflangAlternates` in `lib/seo.ts` and passed in here, so
 *    this module keeps a type-only dependency on `../seo` and introduces no
 *    runtime import cycle with the SEO registry.
 */

/** `<title>` for an article — brand suffix matches the existing site style. */
export function articleSeoTitle(article: ArticleDefinition): string {
  return `${article.title} — MixTally`;
}

/**
 * Resolves SEO metadata for an article base path in `locale`.
 *
 * Returns `null` for unknown or malformed slugs so the caller can fall back
 * to the existing noindex 404 entry.
 */
export function resolveArticleRouteSEO(
  basePath: string,
  locale: LocaleCode,
  alternates: HreflangAlternate[] = [],
): RouteSEO | null {
  const slug = articleSlugFromBasePath(basePath);
  if (!slug) return null;

  const english = getArticleBySlug(slug);
  if (!english) return null;

  const article = resolveArticleForLocale(english, locale);

  return {
    title: articleSeoTitle(article),
    description: article.description,
    // Self-referencing localized path: each language version is its own
    // canonical, which is what makes the hreflang cluster reciprocal.
    canonicalPath: localizePath(locale, articleBasePath(article.slug)),
    noindex: false,
    locale,
    alternates,
    image: {
      src: article.ogImage.src,
      width: article.ogImage.width,
      height: article.ogImage.height,
      alt: article.ogImage.alt,
    },
    ogType: 'article',
  };
}
