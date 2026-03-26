<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 19:25:10
 * @FilePath: \screen-web\src\components\footer\footer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="viewChange" @click="viewShow">
    <div class="text">图层显隐</div>
  </div>
  <div class="viewContent0" v-show="showView">
    <div class="view1" @click="viewChange(1)"></div>
    <div class="view6" @click="viewChange(6)"></div>
  </div>
  <div class="viewContent1" v-show="showView">
    <div class="view2" @click="viewChange(2)"></div>
  </div>
  <div class="viewContent2" v-show="showView">
    <div class="view3" @click="viewChange(3)"></div>
    <div class="view4" @click="viewChange(4)"></div>
  </div>
  <div class="viewContent3" v-show="showView">
    <div class="view5" @click="viewChange(5)"></div>
  </div>


</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue'

import { ElMessage } from 'element-plus'
import * as gs3d from '/public/gs3d/index';
import axios from 'axios';
import protobuf from 'protobufjs';

const props = defineProps(['viewer']);

const { Cesium } = gs3d
const showView = ref(false)

// 各管线/建筑的可见性状态（true = 显示）
const visibility = reactive({
  jy: true,   // 给水管
  lq: true,   // 冷却管
  qq: true,   // 蒸汽管
  ys: true,   // 雨水管
  building: true, // 建筑/墙体（其他）
})

// 根据 visibility 状态，重新设置 noWallBuild 的 Cesium3DTileStyle show 条件
const updateVisibilityStyle = () => {
  const entry = gs3d.global.variable.gs3dAllLayer.find(item => item.id === 'noWallBuild')
  const tileset = entry?.layer?.tileSet
  if (!tileset) return

  // 构建 show 条件：按 name 前缀判断是否显示
  const conditions = []
  if (!visibility.jy) conditions.push(["regExp('^jy_').test(${name})", "false"])
  if (!visibility.lq) conditions.push(["regExp('^lq_').test(${name})", "false"])
  if (!visibility.qq) conditions.push(["regExp('^qq_').test(${name})", "false"])
  if (!visibility.ys) conditions.push(["regExp('^ys_').test(${name})", "false"])
  if (!visibility.building) conditions.push(["regExp('^lm_').test(${name})", "false"])


  // 保留已有的 color 条件（如果有的话），只更新 show
  const existingStyle = tileset.style
  const colorConditions = existingStyle?._style?.color?.conditions

  const styleObj = { show: { conditions } }
  if (colorConditions) {
    styleObj.color = { conditions: colorConditions }
  }

  tileset.style = new Cesium.Cesium3DTileStyle(styleObj)
}

const viewShow = () => {
  showView.value = !showView.value
}

const toggleGrid = async () => {
  if (!props.viewer) return;
  if (gridDataLoaded) {
    isGridVisible = !isGridVisible;
    gridPrimitives.forEach(p => { p.show = isGridVisible });
    return;
  }
  try {
    const root = await protobuf.load('/grid/grid.proto');
    const Grid3dBaseDTO = root.lookupType("com.zwyl.governance.entity.Grid3dBaseDTO");
    const response = await axios.get('/Knife4j.txt', { responseType: 'arraybuffer' });
    const buffer = new Uint8Array(response.data);
    const decodedData = Grid3dBaseDTO.decode(buffer);
    renderGrid(props.viewer, decodedData);
    gridDataLoaded = true;
    isGridVisible = true;
  } catch (err) {
    console.error('加载网格出错', err);
    ElMessage.error('加载网格出错');
  }
}

function renderGrid(viewer, decodedData) {
  const { gridPoints, height: gridStepHeight, propertylist } = decodedData;
  const instances = [];

  propertylist.forEach((floorData, floorIndex) => {
    floorData.properties.forEach((prop) => {
      const points = gridPoints[prop.serialNumber].points;
      const rectangle = Cesium.Rectangle.fromDegrees(points[1], points[0], points[3], points[2]);
      const baseHeight = prop.height - 60;
      const topHeight = baseHeight + gridStepHeight;
      const instance = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: rectangle,
          height: baseHeight,
          extrudedHeight: topHeight,
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromCssColorString('rgba(0, 255, 255, 0.03)')
          )
        }
      });
      instances.push(instance);
    });
  });

  if (instances.length > 0) {
    const primitive = new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: true
      }),
      asynchronous: true,
      allowPicking: false // 禁用交互拾取以进一步优化性能
    });
    viewer.scene.primitives.add(primitive);
    gridPrimitives.push(primitive);
  }
}

const gridPrimitives = [];
let gridDataLoaded = false;
let isGridVisible = false;

const viewChange = (type) => {
  switch (type) {
    case 1:
      visibility.jy = !visibility.jy
      break;
    case 2:
      visibility.lq = !visibility.lq
      break;
    case 3:
      visibility.qq = !visibility.qq
      break;
    case 4:
      visibility.ys = !visibility.ys
      break;
    case 5:
      visibility.building = !visibility.building
      break;
    case 6:
      toggleGrid()
      return;
    default:
      break;
  }
  updateVisibilityStyle()
}
const activeKey = () => {
  cloudRender.SuperAPI("keyboard");
}
const unActiveKey = () => {
  cloudRender.SuperAPI("removekeyboard");
}

const viewChange2 = () => {
  let walkJson = {
    "reset_attitude": true,       //true: 使用当前自定义字段限制; false: 使用当前相机的默认参数以及限制
    "pitch": 10,                  //镜头俯仰角(-89~89)
    "pitch_limit": "-85,89",      //镜头俯仰角范围(-89~89)
    "yaw": 0,                    //镜头偏航角(0正北, 0~359)
    "yaw_limit": "0,359",         //镜头偏航角范围(0正北, 0~359)
    "speed": 10,                  //行走速度(单位:米), 取值范围(1~50)
    "speed_ratio": 3,             //行走倍率, 取值范围(1~5)
    "eye_height": 2,              //视眼高度(单位:米), 取值范围在(0.2~3)
    "teleport": true              //下落方式; true:瞬间下落; false:自由落体
  }
  cloudRender.SuperAPI("SetWalkMode", walkJson, (status) => {
    console.log(status); //成功、失败回调
  })


}
const viewChange3 = () => {

}
const viewChange4 = () => {
  let flyJson = {
    "reset_attitude": true,     //true: 使用当前自定义字段限制; false: 使用当前相机的默认参数以及限制
    "coord_z_type": 0,          //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔)
    "coord_z": 35,             //高度(单位:米)
    "pitch": 20,                //镜头俯仰角(-89~89)
    "pitch_limit": "-85,89",    //镜头俯仰角范围(-89~89)
    "yaw": 0,                  //镜头偏航角(0正北, 0~359)
    "yaw_limit": "0,359",       //镜头偏航角范围(0正北, 0~359)
    "speed": 1,                 //飞行速度, 取值范围(1~8)
    "speed_ratio": 5            //飞行倍率, 取值范围(1~5)
  }
  cloudRender.SuperAPI("SetFlyMode", flyJson, (status) => {
    console.log(status); //成功、失败回调
  })
}

function keyBoardRoam(val) {
  cloudRender.SuperAPI("keyboard");
  if (val == 'fly') {
    let flyJson = {
      "reset_attitude": true,     //true: 使用当前自定义字段限制; false: 使用当前相机的默认参数以及限制
      "coord_z_type": 0,          //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔)
      "coord_z": 100,             //高度(单位:米)
      "pitch": 30,                //镜头俯仰角(-89~89)
      "pitch_limit": "-85,89",    //镜头俯仰角范围(-89~89)
      "yaw": 30,                  //镜头偏航角(0正北, 0~359)
      "yaw_limit": "0,179",       //镜头偏航角范围(0正北, 0~359)
      "speed": 1,                 //飞行速度, 取值范围(1~8)
      "speed_ratio": 5            //飞行倍率, 取值范围(1~5)
    }
    cloudRender.SuperAPI("SetFlyMode", flyJson, (status) => {
      console.log(status); //成功、失败回调
    })
  } else if (val == 'walk') {
    let walkJson = {
      "reset_attitude": true,       //true: 使用当前自定义字段限制; false: 使用当前相机的默认参数以及限制
      "pitch": 30,                  //镜头俯仰角(-89~89)
      "pitch_limit": "-85,89",      //镜头俯仰角范围(-89~89)
      "yaw": 30,                    //镜头偏航角(0正北, 0~359)
      "yaw_limit": "0,359",         //镜头偏航角范围(0正北, 0~359)
      "speed": 10,                  //行走速度(单位:米), 取值范围(1~50)
      "speed_ratio": 3,             //行走倍率, 取值范围(1~5)
      "eye_height": 2,              //视眼高度(单位:米), 取值范围在(0.2~3)
      "teleport": true              //下落方式; true:瞬间下落; false:自由落体
    }
    cloudRender.SuperAPI("SetWalkMode", walkJson, (status) => {
      console.log(status); //成功、失败回调
    })
  }

}
function removeKeyBoardRoam() {
  cloudRender.SuperAPI("removekeyboard");
  let jsondata = {
    "reset_attitude": true,                //true: 使用当前自定义字段限制; false: 使用当前相机的默认参数以及限制
    "coord_z_type": 0,                     //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔)
    "coord_z": 100,                        //高度(单位:米)
    "pitch": 30,                           //镜头俯仰角(-89~89)
    "pitch_limit": "-85,89",               //镜头俯仰角范围(-89~89)
    "yaw": 30,                             //镜头偏航角(0正北, 0~359)
    "yaw_limit": "0,179",                  //镜头偏航角范围(0正北, 0~359)
    "arm_distance": 100,                   //镜头距(地面、表面、海拔)距离(单位:米)
    "arm_distance_limit": "50,10000",      //镜头距(地面、表面、海拔)距离范围(单位:米)
    "speed_ratio": 3                       //倍率, 取值范围(1~5)
  }
  cloudRender.SuperAPI("SetSandtablesMode", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
  cloudRender.SuperAPI("ResetCamera", {
    "state": "default"  //default: 场景初始状态; free: 开放场景边界限制
  }, (status) => {
    console.log(status); //成功、失败回调
  })
}


// 设置场景镜头
function SetCameraInfo() {
  let jsonData = {
    "coord_type": "0",
    "cad_mapkey": "",
    "center_coord": "111.447977,30.497089",
    "coord_z": "52.826527",
    "arm_distance": "0.0",
    "arm_distance_max": "0.0",
    "arm_distance_min": "0.0",
    "pitch": "7.75",
    "pitch_max": "89.0",
    "pitch_min": "275.0",
    "yaw": "339.0",
    "left_top_coord": "111.448662,30.497131",
    "right_top_coord": "111.448097,30.497339",
    "left_bottom_coord": "111.447937,30.497103",
    "right_bottom_coord": "111.447998,30.497122",
    "near_clip": "0.1"
  };

  cloudRender.SuperAPI('SetCameraInfo', jsonData, (_back) => {
    console.log('设置场景镜头', _back); //成功、失败回调
  })
}


</script>

<style lang="scss" scoped>
@import url('./ViewChange.scss');
</style>