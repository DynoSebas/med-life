import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Med-Life brand colors
        'med-pine': {
          DEFAULT: '#00311F',
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce5cc',
          300: '#8dd2a8',
          400: '#56b67d',
          500: '#329d5c',
          600: '#247d47',
          700: '#1d6239',
          800: '#184f2f',
          900: '#143f27',
          950: '#00311F',
        },
        'med-milk': {
          DEFAULT: '#EC5E27',
          50: '#fef7f2',
          100: '#fdeee0',
          200: '#f9dac0',
          300: '#f5c295',
          400: '#f0a169',
          500: '#ec7c44',
          600: '#EC5E27',
          700: '#d44a1f',
          800: '#b03d1d',
          900: '#8e341c',
          950: '#4d1a0d',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;