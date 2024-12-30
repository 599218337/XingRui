<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-22 11:35:58
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="energyStatistics">
    <div class="header">
      <span>能耗统计</span>
    </div>
    <div class="content">
      <div id="barchart" style="width: 380px;height: 200px; margin: 0;">
      </div>

    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted,nextTick } from 'vue'
import * as echarts from 'echarts';

onMounted(() => {
  nextTick(()=>{
    initChart()

  })
})

const initChart = () => {

  var chartDom = document.getElementById('barchart');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: ['total', '水（t）', '电（kwh）',],
      source: [
        ['车间名称1', 550, 610],
        ['车间名称2', 760, 790],
        ['车间名称3', 603, 635],
        ['车间名称4', 810, 850],
      ]
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: "#fff"
      },
      axisTick: {
        show: false
      },

    },
    yAxis: {
      axisLabel: {
        color: "#fff"
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#fff',
          opacity: 0.3
        }
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: 11,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00a8ff' },
            { offset: 1, color: '#0f3352' }
          ]),
          opacity: 0.8

        },
      },
      {
        type: 'bar',
        barWidth: 11,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#eebb60' },
            { offset: 1, color: '#412905' }
          ]),
          opacity: 0.8
        }
      }
    ],
    grid:
    {
      z: 0,
      left: '10%',
      top: 35,
      right: '10%',
      bottom: 20,
      containLabel: false,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 1,
      borderColor: '#fff'
    },
    legend: {
      right: 10,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#EFF7FF',
        fontSize: 12
      }
    }

  };

  option && myChart.setOption(option);
}

</script>

<style lang="scss" scoped>
@import url('./EnergyStatistics.scss');
</style>