import { DEFAULT_LOCALE, LOCALIZED_PREFIX_CODES, type LocaleCode } from '../i18n/config';
import { localizePath } from '../i18n/routing';
import {
  ARTICLE_CATEGORIES,
  ARTICLE_LOCALES,
  isArticleCategory,
  type ArticleBlock,
  type ArticleDefinition,
  type ArticleHeadingBlock,
  type ArticleLocale,
  type ArticleTranslation,
} from './types';

/**
 * The single blog article registry.
 *
 * Mirrors the conventions of `src/lib/tools/registry.ts`: plain typed data,
 * no React, no browser globals, safe to import from the SSR bundle, the
 * prerender pipeline, the sitemap generator and tests alike.
 *
 * Adding an article = appending one entry here, together with its es/pt/fr/de
 * translations (all four are mandatory). Routes, listing cards, SEO
 * metadata, JSON-LD, sitemap entries and prerendered documents are all
 * derived from this list.
 *
 * Article copy lives here and nowhere else — never in the i18n dictionaries,
 * which only carry the interface chrome around the article.
 */

/** Calculator views an article CTA may point at (implemented tools only). */
export const VALID_CALCULATOR_VIEWS = [
  'concrete-slab-calculator',
  'brick-mortar-calculator',
  'paint-calculator',
] as const;

/**
 * Temporary social-share image.
 *
 * A dedicated 1200x630 OG asset is still required (see the report): the
 * existing 900x600 local WebP is reused here so no broken or invented URL is
 * ever published. Dimensions emitted in the metadata match the real file.
 */
const CONCRETE_SLAB_IMAGE = {
  src: '/images/construction/concrete-slab-construction.webp',
  alt: 'Freshly poured concrete slab being levelled on a prepared construction site',
  width: 900,
  height: 600,
} as const;

const SUBGRADE_FIGURE = {
  src: '/images/guides/concrete-subgrade-guide.webp',
  alt: 'Crushed stone subbase spread along a shored foundation trench',
  width: 900,
  height: 600,
} as const;

/** Original local illustrations authored for the 10x10 slab article. */
const TEN_BY_TEN_IMAGE = {
  src: '/images/blog/10x10-concrete-slab-quantity.webp',
  alt: 'Isometric illustration of a square concrete slab with dimension arrows on a measured grid',
  width: 1200,
  height: 630,
} as const;

const SLAB_CROSS_SECTION_FIGURE = {
  src: '/images/blog/concrete-slab-cross-section.webp',
  alt: 'Cutaway illustration of a concrete slab above a compacted granular base and natural soil',
  width: 1200,
  height: 900,
} as const;

const VOLUME_FORMULA_FIGURE = {
  src: '/images/blog/10x10-concrete-volume-formula.webp',
  alt: 'Five numbered steps showing the conversion from slab thickness to a cubic yard order quantity',
  width: 1200,
  height: 900,
} as const;

const DELIVERY_COMPARISON_FIGURE = {
  src: '/images/blog/ready-mix-vs-bagged-concrete.webp',
  alt: 'Split illustration of a ready-mix truck discharging into a form beside stacked bags and a drum mixer',
  width: 1200,
  height: 900,
} as const;

/**
 * Original article hero for the paint quantity guide: a 1536x1024 local WebP
 * carrying the article title and the worked-example figures. Documented in
 * `public/images/blog/README.md`, which the blog image tests assert.
 */
const PAINT_ROOM_HERO_IMAGE = {
  src: '/images/blog/how-much-paint-room.webp',
  alt: 'Room mid-paint with teal walls and 12 ft by 8 ft dimension arrows, paint cans and a roller tray on a drop cloth, and a notebook showing the 384 sq ft wall area and 1.9 gallon result',
  width: 1536,
  height: 1024,
} as const;

/** Licensed local photograph from `public/images/guides/README.md`. */
const PAINT_ROLLER_FIGURE = {
  src: '/images/guides/paint-coverage-guide.webp',
  alt: 'A roller spreading a fresh coat of paint across a wall in long even passes',
  width: 900,
  height: 600,
} as const;

const concreteVolumeEs: ArticleTranslation = {
  imageAlt: 'Losa de concreto recién vaciada que se nivela en una obra de construcción preparada',
  ogImageAlt: 'Losa de concreto recién vaciada que se nivela en una obra de construcción preparada',
  title: 'Cómo calcular el volumen de concreto para una losa',
  description:
    'Aprende la fórmula de volumen de la losa, trabaja ejemplos imperiales y métricas, convierte pies cúbicos a yardas cúbicas y elige un margen de pedido.',
  excerpt:
    'La fórmula de volumen de la losa, dos ejemplos resueltos en unidades imperiales y métricas, conversiones de unidad y cómo convertir un volumen geométrico en una cantidad de pedido sensata.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'when-you-need-the-volume',
      text: 'Cuándo y por qué se calcula el volumen de la losa',
    },
    {
      type: 'paragraph',
      text: 'El concreto se compra por volumen: yardas cúbicas en los proyectos imperiales y metros cúbicos en los métricos. Esa cifra se necesita antes del vaciado por tres razones prácticas. Primero, los proveedores de concreto premezclado cotizan y despachan por volumen, de modo que no puede hacerse un pedido sin ella. Segundo, la mezcla en bolsas se vende en presentaciones fijas, y las bolsas solo pueden contarse cuando ya se conoce el volumen. Tercero, la cifra de volumen es la única manera de verificar que una estimación de materiales coincida con la losa que realmente se ve en la obra.',
    },
    {
      type: 'paragraph',
      text: 'El cálculo es pura geometría. Multiplica las dimensiones de un prisma rectangular. No dice si la losa es lo bastante gruesa, si necesita refuerzo ni si el subsuelo soportará la carga. Son cuestiones de diseño que pertenecen al plano, no a una fórmula de volumen. Este artículo calcula únicamente la cantidad, y todo resultado debe leerse como una cantidad, no como una aprobación de ingeniería.',
    },
    { type: 'heading', level: 2, id: 'volume-formula', text: 'La fórmula de volumen del concreto' },
    {
      type: 'paragraph',
      text: 'Una losa rectangular es una caja. El volumen es largo por ancho por espesor:',
    },
    { type: 'formula', expression: 'V = L × W × T' },
    {
      type: 'paragraph',
      text: 'V es el volumen, L el largo, W el ancho y T el espesor. La única regla que importa es la consistencia de unidades: los tres datos deben expresarse en la misma unidad antes de multiplicar. Mezclar unidades es la causa más común de errores de pedido, y siempre es un error por factor de 12 en el trabajo imperial.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring',
      text: 'Cómo medir largo, ancho y espesor',
    },
    {
      type: 'paragraph',
      text: 'El largo y el ancho provienen de la superficie de la losa. Mide las dimensiones exteriores, de frente a frente, del rectángulo terminado, o toma las del plano si existe. Cuando la losa tiene recortes, escalones o curvas, divídela en rectángulos, calcula cada uno por separado y suma los resultados.',
    },
    {
      type: 'list',
      items: [
        'Mide el largo y el ancho con cinta sobre el área que el concreto realmente ocupará, no sobre el exterior de la cimbra.',
        'Comprueba que los ángulos sean rectos comparando las diagonales; diagonales desiguales significan que la superficie que mediste no es el rectángulo que creíste.',
        'Toma el espesor de la especificación o del plano en lugar de estimarlo, y verifícalo contra la profundidad de las tablas en obra.',
        'Donde el espesor varía, calcula por separado cada zona y suma los volúmenes.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Usa el espesor especificado',
      body: 'Mide la profundidad de la cimbra para detectar errores, pero calcula con el espesor que indica el plano. Medir un subsuelo irregular en su punto más profundo y usar esa única cifra en todas partes sobreestimará el vaciado.',
    },
    {
      type: 'figure',
      src: SUBGRADE_FIGURE.src,
      alt: 'Piedra triturada extendida como base a lo largo de una zanja de cimentación entibada',
      caption: 'Un subsuelo preparado: la superficie desde la que se mide el espesor de la losa',
      width: SUBGRADE_FIGURE.width,
      height: SUBGRADE_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversion',
      text: 'Conversión de unidades: pulgadas, pies, milímetros y metros',
    },
    {
      type: 'paragraph',
      text: 'En los planos imperiales suelen indicarse el largo y el ancho en pies, pero el espesor en pulgadas, porque así se anotan los dibujos. Los planos métricos no son distintos: longitudes en metros y espesores en milímetros. Convierte antes de multiplicar.',
    },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'T (m) = T (mm) ÷ 1000   ·   T (m) = T (cm) ÷ 100' },
    {
      type: 'table',
      headers: ['Cantidad', 'Conversión', '¿Exacta?'],
      rows: [
        ['1 pie', '12 pulgadas', 'Sí'],
        ['1 pulgada', '25,4 milímetros', 'Sí'],
        ['1 pie', '0,3048 metros', 'Sí'],
        ['1 pie cúbico', '0,0283168 metros cúbicos', 'Sí'],
        ['1 yarda cúbica', '27 pies cúbicos', 'Sí'],
        ['1 yarda cúbica', '0,764555 metros cúbicos', 'Redondeada'],
        ['1 metro cúbico', '35,3147 pies cúbicos', 'Redondeada'],
        ['1 metro cúbico', '1,30795 yardas cúbicas', 'Redondeada'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'El error del factor 12',
      body: 'Multiplicar 10 ft × 10 ft × 4 sin dividir el 4 entre 12 da 400 en lugar de 33,33 pies cúbicos: doce veces demasiado. Si la respuesta parece descabellada frente a la losa que tienes delante, revisa primero la unidad del espesor.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'imperial-example',
      text: 'Ejemplo resuelto: una losa de 10 ft × 10 ft con 4 pulgadas',
    },
    {
      type: 'paragraph',
      text: 'Toma una losa de 10 pies por 10 pies especificada con 4 pulgadas de espesor. Convierte el espesor, multiplica y después convierte el resultado a la unidad en que el concreto se vende.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (ft) = 4 ÷ 12 = 0,33333 ft',
        'V = 10 × 10 × 0,33333 = 33,333 ft³',
        'V (yd³) = 33,333 ÷ 27 = 1,2346 yd³',
        'Redondeado para informar: 33,33 ft³ ≈ 1,23 yd³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Esos 1,23 yardas cúbicas son el volumen geométrico exacto de la caja. Es la respuesta correcta a «¿cuánto espacio ocupa esta losa?», y todavía no es la cifra que se entrega al proveedor. La sección 8 trata la diferencia.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'metric-example',
      text: 'Ejemplo resuelto en unidades métricas',
    },
    {
      type: 'paragraph',
      text: 'Ahora el mismo trabajo dibujado en unidades métricas: una losa de 3,05 m por 3,05 m especificada con 100 mm de espesor. Convierte primero el espesor a metros y luego multiplica.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (m) = 100 ÷ 1000 = 0,100 m',
        'V = 3,05 × 3,05 × 0,100 = 0,93025 m³',
        'Redondeado para informar: 0,930 m³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Los dos ejemplos son parecidos pero deliberadamente no idénticos: 3,05 m equivale a 10,007 ft y 100 mm a 3,937 in, de modo que la losa métrica es ligeramente menor. Para que el mismo trabajo sea exactamente equivalente, 3,048 m × 3,048 m × 0,1016 m = 0,94389 m³, que se convierte de vuelta en 33,333 ft³: la respuesta imperial, cifra por cifra. Si tus dos sistemas de unidades discrepan más allá de eso, alguno tiene un error de conversión.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversions',
      text: 'Convertir pies cúbicos, yardas cúbicas y metros cúbicos',
    },
    {
      type: 'paragraph',
      text: 'Una vez resuelta la geometría, la conversión de volúmenes tiene un solo paso. El concreto premezclado en Estados Unidos se despacha en yardas cúbicas, la mezcla en bolsas se cotiza en pies cúbicos y los proyectos métricos se abastecen en metros cúbicos.',
    },
    {
      type: 'list',
      items: [
        'De pies cúbicos a yardas cúbicas: divide entre 27.',
        'De yardas cúbicas a pies cúbicos: multiplica por 27.',
        'De pies cúbicos a metros cúbicos: multiplica por 0,0283168.',
        'De metros cúbicos a pies cúbicos: multiplica por 35,3147.',
        'De metros cúbicos a yardas cúbicas: multiplica por 1,30795, o divide entre 0,764555.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Para el ejemplo imperial, 33,333 ft³ ÷ 27 = 1,2346 yd³, y 1,2346 yd³ × 0,764555 = 0,94389 m³. La mezcla en bolsas es otra conversión: una bolsa de 80 lb rinde unos 0,60 ft³ de concreto húmedo, así que 33,333 ÷ 0,60 = 55,6, que redondea a 56 bolsas. La misma cifra equivale a unas 45 bolsas de 80 libras por yarda cúbica, ya que una yarda cúbica son 27 ft³.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Margen de pedido: el volumen no es la cantidad a pedir',
    },
    {
      type: 'paragraph',
      text: 'La cifra que produce V = L × W × T es el volumen geométrico de un rectángulo ideal. Un vaciado real nunca lo es, y la distancia entre ambos es lo que cubre un margen de pedido. Cuánto depende del sitio, y por eso no existe un porcentaje único correcto para todos los trabajos.',
    },
    {
      type: 'list',
      items: [
        'Un subsuelo cortado bajo o excavado de más, de modo que el concreto llena más profundidad de la que indica el plano.',
        'Cimbra que se deforma, abomba o queda fuera de nivel bajo la presión hidrostática del vaciado.',
        'Una base que no está plana, con bajas que consumen volumen extra.',
        'Derrames, pérdidas por canaleta y pérdidas de la bomba antes del vaciado.',
        'Merma por el acabado, el reglado y el trabajo alrededor de huecos y bordes.',
        'Mínimos del proveedor: una losa pequeña puede redondearse al alza porque las cargas cortas tienen recargo mínimo.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Elige el margen deliberadamente',
      body: 'Selecciona un margen según las condiciones de tu sitio y anota por qué lo elegiste. La Calculadora de losas de concreto de MixTally incluye un control de margen de 0 a 20 % y muestra el volumen base, el volumen añadido y el pedido final uno al lado del otro, de modo que la cifra geométrica y la cifra pedida nunca se confunden.',
    },
    {
      type: 'paragraph',
      text: 'Dos errores se encuentran en extremos opuestos de esta decisión. Pedir exactamente el volumen geométrico arriesga un faltante a mitad del vaciado, donde una segunda descarga significa una junta fría. Pedir mucho más de lo que el sitio necesita desperdicia presupuesto y deja material por desechar. El margen correcto es el que puedes justificar para las condiciones que tienes delante.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Errores de cálculo frecuentes',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Dejar el espesor en pulgadas mientras el largo y el ancho están en pies. Divide siempre primero el espesor entre 12.',
        'Redondear resultados intermedios. Mantén la precisión completa durante la multiplicación y redondea solo la cifra final.',
        'Mezclar sistemas de unidades en un mismo cálculo: metros con pies o centímetros con pulgadas.',
        'Usar la superficie de planta de toda la huella cuando la losa en realidad son varios rectángulos.',
        'Pedir el volumen geométrico y nada más, o aplicar dos veces el mismo margen: una vez a mano y otra dentro de la calculadora.',
        'Ignorar pendientes, conos y bordes engrosados. Una fórmula de losa plana subestima cualquier losa que no sea un rectángulo plano.',
        'Comparar una respuesta de un sistema de unidades con la de otro sin convertir antes ambas a la misma unidad.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Preguntas frecuentes' },
    {
      type: 'faq',
      items: [
        {
          question: '¿Cuánto concreto hay en una losa de 10 ft × 10 ft con 4 pulgadas?',
          answer:
            '33,33 pies cúbicos, equivalentes a 1,23 yardas cúbicas, antes de cualquier margen de pedido. Multiplica por 1,10 para un margen del 10 % y la cifra pasa a 1,36 yardas cúbicas.',
        },
        {
          question: '¿Cuántas bolsas de 80 lb necesita esa losa?',
          answer:
            'Una bolsa de 80 lb rinde unos 0,60 pies cúbicos, así que 33,33 ÷ 0,60 = 55,6, que redondea a 56 bolsas. Equivalente: una yarda cúbica necesita unas 45 bolsas de 80 libras.',
        },
        {
          question: '¿Cuál es la fórmula en unidades métricas?',
          answer:
            'V (m³) = largo (m) × ancho (m) × espesor (m). Si el espesor está en milímetros, divídelo antes entre 1000, o entre 100 si está en centímetros: la misma convención que usa la calculadora.',
        },
        {
          question: '¿Qué espesor debería tener una losa de concreto?',
          answer:
            'El espesor lo fija el plano y el uso previsto de la losa, y este artículo deliberadamente no prescribe uno. Introduce el que indique la especificación; la fórmula de volumen solo necesita que el dato sea consistente con las demás unidades.',
        },
        {
          question: '¿Debo pedir exactamente el volumen calculado?',
          answer:
            'No. La cifra calculada es el volumen geométrico de una caja ideal. Los vaciados reales pierden volumen por variaciones del subsuelo, deformación de la cimbra y manejo, así que añade un margen que hayas elegido para tus condiciones y comprueba si el proveedor aplica un mínimo por carga corta.',
        },
      ],
    },
    { type: 'heading', level: 2, id: 'calculator-cta', text: 'Haz los cálculos en la calculadora' },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculadora de losas de concreto',
      body: 'Introduce largo, ancho, espesor y un margen para ver el volumen base, las yardas cúbicas, los pies cúbicos, el conteo de bolsas y una losa 3D interactiva, en unidades imperiales o métricas.',
    },
  ],
};

const concreteVolumePt: ArticleTranslation = {
  imageAlt: 'Laje de concreto recém-concretada sendo nivelada em um canteiro de obras preparado',
  ogImageAlt: 'Laje de concreto recém-concretada sendo nivelada em um canteiro de obras preparado',
  title: 'Como calcular o volume de concreto para uma laje',
  description:
    'Aprenda a fórmula de volume da laje de concreto, resolva exemplos imperiais e métricos, converta pés cúbicos em jardas cúbicas e escolha uma margem de pedido.',
  excerpt:
    'A fórmula de volume da laje, dois exemplos resolvidos em unidades imperiais e métricas, conversões de unidade e como transformar um volume geométrico em uma quantidade de pedido sensata.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'when-you-need-the-volume',
      text: 'Quando e por que calcular o volume da laje',
    },
    {
      type: 'paragraph',
      text: 'O concreto é comprado por volume: jardas cúbicas em projetos imperiais e metros cúbicos nos métricos. Esse número é necessário antes da concretagem por três razões práticas. Primeiro, os fornecedores de concreto prontos cotam e despacham por volume, então não é possível fazer um pedido sem ele. Segundo, a mistura em sacos é vendida em apresentações fixas, e os sacos só podem ser contados quando o volume já é conhecido. Terceiro, o número de volume é a única forma de conferir um orçamento contra a laje que realmente existe na obra.',
    },
    {
      type: 'paragraph',
      text: 'O cálculo é pura geometria. Ele multiplica as dimensões de um prisma retangular. Não diz se a laje é espessa o suficiente, se precisa de armadura nem se o subsolo suportará a carga. São questões de projeto que pertencem ao desenho, não a uma fórmula de volume. Este artigo calcula apenas a quantidade, e todo resultado deve ser lido como uma quantidade, não como uma aprovação de engenharia.',
    },
    { type: 'heading', level: 2, id: 'volume-formula', text: 'A fórmula de volume do concreto' },
    {
      type: 'paragraph',
      text: 'Uma laje retangular é uma caixa. O volume é comprimento vezes largura vezes espessura:',
    },
    { type: 'formula', expression: 'V = L × W × T' },
    {
      type: 'paragraph',
      text: 'V é o volume, L o comprimento, W a largura e T a espessura. A única regra que importa é a consistência de unidades: os três dados precisam estar na mesma unidade antes de multiplicar. Misturar unidades é a causa mais comum de erros de pedido, e é sempre um erro de fator 12 no trabalho imperial.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring',
      text: 'Como medir comprimento, largura e espessura',
    },
    {
      type: 'paragraph',
      text: 'Comprimento e largura vêm da área da laje. Meça as dimensões externas, face a face, do retângulo acabado, ou pegue-as do desenho se ele existir. Onde a laje tem recortes, degraus ou curvas, divida em retângulos, calcule cada um separadamente e some os resultados.',
    },
    {
      type: 'list',
      items: [
        'Meça comprimento e largura com fita métrica sobre a área que o concreto realmente ocupará, não sobre a exterior da fôrma.',
        'Confira se os cantos são retos comparando as diagonais; diagonais diferentes significam que a área medida não é o retângulo que você achou.',
        'Pegue a espessura da especificação ou do desenho em vez de estimar, e confira contra a profundidade das tábuas na obra.',
        'Onde a espessura varia, calcule cada faixa de espessura separadamente e some os volumes.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Use a espessura especificada',
      body: 'Meça a profundidade da fôrma para pegar erros, mas calcule com a espessura que o desenho exige. Medir um subsolo irregular no ponto mais fundo e usar esse único número em todo lugar superestimará a concretagem.',
    },
    {
      type: 'figure',
      src: SUBGRADE_FIGURE.src,
      alt: 'Brita espalhada como base ao longo de uma vala de fundação escorada',
      caption: 'Um subsolo preparado: a superfície a partir da qual se mede a espessura da laje',
      width: SUBGRADE_FIGURE.width,
      height: SUBGRADE_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversion',
      text: 'Conversão de unidades: polegadas, pés, milímetros e metros',
    },
    {
      type: 'paragraph',
      text: 'As dimensões imperiais da laje normalmente entram como comprimento e largura em pés, mas espessura em polegadas, porque é assim que os desenhos são anotados. Desenhos métricos não são diferentes: comprimentos em metros e espessura em milímetros. Converta antes de multiplicar.',
    },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'T (m) = T (mm) ÷ 1000   ·   T (m) = T (cm) ÷ 100' },
    {
      type: 'table',
      headers: ['Quantidade', 'Conversão', 'Exata?'],
      rows: [
        ['1 pé', '12 polegadas', 'Sim'],
        ['1 polegada', '25,4 milímetros', 'Sim'],
        ['1 pé', '0,3048 metros', 'Sim'],
        ['1 pé cúbico', '0,0283168 metros cúbicos', 'Sim'],
        ['1 jarda cúbica', '27 pés cúbicos', 'Sim'],
        ['1 jarda cúbica', '0,764555 metros cúbicos', 'Arredondado'],
        ['1 metro cúbico', '35,3147 pés cúbicos', 'Arredondado'],
        ['1 metro cúbico', '1,30795 jardas cúbicas', 'Arredondado'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'O erro do fator 12',
      body: 'Multiplicar 10 ft × 10 ft × 4 sem dividir o 4 por 12 dá 400 em vez de 33,33 pés cúbicos: doze vezes demais. Se uma resposta parece implausível contra a laje na sua frente, confira primeiro a unidade da espessura.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'imperial-example',
      text: 'Exemplo resolvido: uma laje de 10 ft × 10 ft com 4 polegadas',
    },
    {
      type: 'paragraph',
      text: 'Pegue uma laje de 10 pés por 10 pés especificada com 4 polegadas de espessura. Converta a espessura, multiplique e depois converta o resultado para a unidade em que o concreto é vendido.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (ft) = 4 ÷ 12 = 0,33333 ft',
        'V = 10 × 10 × 0,33333 = 33,333 ft³',
        'V (yd³) = 33,333 ÷ 27 = 1,2346 yd³',
        'Arredondado para informar: 33,33 ft³ ≈ 1,23 yd³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Esses 1,23 jardas cúbicas são o volume geométrico exato da caixa. É a resposta correta para «quanto espaço esta laje ocupa», e ainda não é o número que se entrega a um fornecedor. A seção 8 trata da diferença.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'metric-example',
      text: 'Exemplo resolvido em unidades métricas',
    },
    {
      type: 'paragraph',
      text: 'Agora o mesmo trabalho desenhado em unidades métricas: uma laje de 3,05 m por 3,05 m especificada com 100 mm de espessura. Converta primeiro a espessura para metros e depois multiplique.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (m) = 100 ÷ 1000 = 0,100 m',
        'V = 3,05 × 3,05 × 0,100 = 0,93025 m³',
        'Arredondado para informar: 0,930 m³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Os dois exemplos são próximos, mas deliberadamente não idênticos: 3,05 m equivale a 10,007 ft e 100 mm a 3,937 in, então a laje métrica é um pouco menor. Para deixar o mesmo trabalho exatamente equivalente, 3,048 m × 3,048 m × 0,1016 m = 0,94389 m³, que volta a 33,333 ft³: a resposta imperial, dígito por dígito. Se os dois sistemas de unidades discordarem além disso, algum deles tem erro de conversão.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversions',
      text: 'Convertendo pés cúbicos, jardas cúbicas e metros cúbicos',
    },
    {
      type: 'paragraph',
      text: 'Depois que a geometria está pronta, a conversão de volume tem um passo só. Concreto pronto nos Estados Unidos é despachado em jardas cúbicas, a mistura em sacos é cotada em pés cúbicos e projetos métricos são abastecidos em metros cúbicos.',
    },
    {
      type: 'list',
      items: [
        'De pés cúbicos para jardas cúbicas: divida por 27.',
        'De jardas cúbicas para pés cúbicos: multiplique por 27.',
        'De pés cúbicos para metros cúbicos: multiplique por 0,0283168.',
        'De metros cúbicos para pés cúbicos: multiplique por 35,3147.',
        'De metros cúbicos para jardas cúbicas: multiplique por 1,30795, ou divida por 0,764555.',
      ],
    },
    {
      type: 'paragraph',
      text: 'No exemplo imperial, 33,333 ft³ ÷ 27 = 1,2346 yd³, e 1,2346 yd³ × 0,764555 = 0,94389 m³. Mistura em sacos é outra conversão: um saco de 80 lb rende cerca de 0,60 ft³ de concreto úmido, então 33,333 ÷ 0,60 = 55,6, que arredonda para 56 sacos. O mesmo número equivale a umas 45 sacos de 80 libras por jarda cúbica, já que uma jarda cúbica tem 27 ft³.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Margem de pedido: o volume não é a quantidade a pedir',
    },
    {
      type: 'paragraph',
      text: 'O número produzido por V = L × W × T é o volume geométrico de um retângulo ideal. Uma concretagem real nunca é ideal, e a distância entre as duas é o que uma margem de pedido cobre. Quão grande ela é depende do canteiro, e por isso não existe uma porcentagem única correta para todo serviço.',
    },
    {
      type: 'list',
      items: [
        'Subsolo cortado baixo ou excavado a mais, de modo que o concreto preencha mais profundidade do que o desenho mostra.',
        'Fôrma que cede, abomba ou sai de nível sob a pressão hidrostática da concretagem.',
        'Base que não está plana, com baixas que consomem volume extra.',
        'Derramamentos, perda pela calha e perda da bomba antes da concretagem.',
        'Sobras do acabamento, do desempeno e do trabalho ao redor de furos e bordas.',
        'Mínimos do fornecedor: uma laje pequena pode ser arredondada para cima porque cargas curtas têm taxa mínima.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Escolha a margem deliberadamente',
      body: 'Escolha uma margem a partir das condições do seu canteiro e anote por que a escolheu. A Calculadora de Laje de Concreto do MixTally tem um controle de margem de 0 a 20% e mostra o volume base, o volume adicionado e o pedido final lado a lado, de modo que a cifra geométrica e a cifra pedida nunca se confundam.',
    },
    {
      type: 'paragraph',
      text: 'Dois erros ficam em extremos opostos dessa decisão. Pedir exatamente o volume geométrico arrisca um faltante no meio da concretagem, onde uma segunda descarga significa uma junta fria. Pedir muito além do que o canteiro precisa desperdiça orçamento e deixa material para descartar. A margem correta é a que você consegue justificar para as condições que tem na frente.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Erros de cálculo comuns',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Deixar a espessura em polegadas enquanto comprimento e largura estão em pés. Sempre divida a espessura por 12 antes.',
        'Arredondar resultados intermediários. Mantenha a precisão total durante a multiplicação e arredonde apenas o número final.',
        'Misturar sistemas de unidades em um só cálculo — metros com pés ou centímetros com polegadas.',
        'Usar a área de planta da implantação quando a laje é na verdade vários retângulos.',
        'Pedir o volume geométrico e nada mais, ou aplicar a mesma margem duas vezes — uma na mão e outra dentro da calculadora.',
        'Ignorar inclinações, coroamentos e bordas engrossadas. Uma fórmula de laje plana subestima qualquer laje que não seja um retângulo plano.',
        'Comparar uma resposta de um sistema de unidades com a de outro sem antes converter as duas para a mesma unidade.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Perguntas frequentes' },
    {
      type: 'faq',
      items: [
        {
          question: 'Quanto de concreto tem numa laje de 10 ft × 10 ft com 4 polegadas?',
          answer:
            '33,33 pés cúbicos, que são 1,23 jardas cúbicas, antes de qualquer margem de pedido. Multiplique por 1,10 para uma margem de 10% e o número vira 1,36 jardas cúbicas.',
        },
        {
          question: 'Quantos sacos de 80 lb essa laje precisa?',
          answer:
            'Um saco de 80 lb rende cerca de 0,60 pés cúbicos, então 33,33 ÷ 0,60 = 55,6, que arredonda para 56 sacos. De forma equivalente, uma jarda cúbica precisa de umas 45 sacos de 80 libras.',
        },
        {
          question: 'Qual é a fórmula em unidades métricas?',
          answer:
            'V (m³) = comprimento (m) × largura (m) × espessura (m). Se a espessura estiver em milímetros, divida antes por 1000, ou por 100 se estiver em centímetros — a mesma convenção que a calculadora usa.',
        },
        {
          question: 'Qual deve ser a espessura de uma laje de concreto?',
          answer:
            'A espessura é definida pelo desenho e pelo uso pretendido da laje, e este artigo deliberadamente não prescreve uma. Informe o que a especificação pedir; a fórmula de volume só precisa que o número seja consistente com as suas outras unidades.',
        },
        {
          question: 'Devo pedir exatamente o volume calculado?',
          answer:
            'Não. O número calculado é o volume geométrico de uma caixa ideal. Concretagens reais perdem volume por variação de subsolo, deformação da fôrma e manuseio, então acrescente uma margem que você escolheu para as suas condições e confira se o fornecedor aplica um mínimo por carga curta.',
        },
      ],
    },
    { type: 'heading', level: 2, id: 'calculator-cta', text: 'Faça as contas na calculadora' },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculadora de Laje de Concreto',
      body: 'Informe comprimento, largura, espessura e uma margem para ver o volume base, jardas cúbicas, pés cúbicos, contagem de sacos e uma laje 3D interativa, em unidades imperiais ou métricas.',
    },
  ],
};

const concreteVolumeFr: ArticleTranslation = {
  imageAlt: 'Dalle en béton fraîchement coulée en cours de nivellement sur un chantier préparé',
  ogImageAlt: 'Dalle en béton fraîchement coulée en cours de nivellement sur un chantier préparé',
  title: 'Comment calculer le volume de béton d’une dalle',
  description:
    'Apprenez la formule de volume d’une dalle, travaillez des exemples impériaux et métriques, convertissez les pieds cubes en yards cubes et choisissez une marge.',
  excerpt:
    'La formule de volume de la dalle, deux exemples résolus en unités impériales et métriques, conversions d’unités et la façon de transformer un volume géométrique en une quantité de commande raisonnable.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'when-you-need-the-volume',
      text: 'Quand et pourquoi calculer le volume de la dalle',
    },
    {
      type: 'paragraph',
      text: 'Le béton s’achète au volume : en yards cubes pour les chantiers impériaux et en mètres cubes pour les chantiers métriques. Ce chiffre est nécessaire avant la coulée pour trois raisons pratiques. D’abord, les fournisseurs de béton prêt à l’emploi cotent et livrent au volume, donc aucune commande ne peut passer sans lui. Ensuite, les mélanges en sacs se vendent en formats fixes, et les sacs ne se comptent qu’une fois le volume connu. Enfin, le chiffre de volume est la seule façon de confronter un devis à la dalle qui existe réellement sur le chantier.',
    },
    {
      type: 'paragraph',
      text: 'Le calcul est de la pure géométrie. Il multiplie les dimensions d’un prisme rectangle. Il ne dit pas si la dalle est assez épaisse, si elle a besoin d’armature ni si le sol porteur soutiendra la charge. Ce sont des questions de projet qui relèvent du plan, pas d’une formule de volume. Cet article calcule uniquement la quantité, et chaque résultat doit se lire comme une quantité, non comme une validation technique.',
    },
    { type: 'heading', level: 2, id: 'volume-formula', text: 'La formule de volume du béton' },
    {
      type: 'paragraph',
      text: 'Une dalle rectangulaire est une boîte. Le volume vaut longueur multipliée par largeur multipliée par épaisseur :',
    },
    { type: 'formula', expression: 'V = L × W × T' },
    {
      type: 'paragraph',
      text: 'V est le volume, L la longueur, W la largeur et T l’épaisseur. La seule règle qui compte est la cohérence des unités : les trois données doivent être exprimées dans la même unité avant la multiplication. Mélanger les unités est la cause la plus fréquente d’erreurs de commande, et c’est toujours une erreur de facteur 12 dans le travail impérial.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring',
      text: 'Comment mesurer longueur, largeur et épaisseur',
    },
    {
      type: 'paragraph',
      text: 'La longueur et la largeur proviennent de la surface de la dalle. Mesurez les dimensions extérieures, de face à face, du rectangle fini, ou reprenez-les sur le plan s’il en existe un. Lorsque la dalle comporte des découpes, des marches ou des courbes, divisez-la en rectangles, calculez chacun séparément puis additionnez les résultats.',
    },
    {
      type: 'list',
      items: [
        'Mesurez la longueur et la largeur au mètre ruban sur la surface que le béton occupera réellement, et non sur l’extérieur des banches.',
        'Vérifiez que les angles sont droits en comparant les diagonales ; des diagonales inégales signifient que la surface mesurée n’est pas le rectangle que vous croyiez.',
        'Reprenez l’épaisseur dans le cahier des charges ou sur le plan plutôt que de l’estimer, et confrontez-la à la profondeur des banches sur le chantier.',
        'Là où l’épaisseur variez, calculez chaque zone séparément puis additionnez les volumes.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Utilisez l’épaisseur spécifiée',
      body: 'Mesurez la profondeur des banches pour repérer les erreurs, mais calculez avec l’épaisseur indiquée sur le plan. Mesurer un sol irrégulier à son point le plus bas et appliquer ce seul chiffre partout surestimera la coulée.',
    },
    {
      type: 'figure',
      src: SUBGRADE_FIGURE.src,
      alt: 'Pierre concassée répartie en forme de base le long d’une tranchée de fondation étayée',
      caption: 'Une fondation préparée : la surface à partir de laquelle l’épaisseur de la dalle se mesure',
      width: SUBGRADE_FIGURE.width,
      height: SUBGRADE_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversion',
      text: 'Conversion des unités : pouces, pieds, millimètres et mètres',
    },
    {
      type: 'paragraph',
      text: 'Les dimensions impériales d’une dalle sont en général saisies en pieds pour la longueur et la largeur, mais en pouces pour l’épaisseur, car c’est ainsi que les plans sont annotés. Les plans métriques ne sont pas différents : longueurs en mètres, épaisseur en millimètres. Convertissez avant de multiplier.',
    },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'T (m) = T (mm) ÷ 1000   ·   T (m) = T (cm) ÷ 100' },
    {
      type: 'table',
      headers: ['Quantité', 'Conversion', 'Exact ?'],
      rows: [
        ['1 pied', '12 pouces', 'Oui'],
        ['1 pouce', '25,4 millimètres', 'Oui'],
        ['1 pied', '0,3048 mètre', 'Oui'],
        ['1 pied cube', '0,0283168 mètre cube', 'Oui'],
        ['1 yard cube', '27 pieds cubes', 'Oui'],
        ['1 yard cube', '0,764555 mètre cube', 'Arrondi'],
        ['1 mètre cube', '35,3147 pieds cubes', 'Arrondi'],
        ['1 mètre cube', '1,30795 yards cubes', 'Arrondi'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'L’erreur du facteur 12',
      body: 'Multiplier 10 ft × 10 ft × 4 sans diviser le 4 par 12 donne 400 au lieu de 33,33 pieds cubes — douze fois trop. Si une réponse semble irréaliste face à la dalle devant vous, vérifiez d’abord l’unité de l’épaisseur.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'imperial-example',
      text: 'Exemple résolu : une dalle de 10 ft × 10 ft à 4 pouces',
    },
    {
      type: 'paragraph',
      text: 'Prenez une dalle de 10 pieds sur 10 pieds spécifiée à 4 pouces d’épaisseur. Convertissez l’épaisseur, multipliez, puis convertissez le résultat dans l’unité dans laquelle le béton se vend.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (ft) = 4 ÷ 12 = 0,33333 ft',
        'V = 10 × 10 × 0,33333 = 33,333 ft³',
        'V (yd³) = 33,333 ÷ 27 = 1,2346 yd³',
        'Arrondi pour le rapport : 33,33 ft³ ≈ 1,23 yd³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Ces 1,23 yards cubes sont le volume géométrique exact de la boîte. C’est la bonne réponse à « combien d’espace cette dalle occupe-t-elle », et ce n’est pas encore le chiffre à remettre à un fournisseur. La section 8 traite de l’écart.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'metric-example',
      text: 'Exemple résolu en unités métriques',
    },
    {
      type: 'paragraph',
      text: 'Le même travail dessiné en unités métriques : une dalle de 3,05 m sur 3,05 m spécifiée à 100 mm d’épaisseur. Convertissez d’abord l’épaisseur en mètres, puis multipliez.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (m) = 100 ÷ 1000 = 0,100 m',
        'V = 3,05 × 3,05 × 0,100 = 0,93025 m³',
        'Arrondi pour le rapport : 0,930 m³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Les deux exemples sont proches mais volontairement pas identiques : 3,05 m vaut 10,007 ft et 100 mm valent 3,937 in, la dalle métrique est donc légèrement plus petite. Pour rendre le travail exactement équivalent, 3,048 m × 3,048 m × 0,1016 m = 0,94389 m³, qui revient à 33,333 ft³ — la réponse impériale, chiffre pour chiffre. Si vos deux systèmes d’unités divergent au-delà de cela, l’un des deux contient une erreur de conversion.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversions',
      text: 'Convertir pieds cubes, yards cubes et mètres cubes',
    },
    {
      type: 'paragraph',
      text: 'Une fois la géométrie résolue, la conversion de volume ne comporte qu’une étape. Le béton prêt à l’emploi est expédié en yards cubes aux États-Unis, le mélange en sacs se compte en pieds cubes, et les chantiers métriques se fournissent en mètres cubes.',
    },
    {
      type: 'list',
      items: [
        'Des pieds cubes aux yards cubes : divisez par 27.',
        'Des yards cubes aux pieds cubes : multipliez par 27.',
        'Des pieds cubes aux mètres cubes : multipliez par 0,0283168.',
        'Des mètres cubes aux pieds cubes : multipliez par 35,3147.',
        'Des mètres cubes aux yards cubes : multipliez par 1,30795, ou divisez par 0,764555.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Pour l’exemple impérial, 33,333 ft³ ÷ 27 = 1,2346 yd³, puis 1,2346 yd³ × 0,764555 = 0,94389 m³. Le mélange en sacs obéit à une autre conversion : un sac de 80 lb produit environ 0,60 ft³ de béton frais, donc 33,333 ÷ 0,60 = 55,6, soit 56 sacs arrondis. Le même chiffre donne environ 45 sacs de 80 livres par yard cube, un yard cube faisant 27 ft³.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Marge de commande : le volume n’est pas la quantité à commander',
    },
    {
      type: 'paragraph',
      text: 'Le nombre produit par V = L × W × T est le volume géométrique d’un rectangle idéal. Une coulée réelle ne l’est jamais, et l’écart entre les deux est ce que couvre une marge de commande. Son ampleur dépend du chantier, ce qui explique qu’aucun pourcentage unique ne convienne à tous les travaux.',
    },
    {
      type: 'list',
      items: [
        'Un sol coupé trop bas ou excavé en excès, si bien que le béton remplit plus de profondeur que le plan ne le montre.',
        'Des banches qui se déforment, gondolent ou sortent d’aplomb sous la pression hydrostatique de la coulée.',
        'Une base irrégulière, avec des creux qui consomment du volume supplémentaire.',
        'Les déversements, les pertes par gouttière et l’amorçage de la pompe avant la coulée.',
        'Les chutes de finition, de régalage et du travail autour des pénétrations et des bords.',
        'Les minimums fournisseur : une petite dalle peut être arrondie à la hausse, une livraison courte supportant des frais minimums.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Choisissez la marge délibérément',
      body: 'Sélectionnez une marge adaptée à votre chantier et notez pourquoi vous l’avez choisie. La calculatrice de dalle en béton de MixTally propose un curseur de marge de 0 à 20 % et affiche le volume de base, le volume ajouté et la commande finale côte à côte, afin que le chiffre géométrique et le chiffre commandé ne soient jamais confondus.',
    },
    {
      type: 'paragraph',
      text: 'Deux erreurs se situent aux extrémités opposées de cette décision. Commander exactement le volume géométrique risque un manquant au milieu de la coulée, où une seconde livraison signifie un joint de reprise. Commander bien au-delà des besoins du chantier gaspille le budget et laisse du matériau à évacuer. La bonne marge est celle que vous pouvez justifier pour les conditions qui se trouvent devant vous.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Erreurs de calcul courantes',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Laisser l’épaisseur en pouces alors que longueur et largeur sont en pieds. Divisez toujours l’épaisseur par 12 au préalable.',
        'Arrondir les résultats intermédiaires. Conservez la précision pendant toute la multiplication et n’arrondissez que le chiffre final.',
        'Mélanger les systèmes d’unités dans un même calcul — mètres avec pieds ou centimètres avec pouces.',
        'Utiliser la surface de plan de l’ensemble du terrain alors que la dalle est en réalité plusieurs rectangles.',
        'Commander le volume géométrique et rien d’autre, ou appliquer deux fois la même marge — une à la main et une dans la calculatrice.',
        'Ignorer les pentes, les bombements et les bordures épaissies. Une formule de dalle plane sous-estime toute dalle qui n’est pas un rectangle plan.',
        'Comparer une réponse d’un système d’unités à celle d’un autre sans avoir converti les deux vers la même unité.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Questions fréquentes' },
    {
      type: 'faq',
      items: [
        {
          question: 'Combien de béton y a-t-il dans une dalle de 10 ft × 10 ft à 4 pouces ?',
          answer:
            '33,33 pieds cubes, soit 1,23 yards cubes, avant toute marge de commande. Multipliez par 1,10 pour une marge de 10 % et le chiffre devient 1,36 yards cubes.',
        },
        {
          question: 'Combien de sacs de 80 lb cette dalle demande-t-elle ?',
          answer:
            'Un sac de 80 lb produit environ 0,60 pied cube, donc 33,33 ÷ 0,60 = 55,6, soit 56 sacs arrondis. Autrement dit, un yard cube demande environ 45 sacs de 80 livres.',
        },
        {
          question: 'Quelle est la formule en unités métriques ?',
          answer:
            'V (m³) = longueur (m) × largeur (m) × épaisseur (m). Si l’épaisseur est donnée en millimètres, divisez-la d’abord par 1000, ou par 100 si elle est en centimètres — la même convention que la calculatrice.',
        },
        {
          question: 'Quelle épaisseur doit avoir une dalle en béton ?',
          answer:
            'L’épaisseur est fixée par le plan et l’usage prévu de la dalle, et cet article ne prescrit volontairement aucune valeur. Saisissez celle qu’exige le cahier des charges ; la formule de volume a seulement besoin d’un nombre cohérent avec vos autres unités.',
        },
        {
          question: 'Dois-je commander exactement le volume calculé ?',
          answer:
            'Non. Le chiffre calculé est le volume géométrique d’une boîte idéale. Les coulées réelles perdent du volume à cause des variations de sol, de la déformation des banches et de la manutention ; ajoutez donc une marge choisie pour votre chantier et vérifiez si le fournisseur applique un minimum de livraison.',
        },
      ],
    },
    { type: 'heading', level: 2, id: 'calculator-cta', text: 'Faites les calculs dans la calculatrice' },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculatrice de dalle en béton',
      body: 'Saisissez longueur, largeur, épaisseur et une marge pour voir le volume de base, les yards cubes, les pieds cubes, le décompte des sacs et une dalle 3D interactive, en unités impériales ou métriques.',
    },
  ],
};

const concreteVolumeDe: ArticleTranslation = {
  imageAlt: 'Frisch gegossene Betonplatte, die auf einer vorbereiteten Baustelle nivelliert wird',
  ogImageAlt: 'Frisch gegossene Betonplatte, die auf einer vorbereiteten Baustelle nivelliert wird',
  title: 'Betonvolumen für eine Platte berechnen',
  description:
    'Lernen Sie die Formel für das Plattenvolumen, rechnen Sie imperial und metrisch, wandeln Sie Kubikfuß in Kubikyard um und wählen Sie einen Zuschlag.',
  excerpt:
    'Die Formel für das Plattenvolumen, zwei durchgerechnete Beispiele in imperialen und metrischen Einheiten, Einheitenumrechnungen und wie aus einem geometrischen Volumen eine sinnvolle Bestellmenge wird.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'when-you-need-the-volume',
      text: 'Wann und warum man das Plattenvolumen berechnet',
    },
    {
      type: 'paragraph',
      text: 'Beton wird nach Volumen gekauft: Kubikyard in imperialen Projekten, Kubikmeter in metrischen. Diese Zahl braucht man vor dem Guss aus drei praktischen Gründen. Erstens kalkulieren und liefern Mischanlagen-Betreiber nach Volumen, ohne diese Zahl ist keine Bestellung möglich. Zweitens wird Sackware in festen Sackgrößen verkauft, und die Säcke lassen sich erst zählen, wenn das Volumen bekannt ist. Drittens ist die Volumenzahl die einzige Möglichkeit, eine Mengenaufstellung gegen die Platte zu prüfen, die man auf der Baustelle tatsächlich sieht.',
    },
    {
      type: 'paragraph',
      text: 'Die Rechnung ist reine Geometrie. Sie multipliziert die Abmessungen eines rechtwinkligen Quaders. Sie sagt nicht, ob die Platte dick genug ist, ob Bewehrung nötig ist oder ob der Untergrund die Last trägt. Das sind Planungsfragen, die auf die Zeichnung und nicht in eine Volumenformel gehören. Dieser Artikel berechnet ausschließlich die Menge, und jedes Ergebnis ist als Menge zu lesen, nicht als ingenieurtechnische Freigabe.',
    },
    { type: 'heading', level: 2, id: 'volume-formula', text: 'Die Betonvolumen-Formel' },
    {
      type: 'paragraph',
      text: 'Eine rechteckige Platte ist ein Kasten. Das Volumen ist Länge mal Breite mal Dicke:',
    },
    { type: 'formula', expression: 'V = L × W × T' },
    {
      type: 'paragraph',
      text: 'V ist das Volumen, L die Länge, W die Breite und T die Dicke. Die einzige Regel, die zählt, ist die Einheitenkonsistenz: Alle drei Werte müssen vor der Multiplikation in derselben Einheit stehen. Gemischte Einheiten sind die häufigste Ursache für Bestellfehler und immer ein Faktor-12-Fehler in der imperialen Arbeit.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring',
      text: 'Wie man Länge, Breite und Dicke misst',
    },
    {
      type: 'paragraph',
      text: 'Länge und Breite stammen aus der Fläche der Platte. Messen Sie die äußeren Maße von Flanke zu Flanke des fertigen Rechtecks, oder entnehmen Sie sie der Zeichnung, falls es eine gibt. Wo die Platte Aussparungen, Stufen oder Kurven hat, teilen Sie sie in Rechtecke, rechnen Sie jedes einzeln und addieren Sie die Ergebnisse.',
    },
    {
      type: 'list',
      items: [
        'Messen Sie Länge und Breite mit dem Maßband über die Fläche, die der Beton tatsächlich einnimmt, und nicht über die Außenkante der Schalung.',
        'Prüfen Sie die rechten Winkel, indem Sie die Diagonalen vergleichen; ungleiche Diagonalen bedeuten, dass die gemessene Fläche nicht das Rechteck ist, das Sie vermuteten.',
        'Nehmen Sie die Dicke aus Spezifikation oder Zeichnung statt aus einer Schätzung und gleichen Sie sie mit der Schalungstiefe auf der Baustelle ab.',
        'Wo die Dicke variiert, rechnen Sie jede Dickenzone einzeln und addieren Sie die Volumina.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Verwenden Sie die spezifierte Dicke',
      body: 'Messen Sie die Schalungstiefe, um Fehler zu finden, rechnen Sie aber mit der Dicke, die die Zeichnung vorsieht. Wer einen unebenen Untergrund an seiner tiefsten Stelle misst und diese eine Zahl überall verwendet, überschätzt den Guss.',
    },
    {
      type: 'figure',
      src: SUBGRADE_FIGURE.src,
      alt: 'Schotter als Unterbau entlang einer verbauten Fundamentgrube verteilt',
      caption: 'Ein vorbereiteter Untergrund — die Oberfläche, von der aus die Plattendicke gemessen wird',
      width: SUBGRADE_FIGURE.width,
      height: SUBGRADE_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversion',
      text: 'Einheitenumrechnung: Zoll, Fuß, Millimeter und Meter',
    },
    {
      type: 'paragraph',
      text: 'Imperale Plattenabmessungen werden meist als Länge und Breite in Fuß, aber als Dicke in Zoll eingegeben, so wie Zeichnungen beschriftet sind. Metrische Zeichnungen sind nicht anders: Längen in Meter, Dicke in Millimeter. Rechnen Sie vor dem Multiplizieren um.',
    },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'T (m) = T (mm) ÷ 1000   ·   T (m) = T (cm) ÷ 100' },
    {
      type: 'table',
      headers: ['Größe', 'Umrechnung', 'Exakt?'],
      rows: [
        ['1 Fuß', '12 Zoll', 'Ja'],
        ['1 Zoll', '25,4 Millimeter', 'Ja'],
        ['1 Fuß', '0,3048 Meter', 'Ja'],
        ['1 Kubikfuß', '0,0283168 Kubikmeter', 'Ja'],
        ['1 Kubikyard', '27 Kubikfuß', 'Ja'],
        ['1 Kubikyard', '0,764555 Kubikmeter', 'Gerundet'],
        ['1 Kubikmeter', '35,3147 Kubikfuß', 'Gerundet'],
        ['1 Kubikmeter', '1,30795 Kubikyard', 'Gerundet'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Der Faktor-12-Fehler',
      body: 'Wer 10 ft × 10 ft × 4 multipliziert, ohne die 4 durch 12 zu teilen, erhält 400 statt 33,33 Kubikfuß — zwölfmal zu viel. Wenn ein Ergebnis im Vergleich zur Platte vor Ihnen unplausibel aussieht, prüfen Sie zuerst die Einheit der Dicke.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'imperial-example',
      text: 'Durchgerechnetes Beispiel: eine 10 ft × 10 ft Platte bei 4 Zoll',
    },
    {
      type: 'paragraph',
      text: 'Nehmen Sie eine 10 mal 10 Fuß große Platte mit 4 Zoll Dicke. Rechnen Sie die Dicke um, multiplizieren Sie anschließend und wandeln Sie das Ergebnis in die Einheit um, in der Beton verkauft wird.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (ft) = 4 ÷ 12 = 0,33333 ft',
        'V = 10 × 10 × 0,33333 = 33,333 ft³',
        'V (yd³) = 33,333 ÷ 27 = 1,2346 yd³',
        'Für die Angabe gerundet: 33,33 ft³ ≈ 1,23 yd³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Diese 1,23 Kubikyard sind das exakte geometrische Volumen des Kastens. Das ist die richtige Antwort auf „Wie viel Platz nimmt diese Platte ein“, und es ist noch nicht die Zahl, die man einem Lieferanten übergibt. Abschnitt 8 behandelt den Unterschied.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'metric-example',
      text: 'Durchgerechnetes metrisches Beispiel',
    },
    {
      type: 'paragraph',
      text: 'Derselbe Auftrag in metrischen Einheiten: eine 3,05 m breite und 3,05 m lange Platte mit 100 mm Dicke. Rechnen Sie zuerst die Dicke in Meter um und multiplizieren Sie dann.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (m) = 100 ÷ 1000 = 0,100 m',
        'V = 3,05 × 3,05 × 0,100 = 0,93025 m³',
        'Für die Angabe gerundet: 0,930 m³',
      ],
    },
    {
      type: 'paragraph',
      text: 'Die beiden Beispiele sind ähnlich, aber bewusst nicht identisch: 3,05 m entsprechen 10,007 ft und 100 mm entsprechen 3,937 in, die metrische Platte ist also etwas kleiner. Damit derselbe Auftrag exakt gleichwertig wird, ergibt 3,048 m × 3,048 m × 0,1016 m = 0,94389 m³, was zurück auf 33,333 ft³ führt — die imperale Antwort, Ziffer für Ziffer. Wenn Ihre beiden Einheitensysteme darüber hinaus auseinandergehen, steckt in einem der beiden ein Umrechnungsfehler.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversions',
      text: 'Kubikfuß, Kubikyard und Kubikmeter umrechnen',
    },
    {
      type: 'paragraph',
      text: 'Ist die Geometrie gelöst, ist die Volumenumrechnung nur ein Schritt. Mischanlagen-Beton wird in den USA in Kubikyard geliefert, Sackware wird in Kubikfuß angeboten, und metrische Bauprojekte werden in Kubikmeter beliefert.',
    },
    {
      type: 'list',
      items: [
        'Von Kubikfuß zu Kubikyard: durch 27 teilen.',
        'Von Kubikyard zu Kubikfuß: mit 27 multiplizieren.',
        'Von Kubikfuß zu Kubikmeter: mit 0,0283168 multiplizieren.',
        'Von Kubikmeter zu Kubikfuß: mit 35,3147 multiplizieren.',
        'Von Kubikmeter zu Kubikyard: mit 1,30795 multiplizieren oder durch 0,764555 teilen.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Für das imperale Beispiel gilt 33,333 ft³ ÷ 27 = 1,2346 yd³ und 1,2346 yd³ × 0,764555 = 0,94389 m³. Sackware ist eine eigene Rechnung: Ein 80-lb-Sack liefert etwa 0,60 ft³ frischen Beton, also 33,333 ÷ 0,60 = 55,6, aufgerundet 56 Säcke. Derselbe Wert entspricht etwa 45 Säcken zu 80 Pfund pro Kubikyard, weil ein Kubikyard 27 ft³ hat.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Bestellzuschlag: Das Volumen ist nicht die Bestellmenge',
    },
    {
      type: 'paragraph',
      text: 'Die Zahl aus V = L × W × T ist das geometrische Volumen eines idealen Rechtecks. Ein realer Guss ist nie ideal, und die Lücke dazwischen ist es, was ein Bestellzuschlag abdeckt. Wie groß er ist, hängt von der Baustelle ab, weshalb es keinen einzigen Prozentsatz gibt, der für jeden Auftrag richtig wäre.',
    },
    {
      type: 'list',
      items: [
        'Ein zu tief gegrabener oder zu viel ausgescharrter Untergrund, sodass Beton mehr Tiefe füllt als die Zeichnung zeigt.',
        'Schalung, die sich unter dem hydrostatischen Druck des Gusses ausbeult, wölbt oder aus dem Lot gerät.',
        'Ein unebener Untergrund mit Senken, die zusätzliches Volumen aufzehren.',
        'Verschüttungen, Rinnenverluste und der Pumpenansatz, der nie in die Schalung gelangt.',
        'Verluste beim Glätten, Abziehen und Arbeiten um Durchdringungen und Kanten herum.',
        'Lieferantenmindestmengen: Eine kleine Platte wird eventuell aufgerundet, weil Kurzlieferungen einen Mindestzuschlag haben.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Wählen Sie den Zuschlag bewusst',
      body: 'Wählen Sie einen Zuschlag nach den Bedingungen Ihrer Baustelle und notieren Sie, warum. Der Betonplatten-Rechner von MixTally bietet einen Zuschlagregler von 0 bis 20 % und zeigt Grundvolumen, Zusatzvolumen und Bestellmenge nebeneinander, damit geometrische Zahl und bestellte Zahl nie verwechselt werden.',
    },
    {
      type: 'paragraph',
      text: 'Zwei Fehler stehen an entgegengesetzten Enden dieser Entscheidung. Wer genau das geometrische Volumen bestellt, riskiert einen Mangel mitten im Guss, bei dem eine zweite Lieferung eine Kaltfuge bedeutet. Wer weit über das hinaus bestellt, was die Baustelle braucht, verschenkt Budget und lässt Material zum Entsorgen. Der richtige Zuschlag ist der, den Sie für die Bedingungen vor Ihnen begründen können.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Häufige Rechenfehler',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Die Dicke in Zoll stehen lassen, während Länge und Breite in Fuß stehen. Teilen Sie die Dicke immer zuerst durch 12.',
        'Zwischenergebnisse runden. Halten Sie die volle Genauigkeit während der Multiplikation bei und runden Sie nur die letzte Zahl.',
        'Einheitensysteme in einer Rechnung mischen — Meter mit Fuß oder Zentimeter mit Zoll.',
        'Die Grundfläche des gesamten Grundrisses verwenden, wenn die Platte in Wahrheit mehrere Rechtecke ist.',
        'Nur das geometrische Volumen bestellen oder zweimal denselben Zuschlag anwenden — einmal von Hand und einmal im Rechner.',
        'Neigungen, Wölbungen und dickere Kanten ignorieren. Eine Formel für eine ebene Platte unterschätzt jede Platte, die kein ebenes Rechteck ist.',
        'Eine Antwort eines Einheitensystems mit der eines anderen vergleichen, ohne beide vorher umzurechnen.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Häufig gestellte Fragen' },
    {
      type: 'faq',
      items: [
        {
          question: 'Wie viel Beton steckt in einer 10 ft × 10 ft Platte bei 4 Zoll?',
          answer:
            '33,33 Kubikfuß, also 1,23 Kubikyard, vor jedem Bestellzuschlag. Multiplizieren Sie mit 1,10 für 10 % Zuschlag, dann werden daraus 1,36 Kubikyard.',
        },
        {
          question: 'Wie viele 80-lb-Säcke braucht diese Platte?',
          answer:
            'Ein 80-lb-Sack liefert etwa 0,60 Kubikfuß, also 33,33 ÷ 0,60 = 55,6, aufgerundet 56 Säcke. Anders ausgedrückt: Ein Kubikyard braucht etwa 45 Säcke zu 80 Pfund.',
        },
        {
          question: 'Wie lautet die Formel in metrischen Einheiten?',
          answer:
            'V (m³) = Länge (m) × Breite (m) × Dicke (m). Ist die Dicke in Millimeter angegeben, teilen Sie vorher durch 1000, bei Zentimetern durch 100 — dieselbe Konvention wie im Rechner.',
        },
        {
          question: 'Wie dick sollte eine Betonplatte sein?',
          answer:
            'Die Dicke legt die Zeichnung und die spätere Nutzung der Platte fest, und dieser Artikel schreibt bewusst keine vor. Geben Sie ein, was die Spezifikation verlangt; die Volumenformel braucht nur einen Wert, der zu Ihren übrigen Einheiten passt.',
        },
        {
          question: 'Soll ich exakt das berechnete Volumen bestellen?',
          answer:
            'Nein. Die berechnete Zahl ist das geometrische Volumen eines idealen Kastens. Reale Güsse verlieren Volumen durch Untergrundschwankungen, Schalungsverformung und Handhabung; addieren Sie daher einen Zuschlag, den Sie für Ihre Bedingungen gewählt haben, und prüfen Sie, ob der Lieferant einen Mindestmengenzuschlag erhebt.',
        },
      ],
    },
    { type: 'heading', level: 2, id: 'calculator-cta', text: 'Rechnen Sie es im Rechner nach' },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Betonplatten-Rechner',
      body: 'Geben Sie Länge, Breite, Dicke und einen Zuschlag ein, um Grundvolumen, Kubikyard, Kubikfuß, Sackzahlen und eine interaktive 3D-Platte zu sehen — in imperialen oder metrischen Einheiten.',
    },
  ],
};

const concreteVolumeArticle: ArticleDefinition = {
  slug: 'how-to-calculate-concrete-volume-for-a-slab',
  category: 'concrete',
  title: 'How to Calculate Concrete Volume for a Slab',
  description:
    'Learn the concrete slab volume formula, work through imperial and metric examples, convert cubic feet to cubic yards, and choose an ordering allowance.',
  excerpt:
    'The slab volume formula, two worked examples in imperial and metric units, unit conversions, and how to turn a geometric volume into a sensible order quantity.',
  publishedAt: '2026-10-04',
  readingTimeMinutes: 7,
  image: CONCRETE_SLAB_IMAGE,
  ogImage: CONCRETE_SLAB_IMAGE,
  featured: true,
  relatedCalculatorViews: ['concrete-slab-calculator'],
  relatedArticleSlugs: ['how-much-concrete-do-i-need-for-a-10x10-slab'],
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'when-you-need-the-volume',
      text: 'When and why you calculate slab volume',
    },
    {
      type: 'paragraph',
      text: 'Concrete is bought by volume: cubic yards in imperial projects, cubic metres in metric ones. You need that number before a pour for three practical reasons. First, ready-mix suppliers quote and dispatch by volume, so an order cannot be placed without it. Second, bagged mix is sold in fixed bag sizes, and bags can only be counted once the volume is known. Third, a volume figure is the only way to sanity-check a takeoff against the slab you can actually see on site.',
    },
    {
      type: 'paragraph',
      text: 'The calculation is pure geometry. It takes the dimensions of a rectangular prism and multiplies them. It does not tell you whether the slab is thick enough, whether it needs reinforcement, or whether the subgrade will carry the load. Those are design questions that belong on the drawing, not in a volume formula. This article computes quantity only, and every result below should be read as a quantity, not as an engineering approval.',
    },
    { type: 'heading', level: 2, id: 'volume-formula', text: 'The concrete volume formula' },
    {
      type: 'paragraph',
      text: 'A rectangular slab is a box. Volume is length multiplied by width multiplied by thickness:',
    },
    { type: 'formula', expression: 'V = L × W × T' },
    {
      type: 'paragraph',
      text: 'V is the volume, L the length, W the width and T the thickness. The only rule that matters is unit consistency: all three inputs must be expressed in the same unit before you multiply. Mixing units is the single most common source of order errors, and it is always a factor-of-12 mistake in imperial work.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring',
      text: 'How to measure length, width and thickness',
    },
    {
      type: 'paragraph',
      text: 'Length and width come from the plan area of the slab. Measure the outside face-to-face dimensions of the finished rectangle, or take them from the drawing if one exists. Where the slab has cut-outs, steps or curves, split it into rectangles, calculate each one separately and add the results together.',
    },
    {
      type: 'list',
      items: [
        'Measure length and width with a tape over the area the concrete will actually occupy, not over the formwork exterior.',
        'Check the corners are square by comparing diagonals; unequal diagonals mean the plan area is not the rectangle you measured.',
        'Take thickness from the specification or drawing rather than from a guess, and confirm it against the depth of the forms on site.',
        'Where thickness varies across the slab, calculate each thickness zone separately and add the volumes.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Use the specified thickness',
      body: 'Measure the form depth to catch mistakes, but calculate with the thickness the drawing calls for. Measuring an uneven subgrade at its deepest point and using that single number everywhere will overestimate the pour.',
    },
    {
      type: 'figure',
      src: SUBGRADE_FIGURE.src,
      alt: SUBGRADE_FIGURE.alt,
      caption: 'A prepared subgrade — the surface the slab thickness is measured down to',
      width: SUBGRADE_FIGURE.width,
      height: SUBGRADE_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversion',
      text: 'Unit conversion: inches, feet, millimetres and metres',
    },
    {
      type: 'paragraph',
      text: 'Imperial slab dimensions are usually entered as length and width in feet but thickness in inches, because that is how drawings are annotated. Metric drawings are no different: lengths in metres, thickness in millimetres. Convert before multiplying.',
    },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'T (m) = T (mm) ÷ 1000   ·   T (m) = T (cm) ÷ 100' },
    {
      type: 'table',
      headers: ['Quantity', 'Conversion', 'Exact?'],
      rows: [
        ['1 foot', '12 inches', 'Yes'],
        ['1 inch', '25.4 millimetres', 'Yes'],
        ['1 foot', '0.3048 metres', 'Yes'],
        ['1 cubic foot', '0.0283168 cubic metres', 'Yes'],
        ['1 cubic yard', '27 cubic feet', 'Yes'],
        ['1 cubic yard', '0.764555 cubic metres', 'Rounded'],
        ['1 cubic metre', '35.3147 cubic feet', 'Rounded'],
        ['1 cubic metre', '1.30795 cubic yards', 'Rounded'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'The factor-of-12 error',
      body: 'Multiplying 10 ft × 10 ft × 4 without dividing the 4 by 12 gives 400 instead of 33.33 cubic feet — twelve times too much. If an answer looks implausible against the slab in front of you, check the thickness unit first.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'imperial-example',
      text: 'Worked example: a 10 ft × 10 ft slab at 4 inches',
    },
    {
      type: 'paragraph',
      text: 'Take a 10 foot by 10 foot slab specified at 4 inches thick. Convert the thickness, multiply, then convert the result into the unit concrete is sold in.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (ft) = 4 ÷ 12 = 0.33333 ft',
        'V = 10 × 10 × 0.33333 = 33.333 ft³',
        'V (yd³) = 33.333 ÷ 27 = 1.2346 yd³',
        'Rounded for reporting: 33.33 ft³ ≈ 1.23 yd³',
      ],
    },
    {
      type: 'paragraph',
      text: 'That 1.23 cubic yards is the exact geometric volume of the box. It is the correct answer to "how much space does this slab occupy", and it is not yet the number you should hand to a supplier. Section 8 deals with the difference.',
    },
    {
      type: 'heading', level: 2, id: 'metric-example', text: 'Metric worked example',
    },
    {
      type: 'paragraph',
      text: 'Now the same job drawn in metric units: a 3.05 m by 3.05 m slab specified at 100 mm thick. Convert the thickness to metres first, then multiply.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'T (m) = 100 ÷ 1000 = 0.100 m',
        'V = 3.05 × 3.05 × 0.100 = 0.93025 m³',
        'Rounded for reporting: 0.930 m³',
      ],
    },
    {
      type: 'paragraph',
      text: 'The two examples are close but deliberately not identical: 3.05 m is 10.007 ft and 100 mm is 3.937 in, so the metric slab is slightly smaller. Keeping the same job exactly equivalent gives 3.048 m × 3.048 m × 0.1016 m = 0.94389 m³, which converts back to 33.333 ft³ — the imperial answer to the digit. If your two unit systems disagree beyond that, one of them has a conversion error.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'unit-conversions',
      text: 'Converting cubic feet, cubic yards and cubic metres',
    },
    {
      type: 'paragraph',
      text: 'Volume conversions are one step once the geometry is done. Ready-mix in the United States is dispatched in cubic yards, bagged mix is quoted in cubic feet, and metric projects are supplied in cubic metres.',
    },
    {
      type: 'list',
      items: [
        'Cubic feet to cubic yards: divide by 27.',
        'Cubic yards to cubic feet: multiply by 27.',
        'Cubic feet to cubic metres: multiply by 0.0283168.',
        'Cubic metres to cubic feet: multiply by 35.3147.',
        'Cubic metres to cubic yards: multiply by 1.30795, or divide by 0.764555.',
      ],
    },
    {
      type: 'paragraph',
      text: 'For the imperial example, 33.333 ft³ ÷ 27 = 1.2346 yd³, and 1.2346 yd³ × 0.764555 = 0.94389 m³. Bagged concrete is a separate conversion: an 80 lb bag yields roughly 0.60 ft³ of wet concrete, so 33.333 ÷ 0.60 = 55.6, which rounds up to 56 bags. The same figure works out at about 45 eighty-pound bags per cubic yard, since one cubic yard is 27 ft³.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Ordering allowance: volume is not the order quantity',
    },
    {
      type: 'paragraph',
      text: 'The number produced by V = L × W × T is the geometric volume of an ideal rectangle. A real pour is never ideal, and the gap between the two is what an ordering allowance covers. How large that gap is depends on the site, which is why there is no single percentage that is correct for every job.',
    },
    {
      type: 'list',
      items: [
        'Subgrade that is cut low or over-excavated, so concrete fills more depth than the drawing shows.',
        'Formwork that spreads, bows or sits out of level under the hydrostatic pressure of the pour.',
        'A subbase that is not flat, leaving low spots that consume extra volume.',
        'Spillage, chute loss and pump priming that never reaches the form.',
        'Waste from finishing, screeding and working around penetrations and edges.',
        'Supplier minimums: a small slab may be rounded up simply because short loads carry a minimum charge.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Choose the allowance deliberately',
      body: 'Select an allowance from your own site conditions and record why you chose it. The MixTally Concrete Slab Calculator exposes a 0–20% allowance slider and shows the base volume, the added volume and the final order side by side, so the geometric figure and the ordered figure are never confused with each other.',
    },
    {
      type: 'paragraph',
      text: 'Two errors sit at opposite ends of this decision. Ordering exactly the geometric volume risks a shortfall partway through the pour, where a second delivery means a cold joint. Ordering far beyond what the site needs wastes budget and leaves material to dispose of. The correct allowance is the one you can justify for the conditions in front of you.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Common calculation mistakes',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Leaving thickness in inches while length and width are in feet. Always divide the thickness by 12 first.',
        'Rounding intermediate results. Keep full precision through the multiplication and round only the final figure.',
        'Mixing unit systems in one calculation — metres with feet, or centimetres with inches.',
        'Using the plan area of the whole footprint when the slab is actually several rectangles at different thicknesses.',
        'Ordering the geometric volume and nothing more, or applying the same allowance twice — once by hand and once inside the calculator.',
        'Ignoring slopes, crowns and thickened edges. A flat-slab formula underestimates any slab that is not a flat rectangle.',
        'Comparing an answer from one unit system with an answer from another without converting both to the same unit first.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Frequently asked questions' },
    {
      type: 'faq',
      items: [
        {
          question: 'How much concrete is in a 10 ft × 10 ft slab at 4 inches?',
          answer:
            '33.33 cubic feet, which is 1.23 cubic yards, before any ordering allowance. Multiply by 1.10 for a 10% allowance and the figure becomes 1.36 cubic yards.',
        },
        {
          question: 'How many 80 lb bags does that slab need?',
          answer:
            'An 80 lb bag yields about 0.60 cubic feet, so 33.33 ÷ 0.60 = 55.6, which rounds up to 56 bags. Equivalently, one cubic yard needs about 45 eighty-pound bags.',
        },
        {
          question: 'What is the formula in metric units?',
          answer:
            'V (m³) = length (m) × width (m) × thickness (m). If the thickness is given in millimetres divide it by 1000 first, or by 100 if it is given in centimetres — the same convention the calculator uses.',
        },
        {
          question: 'How thick should a concrete slab be?',
          answer:
            'Thickness is set by the drawing and the intended use of the slab, and this article deliberately does not prescribe one. Enter whatever thickness the specification calls for; the volume formula only needs the number to be consistent with your other units.',
        },
        {
          question: 'Should I order exactly the calculated volume?',
          answer:
            'No. The calculated figure is the geometric volume of an ideal box. Real pours lose volume to subgrade variation, form deflection and handling, so add an allowance you have chosen for your own site conditions, and check whether the supplier applies a short-load minimum.',
        },
      ],
    },
    { type: 'heading', level: 2, id: 'calculator-cta', text: 'Run the numbers in the calculator' },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Concrete Slab Calculator',
      body: 'Enter length, width, thickness and an allowance to see base volume, cubic yards, cubic feet, bag counts and an interactive 3D slab — in imperial or metric units.',
    },
  ],
  localized: {
    es: concreteVolumeEs,
    pt: concreteVolumePt,
    fr: concreteVolumeFr,
    de: concreteVolumeDe,
  },
};

const tenByTenSlabEs: ArticleTranslation = {
  imageAlt: 'Ilustración isométrica de una losa de concreto cuadrada con flechas de dimensión sobre una cuadrícula medida',
  ogImageAlt: 'Ilustración isométrica de una losa de concreto cuadrada con flechas de dimensión sobre una cuadrícula medida',
  title: '¿Cuánto concreto necesito para una losa de 10x10?',
  description:
    'Una losa de 10x10 necesita 1,23 jardas cúbicas a 4 pulgadas y 1,85 a 6 pulgadas. Vea el cálculo, los sacos, el margen y las opciones de entrega.',
  excerpt:
    'Volumen exacto para una losa de 10x10 a 4 y 6 pulgadas, los sacos que de él se derivan y cuánto pedir de más según las condiciones de la obra.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'slab-quantity',
      text: '¿Cuánto concreto necesita una losa de 10x10?',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Respuesta rápida',
      body: 'Una losa de 10 ft × 10 ft con 4 pulgadas de espesor tiene 33,33 pies cúbicos, es decir 1,23 jardas cúbicas. Con 6 pulgadas tiene 50,00 pies cúbicos, es decir 1,85 jardas cúbicas. Son volúmenes geométricos exactos antes de cualquier margen: con un margen del 10% el pedido pasa a 36,67 pies cúbicos (1,36 jardas cúbicas) y a 55,00 pies cúbicos (2,04 jardas cúbicas).',
    },
    {
      type: 'paragraph',
      text: 'Una losa de 10 por 10 cubre 100 pies cuadrados, que son 11,11 yardas cuadradas de superficie en planta. Esa cifra nunca cambia. Todo lo que sigue proviene de un único segundo dato: el espesor de la losa. A 4 pulgadas la losa tiene un tercio de pie de profundidad, así que contiene 33,33 pies cúbicos de concreto. A 6 pulgadas tiene medio pie, así que contiene 50,00 pies cúbicos. Seis pulgadas es una vez y media cuatro pulgadas, y el volumen responde exactamente en la misma proporción.',
    },
    {
      type: 'paragraph',
      text: 'El espesor, por tanto, no es un detalle que se decida después de calcular el volumen: es la entrada que decide el pedido. Tómelo del plano o de la especificación, no de un valor por defecto: una terraza, el piso de un garaje y una base de cobertizo pueden ser todos de 10 ft × 10 ft y aun así necesitar cantidades materialmente distintas. El método desarrollado detrás de cada cifra de esta página está en el artículo complementario sobre cómo calcular el volumen de concreto para una losa, que cubre la fórmula general en unidades imperiales y métricas.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculadora de Losa de Concreto',
      body: '¿Necesita otra medida de losa? Introduzca largo, ancho, espesor y un margen para obtener pies cúbicos, jardas cúbicas, conteo de sacos y una vista 3D interactiva en cualquiera de los dos sistemas de unidades.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'how-to-calculate',
      text: 'Cómo calcular la cantidad',
    },
    {
      type: 'paragraph',
      text: 'El cálculo tiene cinco pasos: medir el rectángulo, convertir el espesor a la misma unidad que el largo y el ancho, multiplicar para obtener pies cúbicos, dividir entre 27 para llegar a jardas cúbicas y añadir un margen por lo que la obra realmente consumirá.',
    },
    {
      type: 'figure',
      src: VOLUME_FORMULA_FIGURE.src,
      alt: 'Cinco pasos numerados que muestran la conversión del espesor de la losa a una cantidad de pedido en yardas cúbicas',
      caption: 'Los cinco pasos desde el espesor de la losa hasta la cantidad de pedido',
      width: VOLUME_FORMULA_FIGURE.width,
      height: VOLUME_FORMULA_FIGURE.height,
    },
    { type: 'formula', expression: 'A = L × W' },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'V (ft³) = A × T' },
    { type: 'formula', expression: 'V (yd³) = V (ft³) ÷ 27' },
    { type: 'formula', expression: 'V_order = V × (1 + allowance)' },
    {
      type: 'heading',
      level: 3,
      id: 'step-1-measure',
      text: 'Paso 1: medir la losa',
    },
    {
      type: 'paragraph',
      text: 'Largo y ancho son las dimensiones exteriores de la losa acabada, ambas de 10 ft aquí, lo que da una superficie en planta de 100 pies cuadrados. Mida sobre el área que el concreto llenará y no sobre las tablas de la cimbra, y compruebe que los ángulos sean rectos comparando las diagonales: dos diagonales iguales confirman que el rectángulo es verdadero.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-2-convert',
      text: 'Paso 2: convertir el espesor a pies',
    },
    {
      type: 'paragraph',
      text: 'Los planos anotan el espesor en pulgadas, así que convierta antes de multiplicar. Cuatro pulgadas es 4 ÷ 12 = 0,33333 ft y seis pulgadas es 6 ÷ 12 = 0,50000 ft. Omitir esta conversión es el clásico error del factor 12: devuelve 400 en lugar de 33,33, una cifra doce veces demasiado grande.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-3-cubic-feet',
      text: 'Paso 3: multiplicar para obtener pies cúbicos',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Superficie en planta: 10 × 10 = 100 ft²',
        'Espesor en pies: 4 ÷ 12 = 0,33333 ft',
        'Volumen a 4 in: 100 × 0,33333 = 33,333 ft³',
        'Volumen a 6 in: 100 × 0,50000 = 50,000 ft³',
      ],
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-4-cubic-yards',
      text: 'Paso 4: convertir a jardas cúbicas',
    },
    {
      type: 'paragraph',
      text: 'El concreto listo se despacha por jarda cúbica, así que divida los pies cúbicos entre 27. A 4 pulgadas, 33,333 ÷ 27 = 1,2346 jardas cúbicas, que se informan como 1,23. A 6 pulgadas, 50,000 ÷ 27 = 1,8519 jardas cúbicas, que se informan como 1,85. Mantenga toda la precisión durante esa división y redondee solo las cifras que va a escribir, porque redondear dos veces —una en pies cúbicos y otra en jardas cúbicas— desplaza la respuesta sin que se note.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-5-allowance',
      text: 'Paso 5: añadir el margen de pedido',
    },
    {
      type: 'paragraph',
      text: 'Las cifras anteriores describen una caja ideal con paredes rectas. Las losas reales consumen más que la caja ideal, así que se aplica un margen en porcentaje antes de entregar la cifra a un proveedor o de usarla para contar sacos.',
    },
    {
      type: 'table',
      headers: ['Espesor', 'Base (yd³)', '+5% (yd³)', '+10% (yd³)', '+10% (ft³)'],
      rows: [
        ['4 in', '1,23', '1,30', '1,36', '36,67'],
        ['6 in', '1,85', '1,94', '2,04', '55,00'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'No redondee antes de dividir',
      body: 'Informar 1,23 jardas cúbicas y luego tratarla como el valor de trabajo pierde las 0,0046 jardas cúbicas que el redondeo eliminó, y repetir ese hábito en varios vaciados se acumula. Lleve 1,2346 por todo el cálculo del margen y redondee la cantidad final de pedido una sola vez.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'thickness-comparison',
      text: '4 pulgadas frente a 6 pulgadas',
    },
    {
      type: 'paragraph',
      text: 'Ambos espesores describen la misma huella, así que la comparación es puramente proporcional. Seis pulgadas de concreto son una vez y media cuatro pulgadas, lo que significa 50,00 pies cúbicos frente a 33,33 pies cúbicos, 1,85 jardas cúbicas frente a 1,23 jardas cúbicas y 28 sacos de 80 lb más.',
    },
    {
      type: 'table',
      headers: ['Espesor', 'Volumen (ft³)', 'Volumen (yd³)', 'Sacos de 80 lb', 'Sacos de 60 lb'],
      rows: [
        ['4 in', '33,33', '1,23', '56', '75'],
        ['6 in', '50,00', '1,85', '84', '112'],
        ['Diferencia', '+16,67', '+0,62', '+28', '+37'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Los 0,62 jardas cúbicas adicionales rara vez son por sí solos el factor decisivo, pero son la diferencia entre una estrategia de pedido y otra, y la diferencia entre una losa que coincide con el plano y una que no. Elija el espesor según el uso previsto y la especificación estructural; el cálculo de cantidad solo informa de lo que esa decisión cuesta en material.',
    },
    {
      type: 'figure',
      src: SLAB_CROSS_SECTION_FIGURE.src,
      alt: 'Ilustración en corte de una losa de concreto sobre una base granular compactada y suelo natural',
      caption: 'Corte transversal: el espesor de concreto se apoya sobre una base granular compactada',
      width: SLAB_CROSS_SECTION_FIGURE.width,
      height: SLAB_CROSS_SECTION_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'bag-quantities',
      text: 'Concreto en sacos: contar sacos de 80 lb y 60 lb',
    },
    {
      type: 'paragraph',
      text: 'La mezcla en sacos se compra por saco y no por volumen, así que hay que dividir el volumen entre el rendimiento de un solo saco y redondear siempre hacia arriba. Un saco de 80 lb rinde 0,60 pies cúbicos de concreto fresco y un saco de 60 lb rinde 0,45 pies cúbicos: las mismas cifras que usa la calculadora de MixTally y los rendimientos publicados para el concreto en sacos QUIKRETE.',
    },
    {
      type: 'formula',
      expression: 'bags = ⌈ total ft³ ÷ bag yield ⌉',
      note: 'Un saco de 80 lb da 0,60 ft³; un saco de 60 lb da 0,45 ft³.',
    },
    {
      type: 'table',
      headers: ['Tamaño del saco', 'Rendimiento (ft³)', 'Sacos por yd³', 'A 4 in', 'A 6 in'],
      rows: [
        ['80 lb', '0,60', '45', '56', '84'],
        ['60 lb', '0,45', '60', '75', '112'],
      ],
    },
    {
      type: 'paragraph',
      text: 'La aritmética para la losa de 4 pulgadas es 33,333 ÷ 0,60 = 55,6, que redondea hacia arriba a 56 sacos; con sacos de 60 lb es 33,333 ÷ 0,45 = 74,1, que redondea hacia arriba a 75. Por jarda cúbica los conteos son exactos: 27 ÷ 0,60 = 45 sacos de ochenta libras y 27 ÷ 0,45 = 60 sacos de sesenta libras. Aplicar el margen antes de dividir cambia los totales a 62 y 82 sacos a 4 pulgadas, y a 92 y 123 sacos a 6 pulgadas.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Cuente los sacos desde los pies cúbicos, nunca desde las yardas redondeadas',
      body: 'Dividir las 1,23 jardas cúbicas informadas entre 0,60 da un número sin sentido, y convertir esas 1,23 de vuelta a pies cúbicos da 33,21 en lugar de 33,33. Cuente los sacos desde los pies cúbicos sin redondear para que el redondeo ocurra una sola vez, en el límite del saco.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ready-mix-vs-bags',
      text: 'Concreto listo o concreto en sacos',
    },
    {
      type: 'paragraph',
      text: 'Una cantidad entre 1,23 y 2,04 jardas cúbicas se sitúa donde ambas rutas de entrega son realistas. La mezcla en sacos le permite comprar exactamente el conteo que produce el cálculo y guarda los sacos sin abrir para más tarde. El concreto listo se dosifica por volumen en la planta, llega listo para descargarse y suele tener un mínimo del proveedor para cargas pequeñas, así que confirme qué aplica antes de dar por sentado que la cifra calculada es la cantidad que le cobrarán.',
    },
    {
      type: 'figure',
      src: DELIVERY_COMPARISON_FIGURE.src,
      alt: 'Ilustración dividida de un camión de concreto premezclado descargando en una cimbra, junto a sacos apilados y una revolvedora de tambor',
      caption: 'Concreto listo descargado por canaleta a la izquierda, mezcla en sacos preparada en obra a la derecha',
      width: DELIVERY_COMPARISON_FIGURE.width,
      height: DELIVERY_COMPARISON_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Consideración', 'Concreto listo', 'Mezcla en sacos'],
      rows: [
        ['Unidad de pedido', 'Jardas cúbicas del cálculo', 'Sacos individuales del conteo'],
        ['Vacíados pequeños', 'Sujeto a un mínimo del proveedor', 'Compre exactamente lo necesario'],
        ['Manejo', 'Entregado y descargado en la cimbra', 'Mezclado, transportado y colocado a mano'],
        ['Almacenamiento', 'Debe colocarse de una sola vez', 'Los sacos sin abrir se conservan si se guardan secos'],
        ['Mezclado', 'Dosificado en la planta', 'Mezclado en obra, así que importa controlar el agua'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Sea cual sea la ruta elegida, la cantidad no cambia. El volumen de una losa de 10 ft × 10 ft es una propiedad de su geometría; la entrega solo cambia cómo se compra, se transporta y se coloca ese volumen.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Margen de pedido: qué entregar',
    },
    {
      type: 'paragraph',
      text: 'Un margen de pedido cubre la distancia entre el rectángulo ideal y la losa que se construye. Su tamaño depende de la obra y no de una regla universal, por eso la calculadora expone un control de 0 a 20% con el 10% como punto de partida.',
    },
    {
      type: 'list',
      items: [
        'Un subsuelo cortado un poco bajo, de modo que el concreto rellene más profundidad de la que muestra el plano.',
        'Cimbras que se abren o quedan fuera de nivel bajo la presión del vaciado.',
        'Una base que no está perfectamente plana, con bajas que consumen volumen adicional.',
        'Derrames, pérdida por la canaleta y material que queda en la revolvedora al final del vaciado.',
        'Acabado, reglado y trabajo alrededor de bordes y penetraciones.',
        'Un mínimo del proveedor que redondea hacia arriba un pedido pequeño sin importar el cálculo.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Aplicado a la losa de 4 pulgadas, un margen del 10% mueve el pedido de 33,33 pies cúbicos a 36,67 pies cúbicos, de 1,23 jardas cúbicas a 1,36 jardas cúbicas y de 56 sacos de mezcla de 80 lb a 62. Pedir exactamente el volumen geométrico arriesga quedarse corto a mitad del vaciado, donde una segunda descarga significa una junta fría; pedir muy por encima de lo que la obra necesita desperdicia presupuesto y deja material por desechar. Anote el margen que eligió y por qué.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'faq',
      text: 'Preguntas frecuentes',
    },
    {
      type: 'faq',
      items: [
        {
          question: '¿Cuánto concreto hay en una losa de 10 ft × 10 ft a 4 pulgadas?',
          answer:
            '33,33 pies cúbicos, es decir 1,23 jardas cúbicas, antes de cualquier margen. Con un margen del 10% el pedido pasa a 36,67 pies cúbicos, o 1,36 jardas cúbicas.',
        },
        {
          question: '¿Cuánto concreto se necesita a 6 pulgadas?',
          answer:
            '50,00 pies cúbicos, es decir 1,85 jardas cúbicas. Eso es exactamente 1,5 veces la losa de 4 pulgadas, porque 6 pulgadas es 1,5 veces 4 pulgadas.',
        },
        {
          question: '¿Cuántos sacos de concreto necesito?',
          answer:
            'A 4 pulgadas: 56 de 80 lb o 75 de 60 lb sin margen, y 62 de 80 lb o 82 de 60 lb con 10%. A 6 pulgadas: 84 de 80 lb o 112 de 60 lb sin margen, y 92 de 80 lb o 123 de 60 lb con 10%.',
        },
        {
          question: '¿Debo pedir exactamente el volumen calculado?',
          answer:
            'No. La cifra calculada es el volumen de una caja ideal. Los vaciados reales pierden o ganan volumen por variación del subsuelo, deformación de la cimbra y manejo, así que añada un margen que haya elegido para su propia obra y compruebe si aplica un mínimo del proveedor.',
        },
        {
          question: '¿Qué es más barato, concreto listo o en sacos?',
          answer:
            'Depende de los precios locales de sacos, del precio del proveedor por jarda cúbica y de cualquier mínimo por carga corta. Compare el costo del conteo exacto de sacos con el precio entregado incluyendo ese mínimo, y tenga en cuenta la mano de obra de mezclar sacos a mano.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calcule su propia cantidad de concreto',
    },
    {
      type: 'paragraph',
      text: 'Las cifras anteriores son específicas para 10 ft × 10 ft a dos espesores. Para cualquier otro rectángulo, introduzca las dimensiones y el margen en la calculadora y lea el volumen base, el volumen de pedido, las jardas cúbicas, los pies cúbicos y ambos conteos de sacos uno al lado del otro.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculadora de Losa de Concreto de MixTally',
      body: 'Imperiales o métricos, un control de margen de 0 a 20% y conteos de sacos para mezclas de 80 lb y 60 lb, con el volumen geométrico separado de la cantidad de pedido.',
    },
  ],
};

const tenByTenSlabPt: ArticleTranslation = {
  imageAlt: 'Ilustração isométrica de uma laje de concreto quadrada com setas de dimensão sobre uma grade medida',
  ogImageAlt: 'Ilustração isométrica de uma laje de concreto quadrada com setas de dimensão sobre uma grade medida',
  title: 'Quanto de concreto preciso para uma laje de 10x10?',
  description:
    'Uma laje de 10x10 precisa de 1,23 jardas cúbicas com 4 polegadas e 1,85 com 6 polegadas. Veja o cálculo, os sacos, a margem e as opções de entrega.',
  excerpt:
    'Volume exato para uma laje de 10x10 a 4 e 6 polegadas, os sacos daí resultantes e quanto pedir de mais conforme as condições do canteiro.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'slab-quantity',
      text: 'Quanto concreto uma laje de 10x10 precisa?',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Resposta rápida',
      body: 'Uma laje de 10 ft × 10 ft com 4 polegadas de espessura tem 33,33 pés cúbicos, ou seja 1,23 jardas cúbicas. Com 6 polegadas tem 50,00 pés cúbicos, ou seja 1,85 jardas cúbicas. São volumes geométricos exatos antes de qualquer margem: com 10% de margem o pedido passa para 36,67 pés cúbicos (1,36 jardas cúbicas) e para 55,00 pés cúbicos (2,04 jardas cúbicas).',
    },
    {
      type: 'paragraph',
      text: 'Uma laje de 10 por 10 cobre 100 pés quadrados, que são 11,11 jardas quadradas de área em planta. Esse número nunca muda. Tudo o que vem daí deriva de um único segundo dado: a espessura da laje. A 4 polegadas a laje tem um terço de pé de profundidade, então contém 33,33 pés cúbicos de concreto. A 6 polegadas tem meio pé, então contém 50,00 pés cúbicos. Seis polegadas é uma vez e meia quatro polegadas, e o volume responde exatamente na mesma proporção.',
    },
    {
      type: 'paragraph',
      text: 'A espessura, portanto, não é um detalhe a resolver depois de calcular o volume: é a entrada que decide o pedido. Pegue-a do desenho ou da especificação, e não de um padrão: uma varanda, o piso de uma garagem e a base de um galpão podem todos medir 10 ft × 10 ft e ainda assim exigir quantidades significativamente diferentes. O método desenvolvido por trás de cada número desta página está no artigo complementar sobre como calcular o volume de concreto para uma laje, que cobre a fórmula geral em unidades imperiais e métricas.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculadora de Laje de Concreto',
      body: 'Precisa de outra medida de laje? Informe comprimento, largura, espessura e uma margem para obter pés cúbicos, jardas cúbicas, contagem de sacos e uma visualização 3D interativa em qualquer um dos dois sistemas de unidades.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'how-to-calculate',
      text: 'Como calcular a quantidade',
    },
    {
      type: 'paragraph',
      text: 'O cálculo tem cinco passos: medir o retângulo, converter a espessura para a mesma unidade do comprimento e da largura, multiplicar para chegar aos pés cúbicos, dividir por 27 para chegar às jardas cúbicas e acrescentar uma margem pelo que o canteiro realmente consumirá.',
    },
    {
      type: 'figure',
      src: VOLUME_FORMULA_FIGURE.src,
      alt: 'Cinco passos numerados que mostram a conversão da espessura da laje em uma quantidade de pedido em jardas cúbicas',
      caption: 'Os cinco passos da espessura da laje até a quantidade de pedido',
      width: VOLUME_FORMULA_FIGURE.width,
      height: VOLUME_FORMULA_FIGURE.height,
    },
    { type: 'formula', expression: 'A = L × W' },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'V (ft³) = A × T' },
    { type: 'formula', expression: 'V (yd³) = V (ft³) ÷ 27' },
    { type: 'formula', expression: 'V_order = V × (1 + allowance)' },
    {
      type: 'heading',
      level: 3,
      id: 'step-1-measure',
      text: 'Passo 1: medir a laje',
    },
    {
      type: 'paragraph',
      text: 'Comprimento e largura são as dimensões externas da laje acabada, ambas de 10 ft aqui, o que dá uma área em planta de 100 pés quadrados. Meça sobre a área que o concreto vai preencher, e não sobre as tábuas da fôrma, e confira se os cantos são retos comparando as diagonais: duas diagonais iguais confirmam que o retângulo está de verdade.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-2-convert',
      text: 'Passo 2: converter a espessura para pés',
    },
    {
      type: 'paragraph',
      text: 'Os desenhos anotam a espessura em polegadas, então converta antes de multiplicar. Quatro polegadas é 4 ÷ 12 = 0,33333 ft e seis polegadas é 6 ÷ 12 = 0,50000 ft. Pular essa conversão é o clássico erro do fator 12: devolve 400 em vez de 33,33, um número doze vezes maior.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-3-cubic-feet',
      text: 'Passo 3: multiplicar para obter pés cúbicos',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Área em planta: 10 × 10 = 100 ft²',
        'Espessura em pés: 4 ÷ 12 = 0,33333 ft',
        'Volume a 4 in: 100 × 0,33333 = 33,333 ft³',
        'Volume a 6 in: 100 × 0,50000 = 50,000 ft³',
      ],
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-4-cubic-yards',
      text: 'Passo 4: converter para jardas cúbicas',
    },
    {
      type: 'paragraph',
      text: 'O concreto pronto é despachado em jarda cúbica, então divida os pés cúbicos por 27. A 4 polegadas, 33,333 ÷ 27 = 1,2346 jardas cúbicas, informadas como 1,23. A 6 polegadas, 50,000 ÷ 27 = 1,8519 jardas cúbicas, informadas como 1,85. Mantenha toda a precisão durante essa divisão e arredonde apenas os números que vai escrever, porque arredondar duas vezes — uma em pés cúbicos e outra em jardas cúbicas — desloca a resposta sem que se perceba.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-5-allowance',
      text: 'Passo 5: acrescentar a margem de pedido',
    },
    {
      type: 'paragraph',
      text: 'Os números acima descrevem uma caixa ideal com paredes retas. Lajes reais consomem mais do que a caixa ideal, então se aplica uma margem em porcentagem antes de entregar o número a um fornecedor ou de usá-lo para contar sacos.',
    },
    {
      type: 'table',
      headers: ['Espessura', 'Base (yd³)', '+5% (yd³)', '+10% (yd³)', '+10% (ft³)'],
      rows: [
        ['4 in', '1,23', '1,30', '1,36', '36,67'],
        ['6 in', '1,85', '1,94', '2,04', '55,00'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Não arredonde antes de dividir',
      body: 'Informar 1,23 jardas cúbicas e depois tratá-las como o valor de trabalho perde as 0,0046 jardas cúbicas que o arredondamento removeu, e repetir esse hábito em várias concretagens se acumula. Leve 1,2346 por todo o cálculo da margem e arredonde a quantidade final do pedido uma única vez.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'thickness-comparison',
      text: '4 polegadas contra 6 polegadas',
    },
    {
      type: 'paragraph',
      text: 'As duas espessuras descrevem a mesma implantação, então a comparação é puramente proporcional. Seis polegadas de concreto são uma vez e meia quatro polegadas, o que significa 50,00 pés cúbicos contra 33,33 pés cúbicos, 1,85 jardas cúbicas contra 1,23 jardas cúbicas e 28 sacos de 80 lb a mais.',
    },
    {
      type: 'table',
      headers: ['Espessura', 'Volume (ft³)', 'Volume (yd³)', 'Sacos de 80 lb', 'Sacos de 60 lb'],
      rows: [
        ['4 in', '33,33', '1,23', '56', '75'],
        ['6 in', '50,00', '1,85', '84', '112'],
        ['Diferença', '+16,67', '+0,62', '+28', '+37'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Os 0,62 jardas cúbicas a mais raramente são por si só o fator decisivo, mas são a diferença entre uma estratégia de pedido e outra, e a diferença entre uma laje que bate com o desenho e uma que não bate. Escolha a espessura pelo uso pretendido e pela especificação estrutural; o cálculo da quantidade apenas informa o que essa decisão custa em material.',
    },
    {
      type: 'figure',
      src: SLAB_CROSS_SECTION_FIGURE.src,
      alt: 'Ilustração em corte de uma laje de concreto sobre uma base granular compactada e solo natural',
      caption: 'Corte transversal: a espessura de concreto fica sobre uma base granular compactada',
      width: SLAB_CROSS_SECTION_FIGURE.width,
      height: SLAB_CROSS_SECTION_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'bag-quantities',
      text: 'Concreto em sacos: contando sacos de 80 lb e 60 lb',
    },
    {
      type: 'paragraph',
      text: 'A mistura em sacos é comprada por saco e não por volume, então é preciso dividir o volume pelo rendimento de um único saco e sempre arredondar para cima. Um saco de 80 lb rende 0,60 pés cúbicos de concreto fresco e um saco de 60 lb rende 0,45 pés cúbicos — os mesmos números que a calculadora do MixTally usa e os rendimentos publicados para o concreto em sacos QUIKRETE.',
    },
    {
      type: 'formula',
      expression: 'bags = ⌈ total ft³ ÷ bag yield ⌉',
      note: 'Um saco de 80 lb dá 0,60 ft³; um saco de 60 lb dá 0,45 ft³.',
    },
    {
      type: 'table',
      headers: ['Tamanho do saco', 'Rendimento (ft³)', 'Sacos por yd³', 'A 4 in', 'A 6 in'],
      rows: [
        ['80 lb', '0,60', '45', '56', '84'],
        ['60 lb', '0,45', '60', '75', '112'],
      ],
    },
    {
      type: 'paragraph',
      text: 'A aritmética para a laje de 4 polegadas é 33,333 ÷ 0,60 = 55,6, que arredonda para cima a 56 sacos; com sacos de 60 lb é 33,333 ÷ 0,45 = 74,1, que arredonda para cima a 75. Por jarda cúbica as contagens são exatas: 27 ÷ 0,60 = 45 sacos de oitenta libras e 27 ÷ 0,45 = 60 sacos de sessenta libras. Aplicar a margem antes de dividir muda os totais para 62 e 82 sacos a 4 polegadas, e para 92 e 123 sacos a 6 polegadas.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Conte os sacos pelos pés cúbicos, nunca pelas jardas arredondadas',
      body: 'Dividir as 1,23 jardas cúbicas informadas por 0,60 dá um número sem sentido, e converter essas 1,23 de volta para pés cúbicos dá 33,21 em vez de 33,33. Conte os sacos pelos pés cúbicos sem arredondar para que o arredondamento aconteça uma única vez, na fronteira do saco.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ready-mix-vs-bags',
      text: 'Concreto pronto ou concreto em sacos',
    },
    {
      type: 'paragraph',
      text: 'Uma quantidade entre 1,23 e 2,04 jardas cúbicas fica onde as duas rotas de entrega são realistas. A mistura em sacos deixa você comprar exatamente a contagem que o cálculo produz e guarda os sacos intactos para depois. O concreto pronto é dosificado por volume na planta, chega pronto para descarga e normalmente tem um mínimo do fornecedor para cargas pequenas, então confirme o que se aplica antes de dar como certo que a cifra calculada é a quantidade que será cobrada.',
    },
    {
      type: 'figure',
      src: DELIVERY_COMPARISON_FIGURE.src,
      alt: 'Ilustração dividida de um caminhão de concreto pronto descendo em uma fôrma, ao lado de sacos empilhados e uma betoneira',
      caption: 'Concreto pronto descido pela calha à esquerda, mistura em sacos preparada no canteiro à direita',
      width: DELIVERY_COMPARISON_FIGURE.width,
      height: DELIVERY_COMPARISON_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Consideração', 'Concreto pronto', 'Mistura em sacos'],
      rows: [
        ['Unidade de pedido', 'Jardas cúbicas do cálculo', 'Sacos individuais da contagem'],
        ['Concretagens pequenas', 'Sujeito a um mínimo do fornecedor', 'Compre exatamente o que é preciso'],
        ['Manuseio', 'Entregue e descido na fôrma', 'Misturado, carregado e assentado à mão'],
        ['Armazenagem', 'Deve ser assentado de uma só vez', 'Sacos intactos se guardados em local seco'],
        ['Mistura', 'Dosificado na planta', 'Misturado no canteiro, então controlar a água importa'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Seja qual for a rota escolhida, a quantidade não muda. O volume de uma laje de 10 ft × 10 ft é uma propriedade da sua geometria; a entrega apenas muda como esse volume é comprado, transportado e assentado.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Margem de pedido: o que entregar',
    },
    {
      type: 'paragraph',
      text: 'Uma margem de pedido cobre a distância entre o retângulo ideal e a laje que é construída. O quanto ela deve ser depende do canteiro e não de uma regra universal, e por isso a calculadora expõe um controle de 0 a 20% com 10% como ponto de partida.',
    },
    {
      type: 'list',
      items: [
        'Um subsolo cortado um pouco baixo, de modo que o concreto preencha mais profundidade do que o desenho mostra.',
        'Fôrmas que abrem ou ficam fora de nível sob a pressão da concretagem.',
        'Uma base que não está perfeitamente plana, com baixas que consomem volume adicional.',
        'Derramamentos, perda pela calha e material que fica na betoneira no fim da concretagem.',
        'Acabamento, desempeno e trabalho ao redor de bordas e furos.',
        'Um mínimo do fornecedor que arredonda para cima um pedido pequeno, não importa o cálculo.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Aplicado à laje de 4 polegadas, uma margem de 10% move o pedido de 33,33 pés cúbicos para 36,67 pés cúbicos, de 1,23 jardas cúbicas para 1,36 jardas cúbicas e de 56 sacos de mistura de 80 lb para 62. Pedir exatamente o volume geométrico arrisca faltar material no meio da concretagem, onde uma segunda descarga significa uma junta fria; pedir muito além do que o canteiro precisa desperdiça orçamento e deixa material para descartar. Anote a margem que escolheu e por que.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'faq',
      text: 'Perguntas frequentes',
    },
    {
      type: 'faq',
      items: [
        {
          question: 'Quanto de concreto tem numa laje de 10 ft × 10 ft a 4 polegadas?',
          answer:
            '33,33 pés cúbicos, ou seja 1,23 jardas cúbicas, antes de qualquer margem. Com 10% de margem o pedido passa para 36,67 pés cúbicos, ou 1,36 jardas cúbicas.',
        },
        {
          question: 'Quanto de concreto é preciso a 6 polegadas?',
          answer:
            '50,00 pés cúbicos, ou seja 1,85 jardas cúbicas. Isso é exatamente 1,5 vezes a laje de 4 polegadas, porque 6 polegadas é 1,5 vezes 4 polegadas.',
        },
        {
          question: 'Quantos sacos de concreto eu preciso?',
          answer:
            'A 4 polegadas: 56 de 80 lb ou 75 de 60 lb sem margem, e 62 de 80 lb ou 82 de 60 lb com 10%. A 6 polegadas: 84 de 80 lb ou 112 de 60 lb sem margem, e 92 de 80 lb ou 123 de 60 lb com 10%.',
        },
        {
          question: 'Devo pedir exatamente o volume calculado?',
          answer:
            'Não. O número calculado é o volume de uma caixa ideal. Concretagens reais perdem ou ganham volume por variação do subsolo, deformação da fôrma e manuseio, então acrescente uma margem que você escolheu para o seu próprio canteiro e confira se há um mínimo do fornecedor.',
        },
        {
          question: 'O que sai mais barato, concreto pronto ou em sacos?',
          answer:
            'Depende dos preços locais de sacos, do preço do fornecedor por jarda cúbica e de qualquer mínimo por carga curta. Compare o custo da contagem exata de sacos com o preço entregue incluindo esse mínimo, e some a mão de obra de misturar sacos à mão.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calcule a sua própria quantidade de concreto',
    },
    {
      type: 'paragraph',
      text: 'Os números acima são específicos para 10 ft × 10 ft em duas espessuras. Para qualquer outro retângulo, informe as dimensões e a margem na calculadora e leia o volume base, o volume de pedido, as jardas cúbicas, os pés cúbicos e as duas contagens de sacos lado a lado.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculadora de Laje de Concreto do MixTally',
      body: 'Imperiais ou métricos, um controle de margem de 0 a 20% e contagens de sacos para misturas de 80 lb e 60 lb, com o volume geométrico separado da quantidade de pedido.',
    },
  ],
};

const tenByTenSlabFr: ArticleTranslation = {
  imageAlt: 'Illustration isométrique d’une dalle carrée en béton avec des flèches de cote sur une grille graduée',
  ogImageAlt: 'Illustration isométrique d’une dalle carrée en béton avec des flèches de cote sur une grille graduée',
  title: 'Combien de béton faut-il pour une dalle de 10x10 ?',
  description:
    'Une dalle de 10x10 demande 1,23 yards cubes à 4 pouces et 1,85 à 6 pouces. Voyez le calcul, les sacs, la marge et les options de livraison.',
  excerpt:
    'Volume exact d’une dalle de 10x10 à 4 et 6 pouces, les sacs qui en découlent et la quantité à commander en plus selon l’état du chantier.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'slab-quantity',
      text: 'Combien de béton faut-il pour une dalle de 10x10 ?',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Réponse rapide',
      body: 'Une dalle de 10 ft × 10 ft à 4 pouces d’épaisseur fait 33,33 pieds cubes, soit 1,23 yards cubes. À 6 pouces, elle fait 50,00 pieds cubes, soit 1,85 yards cubes. Ce sont des volumes géométriques exacts avant toute marge : avec 10 % de marge, la commande passe à 36,67 pieds cubes (1,36 yards cubes) et à 55,00 pieds cubes (2,04 yards cubes).',
    },
    {
      type: 'paragraph',
      text: 'Une dalle de 10 sur 10 couvre 100 pieds carrés, soit 11,11 yards carrés de surface au plan. Ce chiffre ne change jamais. Tout ce qui suit découle d’une seule seconde donnée : l’épaisseur de la dalle. À 4 pouces, la dalle mesure un tiers de pied de profondeur et contient donc 33,33 pieds cubes de béton. À 6 pouces, elle mesure un demi-pied et en contient 50,00. Six pouces font une fois et demie quatre pouces, et le volume répond exactement dans cette proportion.',
    },
    {
      type: 'paragraph',
      text: 'L’épaisseur n’est donc pas un détail à trancher après le calcul du volume. C’est la donnée qui décide de la commande. Reprenez-la sur le plan ou dans le cahier des charges, jamais une valeur par défaut : une terrasse, un sol de garage et la fondation d’un abri peuvent tous faire 10 ft × 10 ft et demander pourtant des quantités très différentes. La méthode complète derrière chaque chiffre de cette page est détaillée dans l’article compagnon sur le calcul du volume de béton d’une dalle, qui couvre la formule générale en unités impériales et métriques.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculatrice de dalle en béton',
      body: 'Besoin d’une autre taille de dalle ? Saisissez longueur, largeur, épaisseur et une marge pour obtenir les pieds cubes, les yards cubes, le décompte des sacs et un aperçu 3D interactif dans l’un ou l’autre système d’unités.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'how-to-calculate',
      text: 'Comment calculer la quantité',
    },
    {
      type: 'paragraph',
      text: 'Le calcul comporte cinq étapes : mesurer le rectangle, convertir l’épaisseur dans l’unité de la longueur et de la largeur, multiplier pour obtenir les pieds cubes, diviser par 27 pour atteindre les yards cubes, puis ajouter une marge pour ce que le chantier consommera réellement.',
    },
    {
      type: 'figure',
      src: VOLUME_FORMULA_FIGURE.src,
      alt: 'Cinq étapes numérotées montrant la conversion de l’épaisseur de la dalle en une quantité commandée en yards cubes',
      caption: 'Les cinq étapes, de l’épaisseur de la dalle à la quantité commandée',
      width: VOLUME_FORMULA_FIGURE.width,
      height: VOLUME_FORMULA_FIGURE.height,
    },
    { type: 'formula', expression: 'A = L × W' },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'V (ft³) = A × T' },
    { type: 'formula', expression: 'V (yd³) = V (ft³) ÷ 27' },
    { type: 'formula', expression: 'V_order = V × (1 + allowance)' },
    {
      type: 'heading',
      level: 3,
      id: 'step-1-measure',
      text: 'Étape 1 : mesurer la dalle',
    },
    {
      type: 'paragraph',
      text: 'La longueur et la largeur sont les dimensions extérieures de la dalle finie, 10 ft chacune ici, ce qui donne une surface au plan de 100 pieds carrés. Mesurez sur la surface que le béton remplira et non sur les planches de banches, et vérifiez que les angles sont droits en comparant les diagonales : deux diagonales égales confirment que le rectangle est juste.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-2-convert',
      text: 'Étape 2 : convertir l’épaisseur en pieds',
    },
    {
      type: 'paragraph',
      text: 'Les plans annotent l’épaisseur en pouces, convertissez donc avant de multiplier. Quatre pouces valent 4 ÷ 12 = 0,33333 ft et six pouces valent 6 ÷ 12 = 0,50000 ft. Omettre cette conversion, c’est l’erreur classique du facteur 12 : elle renvoie 400 au lieu de 33,33, un chiffre douze fois trop grand.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-3-cubic-feet',
      text: 'Étape 3 : multiplier pour obtenir les pieds cubes',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Surface au plan : 10 × 10 = 100 ft²',
        'Épaisseur en pieds : 4 ÷ 12 = 0,33333 ft',
        'Volume à 4 in : 100 × 0,33333 = 33,333 ft³',
        'Volume à 6 in : 100 × 0,50000 = 50,000 ft³',
      ],
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-4-cubic-yards',
      text: 'Étape 4 : convertir en yards cubes',
    },
    {
      type: 'paragraph',
      text: 'Le béton prêt à l’emploi se livre au yard cube, divisez donc les pieds cubes par 27. À 4 pouces, 33,333 ÷ 27 = 1,2346 yards cubes, annoncés comme 1,23. À 6 pouces, 50,000 ÷ 27 = 1,8519 yards cubes, annoncés comme 1,85. Conservez toute la précision pendant cette division et n’arrondissez que les chiffres que vous écrivez, car arrondir deux fois — une fois en pieds cubes puis en yards cubes — déplace la réponse sans qu’on le voie.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-5-allowance',
      text: 'Étape 5 : ajouter la marge de commande',
    },
    {
      type: 'paragraph',
      text: 'Les chiffres ci-dessus décrivent une boîte idéale à parois droites. Les dalles réelles consomment davantage que la boîte idéale : un pourcentage de marge est donc appliqué avant de transmettre le chiffre à un fournisseur ou de s’en servir pour compter les sacs.',
    },
    {
      type: 'table',
      headers: ['Épaisseur', 'Base (yd³)', '+5% (yd³)', '+10% (yd³)', '+10% (ft³)'],
      rows: [
        ['4 in', '1,23', '1,30', '1,36', '36,67'],
        ['6 in', '1,85', '1,94', '2,04', '55,00'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'N’arrondissez pas avant de diviser',
      body: 'Annoncer 1,23 yards cubes puis utiliser ce chiffre comme valeur de travail perd les 0,0046 yards cubes supprimés par l’arrondi, et répéter cette habitude sur plusieurs coulées finit par se sentir. Gardez 1,2346 pendant tout le calcul de marge et n’arrondissez la quantité finale qu’une seule fois.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'thickness-comparison',
      text: '4 pouces contre 6 pouces',
    },
    {
      type: 'paragraph',
      text: 'Les deux épaisseurs décrivent la même emprise, la comparaison est donc purement proportionnelle. Six pouces de béton font une fois et demie quatre pouces, soit 50,00 pieds cubes contre 33,33 pieds cubes, 1,85 yards cubes contre 1,23 yards cubes, et 28 sacs de 80 lb de plus.',
    },
    {
      type: 'table',
      headers: ['Épaisseur', 'Volume (ft³)', 'Volume (yd³)', 'Sacs de 80 lb', 'Sacs de 60 lb'],
      rows: [
        ['4 in', '33,33', '1,23', '56', '75'],
        ['6 in', '50,00', '1,85', '84', '112'],
        ['Écart', '+16,67', '+0,62', '+28', '+37'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Les 0,62 yards cubes supplémentaires sont rarement le seul facteur décisif, mais ils font la différence entre deux stratégies d’approvisionnement, et la différence entre une dalle conforme au plan et une dalle qui ne l’est pas. Choisissez l’épaisseur selon l’usage prévu et la prescription structurelle ; le calcul de quantité indique simplement ce que ce choix coûte en matériau.',
    },
    {
      type: 'figure',
      src: SLAB_CROSS_SECTION_FIGURE.src,
      alt: 'Illustration en coupe d’une dalle en béton posée sur une base granulaire compactée et le sol naturel',
      caption: 'Coupe : l’épaisseur de béton repose sur une assise granulaire compactée',
      width: SLAB_CROSS_SECTION_FIGURE.width,
      height: SLAB_CROSS_SECTION_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'bag-quantities',
      text: 'Béton en sacs : compter les sacs de 80 lb et de 60 lb',
    },
    {
      type: 'paragraph',
      text: 'Le mélange en sacs s’achète au sac et non au volume : il faut donc diviser le volume par le rendement d’un seul sac et toujours arrondir à la hausse. Un sac de 80 lb produit 0,60 pied cube de béton frais et un sac de 60 lb produit 0,45 pied cube — les mêmes chiffres que la calculatrice MixTally et les rendements publiés pour le béton en sacs QUIKRETE.',
    },
    {
      type: 'formula',
      expression: 'bags = ⌈ total ft³ ÷ bag yield ⌉',
      note: 'Un sac de 80 lb donne 0,60 ft³ ; un sac de 60 lb donne 0,45 ft³.',
    },
    {
      type: 'table',
      headers: ['Taille du sac', 'Rendement (ft³)', 'Sacs par yd³', 'À 4 in', 'À 6 in'],
      rows: [
        ['80 lb', '0,60', '45', '56', '84'],
        ['60 lb', '0,45', '60', '75', '112'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Pour la dalle de 4 pouces, le calcul est 33,333 ÷ 0,60 = 55,6, arrondi à la hausse à 56 sacs ; avec des sacs de 60 lb, 33,333 ÷ 0,45 = 74,1, arrondi à la hausse à 75. Par yard cube, les décomptes sont exacts : 27 ÷ 0,60 = 45 sacs de quatre-vingts livres et 27 ÷ 0,45 = 60 sacs de soixante livres. Appliquer la marge avant de diviser porte les totaux à 62 et 82 sacs à 4 pouces, et à 92 et 123 sacs à 6 pouces.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Comptez les sacs à partir des pieds cubes, jamais des yards arrondis',
      body: 'Diviser les 1,23 yards cubes annoncés par 0,60 donne un nombre sans portée, et reconvertir ces 1,23 en pieds cubes donne 33,21 au lieu de 33,33. Comptez les sacs à partir des pieds cubes non arrondis pour que l’arrondi n’ait lieu qu’une fois, au passage au sac.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ready-mix-vs-bags',
      text: 'Béton prêt à l’emploi ou béton en sacs',
    },
    {
      type: 'paragraph',
      text: 'Une quantité comprise entre 1,23 et 2,04 yards cubes se situe là où les deux voies de livraison sont réalistes. Le mélange en sacs permet d’acheter exactement le décompte produit par le calcul et de garder les sacs scellés pour plus tard. Le béton prêt à l’emploi est dosé au volume à l’usine, arrive prêt à se déverser et comporte en général un minimum fournisseur pour les petites charges : vérifiez ce qui s’applique avant de tenir le chiffre calculé pour la quantité facturée.',
    },
    {
      type: 'figure',
      src: DELIVERY_COMPARISON_FIGURE.src,
      alt: 'Illustration en deux volets d’une toupie de béton prêt à l’emploi se déversant dans une banché, à côté de sacs empilés et d’une bétonnière',
      caption: 'Béton prêt à l’emploi déversé par gouttière à gauche, mélange en sacs préparé sur le chantier à droite',
      width: DELIVERY_COMPARISON_FIGURE.width,
      height: DELIVERY_COMPARISON_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Critère', 'Prêt à l’emploi', 'En sacs'],
      rows: [
        ['Unité de commande', 'Yards cubes du calcul', 'Sacs individuels du décompte'],
        ['Petites coulées', 'Soumis à un minimum fournisseur', 'Achetez exactement ce qu’il faut'],
        ['Manutention', 'Livré et déversé dans les banches', 'Mélangé, porté et mis en œuvre à la main'],
        ['Stockage', 'À mettre en œuvre en une seule fois', 'Les sacs scellés se conservent au sec'],
        ['Mélange', 'Dosé à l’usine', 'Mélangé sur le chantier, donc l’eau se contrôle'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Quelle que soit la voie choisie, la quantité ne change pas. Le volume d’une dalle de 10 ft × 10 ft est une propriété de sa géométrie ; la livraison ne fait que changer la manière dont ce volume est acheté, transporté et mis en œuvre.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Marge de commande : quoi transmettre',
    },
    {
      type: 'paragraph',
      text: 'Une marge de commande couvre l’écart entre le rectangle idéal et la dalle réellement construite. Son ampleur dépend du chantier et non d’une règle universelle : c’est pourquoi la calculatrice expose un curseur de 0 à 20 %, avec 10 % comme point de départ.',
    },
    {
      type: 'list',
      items: [
        'Un sol coupé légèrement trop bas, si bien que le béton remplit plus de profondeur que le plan ne le montre.',
        'Des banches qui s’écartent ou sortent d’aplomb sous la pression de la coulée.',
        'Une assise qui n’est pas parfaitement plane, avec des creux qui consomment du volume supplémentaire.',
        'Les déversements, les pertes par gouttière et le matériau resté dans la bétonnière en fin de coulée.',
        'La finition, le régalage et le travail autour des bords et des pénétrations.',
        'Un minimum fournisseur qui arrondit une petite commande à la hausse, quelle que soit la calcul.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Appliquée à la dalle de 4 pouces, une marge de 10 % fait passer la commande de 33,33 pieds cubes à 36,67 pieds cubes, de 1,23 yards cubes à 1,36 yards cubes, et de 56 sacs de mélange de 80 lb à 62. Commander exactement le volume géométrique risque un manquant au milieu de la coulée, où une seconde livraison signifie un joint de reprise ; commander bien au-delà des besoins du chantier gaspille le budget et laisse du matériau à évacuer. Notez la marge choisie et pourquoi.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'faq',
      text: 'Questions fréquentes',
    },
    {
      type: 'faq',
      items: [
        {
          question: 'Combien de béton y a-t-il dans une dalle de 10 ft × 10 ft à 4 pouces ?',
          answer:
            '33,33 pieds cubes, soit 1,23 yards cubes, avant toute marge. Avec 10 % de marge, la commande passe à 36,67 pieds cubes, soit 1,36 yards cubes.',
        },
        {
          question: 'Combien de béton faut-il à 6 pouces ?',
          answer:
            '50,00 pieds cubes, soit 1,85 yards cubes. C’est exactement 1,5 fois la dalle de 4 pouces, car 6 pouces vaut 1,5 fois 4 pouces.',
        },
        {
          question: 'Combien de sacs de béton faut-il ?',
          answer:
            'À 4 pouces : 56 × 80 lb ou 75 × 60 lb sans marge, et 62 × 80 lb ou 82 × 60 lb avec 10 %. À 6 pouces : 84 × 80 lb ou 112 × 60 lb sans marge, et 92 × 80 lb ou 123 × 60 lb avec 10 %.',
        },
        {
          question: 'Dois-je commander exactement le volume calculé ?',
          answer:
            'Non. Le chiffre calculé est le volume d’une boîte idéale. Les coulées réelles perdent ou gagnent du volume selon les variations de sol, la déformation des banches et la manutention ; ajoutez donc une marge choisie pour votre chantier et vérifiez si un minimum fournisseur s’applique.',
        },
        {
          question: 'Qu’est-ce qui coûte moins cher, le prêt à l’emploi ou le sac ?',
          answer:
            'Cela dépend des prix locaux des sacs, du prix fournisseur par yard cube et d’un éventuel minimum de livraison courte. Comparez le coût du décompte exact de sacs au prix livré, minimum compris, et intégrez la main-d’œuvre de mélange manuel.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calculez votre propre quantité de béton',
    },
    {
      type: 'paragraph',
      text: 'Les chiffres ci-dessus visent 10 ft × 10 ft à deux épaisseurs. Pour tout autre rectangle, saisissez les dimensions et la marge dans la calculette et lisez côte à côte le volume de base, le volume de commande, les yards cubes, les pieds cubes et les deux décomptes de sacs.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Calculatrice de dalle en béton MixTally',
      body: 'Impérial ou métrique, un curseur de marge de 0 à 20 % et des décomptes de sacs pour les mélanges de 80 lb et 60 lb, avec le volume géométrique séparé de la quantité commandée.',
    },
  ],
};

const tenByTenSlabDe: ArticleTranslation = {
  imageAlt: 'Isometrische Illustration einer quadratischen Betonplatte mit Maßpfeilen auf einem vermaßten Raster',
  ogImageAlt: 'Isometrische Illustration einer quadratischen Betonplatte mit Maßpfeilen auf einem vermaßten Raster',
  title: 'Wie viel Beton brauche ich für eine 10x10-Platte?',
  description:
    'Eine 10x10-Platte braucht bei 4 Zoll 1,23 Kubikyard und bei 6 Zoll 1,85. Sehen Sie die Rechnung, die Säcke, den Zuschlag und die Lieferoptionen.',
  excerpt:
    'Exaktes Volumen für eine 10x10-Platte bei 4 und 6 Zoll, die sich daraus ergebenden Sackzahlen und wie viel mehr man für die Bedingungen der Baustelle bestellen soll.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'slab-quantity',
      text: 'Wie viel Beton braucht eine 10x10-Platte?',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Kurze Antwort',
      body: 'Eine 10 ft × 10 ft Platte mit 4 Zoll Dicke misst 33,33 Kubikfuß, also 1,23 Kubikyard. Bei 6 Zoll sind es 50,00 Kubikfuß, also 1,85 Kubikyard. Das sind exakte geometrische Volumina vor jedem Zuschlag: Bei 10 % Zuschlag wird aus der Bestellung 36,67 Kubikfuß (1,36 Kubikyard) und 55,00 Kubikfuß (2,04 Kubikyard).',
    },
    {
      type: 'paragraph',
      text: 'Eine 10 mal 10 Platte bedeckt 100 Quadratfuß, das sind 11,11 Quadratyard Grundfläche. Dieser Wert ändert sich nie. Alles Weitere stammt aus einem einzigen zweiten Eingabewert: der Dicke der Platte. Bei 4 Zoll ist die Platte ein Drittel Fuß tief und enthält 33,33 Kubikfuß Beton. Bei 6 Zoll ist sie einen halben Fuß tief und enthält 50,00 Kubikfuß. Sechs Zoll sind eineinhalb mal vier Zoll, und das Volumen verhält sich genau in diesem Verhältnis.',
    },
    {
      type: 'paragraph',
      text: 'Die Dicke ist damit kein Detail, das man nach der Volumenberechnung klärt. Sie ist die Eingabe, die die Bestellung festlegt. Nehmen Sie sie aus der Zeichnung oder der Spezifikation, nicht aus einem Standard: Eine Terrasse, ein Garageboden und eine Fundamentplatte für ein Schuppen können alle 10 ft × 10 ft groß sein und brauchen trotzdem wesentlich andere Mengen. Die vollständige Methode hinter jeder Zahl auf dieser Seite steht im Begleitartikel zur Berechnung des Betonvolumens einer Platte, der die allgemeine Formel in imperialen und metrischen Einheiten behandelt.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Betonplatten-Rechner',
      body: 'Brauchen Sie eine andere Plattengröße? Geben Sie Länge, Breite, Dicke und einen Zuschlag ein, um Kubikfuß, Kubikyard, Sackzahlen und eine interaktive 3D-Vorschau in beiden Einheitensystemen zu erhalten.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'how-to-calculate',
      text: 'Wie man die Menge berechnet',
    },
    {
      type: 'paragraph',
      text: 'Die Rechnung hat fünf Schritte: das Rechteck vermessen, die Dicke in dieselbe Einheit wie Länge und Breite umrechnen, multiplizieren zu Kubikfuß, durch 27 teilen zu Kubikyard und dann einen Zuschlag für das hinzufügen, was die Baustelle tatsächlich verbraucht.',
    },
    {
      type: 'figure',
      src: VOLUME_FORMULA_FIGURE.src,
      alt: 'Fünf nummerierte Schritte, die die Umrechnung der Plattendicke in eine Bestellmenge in Kubikyard zeigen',
      caption: 'Die fünf Schritte von der Plattendicke bis zur Bestellmenge',
      width: VOLUME_FORMULA_FIGURE.width,
      height: VOLUME_FORMULA_FIGURE.height,
    },
    { type: 'formula', expression: 'A = L × W' },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'V (ft³) = A × T' },
    { type: 'formula', expression: 'V (yd³) = V (ft³) ÷ 27' },
    { type: 'formula', expression: 'V_order = V × (1 + allowance)' },
    {
      type: 'heading',
      level: 3,
      id: 'step-1-measure',
      text: 'Schritt 1: die Platte vermessen',
    },
    {
      type: 'paragraph',
      text: 'Länge und Breite sind die äußeren Maße von Flanke zu Flanke der fertigen Platte, hier beide 10 ft, was eine Grundfläche von 100 Quadratfuß ergibt. Messen Sie über die Fläche, die der Beton füllen wird, und nicht über die Schalungsbretter, und prüfen Sie die rechten Winkel, indem Sie die Diagonalen vergleichen: Zwei gleiche Diagonalen bestätigen, dass das Rechteck stimmt.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-2-convert',
      text: 'Schritt 2: die Dicke in Fuß umrechnen',
    },
    {
      type: 'paragraph',
      text: 'Zeichnungen notieren die Dicke in Zoll, rechnen Sie also vor dem Multiplizieren um. Vier Zoll sind 4 ÷ 12 = 0,33333 ft und sechs Zoll sind 6 ÷ 12 = 0,50000 ft. Diese Umrechnung zu überspringen ist der klassische Faktor-12-Fehler: Er liefert 400 statt 33,33, eine zwölfmal zu große Zahl.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-3-cubic-feet',
      text: 'Schritt 3: zu Kubikfuß multiplizieren',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Grundfläche: 10 × 10 = 100 ft²',
        'Dicke in Fuß: 4 ÷ 12 = 0,33333 ft',
        'Volumen bei 4 in: 100 × 0,33333 = 33,333 ft³',
        'Volumen bei 6 in: 100 × 0,50000 = 50,000 ft³',
      ],
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-4-cubic-yards',
      text: 'Schritt 4: in Kubikyard umrechnen',
    },
    {
      type: 'paragraph',
      text: 'Mischanlagen-Beton wird nach Kubikyard disponiert, teilen Sie die Kubikfuß also durch 27. Bei 4 Zoll ergibt 33,333 ÷ 27 = 1,2346 Kubikyard, gemeldet als 1,23. Bei 6 Zoll ergibt 50,000 ÷ 27 = 1,8519 Kubikyard, gemeldet als 1,85. Halten Sie die volle Genauigkeit durch diese Division und runden Sie nur die Zahlen, die Sie aufschreiben, denn zweimaliges Runden — einmal in Kubikfuß und dann in Kubikyard — verschiebt das Ergebnis unbemerkt.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-5-allowance',
      text: 'Schritt 5: den Bestellzuschlag hinzufügen',
    },
    {
      type: 'paragraph',
      text: 'Die Zahlen oben beschreiben einen idealen Kasten mit geraden Wänden. Reale Platten verbrauchen mehr als der ideale Kasten, deshalb wird ein Prozentsatz als Zuschlag angewendet, bevor die Zahl an einen Lieferanten übergeben oder zum Zählen der Säcke verwendet wird.',
    },
    {
      type: 'table',
      headers: ['Dicke', 'Basis (yd³)', '+5% (yd³)', '+10% (yd³)', '+10% (ft³)'],
      rows: [
        ['4 in', '1,23', '1,30', '1,36', '36,67'],
        ['6 in', '1,85', '1,94', '2,04', '55,00'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Nicht runden, bevor Sie teilen',
      body: 'Wer 1,23 Kubikyard meldet und diese Zahl danach als Arbeitswert behandelt, verliert die 0,0046 Kubikyard, die das Runden entfernt hat — und diese Gewohnheit über mehrere Güsse hinweg summiert sich. Führen Sie 1,2346 durch die Zuschlagsrechnung und runden Sie die endgültige Bestellmenge genau einmal.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'thickness-comparison',
      text: '4 Zoll gegen 6 Zoll',
    },
    {
      type: 'paragraph',
      text: 'Beide Dicken beschreiben dieselbe Grundfläche, der Vergleich ist also rein proportional. Sechs Zoll Beton sind eineinhalb mal vier Zoll, also 50,00 Kubikfuß gegen 33,33 Kubikfuß, 1,85 Kubikyard gegen 1,23 Kubikyard und 28 Säcke zu 80 lb mehr.',
    },
    {
      type: 'table',
      headers: ['Dicke', 'Volumen (ft³)', 'Volumen (yd³)', '80-lb-Säcke', '60-lb-Säcke'],
      rows: [
        ['4 in', '33,33', '1,23', '56', '75'],
        ['6 in', '50,00', '1,85', '84', '112'],
        ['Differenz', '+16,67', '+0,62', '+28', '+37'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Die zusätzlichen 0,62 Kubikyard sind selten für sich der entscheidende Faktor, aber sie sind der Unterschied zwischen zwei Bestellstrategien und der Unterschied zwischen einer Platte, die der Zeichnung entspricht, und einer, die es nicht tut. Wählen Sie die Dicke nach dem vorgesehenen Gebrauch und der statischen Spezifikation; die Mengenberechnung zeigt nur, was diese Entscheidung an Material kostet.',
    },
    {
      type: 'figure',
      src: SLAB_CROSS_SECTION_FIGURE.src,
      alt: 'Schnittzeichnung einer Betonplatte über einem verdichteten mineralischen Unterbau und natürlichem Boden',
      caption: 'Schnitt: Die Betondicke sitzt über einem verdichteten mineralischen Unterbau',
      width: SLAB_CROSS_SECTION_FIGURE.width,
      height: SLAB_CROSS_SECTION_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'bag-quantities',
      text: 'Sackbeton: 80-lb- und 60-lb-Säcke zählen',
    },
    {
      type: 'paragraph',
      text: 'Sackware wird pro Sack und nicht nach Volumen gekauft, deshalb muss das Volumen durch die Ausbeute eines einzelnen Sacks geteilt und immer aufgerundet werden. Ein 80-lb-Sack liefert 0,60 Kubikfuß frischen Beton und ein 60-lb-Sack liefert 0,45 Kubikfuß — dieselben Werte, die der MixTally-Rechner verwendet, und die für QUIKRETE-Sackbeton veröffentlichten Ausbeuten.',
    },
    {
      type: 'formula',
      expression: 'bags = ⌈ total ft³ ÷ bag yield ⌉',
      note: 'Ein 80-lb-Sack liefert 0,60 ft³; ein 60-lb-Sack liefert 0,45 ft³.',
    },
    {
      type: 'table',
      headers: ['Sackgröße', 'Ausbeute (ft³)', 'Säcke pro yd³', 'Bei 4 in', 'Bei 6 in'],
      rows: [
        ['80 lb', '0,60', '45', '56', '84'],
        ['60 lb', '0,45', '60', '75', '112'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Für die 4-Zoll-Platte lautet die Rechnung 33,333 ÷ 0,60 = 55,6, aufgerundet auf 56 Säcke; mit 60-lb-Säcken sind es 33,333 ÷ 0,45 = 74,1, aufgerundet auf 75. Pro Kubikyard sind die Zahlen exakt: 27 ÷ 0,60 = 45 Säcke zu achtzig Pfund und 27 ÷ 0,45 = 60 Säcke zu sechzig Pfund. Wenden Sie den Zuschlag vor dem Teilen an, ändern sich die Summen auf 62 und 82 Säcke bei 4 Zoll sowie 92 und 123 Säcke bei 6 Zoll.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Säcke aus Kubikfuß zählen, nie aus gerundeten Kubikyard',
      body: 'Die gemeldeten 1,23 Kubikyard durch 0,60 zu teilen ergibt einen sinnlosen Wert, und das Zurückrechnen dieser 1,23 in Kubikfuß ergibt 33,21 statt 33,33. Zählen Sie die Säcke aus den ungerundeten Kubikfuß, damit das Runden genau einmal stattfindet — an der Sackgrenze.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ready-mix-vs-bags',
      text: 'Mischanlagen-Beton oder Sackbeton',
    },
    {
      type: 'paragraph',
      text: 'Eine Menge zwischen 1,23 und 2,04 Kubikyard liegt dort, wo beide Lieferwege realistisch sind. Sackware erlaubt es, genau die Anzahl zu kaufen, die die Rechnung ergibt, und ungeöffnete Säcke für später aufzubewahren. Mischanlagen-Beton wird im Werk nach Volumen dosiert, kommt lieferbereit an und hat bei kleinen Mengen in der Regel ein Lieferanten-Minimum; klären Sie, was gilt, bevor Sie davon ausgehen, dass die berechnete Zahl die Menge ist, die Ihnen in Rechnung gestellt wird.',
    },
    {
      type: 'figure',
      src: DELIVERY_COMPARISON_FIGURE.src,
      alt: 'Geteilte Illustration eines Mischanlagen-Fahrzeugs, das in eine Schalung ablädt, neben gestapelten Säcken und einem Betonmischer',
      caption: 'Mischanlagen-Beton wird links über die Rinne abgeladen, Sackware wird rechts auf der Baustelle angerührt',
      width: DELIVERY_COMPARISON_FIGURE.width,
      height: DELIVERY_COMPARISON_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Kriterium', 'Mischanlagen-Beton', 'Sackware'],
      rows: [
        ['Bestelleinheit', 'Kubikyard aus der Rechnung', 'Einzelne Säcke aus der Zählung'],
        ['Kleine Gussmengen', 'Lieferanten-Mindestmenge', 'Genau das kaufen, was gebraucht wird'],
        ['Handhabung', 'Geliefert und in die Schalung abgeladen', 'Angemischt, getragen und von Hand eingebaut'],
        ['Lagerung', 'Muss in einem Arbeitsgang eingebaut werden', 'Ungeöffnete Säcke bleiben im Trockenen erhalten'],
        ['Anmischen', 'Im Werk dosiert', 'Auf der Baustelle angerührt, daher kommt es auf die Wassermenge an'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Welchen Weg man auch wählt, die Menge ändert sich nicht. Das Volumen einer 10 ft × 10 ft Platte ist eine Eigenschaft ihrer Geometrie; die Lieferung ändert nur, wie dieses Volumen gekauft, transportiert und eingebaut wird.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Bestellzuschlag: was man übergibt',
    },
    {
      type: 'paragraph',
      text: 'Ein Bestellzuschlag deckt die Lücke zwischen dem idealen Rechteck und der tatsächlich gebauten Platte ab. Wie groß er sein muss, hängt von der Baustelle ab und nicht von einer universellen Regel, weshalb der Rechner einen Regler von 0 bis 20 % mit 10 % als Startpunkt anbietet.',
    },
    {
      type: 'list',
      items: [
        'Ein zu tief gegrabener Untergrund, sodass Beton mehr Tiefe füllt als die Zeichnung zeigt.',
        'Schalungen, die sich ausbeulen oder unter dem Druck des Gusses aus dem Lot geraten.',
        'Ein Untergrund, der nicht perfekt eben ist, mit Senken, die zusätzliches Volumen aufzehren.',
        'Verschüttungen, Rinnenverluste und Material, das am Ende des Gusses im Mischer bleibt.',
        'Glätten, Abziehen und Arbeiten um Kanten und Durchdringungen herum.',
        'Ein Lieferanten-Minimum, das eine kleine Bestellung unabhängig von der Rechnung aufrundet.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Auf die 4-Zoll-Platte angewendet, verschiebt ein Zuschlag von 10 % die Bestellung von 33,33 Kubikfuß auf 36,67 Kubikfuß, von 1,23 Kubikyard auf 1,36 Kubikyard und von 56 Säcken 80-lb-Mischung auf 62. Genau das geometrische Volumen zu bestellen riskiert einen Mangel mitten im Guss, bei dem eine zweite Charge eine Kaltfuge bedeutet; weit über das hinaus zu bestellen, was die Baustelle braucht, verschenkt Budget und lässt Material zum Entsorgen. Notieren Sie den Zuschlag, den Sie gewählt haben, und warum.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'faq',
      text: 'Häufig gestellte Fragen',
    },
    {
      type: 'faq',
      items: [
        {
          question: 'Wie viel Beton steckt in einer 10 ft × 10 ft Platte bei 4 Zoll?',
          answer:
            '33,33 Kubikfuß, also 1,23 Kubikyard, vor jedem Zuschlag. Mit 10 % Zuschlag wird aus der Bestellung 36,67 Kubikfuß oder 1,36 Kubikyard.',
        },
        {
          question: 'Wie viel Beton braucht es bei 6 Zoll?',
          answer:
            '50,00 Kubikfuß, also 1,85 Kubikyard. Das ist genau das 1,5-fache der 4-Zoll-Platte, denn 6 Zoll sind 1,5 mal 4 Zoll.',
        },
        {
          question: 'Wie viele Betonsäcke brauche ich?',
          answer:
            'Bei 4 Zoll: 56 × 80 lb oder 75 × 60 lb ohne Zuschlag und 62 × 80 lb oder 82 × 60 lb bei 10 %. Bei 6 Zoll: 84 × 80 lb oder 112 × 60 lb ohne Zuschlag und 92 × 80 lb oder 123 × 60 lb bei 10 %.',
        },
        {
          question: 'Soll ich exakt das berechnete Volumen bestellen?',
          answer:
            'Nein. Die berechnete Zahl ist das Volumen eines idealen Kastens. Reale Güsse verlieren oder gewinnen Volumen durch Untergrundschwankungen, Schalungsverformung und Handhabung; addieren Sie daher einen Zuschlag, den Sie für Ihre eigene Baustelle gewählt haben, und prüfen Sie, ob ein Lieferanten-Minimum gilt.',
        },
        {
          question: 'Was ist günstiger, Mischanlagen-Beton oder Sackbeton?',
          answer:
            'Das hängt von den lokalen Sackpreisen, dem Preis pro Kubikyard und einem etwaigen Kurzlieferungs-Minimum ab. Vergleichen Sie die Kosten der exakten Sackzahl mit dem gelieferten Preis inklusive dieses Minimums und berücksichtigen Sie den Aufwand, Säcke von Hand anzumischen.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Berechnen Sie Ihre eigene Betonmenge',
    },
    {
      type: 'paragraph',
      text: 'Die Zahlen oben gelten für 10 ft × 10 ft bei zwei Dicken. Für jedes andere Rechteck geben Sie Maße und Zuschlag in den Rechner ein und lesen Grundvolumen, Bestellvolumen, Kubikyard, Kubikfuß und beide Sackzahlen nebeneinander ab.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'MixTally-Betonplatten-Rechner',
      body: 'Imperial oder metrisch, ein Zuschlagregler von 0 bis 20 % und Sackzahlen für 80-lb- und 60-lb-Mischungen, mit getrennt gehaltenem geometrischem Volumen und Bestellmenge.',
    },
  ],
};

const tenByTenSlabArticle: ArticleDefinition = {
  slug: 'how-much-concrete-do-i-need-for-a-10x10-slab',
  category: 'concrete',
  title: 'How Much Concrete Do I Need for a 10x10 Slab?',
  description:
    'A 10x10 slab needs 1.23 cubic yards at 4 inches and 1.85 at 6 inches. See the full calculation, bag counts, waste allowance and delivery options.',
  excerpt:
    'Exact volume for a 10x10 slab at 4 and 6 inches, the bag counts that follow from it, and how much extra to order for site conditions.',
  publishedAt: '2026-10-05',
  readingTimeMinutes: 8,
  image: TEN_BY_TEN_IMAGE,
  ogImage: TEN_BY_TEN_IMAGE,
  featured: false,
  relatedCalculatorViews: ['concrete-slab-calculator'],
  relatedArticleSlugs: ['how-to-calculate-concrete-volume-for-a-slab'],
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'slab-quantity',
      text: 'How much concrete does a 10x10 slab need?',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Quick answer',
      body: 'A 10 ft × 10 ft slab at 4 inches thick is 33.33 cubic feet, which is 1.23 cubic yards. At 6 inches it is 50.00 cubic feet, which is 1.85 cubic yards. Those are exact geometric volumes before any allowance: at a 10% allowance the order becomes 36.67 cubic feet (1.36 cubic yards) and 55.00 cubic feet (2.04 cubic yards).',
    },
    {
      type: 'paragraph',
      text: 'A 10 by 10 slab covers 100 square feet, which is 11.11 square yards of plan area. That figure never changes. Everything that follows comes from a single second input: the thickness of the slab. At 4 inches the slab is one third of a foot deep, so it holds 33.33 cubic feet of concrete. At 6 inches it is half a foot deep, so it holds 50.00 cubic feet. Six inches is one and a half times four inches, and the volume responds in exactly the same proportion.',
    },
    {
      type: 'paragraph',
      text: 'Thickness is therefore not a detail to settle after the volume is calculated. It is the input that decides the order. Take it from the drawing or the specification, not from a default: a patio, a garage floor and a shed base can all be 10 ft × 10 ft and still need materially different quantities. The worked method behind every number on this page is set out in the companion article on calculating concrete volume for a slab, which covers the general formula in imperial and metric units.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'Concrete Slab Calculator',
      body: 'Need a different slab size? Enter length, width, thickness and an allowance to get cubic feet, cubic yards, bag counts and an interactive 3D preview in either unit system.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'how-to-calculate',
      text: 'How to calculate the quantity',
    },
    {
      type: 'paragraph',
      text: 'The calculation has five steps: measure the rectangle, convert the thickness into the same unit as the length and width, multiply to cubic feet, divide by 27 to reach cubic yards, then add an allowance for what the site will actually consume.',
    },
    {
      type: 'figure',
      src: VOLUME_FORMULA_FIGURE.src,
      alt: VOLUME_FORMULA_FIGURE.alt,
      caption: 'The five steps from slab thickness to an order quantity',
      width: VOLUME_FORMULA_FIGURE.width,
      height: VOLUME_FORMULA_FIGURE.height,
    },
    { type: 'formula', expression: 'A = L × W' },
    { type: 'formula', expression: 'T (ft) = T (in) ÷ 12' },
    { type: 'formula', expression: 'V (ft³) = A × T' },
    { type: 'formula', expression: 'V (yd³) = V (ft³) ÷ 27' },
    { type: 'formula', expression: 'V_order = V × (1 + allowance)' },
    {
      type: 'heading',
      level: 3,
      id: 'step-1-measure',
      text: 'Step 1: measure the slab',
    },
    {
      type: 'paragraph',
      text: 'Length and width are the outside face-to-face dimensions of the finished slab, both 10 ft here, giving a plan area of 100 square feet. Measure over the area the concrete will fill rather than over the formwork boards, and check the corners are square by comparing the diagonals: two equal diagonals confirm the rectangle is true.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-2-convert',
      text: 'Step 2: convert thickness to feet',
    },
    {
      type: 'paragraph',
      text: 'Drawings annotate thickness in inches, so convert before multiplying. Four inches is 4 ÷ 12 = 0.33333 ft and six inches is 6 ÷ 12 = 0.50000 ft. Skipping this conversion is the classic factor-of-12 error: it returns 400 instead of 33.33, a figure twelve times too large.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-3-cubic-feet',
      text: 'Step 3: multiply to cubic feet',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Plan area: 10 × 10 = 100 ft²',
        'Thickness in feet: 4 ÷ 12 = 0.33333 ft',
        'Volume at 4 in: 100 × 0.33333 = 33.333 ft³',
        'Volume at 6 in: 100 × 0.50000 = 50.000 ft³',
      ],
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-4-cubic-yards',
      text: 'Step 4: convert to cubic yards',
    },
    {
      type: 'paragraph',
      text: 'Ready-mix is dispatched by the cubic yard, so divide the cubic feet by 27. At 4 inches, 33.333 ÷ 27 = 1.2346 cubic yards, reported as 1.23. At 6 inches, 50.000 ÷ 27 = 1.8519 cubic yards, reported as 1.85. Keep the full precision through this division and round only the figures you write down, because rounding twice — once in cubic feet and again in cubic yards — quietly moves the answer.',
    },
    {
      type: 'heading',
      level: 3,
      id: 'step-5-allowance',
      text: 'Step 5: add the ordering allowance',
    },
    {
      type: 'paragraph',
      text: 'The numbers above describe an ideal box with flat sides. Real slabs consume more than the ideal box, so a percentage allowance is applied before the figure is handed to a supplier or used to count bags.',
    },
    {
      type: 'table',
      headers: ['Thickness', 'Base (yd³)', '+5% (yd³)', '+10% (yd³)', '+10% (ft³)'],
      rows: [
        ['4 in', '1.23', '1.30', '1.36', '36.67'],
        ['6 in', '1.85', '1.94', '2.04', '55.00'],
      ],
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Do not round before you divide',
      body: 'Reporting 1.23 cubic yards and then treating it as the working value loses the 0.0046 cubic yards that rounding removed, and repeating that habit across several pours adds up. Carry 1.2346 through the allowance calculation and round the final order quantity once.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'thickness-comparison',
      text: '4 inches versus 6 inches',
    },
    {
      type: 'paragraph',
      text: 'Both thicknesses describe the same footprint, so the comparison is purely proportional. Six inches of concrete is one and a half times four inches, which means 50.00 cubic feet against 33.33 cubic feet, 1.85 cubic yards against 1.23 cubic yards, and 28 more 80 lb bags.',
    },
    {
      type: 'table',
      headers: ['Thickness', 'Volume (ft³)', 'Volume (yd³)', '80 lb bags', '60 lb bags'],
      rows: [
        ['4 in', '33.33', '1.23', '56', '75'],
        ['6 in', '50.00', '1.85', '84', '112'],
        ['Difference', '+16.67', '+0.62', '+28', '+37'],
      ],
    },
    {
      type: 'paragraph',
      text: 'The extra 0.62 cubic yards is rarely the deciding factor on its own, but it is the difference between one order strategy and another, and it is the difference between a slab that matches the drawing and one that does not. Choose the thickness from the intended use and the structural specification; the quantity calculation simply reports what that choice costs in material.',
    },
    {
      type: 'figure',
      src: SLAB_CROSS_SECTION_FIGURE.src,
      alt: SLAB_CROSS_SECTION_FIGURE.alt,
      caption: 'Cross-section: the concrete thickness sits above a compacted granular base',
      width: SLAB_CROSS_SECTION_FIGURE.width,
      height: SLAB_CROSS_SECTION_FIGURE.height,
    },
    {
      type: 'heading',
      level: 2,
      id: 'bag-quantities',
      text: 'Bagged concrete: counting 80 lb and 60 lb bags',
    },
    {
      type: 'paragraph',
      text: 'Bagged mix is bought by the bag rather than by volume, so the volume has to be divided by the yield of a single bag and always rounded up. An 80 lb bag yields 0.60 cubic feet of wet concrete and a 60 lb bag yields 0.45 cubic feet — the same figures the MixTally calculator uses, and the yields published for QUIKRETE bagged concrete.',
    },
    {
      type: 'formula',
      expression: 'bags = ⌈ total ft³ ÷ bag yield ⌉',
      note: 'An 80 lb bag gives 0.60 ft³; a 60 lb bag gives 0.45 ft³.',
    },
    {
      type: 'table',
      headers: ['Bag size', 'Yield (ft³)', 'Bags per yd³', 'At 4 in', 'At 6 in'],
      rows: [
        ['80 lb', '0.60', '45', '56', '84'],
        ['60 lb', '0.45', '60', '75', '112'],
      ],
    },
    {
      type: 'paragraph',
      text: 'The arithmetic for the 4 inch slab is 33.333 ÷ 0.60 = 55.6, which rounds up to 56 bags; with 60 lb bags it is 33.333 ÷ 0.45 = 74.1, which rounds up to 75. Per cubic yard the counts are exact: 27 ÷ 0.60 = 45 eighty-pound bags and 27 ÷ 0.45 = 60 sixty-pound bags. Applying the allowance before dividing changes the totals to 62 and 82 bags at 4 inches, and 92 and 123 bags at 6 inches.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Count bags from cubic feet, never from rounded yards',
      body: 'Dividing the reported 1.23 cubic yards by 0.60 gives a meaningless number, and converting that 1.23 back to cubic feet gives 33.21 instead of 33.33. Count bags from the unrounded cubic feet so the rounding happens once, at the bag boundary.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ready-mix-vs-bags',
      text: 'Ready-mix or bagged concrete',
    },
    {
      type: 'paragraph',
      text: 'A quantity between 1.23 and 2.04 cubic yards sits where both delivery routes are realistic. Bagged mix lets you buy exactly the count the calculation produces and keeps any unopened bags for later. Ready-mix is batched by volume at the plant, arrives ready to discharge, and usually carries a supplier minimum for small loads, so confirm what applies before assuming the calculated figure is the quantity you will be charged for.',
    },
    {
      type: 'figure',
      src: DELIVERY_COMPARISON_FIGURE.src,
      alt: DELIVERY_COMPARISON_FIGURE.alt,
      caption: 'Ready-mix discharged by chute on the left, bagged mix prepared on site on the right',
      width: DELIVERY_COMPARISON_FIGURE.width,
      height: DELIVERY_COMPARISON_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Consideration', 'Ready-mix', 'Bagged mix'],
      rows: [
        ['Order unit', 'Cubic yards from the calculation', 'Individual bags from the bag count'],
        ['Small pours', 'Subject to a supplier minimum', 'Buy exactly what is needed'],
        ['Handling', 'Delivered and discharged into the form', 'Mixed, carried and placed by hand'],
        ['Storage', 'Must be placed in one session', 'Unopened bags keep if stored dry'],
        ['Mixing', 'Batched at the plant', 'Mixed on site, so water control matters'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Whichever route is chosen, the quantity does not change. The volume of a 10 ft × 10 ft slab is a property of its geometry; delivery only changes how that volume is bought, carried and placed.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ordering-allowance',
      text: 'Ordering allowance: what to hand over',
    },
    {
      type: 'paragraph',
      text: 'An ordering allowance covers the gap between the ideal rectangle and the slab that gets built. How large it should be depends on the site rather than on a universal rule, which is why the calculator exposes a 0–20% slider with 10% as its starting point.',
    },
    {
      type: 'list',
      items: [
        'A subgrade cut slightly low, so concrete fills more depth than the drawing shows.',
        'Forms that spread or sit out of level under the pressure of the pour.',
        'A base that is not perfectly flat, leaving low spots that consume extra volume.',
        'Spillage, chute loss and material left in the mixer at the end of the pour.',
        'Finishing, screeding and working around edges and penetrations.',
        'A supplier minimum that rounds a small order up regardless of the calculation.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Worked through on the 4 inch slab, a 10% allowance moves the order from 33.33 cubic feet to 36.67 cubic feet, from 1.23 cubic yards to 1.36 cubic yards, and from 56 bags of 80 lb mix to 62. Ordering the exact geometric volume risks running short partway through the pour, where a second batch means a cold joint; ordering far beyond what the site needs wastes budget and leaves material to dispose of. Record the allowance you chose and why.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'faq',
      text: 'Frequently asked questions',
    },
    {
      type: 'faq',
      items: [
        {
          question: 'How much concrete is in a 10 ft × 10 ft slab at 4 inches?',
          answer:
            '33.33 cubic feet, which is 1.23 cubic yards, before any allowance. With a 10% allowance the order becomes 36.67 cubic feet, or 1.36 cubic yards.',
        },
        {
          question: 'How much concrete is needed at 6 inches?',
          answer:
            '50.00 cubic feet, which is 1.85 cubic yards. That is exactly 1.5 times the 4 inch slab, because 6 inches is 1.5 times 4 inches.',
        },
        {
          question: 'How many bags of concrete do I need?',
          answer:
            'At 4 inches: 56 × 80 lb or 75 × 60 lb with no allowance, and 62 × 80 lb or 82 × 60 lb at 10%. At 6 inches: 84 × 80 lb or 112 × 60 lb with no allowance, and 92 × 80 lb or 123 × 60 lb at 10%.',
        },
        {
          question: 'Should I order exactly the calculated volume?',
          answer:
            'No. The calculated figure is the volume of an ideal box. Real pours lose or gain volume through subgrade variation, form deflection and handling, so add an allowance you have chosen for your own site and check whether a supplier minimum applies.',
        },
        {
          question: 'Which is cheaper, ready-mix or bagged concrete?',
          answer:
            'It depends on local bag prices, the supplier price per cubic yard and any short-load minimum. Compare the cost of the exact bag count against the delivered price including that minimum, and weigh in the labour of mixing bags by hand.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calculate your own concrete quantity',
    },
    {
      type: 'paragraph',
      text: 'The figures above are specific to 10 ft × 10 ft at two thicknesses. For any other rectangle, enter the dimensions and the allowance into the calculator and read off the base volume, the order volume, the cubic yards, the cubic feet and both bag counts side by side.',
    },
    {
      type: 'calculator-cta',
      view: 'concrete-slab-calculator',
      title: 'MixTally Concrete Slab Calculator',
      body: 'Imperial or metric, a 0–20% allowance slider and bag counts for 80 lb and 60 lb mixes, with the geometric volume kept separate from the order quantity.',
    },
  ],
  localized: {
    es: tenByTenSlabEs,
    pt: tenByTenSlabPt,
    fr: tenByTenSlabFr,
    de: tenByTenSlabDe,
  },
};

const paintRoomEs: ArticleTranslation = {
  imageAlt: 'Ilustración del artículo: una habitación a medio pintar de verde azulado con cotas de 12 ft por 8 ft, botes de pintura y una bandeja de rodillo, y un cuaderno con el resultado de 1,9 galones',
  ogImageAlt: 'Ilustración del artículo: una habitación a medio pintar de verde azulado con cotas de 12 ft por 8 ft, botes de pintura y una bandeja de rodillo, y un cuaderno con el resultado de 1,9 galones',
  title: '¿Cuánta pintura necesito para una habitación? Fórmula y ejemplos',
  description:
    'Aprenda a calcular la pintura de una habitación con el área de las paredes, puertas y ventanas, la cobertura por capa y el número de capas, con un ejemplo.',
  excerpt:
    'La fórmula de cantidad de pintura desarrollada en una habitación de 12 ft × 12 ft: área de paredes, descuentos de puertas y ventanas, cobertura por capa, techo y márgenes.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'why-it-matters',
      text: 'Por qué importa estimar bien la pintura',
    },
    {
      type: 'paragraph',
      text: 'La pintura se vende por volumen: galones en Estados Unidos y litros casi en todas partes, y cada habitación que se pinta es un pequeño ejercicio de presupuesto. Comprar de menos detiene la obra para hacer un segundo viaje; comprar de demasiado deja presupuesto sin abrir en el estante. Una estimación medida convierte una suposición en la tierra en una cifra que se puede defender.',
    },
    {
      type: 'paragraph',
      text: 'Este artículo recorre el método estándar: medir la habitación, calcular el área bruta de las paredes, restar lo que no se va a pintar, dividir entre la cobertura que indica el fabricante, multiplicar por el número de capas y decidir después cuánto margen añadir. El recorrido usa unidades imperiales y una habitación de 12 ft × 12 ft como ejemplo continuo; quienes trabajen en unidades métricas pueden seguir los mismos pasos con metros y m² por litro. El resultado es una cantidad, no una especificación de producto, brillo ni garantía.',
    },
    { type: 'heading', level: 2, id: 'paint-formula', text: 'La fórmula básica de cantidad de pintura' },
    {
      type: 'paragraph',
      text: 'Cuatro datos impulsan todo el cálculo: el largo y el ancho de la habitación, la altura de las paredes, el área total de puertas y ventanas que no se van a pintar y la cobertura impresa en la lata. Multiplíquelos y divídalos en este orden:',
    },
    { type: 'formula', expression: 'Perímetro = 2 × (largo + ancho)' },
    { type: 'formula', expression: 'Área bruta de paredes = perímetro × altura de la pared' },
    { type: 'formula', expression: 'Área neta de paredes = área bruta − puertas y ventanas' },
    {
      type: 'formula',
      expression: 'Pintura necesaria (galones) = (área neta × capas) ÷ cobertura',
    },
    {
      type: 'paragraph',
      text: 'La cobertura es la cifra del fabricante: cuántos pies cuadrados cubre un galón en una sola capa. Es una propiedad de ese producto sobre una superficie definida, no una constante universal; la sección 6 vuelve sobre lo que la mueve. Todo lo que precede a la división es geometría; todo lo que la sigue es comportamiento del producto.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Respuesta rápida para una habitación estándar',
      body: 'Una habitación de 12 ft × 12 ft con paredes de 8 ft tiene 384 ft² de área bruta. Al descontar una puerta y dos ventanas (51 ft² en este ejemplo) quedan 333 ft². Con una cobertura ilustrativa de 350 ft² por galón por capa, dos capas necesitan 666 ft² recubiertos, es decir 1,90 galones. Con un margen opcional del 10% la cifra ronda los 2,1 galones. Todos estos números son ejemplos calculados a partir de datos declarados, no un estándar para todas las pinturas.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring-the-room',
      text: 'Cómo medir largo, ancho y altura de la pared',
    },
    {
      type: 'paragraph',
      text: 'Bastan tres medidas con cinta métrica. Mida el largo y el ancho de la habitación sobre el piso, de cara a cara de las paredes, y la altura desde el piso terminado hasta la línea del techo. Si la habitación es un rectángulo limpio, una medida de cada dimensión basta; en casas antiguas, mida dos veces y use la cifra mayor cuando las paredes no sean paralelas.',
    },
    {
      type: 'list',
      items: [
        'Mida sobre el piso junto a las caras de la pared, no sobre el zócalo, que puede sobresalir del yeso.',
        'Tome la altura de la pared en varios puntos. Los techos abombados y los pisos levantados rara vez dejan la misma altura en cada montante.',
        'Anote por separado niches, chaseways y estanterías empotradas; cada tramo plano es su propio rectángulo.',
        'Registre todo en una unidad —pies para el trabajo imperial, metros para el métrico— antes de empezar cualquier multiplicación.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Habitaciones no rectangulares',
      body: 'Una habitación en forma de L son dos rectángulos, no un misterio. Mida cada tramo por separado, calcule sus paredes y sume los resultados. Lo único que cambia es el perímetro que se recorre; la aritmética sigue siendo la misma.',
    },
    { type: 'heading', level: 2, id: 'wall-area', text: 'Cómo calcular el área bruta de las paredes' },
    {
      type: 'paragraph',
      text: 'Las paredes de una habitación rectangular forman una banda a su alrededor. La longitud de esa banda es el perímetro, y multiplicarlo por la altura da el área bruta, es decir el área antes de cualquier descuento:',
    },
    { type: 'formula', expression: 'perímetro = 2 × (12 + 12) = 48 ft' },
    { type: 'formula', expression: 'área bruta = 48 × 8 = 384 ft²' },
    {
      type: 'paragraph',
      text: 'El mismo atajo sirve para cualquier rectángulo. Una habitación de 10 ft × 10 ft tiene 40 ft de perímetro y 320 ft² de pared a 8 ft de altura; una de 12 ft × 16 ft tiene 56 ft y 448 ft².',
    },
    {
      type: 'table',
      headers: ['Habitación (L × A)', 'Perímetro', 'Área bruta a 8 ft'],
      rows: [
        ['10 ft × 10 ft', '40 ft', '320 ft²'],
        ['12 ft × 12 ft', '48 ft', '384 ft²'],
        ['12 ft × 16 ft', '56 ft', '448 ft²'],
        ['14 ft × 16 ft', '60 ft', '480 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Las esquinas no consumen pintura, así que no llevan ajuste. Los techos no forman parte de esta cifra: se miden por separado, en la sección 9, porque suelen ser una cantidad de producto distinta y a menudo con otro brillo.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'doors-and-windows',
      text: 'Descontar puertas y ventanas',
    },
    {
      type: 'paragraph',
      text: 'Las aberturas que no se van a pintar se restan del área bruta. Mida el marco de cada puerta y ventana —no solo el vidrio— y sume las áreas. Para planificar, una puerta interior estándar ronda los 21 ft² (aproximadamente 3 ft × 7 ft) y una ventana doble típica unos 15 ft²; son tamaños de ejemplo habituales, y la Calculadora de Pintura de MixTally los usa como valores predeterminados que usted puede cambiar. Mida sus propias aberturas cuando difieran.',
    },
    {
      type: 'paragraph',
      text: 'El ejemplo continuo tiene una puerta y dos ventanas:',
    },
    { type: 'formula', expression: 'descuentos = 21 + 2 × 15 = 51 ft²' },
    { type: 'formula', expression: 'área neta = 384 − 51 = 333 ft²' },
    {
      type: 'list',
      items: [
        'Descuente el marco completo de las puertas y ventanas que va a dejar intactas.',
        'No descuente molduras, zócalos o marcos que piense pintar: añaden un poco de área, y dejarlos en el cálculo es la elección conservadora.',
        'Pintar las caras de las puertas es un presupuesto pequeño y aparte: una cara de puerta estándar ronda los 13 a 15 ft², de modo que dos caras añaden unos 30 ft² de área recubierta, equivalentes a unos 0,17 galones por las dos capas con la cobertura de ejemplo.',
        'Persianas, cortinas y muebles adheridos a la pared también cubren área. Descuente solo lo que permanezca en su sitio durante el trabajo.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'coverage-per-gallon',
      text: 'Entender la cobertura de la pintura por pie cuadrado',
    },
    {
      type: 'paragraph',
      text: 'Cada lata indica una cobertura —pies cuadrados por galón en unidades imperiales, metros cuadrados por litro en métricas— y esa cifra es el divisor del paso final de la fórmula. Describe hasta dónde se extiende un envase sobre una capa, sobre una superficie correctamente preparada. Es una especificación de ese producto, no una regla general sobre la pintura: un acrílico denso sobre yeso liso y un recubrimiento texturizado sobre yeso crudo pueden diferir ampliamente.',
    },
    {
      type: 'figure',
      src: PAINT_ROLLER_FIGURE.src,
      alt: 'Un rodillo extiende una capa fresca de pintura a lo largo de una pared en pasos largos y uniformes',
      caption: 'Pintar la pared con pasos largos y uniformes, donde se usa de verdad la cobertura medida',
      width: PAINT_ROLLER_FIGURE.width,
      height: PAINT_ROLLER_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Superficie (ejemplo)', 'Cobertura ilustrativa por galón y capa'],
      rows: [
        ['Yeso liso ya pintado', '300–350 ft²'],
        ['Yeso nuevo o sin pintar', '225–300 ft²'],
        ['Paredes con textura ligera', '250–300 ft²'],
        ['Mampostería rugosa o textura fuerte', '150–250 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Los rangos anteriores son ejemplos de planificación, no datos de fabricante: úselos para contrastar la cifra de su propia lata. La cobertura baja cuando la superficie absorbe pintura (yeso crudo, yeso sin sellar, hormigón poroso), cuando la textura deja huecos sombreados que el rodillo no alcanza y cuando los colores profundos o vivos requieren pasadas extra para cubrir. Sube sobre superficies selladas y de color claro, con un rodillo de calidad.',
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'La cobertura siempre es por capa',
      body: 'Una lata que indica 350 ft² no promete 350 ft² de color terminado en una sola pasada sobre cualquier pared: es la tasa del fabricante para una capa sobre una superficie definida. Dos capas duplican la pintura, no el área cubierta.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'multiple-coats',
      text: 'Cuánta pintura para dos capas (o tres)',
    },
    {
      type: 'paragraph',
      text: 'La mayoría de los acabados se especifica a dos capas, y la cobertura se aplica a cada una de ellas. Multiplique el área neta por el número de capas antes de dividir:',
    },
    { type: 'formula', expression: 'área recubierta = área neta × número de capas' },
    { type: 'formula', expression: 'pintura necesaria = área recubierta ÷ cobertura' },
    {
      type: 'paragraph',
      text: 'En el ejemplo continuo (333 ft² netos), el área recubierta es de 666 ft² para dos capas y de 999 ft² para tres. Con la cobertura ilustrativa de 350 ft² por galón:',
    },
    {
      type: 'table',
      headers: ['Capas', 'Área recubierta', 'Galones a 350 ft²/gal'],
      rows: [
        ['1', '333 ft²', '0,95'],
        ['2', '666 ft²', '1,90'],
        ['3', '999 ft²', '2,85'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Los pimeras de primera mano no forman parte de esta multiplicación. La imprimación es un producto aparte, con su propia cobertura y su propia cantidad; las preguntas frecuentes explican cómo se relaciona con el estimado de acabado.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'worked-example',
      text: 'Ejemplo resuelto: una habitación de 12 ft × 12 ft con paredes de 8 ft',
    },
    {
      type: 'paragraph',
      text: 'El método completo, de principio a fin, con cada cifra a la vista. Los datos: una habitación cuadrada de 12 ft por lado, 8 ft de altura de pared, una puerta estándar, dos ventanas estándar, dos capas de pintura y una cobertura ilustrativa de 350 ft² por galón por capa.',
    },
    { type: 'heading', level: 3, id: 'example-walls', text: 'Paso 1: área bruta de paredes' },
    {
      type: 'paragraph',
      text: 'perímetro = 2 × (12 + 12) = 48 ft, y área bruta = 48 × 8 = 384 ft².',
    },
    { type: 'heading', level: 3, id: 'example-openings', text: 'Paso 2: descontar las aberturas' },
    {
      type: 'paragraph',
      text: 'Una puerta de 21 ft² y dos ventanas de 15 ft² cada una dan 21 + 30 = 51 ft² de descuentos, y dejan un área neta de 384 − 51 = 333 ft².',
    },
    { type: 'heading', level: 3, id: 'example-gallons', text: 'Paso 3: capas y cobertura' },
    {
      type: 'paragraph',
      text: 'Dos capas cubren 333 × 2 = 666 ft². Dividiendo entre la cobertura de ejemplo: 666 ÷ 350 = 1,90 galones.',
    },
    { type: 'heading', level: 3, id: 'example-allowance', text: 'Paso 4: margen opcional' },
    {
      type: 'paragraph',
      text: 'La textura, la absorción, las pérdidas del corte de bordes y una reserva para retoques no están en la cifra geométrica. Un margen opcional del 10% sobre 1,90 galones es 1,90 × 1,10 = 2,09 galones, que redondea a unos 2,1 galones.',
    },
    {
      type: 'table',
      headers: ['Cantidad', 'Valor'],
      rows: [
        ['Perímetro de la habitación', '48 ft'],
        ['Área bruta de paredes', '384 ft²'],
        ['Descuentos de puertas y ventanas', '51 ft²'],
        ['Área neta de paredes', '333 ft²'],
        ['Área recubierta a dos capas', '666 ft²'],
        ['Pintura sin margen (350 ft²/gal)', '1,90 galones'],
        ['Pintura con margen opcional del 10%', '≈ 2,1 galones'],
      ],
    },
    {
      type: 'paragraph',
      text: 'La pintura se vende en envases enteros, de modo que 1,90 galones son una compra de dos galones y 2,1 galones una de tres si solo hay galones sueltos en el estante. Las habitaciones grandes suelen cruzar a los bidones de cinco galones, donde la aritmética simplemente continúa: divida y redondee al siguiente envase completo.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Son cifras calculadas, no estándares',
      body: '350 ft² por galón, una puerta de 21 ft² y una ventana de 15 ft² fueron los datos declarados de este ejemplo. La lata de su producto, sus aberturas y su superficie producirán otras cifras: lo constante es el método, no los números.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ceiling-paint',
      text: 'Estimar la pintura del techo por separado',
    },
    {
      type: 'paragraph',
      text: 'Los techos son planos y se miden con el área del piso, no con el perímetro. El techo de la misma habitación de 12 ft × 12 ft mide 12 × 12 = 144 ft², y dos capas necesitan 288 ft² recubiertos —unos 0,82 galones con la cobertura de ejemplo, es decir en la práctica una compra de un galón.',
    },
    { type: 'formula', expression: 'área del techo = largo × ancho' },
    {
      type: 'paragraph',
      text: 'Mantener el techo en su propia línea hace honesto el estimado: los techos suelen pintarse en mate mientras las paredes llevan el brillo de acabado, los dos se compran en cantidades distintas, y un techo texturizado puede absorber notablemente más pintura que uno liso. Añada la cifra del techo a la de las paredes solo al totalizar la lista de compras, nunca dentro de la fórmula de área de paredes.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'allowances',
      text: 'Márgenes por textura, absorpción y retoques',
    },
    {
      type: 'paragraph',
      text: 'El cálculo geométrico describe una habitación ideal con paredes lisas y selladas y un rodillo que no desperdicia nada. El trabajo real se aleja de ese ideal en varias direcciones a la vez, y un margen es la forma en que el estimado reconoce esa distancia.',
    },
    {
      type: 'list',
      items: [
        'Textura de la superficie: los acabados knockdown, naranja picada y las felpas gruesas dejan huecos que exigen pasadas extra.',
        'Absorción: el yeso crudo, el yeso lijado y el hormigón sin sellar beben una primera capa que nunca termina de cubrir.',
        'Pérdidas de aplicación: la pintura se queda en la bandeja, en el rodillo y en el cubo del corte; los bordes y las esquinas avanzan más lento que las paredes abiertas.',
        'Retoques: los golpes del mobiliario, las placas de interruptores retiradas y la pared detrás de la puerta piden una pequeña reserva meses después, cuando el lote original puede ya no estar en el estante.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Un margen del 5 a 10% es una elección de planificación habitual en interiores corrientes; la textura más marcada o una primera mano sobre superficies crudas pueden justificar más. En el ejemplo continuo, el 10% lleva las paredes de 1,90 a 2,09 galones: un seguro barato contra un segundo viaje, y aún muy lejos del desperdicio de comprar el doble de lo necesario. Elija la cifra deliberadamente y mantenla separada del resultado geométrico, para que ambas cifras sigan visibles.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Errores frecuentes de estimación',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Usar el área del piso como área de paredes. Una losa de 12 × 12 mide 144 ft²; las paredes de la misma habitación son 384 ft² antes de descuentos, casi tres veces más.',
        'Olvidar que las capas multiplican todo. La cobertura es por capa; dos capas duplican la pintura, no el área pintada.',
        'Tratar la cifra de cobertura de la lata como universal. Describe un producto sobre una superficie definida; otro brillo, otro color u otra pared pueden moverla en cien pies cuadrados o más.',
        'No descontar puertas y ventanas —o descontarlas dos veces también retirando las caras de puertas que se piensan pintar.',
        'Saltarse el margen y comprar exactamente la cifra geométrica, para quedarse cortos en la segunda capa con media pared por hacer.',
        'Mezclar sistemas de unidades: litros en una fórmula de galones, o metros cuadrados en una cobertura de pies cuadrados.',
        'Fusionar el techo con el área de paredes. Al final el total se parece, pero se oculta la cantidad por separado y el producto distinto que en realidad hay que comprar.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Preguntas frecuentes' },
    {
      type: 'faq',
      items: [
        {
          question: '¿Cuánta pintura necesito para una habitación de 12 ft × 12 ft?',
          answer:
            'Para las paredes, unos 1,9 galones para dos capas con una cobertura ilustrativa de 350 ft² por galón, tras descontar una puerta y dos ventanas; unos 2,1 galones con un margen del 10%. El techo añade aproximadamente un galón más. La lata de su producto y sus propias aberturas desplazarán estas cifras.',
        },
        {
          question: '¿Cuál es una cobertura típica por pie cuadrado?',
          answer:
            'El yeso liso ya pintado suele quedarse en torno a 300–350 ft² por galón y capa; las superficies crudas o texturizadas, menos. Son ejemplos de planificación: el dato autorizado es la cobertura impresa en la lata que va a comprar.',
        },
        {
          question: '¿Debo descontar puertas y ventanas del área de paredes?',
          answer:
            'Sí, en cada abertura que no se va a pintar. Mida los marcos (unos 21 ft² para una puerta estándar y 15 ft² para una ventana típica en el ejemplo usado aquí) y restélos una sola vez. Si también pinta las caras de las puertas, cuente ese área por separado en lugar de dejarla descontada.',
        },
        {
          question: '¿Cuánta pintura necesito para dos capas?',
          answer:
            'Duplique el área recubierta y divida entre la cobertura. La habitación de ejemplo necesita 333 × 2 = 666 ft² recubiertos, y 666 ÷ 350 = 1,90 galones antes del margen.',
        },
        {
          question: '¿Debe incluirse el techo en el área de paredes?',
          answer:
            'No. Mídalo por separado como largo × ancho (144 ft² para la habitación de 12 × 12), multiplica por su propio número de capas y añádelo al total de compras. Los techos suelen llevar otro brillo y otra cantidad.',
        },
        {
          question: '¿La imprimación cuenta como una capa de pintura?',
          answer:
            'No. La imprimación es un producto aparte, con su propia cobertura y su propio tamaño de envase. Estímela desde la misma área de paredes, en su propia línea, y no la reste del requisito de acabado: las capas de acabado siguen necesitando su número completo de capas sobre la superficie imprimada.',
        },
        {
          question: '¿Cómo convierto galones y pies cuadrados a litros y metros cuadrados?',
          answer:
            'Un galón estadounidense equivale a unos 3,785 litros y un pie cuadrado a unos 0,0929 m². O use directamente la cobertura métrica: 333 ft² son unos 30,9 m², y con una cobertura de ejemplo de 8,5 m² por litro y capa, dos capas necesitan 61,8 ÷ 8,5 ≈ 7,3 litros —cercano a los 1,90 galones del cálculo imperial, convertidos (1,90 × 3,785 ≈ 7,2 litros). La pequeña diferencia viene de que las tasas de ejemplo no son conversiones exactas la una de la otra.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calcule la pintura de su propia habitación',
    },
    {
      type: 'paragraph',
      text: 'El recorrido anterior fija un tamaño de habitación. Para cualquier otra dimensión, [la Calculadora de Pintura de MixTally](/calculators/paint-calculator) toma largo, ancho, altura de pared, cantidades de puertas y ventanas, número de capas y su propia cobertura, y en un solo paso informa el área bruta, los descuentos, el área neta, el área recubierta y la compra en envases enteros, en galones o litros. El catálogo completo de estimadores vive en el [directorio de calculadoras](/calculators).',
    },
    {
      type: 'calculator-cta',
      view: 'paint-calculator',
      title: 'Calculadora de Pintura de MixTally',
      body: 'Introduzca dimensiones de la habitación, puertas, ventanas, capas y cobertura para ver el área de paredes, los descuentos y la cantidad de pintura en galones o litros, con un precio unitario opcional para estimar el costo.',
    },
  ],
};

const paintRoomPt: ArticleTranslation = {
  imageAlt: 'Ilustração do artigo: um cômodo sendo pintado de verde azulado com cotas de 12 ft por 8 ft, latas de tinta e uma bandeja de rolo, e um caderno com o resultado de 1,9 galões',
  ogImageAlt: 'Ilustração do artigo: um cômodo sendo pintado de verde azulado com cotas de 12 ft por 8 ft, latas de tinta e uma bandeja de rolo, e um caderno com o resultado de 1,9 galões',
  title: 'Quanta tinta preciso para um cômodo? Fórmula e exemplos',
  description:
    'Aprenda a calcular a tinta de um cômodo com a área das paredes, portas e janelas, a cobertura por demão e o número de demãos, com um exemplo resolvido.',
  excerpt:
    'A fórmula de quantidade de tinta desenvolvida em um cômodo de 12 ft × 12 ft: área das paredes, deduções de portas e janelas, cobertura por demão, teto e margens.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'why-it-matters',
      text: 'Por que estimar a tinta com precisão importa',
    },
    {
      type: 'paragraph',
      text: 'Tinta é vendida por volume: galões nos Estados Unidos e litros quase em todo o resto, e cada cômodo pintado é um pequeno exercício de orçamento. Comprar de menos interrompe o serviço para uma segunda viagem; comprar de demasiado deixa dinheiro parado na prateleira. Uma estimativa medida transforma um palpite da loja em um número que se pode defender.',
    },
    {
      type: 'paragraph',
      text: 'Este artigo percorre o método padrão: medir o cômodo, calcular a área bruta das paredes, subtrair o que não será pintado, dividir pela cobertura indicada pelo fabricante, multiplicar pelo número de demãos e então decidir quanta margem acrescentar. O percorrido usa unidades imperiais e um cômodo de 12 ft × 12 ft como exemplo contínuo; quem trabalha em unidades métricas pode seguir os mesmos passos com metros e m² por litro. O resultado é uma quantidade, não uma especificação de produto, acabamento ou garantia.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'paint-formula',
      text: 'A fórmula básica de quantidade de tinta',
    },
    {
      type: 'paragraph',
      text: 'Quatro medidas movem todo o cálculo: comprimento e largura do cômodo, altura da parede, área total de portas e janelas que não serão pintadas e a cobertura impressa na lata. Multiplique e divida nesta ordem:',
    },
    { type: 'formula', expression: 'Perímetro = 2 × (comprimento + largura)' },
    { type: 'formula', expression: 'Área bruta das paredes = perímetro × altura da parede' },
    { type: 'formula', expression: 'Área líquida das paredes = área bruta − portas e janelas' },
    {
      type: 'formula',
      expression: 'Tinta necessária (galões) = (área líquida × demãos) ÷ cobertura',
    },
    {
      type: 'paragraph',
      text: 'A cobertura é o número do fabricante: quantos pés quadrados um galão cobre em uma única demão. É uma propriedade daquele produto sobre uma superfície definida, não uma constante universal; a seção 6 retoma o que a altera. Tudo o que precede a divisão é geometria; tudo o que a segue é comportamento do produto.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Resposta rápida para um cômodo padrão',
      body: 'Um cômodo de 12 ft × 12 ft com paredes de 8 ft tem 384 ft² de área bruta. Ao deduzir uma porta e duas janelas (51 ft² neste exemplo), restam 333 ft². Com uma cobertura ilustrativa de 350 ft² por galão por demão, duas demãos precisam de 666 ft² revestidos, ou seja 1,90 galões. Com uma margem opcional de 10%, o número fica em torno de 2,1 galões. Todos estes valores são exemplos calculados a partir de dados declarados, não um padrão para todas as tintas.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring-the-room',
      text: 'Como medir comprimento, largura e altura da parede',
    },
    {
      type: 'paragraph',
      text: 'Três medidas com fita métrica bastam. Meça o comprimento e a largura do cômodo sobre o piso, de face a face das paredes, e a altura desde o piso acabado até a linha do teto. Se o cômodo for um retângulo limpo, uma medida de cada dimensão é suficiente; em casas antigas, meça duas vezes e use o maior valor quando as paredes não forem paralelas.',
    },
    {
      type: 'list',
      items: [
        'Meça sobre o piso junto às faces da parede, e não sobre o rodapé, que pode saltar em relação ao reboco.',
        'Tome a altura da parede em alguns pontos. Tetos caixados e pisos elevados raramente deixam a mesma altura em cada montante.',
        'Anote separadamente nichos, conduites e estantes embutidas; cada trecho plano é seu próprio retângulo.',
        'Registre tudo em uma unidade — pés no trabalho imperial, metros no métrico — antes de qualquer multiplicação.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Cômodos não retangulares',
      body: 'Um cômodo em forma de L são dois retângulos, não um mistério. Meça cada trecho por separado, calcule suas paredes e some os resultados. O único número que muda é o perímetro percorrido; a aritmética continua a mesma.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'wall-area',
      text: 'Como calcular a área bruta das paredes',
    },
    {
      type: 'paragraph',
      text: 'As paredes de um cômodo retangular formam uma faixa ao seu redor. O comprimento dessa faixa é o perímetro, e multiplicá-lo pela altura da parede dá a área bruta, isto é, a área antes de qualquer dedução:',
    },
    { type: 'formula', expression: 'perímetro = 2 × (12 + 12) = 48 ft' },
    { type: 'formula', expression: 'área bruta = 48 × 8 = 384 ft²' },
    {
      type: 'paragraph',
      text: 'O mesmo atalho serve para qualquer retângulo. Um cômodo de 10 ft × 10 ft tem 40 ft de perímetro e 320 ft² de parede a 8 ft de altura; um de 12 ft × 16 ft tem 56 ft e 448 ft².',
    },
    {
      type: 'table',
      headers: ['Cômodo (C × L)', 'Perímetro', 'Área bruta a 8 ft'],
      rows: [
        ['10 ft × 10 ft', '40 ft', '320 ft²'],
        ['12 ft × 12 ft', '48 ft', '384 ft²'],
        ['12 ft × 16 ft', '56 ft', '448 ft²'],
        ['14 ft × 16 ft', '60 ft', '480 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Cantos não consomem tinta, portanto não pedem ajuste. Tetos não fazem parte deste número: são medidos separadamente, na seção 9, porque costumam ser uma quantidade de produto diferente e frequentemente com outro acabamento.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'doors-and-windows',
      text: 'Deduzindo portas e janelas',
    },
    {
      type: 'paragraph',
      text: 'Vãos que não serão pintados são subtraídos da área bruta. Meça a caixilharia de cada porta e janela — não só o vidro — e some as áreas. Para planejamento, uma porta interna padrão tem cerca de 21 ft² (aproximadamente 3 ft × 7 ft) e uma janela comum cerca de 15 ft²; são tamanhos de exemplo habituais, e a Calculadora de Tinta do MixTally os usa como padrões que você pode alterar. Meça seus próprios vãos sempre que diferirem.',
    },
    {
      type: 'paragraph',
      text: 'O exemplo contínuo tem uma porta e duas janelas:',
    },
    { type: 'formula', expression: 'deduções = 21 + 2 × 15 = 51 ft²' },
    { type: 'formula', expression: 'área líquida = 384 − 51 = 333 ft²' },
    {
      type: 'list',
      items: [
        'Deduza a caixilharia completa das portas e janelas que ficarão intactas.',
        'Não deduça molduras, rodapés ou batentes que você pretenda pintar: eles acrescentam um pouco de área, e deixá-los no cálculo é a escolha conservadora.',
        'Pintar as faces das portas é um pequeno orçamento à parte: uma face de porta padrão tem cerca de 13 a 15 ft², de modo que duas faces acrescentam aproximadamente 30 ft² de área revestida, equivalentes a cerca de 0,17 galões nas duas demãos com a cobertura de exemplo.',
        'Persianas, cortinas e armários fixos na parede também cobrem área. Deduz apenas o que permanecer no lugar durante o serviço.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'coverage-per-gallon',
      text: 'Entendendo a cobertura da tinta por pé quadrado',
    },
    {
      type: 'paragraph',
      text: 'Cada lata indica uma cobertura — pés quadrados por galão em unidades imperiais, metros quadrados por litro nas métricas — e esse número é o divisor do passo final da fórmula. Ele descreve até onde um recipiente se espalha em uma demão, sobre uma superfície devidamente preparada. É uma especificação daquele produto, não uma regra geral sobre tinta: um acrílico denso sobre reboco liso e um revestimento texturizado sobre reboco cru podem diferir amplamente.',
    },
    {
      type: 'figure',
      src: PAINT_ROLLER_FIGURE.src,
      alt: 'Um rolo espalha uma demão fresca de tinta ao longo de uma parede em passes longos e uniformes',
      caption: 'Pintar a parede em passes longos e uniformes, onde a cobertura medida é realmente usada',
      width: PAINT_ROLLER_FIGURE.width,
      height: PAINT_ROLLER_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Superfície (exemplo)', 'Cobertura ilustrativa por galão e demão'],
      rows: [
        ['Reboco liso já pintado', '300–350 ft²'],
        ['Reboco novo ou sem tinta', '225–300 ft²'],
        ['Paredes de textura leve', '250–300 ft²'],
        ['Alvenaria rugosa ou textura forte', '150–250 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'As faixas acima são exemplos de planejamento, não dados de fabricante: use-as para confrontar o número da sua própria lata. A cobertura cai quando a superfície bebe tinta (reboco cru, reboco lixado, concreto poroso), quando a textura deixa vazios sombreados que o rolo não alcança e quando cores profundas ou vivas exigem passadas extras para cobrir. Ela sobe sobre superfícies seladas e de tom claro, com um rolo de qualidade.',
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'A cobertura é sempre por demão',
      body: 'Uma lata que indica 350 ft² não promete 350 ft² de cor pronta em uma única passagem sobre qualquer parede: é a taxa do fabricante para uma demão sobre uma superfície definida. Duas demãos duplicam a tinta, não a área coberta.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'multiple-coats',
      text: 'Quanta tinta para duas demãos (ou três)',
    },
    {
      type: 'paragraph',
      text: 'A maioria dos acabamentos é especificada com duas demãos, e a cobertura se aplica a cada uma delas. Multiplique a área líquida pelo número de demãos antes de dividir:',
    },
    { type: 'formula', expression: 'área revestida = área líquida × número de demãos' },
    { type: 'formula', expression: 'tinta necessária = área revestida ÷ cobertura' },
    {
      type: 'paragraph',
      text: 'No exemplo contínuo (333 ft² líquidos), a área revestida é de 666 ft² para duas demãos e de 999 ft² para três. Com a cobertura ilustrativa de 350 ft² por galão:',
    },
    {
      type: 'table',
      headers: ['Demãos', 'Área revestida', 'Galões a 350 ft²/gal'],
      rows: [
        ['1', '333 ft²', '0,95'],
        ['2', '666 ft²', '1,90'],
        ['3', '999 ft²', '2,85'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Primers de primeira demão não entram nesta multiplicação. Primer é um produto separado, com sua própria cobertura e sua própria quantidade; as perguntas frequentes explicam como ele se relaciona com a estimativa de acabamento.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'worked-example',
      text: 'Exemplo resolvido: um cômodo de 12 ft × 12 ft com paredes de 8 ft',
    },
    {
      type: 'paragraph',
      text: 'O método completo, do início ao fim, com cada número à vista. Os dados: um cômodo quadrado de 12 ft de lado, 8 ft de altura de parede, uma porta padrão, duas janelas padrão, duas demãos de tinta e uma cobertura ilustrativa de 350 ft² por galão por demão.',
    },
    { type: 'heading', level: 3, id: 'example-walls', text: 'Passo 1: área bruta das paredes' },
    {
      type: 'paragraph',
      text: 'perímetro = 2 × (12 + 12) = 48 ft, e área bruta = 48 × 8 = 384 ft².',
    },
    { type: 'heading', level: 3, id: 'example-openings', text: 'Passo 2: deduzir os vãos' },
    {
      type: 'paragraph',
      text: 'Uma porta de 21 ft² e duas janelas de 15 ft² cada dão 21 + 30 = 51 ft² de deduções, deixando uma área líquida de 384 − 51 = 333 ft².',
    },
    { type: 'heading', level: 3, id: 'example-gallons', text: 'Passo 3: demãos e cobertura' },
    {
      type: 'paragraph',
      text: 'Duas demãos cobrem 333 × 2 = 666 ft². Dividindo pela cobertura de exemplo: 666 ÷ 350 = 1,90 galões.',
    },
    { type: 'heading', level: 3, id: 'example-allowance', text: 'Passo 4: margem opcional' },
    {
      type: 'paragraph',
      text: 'Textura, absorção, perdas no recorte de bordas e uma reserva para retoques não estão no número geométrico. Uma margem opcional de 10% sobre 1,90 galões dá 1,90 × 1,10 = 2,09 galões, que arredonda para cerca de 2,1 galões.',
    },
    {
      type: 'table',
      headers: ['Quantidade', 'Valor'],
      rows: [
        ['Perímetro do cômodo', '48 ft'],
        ['Área bruta das paredes', '384 ft²'],
        ['Deduções de portas e janelas', '51 ft²'],
        ['Área líquida das paredes', '333 ft²'],
        ['Área revestida em duas demãos', '666 ft²'],
        ['Tinta sem margem (350 ft²/gal)', '1,90 galões'],
        ['Tinta com margem opcional de 10%', '≈ 2,1 galões'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Tinta é vendida em recipientes inteiros, de modo que 1,90 galões são uma compra de dois galões e 2,1 galões uma de três se houver apenas galões avulsos na prateleira. Cômodos grandes costumam cruzar para latas de cinco galões, onde a aritmética simplesmente continua: divida e arredonde para o próximo recipiente cheio.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'São números calculados, não padrões',
      body: '350 ft² por galão, uma porta de 21 ft² e uma janela de 15 ft² foram os dados declarados deste exemplo. A lata do seu produto, seus vãos e sua superfície produzirão outros números: o que é constante é o método, não os valores.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ceiling-paint',
      text: 'Estimando a tinta do teto separadamente',
    },
    {
      type: 'paragraph',
      text: 'Tetos são planos e são medidos pela área do piso, não pelo perímetro. O teto do mesmo cômodo de 12 ft × 12 ft mede 12 × 12 = 144 ft², e duas demãos precisam de 288 ft² revestidos — cerca de 0,82 galões com a cobertura de exemplo, ou seja na prática uma compra de um galão.',
    },
    { type: 'formula', expression: 'área do teto = comprimento × largura' },
    {
      type: 'paragraph',
      text: 'Manter o teto em sua própria linha torna a estimativa honesta: tetos costumam ser pintados foscos enquanto as paredes levam o acabamento brilhante, os dois são comprados em quantidades diferentes, e um teto texturizado pode absorver visivelmente mais tinta que um liso. Some a cifra do teto à das paredes apenas ao totalizar a lista de compras, nunca dentro da fórmula de área de paredes.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'allowances',
      text: 'Margens para textura, absorção e retoques',
    },
    {
      type: 'paragraph',
      text: 'O cálculo geométrico descreve um cômodo ideal, com paredes lisas e seladas e um rolo que não desperdiça nada. O trabalho real se afasta desse ideal em várias direções ao mesmo tempo, e uma margem é como a estimativa reconhece essa distância.',
    },
    {
      type: 'list',
      items: [
        'Textura da superfície: acabamentos knockdown, casca de laranja e rolos de pelo grosso deixam vazios que exigem passadas extras.',
        'Absorção: reboco cru, reboco lixado e concreto cru bebem uma primeira demão que nunca cobre de todo.',
        'Perdas de aplicação: tinta fica na bandeja, no rolo e no balde do recorte; bordas e cantos avançam mais devagar que as paredes abertas.',
        'Retoques: batidas do mobiliário, placas de interruptor removidas e a parede atrás da porta pedem uma pequena reserva meses depois, quando o lote original pode já não estar na prateleira.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Uma margem de 5 a 10% é uma escolha de planejamento comum em interiores correntes; textura mais marcante ou uma primeira demão sobre superfícies cruas podem justificar mais. No exemplo contínuo, 10% leva as paredes de 1,90 a 2,09 galões: um seguro barato contra uma segunda viagem, e ainda muito longe do desperdício de comprar o dobro do necessário. Escolha o número deliberadamente e mantenha-o separado do resultado geométrico, para que ambos permaneçam visíveis.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Erros comuns de estimativa',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Usar a área do piso como área das paredes. Um piso de 12 × 12 tem 144 ft²; as paredes do mesmo cômodo têm 384 ft² antes das deduções, quase três vezes mais.',
        'Esquecer que as demãos multiplicam tudo. A cobertura é por demão; duas demãos duplicam a tinta, não a área pintada.',
        'Tratar o número de cobertura da lata como universal. Ele descreve um produto sobre uma superfície definida; outro acabamento, outra cor ou outra parede podem deslocá-lo em cem pés quadrados ou mais.',
        'Não deduzir portas e janelas — ou deduzi-las duas vezes, removendo também as faces das portas que serão pintadas.',
        'Pular a margem e comprar exatamente o número geométrico, para ficar sem tinta na segunda demão com meia parede por fazer.',
        'Misturar sistemas de unidades: litros numa fórmula de galões, ou metros quadrados numa cobertura de pés quadrados.',
        'Fundir o teto com a área das paredes. No fim o total se aproxima, mas esconde a quantidade separada e o produto diferente que realmente precisa ser comprado.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Perguntas frequentes' },
    {
      type: 'faq',
      items: [
        {
          question: 'Quanta tinta preciso para um cômodo de 12 ft × 12 ft?',
          answer:
            'Para as paredes, cerca de 1,9 galões para duas demãos com uma cobertura ilustrativa de 350 ft² por galão, depois de deduzir uma porta e duas janelas; cerca de 2,1 galões com uma margem de 10%. O teto acrescenta aproximadamente mais um galão. A lata do seu produto e seus próprios vãos deslocarão estes números.',
        },
        {
          question: 'Qual é uma cobertura típica por pé quadrado?',
          answer:
            'Reboco liso já pintado costuma ficar em torno de 300–350 ft² por galão por demão; superfícies cruas ou texturizadas, menos. São exemplos de planejamento: o número autorizado é a cobertura impressa na lata que você vai comprar.',
        },
        {
          question: 'Devo deduzir portas e janelas da área das paredes?',
          answer:
            'Sim, em cada vão que não será pintado. Meça as caixilharias (cerca de 21 ft² para uma porta padrão e 15 ft² para uma janela comum no exemplo usado aqui) e subtraia-as uma única vez. Se também pintar as faces das portas, conte essa área separadamente em vez de deixá-la deduzida.',
        },
        {
          question: 'Quanta tinta preciso para duas demãos?',
          answer:
            'Dobre a área revestida e divida pela cobertura. O cômodo de exemplo precisa de 333 × 2 = 666 ft² revestidos, e 666 ÷ 350 = 1,90 galões antes da margem.',
        },
        {
          question: 'O teto deve ser incluído na área das paredes?',
          answer:
            'Não. Meça-o separadamente como comprimento × largura (144 ft² para o cômodo de 12 × 12), multiplique pelo seu próprio número de demãos e some ao total de compras. Tetos costumam ter outro acabamento e outra quantidade.',
        },
        {
          question: 'Primer conta como uma demão de tinta?',
          answer:
            'Não. Primer é um produto separado, com sua própria cobertura e seu próprio tamanho de recipiente. Estime-o a partir da mesma área de paredes, em sua própria linha, e não o subtraia do requisito de acabamento: as demãos de acabamento continuam precisando do seu número completo de demãos sobre a superfície aplicada com primer.',
        },
        {
          question: 'Como converto galões e pés quadrados em litros e metros quadrados?',
          answer:
            'Um galão americano equivale a cerca de 3,785 litros e um pé quadrado a cerca de 0,0929 m². Ou use diretamente a cobertura métrica: 333 ft² são cerca de 30,9 m², e com uma cobertura de exemplo de 8,5 m² por litro por demão, duas demãos precisam de 61,8 ÷ 8,5 ≈ 7,3 litros — próximo dos 1,90 galões do cálculo imperial, convertidos (1,90 × 3,785 ≈ 7,2 litros). A pequena diferença vem de as taxas de exemplo não serem conversões exatas uma da outra.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calcule a tinta do seu próprio cômodo',
    },
    {
      type: 'paragraph',
      text: 'O percorrido acima fixa um tamanho de cômodo. Para qualquer outra dimensão, [a Calculadora de Tinta do MixTally](/calculators/paint-calculator) recebe comprimento, largura, altura de parede, quantidades de portas e janelas, número de demãos e sua própria cobertura, e em um único passo informa área bruta, deduções, área líquida, área revestida e a compra em recipientes inteiros, em galões ou litros. O catálogo completo de estimadores está no [diretório de calculadoras](/calculators).',
    },
    {
      type: 'calculator-cta',
      view: 'paint-calculator',
      title: 'Calculadora de Tinta do MixTally',
      body: 'Informe dimensões do cômodo, portas, janelas, demãos e cobertura para ver a área das paredes, as deduções e a quantidade de tinta em galões ou litros, com um preço unitário opcional para estimar o custo.',
    },
  ],
};

const paintRoomFr: ArticleTranslation = {
  imageAlt: 'Illustration de l\'article : une pièce en cours de peinture turquoise avec des cotes de 12 ft sur 8 ft, des pots de peinture et une cuve à rouleau, et un carnet indiquant le résultat de 1,9 gallon',
  ogImageAlt: 'Illustration de l\'article : une pièce en cours de peinture turquoise avec des cotes de 12 ft sur 8 ft, des pots de peinture et une cuve à rouleau, et un carnet indiquant le résultat de 1,9 gallon',
  title: 'Combien de peinture faut-il pour une pièce ? Formule et exemples',
  description:
    'Apprenez à calculer la peinture d\'une pièce : surface des murs, portes et fenêtres, couverture par couche et nombre de couches, avec un exemple.',
  excerpt:
    'La formule de quantité de peinture développée sur une pièce de 12 ft × 12 ft : surface des murs, déductions des portes et fenêtres, couverture par couche, plafond et marges.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'why-it-matters',
      text: 'Pourquoi une estimation juste de la peinture compte',
    },
    {
      type: 'paragraph',
      text: 'La peinture se vend au volume : les gallons aux États-Unis, les litres presque partout ailleurs, et chaque pièce peinte est un petit exercice de métrage. En acheter trop peu arrête le chantier pour un second trajet ; en acheter trop laisse du budget inutilisé en rayon. Une estimation mesurée transforme une supposition en magasin en un chiffre défendable.',
    },
    {
      type: 'paragraph',
      text: 'Cet article parcourt la méthode standard : mesurer la pièce, calculer la surface brute des murs, soustraire ce qui ne sera pas peint, diviser par la couverture indiquée par le fabricant, multiplier par le nombre de couches, puis décider de la marge à ajouter. Le parcours utilise les unités impériales et une pièce de 12 ft × 12 ft comme exemple continu ; les praticiens métriques peuvent suivre les mêmes étapes avec des mètres et des m² par litre. Le résultat est une quantité, non une spécification de produit, de finition ou de garantie.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'paint-formula',
      text: 'La formule de base de la quantité de peinture',
    },
    {
      type: 'paragraph',
      text: 'Quatre mesures commandent tout le calcul : la longueur et la largeur de la pièce, la hauteur des murs, la surface totale des portes et fenêtres qui ne seront pas peintes, et la couverture imprimée sur la boîte. Multipliez et divisez dans cet ordre :',
    },
    { type: 'formula', expression: 'Périmètre = 2 × (longueur + largeur)' },
    { type: 'formula', expression: 'Surface brute des murs = périmètre × hauteur des murs' },
    {
      type: 'formula',
      expression: 'Surface nette des murs = surface brute − portes et fenêtres',
    },
    {
      type: 'formula',
      expression: 'Peinture nécessaire (gallons) = (surface nette × couches) ÷ couverture',
    },
    {
      type: 'paragraph',
      text: 'La couverture est le chiffre du fabricante : le nombre de pieds carrés qu\'un gallon couvre sur une seule couche. C\'est une propriété de ce produit sur une surface définie, pas une constante universelle ; la section 6 revient sur ce qui la fait varier. Tout ce qui précède la division est de la géométrie ; tout ce qui la suit relève du comportement du produit.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Réponse rapide pour une pièce standard',
      body: 'Une pièce de 12 ft × 12 ft aux murs de 8 ft présente 384 ft² de surface brute. Après déduction d\'une porte et de deux fenêtres (51 ft² dans cet exemple), il reste 333 ft². Avec une couverture illustrative de 350 ft² par gallon par couche, deux couches demandent 666 ft² recouverts, soit 1,90 gallons. Avec une marge optionnelle de 10 %, le chiffre approche 2,1 gallons. Tous ces nombres sont des exemples calculés à partir de données déclarées, pas une norme pour toutes les peintures.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring-the-room',
      text: 'Mesurer la longueur, la largeur et la hauteur des murs',
    },
    {
      type: 'paragraph',
      text: 'Trois mesures au mètre ruban suffisent. Mesurez la longueur et la largeur de la pièce sur le sol, de face à face des murs, et la hauteur depuis le sol fini jusqu\'à la ligne du plafond. Si la pièce est un rectangle net, une mesure de chaque dimension suffit ; dans les maisons anciennes, mesurez deux fois et retenez la plus grande valeur lorsque les murs ne sont pas parallèles.',
    },
    {
      type: 'list',
      items: [
        'Mesurez sur le sol le long des faces de mur, et non le long de la plinthe, qui peut dépasser du plâtre.',
        'Prenez la hauteur des murs en plusieurs points. Les plafonds déformés et les sols surélevés laissent rarement la même hauteur à chaque montant.',
        'Notez séparément les alcôves, gaines technique et étagères murales : chaque tronçon plat est son propre rectangle.',
        'Notez tout dans une seule unité — pieds pour l\'impérial, mètres pour le métrique — avant toute multiplication.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Pièces non rectangulaires',
      body: 'Une pièce en L est deux rectangles, pas un mystère. Mesurez chaque aile séparément, calculez ses murs et additionnez les résultats. Seul le périmètre parcouru change ; l\'arithmétique reste la même.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'wall-area',
      text: 'Calculer la surface brute des murs',
    },
    {
      type: 'paragraph',
      text: 'Les murs d\'une pièce rectangulaire forment un bandeau autour d\'elle. La longueur de ce bandeau est le périmètre, et la multiplier par la hauteur des murs donne la surface brute, c\'est-à-dire la surface avant toute déduction :',
    },
    { type: 'formula', expression: 'périmètre = 2 × (12 + 12) = 48 ft' },
    { type: 'formula', expression: 'surface brute = 48 × 8 = 384 ft²' },
    {
      type: 'paragraph',
      text: 'Le même raccourci vaut pour tout rectangle. Une pièce de 10 ft × 10 ft a 40 ft de périmètre et 320 ft² de mur à 8 ft de haut ; une de 12 ft × 16 ft en a 56 ft et 448 ft².',
    },
    {
      type: 'table',
      headers: ['Pièce (L × l)', 'Périmètre', 'Surface brute à 8 ft'],
      rows: [
        ['10 ft × 10 ft', '40 ft', '320 ft²'],
        ['12 ft × 12 ft', '48 ft', '384 ft²'],
        ['12 ft × 16 ft', '56 ft', '448 ft²'],
        ['14 ft × 16 ft', '60 ft', '480 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Les angles ne consomment pas de peinture : aucun ajustement n\'est nécessaire. Les plafonds ne font pas partie de ce chiffre ; ils se mesurent séparément, à la section 9, car ils constituent généralement une quantité de produit distincte et souvent une finition différente.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'doors-and-windows',
      text: 'Déduire les portes et les fenêtres',
    },
    {
      type: 'paragraph',
      text: 'Les ouvertures que l\'on ne peindra pas se soustraient de la surface brute. Mesurez le cadre de chaque porte et fenêtre — pas seulement la vitre — et additionnez les surfaces. À titre indicatif, une porte intérieure standard avoisine 21 ft² (environ 3 ft × 7 ft) et une fenêtre courante environ 15 ft² ; ce sont des tailles d\'exemple usuelles, et la Calculatrice de peinture MixTally les utilise par défaut, modifiables. Mesurez vos propres ouvertures lorsqu\'elles diffèrent.',
    },
    {
      type: 'paragraph',
      text: 'L\'exemple continu comporte une porte et deux fenêtres :',
    },
    { type: 'formula', expression: 'déductions = 21 + 2 × 15 = 51 ft²' },
    { type: 'formula', expression: 'surface nette = 384 − 51 = 333 ft²' },
    {
      type: 'list',
      items: [
        'Déduisez le cadre complet des portes et fenêtres que vous laisserez intacts.',
        'Ne déduisez pas les moulures, plinthes ou encadrements que vous comptez peindre : ils ajoutent un peu de surface, et les laisser dans le calcul est le choix prudent.',
        'Peindre les faces de portes est un petit métrage à part : une face de porte standard mesure environ 13 à 15 ft², soit environ 30 ft² de surface ajoutée pour deux faces, l\'équivalent d\'environ 0,17 gallons sur deux couches avec la couverture d\'exemple.',
        'Stores, rideaux et placards fixés au mur couvrent eux aussi une surface. Ne déduisez que ce qui restera en place pendant les travaux.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'coverage-per-gallon',
      text: 'Comprendre la couverture de la peinture au pied carré',
    },
    {
      type: 'paragraph',
      text: 'Chaque boîte indique une couverture — pieds carrés par gallon en unités impériales, mètres carrés par litre en unités métriques — et ce chiffre est le diviseur de l\'étape finale de la formule. Il décrit la distance qu\'un contenant parcourt sur une couche, sur une surface correctement préparée. C\'est une spécification de ce produit, pas une règle générale sur la peinture : un acrylique dense sur plâtre lisse et un revêtement texturé sur plâtre brut peuvent différer largement.',
    },
    {
      type: 'figure',
      src: PAINT_ROLLER_FIGURE.src,
      alt: 'Un rouleau étale une couche fraîche de peinture le long d\'un mur en longues passes régulières',
      caption: 'Peindre le mur en longues passes régulières, là où la couverture mesurée est réellement consommée',
      width: PAINT_ROLLER_FIGURE.width,
      height: PAINT_ROLLER_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Surface (exemple)', 'Couverture illustrative par gallon et par couche'],
      rows: [
        ['Plâtre lisse déjà peint', '300–350 ft²'],
        ['Plâtre neuf ou non peint', '225–300 ft²'],
        ['Murs à texture légère', '250–300 ft²'],
        ['Maçonnerie rugueuse ou texture marquée', '150–250 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Les fourchettes ci-dessus sont des exemples de planification, pas des données de fabricant : servez-vous-en pour confronter le chiffre de votre propre boîte. La couverture chute lorsque la surface boit la peinture (plâtre brut, plâtre poncé, béton poreux), lorsque la texture laisse des creux à l\'ombre que le rouleau n\'atteint pas, et lorsque les couleurs profondes ou vives exigent des passes supplémentaires pour masquer. Elle augmente sur des surfaces scellées et claires, avec un rouleau de qualité.',
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'La couverture est toujours par couche',
      body: 'Une boîte indiquant 350 ft² ne promet pas 350 ft² de couleur finie en une seule passe sur n\'importe quel mur : c\'est le taux du fabricant pour une couche sur une surface définie. Deux couches doublent la peinture, pas la surface couverte.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'multiple-coats',
      text: 'Combien de peinture pour deux couches (ou trois)',
    },
    {
      type: 'paragraph',
      text: 'La plupart des finitions se spécifient en deux couches, et la couverture s\'applique à chacune d\'elles. Multipliez la surface nette par le nombre de couches avant de diviser :',
    },
    { type: 'formula', expression: 'surface recouverte = surface nette × nombre de couches' },
    { type: 'formula', expression: 'peinture nécessaire = surface recouverte ÷ couverture' },
    {
      type: 'paragraph',
      text: 'Sur l\'exemple continu (333 ft² nets), la surface recouverte est de 666 ft² pour deux couches et de 999 ft² pour trois. Avec la couverture illustrative de 350 ft² par gallon :',
    },
    {
      type: 'table',
      headers: ['Couches', 'Surface recouverte', 'Gallons à 350 ft²/gal'],
      rows: [
        ['1', '333 ft²', '0,95'],
        ['2', '666 ft²', '1,90'],
        ['3', '999 ft²', '2,85'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Les apprêts de première couche n\'entrent pas dans cette multiplication. L\'apprêt est un produit distinct, avec sa propre couverture et sa propre quantité ; la FAQ explique comment il s\'articule avec l\'estimation de finition.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'worked-example',
      text: 'Exemple résolu : une pièce de 12 ft × 12 ft aux murs de 8 ft',
    },
    {
      type: 'paragraph',
      text: 'La méthode complète, de bout en bout, avec chaque chiffre affiché. Les données : une pièce carrée de 12 ft de côté, 8 ft de hauteur de mur, une porte standard, deux fenêtres standard, deux couches de peinture et une couverture illustrative de 350 ft² par gallon par couche.',
    },
    { type: 'heading', level: 3, id: 'example-walls', text: 'Étape 1 : surface brute des murs' },
    {
      type: 'paragraph',
      text: 'périmètre = 2 × (12 + 12) = 48 ft, et surface brute = 48 × 8 = 384 ft².',
    },
    { type: 'heading', level: 3, id: 'example-openings', text: 'Étape 2 : déduire les ouvertures' },
    {
      type: 'paragraph',
      text: 'Une porte de 21 ft² et deux fenêtres de 15 ft² chacune donnent 21 + 30 = 51 ft² de déductions, laissant une surface nette de 384 − 51 = 333 ft².',
    },
    { type: 'heading', level: 3, id: 'example-gallons', text: 'Étape 3 : couches et couverture' },
    {
      type: 'paragraph',
      text: 'Deux couches recouvrent 333 × 2 = 666 ft². Divisé par la couverture d\'exemple : 666 ÷ 350 = 1,90 gallons.',
    },
    { type: 'heading', level: 3, id: 'example-allowance', text: 'Étape 4 : marge optionnelle' },
    {
      type: 'paragraph',
      text: 'La texture, l\'absorption, les pertes de coupe aux arêtes et une réserve pour retouches ne figurent pas dans le chiffre géométrique. Une marge optionnelle de 10 % sur 1,90 gallons vaut 1,90 × 1,10 = 2,09 gallons, soit environ 2,1 gallons arrondis.',
    },
    {
      type: 'table',
      headers: ['Quantité', 'Valeur'],
      rows: [
        ['Périmètre de la pièce', '48 ft'],
        ['Surface brute des murs', '384 ft²'],
        ['Déductions portes et fenêtres', '51 ft²'],
        ['Surface nette des murs', '333 ft²'],
        ['Surface recouverte en deux couches', '666 ft²'],
        ['Peinture sans marge (350 ft²/gal)', '1,90 gallons'],
        ['Peinture avec marge optionnelle de 10 %', '≈ 2,1 gallons'],
      ],
    },
    {
      type: 'paragraph',
      text: 'La peinture se vend en contenants entiers : 1,90 gallons sont donc un achat de deux gallons et 2,1 gallons un achat de trois si seuls des gallons unitaires sont en rayon. Les grandes pièces franchissent souvent le seuil des bidons de cinq gallons, où l\'arithmétique se poursuit simplement : divisez, puis arrondissez au contenant supérieur.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Ce sont des chiffres calculés, pas des normes',
      body: '350 ft² par gallon, une porte de 21 ft² et une fenêtre de 15 ft² étaient les données déclarées de cet exemple. La boîte de votre produit, vos ouvertures et votre surface produiront d\'autres chiffres : la méthode est la constante, pas les nombres.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ceiling-paint',
      text: 'Estimer la peinture du plafond séparément',
    },
    {
      type: 'paragraph',
      text: 'Les plafonds sont des plans qui se mesurent en surface au sol, pas en périmètre. Le plafond de la même pièce de 12 ft × 12 ft mesure 12 × 12 = 144 ft², et deux couches demandent 288 ft² recouverts — environ 0,82 gallons avec la couverture d\'exemple, soit en pratique l\'achat d\'un gallon.',
    },
    { type: 'formula', expression: 'surface du plafond = longueur × largeur' },
    {
      type: 'paragraph',
      text: 'Maintenir le plafond sur sa propre ligne rend l\'estimation honnête : les plafonds se peignent généralement en mat tandis que les murs portent la finition brillante, les deux s\'achètent en quantités différentes, et un plafond texturé peut absorber sensiblement plus de peinture qu\'un lisse. N\'ajoutez la valeur du plafond à celle des murs qu\'au moment de totaliser la liste de courses, jamais dans la formule de surface des murs.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'allowances',
      text: 'Marges pour la texture, l\'absorption et les retouches',
    },
    {
      type: 'paragraph',
      text: 'Le calcul géométrique décrit une pièce idéale, aux murs lisses et scellés, et un rouleau qui ne gaspille rien. Le travail réel s\'écarte de cet idéal dans plusieurs directions à la fois, et une marge est la façon dont l\'estimation reconnaît cet écart.',
    },
    {
      type: 'list',
      items: [
        'Texture de surface : les finitions knockdown, effet orange peel et les rouleaux à poil épais laissent des creux qui demandent des passes supplémentaires.',
        'Absorption : le plâtre brut, le plâtre poncé et le béton non scellé boivent une première couche qui ne masque jamais tout.',
        'Pertes d\'application : la peinture reste dans la cuve, sur le rouleau et dans le seau de coupe ; les bords et les angles progressent moins vite que les murs dégagés.',
        'Retouches : les chocs de mobilier, les plaques d\'interrupteur retirées et le mur derrière la porte demandent une petite réserve des mois plus tard, quand le lot d\'origine n\'est peut-être plus en rayon.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Une marge de 5 à 10 % est un choix de planification courant pour les intérieurs ordinaires ; une texture plus marquée ou une première couche sur surface brute peuvent en justifier davantage. Sur l\'exemple continu, 10 % portent les murs de 1,90 à 2,09 gallons : une assurance bon marché contre un second trajet, et encore très loin du gaspillage d\'acheter le double. Choisissez le chiffre délibérément et gardez-le séparé du résultat géométrique, afin que les deux valeurs restent visibles.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Erreurs d\'estimation courantes',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Utiliser la surface du sol comme surface des murs. Un sol de 12 × 12 fait 144 ft² ; les murs de la même pièce totalisent 384 ft² avant déductions, près de trois fois plus.',
        'Oublier que les couches multiplient tout. La couverture est par couche ; deux couches doublent la peinture, pas la surface peinte.',
        'Traiter le chiffre de couverture de la boîte comme universel. Il décrit un produit sur une surface définie ; une autre finition, une autre couleur ou un autre mur peuvent le déplacer de cent pieds carrés ou plus.',
        'Ne pas déduire les portes et fenêtres — ou les déduire deux fois en retirant aussi les faces de portes que l\'on compte peindre.',
        'Sauter la marge et acheter exactement le chiffre géométrique, puis manquer de peinture sur la deuxième couche avec un demi-mur à finir.',
        'Mélanger les systèmes d\'unités : des litres dans une formule en gallons, ou des mètres carrés dans une couverture en pieds carrés.',
        'Fondre le plafond dans la surface des murs. Le total s\'en rapproche, mais la quantité distincte et le produit différent réellement à acheter se retrouvent masqués.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Questions fréquentes' },
    {
      type: 'faq',
      items: [
        {
          question: 'Combien de peinture pour une pièce de 12 ft × 12 ft ?',
          answer:
            'Pour les murs, environ 1,9 gallons pour deux couches avec une couverture illustrative de 350 ft² par gallon, après déduction d\'une porte et de deux fenêtres ; environ 2,1 gallons avec une marge de 10 %. Le plafond ajoute à peu près un gallon de plus. La boîte de votre produit et vos propres ouvertures déplaceront ces chiffres.',
        },
        {
          question: 'Quelle est une couverture typique au pied carré ?',
          answer:
            'Un plâtre lisse déjà peint se situe souvent autour de 300–350 ft² par gallon et par couche ; les surfaces brutes ou texturées, moins. Ce sont des exemples de planification : la donnée faisant autorité est la couverture imprimée sur la boîte que vous allez acheter.',
        },
        {
          question: 'Faut-il déduire les portes et fenêtres de la surface des murs ?',
          answer:
            'Oui, pour chaque ouverture que vous ne peindrez pas. Mesurez les cadres (environ 21 ft² pour une porte standard et 15 ft² pour une fenêtre courante dans l\'exemple utilisé ici) et soustrayez-les une seule fois. Si vous peignez aussi les faces de portes, comptez cette surface séparément plutôt que de la laisser déduite.',
        },
        {
          question: 'Combien de peinture pour deux couches ?',
          answer:
            'Doublez la surface recouverte, puis divisez par la couverture. La pièce d\'exemple demande 333 × 2 = 666 ft² recouverts, et 666 ÷ 350 = 1,90 gallons avant marge.',
        },
        {
          question: 'Le plafond doit-il être inclus dans la surface des murs ?',
          answer:
            'Non. Mesurez-le séparément en longueur × largeur (144 ft² pour la pièce de 12 × 12), multipliez par son propre nombre de couches et ajoutez-le au total des courses. Les plafonds ont généralement une finition et une quantité différentes.',
        },
        {
          question: 'L\'apprêt compte-t-il comme une couche de peinture ?',
          answer:
            'Non. L\'apprêt est un produit distinct, avec sa propre couverture et sa propre taille de contenant. Estimez-le à partir de la même surface des murs, sur sa propre ligne, et ne le soustrayez pas à l\'exigence de finition : les couches de finition continuent d\'exiger leur nombre complet de couches sur la surface apprêtée.',
        },
        {
          question: 'Comment convertir gallons et pieds carrés en litres et mètres carrés ?',
          answer:
            'Un gallon américain vaut environ 3,785 litres et un pied carré environ 0,0929 m². Ou utilisez directement la couverture métrique : 333 ft² représentent environ 30,9 m², et avec une couverture d\'exemple de 8,5 m² par litre par couche, deux couches demandent 61,8 ÷ 8,5 ≈ 7,3 litres — proche des 1,90 gallons du calcul impérial, convertis (1,90 × 3,785 ≈ 7,2 litres). La légère différence vient de ce que les taux d\'exemple ne sont pas des conversions exactes l\'un de l\'autre.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calculez la peinture de votre propre pièce',
    },
    {
      type: 'paragraph',
      text: 'Le parcours ci-dessus fixe une taille de pièce. Pour toute autre dimension, [la Calculatrice de peinture MixTally](/calculators/paint-calculator) accepte longueur, largeur, hauteur de mur, nombre de portes et de fenêtres, nombre de couches et votre propre couverture, puis indique en une seule passe la surface brute, les déductions, la surface nette, la surface recouverte et l\'achat en contenants entiers, en gallons ou en litres. Le catalogue complet des estimateurs vit dans l\'[annuaire des calculatrices](/calculators).',
    },
    {
      type: 'calculator-cta',
      view: 'paint-calculator',
      title: 'Calculatrice de peinture MixTally',
      body: 'Saisissez les dimensions de la pièce, les portes, les fenêtres, les couches et la couverture pour voir la surface des murs, les déductions et la quantité de peinture en gallons ou en litres, avec un prix unitaire optionnel pour estimer le coût.',
    },
  ],
};

const paintRoomDe: ArticleTranslation = {
  imageAlt: 'Artikelillustration: ein halb gestrichener Raum in Türkis mit Maßpfeilen von 12 ft mal 8 ft, Farbeimern und einer Farbwanne, und ein Notizbuch mit dem Ergebnis von 1,9 Gallonen',
  ogImageAlt: 'Artikelillustration: ein halb gestrichener Raum in Türkis mit Maßpfeilen von 12 ft mal 8 ft, Farbeimern und einer Farbwanne, und ein Notizbuch mit dem Ergebnis von 1,9 Gallonen',
  title: 'Wie viel Farbe brauche ich für einen Raum? Formel und Beispiele',
  description:
    'Erfahren Sie, wie Sie Farbe für einen Raum berechnen: Wandfläche, Türen und Fenster, Deckung pro Schicht und Schichtanzahl — mit Beispiel.',
  excerpt:
    'Die Formel für die Farbmenge, durchgerechnet an einem Raum von 12 ft × 12 ft: Wandfläche, Abzüge für Türen und Fenster, Deckung pro Schicht, Decke und Zuschläge.',
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'why-it-matters',
      text: 'Warum eine genaue Farbschätzung zählt',
    },
    {
      type: 'paragraph',
      text: 'Farbe wird nach Volumen verkauft: Gallonen in den Vereinigten Staaten, Liter fast überall sonst, und jeder gestrichene Raum ist eine kleine Kalkulationsübung. Zu wenig kaufen stoppt den Arbeitsablauf für eine zweite Fahrt; zu viel kaufen bindet Budget unöffnet im Regal. Eine gemessene Schätzung verwandelt eine Vermutung im Baumarkt in eine Zahl, die sich verteidigen lässt.',
    },
    {
      type: 'paragraph',
      text: 'Dieser Artikel führt durch die Standardmethode: den Raum vermessen, die Bruttowandfläche berechnen, abzuziehen, was nicht gestrichen wird, durch die auf der Dose angegebene Deckung zu teilen, mit der Anzahl der Schichten zu multiplizieren und anschließend zu entscheiden, wie viel Zuschlag hinzukommt. Der Durchlauf verwendet imperiale Einheiten und einen Raum von 12 ft × 12 ft als durchgehendes Beispiel; metrisch arbeitende Leser können die gleichen Schritte mit Metern und m² pro Liter gehen. Das Ergebnis ist eine Menge, keine Spezifikation von Produkt, Glanzgrad oder Garantie.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'paint-formula',
      text: 'Die Grundformel für die Farbmenge',
    },
    {
      type: 'paragraph',
      text: 'Vier Maße steuern die gesamte Rechnung: Länge und Breite des Raums, die Wandhöhe, die Gesamtfläche der Türen und Fenster, die nicht gestrichen werden, und die auf der Dose gedruckte Deckung. Multiplizieren und teilen Sie in dieser Reihenfolge:',
    },
    { type: 'formula', expression: 'Umfang = 2 × (Länge + Breite)' },
    { type: 'formula', expression: 'Bruttowandfläche = Umfang × Wandhöhe' },
    { type: 'formula', expression: 'Nettowandfläche = Bruttowandfläche − Türen und Fenster' },
    {
      type: 'formula',
      expression: 'Farbmenge (Gallonen) = (Nettowandfläche × Schichten) ÷ Deckung',
    },
    {
      type: 'paragraph',
      text: 'Die Deckung ist die Zahl des Herstellers: wie viele Quadratfuß eine Gallone auf einer einzigen Schicht deckt. Sie ist eine Eigenschaft dieses Produkts auf einer definierten Oberfläche, keine universelle Konstante; Abschnitt 6 kehrt zurück zu dem, was sie verschiebt. Alles vor der Division ist Geometrie; alles danach ist Produktverhalten.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Kurze Antwort für einen Standardraum',
      body: 'Ein Raum von 12 ft × 12 ft mit 8 ft Wandhöhe hat 384 ft² Bruttowandfläche. Nach Abzug einer Tür und zweier Fenster (51 ft² in diesem Beispiel) bleiben 333 ft². Bei einer illustrativen Deckung von 350 ft² pro Gallone pro Schicht brauchen zwei Schichten 666 ft² Deckfläche, also 1,90 Gallonen. Mit einem optionalen Zuschlag von 10 % liegt die Zahl bei etwa 2,1 Gallonen. Alle diese Werte sind Beispiele aus deklarierten Eingaben, kein Standard für alle Farben.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring-the-room',
      text: 'Länge, Breite und Wandhöhe messen',
    },
    {
      type: 'paragraph',
      text: 'Drei Maße mit dem Rollband genügen. Messen Sie Länge und Breite des Raums über den Boden, von Flanke zu Flanke, und die Wandhöhe vom fertigen Boden bis zur Deckenkante. Ist der Raum ein sauberes Rechteck, reicht eine Messung pro Dimension; in älteren Häusern messen Sie zweimal und verwenden den größeren Wert, wenn die Wände nicht parallel stehen.',
    },
    {
      type: 'list',
      items: [
        'Messen Sie über den Boden an den Wandflächen und nicht entlang der Bodenleiste, die über dem Putz hervorstehen kann.',
        'Nehmen Sie die Wandhöhe an mehreren Punkten auf. Durchhängende Decken und erhöhte Bodenaufbauen lassen selten dieselbe Höhe an jedem Ständer.',
        'Notieren Sie Nischen, Schächte und eingebaute Regale getrennt; jede ebene Wandstrecke ist ihr eigenes Rechteck.',
        'Erfassen Sie alles in einer Einheit — Fuß für imperiale Arbeit, Meter für metrische — bevor irgendeine Multiplikation beginnt.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Nicht rechteckige Räume',
      body: 'Ein L-förmiger Raum ist zwei Rechtecke, kein Rätsel. Messen Sie jedes Stück für sich, berechnen seine Wände und addieren Sie die Ergebnisse. Einzige Änderung ist der zurückgelegte Umfang; die Arithmetik bleibt dieselbe.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'wall-area',
      text: 'Die Bruttowandfläche berechnen',
    },
    {
      type: 'paragraph',
      text: 'Die Wände eines rechteckigen Raums bilden ein Band um ihn. Die Länge dieses Bandes ist der Umfang, und multipliziert mit der Wandhöhe ergibt sie die Bruttowandfläche — die Fläche vor jedem Abzug:',
    },
    { type: 'formula', expression: 'Umfang = 2 × (12 + 12) = 48 ft' },
    { type: 'formula', expression: 'Bruttowandfläche = 48 × 8 = 384 ft²' },
    {
      type: 'paragraph',
      text: 'Derselbe Abkürzungsweg gilt für jedes Rechteck. Ein Raum von 10 ft × 10 ft hat 40 ft Umfang und 320 ft² Wand bei 8 ft Höhe; einer von 12 ft × 16 ft hat 56 ft und 448 ft².',
    },
    {
      type: 'table',
      headers: ['Raum (L × B)', 'Umfang', 'Bruttowandfläche bei 8 ft'],
      rows: [
        ['10 ft × 10 ft', '40 ft', '320 ft²'],
        ['12 ft × 12 ft', '48 ft', '384 ft²'],
        ['12 ft × 16 ft', '56 ft', '448 ft²'],
        ['14 ft × 16 ft', '60 ft', '480 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Ecken verbrauchen keine Farbe und brauchen deshalb keine Korrektur. Decken gehören nicht zu dieser Zahl; sie werden getrennt gemessen, in Abschnitt 9, weil sie meist eine andere Produktmenge und oft einen anderen Glanzgrad darstellen.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'doors-and-windows',
      text: 'Türen und Fenster abziehen',
    },
    {
      type: 'paragraph',
      text: 'Öffnungen, die nicht gestrichen werden, ziehen Sie von der Bruttofläche ab. Messen Sie den Rahmen jeder Tür und jedes Fensters — nicht nur das Glas — und addieren Sie die Flächen. Für die Planung hat eine Standard-Innentür etwa 21 ft² (rund 3 ft × 7 ft) und ein gebräuchliches Fenster etwa 15 ft²; das sind übliche Beispielmaße, und der MixTally Farbrechner verwendet sie als änderbare Standardwerte. Messen Sie Ihre eigenen Öffnungen, sobald sie abweichen.',
    },
    {
      type: 'paragraph',
      text: 'Das durchgehende Beispiel hat eine Tür und zwei Fenster:',
    },
    { type: 'formula', expression: 'Abzüge = 21 + 2 × 15 = 51 ft²' },
    { type: 'formula', expression: 'Nettowandfläche = 384 − 51 = 333 ft²' },
    {
      type: 'list',
      items: [
        'Ziehen Sie den vollständigen Rahmen aller Türen und Fenster ab, die unberührt bleiben.',
        'Ziehen Sie keine Profile, Sockel oder Laibungen ab, die Sie streichen wollen; sie fügen etwas Fläche hinzu, und sie im Rennen zu lassen ist die vorsichtige Wahl.',
        'Türflächen zu streichen ist ein eigenes kleines Aufmaß: Eine Standardtürfläche misst etwa 13 bis 15 ft², zwei Flächen also rund 30 ft² zugesätzliche Deckfläche — bei der Beispieldeckung etwa 0,17 Gallonen über zwei Schichten.',
        'Jalousien, Vorhänge und schrankartige Einbauten bedecken ebenfalls Fläche. Ziehen Sie nur ab, was während der Arbeit an Ort und Stelle bleibt.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'coverage-per-gallon',
      text: 'Die Farbdeckung pro Quadratfuß verstehen',
    },
    {
      type: 'paragraph',
      text: 'Jede Dose gibt eine Deckung an — Quadratfuß pro Gallone in imperialen Einheiten, Quadratmeter pro Liter in metrischen — und diese Zahl ist der Divisor des letzten Schritts der Formel. Sie beschreibt, wie weit sich ein Gebinde auf einer Schicht über einer richtig vorbereiteten Oberfläche verteilt. Sie ist eine Spezifikation dieses Produkts, keine allgemeine Regel über Farbe: ein dichter Acrylputz auf glattem Trockenbau und eine Strukturbeschichtung auf rohem Putz können weit auseinanderliegen.',
    },
    {
      type: 'figure',
      src: PAINT_ROLLER_FIGURE.src,
      alt: 'Eine Rolle zieht eine frische Farbschicht über eine Wand in langen gleichmäßigen Bahnen',
      caption: 'Die Wand in langen gleichmäßigen Bahnen streichen — dort wird die gemessene Deckung tatsächlich verbraucht',
      width: PAINT_ROLLER_FIGURE.width,
      height: PAINT_ROLLER_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Oberfläche (Beispiel)', 'Illustrative Deckung pro Gallone und Schicht'],
      rows: [
        ['Glatte, bereits gestrichene Trockenbauwand', '300–350 ft²'],
        ['Neue oder ungestrichene Trockenbauwand', '225–300 ft²'],
        ['Wände mit leichter Struktur', '250–300 ft²'],
        ['Rauer Mauerwerk oder starke Struktur', '150–250 ft²'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Die obigen Spannen sind Planungsbeispiele, keine Herstellerdaten; verwenden Sie sie, um die Zahl auf Ihrer eigenen Dose zu prüfen. Die Deckung sinkt, wenn die Oberfläche Farbe trinkt (roher Putz, geschliffener Putz, poröser Beton), wenn Struktur schattierte Hohlräume lässt, die die Rolle nicht erreicht, und wenn tiefe oder kräftige Farben zusätzliche Durchgänge zum Verdecken brauchen. Sie steigt auf versiegelten, hellen Oberflächen mit einer hochwertigen Rolle.',
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Die Deckung gilt immer pro Schicht',
      body: 'Eine Dose mit der Angabe 350 ft² verspricht keine 350 ft² fertige Farbe in einem einzigen Durchgang über eine beliebige Wand. Es ist die Rate des Herstellers für eine Schicht auf einer definierten Oberfläche. Zwei Schichten verdoppeln die Farbe, nicht die gedeckte Fläche.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'multiple-coats',
      text: 'Wie viel Farbe für zwei Schichten (oder drei)',
    },
    {
      type: 'paragraph',
      text: 'Die meisten Oberflächen werden mit zwei Schichten spezifiziert, und die Deckung gilt für jede davon. Multiplizieren Sie die Nettowandfläche mit der Anzahl der Schichten, bevor Sie teilen:',
    },
    { type: 'formula', expression: 'Deckfläche = Nettowandfläche × Anzahl der Schichten' },
    { type: 'formula', expression: 'Farbmenge = Deckfläche ÷ Deckung' },
    {
      type: 'paragraph',
      text: 'Im durchgehenden Beispiel (333 ft² netto) beträgt die Deckfläche 666 ft² für zwei Schichten und 999 ft² für drei. Bei der illustrativen Deckung von 350 ft² pro Gallone:',
    },
    {
      type: 'table',
      headers: ['Schichten', 'Deckfläche', 'Gallonen bei 350 ft²/gal'],
      rows: [
        ['1', '333 ft²', '0,95'],
        ['2', '666 ft²', '1,90'],
        ['3', '999 ft²', '2,85'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Grundierungen der ersten Schicht gehören nicht in diese Multiplikation. Grundierung ist ein eigenes Produkt mit eigener Deckung und eigener Menge; die häufig gestellten Fragen erklären, wie sie sich zur Lackierschätzung verhält.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'worked-example',
      text: 'Durchgerechnetes Beispiel: ein Raum von 12 ft × 12 ft mit 8 ft Wandhöhe',
    },
    {
      type: 'paragraph',
      text: 'Die gesamte Methode, von Anfang bis Ende, mit jeder Zahl sichtbar. Die Eingaben: ein quadratischer Raum mit 12 ft Seitenlänge, 8 ft Wandhöhe, eine Standardtür, zwei Standardfenster, zwei Farbschichten und eine illustrative Deckung von 350 ft² pro Gallone pro Schicht.',
    },
    { type: 'heading', level: 3, id: 'example-walls', text: 'Schritt 1: Bruttowandfläche' },
    {
      type: 'paragraph',
      text: 'Umfang = 2 × (12 + 12) = 48 ft, und Bruttowandfläche = 48 × 8 = 384 ft².',
    },
    { type: 'heading', level: 3, id: 'example-openings', text: 'Schritt 2: die Öffnungen abziehen' },
    {
      type: 'paragraph',
      text: 'Eine Tür von 21 ft² und zwei Fenster von je 15 ft² ergeben 21 + 30 = 51 ft² Abzüge und lassen eine Nettowandfläche von 384 − 51 = 333 ft².',
    },
    { type: 'heading', level: 3, id: 'example-gallons', text: 'Schritt 3: Schichten und Deckung' },
    {
      type: 'paragraph',
      text: 'Zwei Schichten decken 333 × 2 = 666 ft². Geteilt durch die Beispieldeckung: 666 ÷ 350 = 1,90 Gallonen.',
    },
    { type: 'heading', level: 3, id: 'example-allowance', text: 'Schritt 4: optionaler Zuschlag' },
    {
      type: 'paragraph',
      text: 'Struktur, Absorption, Verluste an den Kanten und ein Reservebetrag für Nachbesserungen stehen nicht in der geometrischen Zahl. Ein optionaler Zuschlag von 10 % auf 1,90 Gallonen ergibt 1,90 × 1,10 = 2,09 Gallonen, gerundet etwa 2,1 Gallonen.',
    },
    {
      type: 'table',
      headers: ['Größe', 'Wert'],
      rows: [
        ['Umfang des Raums', '48 ft'],
        ['Bruttowandfläche', '384 ft²'],
        ['Abzüge für Türen und Fenster', '51 ft²'],
        ['Nettowandfläche', '333 ft²'],
        ['Deckfläche bei zwei Schichten', '666 ft²'],
        ['Farbe ohne Zuschlag (350 ft²/gal)', '1,90 Gallonen'],
        ['Farbe mit optionalem Zuschlag von 10 %', '≈ 2,1 Gallonen'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Farbe wird in ganzen Gebinden verkauft: 1,90 Gallonen sind damit ein Kauf von zwei Gallonen und 2,1 Gallonen ein Kauf von drei, wenn im Regal nur Einzelgallonen stehen. Größere Räume wechseln oft zu Fünf-Gallonen-Eimern, wo die Arithmetik einfach weiterläuft: teilen und auf das nächste volle Gebinde aufrunden.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Das sind gerechnete Werte, keine Normen',
      body: '350 ft² pro Gallone, eine Tür von 21 ft² und ein Fenster von 15 ft² waren die deklarierten Eingaben dieses Beispiels. Die Dose Ihres Produkts, Ihre Öffnungen und Ihre Oberfläche ergeben andere Zahlen: Die Methode ist die Konstante, nicht die Werte.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ceiling-paint',
      text: 'Deckenfarbe getrennt schätzen',
    },
    {
      type: 'paragraph',
      text: 'Decken sind Flächen und werden in Bodenfläche gemessen, nicht im Umfang. Die Decke desselben Raums von 12 ft × 12 ft misst 12 × 12 = 144 ft², und zwei Schichten brauchen 288 ft² Deckfläche — bei der Beispieldeckung etwa 0,82 Gallonen, in der Praxis also ein Kauf über eine Gallone.',
    },
    { type: 'formula', expression: 'Deckenfläche = Länge × Breite' },
    {
      type: 'paragraph',
      text: 'Die Decke in einer eigenen Zeile zu führen, macht die Schätzung ehrlich: Decken werden meist matt gestrichen, während die Wände den Lackierglanz tragen, beide werden in anderen Mengen gekauft, und eine strukturierte Decke kann spürbar mehr Farbe saugen als eine glatte. Addieren Sie den Deckenwert zu den Wänden erst beim Summieren der Einkaufsliste, niemals in die Formel der Wandfläche.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'allowances',
      text: 'Zuschläge für Struktur, Absorption und Nachbesserungen',
    },
    {
      type: 'paragraph',
      text: 'Die geometrische Rechnung beschreibt einen idealen Raum mit glatten, versiegelten Wänden und einer Rolle, die nichts verschwendet. Die tatsächliche Arbeit weicht von diesem Ideal in mehrere Richtungen zugleich ab, und ein Zuschlag ist die Art, wie die Schätzung diese Lücke anerkennt.',
    },
    {
      type: 'list',
      items: [
        'Oberflächenstruktur: Knockdown- und Orange-Peel-Strukturen sowie dickflächige Rollen nappe lassen Hohlräume, die zusätzliche Durchgänge verlangen.',
        'Absorption: roher Putz, geschliffener Putz und unversiegelter Beton saugen eine erste Schicht, die nie ganz deckt.',
        'Applikationsverluste: Farbe bleibt in der Wanne, an der Rolle und im Eimer des Schneidens; Kanten und Ecken kommen langsamer voran als freie Wände.',
        'Nachbesserungen: Stöße vom Mobiliar, entfernte Schalterblenden und die Wand hinter der Tür verlangen monate später eine kleine Reserve, wenn die ursprüngliche Charge vielleicht nicht mehr im Regal steht.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Ein Zuschlag von 5 bis 10 % ist eine übliche Planungswahl für gewöhnliche Innenräume; stärkere Struktur oder eine erste Schicht auf rohen Oberflächen können mehr rechtfertigen. Im durchgehenden Beispiel bringt 10 % die Wände von 1,90 auf 2,09 Gallonen — günstige Absicherung gegen eine zweite Fahrt und immer noch weit entfernt vom Verschwendens, das Doppeltes zu kaufen. Wählen Sie die Zahl bewusst und halten Sie sie vom geometrischen Ergebnis getrennt, damit beide Werte sichtbar bleiben.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Häufige Schätzfehler',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Die Bodenfläche als Wandfläche verwenden. Ein 12 × 12-Boden misst 144 ft²; die Wände desselben Raums sind 384 ft² vor Abzügen, fast dreimal so viel.',
        'Zu vergessen, dass Schichten alles multiplizieren. Die Deckung gilt pro Schicht; zwei Schichten verdoppeln die Farbe, nicht die gestrichene Fläche.',
        'Die Deckungszahl der Dose als universell behandeln. Sie beschreibt ein Produkt auf einer definierten Oberfläche; ein anderer Glanz, eine andere Farbe oder eine andere Wand können sie um hundert Quadratfuß oder mehr verschieben.',
        'Türen und Fenster nicht abziehen — oder sie doppelt abziehen, indem auch die Türflächen entfernt werden, die man doch streichen will.',
        'Den Zuschlag überspringen und genau die geometrische Zahl kaufen, dann auf der zweiten Schicht mit einer halben Wand zu kurz kommen.',
        'Einheitensysteme mischen: Liter in eine Gallonenformel oder Quadratmeter in eine Deckung in Quadratfuß.',
        'Die Decke in die Wandfläche einrechnen. Das Ende nähert sich einem ähnlichen Total an, aber die getrennte Menge und das tatsächlich andere Produkt bleiben verborgen.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Häufig gestellte Fragen' },
    {
      type: 'faq',
      items: [
        {
          question: 'Wie viel Farbe brauche ich für einen Raum von 12 ft × 12 ft?',
          answer:
            'Für die Wände etwa 1,9 Gallonen für zwei Schichten bei einer illustrativen Deckung von 350 ft² pro Gallone, nach Abzug einer Tür und zweier Fenster; mit 10 % Zuschlag etwa 2,1 Gallonen. Die Decke fügt etwa eine Gallone hinzu. Ihre Produkt-Dose und Ihre eigenen Öffnungen verschieben diese Werte.',
        },
        {
          question: 'Was ist eine typische Farbdeckung pro Quadratfuß?',
          answer:
            'Glatte, bereits gestrichene Trockenbauwand liegt häufig um 300–350 ft² pro Gallone und Schicht; rohe oder strukturierte Oberflächen darunter. Das sind Planungsbeispiele: Die maßgebliche Zahl ist die auf der Dose gedruckte Deckung des Produkts, das Sie kaufen wollen.',
        },
        {
          question: 'Soll ich Türen und Fenster von der Wandfläche abziehen?',
          answer:
            'Ja, bei jeder Öffnung, die nicht gestrichen wird. Messen Sie die Rahmen (hier im Beispiel etwa 21 ft² für eine Standardtür und 15 ft² für ein gebräuchliches Fenster) und ziehen Sie sie genau einmal ab. Wenn Sie auch die Türflächen streichen, rechnen Sie diese Fläche getrennt anstatt sie abgezogen zu lassen.',
        },
        {
          question: 'Wie viel Farbe brauche ich für zwei Schichten?',
          answer:
            'Verdoppeln Sie die Deckfläche und teilen Sie durch die Deckung. Der Beispielsraum braucht 333 × 2 = 666 ft² Deckfläche, und 666 ÷ 350 = 1,90 Gallonen vor dem Zuschlag.',
        },
        {
          question: 'Soll die Decke in die Wandfläche einbezogen werden?',
          answer:
            'Nein. Messen Sie sie getrennt als Länge × Breite (144 ft² für den Raum von 12 × 12), multiplizieren mit ihrer eigenen Schichtanzahl und addieren zum Einkaufstotal. Decken haben meist einen anderen Glanz und eine andere Menge.',
        },
        {
          question: 'Zählt die Grundierung als eine Farbschicht?',
          answer:
            'Nein. Grundierung ist ein eigenes Produkt mit eigener Deckung und eigener Gebindegröße. Schätzen Sie sie aus derselben Wandfläche, in ihrer eigenen Zeile, und ziehen sie nicht vom Lackierbedarf ab: Die Lackschichten brauchen weiterhin ihre volle Schichtanzahl über der grundierten Oberfläche.',
        },
        {
          question: 'Wie rechne ich Gallonen und Quadratfuß in Liter und Quadratmeter um?',
          answer:
            'Eine US-Gallone sind etwa 3,785 Liter und ein Quadratfuß etwa 0,0929 m². Oder verwenden Sie die metrische Deckung direkt: 333 ft² sind etwa 30,9 m², und bei einer Beispieldeckung von 8,5 m² pro Liter pro Schicht brauchen zwei Schichten 61,8 ÷ 8,5 ≈ 7,3 Liter — nah an den 1,90 Gallonen der imperialen Rechnung, umgerechnet (1,90 × 3,785 ≈ 7,2 Liter). Der kleine Unterschied kommt daher, dass die Beispielsraten keine exakten Umrechnungen voneinander sind.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Farbe für Ihren eigenen Raum berechnen',
    },
    {
      type: 'paragraph',
      text: 'Der obige Durchlauf legt eine Raumgröße fest. Für jede andere Dimension nimmt [der MixTally Farbrechner](/calculators/paint-calculator) Länge, Breite, Wandhöhe, Anzahl der Türen und Fenster, Schichtanzahl und Ihre eigene Deckung auf und meldet in einem einzigen Durchgang Bruttofläche, Abzüge, Nettowandfläche, Deckfläche und den Einkauf in ganzen Gebinden, in Gallonen oder Litern. Das vollständige Verzeichnis der Schätzer liegt im [Rechner-Verzeichnis](/calculators).',
    },
    {
      type: 'calculator-cta',
      view: 'paint-calculator',
      title: 'MixTally Farbrechner',
      body: 'Geben Sie Raummaße, Türen, Fenster, Schichten und Deckung ein, um Wandfläche, Abzüge und Farbmenge in Gallonen oder Litern zu sehen, mit optionalem Einzelpreis für eine Kostenschätzung.',
    },
  ],
};

const paintRoomArticle: ArticleDefinition = {
  slug: 'how-much-paint-do-i-need-for-a-room',
  category: 'paint',
  title: 'How Much Paint Do I Need for a Room? Formula & Examples',
  description:
    'Learn how to calculate paint for a room using wall area, doors and windows, coverage per coat, and number of coats. Includes a worked example.',
  excerpt:
    'The paint quantity formula worked through on a 12 × 12 ft room: wall area, door and window deductions, coverage per coat, ceiling paint and allowances.',
  publishedAt: '2026-10-09',
  readingTimeMinutes: 10,
  image: PAINT_ROOM_HERO_IMAGE,
  ogImage: PAINT_ROOM_HERO_IMAGE,
  featured: false,
  relatedCalculatorViews: ['paint-calculator'],
  relatedArticleSlugs: [],
  blocks: [
    {
      type: 'heading',
      level: 2,
      id: 'why-it-matters',
      text: 'Why accurate paint estimation matters',
    },
    {
      type: 'paragraph',
      text: 'Paint is sold by volume — gallons in the United States, litres almost everywhere else — and every room you paint is a small estimating exercise. Buy too little and the job stops for a second trip; buy far too much and budget sits unopened. A measured estimate turns a store guess into a number you can defend.',
    },
    {
      type: 'paragraph',
      text: 'This article walks through the standard method: measure the room, compute the gross wall area, subtract what will not be painted, divide by the manufacturer\'s coverage, multiply by the number of coats, then add a contingency. The walkthrough uses imperial units and a 12 ft × 12 ft room as the running example; metric builders can follow the same steps with metres and m² per litre. The result is a quantity, not a product specification.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'paint-formula',
      text: 'The basic paint quantity formula',
    },
    {
      type: 'paragraph',
      text: 'Four measurements drive the whole calculation: the room\'s length and width, the wall height, the area of doors and windows you will not paint, and the coverage rate printed on the can. Multiply and divide them in this order:',
    },
    { type: 'formula', expression: 'Perimeter = 2 × (length + width)' },
    { type: 'formula', expression: 'Gross wall area = perimeter × wall height' },
    { type: 'formula', expression: 'Net wall area = gross wall area − doors and windows' },
    {
      type: 'formula',
      expression: 'Paint needed (gallons) = (net wall area × coats) ÷ coverage rate',
    },
    {
      type: 'paragraph',
      text: 'The coverage rate is the manufacturer\'s figure for how many square feet one gallon covers on one coat — a property of that product on a defined surface, not a universal constant. Everything before the division is geometry; everything after it is product behaviour.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Quick answer for a standard room',
      body: 'A 12 ft × 12 ft room with 8 ft walls has 384 sq ft of gross wall area. Deduct one door and two windows (51 sq ft here) and 333 sq ft remains. At an illustrative 350 sq ft per gallon per coat, two coats need 666 coated square feet — 1.90 gallons, or about 2.1 with an optional 10% allowance. Every figure is an example from stated inputs, not a standard for all paints.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'measuring-the-room',
      text: 'Measuring length, width and wall height',
    },
    {
      type: 'paragraph',
      text: 'Three tape measurements are enough: length and width along the floor from wall face to wall face, and wall height from the finished floor to the ceiling line. In older houses, measure twice and use the larger figure where walls are out of parallel.',
    },
    {
      type: 'list',
      items: [
        'Measure at the wall faces rather than along the baseboard, which can stand proud of the drywall.',
        'Take the wall height at a few points; sagging ceilings are rarely uniform.',
        'Note alcoves, chases and built-in shelving separately; each flat wall section is its own rectangle.',
        'Record everything in one unit before any multiplication begins.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'Non-rectangular rooms',
      body: 'An L-shaped room is two rectangles, not a mystery. Measure each leg separately, compute its walls, and add the results. Only the perimeter you walk changes; the arithmetic stays the same.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'wall-area',
      text: 'Calculating the gross wall area',
    },
    {
      type: 'paragraph',
      text: 'The walls of a rectangular room form a band around it. The length of that band is the perimeter, and multiplying it by the wall height gives the gross wall area — before any deductions:',
    },
    { type: 'formula', expression: 'perimeter = 2 × (12 + 12) = 48 ft' },
    { type: 'formula', expression: 'gross wall area = 48 × 8 = 384 sq ft' },
    {
      type: 'paragraph',
      text: 'The same shortcut works for any rectangle. A 10 ft × 10 ft room has a 40 ft perimeter and 320 sq ft of wall at 8 ft height; a 12 ft × 16 ft room has 56 ft and 448 sq ft.',
    },
    {
      type: 'table',
      headers: ['Room (L × W)', 'Perimeter', 'Gross wall area at 8 ft'],
      rows: [
        ['10 ft × 10 ft', '40 ft', '320 sq ft'],
        ['12 ft × 12 ft', '48 ft', '384 sq ft'],
        ['12 ft × 16 ft', '56 ft', '448 sq ft'],
        ['14 ft × 16 ft', '60 ft', '480 sq ft'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Corners consume no paint, so there is no adjustment for them. Ceilings are not part of this figure — they are measured separately, in section 9, because they are usually a different quantity and often a different sheen.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'doors-and-windows',
      text: 'Deducting doors and windows',
    },
    {
      type: 'paragraph',
      text: 'Openings you will not paint subtract from the gross area. Measure the frame of each door and window, not the glass alone. For planning a standard interior door is about 21 sq ft (3 ft × 7 ft) and a common window about 15 sq ft — typical example sizes that the MixTally Paint Calculator uses as overridable defaults. Measure your own openings whenever they differ.',
    },
    {
      type: 'paragraph',
      text: 'The running example has one door and two windows:',
    },
    { type: 'formula', expression: 'deductions = 21 + 2 × 15 = 51 sq ft' },
    { type: 'formula', expression: 'net wall area = 384 − 51 = 333 sq ft' },
    {
      type: 'list',
      items: [
        'Deduct the full frame of doors and windows you will leave untouched.',
        'Do not deduct trim, baseboard or casings you intend to paint — leaving them in the calculation is the conservative choice.',
        'Painting the faces of doors is a separate small takeoff: a standard door face is about 13–15 sq ft each, so two faces add roughly 30 sq ft — about 0.17 gallons over two coats at the example coverage.',
        'Blinds, curtains and wall cabinets cover area too; deduct them only if they stay in place.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'coverage-per-gallon',
      text: 'Understanding paint coverage per square foot',
    },
    {
      type: 'paragraph',
      text: 'Every can states a coverage figure — square feet per gallon or square metres per litre — and that figure is the divisor in the final step of the formula. It describes how far one container spreads over one coat on a correctly prepared surface. It is a specification of that product, not a rule about paint in general: a dense acrylic on smooth drywall and a textured coating on bare plaster can differ widely.',
    },
    {
      type: 'figure',
      src: PAINT_ROLLER_FIGURE.src,
      alt: PAINT_ROLLER_FIGURE.alt,
      caption: 'Rolling a wall in long even passes — where the measured coverage is actually used',
      width: PAINT_ROLLER_FIGURE.width,
      height: PAINT_ROLLER_FIGURE.height,
    },
    {
      type: 'table',
      headers: ['Surface (example)', 'Illustrative coverage per gallon per coat'],
      rows: [
        ['Smooth, previously painted drywall', '300–350 sq ft'],
        ['New or bare drywall', '225–300 sq ft'],
        ['Lightly textured walls', '250–300 sq ft'],
        ['Rough masonry or heavy texture', '150–250 sq ft'],
      ],
    },
    {
      type: 'paragraph',
      text: 'The ranges above are planning examples, not manufacturer data — use them to sense-check your own can. Coverage falls when the surface drinks paint, when texture leaves hollows the roller cannot reach, and when deep colours require extra passes. It rises on sealed, lightly coloured surfaces with a quality roller.',
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Coverage is always per coat',
      body: 'A can that says 350 sq ft is not promising 350 sq ft of finished colour in one pass over an arbitrary wall. It is the rate for one coat on a defined surface. Two coats double the paint, not the covered area.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'multiple-coats',
      text: 'How much paint for two coats (or three)',
    },
    {
      type: 'paragraph',
      text: 'Most finish work is specified at two coats, and the coverage rate applies to each of them. Multiply the net wall area by the number of coats before dividing:',
    },
    { type: 'formula', expression: 'coated area = net wall area × number of coats' },
    { type: 'formula', expression: 'paint needed = coated area ÷ coverage rate' },
    {
      type: 'paragraph',
      text: 'On the running example (333 sq ft net), the coated area is 666 sq ft for two coats and 999 sq ft for three. At the illustrative 350 sq ft per gallon:',
    },
    {
      type: 'table',
      headers: ['Coats', 'Coated area', 'Gallons at 350 sq ft/gal'],
      rows: [
        ['1', '333 sq ft', '0.95'],
        ['2', '666 sq ft', '1.90'],
        ['3', '999 sq ft', '2.85'],
      ],
    },
    {
      type: 'paragraph',
      text: 'First-coat primers do not belong in this multiplication. Primer is a separate product with its own coverage and quantity — the FAQ covers how it interacts with the finish estimate.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'worked-example',
      text: 'Worked example: a 12 × 12 ft room with 8 ft walls',
    },
    {
      type: 'paragraph',
      text: 'The whole method, end to end. The inputs: a square room 12 ft on each side, 8 ft wall height, one standard door, two standard windows, two coats, and an illustrative coverage of 350 sq ft per gallon per coat.',
    },
    { type: 'heading', level: 3, id: 'example-walls', text: 'Step 1: gross wall area' },
    {
      type: 'paragraph',
      text: 'Perimeter = 2 × (12 + 12) = 48 ft, and gross wall area = 48 × 8 = 384 sq ft.',
    },
    { type: 'heading', level: 3, id: 'example-openings', text: 'Step 2: deduct the openings' },
    {
      type: 'paragraph',
      text: 'One door at 21 sq ft and two windows at 15 sq ft each give 21 + 30 = 51 sq ft of deductions, leaving a net wall area of 384 − 51 = 333 sq ft.',
    },
    { type: 'heading', level: 3, id: 'example-gallons', text: 'Step 3: coats and coverage' },
    {
      type: 'paragraph',
      text: 'Two coats cover 333 × 2 = 666 sq ft. Dividing by the example coverage: 666 ÷ 350 = 1.90 gallons.',
    },
    { type: 'heading', level: 3, id: 'example-allowance', text: 'Step 4: optional allowance' },
    {
      type: 'paragraph',
      text: 'Texture, absorption, cutting-in losses and a touch-up reserve are not in the geometric figure. An optional 10% allowance on 1.90 gallons is 1.90 × 1.10 = 2.09 gallons, which rounds to about 2.1 gallons.',
    },
    {
      type: 'table',
      headers: ['Quantity', 'Value'],
      rows: [
        ['Room perimeter', '48 ft'],
        ['Gross wall area', '384 sq ft'],
        ['Door and window deductions', '51 sq ft'],
        ['Net wall area', '333 sq ft'],
        ['Coated area at two coats', '666 sq ft'],
        ['Paint before allowance (350 sq ft/gal)', '1.90 gallons'],
        ['Paint with optional 10% allowance', '≈ 2.1 gallons'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Paint is sold in whole containers, so 1.90 gallons is a two-gallon purchase and 2.1 gallons a three-gallon one if single gallons are all the shelf holds. Larger rooms often cross into five-gallon pails, where the arithmetic simply continues: divide, then round up.',
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'These are worked figures, not standards',
      body: '350 sq ft per gallon, a 21 sq ft door and a 15 sq ft window were the stated inputs here. Your can, your openings and your wall surface will produce different numbers — the method is the constant, not the figures.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'ceiling-paint',
      text: 'Estimating ceiling paint separately',
    },
    {
      type: 'paragraph',
      text: 'Ceilings are flat planes measured in floor area, not perimeter. The ceiling of the same 12 ft × 12 ft room is 12 × 12 = 144 sq ft, and two coats need 288 coated square feet — about 0.82 gallons, realistically a one-gallon purchase.',
    },
    { type: 'formula', expression: 'ceiling area = length × width' },
    {
      type: 'paragraph',
      text: 'Keeping the ceiling on its own line makes the estimate honest: ceilings are usually painted flat while walls carry the finish sheen, and a textured ceiling drinks more paint than a smooth one. Add the ceiling to the walls only when you total the shopping list, never into the wall-area formula.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'allowances',
      text: 'Allowances for texture, absorption and touch-ups',
    },
    {
      type: 'paragraph',
      text: 'The geometric calculation describes an ideal room with smooth, sealed walls and a roller that wastes nothing. Real work departs from that ideal at once in several directions, and an allowance acknowledges the gap.',
    },
    {
      type: 'list',
      items: [
        'Surface texture: knockdown, orange peel and heavy roller naps leave hollows that take extra passes.',
        'Absorption: bare drywall, sanded plaster and raw concrete soak up a first coat that never quite hides.',
        'Application loss: paint stays in the tray, on the roller and in the cut bucket.',
        'Touch-ups: nicks from furniture, removed switch plates and the wall behind a door all call for a small reserve months later, when the original batch may be off the shelf.',
      ],
    },
    {
      type: 'paragraph',
      text: 'A 5–10% allowance is a common planning choice for ordinary interiors; heavier texture or a first coat over bare surfaces can justify more. On the running example, 10% moves the walls from 1.90 to 2.09 gallons — cheap insurance against a second trip. Keep the allowance separate from the geometric result, so both numbers remain visible.',
    },
    {
      type: 'heading',
      level: 2,
      id: 'common-mistakes',
      text: 'Common estimation mistakes',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Using the floor area as the wall area. A 12 × 12 floor is 144 sq ft; the walls of the same room are 384 sq ft before deductions.',
        'Forgetting that coats multiply everything. The coverage rate is per coat; two coats double the paint, not the painted area.',
        'Treating the coverage figure on the can as universal. A different sheen, colour or wall can shift it by a hundred square feet or more.',
        'Not deducting doors and windows — or deducting them twice by also removing door faces you plan to paint.',
        'Skipping the allowance, buying the exact geometric figure, then running short on the second coat.',
        'Mixing unit systems: litres into a gallon formula, or square metres into a square-feet coverage rate.',
        'Folding the ceiling into the wall area. The total looks similar, but it hides the separate quantity you must buy.',
      ],
    },
    { type: 'heading', level: 2, id: 'faq', text: 'Frequently asked questions' },
    {
      type: 'faq',
      items: [
        {
          question: 'How much paint do I need for a 12 × 12 ft room?',
          answer:
            'For the walls, about 1.9 gallons for two coats at an illustrative 350 sq ft per gallon after deducting one door and two windows; roughly 2.1 with a 10% allowance. The ceiling adds about one more gallon. Your can and your own openings will shift these figures.',
        },
        {
          question: 'What is a typical paint coverage per square foot?',
          answer:
            'Smooth, previously painted drywall often falls around 300–350 sq ft per gallon per coat; bare or textured surfaces less. Those are planning examples — the authoritative number is the coverage printed on the can.',
        },
        {
          question: 'Do I deduct doors and windows from the wall area?',
          answer:
            'Yes, for every opening you will not paint. Measure the frames (about 21 sq ft for a standard door, 15 sq ft for a common window here) and subtract them once. If you paint the door faces too, count that area separately.',
        },
        {
          question: 'How much paint do I need for two coats?',
          answer:
            'Double the coated area, then divide by coverage: 333 × 2 = 666 coated sq ft, and 666 ÷ 350 = 1.90 gallons before allowance.',
        },
        {
          question: 'Should the ceiling be included in the wall area?',
          answer:
            'No. Measure it separately as length × width (144 sq ft for the 12 × 12 room), multiply by its own coats, and add it to the shopping total. Ceilings are usually a different sheen and quantity.',
        },
        {
          question: 'Does primer count as a coat of paint?',
          answer:
            'No. Primer is a separate product with its own coverage and container size. Estimate it from the same wall area on its own line; the finish coats still need their full number of coats over it.',
        },
        {
          question: 'How do I convert gallons and square feet to litres and square metres?',
          answer:
            'One US gallon is about 3.785 litres, one square foot about 0.0929 square metres. Or use metric coverage directly: 333 sq ft is about 30.9 m², and at an example 8.5 m² per litre per coat, two coats need 61.8 ÷ 8.5 ≈ 7.3 litres — close to the imperial 1.90 gallons converted (≈ 7.2 litres); the gap is the example rates not being exact conversions.',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      id: 'calculator-cta',
      text: 'Calculate the paint for your own room',
    },
    {
      type: 'paragraph',
      text: 'The walkthrough above fixes one room size. For any other dimensions, [the MixTally Paint Calculator](/calculators/paint-calculator) takes length, width, wall height, door and window counts, coat number and your own coverage rate, then reports gross area, deductions, net area and the whole-container purchase in one pass. The full catalogue lives on the [calculators directory page](/calculators).',
    },
    {
      type: 'calculator-cta',
      view: 'paint-calculator',
      title: 'MixTally Paint Calculator',
      body: 'Enter room dimensions, doors, windows, coats and coverage to see wall area, deductions and paint quantity in gallons or litres, with an optional unit price for a cost estimate.',
    },
  ],
  localized: {
    es: paintRoomEs,
    pt: paintRoomPt,
    fr: paintRoomFr,
    de: paintRoomDe,
  },
};

/** Every published article, in listing order (featured first, then newest). */
export const ARTICLE_REGISTRY: readonly ArticleDefinition[] = Object.freeze([
  concreteVolumeArticle,
  tenByTenSlabArticle,
  paintRoomArticle,
]);

/** Base paths of every article, e.g. `/blog/how-to-calculate-...`. */
export const ARTICLE_BASE_PATHS: readonly string[] = Object.freeze(
  ARTICLE_REGISTRY.map((article) => articleBasePath(article.slug)),
);

/** Canonical English base path for an article slug. */
export function articleBasePath(slug: string): string {
  return `/blog/${slug}`;
}

/** True for any `/blog/<segment>` base path (including unknown slugs). */
export function isArticleBasePath(basePath: string): boolean {
  return basePath.startsWith('/blog/');
}

/** Slug portion of an article base path, or `null` when the path is deeper. */
export function articleSlugFromBasePath(basePath: string): string | null {
  if (!isArticleBasePath(basePath)) return null;
  const slug = basePath.slice('/blog/'.length);
  return slug && !slug.includes('/') ? slug : null;
}

export function getArticleBySlug(slug: string): ArticleDefinition | undefined {
  return ARTICLE_REGISTRY.find((article) => article.slug === slug);
}

/** True when `article` is translated into `locale` (English always is). */
export function hasArticleTranslation(
  article: ArticleDefinition,
  locale: LocaleCode,
): boolean {
  return locale === DEFAULT_LOCALE || article.localized?.[locale as ArticleLocale] !== undefined;
}

/**
 * True when `article` is translated into every non-English locale, i.e. when
 * its five URLs can form a complete reciprocal hreflang cluster. A partial
 * translation set publishes localized URLs without advertising them, rather
 * than pointing hreflang at an alternation that does not exist.
 */
export function hasFullArticleTranslationSet(article: ArticleDefinition): boolean {
  return ARTICLE_LOCALES.every((code) => article.localized?.[code] !== undefined);
}

/**
 * Resolves the content an article should render in `locale`.
 *
 * English (the default) returns the definition untouched, so callers using
 * the default locale keep identity with the registry entry. A localized
 * locale swaps in the matching `localized` translation — title, description,
 * excerpt, blocks, image alt text and (when the translation pins one) the
 * reading time — while every language-invariant field (slug, category, dates,
 * image assets, related references) is inherited from the English definition.
 *
 * Falls back to the English article when a translation is missing, so a
 * partial registry can never render an empty page.
 */
export function resolveArticleForLocale(
  article: ArticleDefinition,
  locale: LocaleCode = DEFAULT_LOCALE,
): ArticleDefinition {
  if (locale === DEFAULT_LOCALE) return article;

  const translation = article.localized?.[locale as ArticleLocale];
  if (!translation) return article;

  return {
    ...article,
    title: translation.title,
    description: translation.description,
    excerpt: translation.excerpt,
    blocks: translation.blocks,
    readingTimeMinutes: translation.readingTimeMinutes ?? article.readingTimeMinutes,
    image: translation.imageAlt ? { ...article.image, alt: translation.imageAlt } : article.image,
    ogImage: translation.ogImageAlt
      ? { ...article.ogImage, alt: translation.ogImageAlt }
      : article.ogImage,
  };
}

/** Every published article rendered in `locale` (English by default). */
export function getArticles(locale: LocaleCode = DEFAULT_LOCALE): readonly ArticleDefinition[] {
  return ARTICLE_REGISTRY.map((article) => resolveArticleForLocale(article, locale));
}

/** The featured article rendered in `locale`, falling back to the first entry. */
export function getFeaturedArticle(
  locale: LocaleCode = DEFAULT_LOCALE,
): ArticleDefinition | undefined {
  const featured = ARTICLE_REGISTRY.find((article) => article.featured) ?? ARTICLE_REGISTRY[0];
  return featured ? resolveArticleForLocale(featured, locale) : undefined;
}

/** Articles in `category` rendered in `locale`; an unknown category lists all. */
export function getArticlesByCategory(
  category: string | null,
  locale: LocaleCode = DEFAULT_LOCALE,
): ArticleDefinition[] {
  const matches =
    !category || !isArticleCategory(category)
      ? ARTICLE_REGISTRY
      : ARTICLE_REGISTRY.filter((article) => article.category === category);
  return matches.map((article) => resolveArticleForLocale(article, locale));
}

/** Related articles for `article`, rendered in `locale`. */
export function getRelatedArticles(
  article: ArticleDefinition,
  locale: LocaleCode = DEFAULT_LOCALE,
): ArticleDefinition[] {
  return article.relatedArticleSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((related): related is ArticleDefinition => Boolean(related))
    .map((related) => resolveArticleForLocale(related, locale));
}

/**
 * Route patterns the router registers for article pages, one per locale:
 * `/blog/:slug`, `/es/blog/:slug`, … English is never prefixed with `/en/`.
 */
export function localizedArticleRoutePatterns(): { path: string; locale: LocaleCode }[] {
  const locales: LocaleCode[] = ['en', ...LOCALIZED_PREFIX_CODES];
  return locales.map((locale) => ({
    path: `${localizePath(locale, '/blog')}/:slug`,
    locale,
  }));
}

/**
 * Localized article URLs: `/es/blog/<slug>`, `/pt/blog/<slug>`, … Every one
 * of them renders the translated article, self-canonicalizes, advertises the
 * full reciprocal hreflang cluster and is published in the sitemap.
 *
 * Kept as an explicit list so the prerenderer can deduplicate them against
 * the sitemap paths and tests can enumerate the localized article set.
 */
export function localizedArticleMirrorPaths(): string[] {
  return ARTICLE_BASE_PATHS.flatMap((basePath) =>
    LOCALIZED_PREFIX_CODES.map((locale) => localizePath(locale, basePath)),
  );
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

/** Ordered H2 anchor ids of a block list — the article's section structure. */
function headingIdsOf(blocks: ArticleBlock[]): string[] {
  return blocks
    .filter((block): block is ArticleHeadingBlock => block.type === 'heading' && block.level === 2)
    .map((block) => block.id);
}

function validateBlock(
  article: ArticleDefinition,
  block: ArticleBlock,
  index: number,
  headingIds: Set<string>,
  errors: string[],
  scope = '',
): void {
  const at = `article "${article.slug}"${scope} block #${index + 1} (${block.type})`;

  switch (block.type) {
    case 'heading': {
      if (!block.id) errors.push(`${at}: heading id is empty`);
      if (headingIds.has(block.id)) errors.push(`${at}: duplicate heading id "${block.id}"`);
      headingIds.add(block.id);
      if (!block.text.trim()) errors.push(`${at}: heading text is empty`);
      break;
    }
    case 'paragraph': {
      if (!block.text.trim()) errors.push(`${at}: paragraph text is empty`);
      break;
    }
    case 'list': {
      if (block.items.length === 0) errors.push(`${at}: list has no items`);
      if (block.items.some((item) => !item.trim())) errors.push(`${at}: list item is empty`);
      break;
    }
    case 'formula': {
      if (!block.expression.trim()) errors.push(`${at}: formula expression is empty`);
      break;
    }
    case 'figure': {
      if (!block.src.startsWith('/')) errors.push(`${at}: figure src must be root-relative`);
      if (!block.alt.trim()) errors.push(`${at}: figure alt is empty`);
      if (!block.caption.trim()) errors.push(`${at}: figure caption is empty`);
      if (block.width <= 0 || block.height <= 0) errors.push(`${at}: invalid figure dimensions`);
      break;
    }
    case 'callout': {
      if (!block.title.trim() || !block.body.trim()) errors.push(`${at}: callout is incomplete`);
      break;
    }
    case 'table': {
      if (block.headers.length === 0) errors.push(`${at}: table has no headers`);
      if (block.rows.length === 0) errors.push(`${at}: table has no rows`);
      for (const row of block.rows) {
        if (row.length !== block.headers.length) {
          errors.push(`${at}: table row width ${row.length} !== ${block.headers.length}`);
        }
      }
      break;
    }
    case 'calculator-cta': {
      if (!(VALID_CALCULATOR_VIEWS as readonly string[]).includes(block.view)) {
        errors.push(`${at}: unknown calculator view "${block.view}"`);
      }
      if (!block.title.trim() || !block.body.trim()) errors.push(`${at}: CTA is incomplete`);
      break;
    }
    case 'faq': {
      if (block.items.length === 0) errors.push(`${at}: FAQ has no items`);
      for (const item of block.items) {
        if (!item.question.trim() || !item.answer.trim()) {
          errors.push(`${at}: FAQ item is incomplete`);
        }
      }
      break;
    }
  }
}

/**
 * Pure registry validation: unique ASCII slugs, valid categories, valid
 * dates, resolvable related references, valid calculator views, well formed
 * blocks and a complete, structurally faithful translation set for every
 * non-English locale. Filesystem existence of image assets is checked by the
 * test suite, which owns a Node file system; this function stays browser-safe.
 */
export function collectArticleRegistryErrors(): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const article of ARTICLE_REGISTRY) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      errors.push(`slug "${article.slug}" is not a lowercase ASCII slug`);
    }
    if (slugs.has(article.slug)) errors.push(`duplicate slug "${article.slug}"`);
    slugs.add(article.slug);

    if (!isArticleCategory(article.category)) {
      errors.push(`article "${article.slug}" has invalid category "${article.category}"`);
    }
    if (!article.title.trim()) errors.push(`article "${article.slug}" has an empty title`);
    if (!article.description.trim()) errors.push(`article "${article.slug}" has an empty description`);
    if (!article.excerpt.trim()) errors.push(`article "${article.slug}" has an empty excerpt`);
    if (!isValidIsoDate(article.publishedAt)) {
      errors.push(`article "${article.slug}" has an invalid publishedAt "${article.publishedAt}"`);
    }
    if (article.updatedAt !== undefined) {
      if (!isValidIsoDate(article.updatedAt)) {
        errors.push(`article "${article.slug}" has an invalid updatedAt "${article.updatedAt}"`);
      } else if (article.updatedAt < article.publishedAt) {
        errors.push(`article "${article.slug}" updatedAt precedes publishedAt`);
      }
    }
    if (!Number.isInteger(article.readingTimeMinutes) || article.readingTimeMinutes <= 0) {
      errors.push(`article "${article.slug}" has an invalid readingTimeMinutes`);
    }
    if (article.blocks.length === 0) errors.push(`article "${article.slug}" has no blocks`);

    for (const [label, image] of [
      ['image', article.image],
      ['ogImage', article.ogImage],
    ] as const) {
      if (!image.src.startsWith('/')) errors.push(`article "${article.slug}" ${label}.src must be root-relative`);
      if (!image.alt.trim()) errors.push(`article "${article.slug}" ${label}.alt is empty`);
      if (image.width <= 0 || image.height <= 0) {
        errors.push(`article "${article.slug}" ${label} has invalid dimensions`);
      }
    }

    const headingIds = new Set<string>();
    article.blocks.forEach((block, index) =>
      validateBlock(article, block, index, headingIds, errors),
    );

    for (const view of article.relatedCalculatorViews) {
      if (!(VALID_CALCULATOR_VIEWS as readonly string[]).includes(view)) {
        errors.push(`article "${article.slug}" references unknown calculator view "${view}"`);
      }
    }
    for (const slug of article.relatedArticleSlugs) {
      if (slug === article.slug) {
        errors.push(`article "${article.slug}" lists itself as related`);
      } else if (!getArticleBySlug(slug)) {
        errors.push(`article "${article.slug}" references unknown article "${slug}"`);
      }
    }

    const englishH2Ids = headingIdsOf(article.blocks);

    // Every non-English locale is mandatory: a partial translation set would
    // publish an incomplete hreflang cluster, which search engines treat as a
    // defect rather than as a partial language version.
    for (const locale of ARTICLE_LOCALES) {
      const scope = ` [${locale}]`;
      const translation = article.localized?.[locale];

      if (!translation) {
        errors.push(`article "${article.slug}"${scope}: missing translation`);
        continue;
      }
      if (!translation.title.trim()) {
        errors.push(`article "${article.slug}"${scope}: has an empty title`);
      }
      if (!translation.description.trim()) {
        errors.push(`article "${article.slug}"${scope}: has an empty description`);
      } else if (translation.description.length > 160) {
        errors.push(`article "${article.slug}"${scope}: description exceeds 160 characters`);
      }
      if (!translation.excerpt.trim()) {
        errors.push(`article "${article.slug}"${scope}: has an empty excerpt`);
      }
      if (translation.blocks.length === 0) {
        errors.push(`article "${article.slug}"${scope}: has no blocks`);
      }
      if (
        translation.readingTimeMinutes !== undefined &&
        (!Number.isInteger(translation.readingTimeMinutes) || translation.readingTimeMinutes <= 0)
      ) {
        errors.push(`article "${article.slug}"${scope}: invalid readingTimeMinutes`);
      }

      const translatedH2Ids = headingIdsOf(translation.blocks);
      if (translatedH2Ids.join(' ') !== englishH2Ids.join(' ')) {
        errors.push(
          `article "${article.slug}"${scope}: H2 section ids [${translatedH2Ids.join(', ')}] do not match the English structure [${englishH2Ids.join(', ')}]`,
        );
      }

      const translatedHeadingIds = new Set<string>();
      translation.blocks.forEach((block, index) =>
        validateBlock(article, block, index, translatedHeadingIds, errors, scope),
      );
    }
  }

  if (ARTICLE_REGISTRY.length > 0 && !ARTICLE_REGISTRY.some((article) => article.featured)) {
    errors.push('no article is marked as featured');
  }

  return errors;
}
