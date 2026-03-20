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
      <span>原辅料消耗</span>
    </div>
    <div class="content">
      <div id="barchart" style="width: 380px;height: 200px; margin: 0;">
      </div>

    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts';


onMounted(async () => {
  try {

    const response = await fetch('/nodeApi/getEnergy')
    if (!response.ok) throw new Error('Network response was not ok')
    const result = await response.json()

    const data = result.data || []

    // 1. Sort by date descending to get the latest 6 entries
    const sortedData = [...data].sort((a, b) => new Date(b.时间) - new Date(a.时间))
    const lastEntries = sortedData.filter(item => item.时间).slice(0, 6)

    // 2. Sort back to ascending for the chart X-axis
    const chartData = lastEntries.sort((a, b) => new Date(a.时间) - new Date(b.时间))

    // 3. Format data for ECharts (电能消耗 = 发电 - 上网电)
    const source = chartData.map(item => {
      const date = new Date(item.时间)
      const formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0')

      const generating = parseFloat(item['发电']) || 0
      const gridConnected = parseFloat(item['上网电']) || 0
      const consumption = Math.max(0, generating - gridConnected)

      return [formattedDate, consumption.toFixed(2)]
    })

    await nextTick()
    initChart(source)

  } catch (error) {
    console.error('Failed to fetch energy data:', error)
  }
})

const initChart = (sourceData) => {

  var chartDom = document.getElementById('barchart');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    legend: {
      right: 10,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#EFF7FF',
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let res = params[0].name + '<br/>';
        params.forEach(item => {
          res += item.marker + item.seriesName + ': ' + item.value[1] + ' 万KWh';
        });
        return res;
      }
    },
    dataset: {
      dimensions: ['时间', '电能消耗'],
      source: sourceData
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
        name: '电能消耗',
        type: 'bar',
        barWidth: 18,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00a8ff' },
            { offset: 1, color: '#0f3352' }
          ]),
          borderRadius: [4, 4, 0, 0],
          opacity: 0.8

        },
      }
    ],
    grid:
    {
      z: 0,
      left: '12%',
      top: 35,
      right: '10%',
      bottom: 25,
      containLabel: false,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 1,
      borderColor: '#fff'
    }

  };

  option && myChart.setOption(option);
}

</script>

<style lang="scss" scoped>
@import url('./EnergyStatistics.scss');
</style>