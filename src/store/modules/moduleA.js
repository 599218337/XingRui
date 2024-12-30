
// A模块
export default {
    state: {
        username: "moduleA",
    },
    getters: {
        newName(state) {
            return state.username + "!!!!";
        },
    },
    mutations: {
        updateName(state) {
            state.username = "moduleAAAA";
        },
    },
};