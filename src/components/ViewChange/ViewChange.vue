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
  <div class="viewContent1" v-show="showView">
    <div class="view1" @click="viewChange(1)"></div>
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
import { ref, watch, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import * as gs3d from '/public/gs3d/index';
const showView = ref(false)
const viewShow = () => {
  showView.value = !showView.value
}
const viewChange = (type) => {
  let layerConfig

  switch (type) {
    case 1:
      layerConfig = {
        id: 'detail1',
        label: 'detail1',
        type: 'model_3d_tiles',
        url: 'detailModel/Batchedgx_jy/tileset.json',
        setPosition: {
          // lng: 117.05435995706138,
          // lat: 36.674984212615854,
          // height: -5,
        },
        // rotate: {
        //   x: 0,
        //   y: 0,
        //   z: -42,
        // },
        scale: 1,
        // islocation: true,
      }
      toggleModel(layerConfig)
      break;
    case 2:
      layerConfig = {
        id: 'detail2',
        label: 'detail2',
        type: 'model_3d_tiles',
        url: 'detailModel/Batchedgx_lq/tileset.json',
        setPosition: {
          // lng: 117.05435995706138,
          // lat: 36.674984212615854,
          // height: -5,
        },
        // rotate: {
        //   x: 0,
        //   y: 0,
        //   z: -42,
        // },
        scale: 1,
        // islocation: true,
      },
        toggleModel(layerConfig)
      break;
    case 3:
      layerConfig = {
        id: 'detail3',
        label: 'detail3',
        type: 'model_3d_tiles',
        url: 'detailModel/Batchedgx_qq/tileset.json',
        setPosition: {
          // lng: 117.05435995706138,
          // lat: 36.674984212615854,
          // height: -5,
        },
        // rotate: {
        //   x: 0,
        //   y: 0,
        //   z: -42,
        // },
        scale: 1,
        // islocation: true,
      },
        toggleModel(layerConfig)
      break;
    case 4:
      layerConfig = {
        id: 'detail4',
        label: 'detail4',
        type: 'model_3d_tiles',
        url: 'detailModel/Batchedgx_ys/tileset.json',
        setPosition: {
          // lng: 117.05435995706138,
          // lat: 36.674984212615854,
          // height: -5,
        },
        // rotate: {
        //   x: 0,
        //   y: 0,
        //   z: -42,
        // },
        scale: 1,
        // islocation: true,
      },
        toggleModel(layerConfig)
      break;
    case 5:
      gs3d.manager.layerManager.removeLayer('building')
      gs3d.manager.layerManager.addLayer({
        id: 'noWall',
        label: 'noWall',
        type: 'model_3d_tiles',
        url: 'building/part/tileset.json',
        setPosition: {
          // lng: 117.05435995706138,
          // lat: 36.674984212615854,
          // height: -15,
        },
        // rotate: {
        //   x: 0,
        //   y: 0,
        //   z: -42,
        // },
        scale: 1,
        // islocation: true,
        alpha: 0
      })
      break;
    default:
      break;
  }

}
const activeKey = () => {
  cloudRender.SuperAPI("keyboard");
}
const unActiveKey = () => {
  cloudRender.SuperAPI("removekeyboard");
}
const toggleModel = (config) => {
  gs3d.manager.layerManager.addLayer(config)
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