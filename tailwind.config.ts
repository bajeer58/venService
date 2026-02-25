/* ═══════════════════════════════════════════════════════════
   tailwind.config.ts — venService v2.0
   Tailwind CSS v4 configuration.
   In v4, most config lives in CSS (@theme). This file handles
   content paths, plugins, and any JS-side customisations.
   ═══════════════════════════════════════════════════════════ */

import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{ts,tsx}',
    ],

    // ── Dark mode ──────────────────────────────────────────────
    darkMode: 'class', // toggle via <html class="dark">

    theme: {
        extend: {
            // Design tokens — mirrors src/styles/tokens.ts at runtime
            colors: {
                brand: {
                    DEFAULT: '#6C63FF',
                    light: '#8B85FF',
                    dark: '#4B44CC',
                },
                surface: {
                    1: 'var(--surface1)',
                    2: 'var(--surface2)',
                    3: 'var(--surface3)',
                },
                text: {
                    DEFAULT: 'var(--text)',
                    muted: 'var(--text-muted)',
                },
            },
            fontFamily: {
                heading: ['Inter', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
            },
            transitionTimingFunction: {
                smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
                bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },

    plugins: [],
};

export default config;
