import { LOCALIZED_PREFIX_CODES, type LocaleCode } from '../i18n/config';
import { localizePath } from '../i18n/routing';
import { ARTICLE_CATEGORIES, isArticleCategory, type ArticleDefinition, type ArticleBlock } from './types';

/**
 * The single blog article registry.
 *
 * Mirrors the conventions of `src/lib/tools/registry.ts`: plain typed data,
 * no React, no browser globals, safe to import from the SSR bundle, the
 * prerender pipeline, the sitemap generator and tests alike.
 *
 * Adding an article = appending one entry here. Routes, listing cards, SEO
 * metadata, JSON-LD, sitemap entries and prerendered documents are all
 * derived from this list.
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
};

const tenByTenSlabArticle: ArticleDefinition = {
  slug: 'how-much-concrete-do-i-need-for-a-10x10-slab',
  category: 'concrete',
  title: 'How Much Concrete Do I Need for a 10×10 Slab?',
  description:
    'A 10×10 slab needs 1.23 cubic yards at 4 inches and 1.85 at 6 inches. See the full calculation, bag counts, waste allowance and delivery options.',
  excerpt:
    'Exact volume for a 10 ft × 10 ft slab at 4 and 6 inches, the bag counts that follow from it, and how much extra to order for site conditions.',
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
      text: 'How much concrete does a 10 ft × 10 ft slab need?',
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
};

/** Every published article, in listing order (featured first, then newest). */
export const ARTICLE_REGISTRY: readonly ArticleDefinition[] = Object.freeze([
  concreteVolumeArticle,
  tenByTenSlabArticle,
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

export function getArticles(): readonly ArticleDefinition[] {
  return ARTICLE_REGISTRY;
}

export function getFeaturedArticle(): ArticleDefinition | undefined {
  return ARTICLE_REGISTRY.find((article) => article.featured) ?? ARTICLE_REGISTRY[0];
}

export function getArticlesByCategory(category: string | null): ArticleDefinition[] {
  if (!category || !isArticleCategory(category)) return [...ARTICLE_REGISTRY];
  return ARTICLE_REGISTRY.filter((article) => article.category === category);
}

export function getRelatedArticles(article: ArticleDefinition): ArticleDefinition[] {
  return article.relatedArticleSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((related): related is ArticleDefinition => Boolean(related));
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
 * Localized mirrors of every article. Article bodies are English-only, so
 * these URLs are rendered for navigation continuity but canonicalize back to
 * the English article and never advertise hreflang alternates. They are
 * prerendered (so they are never 404s) yet deliberately excluded from the
 * sitemap, which lists canonical URLs only.
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

function validateBlock(
  article: ArticleDefinition,
  block: ArticleBlock,
  index: number,
  headingIds: Set<string>,
  errors: string[],
): void {
  const at = `article "${article.slug}" block #${index + 1} (${block.type})`;

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
 * dates, resolvable related references, valid calculator views and well
 * formed blocks. Filesystem existence of image assets is checked by the test
 * suite, which owns a Node file system; this function stays browser-safe.
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
  }

  if (ARTICLE_REGISTRY.length > 0 && !ARTICLE_REGISTRY.some((article) => article.featured)) {
    errors.push('no article is marked as featured');
  }

  return errors;
}
