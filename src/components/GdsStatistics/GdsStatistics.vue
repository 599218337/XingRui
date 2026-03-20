<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 17:38:24
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cameraStatistics"
    :style="{ transform: `translateX(${showContent ? 374 : 0}px)`, transition: 'transform 1s' }">
    <div class="widget">
      <div class="header">
        <span>气体统计</span>
      </div>
      <div class="searchBox">
        <el-input v-model="searchModelName" placeholder="请输入关键字进行过滤" clearable />
      </div>
      <div class="content">
        <template v-for="(items, category) in groupedDeviceList" :key="category">
          <div class="categoryHeader" v-if="items && items.length">{{ category }}</div>
          <template v-for="item in items" :key="item.position_code">
            <div class="contentItem">
              <div class="Item">
                <div class="point" :style="{ background: deviceStatus[item.position_code]?.color || '#00FF7A' }"></div>
                <div class="text">{{ item.position_code }} - {{ item.location }}</div>
              </div>
              <div class="icon">
                <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="view" @click.stop="focusModelByName(item)"></div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </template>

      </div>
      <div class="line"></div>

    </div>
    <div id="cameraBtn" @click="showContentFuc"
      :style="{ background: showContent ? 'url(/image/shouqi.png)' : 'url(/image/zhankai.png)', backgroundSize: '100% 100%' }">
    </div>

  </div>

</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted } from 'vue'
import { useStore } from "vuex";
import axios from 'axios';
const store = useStore();

import emitter from '@/utils/bus'
import { gdsDataPoints } from './gds-data-points.js'
import { fetchDeviceData } from '../FireStatistics/start.js'
import * as gs3d from '/public/gs3d/index'
import { geosotToBeiDou2D } from '../DevicesListPoi/geosot2bdcode.js'

const { viewer } = defineProps(['viewer'])
// 按 type 分组
const groupedDeviceList = computed(() => {
  const groups = {}
  gdsDataPoints.forEach(item => {
    const keyword = searchModelName.value ? searchModelName.value.toLowerCase() : ''
    if (keyword) {
      const matchTag = item.position_code && item.position_code.toLowerCase().includes(keyword)
      const matchDesc = item.location && item.location.toLowerCase().includes(keyword)
      if (!matchTag && !matchDesc) {
        return // skip this item
      }
    }
    const key = item.type || '其他'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })
  return groups
})



const searchModelName = ref('')

// 状态追踪
const deviceStatus = ref({}) // { position_code: { value: 0, color: '#00FF7A' } }

const getNumericValue = (str) => {
  if (typeof str !== 'string') return str || 0
  const num = parseFloat(str.replace(/[^0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}

const getStatusColor = (item, value) => {
  const first = getNumericValue(item.first_alarm)
  const second = getNumericValue(item.second_alarm)

  if (value >= second) return '#FF4D4F' // 2级报警 - 红色
  if (value >= first) return '#FFA940'  // 1级报警 - 橙色
  return '#00FF7A' // 正常 - 绿色
}

const fetchStatuses = async () => {
  for (const item of gdsDataPoints) {
    try {
      const val = await fetchDeviceData(item.position_code)
      deviceStatus.value[item.position_code] = {
        value: val,
        color: getStatusColor(item, val)
      }
    } catch (error) {
      console.error(`Failed to fetch status for ${item.position_code}:`, error)
      // 保持之前的状态或设为默认
      if (!deviceStatus.value[item.position_code]) {
        deviceStatus.value[item.position_code] = { value: 0, color: '#00FF7A' }
      }
    }
  }
}

const focusModelByName = (item) => {
  const entry = gs3d.global.variable.gs3dAllLayer.find((layerItem) => layerItem.id === 'noWallBuild')
  const tileset = entry?.layer?.tileSet
  if (!tileset) {
    ElMessage.error('模型未加载')
    return
  }

  // 使用 3D Tiles 样式高亮指定的模型 (基于 name 或 id 属性), 支持模糊查询
  const nameToFind = item.position_code;
  if (!nameToFind) return;

  tileset.style = new gs3d.Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        [`regExp('.*${nameToFind}.*').test(\${name})`, "color('yellow', 1.0)"],
        [`regExp('.*${nameToFind}.*').test(\${id})`, "color('yellow', 1.0)"],
        // 恢复原有基础颜色逻辑
        ["regExp('^jy_').test(${name})", "color('#CC0099')"],
        ["regExp('^lq_').test(${name})", "color('#00CC33')"],
        ["regExp('^qq_').test(${name})", "color('#1933CC')"],
        ["regExp('^ys_').test(${name})", "color('#FFCC00')"],
        ["true", "color('#0099FF')"]
      ]
    }
  });

  // 飞向目标区域
  if (item.point && item.flyto) {
    const centerPosition = gs3d.Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1]);
    const flyToTarget = new gs3d.Cesium.BoundingSphere(centerPosition, 0);
    viewer.camera.flyToBoundingSphere(flyToTarget, {
      offset: new gs3d.Cesium.HeadingPitchRange(
        gs3d.Cesium.Math.toRadians(item.flyto[0]),
        gs3d.Cesium.Math.toRadians(item.flyto[1]),
        item.flyto[2]
      ),
      duration: 1.5
    });
  }

  ElMessage.success(`已高亮模型: ${nameToFind}`);
}

onMounted(() => {
  fetchStatuses()
  const timer = setInterval(fetchStatuses, 10000) // 每10秒更新一次

  setTimeout(() => {
    showContent.value = true
  }, 100) // slight delay to allow DOM to render first, then apply transition
})
const showContent = ref(false)
const showContentFuc = () => {
  showContent.value = !showContent.value
}


</script>

<style lang="scss" scoped>
@import url('./GdsStatistics.scss');
</style>

<style lang="scss">
.iconTooltip {
  background-color: rgba(39, 53, 70, 1) !important;
  border: 1px solid rgba(12, 137, 234, 0.40) !important;
  border-radius: 2px !important;
}
</style>