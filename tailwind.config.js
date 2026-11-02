/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // تعریف کلاس‌های فونت برای استفاده در کامپوننت‌ها
        'shabnam': ['Shabnam', 'Tahoma', 'sans-serif'],
        'shabnam-fd': ['Shabnam FD', 'Tahoma', 'sans-serif'],
      },
      colors: {
        primary: '#33635E',
        secondary: '#183431',
        active: '#2C5753',
      }
    },
  },
  plugins: [],
}