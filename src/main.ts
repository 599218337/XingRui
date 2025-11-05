import { createApp } from 'vue'
import "./assets/lib/reset.css";
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import useStore from "./store/index";
import router from "./router/index";
import { decryptData } from "@/utils/crypto";
import Config from "@/utils/Config";
const { user1, user2 } = Config;
router.beforeEach((to, from, next) => {
  const user_s =
    sessionStorage.getItem("account_name") ||
    localStorage.getItem("account_name");
  const pass_s =
    sessionStorage.getItem("account_password") ||
    localStorage.getItem("account_password");
  let login = false;
  if (
    user_s &&
    pass_s &&
    ((decryptData(user_s) == user1.name &&
      decryptData(pass_s) == user1.pass.join("")) ||
      (decryptData(user_s) == user2.name &&
        decryptData(pass_s) == user2.pass.join("")))
  ) {
    login = true;
  }
  console.log("to, from", to, from);
  console.log("login", login);
  if (!login && to.path != "/login") {
    next("/login");
  } else {
    // 否则，正常跳转
    next();
  }
  next();
});
createApp(App).use(ElementPlus).use(useStore).use(router).mount('#app')
