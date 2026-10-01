import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import type { ThemeMode, UnitSystem } from '../../types/layout';
import { useViewToPath } from '../../lib/routes';
import { useLocale } from '../../lib/i18n/context';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  unitSystem,
  onUnitSystemChange,
  activeView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const { t } = useLocale();
  const viewToPath = useViewToPath();

  const isConcrete = activeView === 'concrete' || activeView === 'concrete-slab-calculator';
  const isBrick = activeView === 'brick' || activeView === 'brick-mortar-calculator';
  const isPaint = activeView === 'paint' || activeView === 'paint-calculator';
  const isCalculators = activeView === 'calculators' || isConcrete || isBrick || isPaint;
  const isHome = activeView === 'overview' || activeView === 'home';
  const isGuides = activeView === 'guides';
  const isAbout = activeView === 'about';

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setCalcDropdownOpen(false);
  };

  return (
    <header className="w-full border-b border-paper-300 dark:border-charcoal-750 bg-paper-50/90 dark:bg-charcoal-950/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Wordmark */}
        <div className="flex items-center gap-6">
          <Link
            to={viewToPath('overview')}
            onClick={closeMenus}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-opacity hover:opacity-85"
            aria-label={t('header.homepageLabel')}
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
              MixTally
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label={t('header.mainNavigation')}
            className="hidden md:flex items-center gap-6 text-body-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <NavLink
              to={viewToPath('overview')}
              end
              onClick={closeMenus}
              className={() =>
                `transition-colors py-1 hover:text-slate-950 dark:hover:text-white ${
                  isHome ? 'text-accent dark:text-amber-400 font-semibold' : ''
                }`
              }
            >
              {t('nav.overview')}
            </NavLink>

            {/* Calculators Dropdown / Hub */}
            <div className="relative group">
              <NavLink
                to={viewToPath('calculators')}
                onClick={closeMenus}
                onMouseEnter={() => setCalcDropdownOpen(true)}
                className={() =>
                  `transition-colors py-1 hover:text-slate-950 dark:hover:text-white flex items-center gap-1 ${
                    isCalculators ? 'text-accent dark:text-amber-400 font-semibold' : ''
                  }`
                }
              >
                <span>{t('nav.calculators')}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </NavLink>

              {/* Flyout menu on hover */}
              <div
                onMouseLeave={() => setCalcDropdownOpen(false)}
                className={`absolute left-0 top-full pt-2 w-64 transition-all duration-150 ${
                  calcDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                }`}
              >
                <div className="p-2 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 shadow-xl space-y-1 text-caption">
                  <Link
                    to={viewToPath('calculators')}
                    onClick={closeMenus}
                    className="block w-full text-left px-3 py-1.5 rounded-tech text-slate-900 dark:text-white hover:bg-paper-100 dark:hover:bg-charcoal-800 font-medium"
                  >
                    {t('nav.directoryAllTools')}
                  </Link>
                  <div className="h-px bg-paper-200 dark:bg-charcoal-800 my-1" />
                  <Link
                    to={viewToPath('concrete-slab-calculator')}
                    onClick={closeMenus}
                    className="block w-full text-left px-3 py-1.5 rounded-tech text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800 flex items-center justify-between"
                  >
                    <span>{t('nav.concreteSlab')}</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">3D</span>
                  </Link>
                  <Link
                    to={viewToPath('brick-mortar-calculator')}
                    onClick={closeMenus}
                    className="block w-full text-left px-3 py-1.5 rounded-tech text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800 flex items-center justify-between"
                  >
                    <span>{t('nav.brickMortar')}</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">3D</span>
                  </Link>
                  <Link
                    to={viewToPath('paint-calculator')}
                    onClick={closeMenus}
                    className="block w-full text-left px-3 py-1.5 rounded-tech text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800 flex items-center justify-between"
                  >
                    <span>{t('nav.architecturalPaint')}</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">3D</span>
                  </Link>
                </div>
              </div>
            </div>

            <NavLink
              to={viewToPath('guides')}
              onClick={closeMenus}
              className={() =>
                `transition-colors py-1 hover:text-slate-950 dark:hover:text-white ${
                  isGuides ? 'text-accent dark:text-amber-400 font-semibold' : ''
                }`
              }
            >
              {t('nav.guides')}
            </NavLink>

            <NavLink
              to={viewToPath('about')}
              onClick={closeMenus}
              className={() =>
                `transition-colors py-1 hover:text-slate-950 dark:hover:text-white ${
                  isAbout ? 'text-accent dark:text-amber-400 font-semibold' : ''
                }`
              }
            >
              {t('nav.about')}
            </NavLink>
          </nav>
        </div>

        {/* Right Zone: Segmented Unit Selector, Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div
            role="group"
            aria-label={t('header.unitSystemSelector')}
            className="flex items-center bg-paper-200 dark:bg-charcoal-850 p-0.5 rounded-tech border border-paper-300 dark:border-charcoal-750 text-micro font-medium"
          >
            <button
              type="button"
              onClick={() => onUnitSystemChange('imperial')}
              aria-pressed={unitSystem === 'imperial'}
              className={`px-2.5 py-1 rounded-tech transition-colors tabular-nums ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-charcoal-700 text-slate-900 dark:text-white shadow-tech-subtle font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('header.imperial')}
            </button>
            <button
              type="button"
              onClick={() => onUnitSystemChange('metric')}
              aria-pressed={unitSystem === 'metric'}
              className={`px-2.5 py-1 rounded-tech transition-colors tabular-nums ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-charcoal-700 text-slate-900 dark:text-white shadow-tech-subtle font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('header.metric')}
            </button>
          </div>

          {/* Language Selector (sm+; mobile uses the drawer entry below) */}
          <LanguageSelector className="hidden sm:block" />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark' ? t('header.switchToLightMode') : t('header.switchToDarkMode')
            }
            className="p-2 rounded-tech text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-paper-200 dark:hover:bg-charcoal-800 border border-paper-300 dark:border-charcoal-750 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('header.toggleMobileMenu')}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-tech text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-charcoal-800 border border-paper-300 dark:border-charcoal-750"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-paper-300 dark:border-charcoal-750 bg-white dark:bg-charcoal-900 px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Language Selector (full-width row on narrow screens) */}
          <LanguageSelector variant="block" />
          <div className="space-y-1 text-body-sm font-medium">
            <NavLink
              to={viewToPath('overview')}
              end
              onClick={closeMenus}
              className={() =>
                `block w-full text-left px-3 py-2 rounded-tech ${
                  isHome ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              {t('nav.overview')}
            </NavLink>
            <NavLink
              to={viewToPath('calculators')}
              onClick={closeMenus}
              className={() =>
                `block w-full text-left px-3 py-2 rounded-tech ${
                  activeView === 'calculators'
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              {t('nav.allCalculatorsDirectory')}
            </NavLink>
            <div className="pl-4 space-y-1 pt-1 border-l-2 border-paper-200 dark:border-charcoal-800 ml-3">
              <NavLink
                to={viewToPath('concrete-slab-calculator')}
                onClick={closeMenus}
                className={() =>
                  `block w-full text-left px-2 py-1.5 text-caption rounded-tech ${
                    isConcrete ? 'text-accent font-semibold' : 'text-slate-600 dark:text-slate-400'
                  }`
                }
              >
                {t('nav.concreteSlabCalculator')}
              </NavLink>
              <NavLink
                to={viewToPath('brick-mortar-calculator')}
                onClick={closeMenus}
                className={() =>
                  `block w-full text-left px-2 py-1.5 text-caption rounded-tech ${
                    isBrick ? 'text-accent font-semibold' : 'text-slate-600 dark:text-slate-400'
                  }`
                }
              >
                {t('nav.brickMortarCalculator')}
              </NavLink>
              <NavLink
                to={viewToPath('paint-calculator')}
                onClick={closeMenus}
                className={() =>
                  `block w-full text-left px-2 py-1.5 text-caption rounded-tech ${
                    isPaint ? 'text-accent font-semibold' : 'text-slate-600 dark:text-slate-400'
                  }`
                }
              >
                {t('nav.paintCalculator')}
              </NavLink>
            </div>
            <NavLink
              to={viewToPath('guides')}
              onClick={closeMenus}
              className={() =>
                `block w-full text-left px-3 py-2 rounded-tech ${
                  isGuides ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              {t('nav.fieldGuides')}
            </NavLink>
            <NavLink
              to={viewToPath('about')}
              onClick={closeMenus}
              className={() =>
                `block w-full text-left px-3 py-2 rounded-tech ${
                  isAbout ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              {t('nav.aboutMixTally')}
            </NavLink>
            <NavLink
              to={viewToPath('contact')}
              onClick={closeMenus}
              className={() =>
                `block w-full text-left px-3 py-2 rounded-tech ${
                  activeView === 'contact'
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              {t('nav.contactSupport')}
            </NavLink>
            <NavLink
              to={viewToPath('disclaimer')}
              onClick={closeMenus}
              className={() =>
                `block w-full text-left px-3 py-2 rounded-tech ${
                  activeView === 'disclaimer'
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              {t('nav.constructionDisclaimer')}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
