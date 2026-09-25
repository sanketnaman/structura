export type CalculatorCategory =
  | 'concrete-masonry'
  | 'surfaces-finishes'
  | 'landscaping-aggregates'
  | 'structural-framing'
  | 'cost-estimation';

export interface ToolDefinition {
  slug: string;
  name: string;
  shortName: string;
  category: CalculatorCategory;
  categoryLabel: string;
  description: string;
  tagline: string;
  iconName: 'Box' | 'Layers' | 'PaintBucket' | 'Maximize2' | 'DollarSign' | 'Columns' | 'Grid';
  implemented: boolean;
  phase: 1 | 2 | 3;
  visualizationType: '3d-slab' | '3d-wall' | '3d-room' | '3d-footing' | '3d-column' | 'none';
  image?: string;
  imageAlt?: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  relatedToolSlugs: string[];
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  // Phase 1 - Fully Implemented MVP Tools
  {
    slug: 'concrete-slab-calculator',
    name: 'Concrete Slab Calculator',
    shortName: 'Concrete Slab',
    category: 'concrete-masonry',
    categoryLabel: 'Concrete & Masonry',
    description: 'Calculate concrete volume, material quantities, and planning allowances with an interactive 3D parametric slab inspector.',
    tagline: 'Volumetric takeoff with interactive 3D dimensional visualization.',
    iconName: 'Box',
    implemented: true,
    phase: 1,
    visualizationType: '3d-slab',
    image: '/images/calculators/concrete-slab-calculator.webp',
    imageAlt: 'Reinforcing steel grid and timber formwork prepared for a concrete slab pour',
    keywords: ['concrete slab calculator', 'concrete volume', 'cubic yards concrete', 'concrete bags', 'patio slab', 'driveway concrete'],
    seoTitle: 'Concrete Slab Calculator — 3D Volumetric Takeoff & Yards Estimator',
    seoDescription: 'Calculate concrete volume in cubic yards, cubic feet, and 80lb/60lb bags. Real-time 3D parametric slab visualization with trade waste allowance.',
    relatedToolSlugs: ['brick-mortar-calculator', 'concrete-footing-calculator', 'concrete-cost-calculator', 'gravel-calculator'],
  },
  {
    slug: 'brick-mortar-calculator',
    name: 'Brick & Mortar Calculator',
    shortName: 'Brick Masonry',
    category: 'concrete-masonry',
    categoryLabel: 'Concrete & Masonry',
    description: 'Calculate modular facing bricks, wall face square footage, bed joint mortar allowances, and Type N mortar bags with dynamic 3D coursing.',
    tagline: 'Parametric 3D masonry coursing and mortar takeoff.',
    iconName: 'Layers',
    implemented: true,
    phase: 1,
    visualizationType: '3d-wall',
    image: '/images/calculators/brick-mortar-calculator.webp',
    imageAlt: 'Close-up of a red brick wall showing mortar joints between units',
    keywords: ['brick calculator', 'brick mortar calculator', 'bricks per square foot', 'mortar bags', 'brick wall estimator', 'masonry takeoff'],
    seoTitle: 'Brick & Mortar Calculator — 3D Masonry Wall & Brick Unit Estimator',
    seoDescription: 'Calculate brick quantities, Type N mortar bags, and wall area with interactive 3D coursing. Supports custom brick dimensions and wythe depths.',
    relatedToolSlugs: ['concrete-slab-calculator', 'tile-calculator', 'material-cost-calculator'],
  },
  {
    slug: 'paint-calculator',
    name: 'Architectural Paint Calculator',
    shortName: 'Paint & Coatings',
    category: 'surfaces-finishes',
    categoryLabel: 'Surfaces & Finishes',
    description: 'Calculate paint gallons and commercial 5-gallon pails with door and window deductions, multi-coat coverage, and a 3D cutaway room view.',
    tagline: 'Net wall surface takeoff with architectural opening deductions.',
    iconName: 'PaintBucket',
    implemented: true,
    phase: 1,
    visualizationType: '3d-room',
    image: '/images/calculators/interior-paint-calculator.webp',
    imageAlt: 'Paint brushes and a roller resting in a paint tray',
    keywords: ['paint calculator', 'room paint estimator', 'wall paint gallons', 'drywall coverage', 'paint coats', 'interior paint takeoff'],
    seoTitle: 'Architectural Paint Calculator — 3D Cutaway Room & Gallon Estimator',
    seoDescription: 'Calculate paint coverage in gallons and 5-gal pails with door/window deductions and multi-coat planning. Interactive 3D room visualization.',
    relatedToolSlugs: ['brick-mortar-calculator', 'room-area-calculator', 'wallpaper-calculator'],
  },

  // Phase 2 - Planned Roadmap Tools
  {
    slug: 'concrete-footing-calculator',
    name: 'Concrete Footing Calculator',
    shortName: 'Footings',
    category: 'concrete-masonry',
    categoryLabel: 'Concrete & Masonry',
    description: 'Calculate continuous trench footings and spread pads with volumetric excavations and rebar cage spacing.',
    tagline: 'Continuous trench and spread footing volume takeoff.',
    iconName: 'Box',
    implemented: false,
    phase: 2,
    visualizationType: '3d-footing',
    keywords: ['concrete footing calculator', 'foundation trench volume', 'spread footing'],
    seoTitle: 'Concrete Footing Calculator — Foundation Trench Takeoff',
    seoDescription: 'Calculate continuous trench footing and spread pad concrete volumes with subgrade allowances.',
    relatedToolSlugs: ['concrete-slab-calculator', 'concrete-column-calculator'],
  },
  {
    slug: 'concrete-column-calculator',
    name: 'Concrete Column & Pier Calculator',
    shortName: 'Columns & Piers',
    category: 'concrete-masonry',
    categoryLabel: 'Concrete & Masonry',
    description: 'Calculate cylindrical Sonotube piers and square structural concrete column volumes.',
    tagline: 'Cylindrical pier and structural column volume estimation.',
    iconName: 'Columns',
    implemented: false,
    phase: 2,
    visualizationType: '3d-column',
    keywords: ['sonotube calculator', 'concrete pier calculator', 'concrete column volume'],
    seoTitle: 'Concrete Column & Pier Calculator — Sonotube Takeoff',
    seoDescription: 'Calculate volume and bag counts for round piers and square columns.',
    relatedToolSlugs: ['concrete-slab-calculator', 'concrete-footing-calculator'],
  },
  {
    slug: 'tile-calculator',
    name: 'Tile & Grout Calculator',
    shortName: 'Tile & Grout',
    category: 'surfaces-finishes',
    categoryLabel: 'Surfaces & Finishes',
    description: 'Estimate floor and wall tile box counts, diagonal cut waste margins, and thinset mortar coverage.',
    tagline: 'Surface tile layout, cut margins, and grout bag estimates.',
    iconName: 'Grid',
    implemented: false,
    phase: 2,
    visualizationType: 'none',
    keywords: ['tile calculator', 'grout calculator', 'floor tile estimator'],
    seoTitle: 'Tile & Grout Calculator — Surface Takeoff & Box Estimator',
    seoDescription: 'Calculate tile box requirements, diagonal cut waste, and grout poundage.',
    relatedToolSlugs: ['paint-calculator', 'flooring-calculator'],
  },
  {
    slug: 'flooring-calculator',
    name: 'Hardwood & LVP Flooring Calculator',
    shortName: 'Flooring',
    category: 'surfaces-finishes',
    categoryLabel: 'Surfaces & Finishes',
    description: 'Compute square footage, plank carton quantities, and staggering waste for hardwood, laminate, and LVP floors.',
    tagline: 'Room flooring square footage and carton takeoff.',
    iconName: 'Grid',
    implemented: false,
    phase: 2,
    visualizationType: 'none',
    keywords: ['flooring calculator', 'hardwood flooring estimator', 'lvp square footage'],
    seoTitle: 'Hardwood & LVP Flooring Calculator — Carton Estimator',
    seoDescription: 'Estimate room square footage and flooring cartons with staggering waste.',
    relatedToolSlugs: ['tile-calculator', 'room-area-calculator'],
  },
  {
    slug: 'room-area-calculator',
    name: 'Room Area & Perimeter Calculator',
    shortName: 'Room Area',
    category: 'surfaces-finishes',
    categoryLabel: 'Surfaces & Finishes',
    description: 'Accurately calculate complex floor plans, ceiling areas, and perimeter baseboard lengths.',
    tagline: 'Multi-room area and baseboard perimeter calculation.',
    iconName: 'Maximize2',
    implemented: false,
    phase: 2,
    visualizationType: 'none',
    keywords: ['room area calculator', 'square footage calculator', 'perimeter calculator'],
    seoTitle: 'Room Area & Perimeter Calculator — Floor Plan Estimator',
    seoDescription: 'Calculate total room floor area, ceiling area, and wall perimeter lengths.',
    relatedToolSlugs: ['paint-calculator', 'flooring-calculator'],
  },

  // Phase 3 - Aggregates & Cost
  {
    slug: 'gravel-calculator',
    name: 'Gravel & Crushed Stone Calculator',
    shortName: 'Gravel & Stone',
    category: 'landscaping-aggregates',
    categoryLabel: 'Landscaping & Aggregates',
    description: 'Calculate tons and cubic yards of compacted road base, #57 crushed stone, and pea gravel.',
    tagline: 'Aggregates, road base compaction, and tonnage takeoff.',
    iconName: 'Box',
    implemented: false,
    phase: 3,
    visualizationType: 'none',
    keywords: ['gravel calculator', 'crushed stone tons', 'gravel driveway volume'],
    seoTitle: 'Gravel & Crushed Stone Calculator — Tons & Yards Estimator',
    seoDescription: 'Estimate gravel tonnage and cubic yards with compaction density factors.',
    relatedToolSlugs: ['concrete-slab-calculator', 'mulch-calculator'],
  },
  {
    slug: 'mulch-calculator',
    name: 'Mulch & Topsoil Calculator',
    shortName: 'Mulch & Soil',
    category: 'landscaping-aggregates',
    categoryLabel: 'Landscaping & Aggregates',
    description: 'Estimate landscape mulch, compost, and screened topsoil cubic yards and 2 cu ft bag requirements.',
    tagline: 'Landscape bed coverage and organic material takeoff.',
    iconName: 'Layers',
    implemented: false,
    phase: 3,
    visualizationType: 'none',
    keywords: ['mulch calculator', 'topsoil calculator', 'landscape cubic yards'],
    seoTitle: 'Mulch & Topsoil Calculator — Landscape Bed Estimator',
    seoDescription: 'Calculate cubic yards and 2 cu ft bag counts for mulch and topsoil beds.',
    relatedToolSlugs: ['gravel-calculator'],
  },
  {
    slug: 'concrete-cost-calculator',
    name: 'Concrete Cost Calculator',
    shortName: 'Concrete Cost',
    category: 'cost-estimation',
    categoryLabel: 'Cost Estimation',
    description: 'Detailed financial estimator covering delivered ready-mix, pump truck rentals, rebar reinforcement, and formwork lumber.',
    tagline: 'Comprehensive budget breakdown for poured concrete projects.',
    iconName: 'DollarSign',
    implemented: false,
    phase: 3,
    visualizationType: 'none',
    keywords: ['concrete cost calculator', 'cost to pour concrete', 'ready mix concrete price'],
    seoTitle: 'Concrete Cost Calculator — Complete Pour Budget Estimator',
    seoDescription: 'Estimate total concrete costs including ready-mix, short-load fees, pump trucks, and rebar.',
    relatedToolSlugs: ['concrete-slab-calculator', 'concrete-footing-calculator'],
  },
];

export const CATEGORIES: { id: CalculatorCategory; label: string; description: string }[] = [
  {
    id: 'concrete-masonry',
    label: 'Concrete & Masonry',
    description: 'Poured slabs, structural footings, Sonotube piers, and modular facing brick takeoffs.',
  },
  {
    id: 'surfaces-finishes',
    label: 'Surfaces & Finishes',
    description: 'Architectural paint coatings, room areas, drywall, tile, and plank flooring estimators.',
  },
  {
    id: 'landscaping-aggregates',
    label: 'Landscaping & Aggregates',
    description: 'Compacted gravel subgrades, crushed stone tonnage, mulch, and screened topsoil volumes.',
  },
  {
    id: 'cost-estimation',
    label: 'Cost & Project Estimation',
    description: 'Itemized material pricing, supplier quote comparison, and project takeoff budgets.',
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((t) => t.slug === slug);
}

export function getRelatedTools(toolSlug: string): ToolDefinition[] {
  const tool = getToolBySlug(toolSlug);
  if (!tool) return [];
  return tool.relatedToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t));
}
