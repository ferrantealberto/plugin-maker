/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f7',
          100: '#cce1f0',
          200: '#99c2e0',
          300: '#66a4d1',
          400: '#3385c1',
          500: '#0073aa', // WordPress primary blue
          600: '#005c88',
          700: '#004466',
          800: '#002d44',
          900: '#001622',
        },
        secondary: {
          50: '#edf7ef',
          100: '#dbefdf',
          200: '#b7dfbf',
          300: '#92d09f',
          400: '#6ec07f',
          500: '#46b450', // WordPress success green
          600: '#389040',
          700: '#2a6c30',
          800: '#1c4820',
          900: '#0e2410',
        },
        accent: {
          50: '#fef1eb',
          100: '#fde4d7',
          200: '#fbc9af',
          300: '#f9ae87',
          400: '#f78e5c',
          500: '#f56e28', // WordPress accent orange
          600: '#c45820',
          700: '#934218',
          800: '#622c10',
          900: '#311608',
        },
        warning: {
          50: '#fcf5e9',
          100: '#f9ebd3',
          200: '#f4d7a8',
          300: '#eec37c',
          400: '#e9af50',
          500: '#e39b24',
          600: '#b67c1d',
          700: '#885d16',
          800: '#5b3e0e',
          900: '#2d1f07',
        },
        error: {
          50: '#fcebeb',
          100: '#f9d7d7',
          200: '#f3afaf',
          300: '#ed8787',
          400: '#e75f5f',
          500: '#dc3232', // WordPress error red
          600: '#b02828',
          700: '#841e1e',
          800: '#581414',
          900: '#2c0a0a',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};