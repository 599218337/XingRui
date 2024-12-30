<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 14:48:52
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="personStatistics">
    <div class="widget">
      <div class="header">
        <span>人员定位</span>
      </div>
      <div class="content">
        <div class="contentItem" v-for="(item, index) in store.state.personArray" @click="location(item)">
          <div class="Item">
            <div class="text">{{ item.label }}</div>
          </div>
          <div class="icon"></div>
        </div>

      </div>
      <div class="line"></div>

    </div>
    <div id="personBtn" @click="showContentFuc"> </div>


  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';


onMounted(() => {
})
const showContent = ref(false)
const showContentFuc = () => {
  let p = showContent.value ? 0 : 374
  let b = showContent.value ? 'url("/image/zhankai.png")' : 'url("/image/shouqi.png")'
  document.getElementsByClassName('personStatistics')[0].style.transform = `translateX(${p}px)`
  document.getElementsByClassName('personStatistics')[0].style.transition = `transform 0.5s`
  document.getElementById('personBtn').style.background = b
  document.getElementById('personBtn').style.backgroundSize = '100% 100%'
  showContent.value = !showContent.value
}

const location = (val) => {
  if (!val.coord) {
    ElMessage({
      type: 'warning',
      message: `${val.label}坐标点缺失！`
    })
    return
  }
  let jsondata = {
    "id": "person_" + val.id,             //覆盖物id
    "covering_type": "poi",     //覆盖物类型, 详见下表
    "distance": 10           //距离(单位:米), 默认20米
  }
  cloudRender.SuperAPI("FocusCovering", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
}

</script>

<style lang="scss" scoped>
@import url('./PersonStatistics.scss');
</style>