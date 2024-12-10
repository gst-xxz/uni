/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--theme))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
        info: 'hsl(var(--info))'
      }
    }
  },
  plugins: [],
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  // 其他配置项
  // ...
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发小程序和 h5 端，你应该使用环境变量来控制它
    preflight: false
  }
}
