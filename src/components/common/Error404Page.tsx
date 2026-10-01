import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, Home, Calculator } from 'lucide-react';
import { useViewToPath } from '../../lib/routes';
import { useLocale } from '../../lib/i18n/context';

export const Error404Page: React.FC = () => {
  const { t } = useLocale();
  const viewToPath = useViewToPath();

  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 text-accent flex items-center justify-center mx-auto border border-amber-500/20">
        <Construction className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-micro font-mono text-accent uppercase tracking-wider">
          {t('notFound.eyebrow')}
        </span>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('notFound.title')}
        </h1>
        <p className="text-caption sm:text-body text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {t('notFound.body')}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to={viewToPath('overview')}
          className="px-4 py-2 rounded-tech bg-accent text-white text-caption font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>{t('notFound.returnOverview')}</span>
        </Link>

        <Link
          to={viewToPath('calculators')}
          className="px-4 py-2 rounded-tech border border-paper-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-slate-800 dark:text-slate-200 text-caption font-medium hover:bg-paper-100 dark:hover:bg-charcoal-800 transition-colors flex items-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          <span>{t('notFound.browseDirectory')}</span>
        </Link>
      </div>
    </div>
  );
};
