import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  ARTICLE_BASE_PATHS,
  ARTICLE_REGISTRY,
  articleBasePath,
  articleSlugFromBasePath,
  collectArticleRegistryErrors,
  getArticleBySlug,
  getArticles,
  getArticlesByCategory,
  getFeaturedArticle,
  getRelatedArticles,
  isArticleBasePath,
  localizedArticleMirrorPaths,
  localizedArticleRoutePatterns,
} from '../src/lib/blog/registry';
import {
  ARTICLE_CATEGORIES,
  isArticleCategory,
  type ArticleBlock,
  type ArticleDefinition,
  type ArticleHeadingBlock,
} from '../src/lib/blog/types';
import { articleSeoTitle, resolveArticleRouteSEO } from '../src/lib/blog/seo';

const article = ARTICLE_REGISTRY[0];
const requiredSectionIds = [
  'when-you-need-the-volume',
  'volume-formula',
  'measuring',
  'unit-conversion',
  'imperial-example',
  'metric-example',
  'unit-conversions',
  'ordering-allowance',
  'common-mistakes',
  'faq',
  'calculator-cta',
];

function collectBlocks(blocks: ArticleBlock[], type: ArticleBlock['type']): ArticleBlock[] {
  return blocks.filter((block) => block.type === type);
}

function countWords(definition: ArticleDefinition): number {
  const texts: string[] = [definition.title, definition.description, definition.excerpt];
  for (const block of definition.blocks) {
    switch (block.type) {
      case 'paragraph':
        texts.push(block.text);
        break;
      case 'heading':
        texts.push(block.text);
        break;
      case 'list':
        texts.push(...block.items);
        break;
      case 'formula':
        texts.push(block.expression);
        if (block.note) texts.push(block.note);
        break;
      case 'callout':
        texts.push(block.title, block.body);
        break;
      case 'table':
        texts.push(...block.headers, ...block.rows.flat());
        break;
      case 'calculator-cta':
        texts.push(block.title, block.body);
        break;
      case 'faq':
        for (const item of block.items) texts.push(item.question, item.answer);
        break;
      case 'figure':
        texts.push(block.caption);
        break;
    }
  }
  return texts.join(' ').split(/\s+/).filter(Boolean).length;
}

describe('Blog article registry integrity', () => {
  it('passes its own pure validation with no errors', () => {
    expect(collectArticleRegistryErrors()).toEqual([]);
  });

  it('publishes at least one article with exactly one featured entry', () => {
    expect(ARTICLE_REGISTRY.length).toBeGreaterThanOrEqual(1);
    expect(ARTICLE_REGISTRY.filter((entry) => entry.featured)).toHaveLength(1);
    expect(getFeaturedArticle()).toBeDefined();
    expect(getArticles()).toHaveLength(ARTICLE_REGISTRY.length);
  });

  it('keeps slugs ASCII-lowercase and derivable from their base path', () => {
    for (const entry of ARTICLE_REGISTRY) {
      expect(entry.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      const basePath = articleBasePath(entry.slug);
      expect(isArticleBasePath(basePath)).toBe(true);
      expect(articleSlugFromBasePath(basePath)).toBe(entry.slug);
      expect(isArticleBasePath('/blog')).toBe(false);
      expect(articleSlugFromBasePath('/blog/a/b')).toBeNull();
      expect(getArticleBySlug(entry.slug)).toBe(entry);
    }
  });

  it('keeps the meta description at or under 160 characters', () => {
    for (const entry of ARTICLE_REGISTRY) {
      expect(entry.description.length, entry.slug).toBeLessThanOrEqual(160);
      expect(entry.description.trim().length, entry.slug).toBeGreaterThan(0);
    }
  });

  it('uses the article title verbatim as its SEO title basis', () => {
    expect(articleSeoTitle(article)).toBe(`${article.title} — MixTally`);
  });

  it('covers every required section as an H2 heading anchor', () => {
    const headingIds = article.blocks
      .filter((block): block is ArticleHeadingBlock => block.type === 'heading' && block.level === 2)
      .map((block) => block.id);
    expect(headingIds).toEqual(requiredSectionIds);
    expect(new Set(headingIds).size).toBe(headingIds.length);
  });

  it('ships a body long enough to answer the query it targets', () => {
    const words = countWords(article);
    expect(words).toBeGreaterThanOrEqual(900);
    expect(article.readingTimeMinutes).toBeGreaterThanOrEqual(5);
  });

  it('points only at implemented calculators and resolvable related articles', () => {
    expect(article.relatedCalculatorViews).toContain('concrete-slab-calculator');
    for (const view of article.relatedCalculatorViews) {
      expect(['concrete-slab-calculator', 'brick-mortar-calculator', 'paint-calculator']).toContain(
        view,
      );
    }
    for (const related of getRelatedArticles(article)) {
      expect(related.slug).not.toBe(article.slug);
      expect(getArticleBySlug(related.slug)).toBe(related);
    }
  });

  it('never mixes categories and always exposes all four filter categories', () => {
    expect([...ARTICLE_CATEGORIES]).toEqual(['concrete', 'masonry', 'paint', 'estimation']);
    expect(isArticleCategory('concrete')).toBe(true);
    expect(isArticleCategory('engineering')).toBe(false);
    for (const entry of ARTICLE_REGISTRY) {
      expect(ARTICLE_CATEGORIES).toContain(entry.category);
    }
    expect(getArticlesByCategory(null)).toHaveLength(ARTICLE_REGISTRY.length);
    for (const category of ARTICLE_CATEGORIES) {
      expect(getArticlesByCategory(category).every((entry) => entry.category === category)).toBe(
        true,
      );
    }
    expect(getArticlesByCategory('not-a-category')).toHaveLength(ARTICLE_REGISTRY.length);
  });
});

describe('Blog images are real, local and licensed', () => {
  const publicDir = fileURLToPath(new URL('../public', import.meta.url));

  it('resolves every article and figure image to a file on disk', () => {
    const sources = new Set<string>();
    for (const entry of ARTICLE_REGISTRY) {
      sources.add(entry.image.src);
      sources.add(entry.ogImage.src);
      for (const block of entry.blocks) {
        if (block.type === 'figure') sources.add(block.src);
      }
    }
    expect(sources.size).toBeGreaterThan(0);
    for (const src of sources) {
      expect(src.startsWith('/'), src).toBe(true);
      expect(existsSync(path.join(publicDir, src)), src).toBe(true);
    }
  });

  it('covers each image in the license README beside it', () => {
    const sources = new Set<string>();
    for (const entry of ARTICLE_REGISTRY) {
      sources.add(entry.image.src);
      sources.add(entry.ogImage.src);
      for (const block of entry.blocks) {
        if (block.type === 'figure') sources.add(block.src);
      }
    }
    for (const src of sources) {
      const directory = path.posix.dirname(src);
      const readmePath = fileURLToPath(
        new URL(`../public${directory}/README.md`, import.meta.url),
      );
      expect(existsSync(readmePath), readmePath).toBe(true);
      const readme = readFileSync(readmePath, 'utf8');
      expect(readme, src).toContain(path.posix.basename(src));
    }
  });
});

describe('Blog route derivation', () => {
  it('registers five article route patterns and four localized mirrors per article', () => {
    const patterns = localizedArticleRoutePatterns();
    expect(patterns.map((pattern) => pattern.path)).toEqual([
      '/blog/:slug',
      '/es/blog/:slug',
      '/pt/blog/:slug',
      '/fr/blog/:slug',
      '/de/blog/:slug',
    ]);

    const mirrors = localizedArticleMirrorPaths();
    expect(mirrors).toHaveLength(ARTICLE_BASE_PATHS.length * 4);
    for (const basePath of ARTICLE_BASE_PATHS) {
      expect(mirrors).not.toContain(basePath);
      for (const locale of ['es', 'pt', 'fr', 'de'] as const) {
        expect(mirrors).toContain(`/${locale}${basePath}`);
      }
    }
  });

  it('keeps article base paths under /blog with a single segment', () => {
    for (const basePath of ARTICLE_BASE_PATHS) {
      expect(basePath).toMatch(/^\/blog\/[a-z0-9-]+$/);
      expect(articleSlugFromBasePath(basePath)).toBe(basePath.slice('/blog/'.length));
    }
  });
});

describe('Article SEO resolution', () => {
  it('returns an English-canonical, hreflang-free entry for every locale', () => {
    for (const locale of ['en', 'es', 'pt', 'fr', 'de'] as const) {
      const seo = resolveArticleRouteSEO(articleBasePath(article.slug), locale);
      expect(seo, locale).not.toBeNull();
      expect(seo!.canonicalPath).toBe(articleBasePath(article.slug));
      expect(seo!.alternates).toEqual([]);
      expect(seo!.locale).toBe(locale);
      expect(seo!.noindex).toBe(false);
      expect(seo!.ogType).toBe('article');
      expect(seo!.image).toEqual({
        src: article.ogImage.src,
        width: article.ogImage.width,
        height: article.ogImage.height,
        alt: article.ogImage.alt,
      });
    }
  });

  it('returns null for unknown or malformed slugs', () => {
    expect(resolveArticleRouteSEO('/blog/unknown-article', 'en')).toBeNull();
    expect(resolveArticleRouteSEO('/blog/a/b', 'en')).toBeNull();
    expect(resolveArticleRouteSEO('/blog', 'en')).toBeNull();
  });
});

describe('Block coverage', () => {
  it('exercises every block type the layout must render', () => {
    const types = new Set(article.blocks.map((block) => block.type));
    for (const type of [
      'heading',
      'paragraph',
      'list',
      'formula',
      'figure',
      'callout',
      'table',
      'calculator-cta',
      'faq',
    ]) {
      expect(types.has(type as ArticleBlock['type']), type).toBe(true);
    }
    expect(collectBlocks(article.blocks, 'heading').length).toBeGreaterThanOrEqual(11);
    expect(collectBlocks(article.blocks, 'callout').length).toBeGreaterThanOrEqual(2);
    expect(collectBlocks(article.blocks, 'table').length).toBeGreaterThanOrEqual(1);
  });
});
