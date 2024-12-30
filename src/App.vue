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
  viewChange,
  cameraStatistics,
  fireStatistics,
  personStatistics,
  timeWeather,

} from '@/components';
import * as gs3d from '../public/gs3d/index';
import { onMounted, ref } from 'vue'
import { useStore } from "vuex";

const store = useStore();
const { Cesium } = gs3d
let viewer: any

onMounted(async () => {
  const defopt = {
    msaaSamples: 4,
    infoBox: true
    // terrain: Cesium.Terrain.fromWorldTerrain(),
  };
  viewer = gs3d.global.initViewer('mapContainer', defopt);
})

const addModel = async () => {
  const tileSet = await Cesium.Cesium3DTileset.fromUrl('model/tileset.json')
  // tileSet.style = new Cesium.Cesium3DTileStyle({
  //   color: "color('green')",
  // })
  const cartographic = Cesium.Cartographic.fromCartesian(tileSet.boundingSphere.center)
  const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
  const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface)
  const _scale = Cesium.Matrix4.fromUniformScale(10)
  Cesium.Matrix4.multiply(m, _scale, m)
  tileSet.root.transform = m
  const cartographic2 = Cesium.Cartographic.fromCartesian(tileSet.boundingSphere.center)
  const surface2 = Cesium.Cartesian3.fromRadians(cartographic2.longitude, cartographic2.latitude, cartographic2.height)
  const offset = Cesium.Cartesian3.fromDegrees(117.05435995706138, 36.674984212615854, 20)
  const translation = Cesium.Cartesian3.subtract(offset, surface2, new Cesium.Cartesian3())
  tileSet.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
  // const rotationAngle = Cesium.Math.toRadians(45) // 45度旋转角度
  // const rotationMatrix = Cesium.Matrix3.fromRotationZ(rotationAngle)
  // const rotationMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix)

  // // 将旋转矩阵应用到模型矩阵上
  // Cesium.Matrix4.multiply(tileSet.modelMatrix, rotationMatrix4, tileSet.modelMatrix)
  viewer.scene.primitives.add(tileSet)
  viewer.zoomTo(tileSet)
}

addModel()
</script>

<template>
  <div id="mapContainer"></div>

  <div class="home" ref="homeref">
    <div class="main-box">
      <!-- loading -->
      <headerNav></headerNav>
      <div class="time">
        {{ time }}
      </div>
      <!-- 3D地图 -->
      <!-- <WDPMap v-if="showMap"></WDPMap> -->
      <div class="LKMap-box">
        <div id="player"></div>
      </div>

      <div id="map_tool">
        <viewChange></viewChange>
      </div>
      <div class="timeWeatherTool" v-show="store.state.showTimeWeather && !store.state.showLoading">
        <timeWeather></timeWeather>
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
          <cameraStatistics></cameraStatistics>
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
  </div>
</template>

<style lang="scss" scoped>
#mapContainer {
  height: 100vh;
  width: 100vw;
}

// @import './home.scss';

// .home {
//   position: absolute;
//   //！自定义内容！
//   width: 1920px;
//   height: 1080px;
//   //！自定义内容！
//   //缩放设置
//   transform: scale(var(--scaleX), var(--scaleY));
//   transform-origin: 0 0;
//   left: 50%;
//   top: 50%;
//   transition: 0.3s;
// }


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
</style>
