/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind 4 auto-detects content, but we can still specify for backwards compatibility
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colors mapped to CSS variables (Tailwind 4 compatible)
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        // Mendi brand colors
        brand: {
          primary: 'var(--color-brand-primary)',
          'primary-hover': 'var(--color-brand-primary-hover)',
          'primary-light': 'var(--color-brand-primary-light)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          disabled: 'var(--color-text-disabled)',
        },
        bg: {
          default: 'var(--color-bg-default)',
          inactive: 'var(--color-bg-inactive)',
          hover: 'var(--color-bg-hover)',
        },
      },
    },
  },
  plugins: [],
} 