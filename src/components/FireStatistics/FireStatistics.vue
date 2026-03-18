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
        </div>
      </div>

      <!-- 右侧：历史告警 -->
      <div class="device-detail-popup__right widget">
        <div class="header">
          <span>历史告警</span>
        </div>
        <div class="content" style="padding: 0;">
          <el-table class="custom-table" :data="[]" style="width: 100%; height: 100%;" empty-text="暂无历史报警">
            <el-table-column prop="time" label="报警时间" width="160"></el-table-column>
            <el-table-column prop="value" label="报警数值" width="100"></el-table-column>
            <el-table-column prop="type" label="报警类型"></el-table-column>
          </el-table>
        </div>
      </div>

    </div>
  </div>

  <!-- 右侧全部历史告警面板 -->
  <div class="fireStatisticsRight"
    :style="{ transform: `translateX(${showRightContent ? -374 : 0}px)`, transition: 'transform 1s' }">
    <div id="fireBtnRight" @click="showRightContentFuc"
      :style="{ background: showRightContent ? 'url(/image/zhankai.png)' : 'url(/image/shouqi.png)', backgroundSize: '100% 100%' }">
    </div>
    <div class="widget">
      <div class="header">
        <span>历史告警</span>
      </div>
      <div class="content" style="padding: 0;">
        <el-table class="custom-table" :data="[]" style="width: 100%; height: 100%;" empty-text="暂无历史报警">
          <el-table-column prop="time" label="报警时间" width="95" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="value" label="报警数值" width="80"></el-table-column>
          <el-table-column prop="type" label="类型" width="55" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, onUnmounted, computed, markRaw } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';
import { devicePVList } from './devicesPVList';
import { effectList } from './effectList';
import { fetchDeviceData } from './start';
import * as gs3d from '/public/gs3d/index';
const { viewer } = defineProps(['viewer'])
const dialogVisible = ref(false)
const loading = ref(false)
const currentDevice = ref({})
const currentValue = ref('')

const deviceStatus = computed(() => {
  if (!currentDevice.value || currentValue.value === '' || currentValue.value === null || currentValue.value === undefined) {
    return { text: '--', color: '#fff' }
  }

  const config = devicePVList.find(item => item.id === currentDevice.value.id)
  if (!config) {
    return { text: '正常', color: '#00FF7A' }
  }

  const val = Number(currentValue.value)
  if (val > config.maxValue) {
    return { text: '过高警报', color: '#FF4D4F' }
  } else if (val < config.minValue) {
    return { text: '过低警报', color: '#FFA940' }
  } else {
    return { text: '正常', color: '#00FF7A' }
  }
})

const showContent = ref(false)
const showRightContent = ref(false)
const alarmList = computed(() => store.state.alarmList)

onMounted(() => {
  store.dispatch('startPollingAlarms');
  setTimeout(() => {
    showContent.value = true
    showRightContent.value = true
  }, 100) // slight delay to allow DOM to render first, then apply transition
})

onUnmounted(() => {
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
const currentPrimitives = ref([]);
const showWaterEffect = (id, value) => {
  currentPrimitives.value.forEach(prim => {
    viewer.scene.primitives.remove(prim);
  });
  currentPrimitives.value = []; // 清空数组
  const config = effectList.find(item => item.id === id)
  if (!config) return

  // 如果没有 type，表示不需要渲染效果，直接执行 flyto
  if (!config.type) {
    if (config.point) {
      const centerPosition = gs3d.Cesium.Cartesian3.fromDegrees(config.point[0], config.point[1]);
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
    return;
  }

  const topWaterLevel = config.modelBottom + (Number(value) / config.maxValue) * config.modelHeight;    // 水面高度
  const poolBottomLevel = config.modelBottom;  // 底部高度

  let geometryInstance, surfaceGeometryInstance, flyToTarget;

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
          new gs3d.Cesium.Color(0.0, 0.4, 0.8, 0.4) // 调节 0.4 改变水的清澈度
        )
      }
    });

    // surfaceGeometryInstance = new gs3d.Cesium.GeometryInstance({
    //   geometry: new gs3d.Cesium.EllipseGeometry({
    //     center: centerPosition,
    //     semiMajorAxis: radius,
    //     semiMinorAxis: radius,
    //     height: topWaterLevel
    //   })
    // });
    surfaceGeometryInstance = new gs3d.Cesium.GeometryInstance({
      geometry: new gs3d.Cesium.EllipseGeometry({
        center: centerPosition,
        semiMajorAxis: radius,
        semiMinorAxis: radius,
        height: topWaterLevel
      }),
      // 【必须加上这一句】
      attributes: {
        color: gs3d.Cesium.ColorGeometryInstanceAttribute.fromColor(
          new gs3d.Cesium.Color(0.0, 0.4, 0.8, 0.6)
        )
      }
    });

    flyToTarget = new gs3d.Cesium.BoundingSphere(centerPosition, radius);
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

    flyToTarget = gs3d.Cesium.BoundingSphere.fromPoints(waterPositions);
  }

  // ==========================================
  // 第一层：水体 (提供体积感和深度)
  // ==========================================
  const waterVolumePrimitive = new gs3d.Cesium.Primitive({
    geometryInstances: geometryInstance,
    // appearance: new gs3d.Cesium.MaterialAppearance({
    //   material: gs3d.Cesium.Material.fromType('Color', {
    //     color: new gs3d.Cesium.Color(0.0, 0.4, 0.8, 0.4)
    //   }),
    //   translucent: true,
    //   closed: true
    // })
    appearance: new gs3d.Cesium.PerInstanceColorAppearance({
      translucent: true,
      closed: true
    })
  });

  // ==========================================
  // 第二层：水面 (提供生动的波纹和反光)
  // ==========================================
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

  // 飞向目标区域
  viewer.camera.flyToBoundingSphere(flyToTarget, {
    offset: new gs3d.Cesium.HeadingPitchRange(
      gs3d.Cesium.Math.toRadians(config.flyto[0]),
      gs3d.Cesium.Math.toRadians(config.flyto[1]),
      config.flyto[2]
    ),
    duration: 1.5
  });
}
</script>

<style lang="scss" scoped>
@import url('./FireStatistics.scss');

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
</style>

<style lang="scss">
.iconTooltip {
  background-color: rgba(39, 53, 70, 1) !important;
  border: 1px solid rgba(12, 137, 234, 0.40) !important;
  border-radius: 2px !important;
}
</style>