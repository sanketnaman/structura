import React, { useEffect } from 'react';
import { DEFAULT_LOCALE, type LocaleCode } from '../../lib/i18n/config';
import { buildSeoHeadSpec, type HreflangAlternate, type RouteSEO } from '../../lib/seo';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  /** Rendered locale — drives the runtime <html lang> attribute. */
  locale?: LocaleCode;
  /** Reciprocal hreflang alternates for the current page (none for 404s). */
  alternates?: HreflangAlternate[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath,
  noindex = false,
  locale = DEFAULT_LOCALE,
  alternates = [],
}) => {
  useEffect(() => {
    // All head values come from the shared pure builder so this effect and
    // build-time prerendering always write exactly the same metadata.
    const routeSeo: RouteSEO = { title, description, canonicalPath, noindex, locale, alternates };
    const spec = buildSeoHeadSpec(routeSeo);

    // 1. Title
    document.title = spec.title;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', spec.description);

    // 3. Robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', spec.robots);

    // 4. Canonical (localized, self-referencing, never carries a query string)
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (spec.canonicalUrl !== undefined) {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', spec.canonicalUrl);
    } else {
      if (linkCanonical) {
        linkCanonical.remove();
      }
    }

    // 5. Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', spec.og.title);
    updateOgTag('og:description', spec.og.description);
    updateOgTag('og:type', spec.og.type);
    updateOgTag('og:site_name', spec.og.siteName);
    if (spec.og.url !== undefined) {
      updateOgTag('og:url', spec.og.url);
    } else {
      const ogUrlTag = document.querySelector('meta[property="og:url"]');
      if (ogUrlTag) ogUrlTag.remove();
    }

    // 6. Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', spec.twitter.card);
    updateTwitterTag('twitter:title', spec.twitter.title);
    updateTwitterTag('twitter:description', spec.twitter.description);

    // 7. <html lang> follows the locale actually being rendered
    document.documentElement.lang = spec.htmlLang;

    // 8. hreflang alternates — replaced wholesale so stale sets never linger
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((link) => link.remove());
    spec.hreflangs.forEach((alternate) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alternate.hreflang);
      link.setAttribute('href', alternate.href);
      document.head.appendChild(link);
    });
  }, [title, description, canonicalPath, noindex, locale, alternates]);

  return null;
};
