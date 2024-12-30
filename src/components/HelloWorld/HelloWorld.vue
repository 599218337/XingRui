<script setup>
import { useStore } from "vuex";
const store = useStore();
console.log('store2=', store);
import { ref, watch } from 'vue';
import { useVwSize, useCountDown } from "@/hooks";
const { count, countDown } = useCountDown();

const props = defineProps({
    msg: String,
})
const num = ref(0)

watch(num, (newValue,oldValue) => {
    console.log('num-newValue=', newValue)
    console.log('num-oldValue=', oldValue)
}, {
    deep: true,
});

const obj = ref({
  a: 1,
  b: 2
});
const handleClick = function () {
    obj.value.a += 5;
};

watch(obj, (newValue, oldValue) => {
  console.log('obj值发生了变更', newValue, oldValue);
}, {
    deep: true,
});


const count2 = ref(0)
</script>

<template>
    <h1>HelloWorld</h1>
    <h1>{{ msg }}</h1>
    <p>{{ store.state.count }}</p>
    <div class="card">
        <button type="button" @click="count2++">count2 is {{ count2 }}</button>
        <button type="button" @click="num++">num is {{ num }}</button>
        <button type="button" @click="handleClick">obj.a is {{ obj.a }}</button>
        <p>
            Edit
            <code>components/HelloWorld.vue</code> to test HMR
        </p>
    </div>

    <p>
        Check out
        <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
        starter
    </p>
    <p>
        Install
        <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
        in your IDE for a better DX
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style lang="scss" scoped>
@import './HelloWorld.scss';

</style>
