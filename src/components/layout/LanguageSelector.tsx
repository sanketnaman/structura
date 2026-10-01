import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';
import type { LocaleCode } from '../../lib/i18n/config';
import { localizeHref, parseLocalePath } from '../../lib/i18n/routing';

interface LanguageSelectorProps {
  /**
   * 'compact' — icon control for the Header top bar (sm+ widths, where the
   * bar has room). 'block' — full-width row used inside the mobile drawer,
   * so narrow phones never push the top bar past the viewport.
   */
  variant?: 'compact' | 'block';
  /** Extra classes merged into the root element (e.g. responsive visibility). */
  className?: string;
}

/**
 * Language menu matching the existing controls (rounded-tech borders,
 * paper/charcoal surfaces, micro typography). Names are shown in their
 * native form — no emoji flags, so rendering stays consistent everywhere.
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { locale, setLocale, t, locales } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Close when clicking outside the control or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close]);

  // Equivalent destination for every locale on the current page: swap only
  // the locale prefix of the current base path, keeping the query string
  // (e.g. ?unit=metric) and hash fragment intact. English stays unprefixed.
  const { basePath } = parseLocalePath(location.pathname);
  const hrefSuffix = `${location.search}${location.hash}`;
  const currentHref = `${location.pathname}${hrefSuffix}`;
  const hrefs = locales.reduce((acc, item) => {
    acc[item.code] = localizeHref(`${basePath}${hrefSuffix}`, item.code);
    return acc;
  }, {} as Record<LocaleCode, string>);

  const handleSelect = (code: LocaleCode, event: React.MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks (open in new tab/window) keep native anchor behavior —
    // the href itself already points at the right locale, so no interception.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      close();
      return;
    }
    // Plain activation: retain SPA navigation instead of a full-page load.
    event.preventDefault();
    setLocale(code);
    if (hrefs[code] !== currentHref) {
      navigate(hrefs[code]);
    }
    close();
  };

  const activeLocale = locales.find((item) => item.code === locale);

  const triggerClassName =
    variant === 'block'
      ? 'w-full flex items-center gap-2 px-3 py-2 rounded-tech text-body-sm text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800 border border-paper-300 dark:border-charcoal-750 transition-colors'
      : 'flex items-center gap-1.5 p-2 rounded-tech text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-paper-200 dark:hover:bg-charcoal-800 border border-paper-300 dark:border-charcoal-750 transition-colors';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t('common.changeLanguage')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={triggerClassName}
      >
        <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
        {variant === 'block' ? (
          <>
            <span className="flex-1 text-left">{t('common.language')}</span>
            <span className="text-micro font-mono opacity-70">{activeLocale?.shortCode}</span>
          </>
        ) : (
          <span className="hidden sm:inline text-micro font-semibold tracking-wide">
            {activeLocale?.shortCode}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 shrink-0 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('common.language')}
          className={`absolute top-full pt-2 z-50 ${variant === 'block' ? 'left-0 right-0' : 'right-0'}`}
        >
          <div className="w-52 max-w-full p-1.5 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 shadow-tech-elevated">
            <div className="px-3 py-1.5 text-micro uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('common.language')}
            </div>
            <div className="h-px bg-paper-200 dark:bg-charcoal-800 my-1" />
            <div className="space-y-0.5">
              {locales.map((item) => {
                const isActive = item.code === locale;
                return (
                  <a
                    key={item.code}
                    href={hrefs[item.code]}
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={(event) => handleSelect(item.code, event)}
                    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-tech text-caption transition-colors ${
                      isActive
                        ? 'bg-accent/10 text-accent font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800'
                    }`}
                  >
                    <span className="flex-1 text-left">{item.nativeName}</span>
                    <span className="text-micro font-mono opacity-60">{item.shortCode}</span>
                    {isActive ? (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <span className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
