<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-27 17:29:07
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="personnelStatistics">
    <div class="header">
      <span>人员统计</span>
    </div>
    <div class="content">
      <div class="contentItem" v-for="(item, index) in infoArry">
        <img :src="item.img">
        <div class="text">
          <div class="text1">{{ item.label1 }}</div>
          <div class="text2">{{ item.label2 }}</div>
        </div>
      </div>

    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const infoArry = ref([
  {
    id: 0,
    img: '/image/1.png',
    label1: '总人数',
    label2: '1654人'
  },
  {
    id: 1,
    img: '/image/2.png',
    label1: '机械设计工程师',
    label2: '1654人'
  },
  {
    id: 2,
    img: '/image/3.png',
    label1: '一线工人',
    label2: '1654人'
  },
  {
    id: 3,
    img: '/image/4.png',
    label1: '制造工程师',
    label2: '1654人'
  },
  {
    id: 4,
    img: '/image/5.png',
    label1: '数控工程师',
    label2: '1654人'
  },
  {
    id: 5,
    img: '/image/6.png',
    label1: '质检员',
    label2: '1654人'
  },
])

onMounted(() => {
})

</script>

<style lang="scss" scoped>
@import url('./PersonnelStatistics.scss');
</style>