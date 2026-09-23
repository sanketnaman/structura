import { siteConfig } from './config/site';

export interface RouteSEO {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
}

export const seoRegistry: Record<string, RouteSEO> = {
  '/': {
    title: `${siteConfig.name} — Construction Calculators & 3D Estimation Tools`,
    description:
      'Interactive construction calculators with 3D visualization for concrete, brick, mortar, paint, and material estimates. Calculate quantities with transparent, configurable assumptions.',
    canonicalPath: '/',
  },
  '/calculators': {
    title: `Construction Calculators — ${siteConfig.name}`,
    description:
      'Explore interactive construction calculators for concrete, brick and mortar, paint, and other building material estimates with 3D visualization.',
    canonicalPath: '/calculators',
  },
  '/calculators/concrete-slab-calculator': {
    title: `Concrete Slab Calculator — 3D Volume & Material Estimate | ${siteConfig.name}`,
    description:
      'Calculate concrete slab volume, cubic yards, cubic feet, material quantities, and planning estimates with an interactive 3D slab visualization.',
    canonicalPath: '/calculators/concrete-slab-calculator',
  },
  '/calculators/brick-mortar-calculator': {
    title: `Brick & Mortar Calculator — 3D Material Estimate | ${siteConfig.name}`,
    description:
      'Estimate bricks, mortar, wall area, and material quantities with an interactive 3D brick wall calculator and transparent assumptions.',
    canonicalPath: '/calculators/brick-mortar-calculator',
  },
  '/calculators/paint-calculator': {
    title: `Paint Calculator — Room Paint Quantity Estimate | ${siteConfig.name}`,
    description:
      'Calculate paintable wall area, paint quantity, coats, and planning estimates with an interactive 3D room visualization.',
    canonicalPath: '/calculators/paint-calculator',
  },
  '/guides': {
    title: `Construction Guides & Field References — ${siteConfig.name}`,
    description:
      'Practical construction guides, material references, estimation concepts, and calculator guidance from STRUCTURA.',
    canonicalPath: '/guides',
  },
  '/about': {
    title: `About ${siteConfig.name} — Construction Estimation Tools`,
    description:
      'Learn about STRUCTURA, a construction estimation platform focused on transparent calculations, interactive 3D visualization, and practical planning tools.',
    canonicalPath: '/about',
  },
  '/contact': {
    title: `Contact ${siteConfig.name} — Support & Feedback`,
    description:
      'Contact STRUCTURA for support, feedback, calculator questions, and website-related inquiries.',
    canonicalPath: '/contact',
  },
  '/privacy': {
    title: `Privacy Policy — ${siteConfig.name}`,
    description:
      'Read the STRUCTURA Privacy Policy covering website usage, calculator data, cookies, analytics, advertising, and privacy practices.',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: `Terms of Use — ${siteConfig.name}`,
    description:
      'Review the Terms of Use governing access to and use of STRUCTURA construction calculators and website services.',
    canonicalPath: '/terms',
  },
  '/disclaimer': {
    title: `Construction Disclaimer — ${siteConfig.name}`,
    description:
      'Important information about STRUCTURA calculations, assumptions, estimates, and limitations. Review before relying on calculator results.',
    canonicalPath: '/disclaimer',
  },
  '/cookie-policy': {
    title: `Cookie Policy — ${siteConfig.name}`,
    description:
      'Learn how STRUCTURA uses cookies and similar technologies on the website.',
    canonicalPath: '/cookie-policy',
  },
  '/advertising': {
    title: `Advertising Disclosure — ${siteConfig.name}`,
    description:
      'Learn how advertising may appear on STRUCTURA and how advertising relationships are disclosed.',
    canonicalPath: '/advertising',
  },
  '404': {
    title: `Page Not Found — ${siteConfig.name}`,
    description: `The page you're looking for could not be found on ${siteConfig.name}.`,
    noindex: true,
  },
};

export function getRouteSEO(pathname: string): RouteSEO {
  return seoRegistry[pathname] || seoRegistry['404'];
}
