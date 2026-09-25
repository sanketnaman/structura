import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ConsentBanner } from '../common/ConsentBanner';
import type { ThemeMode, UnitSystem } from '../../types/layout';

interface GlobalLayoutProps {
  children: React.ReactNode;
  activeView?: string;
  onNavigate?: (view: string) => void;
  unitSystem?: UnitSystem;
  onUnitSystemChange?: (system: UnitSystem) => void;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  children,
  activeView = 'overview',
  onNavigate = () => {},
  unitSystem: externalUnitSystem,
  onUnitSystemChange: externalOnUnitSystemChange,
}) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [internalUnitSystem, setInternalUnitSystem] = useState<UnitSystem>('imperial');

  const unitSystem = externalUnitSystem ?? internalUnitSystem;
  const handleUnitSystemChange = externalOnUnitSystemChange ?? setInternalUnitSystem;

  // Initialize theme from system preference or default to dark
  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper-50 dark:bg-charcoal-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-accent selection:text-white">
      {/* Top Bar with complete navigation */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        unitSystem={unitSystem}
        onUnitSystemChange={handleUnitSystemChange}
        activeView={activeView}
        onNavigate={onNavigate}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {children}
        </div>
      </main>

      {/* Comprehensive Architectural Trade & Legal Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Consent & Privacy Preferences Management */}
      <ConsentBanner onNavigateToPolicy={(policy) => onNavigate(policy)} />
    </div>
  );
};
