/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        green: {
          DEFAULT: 'var(--green)',
          dim: 'var(--green-dim)',
        },
        amber: {
          DEFAULT: 'var(--amber)',
          dim: 'var(--amber-dim)',
        },
        red: {
          DEFAULT: 'var(--red)',
          dim: 'var(--red-dim)',
        },
        cyan: {
          DEFAULT: 'var(--cyan)',
          dim: 'var(--cyan-dim)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease forwards',
        'slide-up': 'slideUp 200ms ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'color-cycle': 'colorCycle 4s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};