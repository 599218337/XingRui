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
    <div class="content" v-loading="loading" element-loading-background="rgba(8, 15, 24, 0.4)">
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
import { ref, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const loading = computed(() => store.state.personnel.loading)
const personnelMap = computed(() => store.state.personnel.personnelMap)

const infoArry = ref([
  {
    id: 0,
    img: '/image/1.png',
    label1: '总人数',
    label2: '0人'
  },
])

const updateInfoArray = (personMap) => {
  let total = 0
  let dynamicItems = []
  let imgIndex = 2

  personMap.forEach((list, department) => {
    const deptName = department || '一线员工'
    total += list.length
    dynamicItems.push({
      id: dynamicItems.length + 1,
      img: `/image/${imgIndex}.png`,
      label1: deptName,
      label2: list.length + '人'
    })

    // Cycle images from 2 to 6
    imgIndex++
    if (imgIndex > 6) imgIndex = 2
  })

  infoArry.value = [
    {
      id: 0,
      img: '/image/1.png',
      label1: '总人数',
      label2: total + '人'
    },
    ...dynamicItems
  ]
}

watch(personnelMap, (newMap) => {
  if (newMap) {
    updateInfoArray(newMap)
  }
}, { immediate: true })

onMounted(() => {
  store.dispatch('personnel/startPolling')
})


</script>

<style lang="scss" scoped>
@import url('./PersonnelStatistics.scss');
</style>