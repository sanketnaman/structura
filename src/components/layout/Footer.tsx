import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { viewToPath } from '../../lib/routes';

export const Footer: React.FC = () => {
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
              Construction material estimators and interactive 3D spatial calculators. Transparent mathematical breakdowns for field planning and material purchasing.
            </p>
            <div className="flex items-center gap-2 text-micro text-slate-500 dark:text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Planning & Purchasing Estimation Platform</span>
            </div>
          </div>

          {/* Construction Calculators */}
          <div>
            <h4 className="text-micro uppercase font-semibold tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Calculators
            </h4>
            <ul className="space-y-2 text-caption text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to={viewToPath('concrete-slab-calculator')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Concrete Slab
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('brick-mortar-calculator')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Brick & Mortar
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('paint-calculator')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Architectural Paint
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('calculators')}
                  className="flex items-center gap-1 pt-1 text-accent font-medium hover:underline text-left"
                >
                  <span>All Calculators</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div>
            <h4 className="text-micro uppercase font-semibold tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-caption text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to={viewToPath('guides')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Field Guides
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('about')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  About MixTally
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('contact')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-micro uppercase font-semibold tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-caption text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to={viewToPath('disclaimer')}
                  className="inline-block hover:text-accent transition-colors text-left font-medium text-slate-700 dark:text-slate-300"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('privacy')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('terms')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('cookie-policy')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to={viewToPath('advertising')}
                  className="inline-block hover:text-accent transition-colors text-left"
                >
                  Advertising Disclosure
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
              Construction Planning Notice:
            </strong>{' '}
            Calculations provided by MixTally are mathematical quantity and material estimates intended for volumetric planning, purchasing projections, and takeoff coordination. They do not constitute licensed structural engineering, load calculations, geotechnical foundation analysis, or certified architectural specifications. Verify field measurements with on-site inspections and consult a licensed civil or structural engineer for safety-critical and load-bearing decisions.{' '}
            <Link
              to={viewToPath('disclaimer')}
              className="text-accent underline font-medium inline"
            >
              Read Full Disclaimer
            </Link>
            .
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-paper-300 dark:border-charcoal-800 text-caption text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} MixTally. All rights reserved.</p>
          <div className="flex items-center gap-3 mt-4 sm:mt-0 text-micro">
            <span>Formula-Based Material Takeoffs</span>
            <span aria-hidden="true">·</span>
            <span>Client-Side Geometry</span>
            <span aria-hidden="true">·</span>
            <span>No Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
