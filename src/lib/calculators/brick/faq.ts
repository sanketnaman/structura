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
