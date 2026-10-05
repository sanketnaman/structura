import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';
import { localizePath } from '../../lib/i18n/routing';
import type { LocaleCode } from '../../lib/i18n/config';
import { articleBasePath } from '../../lib/blog/registry';
import type { ArticleDefinition } from '../../lib/blog/types';
import { CATEGORY_LABEL_KEYS } from './CategoryFilter';

/**
 * Month names and field order are held explicitly instead of going through
 * `Intl.DateTimeFormat`, so a Node build and a browser always render the same
 * string for the same date — no ICU-version drift between prerendered HTML and
 * hydrated output.
 */
const MONTHS: Record<LocaleCode, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
};

/** Day-first ordering for every locale except English. */
const DAY_FIRST: Record<LocaleCode, boolean> = {
  en: false,
  es: true,
  pt: true,
  fr: true,
  de: true,
};

/** Deterministic localized rendering of an ISO `YYYY-MM-DD` date. */
export function formatArticleDate(iso: string, locale: LocaleCode): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;

  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const month = MONTHS[locale]?.[monthIndex] ?? MONTHS.en[monthIndex];
  const dayText = String(day);

  return DAY_FIRST[locale] ? `${dayText} ${month} ${year}` : `${month} ${dayText}, ${year}`;
}

interface ArticleCardProps {
  article: ArticleDefinition;
  /** Renders the wide lead treatment used at the top of the listing. */
  featured?: boolean;
}

/** Listing card for one article: image, category, date, excerpt and link. */
export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const { t, locale } = useLocale();
  const href = localizePath(locale, articleBasePath(article.slug));
  const published = formatArticleDate(article.publishedAt, locale);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-tech-lg border border-paper-300 dark:border-charcoal-750 bg-white dark:bg-charcoal-850 shadow-tech-card transition-colors hover:border-accent/60">
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block overflow-hidden bg-paper-200 dark:bg-charcoal-900 ${
          featured ? 'h-56 sm:h-72' : 'h-44'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/45 via-transparent to-transparent z-10" />
        <img
          src={article.image.src}
          alt=""
          width={article.image.width}
          height={article.image.height}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
          className="h-full w-full object-cover transition-transform duration-500"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-micro font-mono uppercase tracking-wider">
          <span className="text-accent">{t(CATEGORY_LABEL_KEYS[article.category])}</span>
          <span className="text-slate-500 dark:text-slate-400">{published}</span>
          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            {t('blog.readingTime', { minutes: article.readingTimeMinutes })}
          </span>
        </div>

        <h2
          className={
            featured
              ? 'text-heading-lg font-bold text-slate-900 dark:text-white'
              : 'text-heading-md font-bold text-slate-900 dark:text-white'
          }
        >
          <Link to={href} className="hover:text-accent transition-colors">
            {article.title}
          </Link>
        </h2>

        <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
          {article.excerpt}
        </p>

        <Link
          to={href}
          className="mt-auto inline-flex items-center gap-1.5 pt-1 text-caption font-mono text-accent hover:underline"
        >
          {t('blog.readArticle')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
