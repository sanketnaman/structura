export type ThemeMode = 'dark' | 'light';
export type UnitSystem = 'imperial' | 'metric';

export interface LayoutContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  activeCalculator: 'concrete' | 'brick' | 'paint' | 'overview';
  setActiveCalculator: (calc: 'concrete' | 'brick' | 'paint' | 'overview') => void;
}
