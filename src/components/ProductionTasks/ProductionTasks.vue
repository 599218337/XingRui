<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-28 15:52:18
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="productionTasks">
    <div class="header">
      <span>生产负荷监控</span>
    </div>
    <div class="content">
      <div ref="chartRef" style="width: 100%; height: 214px;"></div>
    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { electricData } from './electricList'
// import { fetchDeviceData } from '../FireStatistics/start'
import * as echarts from 'echarts'
// import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
const historyData = ref([])
const tableData = ref(electricData.map((item, index) => ({
  name: item.name,
  complete: '0.0000',
  id: item.id
})))
const chartRef = ref(null)
let myChart = null

const getData = async () => {
  try {
    const response = await fetch('/nodeApi/productionLoadHistory')
    const res = await response.json()
    if (res.code === 200) {
      const history = res.data.map(item => ({
        time: item.time,
        ...item.data
      }))
      historyData.value = history
      
      // Update tableData with the latest values
      if (history.length > 0) {
        const latest = history[history.length - 1]
        tableData.value.forEach(item => {
          if (latest[item.id]) {
            item.complete = latest[item.id]
          }
        })
      }
      updateChart()
    }
  } catch (e) {
    console.error('Failed to fetch production load history:', e)
  }
}

const initChart = () => {
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(8, 24, 50, 0.8)',
      borderColor: '#0085F5',
      textStyle: { color: '#fff' },
      formatter: function (params) {
        let res = params[0].name + '<br/>'
        params.forEach(item => {
          res += item.marker + item.seriesName + ': ' + item.value + ' A<br/>'
        })
        return res
      }
    },
    legend: {
      data: electricData.map(item => item.name),
      textStyle: { color: '#9ac1e5', fontSize: 10 },
      top: 0,
      itemWidth: 10,
      itemHeight: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisLabel: { color: '#9ac1e5', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(154, 193, 229, 0.2)' } }
    },
    yAxis: {
      type: 'value',
      name: '电流 (A)',
      nameTextStyle: { color: '#9ac1e5', fontSize: 10 },
      axisLabel: { color: '#9ac1e5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(154, 193, 229, 0.1)', type: 'dashed' } },
      axisLine: { show: true, lineStyle: { color: 'rgba(154, 193, 229, 0.2)' } }
    },
    series: electricData.map((item, index) => ({
      name: item.name,
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [],
      lineStyle: { width: 2 },
      itemStyle: {
        color: ['#0085F5', '#3ED1EF', '#E9C27A', '#FF7070', '#85FF9F', '#B185FF'][index % 6]
      }
    }))
  }
  myChart.setOption(option)
}

const updateChart = () => {
  if (!myChart) return
  myChart.setOption({
    xAxis: {
      data: historyData.value.map(d => d.time)
    },
    series: electricData.map(item => ({
      data: historyData.value.map(d => d[item.id])
    }))
  })
}

onMounted(() => {
  nextTick(() => {
    initChart()
    getData()
  })
  const timer = setInterval(() => {
    getData()
  }, 1000 * 30)

  onUnmounted(() => {
    clearInterval(timer)
    if (myChart) {
      myChart.dispose()
    }
  })
})

</script>

<style lang="scss" scoped>
@import url('./ProductionTasks.scss');


</style>