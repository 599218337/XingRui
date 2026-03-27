<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-18 14:12:00
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 临时调试列表: 移至页面上方正中间 -->
  <!-- <div class="debug-list-container">
    <div class="debug-header">调试列表: 设备位号 ({{ filteredDebugList.length }})</div>
    <el-input v-model="debugSearch" placeholder="搜索 ID 或名称..." size="small" clearable class="debug-search-input" />
    <div class="debug-scroll-area">
      <div v-for="item in filteredDebugList" :key="item.id" class="contentItem debug-list-item">
        <div class="Item" @click="queryDeviceData(item)" :title="item.name">
          <div class="point" style="background: #00FF7A"></div>
          <div class="text"><span style="color: #FFA940; margin-right: 4px;">{{ item.id }}</span> {{ item.name }}</div>
        </div>
        <div class="icon">
          <el-tooltip content="查看 (Fly to)" placement="top" popper-class="iconTooltip" :offset="3">
            <div class="view" @click.stop="queryDeviceData(item)"></div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div> -->

  <div class="fireStatistics"
    :style="{ transform: `translateX(${showContent ? 374 : 0}px)`, transition: 'transform 1s' }">
    <div class="widget">
      <div class="header">
        <span>实时告警</span>
      </div>
      <div class="content">
        <template v-if="alarmList.length > 0">
          <template v-for="item in alarmList" :key="item.id">
            <div class="contentItem">
              <div class="Item" :title="item.name">
                <div class="point" :style="{ background: item.color }"></div>
                <div class="text"><span :style="{ color: item.color, marginLeft: '4px', fontSize: '12px' }">[{{
                  item.alarmText }} {{ Number(item.currentValue).toFixed(2) }}] </span> {{ item.name }}
                </div>
              </div>
              <div class="icon">
                <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="view" @click.stop="queryDeviceData(item)"></div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </template>
        <div v-else
          style="text-align: center; color: #a2b0c1; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 14px; letter-spacing: 1px;">
          暂无警报
        </div>

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
    <div class="device-detail-popup__body" v-loading="loading" element-loading-background="rgba(8, 15, 24, 0.4)">

      <!-- 左侧：实时值 -->
      <div class="device-detail-popup__left">
        <div class="device-detail-popup__subtitle">
          <span>当前实时值</span>
        </div>
        <div class="device-detail-popup__content" style="flex: none;">
          <div class="device-detail-popup__row">
            <span class="device-detail-popup__label">设备名称</span>
            <span class="device-detail-popup__value">{{ currentDevice?.name || '--' }}</span>
          </div>
          <div class="device-detail-popup__row">
            <span class="device-detail-popup__label">当前数值</span>
            <span class="device-detail-popup__value">{{ (currentValue !== null && currentValue !== undefined &&
              currentValue !== '') ?
              Number(currentValue).toFixed(4) : '--' }}</span>
          </div>
          <div class="device-detail-popup__row">
            <span class="device-detail-popup__label">当前状态</span>
            <span class="device-detail-popup__value" :style="{ color: deviceStatus.color }">{{ deviceStatus.text
              }}</span>
          </div>
          <div v-if="currentGridCode" class="device-detail-popup__row">
            <span class="device-detail-popup__label">北斗码</span>
            <span class="device-detail-popup__value">{{ currentGridCode }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧：历史告警 -->
      <div class="device-detail-popup__right widget">
        <div class="header">
          <span>历史告警</span>
        </div>
        <div class="content" style="padding: 0;">
          <el-table class="custom-table" v-loading="deviceHistoryLoading" :data="deviceHistoryAlarms"
            style="width: 100%;" height="150" empty-text="暂无历史报警" element-loading-background="rgba(8, 15, 24, 0.4)">
            <el-table-column prop="time" label="报警时间" width="150"></el-table-column>
            <el-table-column prop="value" label="报警数值" width="100"></el-table-column>
            <el-table-column prop="type" label="报警类型">
              <template #default="scope">
                <span :style="{ color: scope.row.color }">{{ scope.row.type }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>
  </div>

  <!-- 右侧全部历史告警面板 -->
  <Teleport to="#home-container">
    <div class="fireStatisticsRight"
      :style="{ transform: `translateX(${showRightContent ? -374 : 0}px)`, transition: 'transform 1s' }">
      <div id="fireBtnRight" @click="showRightContentFuc"
        :style="{ background: showRightContent ? 'url(/image/zhankai.png)' : 'url(/image/shouqi.png)', backgroundSize: '100% 100%' }">
      </div>
      <div class="widget" style="display: flex; flex-direction: column;">
        <div class="header" style="flex: none;">
          <span>历史告警</span>
        </div>
        <div class="search-box custom-search"
          style="padding: 10px; display: flex; flex-direction: column; gap: 10px; flex: none;">
          <el-date-picker v-model="searchTimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" size="small" style="width: 100%;"
            popper-class="custom-popper" :teleported="false" @change="fetchGlobalHistoryAlarms" />
          <el-select v-model="searchName" placeholder="请选择设备名称" size="small" clearable filterable style="width: 100%;"
            popper-class="custom-popper" :teleported="false" empty-text="暂无匹配设备" @change="fetchGlobalHistoryAlarms">
            <el-option v-for="item in devicePVList" :key="item.id" :label="`${item.name} (${item.id})`"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: rgba(125, 194, 254, 0.6); font-size: 12px; margin-left: 15px;">{{
                item.id
                }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="content" style="padding: 0; flex: 1; min-height: 0;">
          <el-table class="custom-table" v-loading="globalHistoryLoading" :data="globalHistoryAlarms"
            style="width: 100%; height: 100%;" empty-text="暂无历史报警" element-loading-background="rgba(19, 44, 69, 0.4)">
            <el-table-column prop="time" label="报警时间" width="95" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="设备名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="value" label="报警数值" width="85"></el-table-column>
            <el-table-column prop="type" label="类型" width="60" show-overflow-tooltip>
              <template #default="scope">
                <span :style="{ color: scope.row.color }">{{ scope.row.type }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="line"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, reactive, onMounted, onUnmounted, computed, markRaw } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';
import { effectList } from './effectList';
import { fetchDeviceData } from './start';
import * as gs3d from '/public/gs3d/index';
import { devicePVList } from './devicesPVList';

const { viewer } = defineProps(['viewer'])
const dialogVisible = ref(false)
const loading = ref(false)
const currentDevice = ref({})
const currentValue = ref('')
const currentGridCode = ref('')
const isFlashOn = ref(true);
let flashTimer = null;
const gridAlarmPrimitives = ref([]);

const clearGridAlarms = () => {
  gridAlarmPrimitives.value.forEach(p => {
    if (p && !p.isDestroyed()) viewer.scene.primitives.remove(p);
  });
  gridAlarmPrimitives.value = [];
};

const renderAlarmGrid = (config, alarm) => {
  const Cesium = gs3d.Cesium;
  const { gridPoints, height: gridH } = config;
  if (!gridPoints?.length) return;

  const finalHeight = gridH || 1.0;
  const faceInstances = [];

  let baseMatrix;
  const entry = gs3d.global.variable.gs3dAllLayer.find(l => l.id === 'noWallBuild');
  const tileset = entry?.layer?.tileSet;
  if (tileset?.root?.computedTransform) {
    baseMatrix = Cesium.Matrix4.clone(tileset.root.computedTransform);
  } else {
    // Fallback: Use simple ENU
    const center = Cesium.Cartesian3.fromDegrees(gridPoints[0][1], gridPoints[0][0], 0);
    baseMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  }

  const originEcef = Cesium.Matrix4.getTranslation(baseMatrix, new Cesium.Cartesian3());
  const originCarto = Cesium.Cartographic.fromCartesian(originEcef);
  const originLat = Cesium.Math.toDegrees(originCarto.latitude);
  const originLng = Cesium.Math.toDegrees(originCarto.longitude);
  const cosOriginLat = Math.cos(originLat * Math.PI / 180);
  const R = 6378137;

  const alarmColor = Cesium.Color.fromCssColorString(alarm.color);
  // Grid flashing color toggle
  const flashColor = isFlashOn.value ? alarmColor.withAlpha(0.6) : alarmColor.withAlpha(0.05);

  gridPoints.forEach((pt, idx) => {
    const south = pt[0], west = pt[1], north = pt[2], east = pt[3];
    const centerLon = (west + east) / 2;
    const centerLat = (south + north) / 2;
    const nsMeters = (north - south) * Math.PI / 180 * R;
    const ewMeters = (east - west) * Math.PI / 180 * R * cosOriginLat;
    const eastOffset = (centerLon - originLng) * Math.PI / 180 * R * cosOriginLat;
    const northOffset = (centerLat - originLat) * Math.PI / 180 * R;
    const upOffset = config.altitude !== undefined ? config.altitude : 1.0;

    const localMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(eastOffset, northOffset, upOffset));
    faceInstances.push(new Cesium.GeometryInstance({
      id: `alarm_grid_${alarm.id}_${idx}`,
      geometry: Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(ewMeters, nsMeters, finalHeight),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      }),
      modelMatrix: localMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(flashColor)
      }
    }));
  });

  if (faceInstances.length) {
    const p = viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: faceInstances,
      appearance: new Cesium.PerInstanceColorAppearance({
        translucent: true,
        flat: true
      }),
      modelMatrix: baseMatrix,
      asynchronous: false
    }));
    gridAlarmPrimitives.value.push(markRaw(p));
  }
};

const updateGridAlarms = (list) => {
  clearGridAlarms();
  list.forEach(alarm => {
    const config = effectList.find(e => e.id === alarm.id);
    if (config && config.gridPoints) {
      renderAlarmGrid(config, alarm);
    }
  });
};
const debugSearch = ref('')
const filteredDebugList = computed(() => {
  if (!debugSearch.value) return devicePVList
  const s = debugSearch.value.toLowerCase()
  return devicePVList.filter(item =>
    item.id.toLowerCase().includes(s) ||
    item.name.toLowerCase().includes(s)
  )
})

// History Alarms Logic
const deviceHistoryAlarms = ref([])
const globalHistoryAlarms = ref([])
const searchTimeRange = ref([])
const searchName = ref('')
const globalHistoryLoading = ref(false)
const deviceHistoryLoading = ref(false)

const fetchHistoryAlarms = async (params) => {
  try {
    const queryParams = new URLSearchParams()
    if (params.deviceId) queryParams.append('deviceId', params.deviceId)
    if (params.startTime) queryParams.append('startTime', params.startTime)
    if (params.endTime) queryParams.append('endTime', params.endTime)

    const res = await fetch(`/nodeApi/alarmsHistory?${queryParams.toString()}`)
    const result = await res.json()
    if (result.code === 200) {
      return result.data || []
    }
  } catch (e) {
    console.error('Fetch history alarms error:', e)
  }
  return []
}

const formatAlarms = (list) => {
  return list.map(item => {
    let typeStr = item.alarm_type === 'HIGH' ? '高报' : item.alarm_type === 'LOW' ? '低报' : (item.alarm_type || item.type || '告警');
    if (typeStr === 'HIGH') typeStr = '高报';
    if (typeStr === 'LOW') typeStr = '低报';

    let color = '#FF4D4F';
    if (typeStr === '低报') color = '#FFA940';

    let timeStr = item.alert_time || item.time || item.created_at;
    if (timeStr) {
      let d = new Date(timeStr);
      if (isNaN(d.getTime()) && typeof timeStr === 'string') {
        d = new Date(timeStr.replace(/-/g, '/'));
      }
      if (!isNaN(d.getTime())) {
        const MM = String(d.getMonth() + 1).padStart(2, '0');
        const DD = String(d.getDate()).padStart(2, '0');
        const HH = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        timeStr = `${MM}/${DD} ${HH}:${mm}`;
      }
    }

    let rawValue = item.pv_value !== undefined && item.pv_value !== null ? item.pv_value : item.value;
    let valueStr = rawValue !== undefined && rawValue !== null && rawValue !== '' ? Number(rawValue).toFixed(4) : '--';

    return {
      time: timeStr,
      name: item.device_name || item.name,
      value: valueStr,
      type: typeStr,
      color: color
    }
  })
}

const fetchDeviceHistoryAlarms = async (deviceId) => {
  deviceHistoryLoading.value = true
  const data = await fetchHistoryAlarms({ deviceId })
  deviceHistoryAlarms.value = formatAlarms(data)
  deviceHistoryLoading.value = false
}

const fetchGlobalHistoryAlarms = async () => {
  globalHistoryLoading.value = true
  const params = {}
  if (searchName.value) params.deviceId = searchName.value
  if (searchTimeRange.value && searchTimeRange.value.length === 2) {
    params.startTime = searchTimeRange.value[0]
    params.endTime = searchTimeRange.value[1]
  }
  const data = await fetchHistoryAlarms(params)
  globalHistoryAlarms.value = formatAlarms(data)
  globalHistoryLoading.value = false
}

const deviceStatus = computed(() => {
  if (!currentDevice.value || currentValue.value === '' || currentValue.value === null || currentValue.value === undefined) {
    return { text: '--', color: '#fff' }
  }

  const alarmItem = store.state.alarmList.find(item => item.id === currentDevice.value.id)

  if (alarmItem) {
    return { text: alarmItem.alarmText + '警报', color: alarmItem.color }
  } else {
    return { text: '正常', color: '#00FF7A' }
  }
})

const showContent = ref(false)
const showRightContent = ref(false)
const alarmList = computed(() => store.state.alarmList)

onMounted(() => {
  store.dispatch('startPollingAlarms');
  fetchGlobalHistoryAlarms();

  // --- Simulation Start ---
  // Simulate an alarm for _2TIC_1201_AI1_PV (Grid-based alarm)
  const mockAlarm = [{
    id: '_2LI_1202_AI1_PV',
    name: '盐水中间池液位联锁报警',
    alarmText: '高报网格仿真',
    color: '#FF4D4F',
    currentValue: 65,
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    address: '模拟设备'
  }, {
    id: '_2AIC_1204_AI1_PV',
    name: '一次精盐水PH控制',
    alarmText: '高报网格仿真',
    color: '#FF4D4F',
    currentValue: 65,
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    address: '模拟设备'
  }];

  // Add to store's alarm list after a short delay
  setTimeout(() => {
    store.commit('setAlarmList', [...mockAlarm, ...store.state.alarmList]);
  }, 1500);
  // --- Simulation End ---

  flashTimer = setInterval(() => {
    isFlashOn.value = !isFlashOn.value;
  }, 500);

  setTimeout(() => {
    showContent.value = true
    showRightContent.value = true
  }, 100) // slight delay to allow DOM to render first, then apply transition
})

onUnmounted(() => {
  if (flashTimer) clearInterval(flashTimer);
  clearGridAlarms();
  const el = document.getElementById('map_tool')
  if (el) {
    el.style.transform = `translateX(0px)`
    el.style.transition = `transform 1s`
  }
})

const showContentFuc = () => {
  showContent.value = !showContent.value
}

const showRightContentFuc = () => {
  showRightContent.value = !showRightContent.value
}

watch(showRightContent, (val) => {
  const el = document.getElementById('map_tool')
  if (el) {
    el.style.transform = `translateX(${val ? -374 : 0}px)`
    el.style.transition = `transform 1s`
  }
})

const queryDeviceData = async (val) => {
  currentDevice.value = val
  dialogVisible.value = true
  loading.value = true
  fetchDeviceHistoryAlarms(val.id)

  const config = effectList.find(e => e.id === val.id)
  if (config && config.gridCodes) {
    currentGridCode.value = Array.isArray(config.gridCodes) ? config.gridCodes.join(', ') : config.gridCodes
  } else {
    currentGridCode.value = ''
  }

  try {
    const value = await fetchDeviceData(val.id)
    currentValue.value = value
    showWaterEffect(val.id, value)
  } catch (error) {
    console.error('Failed to fetch device data:', error)
    ElMessage.error('获取设备数据失败')
  } finally {
    loading.value = false
  }
}

const updateTilesetStyle = (list) => {
  const entry = gs3d.global.variable.gs3dAllLayer.find((layerItem) => layerItem.id === 'noWallBuild')
  const tileset = entry?.layer?.tileSet
  if (!tileset) return

  const conditions = []

  // 1. 根据当前报警列表构建高亮逻辑
  if (list && list.length > 0) {
    // 聚合模型名称及其对应的最高优先级颜色 (Red > Orange)
    const modelColorMap = new Map()

    list.forEach(alarm => {
      const config = effectList.find(e => e.id === alarm.id)
      // 如果有网格配置且没有名称配置，则不执行模型高亮/闪烁
      if (config && config.gridPoints && !config.name) return

      if (config && config.name) {
        const names = Array.isArray(config.name) ? config.name : [config.name]
        names.forEach(name => {
          const currentColor = modelColorMap.get(name)
          // 优先级：高报 (#ff1200) > 低报 (#FFA940)
          if (!currentColor || (alarm.color === '#ff1200' && currentColor !== '#ff1200')) {
            const displayColor = isFlashOn.value ? alarm.color : '#FFFFFF'
            modelColorMap.set(name, displayColor)
          }
        })
      }
    })

    // 将聚合后的模型颜色加入 conditions
    modelColorMap.forEach((color, name) => {
      conditions.push([`regExp('.*${name}.*').test(\${name})`, `color('${color}', 1.0)`])
      conditions.push([`regExp('.*${name}.*').test(\${id})`, `color('${color}', 1.0)`])
    })
  }

  // 2. 加上默认的基础颜色逻辑
  const isSpecialView = store.state.showFire || store.state.showGds
  const wallColor = isSpecialView ? "color('#bfbebe')" : "color('#0099FF')"

  conditions.push(["regExp('^jy_').test(${name})", "color('#CC0099')"])
  conditions.push(["regExp('^lq_').test(${name})", "color('#00CC33')"])
  conditions.push(["regExp('^qq_').test(${name})", "color('#1933CC')"])
  conditions.push(["regExp('^ys_').test(${name})", "color('#FFCC00')"])
  conditions.push(["true", wallColor])

  // --- 关键修改：读取并保留已有的显示（隐藏墙体）逻辑 ---
  const existingStyle = tileset.style
  const showConditions = existingStyle?._style?.show?.conditions

  const styleObj = {
    color: {
      conditions: conditions
    }
  }

  if (showConditions) {
    styleObj.show = { conditions: showConditions }
  }

  tileset.style = new gs3d.Cesium.Cesium3DTileStyle(styleObj)
}

// 监听 flash 状态变化，手动触发样式刷新
watch(isFlashOn, () => {
  updateTilesetStyle(alarmList.value);
  updateGridAlarms(alarmList.value);
});

// 监听 alarmList 变化，自动同步地图高亮并自动 FlyTo 新报警
watch(alarmList, (newList, oldList) => {
  updateTilesetStyle(newList)
  updateGridAlarms(newList)

  // 自动 FlyTo 最新加入的报警并打开详情
  if (newList.length > (oldList?.length || 0)) {
    const newAlarm = newList[0]; // 默认最新报警在列表首位
    if (newAlarm) {
      queryDeviceData(newAlarm);
    }
  }
}, { immediate: true, deep: true })

const currentPrimitives = ref([]);
const showWaterEffect = (id, value) => {
  currentPrimitives.value.forEach(prim => {
    viewer.scene.primitives.remove(prim);
  });
  currentPrimitives.value = []; // 清空数组
  const config = effectList.find(item => item.id === id)
  if (!config) return

  // 1. 如果有 type，渲染水体效果
  if (config.type) {
    const topWaterLevel = config.modelBottom + (Number(value) / config.maxValue) * config.modelHeight;    // 水面高度
    const poolBottomLevel = config.modelBottom;  // 底部高度

    let geometryInstance, surfaceGeometryInstance;

    if (config.type.includes('circle')) {
      const centerPosition = gs3d.Cesium.Cartesian3.fromDegrees(config.point[0], config.point[1]);
      const radius = config.radius;

      geometryInstance = new gs3d.Cesium.GeometryInstance({
        geometry: new gs3d.Cesium.EllipseGeometry({
          center: centerPosition,
          semiMajorAxis: radius,
          semiMinorAxis: radius,
          height: poolBottomLevel,
          extrudedHeight: Math.max(poolBottomLevel + 0.01, topWaterLevel - 0.01)
        }),
        attributes: {
          color: gs3d.Cesium.ColorGeometryInstanceAttribute.fromColor(
            new gs3d.Cesium.Color(0.0, 0.4, 0.8, 0.4)
          )
        }
      });

      surfaceGeometryInstance = new gs3d.Cesium.GeometryInstance({
        geometry: new gs3d.Cesium.EllipseGeometry({
          center: centerPosition,
          semiMajorAxis: radius,
          semiMinorAxis: radius,
          height: topWaterLevel
        }),
        attributes: {
          color: gs3d.Cesium.ColorGeometryInstanceAttribute.fromColor(
            new gs3d.Cesium.Color(0.0, 0.4, 0.8, 0.6)
          )
        }
      });
    } else {
      const waterPositions = gs3d.Cesium.Cartesian3.fromDegreesArray(config.coordinates);

      geometryInstance = new gs3d.Cesium.GeometryInstance({
        geometry: new gs3d.Cesium.PolygonGeometry({
          polygonHierarchy: new gs3d.Cesium.PolygonHierarchy(waterPositions),
          height: poolBottomLevel,
          extrudedHeight: Math.max(poolBottomLevel + 0.01, topWaterLevel - 0.01)
        }),
        attributes: {
          color: gs3d.Cesium.ColorGeometryInstanceAttribute.fromColor(
            new gs3d.Cesium.Color(0.0, 0.4, 0.8, 0.4)
          )
        }
      });

      surfaceGeometryInstance = new gs3d.Cesium.GeometryInstance({
        geometry: new gs3d.Cesium.PolygonGeometry({
          polygonHierarchy: new gs3d.Cesium.PolygonHierarchy(waterPositions),
          height: topWaterLevel,
          vertexFormat: gs3d.Cesium.VertexFormat.POSITION_NORMAL_AND_ST
        })
      });
    }

    const waterVolumePrimitive = new gs3d.Cesium.Primitive({
      geometryInstances: geometryInstance,
      appearance: new gs3d.Cesium.PerInstanceColorAppearance({
        translucent: true,
        closed: true
      })
    });

    const waterSurfacePrimitive = new gs3d.Cesium.Primitive({
      geometryInstances: surfaceGeometryInstance,
      appearance: new gs3d.Cesium.EllipsoidSurfaceAppearance({
        aboveGround: true,
        material: gs3d.Cesium.Material.fromType('Water', {
          baseWaterColor: new gs3d.Cesium.Color(0.0, 0.4, 0.8, 0.6),
          normalMap: '/image/waterNormals.jpg',
          frequency: 100.0,
          animationSpeed: 0.02,
          amplitude: 5.0
        })
      })
    });

    viewer.scene.primitives.add(waterVolumePrimitive);
    viewer.scene.primitives.add(waterSurfacePrimitive);
    currentPrimitives.value.push(markRaw(waterVolumePrimitive), markRaw(waterSurfacePrimitive));
  }

  // 2. 统一飞向目标点 (始终飞向 config.point)
  if (config.flytoPoint && config.flyto) {
    const centerPosition = gs3d.Cesium.Cartesian3.fromDegrees(config.flytoPoint[0], config.flytoPoint[1]);
    const flyToTarget = new gs3d.Cesium.BoundingSphere(centerPosition, 0);
    viewer.camera.flyToBoundingSphere(flyToTarget, {
      offset: new gs3d.Cesium.HeadingPitchRange(
        gs3d.Cesium.Math.toRadians(config.flyto[0]),
        gs3d.Cesium.Math.toRadians(config.flyto[1]),
        config.flyto[2]
      ),
      duration: 1.5
    });
  }
}

</script>

<style lang="scss" scoped>
@import url('./FireStatistics.scss');

.debug-list-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  width: 400px;
  background: rgba(8, 22, 38, 0.95);
  border: 1px solid rgba(12, 137, 234, 0.8);
  border-radius: 4px;
  padding: 10px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(12, 137, 234, 0.5);

  .debug-header {
    color: #7dc2fe;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(12, 137, 234, 0.3);
    padding-bottom: 4px;
    text-align: center;
  }

  .debug-search-input {
    margin-bottom: 8px;

    :deep(.el-input__wrapper) {
      background-color: rgba(19, 44, 69, 0.8) !important;
      box-shadow: 0 0 0 1px rgba(12, 137, 234, 0.5) inset !important;
    }

    :deep(.el-input__inner) {
      color: #fff !important;
      font-size: 12px;
    }
  }

  .debug-scroll-area {
    overflow-y: auto;
    flex: 1;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(12, 137, 234, 0.6);
      border-radius: 3px;
    }

    .contentItem {
      margin-bottom: 2px;
      padding: 6px 4px;
      border-bottom: 1px solid rgba(12, 137, 234, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .Item {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        cursor: pointer;
        min-width: 0;

        .text {
          color: #fff;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &:hover {
            color: #7dc2fe;
          }
        }
      }

      .icon {
        flex: none;
      }
    }
  }
}

:deep(.custom-table) {
  --el-table-border: none;
  --el-table-border-color: rgba(12, 137, 234, 0.2);
  --el-table-header-bg-color: rgba(19, 44, 69, 0.8);
  --el-table-header-text-color: #7dc2fe;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(12, 137, 234, 0.2);
  --el-table-text-color: #fff;
  --el-fill-color-blank: transparent;
  --el-table-bg-color: transparent;
  background-color: transparent;

  tr {
    background-color: transparent;
  }

  th.el-table__cell,
  td.el-table__cell {
    border-bottom: 1px solid var(--el-table-border-color);
  }

  th.el-table__cell {
    background-color: var(--el-table-header-bg-color);
  }

  &::before {
    display: none;
  }
}

:deep(.custom-search) {
  background: rgba(8, 15, 24, 0.4);

  .el-input__wrapper,
  .el-select__wrapper {
    background-color: rgba(19, 44, 69, 0.4) !important;
    border: 1px solid rgba(12, 137, 234, 0.4) !important;
    box-shadow: none !important;
  }

  .el-input__wrapper:hover,
  .el-select__wrapper:hover {
    border-color: rgba(12, 137, 234, 0.8) !important;
  }

  .el-input__wrapper.is-focus,
  .el-select__wrapper.is-focused,
  .el-select__wrapper.is-hovering {
    border-color: #7dc2fe !important;
  }

  .el-input__inner,
  .el-select__selected-item {
    color: #fff !important;
  }

  .el-select__placeholder {
    color: #7dc2fe !important;
  }

  .el-range-input {
    color: #fff !important;
    background: transparent !important;
  }

  .el-range-separator {
    color: #7dc2fe !important;
  }
}
</style>

<style lang="scss">
.iconTooltip {
  background-color: rgba(39, 53, 70, 1) !important;
  border: 1px solid rgba(12, 137, 234, 0.40) !important;
  border-radius: 2px !important;
}

.custom-popper.el-popper {
  background-color: rgba(8, 22, 38, 0.95) !important;
  border: 1px solid rgba(12, 137, 234, 0.6) !important;
  box-shadow: 0 0 15px rgba(12, 137, 234, 0.4) !important;
}

.custom-popper .el-popper__arrow::before {
  background-color: rgba(8, 22, 38, 0.95) !important;
  border: 1px solid rgba(12, 137, 234, 0.6) !important;
}

.custom-popper .el-select-dropdown__item {
  color: #7dc2fe !important;
}

.custom-popper .el-select-dropdown__empty {
  color: #7dc2fe !important;
  background-color: transparent !important;
}

.custom-popper .el-select-dropdown__item:hover,
.custom-popper .el-select-dropdown__item.hover,
.custom-popper .el-select-dropdown__item.is-hovering {
  background-color: rgba(12, 137, 234, 0.3) !important;
  color: #fff !important;
}

.custom-popper .el-select-dropdown__item.selected {
  color: #fff !important;
  font-weight: bold;
}

.custom-popper .el-picker-panel,
.custom-popper .el-date-range-picker {
  background: transparent !important;
  color: #fff !important;
  border: none !important;
}

.custom-popper .el-date-table th {
  color: #7dc2fe !important;
  border-bottom: 1px solid rgba(12, 137, 234, 0.2) !important;
}

.custom-popper .el-date-table td .el-date-table-cell {
  color: #fff !important;
}

.custom-popper .el-date-table td.in-range .el-date-table-cell {
  background-color: rgba(12, 137, 234, 0.2) !important;
}

.custom-popper .el-date-table td.start-date .el-date-table-cell__text,
.custom-popper .el-date-table td.end-date .el-date-table-cell__text {
  background-color: #0c89ea !important;
}

.custom-popper .el-date-picker__header-label,
.custom-popper .el-date-range-picker__header div {
  color: #7dc2fe !important;
}

.custom-popper .el-picker-panel__icon-btn {
  color: #7dc2fe !important;
}

.custom-popper .el-time-panel {
  background-color: rgba(8, 22, 38, 0.95) !important;
  border: 1px solid rgba(12, 137, 234, 0.6) !important;
}

.custom-popper .el-time-spinner__item {
  color: #7dc2fe !important;
}

.custom-popper .el-time-spinner__item:hover {
  background-color: rgba(12, 137, 234, 0.3) !important;
}

.custom-popper .el-time-spinner__item.active {
  color: #fff !important;
}

.custom-popper .el-date-table td.disabled .el-date-table-cell {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #666 !important;
}

/* Time Picker Footer & Buttons */
.custom-popper .el-picker-panel__footer {
  background-color: rgba(8, 22, 38, 0.98) !important;
  border-top: 1px solid rgba(12, 137, 234, 0.4) !important;
}

.custom-popper .el-button {
  background-color: rgba(19, 44, 69, 0.6) !important;
  border: 1px solid rgba(12, 137, 234, 0.6) !important;
  color: #7dc2fe !important;
}

.custom-popper .el-button:hover {
  background-color: rgba(12, 137, 234, 0.3) !important;
  color: #fff !important;
  border-color: #7dc2fe !important;
}

.custom-popper .el-button.is-text {
  background-color: transparent !important;
  border: none !important;
}

.custom-popper .el-button--primary {
  background-color: rgba(12, 137, 234, 0.4) !important;
  border-color: #7dc2fe !important;
  color: #fff !important;
}

/* Time Panel Inputs */
.custom-popper .el-time-panel__content {
  border-top: 1px solid rgba(12, 137, 234, 0.2) !important;
}

.custom-popper .el-time-panel__footer {
  border-top: 1px solid rgba(12, 137, 234, 0.2) !important;
  background-color: rgba(8, 22, 38, 0.98) !important;
}

.custom-popper .el-input__wrapper {
  background-color: rgba(19, 44, 69, 0.6) !important;
  box-shadow: 0 0 0 1px rgba(12, 137, 234, 0.4) inset !important;
}

.custom-popper .el-input__inner {
  color: #fff !important;
}
</style>