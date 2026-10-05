import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../lib/i18n/context';
import { localizePath } from '../../lib/i18n/routing';
import type { TranslationKey } from '../../lib/i18n/dictionaries';
import { ARTICLE_CATEGORIES, type ArticleCategory } from '../../lib/blog/types';

/** Translation key per category, kept explicit so the union stays type-safe. */
export const CATEGORY_LABEL_KEYS: Record<ArticleCategory, TranslationKey> = {
  concrete: 'blog.category.concrete',
  masonry: 'blog.category.masonry',
  paint: 'blog.category.paint',
  estimation: 'blog.category.estimation',
};

interface CategoryFilterProps {
  /** Currently applied category, or null for the unfiltered listing. */
  value: ArticleCategory | null;
}

/**
 * Crawlable category filter: every option is a real anchor to
 * `/blog?category=…` (or `/blog` for "All"), so filtered listings are
 * reachable without JavaScript. The query string is read by the listing page;
 * this component only renders and highlights the links.
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = ({ value }) => {
  const { t, locale } = useLocale();
  const blogPath = localizePath(locale, '/blog');

  const options: { label: string; category: ArticleCategory | null }[] = [
    { label: t('blog.filterAll'), category: null },
    ...ARTICLE_CATEGORIES.map((category) => ({
      label: t(CATEGORY_LABEL_KEYS[category]),
      category,
    })),
  ];

  return (
    <nav aria-label={t('blog.filterNav')}>
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.category === value;
          const to =
            option.category === null ? blogPath : `${blogPath}?category=${option.category}`;

          return (
            <li key={option.category ?? 'all'}>
              <Link
                to={to}
                aria-current={isActive ? 'true' : undefined}
                className={`inline-flex items-center rounded-tech border px-3 py-1.5 text-micro font-mono uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'border-accent bg-accent text-white'
                    : 'border-paper-300 dark:border-charcoal-750 bg-white dark:bg-charcoal-850 text-slate-600 dark:text-slate-400 hover:border-accent hover:text-accent'
                }`}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
