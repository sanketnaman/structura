import { siteConfig } from './config/site';
import { getLocaleDefinition, LOCALES, LOCALIZED_PREFIX_CODES, type LocaleCode } from './i18n/config';
import { localizePath, parseLocalePath } from './i18n/routing';
import { isArticleBasePath, articleSlugFromBasePath, getArticleBySlug, hasFullArticleTranslationSet } from './blog/registry';
import { resolveArticleRouteSEO } from './blog/seo';

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

/** Social share image attached to a route (currently blog articles). */
export interface RouteSEOImage {
  /** Root-relative path under `public/`, resolved to an absolute URL. */
  src: string;
  width: number;
  height: number;
  alt: string;
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
  /** Optional og:image / twitter:image source. */
  image?: RouteSEOImage;
  /** `og:type` — defaults to `website`; blog articles emit `article`. */
  ogType?: string;
}

export const seoRegistry: Record<string, RouteSEOEntry> = {
  '/': {
    title: `${siteConfig.name} — Construction Calculators & 3D Estimation Tools`,
    description:
      'Interactive construction calculators with 3D visualization for concrete, brick, mortar, paint, and material estimates. Calculate quantities with transparent, configurable assumptions.',
    canonicalPath: '/',
    localized: {
      es: {
        title: `${siteConfig.name} — Calculadoras de construcción 3D`,
        description:
          'Calculadoras de construcción con visualización 3D para concreto, ladrillo, mortero y pintura. Calcula cantidades con supuestos transparentes.',
      },
      pt: {
        title: `${siteConfig.name} — Calculadoras de construção com 3D`,
        description:
          'Calculadoras de construção com visualização 3D para concreto, alvenaria, argamassa e tinta. Calcule quantidades com premissas transparentes.',
      },
      fr: {
        title: `${siteConfig.name} — Calculatrices de construction 3D`,
        description:
          `Calculatrices de construction avec visualisation 3D pour béton, brique, mortier et peinture. Calculez les quantités avec des hypothèses transparentes.`,
      },
      de: {
        title: `${siteConfig.name} — Bau-Rechner mit 3D-Visualisierung`,
        description:
          'Interaktive Bau-Rechner mit 3D-Visualisierung für Beton, Ziegel, Mörtel und Farbe. Berechnen Sie Mengen mit transparenten Annahmen.',
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
          'Conheça calculadoras de construção interativas para concreto, alvenaria e argamassa, tinta e outras estimativas de materiais com visualização 3D.',
      },
      fr: {
        title: `Calculatrices de construction — ${siteConfig.name}`,
        description:
          `Découvrez des calculatrices de construction pour le béton, la brique, le mortier et la peinture, avec visualisation 3D.`,
      },
      de: {
        title: `Bau-Rechner — ${siteConfig.name}`,
        description:
          'Entdecken Sie interaktive Bau-Rechner für Beton, Ziegel und Mörtel, Farbe und andere Baustoff-Schätzungen mit 3D-Visualisierung.',
      },
    },
  },
  // TODO(needs native review): localized calculator titles/descriptions below
  // were rewritten for search intent (Phase 4) — ≤60/≤155 chars, one clear
  // phrase per page, no keyword stuffing. English entries stay untouched.
  '/calculators/concrete-slab-calculator': {
    title: `Concrete Slab Calculator — 3D Volume & Material Estimate | ${siteConfig.name}`,
    description:
      'Calculate concrete slab volume, cubic yards, cubic feet, material quantities, and planning estimates with an interactive 3D slab visualization.',
    canonicalPath: '/calculators/concrete-slab-calculator',
    localized: {
      es: {
        title: `Calculadora de concreto para losa: m³ y sacos | ${siteConfig.name}`,
        description:
          'Calcula el volumen de la losa en m³ y los sacos de concreto necesarios, con fórmulas transparentes y visualización 3D interactiva.',
      },
      pt: {
        title: `Calculadora de concreto para laje: m³ e sacos | ${siteConfig.name}`,
        description:
          'Calcule o volume da laje em m³ e os sacos de concreto necessários, com fórmulas transparentes e visualização 3D interativa.',
      },
      fr: {
        title: `Calcul dalle béton : volume en m³ et sacs | ${siteConfig.name}`,
        description:
          `Ce calcul dalle béton détermine le volume en m³ et les sacs nécessaires, avec des formules transparentes et une visualisation 3D interactive.`,
      },
      de: {
        title: `Betonbedarf berechnen: Platte in m³ & Säcke | ${siteConfig.name}`,
        description:
          'Berechnen Sie das Plattenvolumen in m³ und die benötigten Betonsäcke – mit transparenten Formeln und interaktiver 3D-Visualisierung.',
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
        title: `Calculadora de ladrillos: cantidad y mortero | ${siteConfig.name}`,
        description:
          'Estima los ladrillos y el mortero que necesitas para un muro: cantidades en metros o pies, juntas incluidas y visualización 3D interactiva.',
      },
      pt: {
        title: `Calculadora de tijolos: quantidade e argamassa | ${siteConfig.name}`,
        description:
          'Estime os tijolos e a argamassa para uma parede: quantidades em metros ou pés, juntas incluídas e visualização 3D interativa.',
      },
      fr: {
        title: `Calcul de briques et mortier au m² | ${siteConfig.name}`,
        description:
          'Estimez les briques et le mortier pour un mur : quantités en mètres ou pieds, joints compris et visualisation 3D interactive.',
      },
      de: {
        title: `Ziegelrechner: Ziegel & Mörtel pro m² | ${siteConfig.name}`,
        description:
          'Schätzen Sie Ziegel und Mörtel für eine Wand: Mengen in Metern oder Fuß, Fugen inklusive und interaktive 3D-Visualisierung.',
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
        title: `Calculadora de pintura por m²: litros y galones | ${siteConfig.name}`,
        description:
          'Calcula la superficie a pintar en m², la cantidad de pintura en litros o galones y las capas, con deducción de puertas y ventanas y vista 3D.',
      },
      pt: {
        title: `Calculadora de tinta: litros por m² | ${siteConfig.name}`,
        description:
          'Calcule a área de paredes em m², a quantidade de tinta em litros ou galões e as demãos, com desconto de portas e janelas e visualização 3D.',
      },
      fr: {
        title: `Calcul de peinture par m² : litres | ${siteConfig.name}`,
        description:
          'Calculez la surface à peindre en m², la quantité de peinture en litres ou gallons et le nombre de couches, avec déduction des ouvertures et vue 3D.',
      },
      de: {
        title: `Farbbedarf berechnen: Farbrechner pro m² | ${siteConfig.name}`,
        description:
          'Berechnen Sie die Wandfläche in m², die Farbmenge in Litern oder Gallonen und die Schichten – mit Abzügen für Türen und Fenster und 3D-Ansicht.',
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
  '/blog': {
    title: `Construction Blog — ${siteConfig.name}`,
    description:
      'Practical construction calculation guides from MixTally: concrete slab volume, masonry takeoffs, paint coverage and estimating walkthroughs with worked examples.',
    canonicalPath: '/blog',
    localized: {
      es: {
        title: `Blog de construcción — ${siteConfig.name}`,
        description:
          'Guías de cálculos de construcción de MixTally: volumen de losas, estimaciones de mampostería, cobertura de pintura y ejemplos resueltos.',
      },
      pt: {
        title: `Blog de construção — ${siteConfig.name}`,
        description:
          'Guias práticos de cálculos de construção do MixTally: volume de lajes de concreto, estimativas de alvenaria, cobertura de tinta e exemplos resolvidos.',
      },
      fr: {
        title: `Blog de construction — ${siteConfig.name}`,
        description:
          `Guides pratiques de calculs de construction MixTally : volume de dalle en béton, estimations de maçonnerie, couverture de peinture et exemples résolus.`,
      },
      de: {
        title: `Bau-Blog — ${siteConfig.name}`,
        description:
          'Praxisnahe Bau-Rechenleitfäden von MixTally: Betonplattenvolumen, Mauerwerksberechnung, Farbdeckung und durchgerechnete Beispiele.',
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
        title: `Acerca de ${siteConfig.name} — Estimación de construcción`,
        description:
          `Conoce ${siteConfig.name}, plataforma de estimación con cálculos transparentes, visualización 3D y herramientas de planificación.`,
      },
      pt: {
        title: `Sobre o ${siteConfig.name} — Estimativa de construção`,
        description:
          `Conheça o ${siteConfig.name}, plataforma de estimativa com cálculos transparentes, visualização 3D e ferramentas de planejamento.`,
      },
      fr: {
        title: `À propos de ${siteConfig.name} — Estimation de construction`,
        description:
          `Découvrez ${siteConfig.name}, plateforme d'estimation avec calculs transparents, visualisation 3D et outils de planification.`,
      },
      de: {
        title: `Über ${siteConfig.name} — Materialschätzung im Bauwesen`,
        description:
          `Erfahren Sie mehr über ${siteConfig.name}: Plattform für Materialschätzungen mit transparenten Berechnungen, 3D-Visualisierung und Planungswerkzeugen.`,
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
          `Consulta la política de privacidad de ${siteConfig.name}: uso del sitio, datos de las calculadoras, cookies, analítica y publicidad.`,
      },
      pt: {
        title: `Política de privacidade — ${siteConfig.name}`,
        description:
          `Leia a política de privacidade do ${siteConfig.name} sobre uso do site, dados das calculadoras, cookies, análise de dados, publicidade e práticas de privacidade.`,
      },
      fr: {
        title: `Politique de confidentialité — ${siteConfig.name}`,
        description:
          `Consultez la politique de confidentialité de ${siteConfig.name} : utilisation du site, données des calculatrices, cookies et publicité.`,
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
          `Informations sur les calculs, hypothèses et limites de ${siteConfig.name}. À lire avant de vous fier aux résultats.`,
      },
      de: {
        title: `Hinweis zu Bau-Berechnungen — ${siteConfig.name}`,
        description:
          `Wichtige Informationen zu Berechnungen, Annahmen und Einschränkungen von ${siteConfig.name}. Bitte lesen, bevor Sie sich auf die Ergebnisse verlassen.`,
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
        title: `Política de cookies do site — ${siteConfig.name}`,
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

/**
 * Reciprocal hreflang alternates for a blog article.
 *
 * Articles ship the same five-language translation set the rest of the site
 * uses, so they advertise the identical cluster: `en`, `es`, `pt`, `fr`, `de`
 * with `x-default` pointing at the unprefixed English URL. An article whose
 * translation set is incomplete publishes no hreflang at all, because claiming
 * an alternation that does not exist would be worse than claiming none.
 */
export function buildArticleHreflangAlternates(basePath: string): HreflangAlternate[] {
  const slug = articleSlugFromBasePath(basePath);
  if (!slug) return [];
  const article = getArticleBySlug(slug);
  if (!article || !hasFullArticleTranslationSet(article)) return [];

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
 * - `/blog/<slug>` resolves through the article registry: the localized copy
 *   supplies the title and description, the canonical is the self-referencing
 *   localized article path, and the full hreflang cluster is attached here
 *   (`blog/seo.ts` stays free of a runtime import back into this module).
 * - Unknown or localized-but-nonexistent paths return the noindex 404 entry
 *   with no canonical and no hreflang alternates.
 * - Localized pages use their `localized[locale]` title/description, with the
 *   English values as the fallback for any missing translation.
 */
export function getRouteSEO(pathname: string): RouteSEO {
  const { locale, basePath } = parseLocalePath(cleanPathname(pathname));

  if (isArticleBasePath(basePath)) {
    const articleSeo = resolveArticleRouteSEO(
      basePath,
      locale,
      buildArticleHreflangAlternates(basePath),
    );
    if (articleSeo) return articleSeo;
    return notFoundSeo(locale);
  }

  const entry = seoRegistry[basePath];

  if (!entry) {
    return notFoundSeo(locale);
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

function notFoundSeo(locale: LocaleCode): RouteSEO {
  return {
    title: seoRegistry['404'].title,
    description: seoRegistry['404'].description,
    noindex: true,
    locale,
    alternates: [],
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
 * same `<html lang>` mapping and the same reciprocal hreflang set. Routes
 * that carry a social image additionally emit `og:image`, `og:image:width`,
 * `og:image:height`, `og:image:alt`, `twitter:image` and `twitter:image:alt`.
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
    /** Absolute social image URL, present only when the route defines one. */
    image?: {
      url: string;
      width: number;
      height: number;
      alt: string;
    };
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    /** Absolute social image URL, present only when the route defines one. */
    image?: {
      url: string;
      alt: string;
    };
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
  const image =
    seo.image !== undefined
      ? {
          url: absoluteSiteUrl(seo.image.src),
          width: seo.image.width,
          height: seo.image.height,
          alt: seo.image.alt,
        }
      : undefined;

  return {
    title: seo.title,
    description: seo.description,
    robots: seo.noindex ? 'noindex, nofollow' : 'index, follow',
    canonicalUrl,
    htmlLang: getLocaleDefinition(seo.locale).htmlLang,
    og: {
      title: seo.title,
      description: seo.description,
      type: seo.ogType ?? 'website',
      siteName: siteConfig.name,
      url: canonicalUrl,
      image,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      image: image !== undefined ? { url: image.url, alt: image.alt } : undefined,
    },
    hreflangs: seo.alternates,
  };
}
