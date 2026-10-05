import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';
import { useViewToPath } from '../../lib/routes';
import type { TranslationKey } from '../../lib/i18n/dictionaries';
import { getRelatedArticles } from '../../lib/blog/registry';
import type { ArticleDefinition, ArticleHeadingBlock } from '../../lib/blog/types';
import { ArticleProse } from './ArticleProse';
import { ArticleCard, formatArticleDate } from './ArticleCard';
import { Breadcrumbs } from './Breadcrumbs';
import { CATEGORY_LABEL_KEYS } from './CategoryFilter';

/** Calculator display names for the related-tools rail. */
const VIEW_LABEL_KEYS: Record<string, TranslationKey> = {
  'concrete-slab-calculator': 'nav.concreteSlabCalculator',
  'brick-mortar-calculator': 'nav.brickMortarCalculator',
  'paint-calculator': 'nav.paintCalculator',
};

interface ArticleLayoutProps {
  article: ArticleDefinition;
}

/**
 * Full article page composition: breadcrumbs, English article body inside a
 * `lang="en"` element, a localized table-of-contents rail and the related
 * content section beneath.
 *
 * The `lang` boundary is deliberate. `<html lang>` follows the URL locale
 * (the page chrome — breadcrumbs, TOC title, related headings — really is
 * translated), while the article itself is English-only, which is exactly the
 * pattern HTML prescribes for localized pages carrying English content.
 */
export const ArticleLayout: React.FC<ArticleLayoutProps> = ({ article }) => {
  const { t, locale } = useLocale();
  const viewToPath = useViewToPath();

  const tocItems = article.blocks.filter(
    (block): block is ArticleHeadingBlock => block.type === 'heading' && block.level === 2,
  );
  const relatedArticles = getRelatedArticles(article);
  const published = formatArticleDate(article.publishedAt, locale);
  const updated = article.updatedAt ? formatArticleDate(article.updatedAt, locale) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      <Breadcrumbs
        items={[
          { label: t('common.home'), to: viewToPath('overview') },
          { label: t('blog.breadcrumbBlog'), to: viewToPath('blog') },
          { label: article.title },
        ]}
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12 lg:items-start">
        <article lang="en" className="min-w-0 space-y-8">
          <header className="space-y-4 border-b border-paper-300 dark:border-charcoal-750 pb-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-micro font-mono uppercase tracking-wider">
              <span className="text-accent">{t(CATEGORY_LABEL_KEYS[article.category])}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {t('blog.publishedLabel')} {published}
              </span>
              {updated && (
                <span className="text-slate-500 dark:text-slate-400">
                  {t('blog.updatedLabel')} {updated}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                {t('blog.readingTime', { minutes: article.readingTimeMinutes })}
              </span>
            </div>

            <h1 className="text-display font-bold text-slate-900 dark:text-white">
              {article.title}
            </h1>

            <p className="text-body text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {article.description}
            </p>
          </header>

          <figure className="py-2">
            <div className="relative rounded-tech-lg overflow-hidden border border-paper-300 dark:border-charcoal-750 bg-paper-200 dark:bg-charcoal-900 shadow-tech-card">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent z-10" />
              <img
                src={article.image.src}
                alt={article.image.alt}
                width={article.image.width}
                height={article.image.height}
                decoding="async"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
                className="block w-full h-auto"
              />
            </div>
          </figure>

          <ArticleProse blocks={article.blocks} />
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24">
          {tocItems.length > 0 && (
            <nav aria-labelledby="article-toc-title" className="space-y-3">
              <h2
                id="article-toc-title"
                className="text-micro font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                {t('blog.tocTitle')}
              </h2>
              <ul className="space-y-2 border-l border-paper-300 dark:border-charcoal-750">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block border-l-2 border-transparent -ml-px pl-3 py-0.5 text-caption text-slate-600 dark:text-slate-400 hover:border-accent hover:text-accent transition-colors"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <Link
            to={viewToPath('blog')}
            className="inline-flex items-center gap-1.5 text-caption font-mono text-accent hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('blog.backToListing')}
          </Link>
        </aside>
      </div>

      {(relatedArticles.length > 0 || article.relatedCalculatorViews.length > 0) && (
        <section className="border-t border-paper-300 dark:border-charcoal-750 pt-8 space-y-5">
          {relatedArticles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-heading-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                {t('blog.relatedArticles')}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.slug} article={related} />
                ))}
              </div>
            </div>
          )}

          {article.relatedCalculatorViews.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
                {t('common.relatedCalculators')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {article.relatedCalculatorViews.map((view) => (
                  <Link
                    key={view}
                    to={viewToPath(view)}
                    className="inline-flex items-center gap-1.5 rounded-tech border border-paper-300 dark:border-charcoal-750 bg-white dark:bg-charcoal-850 px-4 py-2 text-caption font-medium text-slate-700 dark:text-slate-300 hover:border-accent hover:text-accent transition-colors"
                  >
                    {t(VIEW_LABEL_KEYS[view] ?? 'nav.calculators')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
