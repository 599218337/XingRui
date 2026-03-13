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
        <span>设备统计</span>
      </div>
      <div class="searchBox">
        <el-input v-model="searchModelName" placeholder="请输入关键字进行过滤" clearable />
      </div>
      <div class="content">
        <template v-for="(items, category) in groupedDeviceList" :key="category">
          <div class="categoryHeader" v-if="items && items.length">{{ category }}</div>
          <template v-for="item in items" :key="item.id">
            <div class="contentItem">
              <div class="Item">
                <div class="point" style="background: #00FF7A"></div>
                <div class="text">{{ item.tagNumber }} - {{ item.description }}</div>
              </div>
              <div class="icon">
                <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="view" @click.stop="showDeviceDetail(item)"></div>
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
  <!-- 设备详情弹窗 -->
  <div v-if="deviceDetailVisible" class="device-detail-popup">
    <div class="device-detail-popup__header">
      <span>{{ currentDevice?.tagNumber }} - {{ currentDevice?.description }}</span>
      <button class="device-detail-popup__close" @click="closeDeviceDetail"></button>
    </div>
    <div class="device-detail-popup__body">
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">序号</span>
        <span class="device-detail-popup__value">{{ currentDevice?.id }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">位号</span>
        <span class="device-detail-popup__value">{{ currentDevice?.tagNumber }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">描述</span>
        <span class="device-detail-popup__value">{{ currentDevice?.description }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">设备台账分类</span>
        <span class="device-detail-popup__value">{{ currentDevice?.categoryName || '-' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">ABC标识</span>
        <span class="device-detail-popup__value">{{ currentDevice?.abcLabel || '-' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">投用日期</span>
        <span class="device-detail-popup__value">{{ currentDevice?.commissionDate || '-' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">责任人</span>
        <span class="device-detail-popup__value">{{ currentDevice?.responsible || '-' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">量程</span>
        <span class="device-detail-popup__value">{{ currentDevice?.range || '-' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">工作介质</span>
        <span class="device-detail-popup__value">{{ currentDevice?.workingMedium || '-' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">工作压力</span>
        <span class="device-detail-popup__value">{{ currentDevice?.workingPressure || '-' }}</span>
      </div>
      <div class="device-detail-popup__row">
        <span class="device-detail-popup__label">工作温度</span>
        <span class="device-detail-popup__value">{{ currentDevice?.workingTemp || '-' }}</span>
      </div>
    </div>
  </div>
  <div class="editMessage">
    <div class="edit1" v-show="showEdit1">
      <span>请用鼠标左键放置设备点位</span>
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

</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted } from 'vue'
import { useStore } from "vuex";
import axios from 'axios';
const store = useStore();

import emitter from '@/utils/bus'
import { deviceList } from './deviceList'
import * as gs3d from '/public/gs3d/index'

const { viewer } = defineProps(['viewer'])
// 按 categoryName 分组
const groupedDeviceList = computed(() => {
  const groups = {}
  deviceList.forEach(item => {
    const keyword = searchModelName.value ? searchModelName.value.toLowerCase() : ''
    if (keyword) {
      const matchTag = item.tagNumber && item.tagNumber.toLowerCase().includes(keyword)
      const matchDesc = item.description && item.description.toLowerCase().includes(keyword)
      if (!matchTag && !matchDesc) {
        return // skip this item
      }
    }
    const key = item.categoryName || '其他'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })
  return groups
})

// 设备详情弹窗
const deviceDetailVisible = ref(false)
const currentDevice = ref(null)

const showDeviceDetail = async (item) => {
  currentDevice.value = item
  deviceDetailVisible.value = true
  focusModelByName(item)

  // 模拟请求网格数据并渲染
  const gridData = await axios.get(`zwyl/grid/model?modelName=${item.tagName}&demTag=false`)
  if (gridData.data) {
    renderGrid(gridData.data)
  }
}

const closeDeviceDetail = () => {
  deviceDetailVisible.value = false
  currentDevice.value = null
  clearGrid()
}


// ── 网格渲染（Primitive API，纯笛卡尔几何，对标 Three.js BufferGeometry） ──
let gridPrimitives = []

const renderGrid = (data) => {
  clearGrid()

  const Cesium = gs3d.Cesium
  const { gridPoints, height: gridH, propertyList } = data
  if (!gridPoints?.length || !propertyList?.length) return

  const R = 6378137 // WGS84 长半轴
  const faceInstances = []
  const outlineInstances = []
  const flyToPositions = []

  propertyList.forEach((layerProps, layerIdx) => {
    // 每层颜色从青→蓝渐变，与 HTML 保持一致
    const t = propertyList.length > 1 ? layerIdx / (propertyList.length - 1) : 0
    const g = Math.round(t * 0x88 + (1 - t) * 0xd4)
    const faceColor = new Cesium.Color(0, g / 255, 1.0, 0.25)

    layerProps.forEach((prop) => {
      const idx = prop.serialNumber
      if (idx >= gridPoints.length) return

      const pt = gridPoints[idx]
      // 数据格式：[minLat, minLon, maxLat, maxLon]
      const south = pt[0], west = pt[1], north = pt[2], east = pt[3]
      const hBot = layerIdx * gridH
      const hTop = hBot + gridH

      // 中心点
      const centerLon = (west + east) / 2
      const centerLat = (south + north) / 2
      const centerH = (hBot + hTop) / 2

      // 经纬度 → 米（与 HTML 的 ll2xyz 逻辑一致）
      const widthX = (east - west) * Math.PI / 180 * R * Math.cos(centerLat * Math.PI / 180)
      const widthY = (north - south) * Math.PI / 180 * R
      const widthZ = gridH

      const center = Cesium.Cartesian3.fromDegrees(centerLon, centerLat, centerH)
      const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)

      flyToPositions.push(center)

      // 半透明体块面
      faceInstances.push(new Cesium.GeometryInstance({
        geometry: Cesium.BoxGeometry.fromDimensions({
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          dimensions: new Cesium.Cartesian3(widthX, widthY, widthZ)
        }),
        modelMatrix,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(faceColor)
        }
      }))

      // 线框棱边
      outlineInstances.push(new Cesium.GeometryInstance({
        geometry: Cesium.BoxOutlineGeometry.fromDimensions({
          dimensions: new Cesium.Cartesian3(widthX, widthY, widthZ)
        }),
        modelMatrix,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CYAN)
        }
      }))
    })
  })

  // 批量渲染：所有体块面合为 1 个 Primitive（高性能）
  if (faceInstances.length) {
    const p = viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: faceInstances,
      appearance: new Cesium.PerInstanceColorAppearance({
        translucent: true,
        flat: true
      }),
      asynchronous: false
    }))
    gridPrimitives.push(p)
  }

  // 批量渲染：所有棱边合为 1 个 Primitive
  if (outlineInstances.length) {
    const p = viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: outlineInstances,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        renderState: {
          lineWidth: Math.min(2.0, viewer.scene.maximumAliasedLineWidth)
        }
      }),
      asynchronous: false
    }))
    gridPrimitives.push(p)
  }

  // 飞向网格区域
  if (flyToPositions.length) {
    const boundingSphere = Cesium.BoundingSphere.fromPoints(flyToPositions)
    viewer.camera.flyToBoundingSphere(boundingSphere, {
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(-35),
        150
      ),
      duration: 2.0
    })
  }
}

const clearGrid = () => {
  gridPrimitives.forEach(p => {
    if (p && !p.isDestroyed()) viewer.scene.primitives.remove(p)
  })
  gridPrimitives = []
}

const searchModelName = ref('')

const focusModelByName = (item) => {
  const entry = gs3d.global.variable.gs3dAllLayer.find((layerItem) => layerItem.id === 'noWallBuild')
  const tileset = entry?.layer?.tileSet
  if (!tileset) {
    ElMessage.error('模型未加载')
    return
  }

  // 使用 3D Tiles 样式高亮指定的模型 (基于 name 或 id 属性), 支持模糊查询
  const nameToFind = item.tagName || item.tagNumber;
  if (!nameToFind) return;

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
        ["true", "color('#0099FF')"]
      ]
    }
  });

  ElMessage.success(`已高亮模型: ${nameToFind}`);
}

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 100) // slight delay to allow DOM to render first, then apply transition
})
const showContent = ref(false)
const showContentFuc = () => {
  showContent.value = !showContent.value
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
    // 之前是调用云渲染 location 定位
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
  cameraArray.forEach((item) => {
    if (item.id == val.id.split('_')[1]) {
      item.coord = val.coord
      item.coord_type = val.coord_type
      item.coord_z = val.coord_z
      item.coord_z_type = val.coord_z_type
    }
  });
  store.dispatch("setCameraArray", cameraArray);
});

// const transform = (type) => {
//   emitter.emit('transform', type);
// }


</script>

<style lang="scss" scoped>
@import url('./devicesListPoi.scss');
</style>

<style lang="scss">
.iconTooltip {
  background-color: rgba(39, 53, 70, 1) !important;
  border: 1px solid rgba(12, 137, 234, 0.40) !important;
  border-radius: 2px !important;
}
</style>