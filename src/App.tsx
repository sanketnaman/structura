import React, { useState, useEffect } from 'react';
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
import { getToolBySlug } from './lib/tools/registry';

export default function App() {
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tool = params.get('tool');
      if (tool) {
        if (tool === 'concrete' || tool === 'concrete-slab-calculator') return 'concrete-slab-calculator';
        if (tool === 'brick' || tool === 'brick-mortar-calculator') return 'brick-mortar-calculator';
        if (tool === 'paint' || tool === 'paint-calculator') return 'paint-calculator';
        return tool;
      }
    }
    return 'overview';
  });

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

  // Handle URL updates and SEO metadata synchronization on view change
  const handleNavigate = (view: string) => {
    let normalizedView = view;
    if (view === 'concrete') normalizedView = 'concrete-slab-calculator';
    if (view === 'brick') normalizedView = 'brick-mortar-calculator';
    if (view === 'paint') normalizedView = 'paint-calculator';

    setActiveView(normalizedView);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (normalizedView === 'overview' || normalizedView === 'home') {
        url.searchParams.delete('tool');
      } else {
        url.searchParams.set('tool', normalizedView);
      }
      url.searchParams.set('unit', unitSystem);
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync unit system into URL
  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('unit', system);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Dynamic SEO meta update on route change
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const titles: Record<string, { title: string; desc: string }> = {
      overview: {
        title: 'STRUCTURA — Construction Calculators & 3D Material Estimation',
        desc: 'Interactive 3D construction calculators for concrete slabs, masonry brick coursing, and paint surface takeoffs. Formula-based material estimation with live spatial models.',
      },
      calculators: {
        title: 'Construction Calculator Directory | STRUCTURA',
        desc: 'Comprehensive index of interactive 3D construction calculators, material takeoffs, and engineering volume tools for contractors, builders, and trades.',
      },
      guides: {
        title: 'Construction Takeoff & Field Guides | STRUCTURA',
        desc: 'Practical construction references explaining volumetric concrete formulas, masonry coursing geometry, paint coverage rates, and contractor waste margins.',
      },
      about: {
        title: 'About STRUCTURA — Visual Construction Engineering',
        desc: 'Learn about STRUCTURA’s mission to replace opaque online calculators with dynamic parametric 3D models and verified engineering formulas.',
      },
      contact: {
        title: 'Contact Engineering Support | STRUCTURA',
        desc: 'Get in touch with STRUCTURA regarding construction calculator formulas, feature requests, or technical partnerships.',
      },
      privacy: {
        title: 'Privacy Policy | STRUCTURA',
        desc: 'STRUCTURA privacy policy. Understand how local browser storage, advertising disclosures, and client-side calculations protect your privacy.',
      },
      terms: {
        title: 'Terms of Use | STRUCTURA',
        desc: 'Terms and conditions governing the use of STRUCTURA construction calculators and estimation tools.',
      },
      disclaimer: {
        title: 'Construction Planning Disclaimer | STRUCTURA',
        desc: 'Important legal disclaimer: STRUCTURA provides mathematical quantity estimates for logistical planning. Field verification and licensed professional engineering review required.',
      },
      'cookie-policy': {
        title: 'Cookie & Storage Policy | STRUCTURA',
        desc: 'Technical disclosures regarding browser localStorage for unit systems and advertising partner cookies.',
      },
      advertising: {
        title: 'Advertising Disclosure | STRUCTURA',
        desc: 'Transparent disclosure regarding third-party ad serving and non-deceptive advertising principles on STRUCTURA.',
      },
    };

    if (titles[activeView]) {
      document.title = titles[activeView].title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', titles[activeView].desc);
      }
    } else {
      const tool = getToolBySlug(activeView);
      if (tool) {
        document.title = `${tool.seoTitle} | STRUCTURA`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', tool.seoDescription);
        }
      } else {
        document.title = 'Page Not Found | STRUCTURA';
      }
    }
  }, [activeView]);

  return (
    <ErrorBoundary onNavigate={handleNavigate}>
      <GlobalLayout
        activeView={activeView}
        onNavigate={handleNavigate}
        unitSystem={unitSystem}
        onUnitSystemChange={handleUnitSystemChange}
      >
        {/* 1. HOMEPAGE VIEW */}
        {(activeView === 'overview' || activeView === 'home') && (
          <HomePage
            unitSystem={unitSystem}
            onNavigateToTool={handleNavigate}
          />
        )}

        {/* 2. CONCRETE CALCULATOR WORKSPACE */}
        {(activeView === 'concrete' || activeView === 'concrete-slab-calculator') && (
          <ConcreteCalculatorWorkspace
            unitSystem={unitSystem}
            onUnitSystemChange={handleUnitSystemChange}
            onNavigateToTool={handleNavigate}
          />
        )}

        {/* 3. BRICK CALCULATOR WORKSPACE */}
        {(activeView === 'brick' || activeView === 'brick-mortar-calculator') && (
          <BrickCalculatorWorkspace
            unitSystem={unitSystem}
            onUnitSystemChange={handleUnitSystemChange}
            onNavigateToTool={handleNavigate}
          />
        )}

        {/* 4. PAINT CALCULATOR WORKSPACE */}
        {(activeView === 'paint' || activeView === 'paint-calculator') && (
          <PaintCalculatorWorkspace
            unitSystem={unitSystem}
            onUnitSystemChange={handleUnitSystemChange}
            onNavigateToTool={handleNavigate}
          />
        )}

        {/* 5. CALCULATORS DIRECTORY */}
        {activeView === 'calculators' && (
          <CalculatorsDirectoryPage onNavigateToTool={handleNavigate} />
        )}

        {/* 6. GUIDES & FIELD REFERENCES */}
        {activeView === 'guides' && (
          <GuidesPage onNavigateToTool={handleNavigate} />
        )}

        {/* 7. ABOUT PAGE */}
        {activeView === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {/* 8. CONTACT PAGE */}
        {activeView === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}

        {/* 9. LEGAL: PRIVACY POLICY */}
        {activeView === 'privacy' && (
          <PrivacyPage onNavigate={handleNavigate} />
        )}

        {/* 10. LEGAL: TERMS OF USE */}
        {activeView === 'terms' && (
          <TermsPage onNavigate={handleNavigate} />
        )}

        {/* 11. LEGAL: CONSTRUCTION DISCLAIMER */}
        {activeView === 'disclaimer' && (
          <DisclaimerPage onNavigate={handleNavigate} />
        )}

        {/* 12. LEGAL: COOKIE POLICY */}
        {activeView === 'cookie-policy' && (
          <CookiePolicyPage onNavigate={handleNavigate} />
        )}

        {/* 13. LEGAL: ADVERTISING DISCLOSURE */}
        {activeView === 'advertising' && (
          <AdvertisingDisclosurePage onNavigate={handleNavigate} />
        )}

        {/* 14. 404 NOT FOUND FALLBACK */}
        {![
          'overview',
          'home',
          'concrete',
          'concrete-slab-calculator',
          'brick',
          'brick-mortar-calculator',
          'paint',
          'paint-calculator',
          'calculators',
          'guides',
          'about',
          'contact',
          'privacy',
          'terms',
          'disclaimer',
          'cookie-policy',
          'advertising',
        ].includes(activeView) && (
          <Error404Page onNavigate={handleNavigate} />
        )}
      </GlobalLayout>
    </ErrorBoundary>
  );
}
