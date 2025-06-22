/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
  variants: {
  extend: {
    scrollbar: ['rounded', 'hover'],
  },
},
}

