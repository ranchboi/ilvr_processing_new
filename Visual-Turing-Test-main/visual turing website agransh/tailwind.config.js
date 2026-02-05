module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'darkBg':'#12181b',
        'darkBgLight':'#2a2e35',
        'blagBg':'#0D0D0D',
        'bgBlackBlur':'rgba(0,0,0,3)'
      },
      transitionProperty: {
        height: 'height'
    }
    },
  },
  plugins: [],
}
