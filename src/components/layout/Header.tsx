import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Calculator, ChevronDown } from 'lucide-react';
import type { ThemeMode, UnitSystem } from '../../types/layout';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  unitSystem,
  onUnitSystemChange,
  activeView,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);

  const isConcrete = activeView === 'concrete' || activeView === 'concrete-slab-calculator';
  const isBrick = activeView === 'brick' || activeView === 'brick-mortar-calculator';
  const isPaint = activeView === 'paint' || activeView === 'paint-calculator';
  const isCalculators = activeView === 'calculators' || isConcrete || isBrick || isPaint;
  const isHome = activeView === 'overview' || activeView === 'home';
  const isGuides = activeView === 'guides';
  const isAbout = activeView === 'about';

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setCalcDropdownOpen(false);
  };

  return (
    <header className="w-full border-b border-paper-300 dark:border-charcoal-750 bg-paper-50/90 dark:bg-charcoal-950/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Wordmark */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-opacity hover:opacity-85"
            aria-label="Structura Homepage"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
              STRUCTURA
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 text-body-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <button
              type="button"
              onClick={() => handleNavClick('overview')}
              className={`transition-colors py-1 hover:text-slate-950 dark:hover:text-white ${
                isHome ? 'text-accent dark:text-amber-400 font-semibold' : ''
              }`}
            >
              Overview
            </button>

            {/* Calculators Dropdown / Hub */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => handleNavClick('calculators')}
                onMouseEnter={() => setCalcDropdownOpen(true)}
                className={`transition-colors py-1 hover:text-slate-950 dark:hover:text-white flex items-center gap-1 ${
                  isCalculators ? 'text-accent dark:text-amber-400 font-semibold' : ''
                }`}
              >
                <span>Calculators</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Flyout menu on hover */}
              <div
                onMouseLeave={() => setCalcDropdownOpen(false)}
                className={`absolute left-0 top-full pt-2 w-64 transition-all duration-150 ${
                  calcDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                }`}
              >
                <div className="p-2 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 shadow-xl space-y-1 text-caption">
                  <button
                    type="button"
                    onClick={() => handleNavClick('calculators')}
                    className="w-full text-left px-3 py-1.5 rounded-tech text-slate-900 dark:text-white hover:bg-paper-100 dark:hover:bg-charcoal-800 font-medium"
                  >
                    Directory (All Tools)
                  </button>
                  <div className="h-px bg-paper-200 dark:bg-charcoal-800 my-1" />
                  <button
                    type="button"
                    onClick={() => handleNavClick('concrete-slab-calculator')}
                    className="w-full text-left px-3 py-1.5 rounded-tech text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800 flex items-center justify-between"
                  >
                    <span>Concrete Slab</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">3D</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('brick-mortar-calculator')}
                    className="w-full text-left px-3 py-1.5 rounded-tech text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800 flex items-center justify-between"
                  >
                    <span>Brick & Mortar</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">3D</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('paint-calculator')}
                    className="w-full text-left px-3 py-1.5 rounded-tech text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800 flex items-center justify-between"
                  >
                    <span>Architectural Paint</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">3D</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('guides')}
              className={`transition-colors py-1 hover:text-slate-950 dark:hover:text-white ${
                isGuides ? 'text-accent dark:text-amber-400 font-semibold' : ''
              }`}
            >
              Guides
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={`transition-colors py-1 hover:text-slate-950 dark:hover:text-white ${
                isAbout ? 'text-accent dark:text-amber-400 font-semibold' : ''
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Right Zone: Segmented Unit Selector, Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div
            role="group"
            aria-label="Unit system selector"
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
              Imperial (ft/in)
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
              Metric (m/mm)
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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
            aria-label="Toggle mobile menu"
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
          <div className="space-y-1 text-body-sm font-medium">
            <button
              type="button"
              onClick={() => handleNavClick('overview')}
              className={`w-full text-left px-3 py-2 rounded-tech ${
                isHome ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('calculators')}
              className={`w-full text-left px-3 py-2 rounded-tech ${
                activeView === 'calculators' ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              All Calculators Directory
            </button>
            <div className="pl-4 space-y-1 pt-1 border-l-2 border-paper-200 dark:border-charcoal-800 ml-3">
              <button
                type="button"
                onClick={() => handleNavClick('concrete-slab-calculator')}
                className={`w-full text-left px-2 py-1.5 text-caption rounded-tech ${
                  isConcrete ? 'text-accent font-semibold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Concrete Slab Calculator
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('brick-mortar-calculator')}
                className={`w-full text-left px-2 py-1.5 text-caption rounded-tech ${
                  isBrick ? 'text-accent font-semibold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Brick & Mortar Calculator
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('paint-calculator')}
                className={`w-full text-left px-2 py-1.5 text-caption rounded-tech ${
                  isPaint ? 'text-accent font-semibold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Architectural Paint Calculator
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('guides')}
              className={`w-full text-left px-3 py-2 rounded-tech ${
                isGuides ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Field Guides
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={`w-full text-left px-3 py-2 rounded-tech ${
                isAbout ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              About STRUCTURA
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left px-3 py-2 rounded-tech ${
                activeView === 'contact' ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Contact Support
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('disclaimer')}
              className={`w-full text-left px-3 py-2 rounded-tech ${
                activeView === 'disclaimer' ? 'bg-accent/10 text-accent font-semibold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Construction Disclaimer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
