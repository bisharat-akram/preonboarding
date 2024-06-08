/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      'fontFamily':{
        'inter':'Inter'
      },
      colors:{
        'grey':'#475467'
      }
    },
  },
  plugins: [],
}

