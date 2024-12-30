
// B模块
export default {
    namespaced: true,
    state: {
        username: "moduleB",
        age: 2
    },
    getters: {
        newName(state) {
            return state.username + "???";
        },
        moduleBnewName(state) {
            return state.username + "???";
        },
    },
    mutations: {
        // 更改数据函数
        updateName(state) {
            console.log('触发了-mutations')
            state.username = 'ls'
        },
        updateAge(state, playLoad) {
            console.log("playLoad", playLoad)
            state.age += playLoad
        }
    },
    actions: {
        // 请求数据函数
        updateName(ctx, count) {
            console.log('触发了-actions')
            // 发请求
            setTimeout(() => {
                ctx.commit('updateAge', count)
            }, 1000)
        }
    },
};