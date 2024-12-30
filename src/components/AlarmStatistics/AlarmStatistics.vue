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
      <span>告警统计</span>
    </div>
    <div class="content">

      <el-table :data="tableData" height="231" style="width: 100%" ref="alarmTable"  size='small' :row-style="rowstyle">
        <el-table-column prop="address" label="地点" width="100" />
        <el-table-column prop="time" label="时间" width="50" />
        <el-table-column prop="device" label="告警设备" />
        <el-table-column prop="state" label="状态" width="100" filter-placement="bottom-end">
          <template #default="scope">
            <el-tag effect="dark"
              :type="scope.row.state === '一般' ? 'primary' : (scope.row.state === '注意' ? 'warning' : (scope.row.state === '紧急' ? 'danger' : 'info'))"
              disable-transitions>{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
      </el-table>


    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
// import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
const tableData = [
  { address: '工厂一车间', time: '21:40', device: '消防栓', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '监控探头', state: '注意' },
  { address: '工厂一车间', time: '21:40', device: '灭火器', state: '注意' },
  { address: '工厂一车间', time: '21:40', device: '消防栓', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '监控探头', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '灭火器', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '消防栓', state: '一般' },
  { address: '工厂一车间', time: '21:40', device: '消防栓', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '监控探头', state: '注意' },
  { address: '工厂一车间', time: '21:40', device: '灭火器', state: '注意' },
  { address: '工厂一车间', time: '21:40', device: '消防栓', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '监控探头', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '灭火器', state: '紧急' },
  { address: '工厂一车间', time: '21:40', device: '消防栓', state: '一般' }
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
.el-scrollbar__bar .is-horizontal{
  display: none;
}
.el-scrollbar__thumb{
  background-color:transparent;
}
:deep(.el-scrollbar::after){
  height: 0px !important;
}
</style>