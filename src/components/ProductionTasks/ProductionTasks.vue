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
      <el-table :data="displayData" style="width: 100%;height: 100%;" ref="alarmTable" size='small'
        :row-style="rowstyle" row-key="uniqueId">
        <el-table-column prop="id" label="位号" show-overflow-tooltip align="center" />
        <el-table-column prop="name" label="名称" show-overflow-tooltip align="center" />
        <el-table-column label="实时电流/流量" width="120" align="center">
          <template #default="{ row }">
            {{ row.complete }} {{ row.unit }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { electricData } from './electricList'
import { fetchDeviceData } from '../FireStatistics/start'
// import { Vue3SeamlessScroll } from "vue3-seamless-scroll";

const tableData = ref(electricData.map((item, index) => ({
  name: item.name,
  complete: '0.0',
  id: item.id,
  unit: item.unit || 'A'
})))
const alarmTable = ref(null)
const scrollTimer = ref(null)
const dataTimer = ref(null)

const displayData = computed(() => {
  const data = tableData.value
  if (data.length === 0) return []

  // Only double the data for seamless loop if we have enough items
  const shouldDouble = data.length > 5
  const finalData = shouldDouble ? [...data, ...data] : data

  return finalData.map((item, index) => ({
    ...item,
    uniqueId: `${item.id}-${index}`
  }))
})

const getRealtimeData = async () => {
  const concurrency = 5
  for (let i = 0; i < tableData.value.length; i += concurrency) {
    const chunk = tableData.value.slice(i, i + concurrency)
    await Promise.allSettled(chunk.map(async (item) => {
      try {
        const val = await fetchDeviceData(item.id)
        if (val !== undefined && val !== null) {
          item.complete = Number(val).toFixed(1)
        }
      } catch (error) {
        console.error(`Failed to fetch realtime data for ${item.id}:`, error)
      }
    }))
  }
}

const rowstyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return {
      backgroundColor: 'rgba(8, 15, 24, 0.4)',
    }
  }
}

onMounted(() => {
  nextTick(() => {
    getRealtimeData()

    // Automatic table scrolling logic
    if (alarmTable.value) {
      const demo = alarmTable.value.$refs.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]
      const tableScroll = ref(true)
      demo.addEventListener('mouseover', () => {
        tableScroll.value = false
      })
      demo.addEventListener('mouseout', () => {
        tableScroll.value = true
      })
      scrollTimer.value = setInterval(() => {
        if (tableScroll.value) {
          // If content is shorter than container, no need to scroll
          // But with doubled data, scrollHeight is 2x. We reset at 1x height.
          if (demo.scrollHeight > demo.clientHeight * 2) {
            demo.scrollTop += 1
            if (demo.scrollTop >= demo.scrollHeight / 2 && tableData.value.length > 5) {
              demo.scrollTop = 0
            }
          } else if (demo.scrollHeight > demo.clientHeight) {
            // If doubled data is more than container but not necessarily twice container
            // We can still try to loop if scrollHeight / 2 > some threshold
            demo.scrollTop += 1
            if (demo.scrollTop >= demo.scrollHeight / 2 && tableData.value.length > 5) {
              demo.scrollTop = 0
            }
          }
        }
      }, 50)
    }
  })

  dataTimer.value = setInterval(() => {
    getRealtimeData()
  }, 1000 * 30)
})

onUnmounted(() => {
  if (scrollTimer.value) clearInterval(scrollTimer.value)
  if (dataTimer.value) clearInterval(dataTimer.value)
})

</script>

<style lang="scss" scoped>
@import url('./ProductionTasks.scss');

:deep(.el-table tr) {
  background-color: #162556;
  background: rgba(136, 181, 255, 0.2);
}

.el-table {
  --el-table-border-color: transparent;
  --el-table-border: none;
  --el-table-text-color: #fff;
  --el-table-header-text-color: #9ac1e5;
  --el-table-row-hover-bg-color: transparent;
  --el-table-current-row-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
}

.el-scrollbar__bar .is-horizontal {
  display: none;
}

.el-scrollbar__thumb {
  background-color: transparent;
}

:deep(.el-scrollbar::after) {
  height: 0px !important;
}
</style>