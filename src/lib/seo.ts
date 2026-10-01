import { siteConfig } from './config/site';
import { getLocaleDefinition, LOCALES, LOCALIZED_PREFIX_CODES, type LocaleCode } from './i18n/config';
import { localizePath, parseLocalePath } from './i18n/routing';

/**
 * Per-locale title/description overrides for a route.
 *
 * English always lives on the top-level `title`/`description` of the registry
 * entry and stays the source of truth; localized pages read their matching
 * `localized[locale]` values, falling back to English only if an entry is
 * missing.
 */
export interface LocalizedSEOFields {
  title?: string;
  description?: string;
}

/** Registry entry: the English source of truth plus optional translations. */
export interface RouteSEOEntry {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  localized?: Partial<Record<LocaleCode, LocalizedSEOFields>>;
}

/** One reciprocal hreflang alternate for the current page. */
export interface HreflangAlternate {
  /** hreflang language code (`en`, `es`, `pt`, `fr`, `de`) or `x-default`. */
  hreflang: string;
  /** Absolute https URL of the equivalent page. */
  href: string;
}

/** Resolved SEO for the page currently being rendered. */
export interface RouteSEO {
  title: string;
  description: string;
  /** Self-referencing localized path (never carries query parameters). */
  canonicalPath?: string;
  noindex?: boolean;
  /** Locale derived from the URL — drives localized canonical/alternates. */
  locale: LocaleCode;
  /** Reciprocal hreflang alternates; empty for unknown/noindex routes. */
  alternates: HreflangAlternate[];
}

export const seoRegistry: Record<string, RouteSEOEntry> = {
  '/': {
    title: `${siteConfig.name} — Construction Calculators & 3D Estimation Tools`,
    description:
      'Interactive construction calculators with 3D visualization for concrete, brick, mortar, paint, and material estimates. Calculate quantities with transparent, configurable assumptions.',
    canonicalPath: '/',
    localized: {
      es: {
        title: `${siteConfig.name} — Calculadoras de construcción y herramientas de estimación 3D`,
        description:
          'Calculadoras de construcción interactivas con visualización 3D para concreto, ladrillo, mortero, pintura y estimación de materiales. Calcula cantidades con supuestos transparentes y configurables.',
      },
      pt: {
        title: `${siteConfig.name} — Calculadoras de construção e ferramentas de estimativa 3D`,
        description:
          'Calculadoras de construção interativas com visualização 3D para concreto, alvenaria, argamassa, tinta e estimativas de materiais. Calcule quantidades com premissas transparentes e configuráveis.',
      },
      fr: {
        title: `${siteConfig.name} — Calculatrices de construction et outils d'estimation 3D`,
        description:
          `Calculatrices de construction interactives avec visualisation 3D pour le béton, la brique, le mortier, la peinture et l'estimation des matériaux. Calculez les quantités avec des hypothèses transparentes et configurables.`,
      },
      de: {
        title: `${siteConfig.name} — Bau-Rechner & 3D-Schätzwerkzeuge`,
        description:
          'Interaktive Bau-Rechner mit 3D-Visualisierung für Beton, Ziegel, Mörtel, Farbe und Materialschätzungen. Berechnen Sie Mengen mit transparenten, konfigurierbaren Annahmen.',
      },
    },
  },
  '/calculators': {
    title: `Construction Calculators — ${siteConfig.name}`,
    description:
      'Explore interactive construction calculators for concrete, brick and mortar, paint, and other building material estimates with 3D visualization.',
    canonicalPath: '/calculators',
    localized: {
      es: {
        title: `Calculadoras de construcción — ${siteConfig.name}`,
        description:
          'Explora calculadoras interactivas de construcción para concreto, ladrillo y mortero, pintura y otros estimados de materiales con visualización 3D.',
      },
      pt: {
        title: `Calculadoras de construção — ${siteConfig.name}`,
        description:
          'Conheça calculadoras de construção interativas para concreto, alvenaria e argamassa, tinta e outros estimativos de materiais com visualização 3D.',
      },
      fr: {
        title: `Calculatrices de construction — ${siteConfig.name}`,
        description:
          `Découvrez des calculatrices de construction interactives pour le béton, la brique et le mortier, la peinture et d'autres estimations de matériaux avec visualisation 3D.`,
      },
      de: {
        title: `Bau-Rechner — ${siteConfig.name}`,
        description:
          'Entdecken Sie interaktive Bau-Rechner für Beton, Ziegel und Mörtel, Farbe und andere Baustoff-Schätzungen mit 3D-Visualisierung.',
      },
    },
  },
  '/calculators/concrete-slab-calculator': {
    title: `Concrete Slab Calculator — 3D Volume & Material Estimate | ${siteConfig.name}`,
    description:
      'Calculate concrete slab volume, cubic yards, cubic feet, material quantities, and planning estimates with an interactive 3D slab visualization.',
    canonicalPath: '/calculators/concrete-slab-calculator',
    localized: {
      es: {
        title: `Calculadora de losa de concreto — Volumen y estimación de materiales en 3D | ${siteConfig.name}`,
        description:
          'Calcula el volumen de una losa de concreto, las cantidades de materiales y los estimados de planificación con una visualización 3D interactiva de la losa.',
      },
      pt: {
        title: `Calculadora de laje de concreto — Volume 3D e estimativa de materiais | ${siteConfig.name}`,
        description:
          'Calcule o volume de uma laje de concreto, as quantidades de materiais e os planejamentos com uma visualização 3D interativa da laje.',
      },
      fr: {
        title: `Calculateur de dalle en béton — Volume 3D et estimation des matériaux | ${siteConfig.name}`,
        description:
          `Calculez le volume d'une dalle en béton, les quantités de matériaux et les estimations de planification grâce à une visualisation 3D interactive de la dalle.`,
      },
      de: {
        title: `Betonplatten-Rechner — 3D-Volumen & Materialschätzung | ${siteConfig.name}`,
        description:
          'Berechnen Sie das Volumen einer Betonplatte, die Materialmengen und die Planungsgrößen mit einer interaktiven 3D-Visualisierung der Platte.',
      },
    },
  },
  '/calculators/brick-mortar-calculator': {
    title: `Brick Calculator — Bricks & Mortar Estimate | ${siteConfig.name}`,
    description:
      'Estimate bricks needed for a wall with this brick calculator: brick quantity, mortar, wall dimensions in metric or imperial, plus interactive 3D visualization.',
    canonicalPath: '/calculators/brick-mortar-calculator',
    localized: {
      es: {
        title: `Calculadora de ladrillos — Estimación de ladrillos y mortero | ${siteConfig.name}`,
        description:
          'Estima los ladrillos necesarios para un muro: cantidad de ladrillos, mortero y dimensiones del muro en metros o pies, con visualización 3D interactiva.',
      },
      pt: {
        title: `Calculadora de tijolos — Estimativa de tijolos e argamassa | ${siteConfig.name}`,
        description:
          'Estime os tijolos necessários para uma parede: quantidade de tijolos, argamassa e dimensões da parede em metros ou pés, com visualização 3D interativa.',
      },
      fr: {
        title: `Calculateur de briques — Estimation de briques et de mortier | ${siteConfig.name}`,
        description:
          'Estimez les briques nécessaires pour un mur : quantité de briques, mortier et dimensions du mur en mètres ou pieds, avec visualisation 3D interactive.',
      },
      de: {
        title: `Ziegelrechner — Ziegel- und Mörtel-Schätzung | ${siteConfig.name}`,
        description:
          'Schätzen Sie die für eine Wand benötigten Ziegel: Anzahl, Mörtel und Wandabmessungen in Metern oder Fuß, mit interaktiver 3D-Visualisierung.',
      },
    },
  },
  '/calculators/paint-calculator': {
    title: `Paint Calculator — Room Paint Quantity Estimate | ${siteConfig.name}`,
    description:
      'Calculate paintable wall area, paint quantity, coats, and planning estimates with an interactive 3D room visualization.',
    canonicalPath: '/calculators/paint-calculator',
    localized: {
      es: {
        title: `Calculadora de pintura — Cantidad de pintura por habitación | ${siteConfig.name}`,
        description:
          'Calcula la superficie de paredes a pintar, la cantidad de pintura, las capas y los estimados de planificación con una visualización 3D interactiva de la habitación.',
      },
      pt: {
        title: `Calculadora de tinta — Quantidade de tinta por cômodo | ${siteConfig.name}`,
        description:
          'Calcule a área de paredes a pintar, a quantidade de tinta, as demãos e os planejamentos com uma visualização 3D interativa do ambiente.',
      },
      fr: {
        title: `Calculateur de peinture — Quantité de peinture par pièce | ${siteConfig.name}`,
        description:
          'Calculez la surface des murs à peindre, la quantité de peinture, le nombre de couches et les estimations de planification avec une visualisation 3D interactive de la pièce.',
      },
      de: {
        title: `Farbrechner — Farbmenge pro Raum | ${siteConfig.name}`,
        description:
          'Berechnen Sie die zu streichende Wandfläche, die Farbmenge, die Anzahl der Schichten und die Planungsgrößen mit einer interaktiven 3D-Visualisierung des Raums.',
      },
    },
  },
  '/guides': {
    title: `Construction Guides & Field References — ${siteConfig.name}`,
    description:
      `Practical construction guides, material references, estimation concepts, and calculator guidance from ${siteConfig.name}.`,
    canonicalPath: '/guides',
    localized: {
      es: {
        title: `Guías de construcción y referencias de campo — ${siteConfig.name}`,
        description:
          `Guías prácticas de construcción, referencias de materiales, conceptos de estimación y orientaciones sobre las calculadoras de ${siteConfig.name}.`,
      },
      pt: {
        title: `Guias de construção e referências de campo — ${siteConfig.name}`,
        description:
          `Guias práticos de construção, referências de materiais, conceitos de estimativa e orientações sobre as calculadoras do ${siteConfig.name}.`,
      },
      fr: {
        title: `Guides de construction et références de terrain — ${siteConfig.name}`,
        description:
          `Guides pratiques de construction, références de matériaux, concepts d'estimation et conseils pour les calculatrices de ${siteConfig.name}.`,
      },
      de: {
        title: `Bauanleitungen & Praxisreferenzen — ${siteConfig.name}`,
        description:
          `Praxisnahe Bauanleitungen, Materialreferenzen, Schätzkonzepte und Anleitungen zu den Rechnern von ${siteConfig.name}.`,
      },
    },
  },
  '/about': {
    title: `About ${siteConfig.name} — Construction Estimation Tools`,
    description:
      `Learn about ${siteConfig.name}, a construction estimation platform focused on transparent calculations, interactive 3D visualization, and practical planning tools.`,
    canonicalPath: '/about',
    localized: {
      es: {
        title: `Acerca de ${siteConfig.name} — Herramientas de estimación de construcción`,
        description:
          `Conoce ${siteConfig.name}, una plataforma de estimación de construcción centrada en cálculos transparentes, visualización 3D interactiva y herramientas prácticas de planificación.`,
      },
      pt: {
        title: `Sobre o ${siteConfig.name} — Ferramentas de estimativa de construção`,
        description:
          `Conheça o ${siteConfig.name}, uma plataforma de estimativa de construção focada em cálculos transparentes, visualização 3D interativa e ferramentas práticas de planejamento.`,
      },
      fr: {
        title: `À propos de ${siteConfig.name} — Outils d'estimation de construction`,
        description:
          `Découvrez ${siteConfig.name}, une plateforme d'estimation de construction axée sur des calculs transparents, une visualisation 3D interactive et des outils de planification pratiques.`,
      },
      de: {
        title: `Über ${siteConfig.name} — Werkzeuge zur Materialschätzung im Bauwesen`,
        description:
          `Erfahren Sie mehr über ${siteConfig.name}, eine Plattform für Materialschätzungen im Bauwesen mit transparenten Berechnungen, interaktiver 3D-Visualisierung und praktischen Planungswerkzeugen.`,
      },
    },
  },
  '/contact': {
    title: `Contact ${siteConfig.name} — Support & Feedback`,
    description:
      `Contact ${siteConfig.name} for support, feedback, calculator questions, and website-related inquiries.`,
    canonicalPath: '/contact',
    localized: {
      es: {
        title: `Contacto con ${siteConfig.name} — Soporte y comentarios`,
        description:
          `Contacta a ${siteConfig.name} para soporte, comentarios, preguntas sobre las calculadoras y consultas relacionadas con el sitio.`,
      },
      pt: {
        title: `Contato com ${siteConfig.name} — Suporte e feedback`,
        description:
          `Entre em contato com o ${siteConfig.name} para suporte, feedback, dúvidas sobre as calculadoras e questões relacionadas ao site.`,
      },
      fr: {
        title: `Contactez ${siteConfig.name} — Assistance et commentaires`,
        description:
          `Contactez ${siteConfig.name} pour toute assistance, commentaire, question sur les calculatrices ou demande relative au site.`,
      },
      de: {
        title: `${siteConfig.name} kontaktieren — Support & Feedback`,
        description:
          `Kontaktieren Sie ${siteConfig.name} für Support, Feedback, Fragen zu den Rechnern oder Anliegen rund um die Website.`,
      },
    },
  },
  '/privacy': {
    title: `Privacy Policy — ${siteConfig.name}`,
    description:
      `Read the ${siteConfig.name} Privacy Policy covering website usage, calculator data, cookies, analytics, advertising, and privacy practices.`,
    canonicalPath: '/privacy',
    localized: {
      es: {
        title: `Política de privacidad — ${siteConfig.name}`,
        description:
          `Consulta la política de privacidad de ${siteConfig.name} sobre el uso del sitio, los datos de las calculadoras, las cookies, la analítica, la publicidad y las prácticas de privacidad.`,
      },
      pt: {
        title: `Política de privacidade — ${siteConfig.name}`,
        description:
          `Leia a política de privacidade do ${siteConfig.name} sobre uso do site, dados das calculadoras, cookies, análise de dados, publicidade e práticas de privacidade.`,
      },
      fr: {
        title: `Politique de confidentialité — ${siteConfig.name}`,
        description:
          `Consultez la politique de confidentialité de ${siteConfig.name} portant sur l'utilisation du site, les données des calculatrices, les cookies, la mesure d'audience, la publicité et les pratiques de confidentialité.`,
      },
      de: {
        title: `Datenschutzerklärung — ${siteConfig.name}`,
        description:
          `Lesen Sie die Datenschutzerklärung von ${siteConfig.name} zur Nutzung der Website, den Rechner-Daten, Cookies, Analysen, Werbung und Datenschutzpraktiken.`,
      },
    },
  },
  '/terms': {
    title: `Terms of Use — ${siteConfig.name}`,
    description:
      `Review the Terms of Use governing access to and use of ${siteConfig.name} construction calculators and website services.`,
    canonicalPath: '/terms',
    localized: {
      es: {
        title: `Términos de uso — ${siteConfig.name}`,
        description:
          `Consulta los términos de uso que rigen el acceso y el uso de las calculadoras de construcción y los servicios del sitio de ${siteConfig.name}.`,
      },
      pt: {
        title: `Termos de uso — ${siteConfig.name}`,
        description:
          `Consulte os termos de uso que regem o acesso e a utilização das calculadoras de construção e dos serviços do site do ${siteConfig.name}.`,
      },
      fr: {
        title: `Conditions d'utilisation — ${siteConfig.name}`,
        description:
          `Consultez les conditions d'utilisation régissant l'accès aux calculatrices de construction et aux services du site de ${siteConfig.name}.`,
      },
      de: {
        title: `Nutzungsbedingungen — ${siteConfig.name}`,
        description:
          `Sehen Sie sich die Nutzungsbedingungen an, die den Zugang und die Nutzung der Bau-Rechner und der Website-Dienste von ${siteConfig.name} regeln.`,
      },
    },
  },
  '/disclaimer': {
    title: `Construction Disclaimer — ${siteConfig.name}`,
    description:
      `Important information about ${siteConfig.name} calculations, assumptions, estimates, and limitations. Review before relying on calculator results.`,
    canonicalPath: '/disclaimer',
    localized: {
      es: {
        title: `Aviso sobre cálculos de construcción — ${siteConfig.name}`,
        description:
          `Información importante sobre los cálculos, supuestos, estimados y limitaciones de ${siteConfig.name}. Revísala antes de usar los resultados de las calculadoras.`,
      },
      pt: {
        title: `Aviso sobre cálculos de construção — ${siteConfig.name}`,
        description:
          `Informações importantes sobre os cálculos, premissas, estimativas e limitações do ${siteConfig.name}. Leia antes de confiar nos resultados das calculadoras.`,
      },
      fr: {
        title: `Avertissement sur les calculs de construction — ${siteConfig.name}`,
        description:
          `Informations importantes sur les calculs, les hypothèses, les estimations et les limites de ${siteConfig.name}. À lire avant de vous fier aux résultats des calculatrices.`,
      },
      de: {
        title: `Hinweis zu Bau-Berechnungen — ${siteConfig.name}`,
        description:
          `Wichtige Informationen zu den Berechnungen, Annahmen, Schätzungen und Einschränkungen von ${siteConfig.name}. Bitte lesen, bevor Sie sich auf die Ergebnisse der Rechner verlassen.`,
      },
    },
  },
  '/cookie-policy': {
    title: `Cookie Policy — ${siteConfig.name}`,
    description:
      `Learn how ${siteConfig.name} uses cookies and similar technologies on the website.`,
    canonicalPath: '/cookie-policy',
    localized: {
      es: {
        title: `Política de cookies — ${siteConfig.name}`,
        description:
          `Conoce cómo ${siteConfig.name} utiliza cookies y tecnologías similares en el sitio.`,
      },
      pt: {
        title: `Política de cookies — ${siteConfig.name}`,
        description:
          `Saiba como o ${siteConfig.name} usa cookies e tecnologias semelhantes no site.`,
      },
      fr: {
        title: `Politique de cookies — ${siteConfig.name}`,
        description:
          `Découvrez comment ${siteConfig.name} utilise les cookies et technologies similaires sur le site.`,
      },
      de: {
        title: `Cookie-Richtlinie — ${siteConfig.name}`,
        description:
          `Erfahren Sie, wie ${siteConfig.name} Cookies und ähnliche Technologien auf der Website einsetzt.`,
      },
    },
  },
  '/advertising': {
    title: `Advertising Disclosure — ${siteConfig.name}`,
    description:
      `Learn how advertising may appear on ${siteConfig.name} and how advertising relationships are disclosed.`,
    canonicalPath: '/advertising',
    localized: {
      es: {
        title: `Divulgación publicitaria — ${siteConfig.name}`,
        description:
          `Conoce cómo puede aparecer la publicidad en ${siteConfig.name} y cómo se informa sobre las relaciones publicitarias.`,
      },
      pt: {
        title: `Divulgação de publicidade — ${siteConfig.name}`,
        description:
          `Saiba como a publicidade pode aparecer no ${siteConfig.name} e como são divulgadas as relações publicitárias.`,
      },
      fr: {
        title: `Divulgation publicitaire — ${siteConfig.name}`,
        description:
          `Découvrez comment la publicité peut apparaître sur ${siteConfig.name} et comment les relations publicitaires sont divulguées.`,
      },
      de: {
        title: `Werbekennzeichnung — ${siteConfig.name}`,
        description:
          `Erfahren Sie, wie Werbung auf ${siteConfig.name} erscheinen kann und wie Werbebeziehungen offengelegt werden.`,
      },
    },
  },
  '404': {
    title: `Page Not Found — ${siteConfig.name}`,
    description: `The page you're looking for could not be found on ${siteConfig.name}.`,
    noindex: true,
  },
};

/** Absolute production URL for a site path (query strings never included). */
export function absoluteSiteUrl(path: string): string {
  if (!path) return `${siteConfig.domain}/`;
  if (path === '/') return `${siteConfig.domain}/`;
  // Locale homepages are served from a directory index (es/index.html), so
  // the URL that actually serves content is `/es/` — and `/es` 307-redirects
  // to it. Every absolute SEO URL (canonical, og:url, hreflang, sitemap,
  // JSON-LD) must declare that same trailing-slash form; the English root
  // stays `/` and `/en/` never exists.
  const isLocaleRoot = LOCALIZED_PREFIX_CODES.some(
    (code) => path === `/${code}` || path === `/${code}/`,
  );
  const normalized = isLocaleRoot && !path.endsWith('/') ? `${path}/` : path;
  return `${siteConfig.domain}${normalized}`;
}

/**
 * Reciprocal hreflang alternates for an equivalent page.
 *
 * Only generates links for routes that exist (the English registry keys), so
 * unknown paths never advertise nonexistent localized URLs. `x-default`
 * points at the unprefixed English URL.
 */
export function buildHreflangAlternates(basePath: string): HreflangAlternate[] {
  if (!Object.prototype.hasOwnProperty.call(seoRegistry, basePath)) return [];
  const alternates: HreflangAlternate[] = LOCALES.map((locale) => ({
    hreflang: locale.hreflang,
    href: absoluteSiteUrl(localizePath(locale.code, basePath)),
  }));
  alternates.push({ hreflang: 'x-default', href: absoluteSiteUrl(basePath) });
  return alternates;
}

function cleanPathname(pathname: string): string {
  const withoutHash = pathname.split('#')[0];
  return withoutHash.split('?')[0];
}

/**
 * Resolves SEO metadata for a URL.
 *
 * - Locale comes from the URL prefix; the canonical is always the
 *   self-referencing localized path (never carries `?unit=` etc.).
 * - Unknown or localized-but-nonexistent paths return the noindex 404 entry
 *   with no canonical and no hreflang alternates.
 * - Localized pages use their `localized[locale]` title/description, with the
 *   English values as the fallback for any missing translation.
 */
export function getRouteSEO(pathname: string): RouteSEO {
  const { locale, basePath } = parseLocalePath(cleanPathname(pathname));
  const entry = seoRegistry[basePath];

  if (!entry) {
    return {
      title: seoRegistry['404'].title,
      description: seoRegistry['404'].description,
      noindex: true,
      locale,
      alternates: [],
    };
  }

  const localized = entry.localized?.[locale];

  return {
    title: localized?.title ?? entry.title,
    description: localized?.description ?? entry.description,
    canonicalPath:
      entry.canonicalPath !== undefined ? localizePath(locale, basePath) : undefined,
    noindex: entry.noindex,
    locale,
    alternates: entry.noindex ? [] : buildHreflangAlternates(basePath),
  };
}

/**
 * Pure description of every head value the runtime <SEO> effect writes.
 *
 * Build-time server rendering and the client-side document.head effect both
 * consume this single shape, so pre-JS HTML and post-hydration metadata can
 * never drift apart. Every value mirrors the historic SEO effect exactly:
 * the same robots directive, the same canonical/og:url construction (absent
 * entirely for noindex 404s), the same Open Graph and Twitter fields, the
 * same `<html lang>` mapping and the same reciprocal hreflang set.
 */
export interface SeoHeadSpec {
  title: string;
  description: string;
  /** Meta robots content — always emitted (`index, follow` / `noindex, nofollow`). */
  robots: string;
  /** Absolute self-referencing canonical, or undefined when no canonical exists. */
  canonicalUrl?: string;
  /** Value for `<html lang>` (e.g. `pt-BR` for Portuguese). */
  htmlLang: string;
  og: {
    title: string;
    description: string;
    type: string;
    siteName: string;
    /** Absolute canonical — undefined means the og:url tag must be absent. */
    url?: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
  };
  /** Reciprocal hreflang alternates; already includes `x-default` when applicable. */
  hreflangs: HreflangAlternate[];
}

/**
 * Builds the head spec for a resolved route. Pure: same input, same output,
 * no browser globals — safe for Node, tests and build-time serialization.
 */
export function buildSeoHeadSpec(seo: RouteSEO): SeoHeadSpec {
  const canonicalUrl =
    seo.canonicalPath !== undefined ? absoluteSiteUrl(seo.canonicalPath) : undefined;

  return {
    title: seo.title,
    description: seo.description,
    robots: seo.noindex ? 'noindex, nofollow' : 'index, follow',
    canonicalUrl,
    htmlLang: getLocaleDefinition(seo.locale).htmlLang,
    og: {
      title: seo.title,
      description: seo.description,
      type: 'website',
      siteName: siteConfig.name,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
    hreflangs: seo.alternates,
  };
}
