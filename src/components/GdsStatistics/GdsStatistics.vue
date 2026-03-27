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
                <div
                  v-if="deviceStatus[item.position_code]?.color === '#FF4D4F' || deviceStatus[item.position_code]?.color === '#FFA940'"
                  class="abnormal-tag">异常</div>
                <div v-else class="point" :style="{ background: deviceStatus[item.position_code]?.color || '#00FF7A' }">
                </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from "vuex";
import axios from 'axios';
const store = useStore();

import emitter from '@/utils/bus'
import { gdsDataPoints } from './gds-data-points.js'
import { fetchDeviceData } from '../FireStatistics/start.js'
import * as gs3d from '/public/gs3d/index'
import { geosotToBeiDou2D } from '../DevicesListPoi/geosot2bdcode.js'
import { initElliposidWaveMaterial } from './material.js'

const { viewer } = defineProps(['viewer'])

const activeEntities = {};
const activeOverlays = {};
const activeGasLeaks = {};

let gasTextureUrl = '';
function getGasTexture() {
  if (gasTextureUrl) return gasTextureUrl;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();
  gasTextureUrl = canvas.toDataURL('image/png');
  return gasTextureUrl;
}

function createOrUpdateGasLeak(viewer, id, position, colorStr, gasType) {
  if (!viewer) return;
  if (activeGasLeaks[id]) return; // 已存在则跳过
  const color = gs3d.Cesium.Color.fromCssColorString(colorStr);
  const point = gs3d.Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.h || 0);
  const modelMatrix = gs3d.Cesium.Transforms.eastNorthUpToFixedFrame(point);

  const isLightGas = gasType === '氢气' || gasType === '甲烷' || gasType === '天然气' || gasType === '氨气';

  let particleOptions;
  if (isLightGas) {
    // 场景A：轻气体向上快速喷射
    particleOptions = {
      image: getGasTexture(),
      startColor: color.withAlpha(0.8),
      endColor: color.withAlpha(0.0),
      imageSize: new gs3d.Cesium.Cartesian2(5, 5), // 稍微调大基础大小
      startScale: 0.5,
      endScale: 8.0,
      minimumParticleLife: 0.0,
      maximumParticleLife: 1.0,
      minimumSpeed: 2.0,
      maximumSpeed: 5.0,
      emissionRate: 480.0,
      // 增大发射锥角，让气体向四周有扩散效果
      emitter: new gs3d.Cesium.ConeEmitter(gs3d.Cesium.Math.toRadians(35.0)),
      modelMatrix: modelMatrix,
      loop: true
    };
  } else {
    // 场景B：重气体缓慢向四周弥漫（贴地扩散）
    // 计算局部坐标系中的"向下"方向（在世界坐标系中）
    const localUp = gs3d.Cesium.Matrix4.getColumn(modelMatrix, 2, new gs3d.Cesium.Cartesian4());
    const gravityDirection = new gs3d.Cesium.Cartesian3(-localUp.x, -localUp.y, -localUp.z);
    gs3d.Cesium.Cartesian3.normalize(gravityDirection, gravityDirection);
    const gravityScratch = new gs3d.Cesium.Cartesian3();

    particleOptions = {
      image: getGasTexture(),
      startColor: color.withAlpha(0.8),
      endColor: color.withAlpha(0.0),
      imageSize: new gs3d.Cesium.Cartesian2(4, 4),
      startScale: 2.0,
      endScale: 10.0,
      minimumParticleLife: 3.0,
      maximumParticleLife: 6.0,
      minimumSpeed: 0.5,
      maximumSpeed: 2.0,
      emissionRate: 50.0,
      // 使用 CircleEmitter 替代 SphereEmitter，粒子只在水平面内发射
      emitter: new gs3d.Cesium.CircleEmitter(2.0),
      modelMatrix: modelMatrix,
      loop: true,
      // 添加重力回调，将粒子向下拉，防止飘向天空
      updateCallback: (particle, dt) => {
        const gravityForce = 1.5; // 重力强度(m/s²)
        gs3d.Cesium.Cartesian3.multiplyByScalar(gravityDirection, gravityForce * dt, gravityScratch);
        gs3d.Cesium.Cartesian3.add(particle.velocity, gravityScratch, particle.velocity);
      }
    };
  }

  const particleSystem = viewer.scene.primitives.add(new gs3d.Cesium.ParticleSystem(particleOptions));
  activeGasLeaks[id] = particleSystem;
}

function removeGasLeak(viewer, id) {
  if (activeGasLeaks[id] && viewer) {
    viewer.scene.primitives.remove(activeGasLeaks[id]);
    delete activeGasLeaks[id];
  }
}

let initialCameraView = null;
let previousAlarms = [];

class HtmlOverlay {
  constructor(viewer, data) {
    this.viewer = viewer;
    this.data = data;
    this.position = gs3d.Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.h);

    this.element = document.createElement('div');
    this.element.className = 'alarm-panel-content';
    this.element.id = `panel-${this.data.id}`;

    document.body.appendChild(this.element);

    this.updateData(data);

    this.removeListener = this.viewer.scene.postRender.addEventListener(this.updatePosition.bind(this));
  }

  updatePosition() {
    if (!this.viewer || !this.viewer.scene) return;
    const canvasPosition = this.viewer.scene.cartesianToCanvasCoordinates(this.position);

    if (gs3d.Cesium.defined(canvasPosition)) {
      const occluder = new gs3d.Cesium.EllipsoidalOccluder(gs3d.Cesium.Ellipsoid.WGS84, this.viewer.camera.position);

      // 计算相机到点的距离
      const distance = gs3d.Cesium.Cartesian3.distance(this.viewer.camera.position, this.position);
      // 如果不是正常状态（绿色），则不受距离限制，直接显示
      const isNormalStatus = this.data.color === '#00FF7A';
      const isNear = distance < MAX_VISIBLE_DISTANCE;

      if (occluder.isPointVisible(this.position) && (!isNormalStatus || isNear)) {
        if (this.data.visible !== false) {
          this.element.style.display = 'block';
        }
        this.element.style.left = (canvasPosition.x + 15) + 'px';
        this.element.style.top = (canvasPosition.y - this.element.offsetHeight / 2) + 'px';
      } else {
        this.element.style.display = 'none';
      }
    } else {
      this.element.style.display = 'none';
    }
  }

  updateData(newData) {
    this.data = { ...this.data, ...newData };

    this.element.style.borderColor = this.data.color;
    this.element.style.boxShadow = `0 0 15px ${this.data.color}99`; // Add some transparency hex

    this.element.innerHTML = this._buildHtml();

    const closeBtn = this.element.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.data.visible = false;
        this.element.style.display = 'none';
      };
    }
  }

  destroy() {
    if (this.removeListener) this.removeListener();
    if (this.element.parentNode) this.element.parentNode.removeChild(this.element);
  }

  _buildHtml() {
    return `
      <style>
          #panel-${this.data.id}::after {
              border-color: transparent ${this.data.color} transparent transparent !important;
          }
          #panel-${this.data.id} .panel-header {
              color: ${this.data.color};
              border-bottom: 1px solid ${this.data.color}66;
          }
      </style>
      <div class="panel-header">
          <span>气体报警</span>
          <span class="close-btn">&times;</span>
      </div>
      <div class="panel-row"><span class="label">位号:</span><span class="value">${this.data.id}</span></div>
      <div class="panel-row"><span class="label">名称:</span><span class="value">${this.data.name}</span></div>
      <div class="panel-row"><span class="label">类型:</span><span class="value">${this.data.type}</span></div>
      <div class="panel-row"><span class="label">当前浓度:</span><span class="value status-high" style="color: ${this.data.color}">${Number(this.data.value).toFixed(4)} ppm</span></div>
    `;
  }
}

// 波纹参数
const RIPPLE_RADIUS = 2.8;     // 波纹圆的半径(米)
const MAX_VISIBLE_DISTANCE = 30.0; // 弹窗显示的最大距离阈值(米)

function createOrUpdateDynamicRippleSphere(id, position, colorStr) {
  if (!viewer) return;

  let color = gs3d.Cesium.Color.fromCssColorString(colorStr);

  if (activeEntities[id]) {
    // 更新颜色
    if (activeEntities[id].baseColor.toCssColorString() !== color.toCssColorString()) {
      activeEntities[id].baseColor = color;
      if (activeEntities[id].materialProperty) {
        activeEntities[id].materialProperty.color = color;
      }
    }
    return;
  }

  const lon = position.lon;
  const lat = position.lat;
  const h = position.h || 0;

  const ElliposidWaveMaterialProperty = initElliposidWaveMaterial();

  const materialProperty = new ElliposidWaveMaterialProperty({
    color: color,
    duration: 6000, // 动画周期(毫秒)
    count: 3,       // 波纹数量
    gradient: 0.8   // 渐变系数 (调大可让波纹更粗)
  });

  activeEntities[id] = { baseColor: color, materialProperty: materialProperty, entities: [] };

  const entity = viewer.entities.add({
    id: `gds_ripple_${id}`,
    position: gs3d.Cesium.Cartesian3.fromDegrees(lon, lat),
    ellipse: {
      semiMinorAxis: RIPPLE_RADIUS,
      semiMajorAxis: RIPPLE_RADIUS,
      height: h, // 直接在指定高度展示
      material: materialProperty
    }
  });

  activeEntities[id].entities.push(entity);
}
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
const isMounted = ref(false)
const deviceStatus = ref({}) // { position_code: { value: 0, color: '#00FF7A' } }

const getNumericValue = (str) => {
  if (typeof str !== 'string') return str || 0
  const num = parseFloat(str.replace(/[^0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}

const getStatusColor = (item, value) => {
  const first = getNumericValue(item.first_alarm)
  const second = getNumericValue(item.second_alarm)

  if (value === undefined) return '#e8e512'

  if (value >= second) return '#FF4D4F' // 2级报警 - 红色
  if (value >= first) return '#FFA940'  // 1级报警 - 橙色
  return '#00FF7A' // 正常 - 绿色
}

const flyToItemLoc = (item) => {
  if (!viewer) return;
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
  } else if (item.point) {
    const point = gs3d.Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1], (item.point[2] || 0) + 60);
    viewer.camera.flyTo({
      destination: point,
      orientation: { heading: 0, pitch: gs3d.Cesium.Math.toRadians(-90), roll: 0.0 },
      duration: 1.5
    });
  }
}

const fetchStatuses = async () => {
  if (!initialCameraView && viewer) {
    initialCameraView = {
      destination: viewer.camera.position.clone(),
      heading: viewer.camera.heading,
      pitch: viewer.camera.pitch,
      roll: viewer.camera.roll
    };
  }

  let currentAlarms = [];

  await Promise.all(gdsDataPoints.map(async (item) => {
    try {
      let val = await fetchDeviceData(item.position_code)
      if (!isMounted.value) return;

      let color = getStatusColor(item, val)

      // if (item.position_code === 'GT_LJ_041_AI1_PV') {
      //   val = 100;
      //   color = '#FF4D4F'; // 红色
      // }

      // if (item.position_code === 'GT_LJ_036_AI1_PV') {
      //   val = 100;
      //   color = '#FF4D4F'; // 红色
      // }
      deviceStatus.value[item.position_code] = {
        value: val,
        color: color
      }

      const isAlarm = color !== '#00FF7A' && color !== '#e8e512';
      if (isAlarm) {
        currentAlarms.push(item);
      }

      if (item.point && item.point.length >= 2 && viewer) {
        const lon = item.point[0];
        const lat = item.point[1];
        const h = item.point[2] || 0;

        createOrUpdateDynamicRippleSphere(item.position_code, { lon, lat, h }, color);

        if (isAlarm) {
          createOrUpdateGasLeak(viewer, item.position_code, { lon, lat, h }, color, item.type);
        } else {
          removeGasLeak(viewer, item.position_code);
        }

        if (!activeOverlays[item.position_code]) {
          activeOverlays[item.position_code] = new HtmlOverlay(viewer, {
            id: item.position_code,
            name: item.location || '--',
            lon,
            lat,
            h,
            type: item.type || '--',
            value: val,
            color: color
          });
        } else {
          activeOverlays[item.position_code].updateData({
            value: val,
            color: color
          });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch status for ${item.position_code}:`, error)
      // 保持之前的状态或设为默认
      if (!deviceStatus.value[item.position_code]) {
        deviceStatus.value[item.position_code] = { value: 0, color: '#00FF7A' }
      }
    }
  }));

  const addedAlarms = currentAlarms.filter(a => !previousAlarms.find(p => p.position_code === a.position_code));
  const removedAlarms = previousAlarms.filter(p => !currentAlarms.find(a => a.position_code === p.position_code));

  if (addedAlarms.length > 0) {
    flyToItemLoc(addedAlarms[addedAlarms.length - 1]);
  } else if (removedAlarms.length > 0) {
    if (currentAlarms.length > 0) {
      flyToItemLoc(currentAlarms[currentAlarms.length - 1]);
    } else if (initialCameraView && viewer) {
      viewer.camera.flyTo({
        destination: initialCameraView.destination,
        orientation: {
          heading: initialCameraView.heading,
          pitch: initialCameraView.pitch,
          roll: initialCameraView.roll
        },
        duration: 1.5
      });
    }
  }

  previousAlarms = currentAlarms;
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

  if (activeOverlays[nameToFind]) {
    activeOverlays[nameToFind].data.visible = true;
  }

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
        ["true", store.state.showFire || store.state.showGds ? "color('#bfbebe')" : "color('#0099FF')"]
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

let timer = null;
onMounted(() => {
  isMounted.value = true
  fetchStatuses()
  timer = setInterval(fetchStatuses, 60000) // 每分钟更新一次

  setTimeout(() => {
    if (!isMounted.value) return
    showContent.value = true
  }, 100) // slight delay to allow DOM to render first, then apply transition
})

onUnmounted(() => {
  isMounted.value = false
  if (timer) clearInterval(timer);
  Object.values(activeOverlays).forEach(overlay => overlay.destroy());
  Object.values(activeEntities).forEach(entityInfo => {
    if (viewer && entityInfo.entities) {
      entityInfo.entities.forEach(e => viewer.entities.remove(e));
    }
  });
  Object.keys(activeGasLeaks).forEach(id => removeGasLeak(viewer, id));
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

body {
  .alarm-panel-content {
    position: absolute;
    background: rgba(10, 20, 30, 0.85);
    border: 2px solid #ff4d4f;
    border-radius: 8px;
    padding: 12px 16px;
    color: #fff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    width: 250px;
    box-shadow: 0 0 15px rgba(255, 77, 79, 0.6);
    pointer-events: auto;
    display: block;
    z-index: 10;
  }

  .alarm-panel-content::after {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 10px 10px 10px 0;
    border-style: solid;
    border-color: transparent;
    /* Updated dynamically via JS */
  }

  .alarm-panel-content .panel-header {
    font-size: 16px;
    font-weight: bold;
    color: #ff4d4f;
    /* Updated dynamically */
    border-bottom: 1px solid rgba(255, 77, 79, 0.4);
    /* Updated dynamically */
    padding-bottom: 6px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .alarm-panel-content .close-btn {
    color: #fff;
    cursor: pointer;
    font-size: 18px;
  }

  .alarm-panel-content .panel-row {
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .alarm-panel-content .label {
    color: #ccc;
  }

  .alarm-panel-content .value {
    font-weight: bold;
  }

  .alarm-panel-content .status-high {
    animation: text-pulse-gds 1s infinite;
  }

  @keyframes text-pulse-gds {

    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.6;
    }
  }
}
</style>