// import { createApp } from 'vue'
import {
  createStore,
  createLogger
} from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import createPersistedState from 'vuex-persistedstate';

// 模块
import moduleA from './modules/moduleA';
import moduleB from './modules/moduleB';

// Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    moduleA,
    moduleB,
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(state) { // state就是上面的state
      return {
        // 只储存state中的stateLoginUser
        stateLoginUser: state.stateLoginUser
      }
    }
  })]
  // 引入vuex-persistedstate插件  持久化存储
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
});;