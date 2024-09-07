import { createSSRApp } from "vue";
import App from "./App.vue";
import "./tailwind.output.css";
import globalMixins from "./mixins/global";
import store from "./store";

export function createApp() {
  const app = createSSRApp(App);

  app.use(store);
  app.mixin(globalMixins);
  return {
    app,
  };
}
