import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import useStore from "./store/index";

createApp(App).use(ElementPlus).use(useStore).mount('#app')