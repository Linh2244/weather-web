/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        'hero': ['96px', { lineHeight: '1', letterSpacing: '-4px', fontWeight: '200' }],
        'temp-lg': ['64px', { lineHeight: '1', letterSpacing: '-2px', fontWeight: '300' }],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}