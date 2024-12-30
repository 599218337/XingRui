<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-15 10:14:27
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="PoiSelect">
    <div class="btnLeft" @click="change(0)">
    </div>
    <div class="centerImage">
      <div class="centerItem" v-for="(item, index) in allPoints" @click="roam(item.id)">
        <img class="image" :src="item.image" alt="">
        <div class="text">{{ item.label }}</div>

      </div>

    </div>
    <div class="btnRight" @click="change(1)">

    </div>

  </div>

</template>

<script setup>
import { ref, watch, onMounted, reactive, onBeforeUnmount, shallowRef, nextTick, defineProps } from 'vue'
import uploadSvg from "/image/upload.svg";
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { CONFIG } from '/public/config.js'


import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  allPoints: Object
});

// watch(
//   () => props.allPoints.length,
//   (newVal, oldVal) => {
//     formatPoints()
//   }
// )


onMounted(() => {
  // formatPoints()
})

onBeforeUnmount(() => {

})

let num = 0
let element = null
const change = (type) => {
  if (!element) {
    element = document.getElementsByClassName('centerImage')[0];
    element.style.scrollBehavior = 'smooth'
  }
  if (type) {
    if (num == props.allPoints.length - 4) return
    num++
  } else {
    if (num == 0) return
    num--
  }
  element.scrollLeft = 300 * num;
}

const emit = defineEmits(['roamSelect']);
const roam = (id) => {
  emit('roamSelect', id);
}










</script>

<style lang="scss" scoped>
@import url('./PoiSelect.scss');
</style>