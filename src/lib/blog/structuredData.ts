import { type LocaleCode } from '../i18n/config';
import { translate } from '../i18n/translate';
import { localizePath } from '../i18n/routing';
import { absoluteSiteUrl } from '../seo';
import { siteConfig } from '../config/site';
import { articleBasePath, articleSlugFromBasePath, getArticleBySlug } from './registry';

/**
 * JSON-LD builders for blog routes.
 *
 * Consumed by the runtime `<StructuredData>` effect and serialized verbatim
 * into prerendered HTML by `scripts/prerender.ts`, so both paths always emit
 * identical schemas.
 *
 * Article pages emit exactly two schemas: `Article` and `BreadcrumbList`.
 * `mainEntityOfPage` always points at the canonical English article URL,
 * including on localized mirrors, which keeps one entity per article.
 */

function siteUrl(locale: LocaleCode, target: string): string {
  return absoluteSiteUrl(localizePath(locale, target));
}

/** `BreadcrumbList` for the blog listing: Home → Blog. */
export function buildBlogListingSchemas(locale: LocaleCode): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: translate(locale, 'common.home'), item: siteUrl(locale, '/') },
        { '@type': 'ListItem', position: 2, name: translate(locale, 'blog.breadcrumbBlog'), item: siteUrl(locale, '/blog') },
      ],
    },
  ];
}

/**
 * `Article` + `BreadcrumbList` for a single article, or `[]` when the base
 * path does not resolve to a published article.
 */
export function buildArticleSchemas(
  basePath: string,
  locale: LocaleCode,
): Record<string, unknown>[] {
  const slug = articleSlugFromBasePath(basePath);
  if (!slug) return [];

  const article = getArticleBySlug(slug);
  if (!article) return [];

  const canonicalUrl = absoluteSiteUrl(articleBasePath(article.slug));
  const dateModified = article.updatedAt ?? article.publishedAt;

  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: {
      '@type': 'ImageObject',
      url: absoluteSiteUrl(article.ogImage.src),
      width: article.ogImage.width,
      height: article.ogImage.height,
    },
    datePublished: article.publishedAt,
    dateModified,
    // The platform is the truthful, supportable identity — no fabricated
    // person, byline or professional credentials are ever published.
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domain,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domain,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const breadcrumbSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: translate(locale, 'common.home'), item: siteUrl(locale, '/') },
      { '@type': 'ListItem', position: 2, name: translate(locale, 'blog.breadcrumbBlog'), item: siteUrl(locale, '/blog') },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl },
    ],
  };

  return [articleSchema, breadcrumbSchema];
}
