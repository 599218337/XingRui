<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-26 12:28:19
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="environmentalData">
    <div class="header">
      <span>环境数据</span>
    </div>
    <div class="content">
      <div class="left">
        <div class="ltextItem" v-for="(item,index) in leftData">
          <div class="text1">{{ item.label1 }}</div>
          <div class="text2">{{ item.label2 }}</div>

        </div>
      </div>
      <div class="middle">
        <div class="text">
          {{middleData}}
        </div>
      </div>
      <div class="right">
        <div class="rtextItem" v-for="(item,index) in rightData">
          <div class="text1">{{ item.label1 }}</div>
          <div class="text2">{{ item.label2 }}</div>

        </div>
      </div>


    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ref, watch, onMounted } from 'vue'

const middleData=ref('文字跟着厂房名字')
const leftData=reactive([
  {
    id:0,
    label1:'温度',
    label2:'25°C'
  },
  {
    id:1,
    label1:'风速',
    label2:'10m/s'
  },
  {
    id:2,
    label1:'污染指数',
    label2:'PM2.5'
  }
])
const rightData=reactive([
  {
    id:0,
    label1:'湿度',
    label2:'46%'
  },
  {
    id:1,
    label1:'气压',
    label2:'110kPa'
  },
  {
    id:2,
    label1:'空气质量',
    label2:'542'
  }
])


onMounted(() => {
})

</script>

<style lang="scss" scoped>
@import url('./EnvironmentalData.scss');
</style>