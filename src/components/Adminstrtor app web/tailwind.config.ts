/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          50: '#faf9f7',
          100: '#f5f2ee',
          200: '#ebe5dd',
          300: '#ddd3c3',
          400: '#c9b8a0',
          500: '#b5a287',
          600: '#a1906f',
          700: '#6d5d47',
          800: '#4a4037',
          900: '#2d261c',
        },
        gold: {
          50: '#fffbf0',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ff9c00',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'luxury-lg': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
