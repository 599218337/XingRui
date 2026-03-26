<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-28 15:51:57
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="alarmStatistics">
    <div class="header">
      <span>实时告警</span>
    </div>
    <div class="content">

      <el-table :data="displayData" height="231" style="width: 100%" ref="alarmTable" size='small' :row-style="rowstyle" empty-text="暂无告警" row-key="uniqueId">
        <el-table-column prop="device" label="告警设备" />
        <el-table-column prop="time" label="时间" width="50" />
        <el-table-column prop="currentValue" label="实时值" width="70" />
        <el-table-column prop="state" label="状态" width="100" filter-placement="bottom-end">
          <template #default="scope">
            <span :style="{ color: scope.row.color }">{{ scope.row.state }}</span>
          </template>
        </el-table-column>
      </el-table>


    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed, onUnmounted } from 'vue'
import { useStore } from "vuex";

const store = useStore();

const tableData = computed(() => {
  return store.state.alarmList.map((item, index) => ({
    address: item.address || '系统设备',
    time: item.time,
    device: item.name,
    state: item.alarmText,
    currentValue: Number(item.currentValue).toFixed(2),
    color: item.color,
    id: item.id || `alarm-${index}` // Use stable fallback ID
  }))
})

const displayData = computed(() => {
  const data = tableData.value
  if (data.length === 0) return []
  
  // Only double the data for seamless loop if we have enough items
  // to actually fill the table (height: 231px).
  const shouldDouble = data.length > 5
  const finalData = shouldDouble ? [...data, ...data] : data
  
  return finalData.map((item, index) => ({
    ...item,
    uniqueId: `${item.id}-${index}`
  }))
})

const alarmTable = ref()
const scrollTimer = ref(null)
onMounted(() => {
  store.dispatch('startPollingAlarms');

  nextTick(() => {
    const demo = alarmTable.value.$refs.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]
    const tableScroll = ref(true)
    demo.addEventListener('mouseover', () => {
      tableScroll.value = false
    })
    demo.addEventListener('mouseout', () => {
      tableScroll.value = true
    })
    scrollTimer.value = setInterval(() => {
      if (!alarmTable.value || !tableScroll.value) return
      
      const demo = alarmTable.value.$refs.bodyWrapper?.getElementsByClassName('el-scrollbar__wrap')[0]
      if (!demo) return

      if (demo.scrollHeight > demo.clientHeight) {
        demo.scrollTop += 1
        // Reset at the midpoint of the repeated data
        // Since we repeated at least twice, scrollHeight/2 is a safe boundary
        // but it's better to reset based on original list height.
        // However, with our 'while' loop, midpoint is safer.
        if (demo.scrollTop >= demo.scrollHeight / 2 && tableData.value.length > 5) {
          demo.scrollTop = 0
        }
      }
    }, 20)

  })

})

onUnmounted(() => {
  if (scrollTimer.value) clearInterval(scrollTimer.value)
})
const rowstyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return {
      backgroundColor: 'rgba(8, 15, 24, 0.4)',
    }
  }
}

</script>

<style lang="scss" scoped>
@import url('./AlarmStatistics.scss');

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