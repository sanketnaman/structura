import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../lib/i18n/context';

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page — it renders as non-link text. */
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Trailing-slash-free breadcrumb trail. The last item renders with
 * `aria-current="page"` and no link so it can never point at itself.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { t } = useLocale();

  return (
    <nav aria-label={t('common.breadcrumb')}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
                  /
                </span>
              )}
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-accent transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-slate-700 dark:text-slate-300"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
