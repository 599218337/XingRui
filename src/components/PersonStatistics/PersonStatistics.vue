<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 14:48:52
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="personStatistics"
    :style="{ transform: `translateX(${showContent ? 374 : 0}px)`, transition: 'transform 1s' }">
    <div class="widget">
      <div class="header">
        <span>人员定位</span>
      </div>
      <div class="content">
        <el-collapse v-model="activeName">
          <el-collapse-item v-for="(item, index) in departTypeList" :title="item.label" :name="item.value">
            <div class="contentItem" v-for="(_item, _index) in item.detailPeople" @click="location(_item)">
              <div class="Item">
                <div class="text" style="margin-left: 10px;">{{ _item.empName }}</div>
              </div>
              <div class="icon">
                <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="view" @click.stop="location(_item)"></div>
                </el-tooltip>
              </div>
            </div>
          </el-collapse-item>

        </el-collapse>

      </div>


    </div>
    <div id="personBtn" @click="showContentFuc"
      :style="{ background: showContent ? 'url(/image/shouqi.png)' : 'url(/image/zhankai.png)', backgroundSize: '100% 100%' }">
    </div>


    <div v-if="personPopupVisible" class="person-info-popup" ref="popupRef"
      :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px', transform: 'none' }">
      <div class="person-info-popup__header" style="cursor: move;" @mousedown="startDrag">
        <span>{{ currentPerson?.empName || '人员信息' }}</span>
        <div class="person-info-popup__actions" @mousedown.stop>
          <button class="person-info-popup__close" @click="closePersonPopup" title="关闭"></button>
        </div>
      </div>
      <div class="person-info-popup__body">
        <div class="info-row"><span class="label">姓名：</span><span class="value">{{ currentPerson?.empName }}</span>
        </div>
        <div class="info-row"><span class="label">工号：</span><span class="value">{{ currentPerson?.empNo }}</span></div>
        <div class="info-row"><span class="label">部门：</span><span class="value">{{ currentPerson?.department }}</span>
        </div>
        <div class="info-row"><span class="label">工种：</span><span class="value">{{ currentPerson?.worktypename || '无'
            }}</span></div>
        <div class="info-row"><span class="label">电话：</span><span class="value">{{ currentPerson?.tel || '无' }}</span>
        </div>
        <div class="info-row"><span class="label">北斗码：</span><span class="value">{{ beidouGridCodeLoading ? '加载中...' :
            beidouGridCode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';
import * as gs3d from '../../../public/gs3d/index';
const props = defineProps(['viewer'])

const peopleList = computed(() => store.state.personnel.personnelMap);
const personnelList = computed(() => store.state.personnel.personnelList);
const activeName = ref();
const departTypeList = ref([])
const personPopupVisible = ref(false)
const currentPerson = ref(null)
const beidouGridCode = ref('无')
const beidouGridCodeLoading = ref(false)
const popupPosition = ref({ x: 0, y: 0 })
const popupRef = ref(null)

let isDragging = false
let dragOffset = { x: 0, y: 0 }

const onMouseMove = (e) => {
  if (!isDragging || !popupRef.value) return
  requestAnimationFrame(() => {
    if (!isDragging || !popupRef.value) return
    const scaleX = window.innerWidth / 1920
    const scaleY = window.innerHeight / 1080
    const newX = (e.clientX / scaleX) - dragOffset.x
    const newY = (e.clientY / scaleY) - dragOffset.y
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
    const logicalLeft = rect.left / scaleX
    const logicalTop = rect.top / scaleY
    dragOffset = {
      x: (e.clientX / scaleX) - logicalLeft,
      y: (e.clientY / scaleY) - logicalTop
    }
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
let screenEventHandler = null

const getBeidouGridCode = async (lng, lat) => {
  beidouGridCodeLoading.value = true;
  try {
    const response = await fetch(`/zwyl/grid/person?lng=${lng}&lat=${lat}&level=27`);
    const json = await response.json();
    if (json.gridCode) {
      beidouGridCode.value = json.gridCode;
    } else {
      beidouGridCode.value = '无';
    }
  } catch (error) {
    console.error('Failed to fetch Beidou Grid Code:', error);
    beidouGridCode.value = '无';
  } finally {
    beidouGridCodeLoading.value = false;
  }
};

const openPersonPopup = async (source, personData) => {
  currentPerson.value = personData
  if (personData.longitude && personData.latitude) {
    getBeidouGridCode(personData.longitude, personData.latitude)
  } else {
    beidouGridCode.value = '无'
  }
  if (source && props.viewer) {
    if (postRender) {
      postRender()
      postRender = null
    }
    postRender = props.viewer.scene.postRender.addEventListener(() => {
      let cartesian
      if (Array.isArray(source)) {
        cartesian = gs3d.Cesium.Cartesian3.fromDegrees(source[0], source[1], source[2] || 0)
      } else {
        cartesian = source?.id?._position?.getValue?.()
      }
      if (!cartesian) return
      const windowPosition = gs3d.Cesium.SceneTransforms.wgs84ToWindowCoordinates(props.viewer.scene, cartesian)
      const scaleX = window.innerWidth / 1920
      const scaleY = window.innerHeight / 1080
      if (windowPosition) {
        popupPosition.value = {
          x: windowPosition.x / scaleX + 20,
          y: windowPosition.y / scaleY - 100,
        }
      }
    })
  } else {
    popupPosition.value = { x: 500, y: 300 }
  }
  personPopupVisible.value = true
}

const closePersonPopup = () => {
  personPopupVisible.value = false
  currentPerson.value = null
  beidouGridCode.value = '无'
}

const billBoardOption = (name) => {
  return {
    text: name,
    font: '16px Helvetica',
    style: 'FILL',
    fillColor: '#ffffff',
    outlineWidth: 1,
    outlineColor: '#ffffff',
    showBackground: false,
    backgroundColor: '#000000',
    pixelOffset: [0, 20],
    distance: { near: 0, far: 30000000 },
    url: 'image/1.png',
    width: 40,
    height: 40
  }
}

const showAllPerson = (person) => {
  if (!props.viewer) return;
  gs3d.common.draw.drawGraphic(props.viewer, {
    "type": "Point",
    "coordinates": [person.longitude, person.latitude, person.layer]
  }, {
    graphicName: 'person_' + person.empName,
    billBoardOption: billBoardOption(person.empName),
    showBillBoard: true,
    entityProperties: {
      deviceType: 'person',
      floor: 1,
    }
  })
}

watch(peopleList, (newMap) => {
  if (newMap && newMap.size > 0) {
    activeName.value = [...newMap.keys()][0]
    departTypeList.value = []
    Array.from(newMap.values()).forEach(element => {
      const dept = element[0].department || '一线员工'
      departTypeList.value.push({
        label: dept,
        value: dept,
        detailPeople: element
      })
    });
  }
}, { immediate: true })

watch([personnelList, () => props.viewer], ([newList, newViewer]) => {
  if (newViewer) {
    gs3d.common.draw.clearAllGraphic(newViewer)
    if (newList) {
      newList.forEach(person => showAllPerson(person))
    }
  }
}, { immediate: true })

onMounted(async () => {
  store.dispatch('personnel/startPolling')

  if (props.viewer) {
    screenEventHandler = new gs3d.Cesium.ScreenSpaceEventHandler(props.viewer.scene.canvas)
    screenEventHandler.setInputAction(async function (e) {
      const position = e.position
      if (!position) {
        closePersonPopup()
        return
      }
      let pick = props.viewer.scene.pick(position)
      if (!pick) {
        closePersonPopup()
        return
      }
      const graphicName = pick?.id?.graphicName || pick?.id?.id || pick?.id?.name || ''
      if (pick?.id?.properties?.deviceType?.getValue?.() === 'person' || graphicName.startsWith('person_')) {
        const empName = graphicName.replace(/^person_/, '')
        let matchedPerson = null
        if (peopleList.value) {
          for (let people of peopleList.value.values()) {
            let p = people.find(item => item.empName === empName)
            if (p) {
              matchedPerson = p
              break
            }
          }
        }
        if (matchedPerson) {
          await openPersonPopup(pick, matchedPerson)
        } else {
          closePersonPopup()
        }
      }
    }, gs3d.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
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
  if (!val.longitude || !val.latitude || !props.viewer) {
    ElMessage({
      type: 'warning',
      message: `${val.empName || '人员'}坐标点缺失或视图未就绪！`
    })
    return
  }

  const targetCartesian = gs3d.Cesium.Cartesian3.fromDegrees(val.longitude, val.latitude, 0)
  const enuMatrix = gs3d.Cesium.Transforms.eastNorthUpToFixedFrame(targetCartesian)
  const offset = new gs3d.Cesium.Cartesian3(20, 20, 30)
  const destination = gs3d.Cesium.Matrix4.multiplyByPoint(enuMatrix, offset, new gs3d.Cesium.Cartesian3())

  const toTarget = gs3d.Cesium.Cartesian3.subtract(targetCartesian, destination, new gs3d.Cesium.Cartesian3())
  const inverseEnu = gs3d.Cesium.Matrix4.inverse(enuMatrix, new gs3d.Cesium.Matrix4())
  const localToTarget = gs3d.Cesium.Matrix4.multiplyByPointAsVector(inverseEnu, toTarget, new gs3d.Cesium.Cartesian3())
  const heading = Math.atan2(localToTarget.x, localToTarget.y)
  const pitch = Math.atan2(localToTarget.z, Math.hypot(localToTarget.x, localToTarget.y))

  props.viewer.camera.flyTo({
    destination,
    orientation: {
      heading,
      pitch,
      roll: 0,
    },
    duration: 1.5,
    complete: () => {
      openPersonPopup([val.longitude, val.latitude, val.layer || 0], val)
    }
  })
}

onUnmounted(() => {
  if (screenEventHandler) {
    screenEventHandler.destroy()
    screenEventHandler = null
  }
  closePersonPopup()
  if (postRender) {
    postRender()
    postRender = null
  }
  if (props.viewer) {
    gs3d.common.draw.clearAllGraphic(props.viewer)
  }
})
</script>

<style lang="scss" scoped>
@import url('./PersonStatistics.scss');

:deep(.el-collapse) {
  --el-collapse-content-bg-color: transparent;
  --el-collapse-header-bg-color: #0356b570;
  --el-collapse-border-color: #0356b570;
  --el-collapse-header-height: 36px;
  --el-collapse-header-text-color: #ffffff;
  margin: 6px;

  .el-collapse-item__content {
    margin: 14px;
  }
}
</style>