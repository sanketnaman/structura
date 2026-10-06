import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { AdSlot } from '../common/AdSlot';
import { useLocale } from '../../lib/i18n/context';
import { useViewToPath } from '../../lib/routes';
import { getArticlesByCategory } from '../../lib/blog/registry';
import { isArticleCategory } from '../../lib/blog/types';
import { ArticleCard } from './ArticleCard';
import { CategoryFilter } from './CategoryFilter';

/**
 * Blog listing at `/blog` and its localized variants.
 *
 * Filtering is URL-driven: `?category=…` selects the subset, an unknown value
 * falls back to the unfiltered listing, and the links are real anchors so the
 * filtered URLs are crawlable without JavaScript. Prerendered `blog.html` is
 * built without a query string, which means the no-JS document always shows
 * every article.
 */
export const BlogListingPage: React.FC = () => {
  const { t, urlLocale } = useLocale();
  const viewToPath = useViewToPath();
  const [searchParams] = useSearchParams();

  const requested = searchParams.get('category');
  const category = isArticleCategory(requested) ? requested : null;
  const articles = getArticlesByCategory(category, urlLocale);
  const [lead, ...rest] = articles;

  return (
    <article className="max-w-5xl mx-auto space-y-8 py-2 text-slate-800 dark:text-slate-200">
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>{t('blog.eyebrow')}</span>
        </div>
        <h1 className="text-display font-bold text-slate-900 dark:text-white">
          {t('blog.title')}
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t('blog.intro')}
        </p>
      </div>

      <CategoryFilter value={category} />

      {articles.length === 0 ? (
        <div className="rounded-tech-lg border border-paper-300 dark:border-charcoal-750 bg-white dark:bg-charcoal-850 p-8 space-y-3 text-center">
          <h2 className="text-heading-md font-bold text-slate-900 dark:text-white">
            {t('blog.emptyTitle')}
          </h2>
          <p className="text-caption text-slate-600 dark:text-slate-400">{t('blog.emptyBody')}</p>
          <Link
            to={viewToPath('blog')}
            className="inline-flex items-center gap-1.5 text-caption font-mono text-accent hover:underline"
          >
            {t('blog.backToListing')}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ArticleCard article={lead} featured />
          {rest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      <AdSlot slotId="blog-listing-ad" />
    </article>
  );
};
