/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f5fc',
          100: '#ecdef1',
          200: '#d9c3e6',
          300: '#c2a3d8',
          400: '#b09bd0',
          500: '#a06be6',
          600: '#8e64c3',
          700: '#6f4a9c',
          800: '#56397a',
          900: '#402b5c',
        },
        gold: {
          300: '#fde68a',
          400: '#facc15',
          500: '#eab308',
        },
        primary: {
          50: '#f8f5fc',
          100: '#ecdef1',
          200: '#d9c3e6',
          300: '#c2a3d8',
          400: '#b09bd0',
          500: '#a06be6',
          600: '#8e64c3',
          700: '#6f4a9c',
          800: '#56397a',
          900: '#402b5c',
        },
        violet: {
          50: '#f8f5fc',
          100: '#ecdef1',
          200: '#d9c3e6',
          300: '#c2a3d8',
          400: '#b09bd0',
          500: '#a06be6',
          600: '#8e64c3',
          700: '#6f4a9c',
          800: '#56397a',
          900: '#402b5c',
        },
        accent: {
          gold: '#facc15',
          coral: '#f97316',
          emerald: '#10b981',
          warm: '#ba7465',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Muli', 'Arial', 'sans-serif'],
        display: ['var(--font-inter)', 'Muli', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 24px 60px -28px rgba(64, 43, 92, 0.45)',
        'premium-soft': '0 18px 40px -24px rgba(15, 23, 42, 0.18)',
        glow: '0 0 0 1px rgba(255,255,255,0.45), 0 20px 50px -24px rgba(86, 57, 122, 0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        slide: 'slide 20s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
