/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
  theme: {
      extend: {
          colors: {
              'alabaster': '#E0DFD5',
              "ash_gray": "#C5C3B2",
              'sage': '#C5C3B2',
              'yinmn_blue': '#355070',
              'cerulean': '#82A7BC',
              'oxford_blue': '#12263F',
              'smoky_black': '#131200',
              'chinese_violet': '#6D597A',
              'tigers_eyes': '#BC6C25',
              'dark_moss_green': '#606C38',
              'imeprial_red': '#E54B4B'
          }
      },
  },
  plugins: [],
}

