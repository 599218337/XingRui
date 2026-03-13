<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-18 14:12:00
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="fireStatistics"
    :style="{ transform: `translateX(${showContent ? 374 : 0}px)`, transition: 'transform 1s' }">
    <div class="widget">
      <div class="header">
        <span>设备列表</span>
      </div>
      <div class="content">
        <template v-for="item in devicePVList" :key="item.id">
          <div class="contentItem">
            <div class="Item" :title="item.name">
              <div class="point" style="background: #00FF7A"></div>
              <div class="text">{{ item.name }}</div>
            </div>
            <div class="icon">
              <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                <div class="view" @click.stop="queryDeviceData(item)"></div>
              </el-tooltip>
            </div>
          </div>
        </template>

      </div>
      <div class="line"></div>

    </div>
    <div id="fireBtn" @click="showContentFuc"
      :style="{ background: showContent ? 'url(/image/shouqi.png)' : 'url(/image/zhankai.png)', backgroundSize: '100% 100%' }">
    </div>

  </div>

  <!-- 设备详情弹窗 -->
  <div v-if="dialogVisible" class="device-detail-popup">
    <div class="device-detail-popup__header">
      <span>设备数据</span>
      <button class="device-detail-popup__close" @click="dialogVisible = false"></button>
    </div>
    <div class="device-detail-popup__body">
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">设备名称</span>
        <span class="device-detail-popup__value">{{ currentDevice?.name || '--' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">当前数值</span>
        <span class="device-detail-popup__value">{{ currentValue !== null && currentValue !== undefined ? currentValue : '--' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';
import { devicePVList } from './devicesPVList';
import { fetchDeviceData } from './start';

const dialogVisible = ref(false)
const currentDevice = ref({})
const currentValue = ref('')

onMounted(() => {
})
const showContent = ref(false)
onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 100) // slight delay to allow DOM to render first, then apply transition
})
const showContentFuc = () => {
  showContent.value = !showContent.value
}

const queryDeviceData = async (val) => {
  if (!val.id) {
    ElMessage({
      type: 'warning',
      message: `${val.name}数据缺失！`
    })
    return
  }

  try {
    const value = await fetchDeviceData(val.id)
    currentDevice.value = val
    currentValue.value = value
    dialogVisible.value = true
  } catch (err) {
    ElMessage({
      type: 'error',
      message: err.message || '获取数据失败'
    })
  }
}
</script>

<style lang="scss" scoped>
@import url('./FireStatistics.scss');
</style>

<style lang="scss">
.iconTooltip {
  background-color: rgba(39, 53, 70, 1) !important;
  border: 1px solid rgba(12, 137, 234, 0.40) !important;
  border-radius: 2px !important;
}
</style>