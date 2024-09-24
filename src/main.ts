import { createSSRApp } from 'vue'
import App from './App.vue'
// #ifdef H5
import '@vant/touch-emulator'
// #endif
import './main.css'

import { addGlobalProperties } from '@/globalProperties'
import globalMixins from '@/global.mixins'

export function createApp() {
  const app = createSSRApp(App)

  addGlobalProperties(app)
  app.mixin(globalMixins)

  return {
    app
  }
}
