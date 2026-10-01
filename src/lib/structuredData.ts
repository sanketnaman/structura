import { siteConfig } from './config/site';
import { BRICK_FAQ } from './calculators/brick/faq';
import { parseLocalePath, localizePath } from './i18n/routing';
import { absoluteSiteUrl } from './seo';

/**
 * Pure builder for the dynamic JSON-LD schemas the runtime
 * <StructuredData> effect injects per route.
 *
 * Schema types, properties and wording are identical to the historic effect
 * output — the effect now calls this function, and build-time server
 * rendering serializes the same result into prerendered HTML, so the two
 * can never drift apart. Schemas match on the locale-stripped path and emit
 * URLs for the locale the URL addresses, so `/es/...` pages carry localized
 * JSON-LD links.
 *
 * Routes outside the special cases (home, calculators directory, the three
 * calculators) intentionally emit no dynamic schema — matching the existing
 * behavior where legal/guides pages only carry the site-level
 * application/ld+json from index.html.
 */
export function buildStructuredDataSchemas(pathname: string): Record<string, unknown>[] {
  const { locale, basePath } = parseLocalePath(pathname);
  const siteUrl = (target: string) => absoluteSiteUrl(localizePath(locale, target));

  const schemas: Record<string, unknown>[] = [];

  if (basePath === '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteUrl('/'),
    });
  } else if (basePath === '/calculators') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: siteUrl('/calculators') },
      ],
    });
  } else if (basePath === '/calculators/concrete-slab-calculator') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Concrete Slab Calculator',
      url: siteUrl('/calculators/concrete-slab-calculator'),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description:
        'Calculate concrete slab volume, cubic yards, cubic feet, material quantities, and planning estimates with an interactive 3D slab visualization.',
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: siteUrl('/calculators') },
        { '@type': 'ListItem', position: 3, name: 'Concrete Slab Calculator', item: siteUrl('/calculators/concrete-slab-calculator') },
      ],
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many 80 lb bags of concrete equal one cubic yard?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'One 80-pound bag yields approximately 0.60 cubic feet. Since one cubic yard contains 27 cubic feet, it mathematically requires approximately 45 bags of 80 lb concrete (or 60 bags of 60 lb concrete) per cubic yard based on this planning assumption.',
          },
        },
        {
          '@type': 'Question',
          name: 'How thick should a concrete slab be?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sidewalks, walkways, and patios typically require 4 inches (10 cm). Vehicle driveways, garage slabs, and heavy storage pads require a minimum of 5 to 6 inches (13 to 15 cm) with steel rebar or wire mesh reinforcement.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does a cubic yard of concrete weigh?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Standard normal-weight concrete weighs approximately 4,050 lbs (about 2 tons or 1,840 kg) per cubic yard when wet.',
          },
        },
      ],
    });
  } else if (basePath === '/calculators/brick-mortar-calculator') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Brick Calculator',
      url: siteUrl('/calculators/brick-mortar-calculator'),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description:
        'Estimate bricks needed for a wall with this brick calculator: brick quantity, mortar, wall dimensions in metric or imperial, plus interactive 3D visualization.',
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: siteUrl('/calculators') },
        { '@type': 'ListItem', position: 3, name: 'Brick Calculator', item: siteUrl('/calculators/brick-mortar-calculator') },
      ],
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: BRICK_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  } else if (basePath === '/calculators/paint-calculator') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Paint Calculator',
      url: siteUrl('/calculators/paint-calculator'),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description:
        'Calculate paintable wall area, paint quantity, coats, and planning estimates with an interactive 3D room visualization.',
    });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: siteUrl('/calculators') },
        { '@type': 'ListItem', position: 3, name: 'Paint Calculator', item: siteUrl('/calculators/paint-calculator') },
      ],
    });
  }

  return schemas;
}
