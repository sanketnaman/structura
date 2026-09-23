import React, { useState } from 'react';
import { TOOL_REGISTRY, CATEGORIES } from '../../lib/tools/registry';
import {
  Box,
  Layers,
  PaintBucket,
  ArrowRight,
  Calculator,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AdSlot } from '../common/AdSlot';

interface CalculatorsDirectoryPageProps {
  onNavigateToTool: (toolSlug: string) => void;
}

export const CalculatorsDirectoryPage: React.FC<CalculatorsDirectoryPageProps> = ({
  onNavigateToTool,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOL_REGISTRY.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 py-2">
      {/* Header */}
      <div className="border-b border-paper-300 dark:border-charcoal-750 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>Complete Engineering Index</span>
        </div>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Construction Calculator Directory
        </h1>
        <p className="text-body text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Explore production 3D estimators and engineering takeoff tools organized by trade discipline.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-micro font-medium">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-tech transition-colors ${
              selectedCategory === 'all'
                ? 'bg-accent text-white font-semibold'
                : 'bg-paper-200 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 hover:bg-paper-300 dark:hover:bg-charcoal-700'
            }`}
          >
            All Calculators ({TOOL_REGISTRY.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = TOOL_REGISTRY.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-tech transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-paper-200 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 hover:bg-paper-300 dark:hover:bg-charcoal-700'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <input
            type="text"
            placeholder="Search by material or trade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-body-sm tech-focus"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          return (
            <div
              key={tool.slug}
              className={`p-6 rounded-tech-lg border transition-all duration-200 flex flex-col justify-between ${
                tool.implemented
                  ? 'bg-white dark:bg-charcoal-850 border-paper-300 dark:border-charcoal-750 hover:border-accent dark:hover:border-accent shadow-tech-card hover:-translate-y-0.5 cursor-pointer'
                  : 'bg-paper-100/70 dark:bg-charcoal-900/40 border-paper-300/80 dark:border-charcoal-800/80 opacity-80'
              }`}
              onClick={() => {
                if (tool.implemented) {
                  onNavigateToTool(tool.slug);
                }
              }}
            >
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

                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded flex items-center gap-1 ${
                      tool.implemented
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'bg-paper-200 dark:bg-charcoal-800 text-slate-500'
                    }`}
                  >
                    {tool.implemented ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Production Active</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Roadmap (Phase {tool.phase})</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="text-micro font-mono text-accent uppercase tracking-wider mb-1">
                  {tool.categoryLabel}
                </div>
                <h2 className="text-heading-md font-bold text-slate-900 dark:text-white mb-2">
                  {tool.name}
                </h2>
                <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>

              <div className="pt-4 border-t border-paper-200 dark:border-charcoal-800 flex items-center justify-between text-caption font-medium">
                {tool.implemented ? (
                  <>
                    <span className="text-micro font-mono text-slate-500">
                      {tool.visualizationType.toUpperCase()}
                    </span>
                    <span className="text-accent flex items-center gap-1">
                      Launch Workspace <ArrowRight className="w-4 h-4" />
                    </span>
                  </>
                ) : (
                  <span className="text-micro text-slate-400 italic">
                    In development — specifications drafted
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-intrusive AdSlot */}
      <AdSlot slotId="directory-footer-ad" />
    </div>
  );
};
