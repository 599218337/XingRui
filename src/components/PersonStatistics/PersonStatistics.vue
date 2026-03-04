<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 14:48:52
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="personStatistics">
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
    <div id="personBtn" @click="showContentFuc"> </div>


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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';
import * as gs3d from '../../../public/gs3d/index';
const { viewer } = defineProps(['viewer'])


const getPersonApiToken = async () => {
  let token;
  await fetch('/people-locate/api/v2/get-token', {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "837E4298041D73923169079720895C06", },
    body: JSON.stringify({
      "appId": "client",
      "buildIdList": [
        "209094"
      ]
    })
  }).then(res => {
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  }).then(json => {
    token = json.data
  })
  return token;
}

// 判断点是否在多边形内（射线法）
const PERSON_AREA_POLYGON = [
  [111.41098823911135, 30.555326852157116],
  [111.40965179382539, 30.556139759665626],
  [111.40775444349205, 30.55431860799904],
  [111.4092221018413, 30.55322451754084],
  [111.41098823911135, 30.555326852157116],
]
const isPointInPolygon = (lon, lat, polygon) => {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}


const getPersonList = async (token) => {
  let personList;
  await fetch('/people-locate/api/v2/person/realTimeData', {
    method: "POST",
    headers: { "Content-Type": "application/json", "token": token, },
    body: JSON.stringify({
      "buildId": "209094"
    })
  }).then(res => {
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  }).then(json => {
    personList = json.data
    personList = personList.reduce((pre, cur) => {
      const lon = Number(cur.longitude)
      const lat = Number(cur.latitude)
      if (isPointInPolygon(lon, lat, PERSON_AREA_POLYGON)) {
        showAllPerson(cur)
        if (!pre.has(cur.department)) {
          pre.set(cur.department, [cur])
        } else {
          pre.get(cur.department).push(cur)
        }
      }
      return pre;
    }, new Map())
  })
  return personList;
}

const peopleList = ref();
const activeName = ref();
const departTypeList = ref([])
const personPopupVisible = ref(false)
const currentPerson = ref(null)
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

const openPersonPopup = async (source, personData) => {
  currentPerson.value = personData
  if (source) {
    if (postRender) {
      postRender()
      postRender = null
    }
    postRender = viewer.scene.postRender.addEventListener(() => {
      let cartesian
      if (Array.isArray(source)) {
        cartesian = gs3d.Cesium.Cartesian3.fromDegrees(source[0], source[1], source[2] || 0)
      } else {
        cartesian = source?.id?._position?.getValue?.()
      }
      if (!cartesian) return
      const windowPosition = gs3d.Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian)
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
}

onMounted(async () => {
  let peopleApiToken = await getPersonApiToken()
  peopleList.value = await getPersonList(peopleApiToken)
  activeName.value = [...peopleList.value.keys()][0]
  Array.from(peopleList.value.values()).forEach(element => {
    departTypeList.value.push({ label: element[0].department, value: element[0].department, detailPeople: element })
  });

  screenEventHandler = new gs3d.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  screenEventHandler.setInputAction(async function (e) {
    const position = e.position
    if (!position) {
      closePersonPopup()
      return
    }
    let pick = viewer.scene.pick(position)
    if (!pick) {
      closePersonPopup()
      return
    }
    const graphicName = pick?.id?.graphicName || pick?.id?.id || pick?.id?.name || ''
    if (pick?.id?.properties?.deviceType?.getValue?.() === 'person' || graphicName.startsWith('person_')) {
      const empName = graphicName.replace(/^person_/, '')
      let matchedPerson = null
      for (let people of peopleList.value.values()) {
        let p = people.find(item => item.empName === empName)
        if (p) {
          matchedPerson = p
          break
        }
      }
      if (matchedPerson) {
        await openPersonPopup(pick, matchedPerson)
      } else {
        closePersonPopup()
      }
    }
  }, gs3d.Cesium.ScreenSpaceEventType.LEFT_CLICK)
})

const billBoardOption = (name) => {
  return {
    text: name, //文字
    font: '16px Helvetica', //字体，默认"16px Helvetica"
    style: 'FILL', //样式，默认"FILL"，可选"FILL"||"OUTLINE"||"FILL_AND_OUTLINE"
    fillColor: '#ffffff', //文字填充颜色，默认"#ffffff"
    outlineWidth: 1, //文字描边宽度,默认1
    outlineColor: '#ffffff', //文字描边颜色，默认"#ffffff"
    showBackground: false, //是否显示文字背景，默认false
    backgroundColor: '#000000', //文字填充颜色，默认"BLACK"
    pixelOffset: [0, 20], //文本偏移量，默认[0,20]
    distance: { near: 0, far: 30000000 }, //文本及图标显示距离范围,默认near:0,far:30000000
    url: 'image/1.png', //图标路径
    width: 40, //图片宽，默认40
    height: 40 //图片高，默认40
  }

}

const showAllPerson = (person) => {
  gs3d.common.draw.drawGraphic(viewer, {
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

const showContent = ref(false)
const showContentFuc = () => {
  let p = showContent.value ? 0 : 374
  let b = showContent.value ? 'url("/image/zhankai.png")' : 'url("/image/shouqi.png")'
  document.getElementsByClassName('personStatistics')[0].style.transform = `translateX(${p}px)`
  document.getElementsByClassName('personStatistics')[0].style.transition = `transform 0.5s`
  document.getElementById('personBtn').style.background = b
  document.getElementById('personBtn').style.backgroundSize = '100% 100%'
  showContent.value = !showContent.value
}



const location = (val) => {
  if (!val.longitude || !val.latitude) {
    ElMessage({
      type: 'warning',
      message: `${val.empName || '人员'}坐标点缺失！`
    })
    return
  }

  // 目标点
  const targetCartesian = gs3d.Cesium.Cartesian3.fromDegrees(val.longitude, val.latitude, 0)
  // 用 ENU 矩阵计算偏移后的观察点
  const enuMatrix = gs3d.Cesium.Transforms.eastNorthUpToFixedFrame(targetCartesian)
  const offset = new gs3d.Cesium.Cartesian3(20, 20, 30) // 东20m、北20m、高30m
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
  gs3d.common.draw.clearAllGraphic(viewer)
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