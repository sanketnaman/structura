/**
 * Maps legacy view/tool slugs to their canonical route paths.
 * Used to render crawlable React Router <Link>/<NavLink> targets.
 */
export function viewToPath(view: string): string {
  if (view === 'overview' || view === 'home') return '/';
  if (view === 'calculators') return '/calculators';
  if (view === 'concrete' || view === 'concrete-slab-calculator') {
    return '/calculators/concrete-slab-calculator';
  }
  if (view === 'brick' || view === 'brick-mortar-calculator') {
    return '/calculators/brick-mortar-calculator';
  }
  if (view === 'paint' || view === 'paint-calculator') {
    return '/calculators/paint-calculator';
  }
  return `/${view}`;
}
