import { useCallback } from 'react';
import { useLocale } from './context';
import type { TranslationKey } from './dictionaries';

/**
 * Dictionary keys exist for the fields of implemented tools (see
 * `tool.<slug>.*` in dictionaries.ts). Planned tools keep their English
 * registry text until they ship, so lookups return `undefined` for slugs
 * without keys and the caller falls back to the registry value.
 */
export type ToolField =
  | 'name'
  | 'shortName'
  | 'categoryLabel'
  | 'description'
  | 'tagline'
  | 'imageAlt';

const IMPLEMENTED_SLUGS = [
  'concrete-slab-calculator',
  'brick-mortar-calculator',
  'paint-calculator',
] as const;

export type ImplementedSlug = (typeof IMPLEMENTED_SLUGS)[number];

export function isImplementedSlug(slug: string): slug is ImplementedSlug {
  return (IMPLEMENTED_SLUGS as readonly string[]).includes(slug);
}

export function toolKey(slug: string, field: ToolField): TranslationKey | undefined {
  if (!isImplementedSlug(slug)) return undefined;
  return `tool.${slug}.${field}` as TranslationKey;
}

export function categoryKey(
  id: string,
  field: 'label' | 'description',
): TranslationKey {
  return `category.${id}.${field}` as TranslationKey;
}

/**
 * Resolves registry text for the active locale: translated when a key
 * exists, otherwise the English registry value passed as `fallback`.
 */
export function useToolText(): (slug: string, field: ToolField, fallback: string) => string {
  const { t } = useLocale();
  return useCallback(
    (slug: string, field: ToolField, fallback: string) => {
      const key = toolKey(slug, field);
      return key ? t(key) : fallback;
    },
    [t],
  );
}
