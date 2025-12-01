<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-11 11:59:34
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cameraStatistics">
    <div class="widget">
      <div class="header">
        <span>视频监控统计</span>
      </div>
      <div class="content">
        <div class="contentItem" v-for="item in cameraList" :key="item.id" @click="location(item)">
          <div class="Item">
            <div class="point" :style="{ background: item.status ? '#00FF7A' : '#FF1010' }"></div>
            <div class="text">{{ item.label }}</div>
          </div>
          <div class="icon">
            <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
              <div class="view" @click.stop="location(item)"></div>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" popper-class="iconTooltip" :offset="3">
              <div class="edit" @click.stop="editPoi(item)"></div>
            </el-tooltip>
            <div class="arrow"></div>
          </div>
        </div>

      </div>
      <div class="line"></div>

    </div>
    <div id="cameraBtn" @click="showContentFuc"> </div>


  </div>
  <div class="editMessage">
    <div class="edit1" v-show="showEdit1">
      <span>请用鼠标左键放置摄像头点位</span>
      <div class="cancle" @click="cancel1"></div>
      <div class="confirm" @click="confirm1"></div>
    </div>
    <div class="edit2" v-show="showEdit2">
      <span>请进行微调</span>
      <!-- <div class="tran" @click="transform(1)">
        <div class="icon"></div>
        <div class="text">平移</div>
      </div>
      <div class="roate" @click="transform(2)">
        <div class="icon"></div>
        <div class="text">旋转</div>
      </div> -->
      <div class="cancle" @click="cancel2"></div>
      <div class="confirm" @click="confirm2"></div>
    </div>

  </div>
  <div v-if="videoPopupVisible" class="camera-video-popup"
    :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px', transform: 'none' }">
    <div class="camera-video-popup__header">
      <span>实时预览</span>
      <button class="camera-video-popup__close" @click="closeVideoPopup"></button>
    </div>
    <video ref="videoEl" controls autoplay muted></video>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from "vuex";
import * as gs3d from '/public/gs3d/index';
const store = useStore();

import emitter from '@/utils/bus'
import axios from 'axios';
import { cameraList } from './cameraList';
import Hls from 'hls.js';
const { viewer } = defineProps(['viewer'])

const videoPopupVisible = ref(false)
const videoEl = ref(null)
const popupPosition = ref({ x: 0, y: 0 })
let hlsInstance = null
let screenEventHandler = null

let postRender = null

const openVideoPopup = async (entity) => {
  if (entity) {
    postRender = viewer.scene.postRender.addEventListener(() => {
      const cartesian = entity.id._position.getValue()
      const windowPosition = gs3d.Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian)
      const scaleX = window.innerWidth / 1920
      const scaleY = window.innerHeight / 1080
      windowPosition
        && (popupPosition.value = {
          x: windowPosition.x / scaleX + 20,
          y: windowPosition.y / scaleY - 200,
        })
    })
  }
  videoPopupVisible.value = true
  await nextTick()
  getTestCamera()
}

const closeVideoPopup = () => {
  videoPopupVisible.value = false
  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }
  const video = videoEl.value
  if (video) {
    video.pause()
    video.removeAttribute('src')
    video.load()
  }
}

onMounted(() => {
  cameraList.forEach(item => gs3d.common.draw.drawGraphic(viewer, {
    "type": "Point",
    "coordinates": item.coord
  }, {
    showBillBoard: true,
    billBoardOption: {
      text: item.label,
      url: '/src/assets/images/marker.svg'
    },
    graphicName: 'camera' + item.id,
  }))

  screenEventHandler = new gs3d.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  screenEventHandler.setInputAction(async function (e) {
    const position = e.position
    if (!position) {
      closeVideoPopup()
      return
    }
    let pick = viewer.scene.pick(position)
    console.log('pick：', pick);
    if (!pick) {
      closeVideoPopup()
      return
    }
    await openVideoPopup(pick)
  }, gs3d.Cesium.ScreenSpaceEventType.LEFT_CLICK)
})
onBeforeUnmount(() => {
  if (screenEventHandler) {
    screenEventHandler.destroy()
    screenEventHandler = null
  }
  closeVideoPopup()
})
const showContent = ref(false)
const showContentFuc = () => {
  let p = showContent.value ? 0 : 374
  let t = showContent.value ? 0.5 : 0.5
  let b = showContent.value ? 'url("/image/zhankai.png")' : 'url("/image/shouqi.png")'
  document.getElementsByClassName('cameraStatistics')[0].style.transform = `translateX(${p}px)`
  document.getElementsByClassName('cameraStatistics')[0].style.transition = `transform ${t}s`
  document.getElementById('cameraBtn').style.background = b
  document.getElementById('cameraBtn').style.backgroundSize = '100% 100%'
  showContent.value = !showContent.value
}

const location = (val) => {
  if (!val.coord) {
    ElMessage({
      type: 'warning',
      message: `${val.label}坐标点缺失！`
    })
    return
  }
  let jsondata = {
    "id": 'camera_' + val.id,             //覆盖物id
    "covering_type": "poi",     //覆盖物类型, 详见下表
    "distance": 10           //距离(单位:米), 默认20米
  }

}

const showEdit1 = ref(false)
const showEdit2 = ref(false)
let cameraEditData = null
const editPoi = (val) => {
  showEdit1.value = false
  showEdit2.value = false
  cameraEditData = val
  if (!val.coord) {
    showEdit1.value = true
    emitter.emit('startGetCoord');

  }
  if (val.coord) {
    location(val)
    showEdit1.value = false
    showEdit2.value = true
    emitter.emit('transform', cameraEditData);
  }

}

const confirm1 = () => {
  emitter.emit('addCameraEffect', cameraEditData);

}
emitter.on('nextStep', () => {
  showEdit1.value = false
  showEdit2.value = true
  emitter.emit('transform', cameraEditData);
});

const cancel1 = () => {
  emitter.emit('cancelGetCoord');
  showEdit1.value = false
}

const confirm2 = () => {
  emitter.emit('completeTransform', cameraEditData);
}
const cancel2 = () => {
  emitter.emit('cancelTransform', cameraEditData);
  showEdit2.value = false
}



emitter.on('completeCamera', (val) => {
  showEdit2.value = false
  let cameraArray = store.state.cameraArray
  let cameraArrayItem = cameraArray.find((item) => {
    return item.id == val.id.split('_')[1]
  });
  cameraArrayItem.coord = val.coord
  cameraArrayItem.coord_type = val.coord_type
  cameraArrayItem.coord_z = val.coord_z
  cameraArrayItem.coord_z_type = val.coord_z_type
  axios.post('/api/cameraInfo/updateCameraInfo', cameraArrayItem)
  // cameraArray.forEach((item) => {
  //   if (item.id == val.id.split('_')[1]) {
  //     item.coord = val.coord
  //     item.coord_type = val.coord_type
  //     item.coord_z = val.coord_z
  //     item.coord_z_type = val.coord_z_type
  //   }
  // });
  store.dispatch("setCameraArray", cameraArray);
});

// const transform = (type) => {
//   emitter.emit('transform', type);
// }
const getTestCamera = () => {
  if (Hls.isSupported()) {
    if (hlsInstance) {
      hlsInstance.destroy()
      hlsInstance = null
    }
    const video = videoEl.value
    if (!video) return
    const hls = new Hls();
    hls.loadSource("http://10.32.10.65:83/openUrl/qE2rOF2/live.m3u8");
    hls.attachMedia(video);
    hlsInstance = hls
  } else {
    const video = videoEl.value
    if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = "http://10.32.10.65:83/openUrl/qE2rOF2/live.m3u8";
      video.play()
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./CameraStatistics.scss');
</style>

<style lang="scss">
.iconTooltip {
  background-color: rgba(39, 53, 70, 1) !important;
  border: 1px solid rgba(12, 137, 234, 0.40) !important;
  border-radius: 2px !important;
}
</style>
