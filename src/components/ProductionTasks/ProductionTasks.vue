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
      <span>生产任务</span>
    </div>
    <div class="content">

      <el-table :data="tableData" height="231" style="width: 100%" ref="alarmTable" size='small' :row-style="rowstyle">
        <el-table-column prop="sort" label="排名" width="70" align="center" filter-placement="bottom-end">
          <template #default="scope">
            <span :style="{ color:scope.$index === 0 ? '#0085F5' : (scope.$index === 1 ?'#3ED1EF':(scope.$index === 2 ?'#E9C27A':'#ffffff'))}">{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="车间名称"  />
        <el-table-column prop="task" label="任务数" width="70" align="center"/>
        <el-table-column prop="complete" label="完成数" width="70" align="center"/>
        <el-table-column prop="abandon" label="废弃数" width="70" align="center"/>
      </el-table>


    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
// import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
const tableData = [
  { sort: 'TOP1', name: '工厂一车间', task: '200', complete: '158', abandon: 0 },
  { sort: 'TOP2', name: '工厂一车间', task: '200', complete: '140', abandon: 1 },
  { sort: 'TOP3', name: '工厂一车间', task: '200', complete: '130', abandon: 0 },
  { sort: 'TOP4', name: '工厂一车间', task: '200', complete: '120', abandon: 1 },
  { sort: 'TOP5', name: '工厂一车间', task: '200', complete: '110', abandon: 1 },
  { sort: 'TOP6', name: '工厂一车间', task: '200', complete: '109', abandon: 1 },
  { sort: 'TOP7', name: '工厂一车间', task: '200', complete: '106', abandon: 2 },
  { sort: 'TOP8', name: '工厂一车间', task: '200', complete: '158', abandon: 0 },
  { sort: 'TOP9', name: '工厂一车间', task: '200', complete: '140', abandon: 1 },
  { sort: 'TOP10', name: '工厂一车间', task: '200', complete: '130', abandon: 0 },
  { sort: 'TOP11', name: '工厂一车间', task: '200', complete: '120', abandon: 1 },
  { sort: 'TOP12', name: '工厂一车间', task: '200', complete: '110', abandon: 1 },
  { sort: 'TOP13', name: '工厂一车间', task: '200', complete: '109', abandon: 1 },
  { sort: 'TOP14', name: '工厂一车间', task: '200', complete: '106', abandon: 2 }
]

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