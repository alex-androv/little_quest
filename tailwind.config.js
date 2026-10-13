/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{vue,js,ts}', './components/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'] },
      colors: {
        ink: '#29294a',
        cream: '#fff9ed',
        coral: '#ff786b',
        violet: '#7764e8',
        mint: '#c9f3df',
        lemon: '#ffe58a'
      },
      boxShadow: {
        card: '0 12px 30px rgba(68, 53, 118, .08)',
        button: '0 7px 0 #e35c51',
        selected: '0 0 0 2px #7764e8, 0 10px 26px rgba(119, 100, 232, .14)'
      }
    }
  },
  plugins: []
}