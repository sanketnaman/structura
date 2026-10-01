import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AppRoot } from './App';

/**
 * Node-compatible server rendering entry (Phase 4H-1).
 *
 * `render(url)` returns the application markup for one URL using the same
 * route tree as the client. Design guarantees:
 *
 * - No browser-only globals: effects never run under renderToString, so
 *   document.head writes (SEO, JSON-LD), the consent timer, theme sync and
 *   scroll handling are all skipped. Analytics never execute here — gtag
 *   scripts only live in the index.html template, not in this markup.
 * - Locale comes from the URL prefix via LocaleProvider; in Node,
 *   localStorage is unreachable (storage.ts guards `typeof window`), so
 *   unprefixed URLs always resolve to English and `/es|pt|fr|de/...`
 *   always resolve to their prefix locale. Tests running under jsdom must
 *   clear `mixtally_locale` before asserting localized output.
 * - Unit query behavior is preserved: the client reads `?unit=` from
 *   window.location on mount; in Node that guard falls back to 'imperial',
 *   which is correct for query-free prerender URLs.
 * - The client keeps the existing createRoot() takeover strategy
 *   (no hydrateRoot) — this markup is a static shell for crawlers.
 */
export function render(url: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <AppRoot />
    </MemoryRouter>,
  );
}
