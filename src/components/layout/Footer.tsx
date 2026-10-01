import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { useViewToPath } from '../../lib/routes';
import { useLocale } from '../../lib/i18n/context';

export const Footer: React.FC = () => {
  const { t } = useLocale();
  const viewToPath = useViewToPath();

  return (
    <footer className="w-full border-t border-paper-300 dark:border-charcoal-750 bg-paper-100 dark:bg-charcoal-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Trade Directory & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <Link
              to={viewToPath('overview')}
              className="inline-block text-left text-heading-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans hover:opacity-80 transition-opacity"
            >
              MixTally
            </Link>
            <p className="text-caption text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 text-micro text-slate-500 dark:text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>{t('footer.badge')}</span>
            </div>
          </div>

          {/* Construction Calculators */}
          <div>
            <h4 className="text-micro uppercase font-semibold tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              {t('footer.headingCalculators')}
            </h4>
            <ul className="space-y-2 text-caption text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to={viewToPath('concrete-slab-calculator')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('nav.concreteSlab')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('brick-mortar-calculator')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('nav.brickMortar')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('paint-calculator')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('nav.architecturalPaint')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('calculators')}
                  className="flex items-center gap-1 pt-1 text-accent font-medium hover:underline text-left"
                >
                  <span>{t('footer.allCalculators')}</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div>
            <h4 className="text-micro uppercase font-semibold tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              {t('footer.headingResources')}
            </h4>
            <ul className="space-y-2 text-caption text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to={viewToPath('guides')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('nav.fieldGuides')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('about')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('nav.aboutMixTally')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('contact')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('nav.contactSupport')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-micro uppercase font-semibold tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              {t('footer.headingLegal')}
            </h4>
            <ul className="space-y-2 text-caption text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to={viewToPath('disclaimer')}
                  className="inline-block hover:text-accent transition-colors text-left font-medium text-slate-700 dark:text-slate-300"
                >
                  {t('footer.disclaimer')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('privacy')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('terms')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('footer.termsOfUse')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('cookie-policy')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('footer.cookiePolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('advertising')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  {t('footer.advertisingDisclosure')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Construction Planning Disclaimer Callout */}
        <div className="p-4 rounded-tech bg-paper-200/70 dark:bg-charcoal-850 border border-paper-300 dark:border-charcoal-750 flex items-start gap-3 mb-8">
          <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="text-micro text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              {t('footer.noticeLead')}
            </strong>{' '}
            {t('footer.noticeBody')}{' '}
            <Link
              to={viewToPath('disclaimer')}
              className="text-accent underline font-medium inline"
            >
              {t('footer.readFullDisclaimer')}
            </Link>
            .
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-paper-300 dark:border-charcoal-800 text-caption text-slate-500 dark:text-slate-400">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-3 mt-4 sm:mt-0 text-micro">
            <span>{t('footer.bottomFormula')}</span>
            <span aria-hidden="true">·</span>
            <span>{t('footer.bottomGeometry')}</span>
            <span aria-hidden="true">·</span>
            <span>{t('footer.bottomTelemetry')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
