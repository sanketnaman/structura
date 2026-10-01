import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { en, dictionaries, translate, localizePath, type TranslationKey } from '../src/lib/i18n';

const PAGE_KEYS = {
  privacy: [
    'privacy.eyebrow',
    'privacy.title',
    'privacy.meta',
    'privacy.s1Title',
    'privacy.s1Body',
    'privacy.s2Title',
    'privacy.processing1Label',
    'privacy.processing1Body',
    'privacy.processing2Label',
    'privacy.processing2Body',
    'privacy.processing3Label',
    'privacy.processing3Body',
    'privacy.processing4Label',
    'privacy.processing4Body',
    'privacy.s3Title',
    'privacy.ads1',
    'privacy.ads2',
    'privacy.ads3Lead',
    'privacy.ads3Link',
    'privacy.ads3Tail',
    'privacy.s4Title',
    'privacy.s4Body',
    'privacy.s5Title',
    'privacy.s5Body',
    'privacy.s6Title',
    'privacy.contactLead',
    'privacy.contactTail',
  ],
  terms: [
    'terms.eyebrow',
    'terms.title',
    'terms.meta',
    'terms.s1Title',
    'terms.s1Body',
    'terms.s2Title',
    'terms.s2Body1',
    'terms.s2Body2',
    'terms.s3Title',
    'terms.s3Lead',
    'terms.s3Item1',
    'terms.s3Item2',
    'terms.s3Item3',
    'terms.s4Title',
    'terms.s4Body',
    'terms.s5Title',
    'terms.s5Body',
    'terms.s6Title',
    'terms.contactLead',
    'terms.contactTail',
  ],
  disclaimer: [
    'disclaimer.eyebrow',
    'disclaimer.title',
    'disclaimer.meta',
    'disclaimer.noticeTitle',
    'disclaimer.noticeLead',
    'disclaimer.noticeStrong',
    'disclaimer.noticeTail',
    'disclaimer.s1Title',
    'disclaimer.card1Title',
    'disclaimer.card1Body',
    'disclaimer.card2Title',
    'disclaimer.card2Body',
    'disclaimer.card3Title',
    'disclaimer.card3Body',
    'disclaimer.card4Title',
    'disclaimer.card4Body',
    'disclaimer.s2Title',
    'disclaimer.s2Lead',
    'disclaimer.var1Label',
    'disclaimer.var1Body',
    'disclaimer.var2Label',
    'disclaimer.var2Body',
    'disclaimer.var3Label',
    'disclaimer.var3Body',
    'disclaimer.var4Label',
    'disclaimer.var4Body',
    'disclaimer.var5Label',
    'disclaimer.var5Body',
    'disclaimer.s3Title',
    'disclaimer.s3Body',
  ],
  cookiePolicy: [
    'cookiePolicy.eyebrow',
    'cookiePolicy.title',
    'cookiePolicy.meta',
    'cookiePolicy.s1Title',
    'cookiePolicy.s1Body',
    'cookiePolicy.s2Title',
    'cookiePolicy.s2LeadA',
    'cookiePolicy.s2Code',
    'cookiePolicy.s2LeadB',
    'cookiePolicy.essential',
    'cookiePolicy.unitTitle',
    'cookiePolicy.unitBody',
    'cookiePolicy.themeTitle',
    'cookiePolicy.themeBody',
    'cookiePolicy.consentTitle',
    'cookiePolicy.consentBody',
    'cookiePolicy.s3Title',
    'cookiePolicy.s3Body',
    'cookiePolicy.s4Title',
    'cookiePolicy.s4Body',
  ],
  advertising: [
    'advertising.eyebrow',
    'advertising.title',
    'advertising.meta',
    'advertising.s1Title',
    'advertising.s1Body',
    'advertising.s2Title',
    'advertising.s2Lead',
    'advertising.p1Label',
    'advertising.p1Body',
    'advertising.p2Label',
    'advertising.p2Body',
    'advertising.p3Label',
    'advertising.p3Body',
    'advertising.p4Label',
    'advertising.p4Body',
    'advertising.s3Title',
    'advertising.s3Lead',
    'advertising.s3Link',
    'advertising.s3Tail',
  ],
} as const;

const COMPONENT_FILE = {
  privacy: 'PrivacyPage.tsx',
  terms: 'TermsPage.tsx',
  disclaimer: 'DisclaimerPage.tsx',
  cookiePolicy: 'CookiePolicyPage.tsx',
  advertising: 'AdvertisingDisclosurePage.tsx',
} as const;

const ROUTE_PATH = {
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  cookiePolicy: '/cookie-policy',
  advertising: '/advertising',
} as const;

const LOCALIZED_ROUTES = [
  { code: 'en', path: '/' },
  { code: 'es', path: '/es' },
  { code: 'pt', path: '/pt' },
  { code: 'fr', path: '/fr' },
  { code: 'de', path: '/de' },
] as const;

const NON_ENGLISH_EXCEPTIONS = new Set([
  'privacy.contactTail',
  'terms.contactTail',
  'terms.s6Title',
  'cookiePolicy.s2Code',
]);

const allLegalKeys = (Object.keys(PAGE_KEYS) as (keyof typeof PAGE_KEYS)[]).flatMap(
  (page) => [...PAGE_KEYS[page]],
);

describe('Legal page dictionary keys', () => {
  it('defines exactly the inventoried legal keys in English', () => {
    const prefixes = ['privacy.', 'terms.', 'disclaimer.', 'cookiePolicy.', 'advertising.'];
    const actual = Object.keys(en).filter((key) => prefixes.some((p) => key.startsWith(p)));
    expect(actual).toHaveLength(116);
    expect(new Set(actual)).toEqual(new Set(allLegalKeys));
  });

  it('renders every legal key through t() in its component', () => {
    for (const [page, keys] of Object.entries(PAGE_KEYS)) {
      const file = COMPONENT_FILE[page as keyof typeof COMPONENT_FILE];
      const source = readFileSync(join('src', 'components', 'legal', file), 'utf8');
      for (const key of keys) {
        expect(source, `${file} must call t('${key}')`).toContain(`t('${key}')`);
      }
    }
  });
});

describe('English legal copy stays byte-identical', () => {
  it('pins headings, dates, and whitespace-sensitive fragments', () => {
    const pins: Record<string, string> = {
      'privacy.eyebrow': 'Privacy & Data Protection',
      'privacy.title': 'Privacy Policy',
      'privacy.meta': 'Effective Date: September 2026 · Transparent data handling practices',
      'privacy.s1Body':
        'MixTally ("we", "our", or "the Platform") respects your privacy. This Privacy Policy discloses what information is processed when you visit our website, utilize our interactive calculators, or communicate with us.',
      'privacy.processing1Label': 'Calculator Dimensions & Parameters:',
      'privacy.ads3Lead': "Users may opt out of personalized advertising by visiting Google's ",
      'privacy.ads3Tail': ' or by utilizing our on-site Consent Preferences banner.',
      'privacy.contactLead':
        'For privacy inquiries or data rights requests, please contact our privacy compliance team via email at ',
      'privacy.contactTail': '.',
      'terms.eyebrow': 'Terms of Service',
      'terms.title': 'Terms of Use',
      'terms.meta': 'Last revised: September 2026 · Agreement between user and platform',
      'terms.s1Body':
        'By accessing or using MixTally, you agree to be bound by these Terms of Use and our Construction Disclaimer. If you disagree with any portion of these terms, your sole remedy is to cease using the platform.',
      'terms.s4Body':
        'To the maximum extent permitted by applicable law, MixTally, its creators, and contributors shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages—including but not limited to material shortages, overages, contractor delays, demolition costs, structural defects, or lost profits—arising out of or in connection with the use of this website.',
      'terms.contactLead': 'For legal inquiries, contact ',
      'terms.contactTail': '.',
      'disclaimer.eyebrow': 'Construction Engineering & Usage Notice',
      'disclaimer.title': 'Construction Disclaimer & Limitations of Estimates',
      'disclaimer.meta': 'Last revised: September 2026 · Transparent estimation guidelines',
      'disclaimer.noticeLead':
        'MixTally provides mathematical quantity and material estimates created solely for preliminary planning, purchasing logistics, and budgetary coordination. MixTally does ',
      'disclaimer.noticeStrong': 'not',
      'disclaimer.noticeTail':
        ' provide licensed structural engineering, certified architectural specifications, stamped drawings, geotechnical foundation analysis, or building-code compliance certifications.',
      'disclaimer.s3Body':
        'The user assumes full responsibility for independently verifying all measurements on the physical job site prior to placing orders with suppliers or pouring concrete. Always consult a licensed professional engineer (PE), registered architect, or licensed building contractor for safety-critical and load-bearing decisions.',
      'cookiePolicy.eyebrow': 'Storage & Tracking Technologies',
      'cookiePolicy.title': 'Cookie & Local Storage Policy',
      'cookiePolicy.meta': 'Last revised: September 2026 · Technical transparency',
      'cookiePolicy.s1Body':
        "Cookies and HTML5 local storage are standard web technologies that store small strings of text or configuration values inside your device's browser. They allow web applications to remember your selected preferences across page reloads and browsing sessions.",
      'cookiePolicy.s2LeadA':
        'Unlike heavy multi-tenant platforms, MixTally operates primarily client-side. We utilize browser ',
      'cookiePolicy.s2Code': 'localStorage',
      'cookiePolicy.s2LeadB': ' for the following essential operational purposes:',
      'advertising.eyebrow': 'Transparency & Monetization',
      'advertising.title': 'Advertising Disclosure',
      'advertising.meta': 'Last updated: September 2026 · Transparent funding model',
      'advertising.s1Body':
        'MixTally provides professional-grade 3D construction calculators, material takeoffs, and engineering reference tools free of charge to contractors, architects, students, and homebuilders worldwide. To offset ongoing cloud hosting, GPU WebGL rendering bandwidth, and domain infrastructure expenses, MixTally may display advertisements served by third-party advertising partners, such as Google AdSense.',
      'advertising.s3Lead':
        "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other sites. You may review your ad personalization preferences or opt out of personalized advertising by visiting Google's official ",
      'advertising.s3Link': 'My Ad Center',
      'advertising.s3Tail': '.',
    };
    for (const [key, value] of Object.entries(pins)) {
      expect(en[key as TranslationKey], key).toBe(value);
    }
  });
});

describe('Full localized coverage of legal copy', () => {
  it('translates every legal key into es/pt/fr/de without English fallback', () => {
    for (const code of ['es', 'pt', 'fr', 'de'] as const) {
      const dict = dictionaries[code];
      for (const key of allLegalKeys) {
        const value = dict[key as TranslationKey];
        expect(value, `${code}.${key}`).toBeTypeOf('string');
        expect(value?.length, `${code}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('provides genuinely localized body text, not copies of English', () => {
    for (const code of ['es', 'pt', 'fr', 'de'] as const) {
      const dict = dictionaries[code];
      for (const key of allLegalKeys) {
        if (NON_ENGLISH_EXCEPTIONS.has(key)) continue;
        expect(dict[key as TranslationKey], `${code}.${key}`).not.toBe(en[key as TranslationKey]);
      }
    }
  });

  it('keeps numbered section structure in every locale', () => {
    const numbered = allLegalKeys.filter((key) => /\.(s\d+Title)$/.test(key));
    expect(numbered.length).toBeGreaterThan(20);
    for (const key of numbered) {
      for (const code of ['es', 'pt', 'fr', 'de'] as const) {
        expect(
          translate(code, key as TranslationKey),
          `${code}.${key}`,
        ).toMatch(/^\d+\.\s/);
      }
    }
  });
});

describe('Localized body content on all 20 localized legal routes', () => {
  it('returns localized, non-empty body text for every locale and page', () => {
    for (const route of LOCALIZED_ROUTES) {
      for (const [page, keys] of Object.entries(PAGE_KEYS)) {
        expect(ROUTE_PATH[page as keyof typeof ROUTE_PATH]).toMatch(/^\//);
        for (const key of keys) {
          const value = translate(route.code, key as TranslationKey);
          expect(value.length, `${route.code} ${page} ${key}`).toBeGreaterThan(0);
          if (route.code !== 'en' && !NON_ENGLISH_EXCEPTIONS.has(key)) {
            expect(value, `${route.code} ${page} ${key}`).not.toBe(
              en[key as TranslationKey],
            );
          }
        }
      }
    }
  });

  it('maps the five legal pages onto twenty distinct localized routes', () => {
    const paths = new Set<string>();
    for (const route of LOCALIZED_ROUTES) {
      for (const pagePath of Object.values(ROUTE_PATH)) {
        paths.add(localizePath(route.code, pagePath));
      }
    }
    expect(paths.size).toBe(25);
    const localized = [...paths].filter((path) => /^\/(es|pt|fr|de)(\/|$)/.test(path));
    expect(localized).toHaveLength(20);
    expect(localized.some((path) => path.includes('/en/'))).toBe(false);
  });
});
