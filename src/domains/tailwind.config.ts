// tailwind.config.ts — Design Token Integration
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
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
        surface: {
          primary:   'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          elevated:  'var(--surface-elevated)',
          overlay:   'var(--surface-overlay)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm:   '0.25rem',
        base: '0.375rem',
        md:   '0.5rem',
        lg:   '0.75rem',
        xl:   '1rem',
        '2xl':'1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        overlay: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      animation: {
        'fade-in':     'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up':    'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down':  'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in':    'scaleIn 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'spin-slow':   'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { transform: 'translateY(1rem)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { from: { transform: 'translateY(-1rem)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        scaleIn:   { from: { transform: 'scale(0.95)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
