<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-26 15:58:24
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="deviceStatistics">
    <div class="header">
      <span>设备统计</span>
    </div>
    <div class="content">

      <el-table :data="Array.from(store.state.devicesMap.values())" height="231" style="width: 100%" ref="alarmTable"
        size='small' :row-style="rowstyle">
        <el-table-column prop="Num" label="设备编号" width="70" align="center" />
        <el-table-column prop="Name" label="设备名称" width="70" align="center" />
        <el-table-column prop="WorkName" label="设备所在地" align="center" />
        <el-table-column label="设备状态" width="70" align="center" filter-placement="bottom-end">
          <template #default="{ row }">
            <span :style="{ color: row.state === '1' ? 'lime' : 'orange' }"> · {{ Number(row.state) ===
              2
              ? '离线' : '在线' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="detail" label="详情" width="70" align="center">
          <template #default="scope">
            <img src="/image/detail.png"
              style="width: 12px;height: 12px;cursor: pointer;display: flex;justify-content: center;align-items: center;margin: 0 auto;"
              @click="viewDetail(scope.$index, scope.row)">
          </template>
        </el-table-column>
      </el-table>


    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useStore } from "vuex";
const store = useStore();
const alarmTable = ref()
onMounted(() => {

  nextTick(() => {
    const demo = alarmTable.value.$refs.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]
    const tableScroll = ref(true)
    demo.addEventListener('mouseover', () => {
      tableScroll.value = false
    })
    demo.addEventListener('mouseout', () => {
      tableScroll.value = true
    })
    setInterval(() => {
      if (tableScroll.value) {
        demo.scrollTop += 1
        if (demo.clientHeight + demo.scrollTop >= demo.scrollHeight) {
          demo.scrollTop = 0
        }
      }
    }, 20)
  })

})
const rowstyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return {
      backgroundColor: 'rgba(8, 15, 24, 0.4)',
    }
  }
}
const viewDetail = (index, row) => {
  console.log(index, row)

}


</script>

<style lang="scss" scoped>
@import url('./DeviceStatistics.scss');

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