import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"

import LoadScript from "vue-plugin-load-script";

createApp(App).use(router).use(LoadScript).mount('#app')

