/**
 * Design Token System — venService Enterprise
 * Single source of truth for all visual primitives.
 * These tokens feed into Tailwind config, CSS variables, and component variants.
 */

export const colors = {
  // Brand palette
  brand: {
    50:  '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Semantic colors
  success: {
    light: '#dcfce7',
    base:  '#22c55e',
    dark:  '#15803d',
  },
  warning: {
    light: '#fef9c3',
    base:  '#eab308',
    dark:  '#a16207',
  },
  danger: {
    light: '#fee2e2',
    base:  '#ef4444',
    dark:  '#b91c1c',
  },
  info: {
    light: '#e0f2fe',
    base:  '#0ea5e9',
    dark:  '#0369a1',
  },

  // Neutrals
  neutral: {
    0:   '#ffffff',
    50:  '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const;

export const spacing = {
  px:   '1px',
  0:    '0',
  0.5:  '0.125rem',
  1:    '0.25rem',
  1.5:  '0.375rem',
  2:    '0.5rem',
  2.5:  '0.625rem',
  3:    '0.75rem',
  3.5:  '0.875rem',
  4:    '1rem',
  5:    '1.25rem',
  6:    '1.5rem',
  7:    '1.75rem',
  8:    '2rem',
  10:   '2.5rem',
  12:   '3rem',
  16:   '4rem',
  20:   '5rem',
  24:   '6rem',
  32:   '8rem',
  40:   '10rem',
  48:   '12rem',
  64:   '16rem',
} as const;

export const typography = {
  fontFamily: {
    sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1rem' }],
    sm:   ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem',     { lineHeight: '1.5rem' }],
    lg:   ['1.125rem', { lineHeight: '1.75rem' }],
    xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
    '2xl':['1.5rem',   { lineHeight: '2rem' }],
    '3xl':['1.875rem', { lineHeight: '2.25rem' }],
    '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
    '5xl':['3rem',     { lineHeight: '1' }],
  },
  fontWeight: {
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    extrabold:'800',
  },
} as const;

export const radii = {
  none: '0',
  sm:   '0.25rem',
  base: '0.375rem',
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  '2xl':'1.5rem',
  '3xl':'2rem',
  full: '9999px',
} as const;

export const shadows = {
  sm:    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base:  '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md:    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg:    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none:  'none',
} as const;

export const animation = {
  duration: {
    fast:   '100ms',
    normal: '200ms',
    slow:   '300ms',
    slower: '500ms',
  },
  easing: {
    ease:        'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn:      'cubic-bezier(0.4, 0, 1, 1)',
    easeOut:     'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut:   'cubic-bezier(0.4, 0, 0.2, 1)',
    spring:      'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

// Status badge semantic tokens
export const statusTokens = {
  confirmed: { bg: 'bg-success-light', text: 'text-success-dark', dot: 'bg-success-base' },
  pending:   { bg: 'bg-warning-light', text: 'text-warning-dark', dot: 'bg-warning-base' },
  cancelled: { bg: 'bg-danger-light',  text: 'text-danger-dark',  dot: 'bg-danger-base'  },
  active:    { bg: 'bg-brand-100',     text: 'text-brand-700',    dot: 'bg-brand-500'    },
  completed: { bg: 'bg-neutral-100',   text: 'text-neutral-600',  dot: 'bg-neutral-400'  },
} as const;

export type StatusKey = keyof typeof statusTokens;
