import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOL_REGISTRY, CATEGORIES } from '../../lib/tools/registry';
import { useViewToPath } from '../../lib/routes';
import {
  Box,
  Layers,
  PaintBucket,
  ArrowRight,
  Calculator,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { AdSlot } from '../common/AdSlot';
import { useLocale } from '../../lib/i18n/context';
import { useToolText, categoryKey } from '../../lib/i18n/toolText';

export const CalculatorsDirectoryPage: React.FC = () => {
  const { t } = useLocale();
  const viewToPath = useViewToPath();
  const toolText = useToolText();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Show ONLY production-ready implemented calculators
  const implementedTools = TOOL_REGISTRY.filter((tool) => tool.implemented);
  const activeCategories = CATEGORIES.filter((cat) =>
    implementedTools.some((t) => t.category === cat.id)
  );

  const filteredTools = implementedTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      toolText(tool.slug, 'name', tool.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      toolText(tool.slug, 'description', tool.description)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 py-2">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>{t('directory.eyebrow')}</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          {t('directory.title')}
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t('directory.body')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-micro font-medium">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-tech transition-colors ${
              selectedCategory === 'all'
                ? 'bg-accent text-white font-semibold'
                : 'bg-paper-200 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 hover:bg-paper-300 dark:hover:bg-charcoal-700'
            }`}
          >
            {t('directory.allCalculators', { count: implementedTools.length })}
          </button>
          {activeCategories.map((cat) => {
            const count = implementedTools.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-tech transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-paper-200 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 hover:bg-paper-300 dark:hover:bg-charcoal-700'
                }`}
              >
                {t(categoryKey(cat.id, 'label'))} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <input
            type="text"
            placeholder={t('directory.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-body-sm tech-focus"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          return (
            <Link
              key={tool.slug}
              to={viewToPath(tool.slug)}
              className="group rounded-tech-lg overflow-hidden bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 hover:border-accent dark:hover:border-accent shadow-tech-card hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between"
            >
              {tool.image && (
                <div className="relative h-36 bg-paper-200 dark:bg-charcoal-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/45 via-transparent to-transparent z-10" />
                  <img
                    src={tool.image}
                    alt={tool.imageAlt ?? tool.name}
                    width={900}
                    height={600}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-tech bg-amber-50 dark:bg-amber-950/50 text-accent flex items-center justify-center border border-amber-200/50 dark:border-amber-800/40">
                    {tool.iconName === 'Box' && <Box className="w-5 h-5" />}
                    {tool.iconName === 'Layers' && <Layers className="w-5 h-5" />}
                    {tool.iconName === 'PaintBucket' && <PaintBucket className="w-5 h-5" />}
                    {tool.iconName !== 'Box' &&
                      tool.iconName !== 'Layers' &&
                      tool.iconName !== 'PaintBucket' && <Calculator className="w-5 h-5" />}
                  </div>

                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('directory.productionReady')}</span>
                  </span>
                </div>

                <div className="text-micro font-mono text-accent uppercase tracking-wider mb-1">
                  {toolText(tool.slug, 'categoryLabel', tool.categoryLabel)}
                </div>
                <h2 className="text-heading-md font-bold text-slate-900 dark:text-white mb-2">
                  {toolText(tool.slug, 'name', tool.name)}
                </h2>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {toolText(tool.slug, 'description', tool.description)}
                </p>
                </div>

                <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-medium">
                  <span className="text-micro font-mono text-slate-500 uppercase">
                    {t(`viz.${tool.visualizationType}` as Parameters<typeof t>[0])}
                  </span>
                  <span className="text-accent flex items-center gap-1 font-semibold">
                    {t('directory.launchWorkspace')} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="directory-footer-ad" />
    </div>
  );
};
