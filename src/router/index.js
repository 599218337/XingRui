/*
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-18 16:35:14
 * @FilePath: \screen-web\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from "vue-router"

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/login.vue'),
    meta: {
      title: '用户登陆'
    },
  },
  {
    path: '/',
    name: '首页',
    component: () => import('@/pages/home/home.vue'),
    meta: {
      title: '智慧工厂数字孪生'
    },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/',
  }
];

// 路由参数配置
const router = createRouter({
  // #
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes: routes
});

// 全局前置守卫，这里可以加入用户登录判断
router.beforeEach((to, from, next) => {
  // console.log('to=', to);
  // console.log('from=', from);
  // 不存在路由默认跳转到首页
  // if (!router.hasRoute(to.name)) router.push({ path: '/' });
  // 继续前进 next()
  // 返回 false 以取消导航
  next()
})

// 全局后置钩子，这里可以加入改变页面标题等操作
router.afterEach((to, from) => {
  const _title = to.meta.title
  if (_title) {
    window.document.title = _title
  }
})

// 导出默认值
export default router;