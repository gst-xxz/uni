/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主题色
        primary: 'hsl(var(--primary))',
        // 遮罩层背景色
        'overlay-bg': 'hsla(var(--overlay-bg))'
      }
    }
  },
  plugins: []
}
