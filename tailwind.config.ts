/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#FFE7C3',
        'brand-logo': '#C1FF72',
        'brand-green': '#00BF63',
        'brand-green-light': '#7ED957',
        'brand-green-dark': '#004B27',
        'brand-orange': '#FF914D',
        'brand-orange-light': '#FFBD59',
        'brand-orange-dark': '#572700',
        'brand-yellow': '#FFD874',
        
      },
      fontFamily: {
        'Archivo': ['Archivo Black', 'sans-serif'],
        'Quicksand': ['Quicksand', 'sans-serif'],
        'Script': ['Script'],
        'Black': ['Black Han Sans', 'sans-serif'],
      },
      transitionProperty: {
        'width': 'width',
      },
      transitionDuration: {
        '1300': '1300ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      textStroke: {
        'gray-700': '1px #6B7280',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    function({ addUtilities }) {
      addUtilities({
        '.text-stroke-gray-700': {
          '-webkit-text-stroke': '0.5px #6B7280',
        },
      });
    }
  ],
}
