/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        benign: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#059669',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        phishing: {
          light: '#f87171',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          bg: 'rgba(239, 68, 68, 0.1)',
        },
        adult: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
        cyber: {
          950: '#060a13',
          900: '#0a0f1d',
          800: '#111827',
          700: '#1e293b',
          600: '#334155',
          500: '#475569',
          accent: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
