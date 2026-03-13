import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4B7C38',
          50: '#f2f7ee',
          100: '#deecd4',
          200: '#bed9aa',
          300: '#97c17a',
          400: '#72a551',
          500: '#4B7C38',
          600: '#3d6530',
          700: '#2f4e24',
          800: '#223819',
          900: '#14210f',
        },
        accent: {
          DEFAULT: '#D4A15C',
          50: '#fdf6ec',
          100: '#f9e8cc',
          200: '#f3cd97',
          300: '#ecb262',
          400: '#D4A15C',
          500: '#b8823a',
          600: '#9a6a2e',
          700: '#7c5224',
          800: '#5e3d1a',
          900: '#402810',
        },
        oat: '#FAF7F2',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
