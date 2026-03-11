<script setup lang="ts">
import {
  headerNav,
  personnelStatistics,
  alarmStatistics,
  environmentalData,
  deviceStatistics,
  devicesListPoi,
  productionTasks,
  energyStatistics,
  footerNav,
  cameraStatistics,
  fireStatistics,
  personStatistics,
  viewChange,
} from '@/components';
import * as gs3d from '/public/gs3d/index';
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue'
import { useStore } from "vuex";

import utils from '@/utils/utils'
import { applyShaderEffect, removeShaderEffect } from '@/utils/shaderEffects'
const time = ref('')
const activeEffect = ref<'fresnel' | 'xray' | null>(null)
const isTransitioning = ref(false)
let transitionTimer: ReturnType<typeof setTimeout> | null = null

// 所有 3D Tiles 的 ID
const allTilesetIds = ['noWallBuild']

const toggleShaderEffect = (effectType: 'fresnel' | 'xray') => {
  // 清除正在进行的过渡动画
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }

  if (activeEffect.value === effectType || isTransitioning.value) {
    // 当前效果已激活或正在过渡，关闭它 → 切换回3D模型
    removeShaderEffect(allTilesetIds)
    removePerFeatureColors()
    activeEffect.value = null
    isTransitioning.value = false
  } else {
    // 先播放扫描过渡动画，然后切换到目标效果
    if (activeEffect.value) {
      removeShaderEffect(allTilesetIds)
      removePerFeatureColors()
    }
    isTransitioning.value = true
    applyShaderEffect(allTilesetIds, 'scanGradient')

    // 扫描完一轮后自动切换到目标效果
    // 扫描周期 ≈ (40 + 10) / (0.15 * 60) ≈ 5.5秒
    transitionTimer = setTimeout(() => {
      removeShaderEffect(allTilesetIds)
      if (effectType === 'xray') {
        // 白色 xray 基础色 + Cesium3DTileStyle 按 name 前缀对不同管线上色
        applyShaderEffect(['noWallBuild'], 'xray', [1.0, 1.0, 1.0], 0.5, 10)
        applyPerFeatureColors()
      } else {
        applyShaderEffect(allTilesetIds, effectType)
      }
      activeEffect.value = effectType
      isTransitioning.value = false
      transitionTimer = null
    }, 5500)
  }
}
let timer = null
const store = useStore();
const { Cesium } = gs3d
let viewer: any = ref(null)
const homeref = ref(null)
const Specifications = reactive({
  //定义的宽高比例，初始为1
  ww: 1,
  wh: 1,
  //根据class="home"里面定义的宽高进行作为初始宽高进行计算
  //！自定义内容！
  width: 1920,
  height: 1080,
  //！自定义内容！
})
const getScale = () => {
  // 获取到缩放比例
  Specifications.wh = window.innerHeight / Specifications.height
  Specifications.ww = window.innerWidth / Specifications.width
  //将比例设置进dom元素中
  homeref._value.style.setProperty('--scaleX', Specifications.ww)
  homeref._value.style.setProperty('--scaleY', Specifications.wh)
}


watch(() => store.state.showAside, (val) => {
  let p = val ? -400 : 0
  let t = val ? 0.5 : 2.7
  document.getElementById('map_tool').style.transform = `translateX(${p}px)`
  document.getElementById('map_tool').style.transition = `transform ${t}s`
})

onMounted(async () => {
  getScale()
  window.addEventListener('resize', getScale);
  timer = setInterval(() => {
    time.value = utils.dateFormat(new Date(), 'hh:mm:ss');
  }, 1000);

  const defopt = {
    msaaSamples: 4,
    infoBox: true,
    timeline: true,
    // useImageryLayers: false,
    // terrain: Cesium.Terrain.fromWorldTerrain(),
  };
  viewer.value = gs3d.global.initViewer('mapContainer', defopt);

  // 移除底图，设置深蓝色背景
  // viewer.value.imageryLayers.removeAll();
  viewer.value.scene.globe.show = false
  viewer.value.scene.backgroundColor = Cesium.Color.fromCssColorString('#0a1628');
  viewer.value.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a1628');
  // 关闭天空盒和大气效果，使用纯色背景
  viewer.value.scene.skyBox.show = false;
  viewer.value.scene.skyAtmosphere.show = false;

  // 开启 SSAO 环境光遮蔽
  viewer.value.scene.postProcessStages.ambientOcclusion.enabled = true;
  viewer.value.scene.postProcessStages.ambientOcclusion.uniforms.intensity = 0.5;
  viewer.value.scene.postProcessStages.ambientOcclusion.uniforms.bias = 0.1;
  viewer.value.scene.postProcessStages.ambientOcclusion.uniforms.lengthCap = 0.03;
  viewer.value.scene.postProcessStages.ambientOcclusion.uniforms.stepSize = 1.0;
  viewer.value.scene.postProcessStages.ambientOcclusion.uniforms.blurStepSize = 0.86;

  // 将 Cesium 的时钟设置为系统时钟模式
  viewer.value.clock.shouldAnimate = true;
  viewer.value.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
  const now = Cesium.JulianDate.fromDate(new Date());
  viewer.value.clock.currentTime = now;
  viewer.value.clock.startTime = Cesium.JulianDate.addHours(now, -12, new Cesium.JulianDate());
  viewer.value.clock.stopTime = Cesium.JulianDate.addHours(now, 12, new Cesium.JulianDate());

  if (viewer.value.timeline) {
    viewer.value.timeline.zoomTo(viewer.value.clock.startTime, viewer.value.clock.stopTime);
  }

  // 应用本地时间显示
  setupLocalTimeDisplay();
  // 加载模型期间持续播放扫描效果
  isTransitioning.value = true
  await addAllModel()
  // 等待所有 tileset 的实际瓦片内容（b3dm）加载完毕
  await waitForAllTilesLoaded()
  // 全部瓦片加载完成，切换到 X-Ray 模式（不同模型不同颜色）
  removeShaderEffect(allTilesetIds)
  // 白色 xray 基础色 + Cesium3DTileStyle 按 name 前缀对不同管线上色
  applyShaderEffect(['noWallBuild'], 'xray', [1.0, 1.0, 1.0], 0.5, 10)
  applyPerFeatureColors()
  activeEffect.value = 'xray'
  isTransitioning.value = false


  // 建立滑鼠事件處理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas);

  // 儲存上一個被選中的部件，以便還原顏色
  let highlightedFeature = undefined;
  let originalColor = new Cesium.Color();

  // 監聽滑鼠左鍵點擊事件
  handler.setInputAction(function (movement) {
    // 取得滑鼠點擊位置的物件
    const picked = viewer.value.scene.pick(movement.position);

    if (!Cesium.defined(picked)) return;

    // 嘗試獲取 Cesium3DTileFeature（兼容 3D Tiles 1.0 和 1.1）
    let pickedFeature = picked;
    // 1.1 格式下 picked 可能是 { primitive, content, ... } 而非直接的 Feature
    if (picked instanceof Cesium.Cesium3DTileFeature) {
      pickedFeature = picked;
    } else if (picked.content && picked.content instanceof Cesium.Cesium3DTileFeature) {
      pickedFeature = picked.content;
    }

    // 如果點擊到了 3D Tiles 的某個具體部件 (Feature)
    if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {

      // --- 1. 讀取該部位的屬性 ---
      if (typeof pickedFeature.getPropertyIds === 'function') {
        // Cesium 1.104+ 使用 getPropertyIds 替代 getPropertyNames
        const propertyIds = pickedFeature.getPropertyIds();
        console.log("該部件擁有的屬性:", propertyIds);
      } else if (typeof pickedFeature.getPropertyNames === 'function') {
        // 舊版 Cesium 使用 getPropertyNames
        const propertyNames = pickedFeature.getPropertyNames();
        console.log("該部件擁有的屬性:", propertyNames);
      } else {
        console.log("該部件無可讀取的屬性方法");
      }

      // 讀取特定屬性 (例如 name 或 id)
      if (typeof pickedFeature.getProperty === 'function') {
        const partName = pickedFeature.getProperty('name');
        console.log("你點擊了:", partName);
      }

      // --- 2. 改變該部位的顏色 (高亮) ---
      // 還原之前點擊的部件顏色
      if (Cesium.defined(highlightedFeature)) {
        highlightedFeature.color = originalColor;
      }

      // 紀錄當前部件和它的原始顏色
      highlightedFeature = pickedFeature;
      Cesium.Color.clone(pickedFeature.color, originalColor);

      // 將點擊的部件變成黃色
      pickedFeature.color = Cesium.Color.YELLOW;

      // --- 3. 隱藏該部位 ---
      // 如果你想點擊後直接隱藏它，可以這樣做：
      // pickedFeature.show = false; 
    } else {
      console.log("點擊到的不是 3D Tiles Feature:", picked);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

})

onUnmounted(() => {
  window.removeEventListener('resize', getScale)
  if (timer) clearInterval(timer)
  if (transitionTimer) clearTimeout(transitionTimer)
})

function setupLocalTimeDisplay() {

  if (viewer.value.timeline) {
    viewer.value.timeline.makeLabel = function (date) {
      const jsDate = Cesium.JulianDate.toDate(date);

      const year = jsDate.getFullYear();
      const month = String(jsDate.getMonth() + 1).padStart(2, '0');
      const day = String(jsDate.getDate()).padStart(2, '0');
      const hours = String(jsDate.getHours()).padStart(2, '0');
      const minutes = String(jsDate.getMinutes()).padStart(2, '0');
      const seconds = String(jsDate.getSeconds()).padStart(2, '0');

      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    // 刷新时间轴
    viewer.value.timeline.zoomTo(viewer.value.clock.startTime, viewer.value.clock.stopTime);

  }

}


// 根据 feature 的 name 前缀，为 noWallBuild 中不同管线设置不同颜色
const applyPerFeatureColors = () => {
  const entry = gs3d.global.variable.gs3dAllLayer.find((item: any) => item.id === 'noWallBuild')
  const tileset = entry?.layer?.tileSet
  if (tileset) {
    tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["regExp('^jy_').test(${name})", "color('#CC0099')"],   // 紫红色 - 给水管
          ["regExp('^lq_').test(${name})", "color('#00CC33')"],   // 绿色   - 冷却管
          ["regExp('^qq_').test(${name})", "color('#1933CC')"],   // 深蓝色 - 蒸汽管
          ["regExp('^ys_').test(${name})", "color('#FFCC00')"],   // 黄色   - 雨水管
          ["true", "color('#0099FF')"]                            // 默认青白色 - 建筑/墙体
        ]
      }
    })
  }
}

// 移除 noWallBuild 上的 per-feature 着色样式
const removePerFeatureColors = () => {
  const entry = gs3d.global.variable.gs3dAllLayer.find((item: any) => item.id === 'noWallBuild')
  const tileset = entry?.layer?.tileSet
  if (tileset) {
    tileset.style = undefined
  }
}

// 等待所有 tileset 的实际瓦片（b3dm）加载完毕
const waitForAllTilesLoaded = () => {
  return new Promise<void>((resolve) => {
    const check = () => {
      const allLoaded = allTilesetIds.every(id => {
        const entry = gs3d.global.variable.gs3dAllLayer.find((item: any) => item.id === id)
        const tileset = entry?.layer?.tileSet
        if (!tileset) return true
        return tileset.tilesLoaded
      })
      if (allLoaded) {
        resolve()
      } else {
        setTimeout(check, 500) // 每 500ms 检查一次
      }
    }
    // 延迟 1 秒让 Cesium 开始瓦片请求流程，避免刚创建时 tilesLoaded 为 true 的误判
    setTimeout(check, 1000)
  })
}

const addAllModel = async () => {
  await gs3d.manager.layerManager.addLayer({
    id: 'noWallBuild',
    label: 'noWallBuild',
    type: 'model_3d_tiles',
    url: 'model5/tileset.json',
  },
  )

  // 1.1 模型启动扫描特效时，也传入单独的频率参数 0.5
  applyShaderEffect(['noWallBuild'], 'scanGradient', undefined, undefined, 10)




  const noWallEntry = gs3d.global.variable.gs3dAllLayer.find(item => item.id === 'noWallBuild')
  await noWallEntry.layer.tileSet.readyPromise
  const boundingSphere = noWallEntry.layer.tileSet.boundingSphere
  const center = boundingSphere.center;
  const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  const eastOffset = new Cesium.Cartesian3(280, -210, 220); // 相机在东南方，朝向西北，靠近目标
  const destination = Cesium.Matrix4.multiplyByPoint(enuMatrix, eastOffset, new Cesium.Cartesian3());


  const toTarget = Cesium.Cartesian3.subtract(center, destination, new Cesium.Cartesian3())
  const inverseEnu = Cesium.Matrix4.inverse(enuMatrix, new Cesium.Matrix4())
  const localToTarget = Cesium.Matrix4.multiplyByPointAsVector(
    inverseEnu,
    toTarget,
    new Cesium.Cartesian3(),
  )
  const heading = Math.atan2(localToTarget.x, localToTarget.y)
  const pitch = Math.atan2(localToTarget.z, Math.hypot(localToTarget.x, localToTarget.y))
  viewer.value.camera.flyTo({
    destination,
    orientation: {
      heading,
      pitch,
      roll: 0,
    },
    duration: 2,
  })
}


const pickPoint = () => {
  const gridPickSearch = new gs3d.tools.areaFeaturePick({
    viewer: viewer.value,
    callback: (pm: any, type: any) => {
      console.log('拾取回调', pm, type) //pm为拾取的geojson，type当本次为清除事件的回调时为"clear"
      viewer.value.camera.setView({
        destination: gs3d.Cesium.Cartesian3.fromRadians(
          viewer.value.camera.positionCartographic.longitude,
          viewer.value.camera.positionCartographic.latitude,
          gs3d.grid.util.levelSize.calculateHeightWithMapLevel(15) - 0.1
        ),
        // duration:1
      });

    },
  })

  gridPickSearch.activate({
    type: 'point',
    option: {
      graphicName: 'ServicePreview',
      geoLevel: 15,
      // maxGridNumber: CONFIG.maxGridNumber, //最大网格数，可选，默认为100000
      // color: drawForm.color, //颜色(适用于：点、线、面、矩形)
      // opacity: drawForm.opacity, //不透明度(适用于：点、线、面、矩形)
      // width: drawForm.width,//尺寸(适用于：点、线)
      fill: true,//是否填充内部(适用于：面、矩形),
      outline: true,//外边线(适用于：面、矩形)
      // outlineType: drawForm.lineType === '1' ? 'realLine' : 'dashLine',
      // outlineWidth: drawForm.width,
      // outlineColor: drawForm.outlineColor,//外边线颜色(适用于：点、面、矩形)
      // height: 0,//底部高度(适用于：面)
      // extrudedHeight: 0,//实体高度(适用于：面)
      // material: drawForm.lineType === '1' || type === 'polygon' ? null : new gs3d.Cesium.PolylineDashMaterialProperty({
      //   color: gs3d.Cesium.Color.fromCssColorString(drawForm.color).withAlpha(drawForm.opacity),
      //   dashLength: 16.0
      // }),
      // isContinuous: type == 'multiPoint' ? true : false, //是否不连续点击，默认false，即默认连续点击(适用于：点)
      showLabel: false,
      clampToGround: true,
    },
  })
}
</script>

<template>
  <div id="mapContainer"></div>

  <div class="home" ref="homeref">

    <!-- <el-button @click="pickPoint" style="position: absolute; top: 100px; left: 100px; z-index: 1000;">取点</el-button> -->
    <!-- loading -->
    <headerNav></headerNav>
    <div class="time">
      {{ time }}
    </div>
    <div id="map_tool">
      <viewChange></viewChange>
    </div>
    <div class="login">
      <span class="btn1" @click="showTimeWeatherFuc">[设置]</span>&nbsp;&nbsp;&nbsp;
      <span class="btn2" @click="loginOut">[退出系统]</span>
    </div>
    <!--左侧图表 -->
    <Transition name="slide-fade">
      <div class="left_wrapper" v-show="store.state.showAside">
        <personnelStatistics></personnelStatistics>
        <alarmStatistics></alarmStatistics>
        <environmentalData></environmentalData>
      </div>
    </Transition>
    <!--右侧图表 -->
    <Transition name="slide-fade2">
      <div class="right_wrapper" v-show="store.state.showAside">
        <deviceStatistics></deviceStatistics>
        <productionTasks></productionTasks>
        <energyStatistics></energyStatistics>
      </div>
    </Transition>
    <!-- 视频监控 -->
    <Transition name="slide-fade3">
      <div class="left_wrapper_camera" v-if="store.state.showCamera">
        <cameraStatistics :viewer="viewer"></cameraStatistics>
      </div>
    </Transition>
    <!-- 设备信息 -->
    <Transition name="slide-fade3">
      <div class="left_wrapper_camera" v-if="store.state.showDevices">
        <devicesListPoi :viewer="viewer"></devicesListPoi>
      </div>
    </Transition>
    <!-- 消防位置 -->
    <Transition name="slide-fade3">
      <div class="left_wrapper_camera" v-if="store.state.showFire">
        <fireStatistics></fireStatistics>
      </div>
    </Transition>
    <!-- 人员巡视 -->
    <Transition name="slide-fade3">
      <div class="left_wrapper_camera" v-if="store.state.showPerson">
        <personStatistics :viewer="viewer"></personStatistics>
      </div>
    </Transition>
    <footerNav>
      <!-- 底部 赛博朋克风格“舵”切换盘 -->
      <div class="hud-helm" @click="toggleShaderEffect('xray')">
        <div class="helm-base"></div>

        <!-- 左右刻度标签 -->
        <div class="helm-labels">
          <div class="label left" :class="{ active: activeEffect !== 'xray' && !isTransitioning }">
            3D模型
          </div>
          <div class="label right" :class="{ active: activeEffect === 'xray' && !isTransitioning }">
            网格模型
          </div>
        </div>

        <!-- 旋转的主舵轮 -->
        <div class="helm-wheel" :class="{ 'is-xray': activeEffect === 'xray', 'is-loading': isTransitioning }">
          <div class="helm-spokes">
            <div class="helm-spoke" style="transform: rotate(0deg)"></div>
            <div class="helm-spoke" style="transform: rotate(45deg)"></div>
            <div class="helm-spoke" style="transform: rotate(90deg)"></div>
            <div class="helm-spoke" style="transform: rotate(135deg)"></div>
          </div>
          <div class="helm-ring outer"></div>
          <div class="helm-ring inner"></div>

          <!-- 旋转指针 -->
          <div class="helm-pointer"></div>
        </div>

        <!-- 中央过渡文字 -->
        <div class="helm-status" v-if="isTransitioning">
          构建中
        </div>
      </div>
    </footerNav>

  </div>
</template>

<style lang="scss" scoped>
#mapContainer {
  position: absolute;
  width: 100vw;
  height: 100vh;
}

@font-face {
  font-family: digital;
  src: url(@/assets/fonts/digital-display-tfb-1.ttf);
}

.time {
  position: absolute;
  top: 90px;
  left: calc(50% - 40px);
  width: 80px;
  height: 18px;
  font-size: 28px;
  font-family: digital;
  font-weight: bold;
  color: #cee2ff;
  letter-spacing: 2px;
  text-shadow: 0px 3px 2px 0px rgba(12, 21, 56, 0.5);
  z-index: 2;
}

.home {
  position: absolute;
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
  left: 50%;
  top: 50%;
  pointer-events: none;
  transition: 0.3s;
  transform: translate(-50%, -50%) scale(var(--scaleX), var(--scaleY));
}

.home>* {
  pointer-events: auto;
}


.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}

.slide-fade2-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade2-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade2-enter-from,
.slide-fade2-leave-to {
  transform: translateX(200px);
  opacity: 0;
}


.slide-fade3-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade3-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade3-enter-from,
.slide-fade3-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}

.left_wrapper {
  width: 400px;
  height: 100vh;
  margin: 80px 0px 20px 20px;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;

  //   animation-name:leftmove;
  // animation-duration:1s;
  // /* Safari and Chrome */
  // -webkit-animation-name:leftmove;
  // -webkit-animation-duration:1s;
}

.left_wrapper_camera {
  width: 400px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
}

.right_wrapper {
  width: 400px;
  height: 100vh;
  margin: 80px 0px 20px 0px;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
}

:deep(.cesium-infoBox) {
  z-index: 2;
}

#map_tool {
  position: absolute;
  top: 100px;
  right: 30px;
  // width: 148px;
  // height: 168px;
  width: fit-content;
  height: fit-content;

}

.login {
  z-index: 999;
  position: absolute;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  width: fit-content;
  opacity: 0.6;
  font-size: 14px;
  // font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 3-55 Regular;
  font-weight: normal;
  color: #ffffff;
  text-shadow: 0px 3px 2px 0px rgba(12, 21, 56, 0.5);

  .btn1:hover,
  .btn2:hover:hover {
    color: #0085F5;
  }
}

:deep(.cesium-viewer-timelineContainer) {
  z-index: 9999;
}

/* --- 底部 赛博朋克“舵”切换盘 --- */

.hud-helm {
  position: relative;
  width: 380px;
  height: 100px;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1000;
}

/* 装饰底座光晕 */
.helm-base {
  position: absolute;
  bottom: -20px;
  width: 200px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(ellipse at top, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
  filter: blur(5px);
  pointer-events: none;
}

/* 旋转的主舵轮 */
.helm-wheel {
  position: absolute;
  bottom: -80px;
  /* 半隐藏在底部 */
  width: 170px;
  height: 170px;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* 默认指向左侧 */
  transform: rotate(-35deg);
}

.helm-wheel.is-xray {
  /* 开启透视模型指向右侧 */
  transform: rotate(35deg);
}

.helm-wheel.is-loading {
  /* 均匀旋转的动画，慢慢转 */
  animation: slowSpin 2s linear infinite;
}

@keyframes slowSpin {
  100% {
    transform: rotate(325deg);
    /* 起始是 -35，加360 = 325 */
  }
}

/* 舵把手 (Spokes) */
.helm-spokes {
  position: absolute;
  inset: 0;
}

.helm-spoke {
  position: absolute;
  top: -12px;
  bottom: -12px;
  left: calc(50% - 3px);
  width: 6px;
  background: linear-gradient(to bottom, #00ffff 0%, rgba(0, 255, 255, 0.1) 15%, rgba(0, 255, 255, 0.1) 85%, #00ffff 100%);
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
}

/* 外环机制 */
.helm-ring.outer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: inset 0 0 15px rgba(0, 255, 255, 0.3);
}

/* 内环深色质感 */
.helm-ring.inner {
  position: absolute;
  inset: 22px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 30, 60, 0.9) 0%, rgba(0, 10, 25, 0.95) 100%);
  border: 2px solid rgba(0, 255, 255, 0.6);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

/* 顶部指针 */
.helm-pointer {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-bottom: 28px solid #ffffff;
  filter: drop-shadow(0 0 10px #00ffff);
  z-index: 2;
}

/* 指针根部装饰圆点 */
.helm-pointer::after {
  content: '';
  position: absolute;
  bottom: -32px;
  left: -6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #00ffff;
  box-shadow: 0 0 10px #ffffff;
}

/* 左右文字说明 */
.helm-labels {
  position: absolute;
  width: 100%;
  bottom: 45px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  pointer-events: none;
}

.helm-labels .label {
  font-size: 16px;
  font-weight: bold;
  color: rgba(150, 220, 255, 0.5);
  letter-spacing: 2px;
  transition: all 0.4s;
}

.helm-labels .label.active {
  color: #ffffff;
  font-size: 18px;
  text-shadow: 0 0 12px #00ffff, 0 0 20px #00ffff;
  transform: translateY(-5px);
}

/* 中心过渡状态文字 */
.helm-status {
  position: absolute;
  bottom: 35px;
  /* 在轮盘中间稍微偏上，因为它是半隐藏的 */
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #00ffff;
  letter-spacing: 2px;
  pointer-events: none;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
    text-shadow: 0 0 8px #00ffff;
  }
}
</style>
