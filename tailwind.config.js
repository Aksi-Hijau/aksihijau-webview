/** @type {import('tailwindcss').Config} */

import flowbite from 'flowbite/plugin'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      ...flowbite.colors,
      primary: '#316E00',
      secondary: '#6BCB2E',
      tertiary: '#F2F4F7', // abu abu hijau 
      quaternary: '#79747E', // abu abu
    }
  },
  plugins: [
    flowbite
  ],
}

