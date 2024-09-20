import { createSSRApp } from 'vue'
import App from './App.vue'
// #ifdef H5
import '@vant/touch-emulator'
// #endif
import '@/lib/global.output.css'

import { addGlobalProperties } from '@/lib/addGlobalProperties'
import globalMixins from '@/lib/global.mixins'

export function createApp() {
  const app = createSSRApp(App)

  addGlobalProperties(app)
  app.mixin(globalMixins)

  return {
    app
  }
}
