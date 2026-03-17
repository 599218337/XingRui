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

      <!-- 设备统计信息块 -->
      <div class="statistics-summary">
        <div class="stat-item">
          <div class="stat-label">设备总数</div>
          <div class="stat-value total">{{ totalDeviceCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">在线数</div>
          <div class="stat-value online">{{ onlineCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">离线数</div>
          <div class="stat-value offline">{{ offlineCount }}</div>
        </div>
      </div>

      <el-table :data="tableData" height="165" style="width: 100%" ref="alarmTable" size='small' :row-style="rowstyle">
        <el-table-column prop="设备位号" label="设备编号" width="130" show-overflow-tooltip align="center" />
        <el-table-column prop="设备名称" label="设备名称" show-overflow-tooltip align="center" />
        <el-table-column prop="工序" label="所属工序" show-overflow-tooltip align="center" />
        <el-table-column label="设备状态" width="70" align="center" filter-placement="bottom-end">
          <template #default="{ row }">
            <span :style="{ color: row.state === 1 ? 'lime' : 'orange' }"> · {{ row.state === 1 ? '在线' : '离线' }}</span>
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
import { deviceList } from './deviceList.js';
import { fetchDeviceData } from '../FireStatistics/start.js';

const store = useStore();
const alarmTable = ref()

const totalDeviceCount = ref(deviceList.length);
const onlineCount = ref(0);
const offlineCount = ref(0);

const tableData = ref(deviceList.map(item => ({
  ...item,
  state: 2 // 默认离线
})));

onMounted(() => {
  const getDeviceStatus = async () => {
    const ids = deviceList.map(item => item.设备位号);
    const concurrency = 10;
    const noValueDevices = [];

    // 分批并发执行单个查询，避免同时发起200+请求导致浏览器卡顿或被阻断
    for (let i = 0; i < ids.length; i += concurrency) {
      const chunk = ids.slice(i, i + concurrency);

      await Promise.allSettled(chunk.map(async (id) => {
        const currentItem = deviceList.find(item => item.设备位号 === id);
        try {
          const status = await fetchDeviceData(id);
          
          if (status === undefined || status === null) {
            noValueDevices.push(currentItem);
          }
          
          const isOnline = status === true || String(status).toLowerCase() === 'true';

          const targetRow = tableData.value.find(item => item.设备位号 === id);
          if (targetRow) {
            targetRow.state = isOnline ? 1 : 2;
          }

          if (isOnline) {
            onlineCount.value++;
          } else {
            offlineCount.value++;
          }
        } catch (error) {
          noValueDevices.push(currentItem);
          // 只记录离线，不打印过多的错误日志
          offlineCount.value++;
        }
      }));
    }
    
    if (noValueDevices.length > 0) {
      console.log(`有 ${noValueDevices.length} 个设备接口未返回value或调用失败:`);
      console.table(noValueDevices);
    }
  };

  getDeviceStatus();


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

.statistics-summary {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  margin-bottom: 5px;
  background: rgba(136, 181, 255, 0.1);
  border-radius: 4px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 14px;
  color: #c9d8ff;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
}

.stat-value.total {
  color: #fff;
}

.stat-value.online {
  color: lime;
}

.stat-value.offline {
  color: orange;
}

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