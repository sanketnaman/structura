// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LanguageSelector } from '../src/components/layout/LanguageSelector';
import { LocaleProvider } from '../src/lib/i18n/context';
import { LOCALES, LOCALE_STORAGE_KEY, type LocaleCode } from '../src/lib/i18n';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const LOCATION_PATHS: Record<LocaleCode, string> = {
  en: '/privacy',
  es: '/es/privacy',
  pt: '/pt/privacy',
  fr: '/fr/privacy',
  de: '/de/privacy',
};

const LocationProbe = () => {
  const location = useLocation();
  return (
    <div
      id="location-probe"
      data-pathname={location.pathname}
      data-search={location.search}
      data-hash={location.hash}
    />
  );
};

let container: HTMLDivElement;
let root: Root | null = null;

function renderSelector(entry: string, variant: 'compact' | 'block' = 'compact') {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root!.render(
      <MemoryRouter initialEntries={[entry]}>
        <LocaleProvider>
          <LocationProbe />
          <LanguageSelector variant={variant} />
        </LocaleProvider>
      </MemoryRouter>,
    );
  });
}

function trigger(): HTMLButtonElement {
  const el = container.querySelector('button[aria-haspopup="menu"]');
  expect(el).not.toBeNull();
  return el as HTMLButtonElement;
}

function openMenu(): HTMLElement {
  const btn = trigger();
  act(() => {
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  const menu = container.querySelector('[role="menu"]');
  expect(menu).not.toBeNull();
  return menu as HTMLElement;
}

function menuItems(menu?: HTMLElement): HTMLAnchorElement[] {
  const scope = menu ?? (container.querySelector('[role="menu"]') as HTMLElement);
  return Array.from(scope.querySelectorAll('a[role="menuitemradio"]'));
}

/** Dispatches a plain left-click; returns false when the handler cancelled it (SPA). */
function clickElement(el: Element): boolean {
  let notCancelled = true;
  act(() => {
    notCancelled = el.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }),
    );
  });
  return notCancelled;
}

function probe() {
  const el = container.querySelector('#location-probe');
  expect(el).not.toBeNull();
  return {
    pathname: el!.getAttribute('data-pathname'),
    search: el!.getAttribute('data-search'),
    hash: el!.getAttribute('data-hash'),
  };
}

function hrefsOf(menu?: HTMLElement): string[] {
  return menuItems(menu).map((anchor) => anchor.getAttribute('href') ?? '');
}

function cleanup() {
  if (root) {
    const current = root;
    root = null;
    act(() => current.unmount());
  }
  container?.remove();
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('Language menu items are real anchors', () => {
  it('renders five locale options as five <a> elements with valid hrefs', () => {
    renderSelector('/es/calculators?unit=metric#details');
    const items = menuItems(openMenu());

    expect(items).toHaveLength(5);
    for (const anchor of items) {
      expect(anchor.tagName).toBe('A');
    }
    // Route, query and hash are preserved for every locale; English unprefixed.
    expect(hrefsOf()).toEqual([
      '/calculators?unit=metric#details',
      '/es/calculators?unit=metric#details',
      '/pt/calculators?unit=metric#details',
      '/fr/calculators?unit=metric#details',
      '/de/calculators?unit=metric#details',
    ]);
    for (const href of hrefsOf()) {
      const url = new URL(href, 'https://mixtally.com');
      expect(url.origin).toBe('https://mixtally.com');
      expect(url.pathname.startsWith('/')).toBe(true);
      expect(url.pathname === '/en' || url.pathname.startsWith('/en/')).toBe(false);
    }
  });

  it('cancels plain activation so navigation stays in the SPA (no full reload)', () => {
    renderSelector('/es/calculators?unit=metric#details');
    const items = menuItems(openMenu());

    const notCancelled = clickElement(items[4]); // Deutsch
    expect(notCancelled).toBe(false); // defaultPrevented -> browser will not reload
    expect(probe()).toEqual({
      pathname: '/de/calculators',
      search: '?unit=metric',
      hash: '#details',
    });
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('de');
    // The menu closes after selection, exactly like the previous buttons.
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });

  it('keeps native anchor semantics available (focusable, href attribute)', () => {
    renderSelector('/privacy');
    const items = menuItems(openMenu());
    items[0].focus();
    expect(document.activeElement).toBe(items[0]);
    expect(items[0].getAttribute('href')).toBe('/privacy');
  });
});

describe('Locale switching preserves the current equivalent route', () => {
  it('works in all five directions from every locale origin', () => {
    for (const origin of Object.values(LOCATION_PATHS)) {
      for (const target of LOCALES) {
        renderSelector(`${origin}?unit=imperial#top`);
        const items = menuItems(openMenu());
        const index = LOCALES.findIndex((entry) => entry.code === target.code);
        const notCancelled = clickElement(items[index]);

        expect(notCancelled, `${origin} -> ${target.code}`).toBe(false);
        expect(probe().pathname, `${origin} -> ${target.code}`).toBe(LOCATION_PATHS[target.code]);
        expect(probe().search).toBe('?unit=imperial');
        expect(probe().hash).toBe('#top');
        cleanup();
      }
    }
  });

  it('keeps the active locale on the same page without navigating away', () => {
    renderSelector('/pt/guides?unit=metric#top');
    const items = menuItems(openMenu());
    const notCancelled = clickElement(items[2]); // Português, already active

    expect(notCancelled).toBe(false);
    expect(probe()).toEqual({
      pathname: '/pt/guides',
      search: '?unit=metric',
      hash: '#top',
    });
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pt');
  });

  it('canonicalizes the locale home link (from /es/ to /es) as before', () => {
    renderSelector('/es/');
    expect(hrefsOf(openMenu())).toEqual(['/', '/es', '/pt', '/fr', '/de']);

    const items = menuItems();
    clickElement(items[1]); // same locale, trailing-slash form differs
    expect(probe().pathname).toBe('/es');
  });

  it('returns to the unprefixed English home from a localized home', () => {
    renderSelector('/de/');
    const items = menuItems(openMenu());
    clickElement(items[0]); // English

    expect(probe().pathname).toBe('/');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
  });
});

describe('English stays unprefixed', () => {
  it('never generates an /en/ route from any origin', () => {
    for (const origin of Object.values(LOCATION_PATHS)) {
      renderSelector(`${origin}?unit=metric`);
      const hrefs = hrefsOf(openMenu());

      expect(hrefs.some((href) => href.startsWith('/en')), origin).toBe(false);
      expect(hrefs[0], origin).toBe('/privacy?unit=metric');

      clickElement(menuItems()[0]); // follow the English item
      expect(probe().pathname, origin).toBe('/privacy');
      cleanup();
    }
  });
});

describe('Locale precedence and storage behavior', () => {
  it('lets the URL locale win over a stored preference on a fresh load (reload)', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');

    renderSelector('/de/privacy');
    const shortCode = trigger().querySelector('span[class*="hidden"]');
    expect(shortCode?.textContent).toBe('DE');
    // A localized URL synchronizes the stored preference, as before.
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('de');
    expect(hrefsOf(openMenu())).toEqual([
      '/privacy',
      '/es/privacy',
      '/pt/privacy',
      '/fr/privacy',
      '/de/privacy',
    ]);
  });

  it('persists the chosen locale for the next visit', () => {
    renderSelector('/privacy');
    clickElement(menuItems(openMenu())[3]); // Français

    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('fr');
    expect(probe().pathname).toBe('/fr/privacy');
  });
});

describe('Menu design, semantics and responsive behavior are unchanged', () => {
  const ITEM_CLASS =
    'w-full flex items-center gap-3 px-3 py-1.5 rounded-tech text-caption transition-colors';
  const INACTIVE_CLASS =
    'text-slate-700 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-charcoal-800';
  const ACTIVE_CLASS = 'bg-accent/10 text-accent font-semibold';

  it('keeps the exact item styling, labels and active-state icon', () => {
    renderSelector('/es/privacy');
    const menu = openMenu();
    const items = menuItems(menu);

    expect(menu.className).toBe('absolute top-full pt-2 z-50 right-0');
    expect(menu.firstElementChild?.className).toBe(
      'w-52 max-w-full p-1.5 rounded-tech bg-white dark:bg-charcoal-900 border border-paper-300 dark:border-charcoal-700 shadow-tech-elevated',
    );
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'EnglishEN',
      'EspañolES',
      'PortuguêsPT',
      'FrançaisFR',
      'DeutschDE',
    ]);
    // Spanish is active on /es/...
    expect(items[1].className).toBe(`${ITEM_CLASS} ${ACTIVE_CLASS}`);
    expect(items[0].className).toBe(`${ITEM_CLASS} ${INACTIVE_CLASS}`);
    expect(items[1].getAttribute('aria-checked')).toBe('true');
    expect(items[0].getAttribute('aria-checked')).toBe('false');
    // One check icon (active) plus spacer spans for the rest.
    expect(menu.querySelectorAll('svg')).toHaveLength(1);
    expect(menu.querySelectorAll('a[aria-checked="true"]')).toHaveLength(1);
  });

  it('keeps the trigger styling and menu ARIA attributes', () => {
    renderSelector('/privacy');
    const btn = trigger();
    expect(btn.className).toBe(
      'flex items-center gap-1.5 p-2 rounded-tech text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-paper-200 dark:hover:bg-charcoal-800 border border-paper-300 dark:border-charcoal-750 transition-colors',
    );
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
    expect(btn.getAttribute('aria-expanded')).toBe('false');

    const menu = openMenu();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('aria-label')).toBeTruthy();
    expect(menu.getAttribute('role')).toBe('menu');
  });

  it('renders the full-width block variant for the mobile drawer with the same five anchors', () => {
    renderSelector('/fr/contact', 'block');
    const btn = trigger();
    expect(btn.className.startsWith('w-full flex items-center gap-2 px-3 py-2 rounded-tech')).toBe(
      true,
    );

    const menu = openMenu();
    expect(menu.className).toContain('left-0 right-0');
    const hrefs = hrefsOf(menu);
    expect(hrefs).toEqual([
      '/contact',
      '/es/contact',
      '/pt/contact',
      '/fr/contact',
      '/de/contact',
    ]);
    expect(hrefs.some((href) => href.startsWith('/en'))).toBe(false);
  });

  it('closes the menu on Escape, preserving keyboard behavior', () => {
    renderSelector('/privacy');
    openMenu();
    expect(container.querySelector('[role="menu"]')).not.toBeNull();

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });
});
