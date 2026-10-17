import type { LocaleCode } from '../../i18n/config';

/**
 * Pure mathematical utilities and unit conversion constants
 * Strict decimal stability without floating-point distortion
 */

export function roundTo(value: number, decimals: number = 2): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Imperial <-> Metric Constants
export const METERS_TO_FEET = 3.28084;
export const FEET_TO_METERS = 0.3048;
export const INCHES_TO_CM = 2.54;
export const CM_TO_INCHES = 0.393701;

export const CU_METERS_TO_CU_YARDS = 1.30795062;
export const CU_YARDS_TO_CU_METERS = 0.764554858;
export const CU_METERS_TO_CU_FEET = 35.3146667;
export const CU_FEET_TO_CU_METERS = 0.0283168466;

export const SQ_METERS_TO_SQ_FEET = 10.7639104;
export const SQ_FEET_TO_SQ_METERS = 0.09290304;

export const GALLONS_TO_LITERS = 3.785411784;
export const LITERS_TO_GALLONS = 0.264172052;

/** Intl locale tags used for locale-aware number display. */
const NUMBER_LOCALES: Record<LocaleCode, string> = {
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-BR',
  fr: 'fr-FR',
  de: 'de-DE',
};

/**
 * Format a number for clean architectural display.
 *
 * `locale` selects the Intl tag (comma vs dot decimals, digit grouping);
 * the default keeps English rendering exactly as before. `minDecimals`
 * pins trailing zeros for values shown as exact money/ratios (e.g. 1.10).
 */
export function formatNumber(
  num: number,
  maxDecimals: number = 2,
  locale: LocaleCode = 'en',
  minDecimals: number = 0,
): string {
  if (isNaN(num) || !isFinite(num)) return '0';
  return Number(roundTo(num, maxDecimals)).toLocaleString(NUMBER_LOCALES[locale] ?? 'en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: Math.min(minDecimals, maxDecimals),
  });
}
