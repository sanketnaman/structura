import type { LocaleCode } from '../i18n/config';
import type { RouteSEO } from '../seo';
import { articleBasePath, articleSlugFromBasePath, getArticleBySlug } from './registry';
import type { ArticleDefinition } from './types';

/**
 * Article SEO resolution.
 *
 * Article bodies are authored in English only. Declaring `/es/blog/<slug>`
 * as the Spanish alternation of `/blog/<slug>` would assert language parity
 * that does not exist, so article pages deliberately emit **no hreflang
 * alternates at all**:
 *
 *  - `/blog/<slug>` self-canonicalizes in every locale.
 *  - `/xx/blog/<slug>` renders the English article with localized interface
 *    chrome, canonicalizes to the English URL, and emits no hreflang.
 *  - `<html lang>` still follows the URL locale while the article element
 *    carries `lang="en"`, which is the correct HTML pattern for localized
 *    chrome wrapping English content.
 *
 * Only `import type` is used from `../seo` here, so this module introduces no
 * runtime import cycle with the SEO registry.
 */

/** `<title>` for an article — brand suffix matches the existing site style. */
export function articleSeoTitle(article: ArticleDefinition): string {
  return `${article.title} — MixTally`;
}

/**
 * Resolves SEO metadata for an article base path.
 *
 * Returns `null` for unknown or malformed slugs so the caller can fall back
 * to the existing noindex 404 entry.
 */
export function resolveArticleRouteSEO(
  basePath: string,
  locale: LocaleCode,
): RouteSEO | null {
  const slug = articleSlugFromBasePath(basePath);
  if (!slug) return null;

  const article = getArticleBySlug(slug);
  if (!article) return null;

  return {
    title: articleSeoTitle(article),
    description: article.description,
    // Always the unprefixed English path: the localized mirrors are not
    // independent language versions and must not claim to be.
    canonicalPath: articleBasePath(article.slug),
    noindex: false,
    locale,
    alternates: [],
    image: {
      src: article.ogImage.src,
      width: article.ogImage.width,
      height: article.ogImage.height,
      alt: article.ogImage.alt,
    },
    ogType: 'article',
  };
}
