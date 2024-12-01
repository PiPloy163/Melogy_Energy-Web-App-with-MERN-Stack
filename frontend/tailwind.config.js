/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        trainOne: ['"Train One"', 'cursive']
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}};
