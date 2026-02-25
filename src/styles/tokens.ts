/* ═══════════════════════════════════════════════════════════
   src/styles/tokens.ts — venService v2.0
   JS/TS design token constants.
   Mirrors the CSS custom properties in variables.css so that
   logic-layer code (state machines, validators, animations)
   can reference tokens without touching the DOM.
   ═══════════════════════════════════════════════════════════ */

// ── Colour palette ─────────────────────────────────────────

export const Color = {
    // Brand
    brand: '#6C63FF',
    brandLight: '#8B85FF',
    brandDark: '#4B44CC',

    // Semantic
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',

    // Neutrals (dark theme base)
    bg: '#0A0A0F',
    surface1: '#12121A',
    surface2: '#1A1A26',
    surface3: '#22223A',

    // Text
    text: '#F0F0FF',
    textMuted: '#8888AA',

    // Borders
    border: '#2A2A40',
    borderStrong: '#4A4A6A',
} as const;

export type ColorToken = typeof Color[keyof typeof Color];

// ── Spacing scale (rem) ────────────────────────────────────

export const Space = {
    '0': '0rem',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
} as const;

// ── Typography ─────────────────────────────────────────────

export const FontFamily = {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const FontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
} as const;

export const FontWeight = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
} as const;

// ── Border radius ──────────────────────────────────────────

export const Radius = {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
} as const;

// ── Shadows ────────────────────────────────────────────────

export const Shadow = {
    sm: '0 1px 3px rgba(0,0,0,0.4)',
    md: '0 4px 12px rgba(0,0,0,0.5)',
    lg: '0 8px 32px rgba(0,0,0,0.6)',
    xl: '0 20px 60px rgba(0,0,0,0.7)',
    brand: '0 0 24px rgba(108,99,255,0.35)',
} as const;

// ── Animation / Transition ─────────────────────────────────

export const Duration = {
    fast: 150,   // ms
    normal: 250,
    slow: 400,
    xslow: 600,
} as const;

export const Easing = {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    sharp: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// ── Breakpoints ────────────────────────────────────────────

export const Breakpoint = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

// ── Z-index scale ──────────────────────────────────────────

export const ZIndex = {
    base: 0,
    above: 1,
    sticky: 100,
    overlay: 200,
    modal: 300,
    toast: 400,
    max: 9999,
} as const;
