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
  hasFullArticleTranslationSet,
  isArticleBasePath,
  localizedArticleMirrorPaths,
  localizedArticleRoutePatterns,
  resolveArticleForLocale,
} from '../src/lib/blog/registry';
import {
  ARTICLE_CATEGORIES,
  ARTICLE_LOCALES,
  isArticleCategory,
  type ArticleBlock,
  type ArticleDefinition,
  type ArticleHeadingBlock,
} from '../src/lib/blog/types';
import { articleSeoTitle, resolveArticleRouteSEO } from '../src/lib/blog/seo';
import { getRouteSEO } from '../src/lib/seo';
import { localizePath } from '../src/lib/i18n/routing';
import { siteConfig } from '../src/lib/config/site';

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

describe('Article translations', () => {
  it('ships a complete translation set for every article', () => {
    for (const entry of ARTICLE_REGISTRY) {
      expect(hasFullArticleTranslationSet(entry), entry.slug).toBe(true);
      for (const locale of ARTICLE_LOCALES) {
        expect(entry.localized?.[locale], `${entry.slug}/${locale}`).toBeDefined();
      }
    }
  });

  it('returns the registry object untouched for English', () => {
    for (const entry of ARTICLE_REGISTRY) {
      expect(resolveArticleForLocale(entry, 'en')).toBe(entry);
      expect(getArticles('en')).toContain(entry);
    }
  });

  it('renders translated copy for every non-English locale', () => {
    for (const entry of ARTICLE_REGISTRY) {
      for (const locale of ARTICLE_LOCALES) {
        const resolved = resolveArticleForLocale(entry, locale);
        const translation = entry.localized![locale]!;
        expect(resolved.title, `${entry.slug}/${locale}`).toBe(translation.title);
        expect(resolved.description).toBe(translation.description);
        expect(resolved.excerpt).toBe(translation.excerpt);
        expect(resolved.blocks).toBe(translation.blocks);
        // Language-invariant fields always stay on the English definition.
        expect(resolved.slug).toBe(entry.slug);
        expect(resolved.category).toBe(entry.category);
        expect(resolved.publishedAt).toBe(entry.publishedAt);
        expect(resolved.image.src).toBe(entry.image.src);
        expect(resolved.image.width).toBe(entry.image.width);
        expect(resolved.image.height).toBe(entry.image.height);
        expect(resolved.ogImage.src).toBe(entry.ogImage.src);
        // Only the descriptive alt text is localized, never the asset itself.
        expect(resolved.image.alt).toBe(translation.imageAlt ?? '');
        expect(resolved.ogImage.alt).toBe(translation.ogImageAlt ?? '');
        expect(resolved.image.alt.length).toBeGreaterThan(0);
        expect(resolved.image.alt).not.toBe(entry.image.alt);
        // The copy is genuinely translated, never an English duplicate.
        expect(resolved.title).not.toBe(entry.title);
      }
    }
  });

  it('localizes figure alt text while keeping the shared image assets', () => {
    type FigureBlock = Extract<ArticleBlock, { type: 'figure' }>;
    const figuresOf = (blocks: ArticleBlock[]) =>
      blocks.filter((block): block is FigureBlock => block.type === 'figure');

    for (const entry of ARTICLE_REGISTRY) {
      const english = figuresOf(entry.blocks);
      for (const locale of ARTICLE_LOCALES) {
        const scope = `${entry.slug}/${locale}`;
        const figures = figuresOf(entry.localized![locale]!.blocks);

        expect(figures.map((block) => block.src), scope).toEqual(
          english.map((block) => block.src),
        );
        expect(figures.map((block) => block.width), scope).toEqual(
          english.map((block) => block.width),
        );
        expect(figures.map((block) => block.height), scope).toEqual(
          english.map((block) => block.height),
        );
        english.forEach((figure, index) => {
          expect(figures[index].alt.length, scope).toBeGreaterThan(0);
          expect(figures[index].alt, scope).not.toBe(figure.alt);
        });
      }
    }
  });

  it('keeps translated descriptions at or under 160 characters', () => {
    for (const entry of ARTICLE_REGISTRY) {
      for (const locale of ARTICLE_LOCALES) {
        const { description } = entry.localized![locale]!;
        expect(description.trim().length, `${entry.slug}/${locale}`).toBeGreaterThan(0);
        expect(description.length, `${entry.slug}/${locale}`).toBeLessThanOrEqual(160);
      }
    }
  });

  it('keeps every translation block-for-block identical in shape to English', () => {
    const shape = (blocks: ArticleBlock[]) =>
      blocks.map((block) => (block.type === 'heading' ? `heading:${block.id}` : block.type));

    for (const entry of ARTICLE_REGISTRY) {
      for (const locale of ARTICLE_LOCALES) {
        expect(shape(entry.localized![locale]!.blocks), `${entry.slug}/${locale}`).toEqual(
          shape(entry.blocks),
        );
      }
    }
  });

  it('resolves localized articles through the locale-aware listing helpers', () => {
    for (const locale of ['en', ...ARTICLE_LOCALES] as const) {
      expect(getArticles(locale)).toHaveLength(ARTICLE_REGISTRY.length);
      expect(getFeaturedArticle(locale)).toBeDefined();
      expect(getArticlesByCategory(null, locale)).toHaveLength(ARTICLE_REGISTRY.length);
      const related = getRelatedArticles(ARTICLE_REGISTRY[0], locale);
      expect(related.length).toBeGreaterThan(0);
      for (const entry of related) {
        const source = getArticleBySlug(entry.slug)!;
        expect(entry.title, `${entry.slug}/${locale}`).toBe(
          resolveArticleForLocale(source, locale).title,
        );
      }
    }
  });
});

describe('Article SEO resolution', () => {
  it('self-canonicalizes per locale with the localized copy and full hreflang', () => {
    for (const locale of ['en', 'es', 'pt', 'fr', 'de'] as const) {
      const seo = getRouteSEO(localizePath(locale, articleBasePath(article.slug)));
      const resolved = resolveArticleForLocale(article, locale);

      expect(seo.title, locale).toBe(`${resolved.title} — MixTally`);
      expect(seo.description, locale).toBe(resolved.description);
      expect(seo.canonicalPath, locale).toBe(localizePath(locale, articleBasePath(article.slug)));
      expect(seo.locale, locale).toBe(locale);
      expect(seo.noindex, locale).toBe(false);
      expect(seo.ogType, locale).toBe('article');
      expect(seo.image, locale).toEqual({
        src: resolved.ogImage.src,
        width: resolved.ogImage.width,
        height: resolved.ogImage.height,
        alt: resolved.ogImage.alt,
      });

      expect(seo.alternates.map((entry) => entry.hreflang), locale).toEqual([
        'en',
        'es',
        'pt',
        'fr',
        'de',
        'x-default',
      ]);
      expect(
        seo.alternates.find((entry) => entry.hreflang === locale)?.href,
        locale,
      ).toBe(`${siteConfig.domain}${localizePath(locale, articleBasePath(article.slug))}`);
      expect(seo.alternates.find((entry) => entry.hreflang === 'x-default')?.href, locale).toBe(
        `${siteConfig.domain}${articleBasePath(article.slug)}`,
      );
      for (const alternate of seo.alternates) {
        expect(alternate.href.startsWith(`${siteConfig.domain}/`), alternate.href).toBe(true);
        expect(alternate.href).not.toContain('/en/');
      }
    }
  });

  it('resolves the SEO entry through resolveArticleRouteSEO as well', () => {
    for (const locale of ['en', 'es', 'pt', 'fr', 'de'] as const) {
      const seo = resolveArticleRouteSEO(articleBasePath(article.slug), locale);
      expect(seo, locale).not.toBeNull();
      expect(seo!.locale).toBe(locale);
      expect(seo!.canonicalPath, locale).toBe(
        localizePath(locale, articleBasePath(article.slug)),
      );
      // The hreflang cluster is assembled by lib/seo.ts and passed in, so a
      // standalone call stays free of a runtime import cycle.
      expect(seo!.alternates).toEqual([]);
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
