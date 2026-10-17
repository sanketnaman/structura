import type { TranslationKey } from '../../i18n/dictionaries';

/**
 * Dictionary keys for the brick calculator FAQ. The visible FAQ section
 * (BrickCalculatorWorkspace) and the FAQPage JSON-LD (structuredData) both
 * resolve these keys through `translate`, so every locale renders the
 * same localized question/answer pair in the page body and the schema.
 */
export const BRICK_FAQ_QUESTION_KEYS = [
  'brick.faqQ1',
  'brick.faqQ2',
  'brick.faqQ3',
  'brick.faqQ4',
  'brick.faqQ5',
  'brick.faqQ6',
  'brick.faqQ7',
  'brick.faqQ8',
] as const satisfies readonly TranslationKey[];

export const BRICK_FAQ_ANSWER_KEYS = [
  'brick.faqA1',
  'brick.faqA2',
  'brick.faqA3',
  'brick.faqA4',
  'brick.faqA5',
  'brick.faqA6',
  'brick.faqA7',
  'brick.faqA8',
] as const satisfies readonly TranslationKey[];

/**
 * Metric-native overrides applied outside English (locale rule, same as the
 * concrete guide examples): index → replacement keys for the FAQ entry at
 * that position. Entries without a metric variant fall through to the base
 * keys because their wording is already unit-neutral (percentages, wythe
 * counts, supported sizes). The visible FAQ and the FAQPage JSON-LD both
 * consult this map so the schema always matches the rendered content.
 */
export const BRICK_FAQ_METRIC_OVERRIDES: Readonly<
  Record<number, { question?: TranslationKey; answer?: TranslationKey }>
> = {
  1: { question: 'brick.faqQ2Metric', answer: 'brick.faqA2Metric' },
  3: { answer: 'brick.faqA4Metric' },
};
