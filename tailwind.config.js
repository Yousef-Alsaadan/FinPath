/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          950: '#0B1120',
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
        emerald: {
          DEFAULT: '#10B981',
          600: '#059669',
          500: '#10B981',
          400: '#34D399',
          300: '#6EE7B7',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        ar: ['Tajawal', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.18)',
        glow: '0 0 0 1px rgba(16,185,129,0.25), 0 8px 30px -10px rgba(16,185,129,0.35)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: { 'fade-in': 'fade-in .3s ease' },
    },
  },
  plugins: [],
}
