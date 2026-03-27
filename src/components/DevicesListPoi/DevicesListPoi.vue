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
  <!-- 网格悬浮信息弹窗 -->
  <div v-if="gridTooltip.visible" class="grid-tooltip"
    :style="{ left: gridTooltip.x + 'px', top: gridTooltip.y + 'px' }">
    <div class="grid-tooltip__title">网格信息</div>
    <div class="grid-tooltip__row"><span class="grid-tooltip__key">网格编码</span><span class="grid-tooltip__val">{{
      formatGridCode(gridTooltip.code) }}</span></div>
    <div class="grid-tooltip__row"><span class="grid-tooltip__key">底部高度</span><span class="grid-tooltip__val">{{
      gridTooltip.height }}</span></div>
    <div class="grid-tooltip__row"><span class="grid-tooltip__key">纬度范围</span><span class="grid-tooltip__val">{{
      gridTooltip.latRange }}</span></div>
    <div class="grid-tooltip__row"><span class="grid-tooltip__key">经度范围</span><span class="grid-tooltip__val">{{
      gridTooltip.lngRange }}</span></div>
  </div>


</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from "vuex";
import axios from 'axios';
const store = useStore();

import emitter from '@/utils/bus'
import { deviceList } from './deviceList'
import * as gs3d from '/public/gs3d/index'
import { geosotToBeiDou2D } from './geosot2bdcode'

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
  clearGrid()
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

// ── 网格渲染 ──
let gridPrimitives = []
// 网格元数据缓存，key = GeometryInstance id, value = { code, idx, height, pt }
const gridMetaMap = new Map()


/**
 * 根据经纬度范围计算地面物理尺寸（米），用于构建正方体网格
 */
function gridSizeInMeters(south, west, north, east) {
  const R = 6378137
  const centerLat = (south + north) / 2
  const ns = (north - south) * Math.PI / 180 * R
  const ew = (east - west) * Math.PI / 180 * R * Math.cos(centerLat * Math.PI / 180)
  return { ns, ew }
}

const renderGrid = (data) => {
  clearGrid()

  const Cesium = gs3d.Cesium
  const { gridPoints, gridCodes, height: gridH, propertyList } = data
  if (!gridPoints?.length || !propertyList?.length) return

  const finalHeight = gridH

  const faceInstances = []
  const outlineInstances = []
  const flyToPositions = []

  const R = 6378137

  // ── 使用模型(tileset)的变换矩阵作为统一坐标系 ──
  // tileset.root.transform 本质就是模型所在位置的 ENU 矩阵
  // 所有网格都在这个平面坐标系中定位，与模型完全对齐，无椭球弯曲
  let baseMatrix
  let originLat, originLng

  const entry = gs3d.global.variable.gs3dAllLayer.find(l => l.id === 'noWallBuild')
  const tileset = entry?.layer?.tileSet

  if (tileset?.root?.computedTransform) {
    // computedTransform = modelMatrix * root.transform，包含了所有变换
    baseMatrix = Cesium.Matrix4.clone(tileset.root.computedTransform)
    // 从矩阵中提取原点的经纬度
    const originEcef = Cesium.Matrix4.getTranslation(baseMatrix, new Cesium.Cartesian3())
    const originCarto = Cesium.Cartographic.fromCartesian(originEcef)
    originLat = Cesium.Math.toDegrees(originCarto.latitude)
    originLng = Cesium.Math.toDegrees(originCarto.longitude)
  } else if (tileset?.root?.transform) {
    baseMatrix = Cesium.Matrix4.clone(tileset.root.transform)
    if (tileset.modelMatrix && !Cesium.Matrix4.equals(tileset.modelMatrix, Cesium.Matrix4.IDENTITY)) {
      baseMatrix = Cesium.Matrix4.multiply(tileset.modelMatrix, baseMatrix, new Cesium.Matrix4())
    }
    const originEcef = Cesium.Matrix4.getTranslation(baseMatrix, new Cesium.Cartesian3())
    const originCarto = Cesium.Cartographic.fromCartesian(originEcef)
    originLat = Cesium.Math.toDegrees(originCarto.latitude)
    originLng = Cesium.Math.toDegrees(originCarto.longitude)
  } else {
    // 无模型时回退：以网格质心建立 ENU
    const allLats = gridPoints.map(pt => (pt[0] + pt[2]) / 2)
    const allLngs = gridPoints.map(pt => (pt[1] + pt[3]) / 2)
    originLat = allLats.reduce((a, b) => a + b) / allLats.length
    originLng = allLngs.reduce((a, b) => a + b) / allLngs.length
    const originCartesian = Cesium.Cartesian3.fromDegrees(originLng, originLat, 0)
    baseMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(originCartesian)
  }

  const cosOriginLat = Math.cos(originLat * Math.PI / 180)

  // 预计算每个网格的边长（以纬度跨度为准，做正方形）
  const sideCache = new Map()
  gridPoints.forEach((pt, idx) => {
    const { ns } = gridSizeInMeters(pt[0], pt[1], pt[2], pt[3])
    sideCache.set(idx, ns)
  })

  propertyList.forEach((layerProps, layerIdx) => {
    // 每层颜色从青→蓝渐变
    const t = propertyList.length > 1 ? layerIdx / (propertyList.length - 1) : 0
    const g = Math.round(t * 0x88 + (1 - t) * 0xd4)
    const faceColor = new Cesium.Color(0, g / 255, 1.0, 0.05)

    layerProps.forEach((prop) => {
      const idx = prop.serialNumber
      if (idx >= gridPoints.length) return

      const hBot = layerIdx * finalHeight + 1.5
      const hTop = hBot + finalHeight
      const centerH = (hBot + hTop) / 2
      const boxH = hTop - hBot
      const side = sideCache.get(idx)

      const pt = gridPoints[idx]
      const centerLon = (pt[1] + pt[3]) / 2
      const centerLat = (pt[0] + pt[2]) / 2
      flyToPositions.push(Cesium.Cartesian3.fromDegrees(centerLon, centerLat, centerH))

      // 局部偏移（米），只有小数值，避免 float32 精度丢失
      // 大坐标(ECEF百万级)放在 Primitive.modelMatrix 上以双精度处理
      const eastOffset = (centerLon - originLng) * Math.PI / 180 * R * cosOriginLat
      const northOffset = (centerLat - originLat) * Math.PI / 180 * R
      const upOffset = centerH

      // 只包含小的局部偏移，不包含 ECEF 大坐标
      const localMatrix = Cesium.Matrix4.fromTranslation(
        new Cesium.Cartesian3(eastOffset, northOffset, upOffset)
      )

      // 半透明体块面
      const instanceId = `grid_${idx}_${layerIdx}`
      gridMetaMap.set(instanceId, {
        code: gridCodes?.[idx] || '-',
        idx,
        height: hBot.toFixed(3) + ' m',
        pt,
      })

      faceInstances.push(new Cesium.GeometryInstance({
        id: instanceId,
        geometry: Cesium.BoxGeometry.fromDimensions({
          dimensions: new Cesium.Cartesian3(side, side, boxH),
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        }),
        modelMatrix: localMatrix,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(faceColor)
        }
      }))

      // 线框棱边
      outlineInstances.push(new Cesium.GeometryInstance({
        geometry: Cesium.BoxOutlineGeometry.fromDimensions({
          dimensions: new Cesium.Cartesian3(side, side, boxH)
        }),
        modelMatrix: localMatrix,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CYAN.withAlpha(0.05))
        }
      }))
    })
  })

  // 批量渲染：所有体块面合为 1 个 Primitive
  // ★ 关键：baseMatrix（含 ECEF 百万级坐标）放在 Primitive.modelMatrix 上
  //   Cesium 会以双精度处理这个矩阵，避免 float32 精度丢失
  //   每个 GeometryInstance.modelMatrix 只有小的局部偏移（米级）
  if (faceInstances.length) {
    const p = viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: faceInstances,
      appearance: new Cesium.PerInstanceColorAppearance({
        translucent: true,
        flat: true
      }),
      modelMatrix: baseMatrix,
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
      modelMatrix: baseMatrix,
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

  // 注册鼠标悬浮拾取
  setupGridHover()
}

const clearGrid = () => {
  gridPrimitives.forEach(p => {
    if (p && !p.isDestroyed()) viewer.scene.primitives.remove(p)
  })
  gridPrimitives = []
  gridMetaMap.clear()
}

// ── 网格悬浮提示 ──
const gridTooltip = ref({
  visible: false, x: 0, y: 0,
  code: '-', idx: 0, height: '-', latRange: '-', lngRange: '-',
})

const formatGridCode = (code) => {
  if (!code || code === '-') return '-'
  try {
    return geosotToBeiDou2D(code)
  } catch (error) {
    console.warn('[DevicesListPoi] Grid code conversion failed:', error)
    return code
  }
}
let gridHoverHandler = null
let lastHighlightId = null // 上一个高亮的实例 id

// 获取面 Primitive（gridPrimitives[0] 是面，[1] 是线框）
const getFacePrimitive = () => gridPrimitives[0] && !gridPrimitives[0].isDestroyed() ? gridPrimitives[0] : null

const setupGridHover = () => {
  if (gridHoverHandler) return // 只注册一次
  const Cesium = gs3d.Cesium
  gridHoverHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  gridHoverHandler.setInputAction((movement) => {
    const picked = viewer.scene.pick(movement.endPosition)

    if (picked?.id && typeof picked.id === 'string' && picked.id.startsWith('grid_')) {
      const meta = gridMetaMap.get(picked.id)
      if (meta) {
        const pt = meta.pt
        gridTooltip.value = {
          visible: true,
          x: movement.endPosition.x + 16,
          y: movement.endPosition.y + 16,
          code: meta.code,
          idx: meta.idx,
          height: meta.height,
          latRange: pt ? `${pt[0].toFixed(7)} ~ ${pt[2].toFixed(7)}` : '-',
          lngRange: pt ? `${pt[1].toFixed(7)} ~ ${pt[3].toFixed(7)}` : '-',
        }

        // 高亮当前网格
        if (picked.id !== lastHighlightId) {
          const facePrim = getFacePrimitive()
          if (facePrim) {
            // 恢复上一个高亮
            if (lastHighlightId) {
              const prevAttr = facePrim.getGeometryInstanceAttributes(lastHighlightId)
              if (prevAttr) {
                const prevMeta = gridMetaMap.get(lastHighlightId)
                prevAttr.color = Cesium.ColorGeometryInstanceAttribute.toValue(
                  prevMeta?.origColor || new Cesium.Color(0, 0.83, 1.0, 0.1)
                )
              }
            }
            // 高亮新的
            const attr = facePrim.getGeometryInstanceAttributes(picked.id)
            if (attr) {
              // 保存原始颜色
              if (!meta.origColor) {
                meta.origColor = (attr.color && attr.color.value)
                  ? Cesium.Color.fromBytes(attr.color.value[0], attr.color.value[1], attr.color.value[2], attr.color.value[3])
                  : new Cesium.Color(0, 0.83, 1.0, 0.1)
              }
              attr.color = Cesium.ColorGeometryInstanceAttribute.toValue(
                new Cesium.Color(1.0, 1.0, 0.0, 0.6) // 黄色高亮
              )
            }
          }
          lastHighlightId = picked.id
        }
        return
      }
    }

    // 鼠标移出网格：恢复高亮、隐藏弹窗
    if (lastHighlightId) {
      const facePrim = getFacePrimitive()
      if (facePrim) {
        const prevAttr = facePrim.getGeometryInstanceAttributes(lastHighlightId)
        if (prevAttr) {
          const prevMeta = gridMetaMap.get(lastHighlightId)
          prevAttr.color = Cesium.ColorGeometryInstanceAttribute.toValue(
            prevMeta?.origColor || new Cesium.Color(0, 0.83, 1.0, 0.1)
          )
        }
      }
      lastHighlightId = null
    }
    gridTooltip.value.visible = false
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
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
const onNextStep = () => {
  showEdit1.value = false
  showEdit2.value = true
  emitter.emit('transform', cameraEditData);
}
emitter.on('nextStep', onNextStep);

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



const onCompleteCamera = (val) => {
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
}
emitter.on('completeCamera', onCompleteCamera);

// const transform = (type) => {
//   emitter.emit('transform', type);
// }


onUnmounted(() => {
  clearGrid()
  if (gridHoverHandler) {
    gridHoverHandler.destroy()
    gridHoverHandler = null
  }
  emitter.off('nextStep', onNextStep)
  emitter.off('completeCamera', onCompleteCamera)

  // 恢复模型原始颜色逻辑 (由 home.vue 的 watch 统一处理)
  // const entry = gs3d.global.variable.gs3dAllLayer.find((layerItem) => layerItem.id === 'noWallBuild')
  // const tileset = entry?.layer?.tileSet
  // if (tileset) {
  //   tileset.style = undefined
  // }
})

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

.grid-tooltip {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  background: rgba(13, 17, 23, 0.96);
  border: 1px solid #00d4ff;
  padding: 10px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.8;
  min-width: 220px;
  color: #e2eaf6;

  &__title {
    color: #00d4ff;
    font-weight: 700;
    margin-bottom: 4px;
    font-size: 13px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  &__key {
    color: #8b9bb4;
  }

  &__val {
    color: #e2eaf6;
    font-size: 11px;
    word-break: break-all;
    text-align: right;
    max-width: 180px;
  }
}
</style>