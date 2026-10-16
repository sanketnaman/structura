import { siteConfig } from './config/site';
import {
  BRICK_FAQ_ANSWER_KEYS,
  BRICK_FAQ_QUESTION_KEYS,
} from './calculators/brick/faq';
import { parseLocalePath, localizePath } from './i18n/routing';
import { translate } from './i18n/translate';
import type { TranslationKey } from './i18n/dictionaries';
import { absoluteSiteUrl, getRouteSEO } from './seo';
import { buildArticleSchemas, buildBlogListingSchemas } from './blog/structuredData';
import { isArticleBasePath } from './blog/registry';

/**
 * Pure builder for the dynamic JSON-LD schemas the runtime
 * <StructuredData> effect injects per route.
 *
 * Schema types, properties and wording are localized: application names and
 * breadcrumb labels resolve through the i18n dictionary, calculator
 * descriptions reuse the localized seoRegistry descriptions, and FAQPage
 * entries map the same dictionary keys the visible FAQ sections render, so
 * the schema always matches the page content per locale. The effect now
 * calls this function, and build-time server rendering serializes the same
 * result into prerendered HTML, so the two can never drift apart. Schemas
 * match on the locale-stripped path and emit URLs for the locale the URL
 * addresses, so `/es/...` pages carry localized JSON-LD links.
 *
 * Blog routes delegate to `blog/structuredData.ts`: the listing emits a
 * `BreadcrumbList`, and each article emits `Article` + `BreadcrumbList`.
 * Routes outside the special cases (home, calculators directory, the three
 * calculators) intentionally emit no dynamic schema — matching the existing
 * behavior where legal/guides pages only carry the site-level
 * application/ld+json from index.html.
 */
export function buildStructuredDataSchemas(pathname: string): Record<string, unknown>[] {
  const { locale, basePath } = parseLocalePath(pathname);
  const siteUrl = (target: string) => absoluteSiteUrl(localizePath(locale, target));
  const t = (key: TranslationKey) => translate(locale, key);
  const routeDescription = (target: string) =>
    getRouteSEO(localizePath(locale, target)).description;

  const schemas: Record<string, unknown>[] = [];

  if (basePath === '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteUrl('/'),
    });
  } else if (basePath === '/blog') {
    schemas.push(...buildBlogListingSchemas(locale));
  } else if (isArticleBasePath(basePath)) {
    schemas.push(...buildArticleSchemas(basePath, locale));
  } else if (basePath === '/calculators') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('common.home'), item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: t('common.calculators'), item: siteUrl('/calculators') },
      ],
    });
  } else if (basePath === '/calculators/concrete-slab-calculator') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t('nav.concreteSlabCalculator'),
      url: siteUrl('/calculators/concrete-slab-calculator'),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description: routeDescription('/calculators/concrete-slab-calculator'),
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('common.home'), item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: t('common.calculators'), item: siteUrl('/calculators') },
        { '@type': 'ListItem', position: 3, name: t('nav.concreteSlabCalculator'), item: siteUrl('/calculators/concrete-slab-calculator') },
      ],
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: t('concrete.faqQ1'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: t('concrete.faqA1'),
          },
        },
        {
          '@type': 'Question',
          name: t('concrete.faqQ2'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: t('concrete.faqA2'),
          },
        },
        {
          '@type': 'Question',
          name: t('concrete.faqQ3'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: t('concrete.faqA3'),
          },
        },
      ],
    });
  } else if (basePath === '/calculators/brick-mortar-calculator') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t('nav.brickMortarCalculator'),
      url: siteUrl('/calculators/brick-mortar-calculator'),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description: routeDescription('/calculators/brick-mortar-calculator'),
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('common.home'), item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: t('common.calculators'), item: siteUrl('/calculators') },
        { '@type': 'ListItem', position: 3, name: t('nav.brickMortarCalculator'), item: siteUrl('/calculators/brick-mortar-calculator') },
      ],
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: BRICK_FAQ_QUESTION_KEYS.map((questionKey, index) => ({
        '@type': 'Question',
        name: t(questionKey),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(BRICK_FAQ_ANSWER_KEYS[index]),
        },
      })),
    });
  } else if (basePath === '/calculators/paint-calculator') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t('nav.paintCalculator'),
      url: siteUrl('/calculators/paint-calculator'),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description: routeDescription('/calculators/paint-calculator'),
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('common.home'), item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: t('common.calculators'), item: siteUrl('/calculators') },
        { '@type': 'ListItem', position: 3, name: t('nav.paintCalculator'), item: siteUrl('/calculators/paint-calculator') },
      ],
    });
  }

  return schemas;
}
