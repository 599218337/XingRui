<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-26 10:39:06
 * @FilePath: \screen-web\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
    <div class="common-layout">
        <!-- 路由 -->
        <router-view />
    </div>
</template>
<script setup>
import { defineComponent, reactive, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
const store = useStore();

// import router from '@router';
// function login() {
//     router.push({ name: 'login' })
// }
// 挂在window上的修改state内的数据
function set_store_value(action, value) {
    store.dispatch(action, value);
}
window.set_store_value = set_store_value;
// 挂在window上的获取state内的数据
function get_store_value(name) {
    return store.state[name];
}
window.get_store_value = get_store_value;

function resize(){
    let fs=document.body.clientWidth / 75;

    if(fs>16){
        fs=16
    }else if(fs<14){
        fs=14
    }
    document.body.parentNode.style="font-size: "+fs+"px;";
}
resize();
window.onresize=resize;



</script>


<style lang="scss" scoped>
@import './App.scss';
</style>