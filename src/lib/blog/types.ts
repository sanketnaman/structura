/**
 * Central type registry for MixTally blog content.
 *
 * Blog articles are plain data: one `ArticleDefinition` entry per article in
 * `registry.ts` is all that is needed to publish a new URL. The listing page,
 * the article layout, the SEO head builder, the JSON-LD builder, the sitemap
 * and the prerender pipeline all read from this single shape, so content and
 * presentation can never drift apart.
 *
 * Article content is authored in English on the top level of the definition
 * and mirrored in full under `localized` for es/pt/fr/de. Interface chrome
 * around it (navigation, breadcrumbs, category labels, reading time,
 * related-section headings) is localized through the existing i18n
 * dictionary — article copy itself never lives there.
 *
 * The URL locale selects the matching `localized` entry through
 * `resolveArticleForLocale()`; English is always the fallback source.
 */

import type { LocaleCode } from '../i18n/config';

/** Categories available on the blog listing filter. */
export const ARTICLE_CATEGORIES = ['concrete', 'masonry', 'paint', 'estimation'] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export function isArticleCategory(value: unknown): value is ArticleCategory {
  return (
    typeof value === 'string' && (ARTICLE_CATEGORIES as readonly string[]).includes(value)
  );
}

/**
 * Locales an article body can be authored in besides English. English never
 * appears here — it always lives on the top level of `ArticleDefinition`.
 */
export type ArticleLocale = Exclude<LocaleCode, 'en'>;

/** Every non-English article locale, in registry order. */
export const ARTICLE_LOCALES: readonly ArticleLocale[] = ['es', 'pt', 'fr', 'de'];

/** Local image reference with intrinsic dimensions (no lazy CLS). */
export interface ArticleImage {
  /** Root-relative path under `public/`, e.g. `/images/blog/slab.webp`. */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ArticleHeadingBlock {
  type: 'heading';
  /** Only H2 participates in the table of contents. */
  level: 2 | 3;
  /** Stable anchor id — must be unique within the article. */
  id: string;
  text: string;
}

export interface ArticleParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface ArticleListBlock {
  type: 'list';
  ordered?: boolean;
  items: string[];
}

export interface ArticleFormulaBlock {
  type: 'formula';
  /** Plain-text expression rendered in the monospace formula style. */
  expression: string;
  note?: string;
}

export interface ArticleFigureBlock {
  type: 'figure';
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface ArticleCalloutBlock {
  type: 'callout';
  tone: 'note' | 'warning';
  title: string;
  body: string;
}

export interface ArticleTableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface ArticleCalculatorCtaBlock {
  type: 'calculator-cta';
  /** Legacy calculator view slug resolved through `viewToPath()`. */
  view: string;
  title: string;
  body: string;
}

export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export interface ArticleFaqBlock {
  type: 'faq';
  items: ArticleFaqItem[];
}

export type ArticleBlock =
  | ArticleHeadingBlock
  | ArticleParagraphBlock
  | ArticleListBlock
  | ArticleFormulaBlock
  | ArticleFigureBlock
  | ArticleCalloutBlock
  | ArticleTableBlock
  | ArticleCalculatorCtaBlock
  | ArticleFaqBlock;

export interface ArticleDefinition {
  /** URL segment under `/blog/`. ASCII, lowercase, hyphen-separated. */
  slug: string;
  category: ArticleCategory;
  /** Exact H1 text and the basis of the SEO title. */
  title: string;
  /** Meta description, kept at or below ~160 characters. */
  description: string;
  /** Short copy shown on listing cards. */
  excerpt: string;
  /** ISO calendar date (`YYYY-MM-DD`). Never derived from the build clock. */
  publishedAt: string;
  /** ISO calendar date of the last substantive revision. */
  updatedAt?: string;
  readingTimeMinutes: number;
  /** 900x600 (3:2) featured image rendered at the top of the article. */
  image: ArticleImage;
  /** Social share image. Falls back to `image` until a dedicated asset exists. */
  ogImage: ArticleImage;
  blocks: ArticleBlock[];
  /** Calculator view slugs surfaced as crawlable in-article CTAs. */
  relatedCalculatorViews: string[];
  relatedArticleSlugs: string[];
  /** Rendered first on the listing page. */
  featured?: boolean;
  /**
   * Complete translated content per non-English locale. Metadata that does
   * not vary by language (slug, category, dates, images, related references)
   * stays on the English definition and is inherited by every translation;
   * only the image alt text is localized, through `imageAlt`/`ogImageAlt`.
   *
   * All four locales are required by registry validation so the hreflang
   * cluster can never be published partially.
   */
  localized?: Partial<Record<ArticleLocale, ArticleTranslation>>;
}

/**
 * One complete translation of an article body.
 *
 * `blocks` must mirror the English block list one-to-one: same block types
 * in the same order, same heading `id`s (so table-of-contents anchors and
 * the shared section structure stay identical across locales), same
 * formulas, figures, tables and numerical values — only the human-readable
 * copy differs.
 */
export interface ArticleTranslation {
  title: string;
  description: string;
  excerpt: string;
  blocks: ArticleBlock[];
  /** Overrides the English reading time when a locale needs its own figure. */
  readingTimeMinutes?: number;
  /**
   * Localized alt text for the featured image. Image assets, dimensions and
   * paths stay shared with English — only the descriptive text is translated
   * so localized pages never ship English accessibility copy.
   */
  imageAlt?: string;
  /** Localized alt text for the social share image (`og:image:alt`). */
  ogImageAlt?: string;
}
