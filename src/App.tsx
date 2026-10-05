import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { GlobalLayout } from './components/layout/GlobalLayout';
import type { UnitSystem } from './types/layout';
import { HomePage } from './components/home/HomePage';
import { ConcreteCalculatorWorkspace } from './components/calculators/concrete/ConcreteCalculatorWorkspace';
import { BrickCalculatorWorkspace } from './components/calculators/brick/BrickCalculatorWorkspace';
import { PaintCalculatorWorkspace } from './components/calculators/paint/PaintCalculatorWorkspace';
import { CalculatorsDirectoryPage } from './components/calculators/CalculatorsDirectoryPage';
import { GuidesPage } from './components/guides/GuidesPage';
import { BlogListingPage } from './components/blog/BlogListingPage';
import { ArticlePage } from './components/blog/ArticlePage';
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
import { localizedRoutePaths, type PageRoutePath } from './lib/routes';
import { localizedArticleRoutePatterns } from './lib/blog/registry';
import { parseLocalePath, localizePath } from './lib/i18n/routing';
import { LocaleProvider, useLocale } from './lib/i18n/context';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useLocale();

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

  // Locale explicitly requested by the URL (never the stored preference) and
  // the path without that prefix — the basis for routing, nav and SEO lookups.
  const { locale: urlLocale, basePath } = parseLocalePath(location.pathname);

  // Handle legacy ?tool= query parameter redirection at the localized root.
  // The target keeps the URL's locale, so English URLs never redirect based
  // on a stored language preference.
  useEffect(() => {
    if (basePath === '/' || basePath === '') {
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
        else if (['guides', 'blog', 'about', 'contact', 'privacy', 'terms', 'disclaimer', 'cookie-policy', 'advertising'].includes(tool)) {
          targetPath = `/${tool}`;
        }
        params.delete('tool');
        const search = params.toString() ? `?${params.toString()}` : '';
        navigate(`${localizePath(urlLocale, targetPath)}${search}`, { replace: true });
      }
    }
  }, [location, navigate, basePath, urlLocale]);

  const getActiveViewFromPath = (path: string) => {
    if (path === '/' || path === '') return 'overview';
    if (path === '/calculators') return 'calculators';
    if (path === '/calculators/concrete-slab-calculator') return 'concrete-slab-calculator';
    if (path === '/calculators/brick-mortar-calculator') return 'brick-mortar-calculator';
    if (path === '/calculators/paint-calculator') return 'paint-calculator';
    if (path === '/guides') return 'guides';
    if (path === '/blog') return 'blog';
    if (path.startsWith('/blog/')) return 'blog-article';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    if (path === '/disclaimer') return 'disclaimer';
    if (path === '/cookie-policy') return 'cookie-policy';
    if (path === '/advertising') return 'advertising';
    return '404';
  };

  const activeView = getActiveViewFromPath(basePath);
  const seo = useMemo(() => getRouteSEO(location.pathname), [location.pathname]);

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

  // One element per canonical page path; localized variants are registered
  // from the same list below, so no route can drift out of sync.
  const pageElements: Record<PageRoutePath, React.ReactElement> = {
    '/': <HomePage unitSystem={unitSystem} />,
    '/calculators/concrete-slab-calculator': (
      <ConcreteCalculatorWorkspace
        unitSystem={unitSystem}
        onUnitSystemChange={handleUnitSystemChange}
      />
    ),
    '/calculators/brick-mortar-calculator': (
      <BrickCalculatorWorkspace
        unitSystem={unitSystem}
        onUnitSystemChange={handleUnitSystemChange}
      />
    ),
    '/calculators/paint-calculator': (
      <PaintCalculatorWorkspace
        unitSystem={unitSystem}
        onUnitSystemChange={handleUnitSystemChange}
      />
    ),
    '/calculators': <CalculatorsDirectoryPage />,
    '/guides': <GuidesPage />,
    '/blog': <BlogListingPage />,
    '/about': <AboutPage />,
    '/contact': <ContactPage />,
    '/privacy': <PrivacyPage />,
    '/terms': <TermsPage />,
    '/disclaimer': <DisclaimerPage />,
    '/cookie-policy': <CookiePolicyPage />,
    '/advertising': <AdvertisingDisclosurePage />,
  };

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        noindex={seo.noindex}
        locale={locale}
        alternates={seo.alternates}
        image={seo.image}
        ogType={seo.ogType}
      />
      <StructuredData pathname={location.pathname} />
      <ErrorBoundary>
        <GlobalLayout
          activeView={activeView}
          unitSystem={unitSystem}
          onUnitSystemChange={handleUnitSystemChange}
        >
          <Routes>
            {localizedRoutePaths().map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={pageElements[route.basePath]}
              />
            ))}
            {/*
              Article bodies are English-only and slug-driven, so they are not
              enumerated in PAGE_ROUTE_PATHS. Each localized mirror still gets
              an explicit route so a language switch renders the article instead
              of falling through to the 404.
            */}
            {localizedArticleRoutePatterns().map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<ArticlePage />}
              />
            ))}
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </GlobalLayout>
      </ErrorBoundary>
    </>
  );
}

/**
 * Router-agnostic application composition: locale context, route table,
 * SEO/structured-data effects and the global layout. The client mounts it
 * inside <BrowserRouter> below; the server entry (entry-server.tsx) mounts
 * the identical tree inside <MemoryRouter>, so both render the same routes
 * and page components without duplicating route configuration.
 */
export function AppRoot(): React.ReactElement {
  return (
    <LocaleProvider>
      <AppContent />
    </LocaleProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoot />
    </BrowserRouter>
  );
}
