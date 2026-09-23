import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Architectural Charcoal & Deep Graphite Foundation
        charcoal: {
          950: '#090C0F', // Deepest canvas
          900: '#0E1318', // Primary dark background
          850: '#141A21', // Card & panel surface
          800: '#1B222B', // Hover surface / elevated container
          750: '#232C37', // Hairline borders in dark
          700: '#2F3A48', // Dividers and subtle edges
          600: '#465466', // Muted secondary text
        },
        // Architectural Drafting Paper & Warm Neutrals
        paper: {
          50: '#FDFDFC',  // Pristine vellum canvas
          100: '#F7F7F4', // Warm architectural card background
          200: '#EFEFEA', // Border / subtle inset
          300: '#E2E2DC', // Hairline borders in light
          400: '#C8C8BE', // Subtle drafting guidelines
          500: '#8A8A80', // Drafting notes / muted text
        },
        // Construction & Engineering Slate
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        // Single Engineering Accent: High-Visibility Construction Cadmium Amber
        accent: {
          DEFAULT: '#D97706', // Primary focus / callout / active state
          hover: '#B45309',   // Interactive hover state
          muted: '#F59E0B',   // High-contrast badge / alert
          subtle: 'rgba(217, 119, 6, 0.12)', // Subtle highlight background
          glow: 'rgba(217, 119, 6, 0.25)',   // Focus ring
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'micro': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
        'caption': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.375rem' }],
        'body': ['0.9375rem', { lineHeight: '1.5rem' }],
        'heading-sm': ['1.0625rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        'heading-md': ['1.25rem', { lineHeight: '1.625rem', letterSpacing: '-0.015em' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.875rem', letterSpacing: '-0.02em' }],
        'display': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.025em' }],
        'display-lg': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        'tech-sm': '4px',
        'tech': '6px',
        'tech-md': '8px',
        'tech-lg': '12px',
      },
      boxShadow: {
        'tech-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'tech-card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'tech-elevated': '0 8px 24px -4px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;
