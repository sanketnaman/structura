import React, { useEffect } from 'react';
import { siteConfig } from '../../lib/config/site';

interface StructuredDataProps {
  pathname: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ pathname }) => {
  useEffect(() => {
    // Remove any existing dynamic structura json-ld scripts on route change
    const existingScripts = document.querySelectorAll('script[data-structura-ld="true"]');
    existingScripts.forEach((script) => script.remove());

    const schemas: object[] = [];

    if (pathname === '/') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.domain,
      });
    } else if (pathname === '/calculators') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.domain}/` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteConfig.domain}/calculators` },
        ],
      });
    } else if (pathname === '/calculators/concrete-slab-calculator') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Concrete Slab Calculator',
        url: `${siteConfig.domain}/calculators/concrete-slab-calculator`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description:
          'Calculate concrete slab volume, cubic yards, cubic feet, material quantities, and planning estimates with an interactive 3D slab visualization.',
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.domain}/` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteConfig.domain}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'Concrete Slab Calculator', item: `${siteConfig.domain}/calculators/concrete-slab-calculator` },
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
    } else if (pathname === '/calculators/brick-mortar-calculator') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Brick & Mortar Calculator',
        url: `${siteConfig.domain}/calculators/brick-mortar-calculator`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description:
          'Estimate bricks, mortar, wall area, and material quantities with an interactive 3D brick wall calculator and transparent assumptions.',
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.domain}/` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteConfig.domain}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'Brick & Mortar Calculator', item: `${siteConfig.domain}/calculators/brick-mortar-calculator` },
        ],
      });
    } else if (pathname === '/calculators/paint-calculator') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Paint Calculator',
        url: `${siteConfig.domain}/calculators/paint-calculator`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description:
          'Calculate paintable wall area, paint quantity, coats, and planning estimates with an interactive 3D room visualization.',
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.domain}/` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteConfig.domain}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'Paint Calculator', item: `${siteConfig.domain}/calculators/paint-calculator` },
        ],
      });
    }

    schemas.forEach((schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structura-ld', 'true');
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });

    return () => {
      const cleanupScripts = document.querySelectorAll('script[data-structura-ld="true"]');
      cleanupScripts.forEach((script) => script.remove());
    };
  }, [pathname]);

  return null;
};
