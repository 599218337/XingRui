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
import { onMounted, ref, reactive, watch } from 'vue'
import { useStore } from "vuex";

import utils from '@/utils/utils'
const time = ref('')
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
  // window.addEventListener('resize', getScale);
  timer = setInterval(() => {
    time.value = utils.dateFormat(new Date(), 'hh:mm:ss');
  }, 1000);

  const defopt = {
    msaaSamples: 4,
    infoBox: true,
    timeline: true,
    // terrain: Cesium.Terrain.fromWorldTerrain(),
  };
  viewer.value = gs3d.global.initViewer('mapContainer', defopt);

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
  await addAllModel()

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

const modelFlag = ref(false)


const addAllModel = async () => {
  await gs3d.manager.layerManager.addLayer({
    id: 'noWallBuild',
    label: 'noWallBuild',
    type: 'model_3d_tiles',
    url: '3dtileset_20251105/Batchedfw_part/tileset.json',
    setPosition: {
      height: -15,
    },
  },
  )


  await gs3d.manager.layerManager.addLayer({
    id: 'wall',
    label: 'wall',
    type: 'model_3d_tiles',
    url: '3dtileset_20251105/Batchedfw_qiang4/tileset.json',
    setPosition: {
      height: -15,
    },
    clampToGround: true,
  },
  )

  await gs3d.manager.layerManager.addLayer({
    id: 'jyPipe',
    label: 'jyPipe',
    type: 'model_3d_tiles',
    url: '3dtileset_20251105/Batchedjy/tileset.json',
    setPosition: {
      height: -15,
    },
  },
  )

  await gs3d.manager.layerManager.addLayer({
    id: 'lqPipe',
    label: 'lqPipe',
    type: 'model_3d_tiles',
    url: '3dtileset_20251105/Batchedlq/tileset.json',
    setPosition: {
      height: -15,
    },
  },
  )

  await gs3d.manager.layerManager.addLayer({
    id: 'qqPipe',
    label: 'qqPipe',
    type: 'model_3d_tiles',
    url: '3dtileset_20251105/Batchedqq/tileset.json',
    setPosition: {
      height: -15,
    },
  },
  )

  await gs3d.manager.layerManager.addLayer({
    id: 'ysPipe',
    label: 'ysPipe',
    type: 'model_3d_tiles',
    url: '3dtileset_20251105/Batchedys/tileset.json',
    setPosition: {
      height: -15,
    },
  },
  )
  const noWallEntry = gs3d.global.variable.gs3dAllLayer.find(item => item.id === 'noWallBuild')
  await noWallEntry.layer.tileSet.readyPromise
  const boundingSphere = noWallEntry.layer.tileSet.boundingSphere
  const center = boundingSphere.center;
  const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  const eastOffset = new Cesium.Cartesian3(450, 530, 200); // 100 表示向东 100 米，按需改值
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
        <devicesListPoi></devicesListPoi>
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
        <personStatistics></personStatistics>
      </div>
    </Transition>
    <footerNav></footerNav>

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
  // position: absolute;
  width: 1920px;
  height: 1080px;
  transform-origin: 0 0;
  left: 50%;
  top: 50%;
  pointer-events: none;
  transition: 0.3s;
  transform: scale(var(--scaleX), var(--scaleY));
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

  //   animation-name:rightmove;
  // animation-duration:1s;
  // /* Safari and Chrome */
  // -webkit-animation-name:rightmove;
  // -webkit-animation-duration:1s;
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
</style>
