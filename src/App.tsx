import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { GlobalLayout } from './components/layout/GlobalLayout';
import type { UnitSystem } from './types/layout';
import { HomePage } from './components/home/HomePage';
import { ConcreteCalculatorWorkspace } from './components/calculators/concrete/ConcreteCalculatorWorkspace';
import { BrickCalculatorWorkspace } from './components/calculators/brick/BrickCalculatorWorkspace';
import { PaintCalculatorWorkspace } from './components/calculators/paint/PaintCalculatorWorkspace';
import { CalculatorsDirectoryPage } from './components/calculators/CalculatorsDirectoryPage';
import { GuidesPage } from './components/guides/GuidesPage';
import { AboutPage } from './components/legal/AboutPage';
import { ContactPage } from './components/legal/ContactPage';
import { PrivacyPage } from './components/legal/PrivacyPage';
import { TermsPage } from './components/legal/TermsPage';
import { DisclaimerPage } from './components/legal/DisclaimerPage';
import { CookiePolicyPage } from './components/legal/CookiePolicyPage';
import { AdvertisingDisclosurePage } from './components/legal/AdvertisingDisclosurePage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Error404Page } from './components/common/Error404Page';
import { SEO } from './components/common/SEO';
import { StructuredData } from './components/common/StructuredData';
import { getRouteSEO } from './lib/seo';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const unit = params.get('unit');
      if (unit === 'metric' || unit === 'imperial') {
        return unit;
      }
    }
    return 'imperial';
  });

  // Handle legacy ?tool= query parameter redirection at root
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      const params = new URLSearchParams(location.search);
      const tool = params.get('tool');
      const unit = params.get('unit');
      if (unit && (unit === 'metric' || unit === 'imperial')) {
        setUnitSystem(unit);
      }
      if (tool) {
        let targetPath = '/';
        if (tool === 'overview' || tool === 'home') targetPath = '/';
        else if (tool === 'calculators') targetPath = '/calculators';
        else if (tool === 'concrete' || tool === 'concrete-slab-calculator') targetPath = '/calculators/concrete-slab-calculator';
        else if (tool === 'brick' || tool === 'brick-mortar-calculator') targetPath = '/calculators/brick-mortar-calculator';
        else if (tool === 'paint' || tool === 'paint-calculator') targetPath = '/calculators/paint-calculator';
        else if (['guides', 'about', 'contact', 'privacy', 'terms', 'disclaimer', 'cookie-policy', 'advertising'].includes(tool)) {
          targetPath = `/${tool}`;
        }
        params.delete('tool');
        const search = params.toString() ? `?${params.toString()}` : '';
        navigate(`${targetPath}${search}`, { replace: true });
      }
    }
  }, [location, navigate]);

  const getActiveViewFromPath = (pathname: string) => {
    if (pathname === '/' || pathname === '') return 'overview';
    if (pathname === '/calculators') return 'calculators';
    if (pathname === '/calculators/concrete-slab-calculator') return 'concrete-slab-calculator';
    if (pathname === '/calculators/brick-mortar-calculator') return 'brick-mortar-calculator';
    if (pathname === '/calculators/paint-calculator') return 'paint-calculator';
    if (pathname === '/guides') return 'guides';
    if (pathname === '/about') return 'about';
    if (pathname === '/contact') return 'contact';
    if (pathname === '/privacy') return 'privacy';
    if (pathname === '/terms') return 'terms';
    if (pathname === '/disclaimer') return 'disclaimer';
    if (pathname === '/cookie-policy') return 'cookie-policy';
    if (pathname === '/advertising') return 'advertising';
    return '404';
  };

  const activeView = getActiveViewFromPath(location.pathname);
  const seo = getRouteSEO(location.pathname);

  // Scroll to top whenever the route path changes (internal Link/NavLink navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('unit', system);
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  };

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        noindex={seo.noindex}
      />
      <StructuredData pathname={location.pathname} />
      <ErrorBoundary>
        <GlobalLayout
          activeView={activeView}
          unitSystem={unitSystem}
          onUnitSystemChange={handleUnitSystemChange}
        >
          <Routes>
            <Route
              path="/"
              element={<HomePage unitSystem={unitSystem} />}
            />
            <Route
              path="/calculators/concrete-slab-calculator"
              element={
                <ConcreteCalculatorWorkspace
                  unitSystem={unitSystem}
                  onUnitSystemChange={handleUnitSystemChange}
                />
              }
            />
            <Route
              path="/calculators/brick-mortar-calculator"
              element={
                <BrickCalculatorWorkspace
                  unitSystem={unitSystem}
                  onUnitSystemChange={handleUnitSystemChange}
                />
              }
            />
            <Route
              path="/calculators/paint-calculator"
              element={
                <PaintCalculatorWorkspace
                  unitSystem={unitSystem}
                  onUnitSystemChange={handleUnitSystemChange}
                />
              }
            />
            <Route path="/calculators" element={<CalculatorsDirectoryPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/advertising" element={<AdvertisingDisclosurePage />} />
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </GlobalLayout>
      </ErrorBoundary>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
