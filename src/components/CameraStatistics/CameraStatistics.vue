<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-11 11:59:34
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cameraStatistics"
    :style="{ transform: `translateX(${showContent ? 374 : 0}px)`, transition: 'transform 1s' }">
    <div class="widget">
      <div class="header">
        <span>视频监控统计</span>
      </div>
      <div class="searchBox">
        <el-input v-model="searchKeyword" placeholder="请输入关键字进行过滤" clearable />
      </div>
      <div class="content">
        <template v-for="(items, key) in filteredCameraList" :key="key">
          <div class="categoryHeader" v-if="items && items.length">
            <span style="flex: 1;">{{ areaNameMap[key] || key }}</span>
            <span style="cursor: pointer; font-size: 14px; color: #0C89EA;" @click.stop="toggleVisibility(key)">
              {{ hiddenCategories[key] ? '显示' : '隐藏' }}
            </span>
          </div>
          <template v-for="item in items" :key="item.cameraIndexCode">
            <div class="contentItem" v-show="!hiddenCategories[key]" @click="location(item)">
              <div class="Item">
                <div class="point" :style="{ background: item.status ? '#00FF7A' : '#FF1010' }"></div>
                <div class="text">{{ item.label }}</div>
              </div>
              <div class="icon">
                <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="view" @click.stop="location(item)"></div>
                </el-tooltip>
                <!-- <el-tooltip content="编辑" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="edit" @click.stop="editPoi(item)"></div>
                </el-tooltip>
                <div class="arrow"></div> -->
              </div>
            </div>
            <!-- sub_label 作为额外一条展示 -->
            <div class="contentItem" v-if="item.sub_label" v-show="!hiddenCategories[key]"
              :key="item.sub_cameraIndexCode"
              @click="location({ ...item, label: item.sub_label, cameraIndexCode: item.sub_cameraIndexCode })">
              <div class="Item">
                <div class="point" :style="{ background: item.status ? '#00FF7A' : '#FF1010' }"></div>
                <div class="text">{{ item.sub_label }}</div>
              </div>
              <div class="icon">
                <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="view"
                    @click.stop="location({ ...item, label: item.sub_label, cameraIndexCode: item.sub_cameraIndexCode })">
                  </div>
                </el-tooltip>
                <!-- <el-tooltip content="编辑" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="edit"
                    @click.stop="editPoi({ ...item, label: item.sub_label, cameraIndexCode: item.sub_cameraIndexCode })">
                  </div>
                </el-tooltip>
                <div class="arrow"></div> -->
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
  <div v-if="videoPopupVisible" class="camera-video-popup" ref="popupRef"
    :class="{ 'camera-video-popup--dual': !!currentSubCameraLabel, 'camera-video-popup--maximized': isMaximized }"
    :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px', transform: 'none' }">
    <div class="camera-video-popup__header" style="cursor: move;" @mousedown="startDrag">
      <span v-if="!currentSubCameraLabel">{{ currentCameraLabel || '实时预览' }}</span>
      <div class="camera-video-popup__actions" @mousedown.stop>
        <button class="camera-video-popup__maximize" @click="toggleMaximize" title="放大/缩小"></button>
        <button class="camera-video-popup__close" @click="closeVideoPopup" title="关闭"></button>
      </div>
    </div>
    <div class="camera-video-popup__body">
      <div class="camera-video-popup__video-item">
        <div class="camera-video-popup__video-label" v-if="currentSubCameraLabel">{{ currentCameraLabel }}</div>
        <video ref="videoEl" autoplay muted></video>
      </div>
      <div class="camera-video-popup__video-item" v-if="currentSubCameraLabel">
        <div class="camera-video-popup__video-label">{{ currentSubCameraLabel }}</div>
        <video ref="videoEl2" autoplay muted></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useStore } from "vuex";
import * as gs3d from '/public/gs3d/index';
const store = useStore();

import emitter from '@/utils/bus'
import axios from 'axios';
import { cameraList } from './cameraList';

// 区域key -> 中文名称映射
const areaNameMap = {
  yk: '盐库',
  ycys: '一次盐水',
  ecys: '二次盐水',
  csz: '纯水站',
  xhsz: '循环水站',
  djqy: '电解区域',
  tl: '脱氯',
  qqcl: '氢气处理',
  lqcl: '氯气处理',
  yshc: '盐酸合成',
  gq: '罐区',
  jzf: '碱蒸发',
  pdl: '配电楼',
  xrzhl: '兴瑞综合楼',
  fy: '废盐',
  qt: '其他',
}

// 扁平化用于地图绑点
const flatCameraList = Object.values(cameraList).flat();
import Hls from 'hls.js';
const { viewer } = defineProps(['viewer'])

const searchKeyword = ref('')
const hiddenCategories = ref({})

const filteredCameraList = computed(() => {
  if (!searchKeyword.value) return cameraList
  const result = {}
  Object.keys(cameraList).forEach(key => {
    const list = cameraList[key]
    const keyword = searchKeyword.value
    const filtered = list.filter(item =>
      (item.label && item.label.includes(keyword)) ||
      (item.sub_label && item.sub_label.includes(keyword))
    )
    if (filtered.length > 0) {
      result[key] = filtered
    }
  })
  return result
})

const drawnGraphics = {}

const toggleVisibility = (key) => {
  if (hiddenCategories.value[key]) {
    delete hiddenCategories.value[key]
  } else {
    hiddenCategories.value[key] = true
  }
  updateMapVisibility()
}

const updateMapVisibility = () => {
  const keyword = searchKeyword.value

  Object.keys(cameraList).forEach(key => {
    const isCategoryHidden = hiddenCategories.value[key]
    const list = cameraList[key] || []

    list.forEach(item => {
      let isVisible = !isCategoryHidden

      if (keyword && isVisible) {
        const matchLabel = item.label && item.label.includes(keyword)
        const matchSubLabel = item.sub_label && item.sub_label.includes(keyword)
        if (!matchLabel && !matchSubLabel) {
          isVisible = false
        }
      }

      const graphic = drawnGraphics[item.cameraIndexCode]
      if (graphic) {
        if (graphic.show !== undefined) {
          graphic.show = isVisible
        } else if (graphic.entity) {
          graphic.entity.show = isVisible
        } else if (graphic.canvas) {
          graphic.show = isVisible
        }
      }

      const graphicName = 'camera_' + item.cameraIndexCode
      viewer.entities.values.forEach(entity => {
        if (entity.graphicName === graphicName || entity.id === graphicName || entity.name === graphicName) {
          entity.show = isVisible
        }
      })
    })
  })
}

watch(searchKeyword, () => {
  updateMapVisibility()
})

const videoPopupVisible = ref(false)
const videoEl = ref(null)
const videoEl2 = ref(null)
const currentCameraLabel = ref('')
const currentSubCameraLabel = ref('')
const popupPosition = ref({ x: 0, y: 0 })
const isMaximized = ref(false)
let hlsInstance = null
let hlsInstance2 = null
const popupRef = ref(null)
let screenEventHandler = null

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value
}

let isDragging = false
// 记录鼠标按下时光标距离弹窗左上角的“逻辑像素相对偏移量”
let dragOffset = { x: 0, y: 0 }

const onMouseMove = (e) => {
  if (!isDragging || !popupRef.value) return
  requestAnimationFrame(() => {
    if (!isDragging || !popupRef.value) return
    const scaleX = window.innerWidth / 1920
    const scaleY = window.innerHeight / 1080
    // 新位置 = 鼠标视口坐标(还原缩放比例后) - 光标内部逻辑偏移量
    const newX = (e.clientX / scaleX) - dragOffset.x
    const newY = (e.clientY / scaleY) - dragOffset.y
    // 直接操作原生 DOM
    popupRef.value.style.left = `${newX}px`
    popupRef.value.style.top = `${newY}px`
    popupPosition.value = { x: newX, y: newY }
  })
}

const onMouseUp = () => {
  if (!isDragging) return
  isDragging = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

const startDrag = (e) => {
  isDragging = true
  if (postRender) {
    postRender()
    postRender = null
  }

  const scaleX = window.innerWidth / 1920
  const scaleY = window.innerHeight / 1080

  if (popupRef.value) {
    const rect = popupRef.value.getBoundingClientRect()
    // 获取当下的实际逻辑坐标（屏幕坐标 / 缩放比例）
    const logicalLeft = rect.left / scaleX
    const logicalTop = rect.top / scaleY

    // 计算出还原缩放后的鼠标由于在弹窗内的点击点偏移量
    dragOffset = {
      x: (e.clientX / scaleX) - logicalLeft,
      y: (e.clientY / scaleY) - logicalTop
    }

    // 强制清除 translateY 带来的偏移影响，固定当前的真实逻辑坐标
    popupRef.value.style.transform = 'none'
    popupRef.value.style.left = `${logicalLeft}px`
    popupRef.value.style.top = `${logicalTop}px`
    popupPosition.value = { x: logicalLeft, y: logicalTop }
  } else {
    dragOffset = { x: 0, y: 0 }
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

let postRender = null

const openVideoPopup = async (source, cameraIndexCode, label, subCameraIndexCode, subLabel) => {
  currentCameraLabel.value = label || ''
  currentSubCameraLabel.value = subLabel || ''
  if (source) {
    if (postRender) {
      postRender()
      postRender = null
    }
    postRender = viewer.scene.postRender.addEventListener(() => {
      let cartesian
      if (Array.isArray(source)) {
        // 从 location() 调用，source 是 coord 数组
        cartesian = gs3d.Cesium.Cartesian3.fromDegrees(source[0], source[1], source[2] || 0)
      } else {
        // 从 scene.pick 调用，source 是 pick 结果（entity）
        cartesian = source?.id?._position?.getValue?.()
      }
      if (!cartesian) return
      const windowPosition = gs3d.Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian)
      const scaleX = window.innerWidth / 1920
      const scaleY = window.innerHeight / 1080
      if (windowPosition) {
        popupPosition.value = {
          x: windowPosition.x / scaleX + 20,
          y: windowPosition.y / scaleY - 200,
        }
      }
    })
  }
  videoPopupVisible.value = true
  await nextTick()
  getTestCamera(cameraIndexCode)
  if (subCameraIndexCode) {
    getTestCamera2(subCameraIndexCode)
  }
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
  if (hlsInstance2) {
    hlsInstance2.destroy()
    hlsInstance2 = null
  }
  const video2 = videoEl2.value
  if (video2) {
    video2.pause()
    video2.removeAttribute('src')
    video2.load()
  }
  currentSubCameraLabel.value = ''
}

onMounted(() => {
  flatCameraList.forEach(item => {
    const graphic = gs3d.common.draw.drawGraphic(viewer, {
      "type": "Point",
      "coordinates": item.coord
    }, {
      showBillBoard: true,
      billBoardOption: {
        text: '',
        url: '/image/qiangji.png',
      },
      graphicName: 'camera_' + item.cameraIndexCode,
    })
    drawnGraphics[item.cameraIndexCode] = graphic
  })

  screenEventHandler = new gs3d.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  screenEventHandler.setInputAction(async function (e) {
    const position = e.position
    if (!position) {
      closeVideoPopup()
      return
    }
    let pick = viewer.scene.pick(position)
    if (!pick) {
      closeVideoPopup()
      return
    }
    console.log('pick', pick);
    const graphicName = pick?.id?.graphicName || ''
    const cameraCode = graphicName.replace(/^camera_/, '')
    const matched = flatCameraList.find(c => c.cameraIndexCode === cameraCode)
    if (matched) {
      if (matched.sub_label) {
        await openVideoPopup(pick, matched.cameraIndexCode, matched.label, matched.sub_cameraIndexCode, matched.sub_label)
      } else {
        await openVideoPopup(pick, matched.cameraIndexCode, matched.label)
      }
    } else {
      const entityName = pick?.id?.name || pick?.id?._name || ''
      await openVideoPopup(pick, cameraCode || undefined, entityName)
    }
  }, gs3d.Cesium.ScreenSpaceEventType.LEFT_CLICK)
})
onBeforeUnmount(() => {
  if (screenEventHandler) {
    screenEventHandler.destroy()
    screenEventHandler = null
  }
  closeVideoPopup()
  gs3d.common.draw.clearAllGraphic(viewer)
  if (postRender) {
    postRender()
    postRender = null
  }
  emitter.off('nextStep')
  emitter.off('completeCamera')
})
const showContent = ref(false)
onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 100)
})
const showContentFuc = () => {
  showContent.value = !showContent.value
}

const location = (val) => {

  // 目标点
  const targetCartesian = gs3d.Cesium.Cartesian3.fromDegrees(val.coord[0], val.coord[1], 0)
  // 用 ENU 矩阵计算偏移后的观察点
  const enuMatrix = gs3d.Cesium.Transforms.eastNorthUpToFixedFrame(targetCartesian)
  const offset = new gs3d.Cesium.Cartesian3(50, 50, 80) // 东50m、北50m、高80m
  const destination = gs3d.Cesium.Matrix4.multiplyByPoint(enuMatrix, offset, new gs3d.Cesium.Cartesian3())

  // 计算从 destination 朝向 target 的 heading 和 pitch
  const toTarget = gs3d.Cesium.Cartesian3.subtract(targetCartesian, destination, new gs3d.Cesium.Cartesian3())
  const inverseEnu = gs3d.Cesium.Matrix4.inverse(enuMatrix, new gs3d.Cesium.Matrix4())
  const localToTarget = gs3d.Cesium.Matrix4.multiplyByPointAsVector(inverseEnu, toTarget, new gs3d.Cesium.Cartesian3())
  const heading = Math.atan2(localToTarget.x, localToTarget.y)
  const pitch = Math.atan2(localToTarget.z, Math.hypot(localToTarget.x, localToTarget.y))

  viewer.camera.flyTo({
    destination,
    orientation: {
      heading,
      pitch,
      roll: 0,
    },
    duration: 1.5,
    complete: () => {
      openVideoPopup(val.coord, val.cameraIndexCode, val.label)
    }
  })
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
const getTestCamera = async (cameraIndexCode) => {
  let streamUrl = ''
  if (cameraIndexCode) {
    try {
      const res = await axios.post('/camera-locate/artemis/api/video/v2/cameras/previewURLs', { cameraIndexCode, protocol: 'hls' }, {
        headers: {
          'X-Ca-Key': '28904913',
          "X-Ca-Signature": "JNaWX9D5++eMu8xIQXa/ymDeMPTtq6L78lFVvtlgVLc=",
          "X-Ca-Signature-Headers": "x-ca-key",
          "Accept": "*/*"
        }
      })
      streamUrl = res.data?.data?.url || ''
    } catch (e) {
      console.error('获取摄像头流地址失败', e)
    }
  }
  if (Hls.isSupported()) {
    if (hlsInstance) {
      hlsInstance.destroy()
      hlsInstance = null
    }
    const video = videoEl.value
    if (!video) return
    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hlsInstance = hls
  } else {
    const video = videoEl.value
    if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.play()
    }
  }
}

const getTestCamera2 = async (cameraIndexCode) => {
  let streamUrl = ''
  if (cameraIndexCode) {
    try {
      const res = await axios.post('/camera-locate/artemis/api/video/v2/cameras/previewURLs', { cameraIndexCode, protocol: 'hls' }, {
        headers: {
          'X-Ca-Key': '28904913',
          "X-Ca-Signature": "JNaWX9D5++eMu8xIQXa/ymDeMPTtq6L78lFVvtlgVLc=",
          "X-Ca-Signature-Headers": "x-ca-key",
          "Accept": "*/*"
        }
      })
      streamUrl = res.data?.data?.url || ''
    } catch (e) {
      console.error('获取副摄像头流地址失败', e)
    }
  }
  if (Hls.isSupported()) {
    if (hlsInstance2) {
      hlsInstance2.destroy()
      hlsInstance2 = null
    }
    const video = videoEl2.value
    if (!video) return
    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hlsInstance2 = hls
  } else {
    const video = videoEl2.value
    if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
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
