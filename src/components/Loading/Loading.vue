<script setup>
import { useStore } from "vuex";
const store = useStore();
import { ref, watch } from 'vue';
import { useVwSize, useCountDown } from "@/hooks";
const { count, countDown } = useCountDown();

const props = defineProps({
    msg: String,
})
const num = ref(0)

// watch(num, (newValue,oldValue) => {
//     console.log('num-newValue=', newValue)
//     console.log('num-oldValue=', oldValue)
// }, {
//     deep: true,
// });

const obj = ref({
  a: 1,
  b: 2
});
const handleClick = function () {
    obj.value.a += 5;
};

// watch(obj, (newValue, oldValue) => {
//   console.log('obj值发生了变更', newValue, oldValue);
// }, {
//     deep: true,
// });


const loading = ref(true)

</script>

<template>
    <div class="loading-wrap " v-show="loading">
        <!-- <div class="loading-logo"></div> -->
        <div class="loading-box">
            <!-- <div class="loading-title" v-if="!store.state.user_custom_activeNav">宜化工厂数字孪生</div> -->
            <img class="loading-icon" src="/image/loading.gif" alt="">
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './Loading.scss';

</style>
