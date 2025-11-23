/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          success: 'var(--brand-success)',
          warning: 'var(--brand-warning)',
          error: 'var(--brand-error)',
          info: 'var(--brand-info)',
        },
        bg: {
          DEFAULT: 'var(--brand-bg)',
          alt: 'var(--brand-bg-alt)',
          surface: 'var(--brand-surface)',
        },
        text: {
          DEFAULT: 'var(--brand-text)',
          light: 'var(--brand-text-light)',
          muted: 'var(--brand-muted)',
          inverse: 'var(--brand-text-inverse)',
        },
        border: {
          DEFAULT: 'var(--brand-border)',
          light: 'var(--brand-border-light)',
        },
      },
      borderRadius: {
        'brand-sm': 'var(--radius-sm)',
        'brand-md': 'var(--radius-md)',
        'brand-lg': 'var(--radius-lg)',
      },
      boxShadow: {
        'brand-sm': 'var(--shadow-sm)',
        'brand-md': 'var(--shadow-md)',
        'brand-lg': 'var(--shadow-lg)',
        'brand-xl': 'var(--shadow-xl)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
    },
  },
  plugins: [],
}
