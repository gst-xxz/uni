/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主题色
        primary: 'hsl(var(--primary))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',

        // 遮罩层背景色
        'overlay-bg': 'hsla(var(--overlay-bg))',

        // 返回顶部按钮背景色
        'backtop-bg': 'hsl(var(--backtop-bg))',

        // 灰色
        gray: {
          1: 'hsl(var(--gray-1))',
          2: 'hsl(var(--gray-2))',
          8: 'hsl(var(--gray-8))'
        }
      }
    }
  },
  plugins: []
}
