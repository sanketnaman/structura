import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Info, TriangleAlert } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';
import { useViewToPath } from '../../lib/routes';
import type { ArticleBlock } from '../../lib/blog/types';

interface ArticleProseProps {
  blocks: ArticleBlock[];
}

/**
 * Renders an article body from its typed block list. The list is already the
 * copy for the active URL locale (resolved before layout), and the surrounding
 * page declares that language on the `<article lang>` element while interface
 * chrome stays localized through the dictionary.
 *
 * Headings render `level`-accurate semantic elements with stable ids so the
 * table of contents can link to them by anchor — ids are identical across
 * locales so shared anchors keep working.
 */
export const ArticleProse: React.FC<ArticleProseProps> = ({ blocks }) => {
  const { t } = useLocale();
  const viewToPath = useViewToPath();

  return (
    <div className="space-y-5 text-body text-slate-700 dark:text-slate-300 leading-relaxed">
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block, t, viewToPath)}</Fragment>
      ))}
    </div>
  );
};

type Translate = ReturnType<typeof useLocale>['t'];
type ViewToPath = (view: string) => string;

function renderBlock(
  block: ArticleBlock,
  t: Translate,
  viewToPath: ViewToPath,
): React.ReactNode {
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? (
        <h2
          id={block.id}
          className="text-heading-lg font-bold text-slate-900 dark:text-white pt-6 scroll-mt-24"
        >
          {block.text}
        </h2>
      ) : (
        <h3
          id={block.id}
          className="text-heading-md font-semibold text-slate-900 dark:text-white pt-4 scroll-mt-24"
        >
          {block.text}
        </h3>
      );

    case 'paragraph':
      return <p>{block.text}</p>;

    case 'list':
      return block.ordered ? (
        <ol className="list-decimal pl-6 space-y-2 marker:text-accent marker:font-mono">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc pl-6 space-y-2 marker:text-accent">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      );

    case 'formula':
      return (
        <div className="space-y-1.5">
          <div className="rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 px-4 py-3 font-mono text-body-sm text-slate-900 dark:text-white overflow-x-auto">
            {block.expression}
          </div>
          {block.note && (
            <p className="text-caption text-slate-500 dark:text-slate-400">{block.note}</p>
          )}
        </div>
      );

    case 'figure':
      return (
        <figure className="py-6">
          <div className="relative rounded-tech overflow-hidden border border-paper-300 dark:border-charcoal-750 bg-paper-200 dark:bg-charcoal-900">
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/35 via-transparent to-transparent z-10" />
            <img
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
              className="block w-full h-auto"
            />
          </div>
          <figcaption className="mt-2 text-micro font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {block.caption}
          </figcaption>
        </figure>
      );

    case 'callout': {
      const isWarning = block.tone === 'warning';
      return (
        <div
          className={`rounded-tech border p-4 space-y-1.5 ${
            isWarning
              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
              : 'bg-paper-100 dark:bg-charcoal-900 border-paper-300 dark:border-charcoal-750'
          }`}
        >
          <div className="flex items-center gap-2">
            {isWarning ? (
              <TriangleAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-accent" />
            )}
            <span className="text-heading-sm font-semibold text-slate-900 dark:text-white">
              {block.title}
            </span>
          </div>
          <p className="text-caption text-slate-700 dark:text-slate-300 leading-relaxed">
            {block.body}
          </p>
        </div>
      );
    }

    case 'table':
      return (
        <div className="overflow-x-auto rounded-tech border border-paper-300 dark:border-charcoal-750">
          <table className="w-full text-caption text-left">
            <thead className="bg-paper-100 dark:bg-charcoal-900">
              <tr>
                {block.headers.map((header, headerIndex) => (
                  <th
                    key={headerIndex}
                    scope="col"
                    className="px-3 py-2 text-micro font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-paper-200 dark:border-charcoal-800"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-3 py-2 text-slate-700 dark:text-slate-300 tabular-nums"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'calculator-cta':
      return (
        <div className="rounded-tech-lg bg-white dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 shadow-tech-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-micro font-mono text-accent uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>{t('common.calculators')}</span>
          </div>
          <h3 className="text-heading-md font-bold text-slate-900 dark:text-white">
            {block.title}
          </h3>
          <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
            {block.body}
          </p>
          <Link
            to={viewToPath(block.view)}
            className="inline-flex items-center gap-1.5 text-caption font-mono text-accent hover:underline"
          >
            {block.title} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      );

    case 'faq':
      return (
        <dl className="space-y-4">
          {block.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="rounded-tech bg-paper-100 dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-750 p-4 space-y-1.5"
            >
              <dt className="text-heading-sm font-semibold text-slate-900 dark:text-white">
                {item.question}
              </dt>
              <dd className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      );

    default:
      return null;
  }
}
