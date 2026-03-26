import { createApp } from 'vue'
import "./assets/lib/reset.css";
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import useStore from "./store/index";
import router from "./router/index";
createApp(App).use(ElementPlus).use(useStore).use(router).mount('#app')
