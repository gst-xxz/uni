import { createSSRApp } from 'vue'
import App from './App.vue'
// #ifdef H5
import '@vant/touch-emulator'
// #endif
import '@/uni_modules/pro-core/css/index.css'
import '@/output.css'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
