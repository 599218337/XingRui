<template>

  <div class="custorm_btn right" style="color: #fff" v-show="false">
    <div>
      <p class="title">AES:</p>
      <el-button @click="startGetEID()" size="small" plain>获取AES实体EID</el-button>
      <el-button @click="focusAESObject()" size="small" plain>镜头聚焦至AES实体</el-button>
      <el-button @click="setAESObjectAnimationPlayState()" size="small" plain>动画</el-button>
    </div>
  </div>
  <div class="custorm_btn right" style="color: #fff" v-show="false">
    <div>
      <p class="title">操作:</p>
      <el-button @click="addTest()" size="small" plain>添加poi</el-button>
      <el-button @click="active()" size="small" plain>平移</el-button>
      <el-button @click="deactive()" size="small" plain>结束微调</el-button>
    </div>
  </div>

  <div class="custorm_btn right" style="color: #fff" v-show="true">
    <div>
      <p class="title">操作:</p>
      <el-button @click="startGetCoord()" size="small" plain>取点工具</el-button>
      <el-button @click="addCameraEffect()" size="small" plain>添加摄像头</el-button>
      <el-button @click="activeSuperApiGizmo(1)" size="small" plain>平移</el-button>
      <el-button @click="activeSuperApiGizmo(2)" size="small" plain>旋转</el-button>
      <el-button @click="deactiveSuperApiGizmo()" size="small" plain>结束微调</el-button>
    </div>
    <div>
      <p class="title">操作:</p>
      <el-button @click="GetUrlStartRenderCloud()" size="small" plain>开始渲染</el-button>
      <el-button @click="StopRenderCloud()" size="small" plain>关闭渲染</el-button>

      <el-button @click="StartMeasureTool()" size="small" plain>测量工具</el-button>
      <el-button @click="SplitBuild()" size="small" plain>楼宇拆解</el-button>
    </div>
    <div>
      <p class="title">相机镜头:</p>
      <el-button @click="GetCameraInfo()" size="small" plain>获取当前镜头</el-button>
      <el-button @click="SetCameraInfo()" size="small" plain>设置场景镜头</el-button>
    </div>
    <div>
      <p class="title">POI:</p>
      <el-button @click="AddPOI()" size="small" plain>点击添加poi</el-button>
      <el-button @click="AddCustomPOI()" size="small" plain>自定义poi</el-button>
      <el-button @click="AddPOIByWindow()" size="small" plain>window级poi</el-button>
      <el-button @click="DataDriveObjectToMove()" size="small" plain>数据驱动</el-button>
      <el-button @click="StopDataDriveObjectToMove()" size="small" plain>结束数据驱动</el-button>
    </div>
    <div>
      <p class="title">覆盖物:</p>
      <el-button @click="getId()" size="small" plain>获取id</el-button>
      <el-button @click="ActiveSuperApiGizmo()" size="small" plain>激活移动</el-button>
      <el-button @click="DeactiveSuperApiGizmo()" size="small" plain>退出移动</el-button>
    </div>
    <div>
      <p class="title">汽车漫游:</p>
      <el-button @click="AddPath()" size="small" plain>开始漫游</el-button>
      <el-button @click="changeCamera('1')" size="small" plain>第一人称</el-button>
      <el-button @click="changeCamera('3')" size="small" plain>第三人称</el-button>
    </div>
    <div>
      <p class="title">交互漫游:</p>
      <el-button @click="keyBoardRoam('fly')" size="small" plain>飞行</el-button>
      <el-button @click="keyBoardRoam('walk')" size="small" plain>步行</el-button>
      <el-button @click="removeKeyBoardRoam()" size="small" plain>结束漫游</el-button>
    </div>
    <!-- <div>
            <p class="title">天气:</p>
            <el-button @click="SetEnvWeather('auto')" size="small" plain>实时天气</el-button>
            <el-button @click="SetEnvWeather('Sunny')" size="small" plain>晴天</el-button>
            <el-button @click="SetEnvWeather('Cloudy')" size="small" plain>多云</el-button>
            <el-button @click="SetEnvWeather('PartlyCloudy')" size="small" plain>少云</el-button>
            <el-button @click="SetEnvWeather('Overcast')" size="small" plain>阴天</el-button>
            <el-button @click="SetEnvWeather('LightRain')" size="small" plain>小雨</el-button>
            <el-button @click="SetEnvWeather('ModerateRain')" size="small" plain>中雨</el-button>
            <el-button @click="SetEnvWeather('HeavyRain')" size="small" plain>大雨</el-button>
            <el-button @click="SetEnvWeather('LightSnow')" size="small" plain>小雪</el-button>
            <el-button @click="SetEnvWeather('ModerateSnow')" size="small" plain>中雪</el-button>
            <el-button @click="SetEnvWeather('HeavySnow')" size="small" plain>大雪</el-button>
            <el-button @click="SetEnvWeather('Foggy')" size="small" plain>雾天</el-button>
            <el-button @click="SetEnvWeather('Sand')" size="small" plain>扬尘</el-button>
            <el-button @click="SetEnvWeather('Haze')" size="small" plain>雾霾</el-button>
        </div> -->
  </div>

</template>

<script setup>

import { reactive, onMounted, nextTick, ref, watch, onBeforeUnmount, getCurrentInstance } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();
const env = import.meta.env;
import router from '@router';
import axios from 'axios'
import { CONFIG } from '/public/config.js'
import emitter from '@/utils/bus'
import { ElMessage } from "element-plus";

onMounted(() => {
  cloudRender.SuperAPI("RegisterCloudResponse", myHandleResponseFunction);
})
function myHandleResponseFunction(data) {
  let jsonObject = JSON.parse(data);
  // console.log('jsonObject', jsonObject);
  // console.log('事件', jsonObject.func_name);
  switch (jsonObject.func_name) {
    case 'beginPlay':
      console.log('beginPlay: 开始加载');
      // proxy.$msg.success('开始加载3D');
      break;

    case 'APIAlready':
      console.log('APIAlready: 3D世界加载完成');
      // proxy.$msg.success('3D世界加载完成');
      store.dispatch("setShowLoadingAction", false);
      //云渲染场景加载完成 业务逻辑...
      //Do something when 3D world loading is complete
      addWorkshop()
      setTimeout(() => {
        setTimeWeather()
      }, 4500);
      break;

    case 'OnPOIClick':
      console.log('OnPOIClick_id = ' + jsonObject.args.id);
      poiClick(jsonObject.args)
      // 返回一个点击POI的ID值
      // Do something when return the ID of a clicked POI
      break;
    case 'OnCameraToMoveEnd':
      console.log('小车移动结束，OnCameraToMoveEnd = ' + jsonObject.args.camera_id);
      break;

    case "OnCustomWebJsEvent":
      console.log('OnCustomWebJsEvent = ' + jsonObject.args);
      customWebJsEvent(jsonObject.args)

      break;
    case "OnGetCoord":
      console.log(jsonObject.args)
      getCoord(jsonObject.args)
      break;
    case "OnGetCoveringInfoSuccess":
      console.log(jsonObject.args)
      emitter.emit('completeCamera', jsonObject.args.data[0].add);
      break;
    case "OnSceneEffectClick":
      enterGate(jsonObject.args.id)
      break;

  }
  return data;
}

// watch(() => store.state.activeNav, (val) => {
//     removeCustomPOI()
//     switch (val) {
//         case 0:
//             addWorkshop()
//             break;
//         case 1:
//             addCamera()
//             break;
//         case 2:
//             addFire()
//             break;
//         case 3:
//             addPerson()
//             break;
//         default:
//             break;
//     }

// })

emitter.on('activeNav', (val) => {
  removeCustomPOI()
  switch (val) {
    case 0:
      addWorkshop()
      break;
    case 1:
      addCamera()
      break;
    case 2:
      addFire()
      break;
    case 3:
      addPerson()
      break;
    case 6:
      addPlaces()
      break;
    case 5:
      addDevices()
      break;
    default:
      break;
  }
});

const setTimeWeather = () => {
  cloudRender.SuperAPI("SetEnvTime", {
    "env_time": 'auto',
    "direction": "clockwise"
  })
  cloudRender.SuperAPI("SetEnvWeather", {
    "env_weather": "auto"//store.state.weather
  })
}

let poi_window_open = ''
let workshopOpeningId = '', cameraOpeningId = '', fireOpeningId = '', personOpeningId = ''
const poiClick = (args) => {
  if (args.selected_state == "true") {
    poi_window_open && args.id !== poi_window_open && cloudRender.SuperAPI('SimClickCovering', { "id": poi_window_open, "selected_state": false, "covering_type": "poi" });
    poi_window_open = args.id

    let type = args.id.split('_')[0]
    switch (type) {
      case 'workshop':
        // customWebJsEvent({name:'closeWorkshop'})
        workshopOpeningId = args.id
        break;
      case 'camera':
        // customWebJsEvent({ name: 'closeCamera' })
        cameraOpeningId = args.id
        break
      case 'fire':
        // customWebJsEvent({ name: 'closeFire' })
        fireOpeningId = args.id
        break
      case 'person':
        // customWebJsEvent({ name: 'closePerson' })
        personOpeningId = args.id
        break

      default:
        break;
    }
  }

}

const customWebJsEvent = (args) => {
  switch (args.name) {
    case 'closeWorkshop':
      cloudRender.SuperAPI('SimClickCovering', {
        "id": workshopOpeningId,
        "selected_state": false,
        "covering_type": "poi"
      });
      break;
    case 'bigCamera':
      cloudRender.SuperAPI("UpdateCustomPOIWindow", {
        id: cameraOpeningId,
        window: {
          url: CONFIG.fileUrl + "/html/camera2.html?id=" + cameraOpeningId.split('_')[1] + "&time=" + new Date().getTime(),
          offset: "30,180",
          size: "762,506"
        }
      })
      break;
    case 'smallCamera':
      cloudRender.SuperAPI("UpdateCustomPOIWindow", {
        id: cameraOpeningId,
        window: {
          url: CONFIG.fileUrl + "/html/camera.html?id=" + cameraOpeningId.split('_')[1] + "&time=" + new Date().getTime(),
          offset: "30,180",
          size: "326,228"
        }
      })
      break;
    case 'closeCamera':
      cloudRender.SuperAPI("SimClickCovering", {
        id: cameraOpeningId,
        selected_state: false,
        covering_type: "poi"
      })
      break;
    case 'closeFire':
      cloudRender.SuperAPI("SimClickCovering", {
        id: fireOpeningId,
        selected_state: false,
        covering_type: "poi"
      })
      break;
    case 'closePerson':
      cloudRender.SuperAPI("SimClickCovering", {
        id: personOpeningId,
        selected_state: false,
        covering_type: "poi"
      })
      break;
    default:
      break;
  }

}


const addWorkshop = () => {
  let workshopPoints = CONFIG.places
  workshopPoints.forEach((item) => {
    item.type == 'poi' && addCustomPOI({
      id: "workshop_" + item.id,
      coord: item.coord,
      coord_z: item.coord_z || 0,
      coord_z_type: item.coord_z_type || 0,
      always_show_label: true,
      marker: {
        size: "71,94",
        images: [
          {
            "define_state": "state_1",
            "normal_url": CONFIG.fileUrl + "/images/workshop.png",
            "activate_url": CONFIG.fileUrl + "/images/workshop.png"
          }
        ]
      },
      label: {
        bg_image_url: CONFIG.fileUrl + "/images/workshopLabel.png",
        bg_size: (item.width || "55") + ",26",
        bg_offset: "20,70",
        content: [
          {
            text: [item.label, "ffffffff", "10"],
            text_offset: "8,5",
          },
        ],
      },
      window: {
        url: CONFIG.fileUrl + "/html/workshop.html",
        size: "760,526",
        offset: "30,180"
      }

    })
  })
}

const addCamera = () => {
  let cameraArray = []

  axios.post('/api/cameraInfo/getCameraInfoList').then((res) => {
    console.log('111', res)
    if (res.status == 200 && res.data?.status == 200) {
      cameraArray = res.data.data
      store.dispatch("setCameraArray", cameraArray);
      cameraArray.forEach((item) => {
        item.coord && addCustomPOI({
          id: 'camera_' + item.id,
          coord: item.coord,
          coord_z: item.coord_z || 0,
          coord_z_type: item.coord_z_type || 0,
          always_show_label: true,
          marker: {
            size: "62,78",
            images: [
              {
                "define_state": "state_1",
                "normal_url": CONFIG.fileUrl + "/images/camera.png",
                "activate_url": CONFIG.fileUrl + "/images/camera.png"
              }
            ]
          },
          label: {},
          window: {
            url: CONFIG.fileUrl + "/html/camera.html?id=" + item.id + "&time=" + new Date().getTime(),
            size: "326,228",
            offset: "30,180"
          }

        })
      })
    } else {
      ElMessage({ type: 'error', message: '监控点位信息获取失败' })
      return
    }
  }).catch(() => {
    ElMessage({ type: 'error', message: '监控点位信息获取失败' })
    return
  })


}

const addFire = () => {
  let fireArray = CONFIG.places
  store.dispatch("setFireArray", fireArray);
  fireArray.forEach((item) => {
    if (item.coord) {
      switch (item.type) {
        case 'poi':
          addCustomPOI({
            id: 'fire_' + item.id,
            coord: item.coord,
            coord_z: item.coord_z || 0,
            coord_z_type: item.coord_z_type || 0,
            always_show_label: true,
            marker: {
              size: "71,94",
              images: [
                {
                  "define_state": "state_1",
                  "normal_url": CONFIG.fileUrl + "/images/workshop.png",
                  "activate_url": CONFIG.fileUrl + "/images/workshop.png"
                }
              ]
            },
            label: {
              bg_image_url: CONFIG.fileUrl + "/images/workshopLabel.png",
              bg_size: (item.width || "55") + ",26",
              bg_offset: "20,70",
              content: [
                {
                  text: [item.label, "ffffffff", "10"],
                  text_offset: "8,5",
                },
              ],
            },
            window: {
              url: CONFIG.fileUrl + "/html/fire.html?id=" + item.id + "&time=" + new Date().getTime(),
              size: "760,526",
              offset: "30,180"
            }
          })
          break;
        case 'around':
          cloudRender.SuperAPI("AddEffect", {
            id: 'fire_' + item.id,
            coord: item.coord,
            coord_z: item.coord_z || 10,
            coord_z_type: item.coord_z_type || 0,
            "cad_mapkey": "",
            "type": "circle_outside",
            "scale": 4,
            "adaptive": true,
            "pitch": 0,
            "roll": 0,
            "yaw": 0,
            "title_text": item.label || '',
            "title_offset": "10,-10",
            "title_face_to_camera": true,
            "title_text_portrait": false
          })
          break;
        case 'road':
          let jsondata = {
            id: 'fire_' + item.id,
            coord: item.coord,
            coord_z: Number(item.coord_z) + 13,
            coord_z_type: item.coord_z_type || 2,
            "cad_mapkey": "",
            "text": item.label || '',
            "color": "ffffcc",
            "size": 25,
            "thickness": 10,
            "type": "metal",
            "outline": 0,
            "portrait": false,
            "space": 0.2,
            "flash": 5,
            "bounce": 1,
            "pitch": 90,
            "yaw": item.yaw || 250,
            "face_to_camera": false
          }
          cloudRender.SuperAPI("Add3DText", jsondata, (status) => {
            console.log(status); //成功、失败回调
          })
          break;
        case 'gate':
          cloudRender.SuperAPI("AddEffect", {
            id: 'fire_' + item.id,
            coord: item.coord,
            coord_z: item.coord_z || 10,
            coord_z_type: item.coord_z_type || 2,
            "cad_mapkey": "",
            "type": "circle_outside",
            "scale": 5,
            "adaptive": false,
            "pitch": 0,
            "roll": 0,
            "yaw": 0,
            "title_text": '',
            "title_offset": "10,-10",
            "title_face_to_camera": true,
            "title_text_portrait": false
          })
          break;
        default:
          break;
      }

    }

  })
}

const addPlaces = () => {
  let placeArray = [
    {
      id: 1,
      label: '材料区',
      coord: '111.449074,30.496824',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 2,
      label: '筒体总装区',
      coord: '111.449661,30.496656',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 3,
      label: '筒体组焊区',
      coord: '111.449455,30.496664',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 4,
      label: '筒体组焊区',
      coord: '111.449791,30.495953',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 5,
      label: '管束装配区',
      coord: '111.449669,30.496037',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: '5-1',
      label: '管束装配区',
      coord: '111.449547,30.496',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 8,
      label: '试压区',
      coord: '111.449699,30.495766',
      type: 'around',
      coord_z: '54.977553'
    }, {
      id: 9,
      label: '换热管头焊接区',
      coord: '111.449196,30.496889',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 10,
      label: '管束装配区',
      coord: '111.449257,30.496737',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 11,
      label: '卷制区',
      coord: '111.44931,30.496611',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 12,
      label: '标准件堆放区',
      coord: '111.449348,30.496489',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 13,
      label: '钢板卷制回圆区',
      coord: '111.449173,30.496704',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 14,
      label: '埋弧焊',
      coord: '111.449234,30.496559',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 15,
      label: '纵缝焊接区',
      coord: '111.449272,30.49645',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 16,
      label: '激光切割机下料区',
      coord: '111.449089,30.496595',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 17,
      label: '筒体放置区',
      coord: '111.449158,30.496429',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 18,
      label: '换热管头焊接区',
      coord: '111.449158,30.496429',
      type: 'around',
      coord_z: '53.077553'
    }, {
      id: 19,
      label: '机加区',
      coord: '111.449425,30.496906',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 20,
      label: '机加区',
      coord: '111.449554,30.496899',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 22,
      label: '拍片等待区',
      coord: '111.449936,30.49564',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 23,
      label: '接管焊接区',
      coord: '111.449867,30.496107',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: 24,
      label: '打坡口区',
      coord: '111.449463,30.495989',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '24-1',
      label: '打坡口区',
      coord: '111.449539,30.49579',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '27',
      label: '数控火焰切割机下料区',
      coord: '111.449409,30.49577',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '28',
      label: '钢板卷制回圆区',
      coord: '111.449356,30.495913',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '29',
      label: '预制板材区',
      coord: '111.449318,30.495998',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '30',
      label: '纵焊返修区',
      coord: '111.448685,30.495201',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '31',
      label: '筒节待焊待检区',
      coord: '111.448593,30.49526',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '33',
      label: '板材区',
      coord: '111.448372,30.495689',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '34',
      label: '数控等离子',
      coord: '111.448441,30.495539',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '35',
      label: '材料区',
      coord: '111.448547,30.495678',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '36',
      label: '焊接总装',
      coord: '111.448654,30.495611',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '36-1',
      label: '焊接总装',
      coord: '111.448914,30.495543',
      type: 'around',
      coord_z: '53.077553'
    },

    {
      id: '36-2',
      label: '焊接总装',
      coord: '111.449036,30.495567',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '37',
      label: '包装发货区',
      coord: '111.448952,30.495781',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '38',
      label: '试压区',
      coord: '111.44912,30.495375',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '39',
      label: '酸洗区',
      coord: '111.44899,30.495352',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '40',
      label: '现有材料库',
      coord: '111.448296,30.495888',
      type: 'around',
      coord_z: '53.077553'
    },
    {
      id: '41',
      label: '不锈钢材料库',
      coord: '111.448387,30.495926',
      type: 'around',
      coord_z: '53.077553'
    }
  ]
  placeArray.forEach((item) => {
    cloudRender.SuperAPI("AddEffect", {
      id: 'place_' + item.id,
      coord: item.coord,
      coord_z: item.coord_z || 58,
      coord_z_type: item.coord_z_type || 2,
      "cad_mapkey": "",
      "type": "circle_outside",
      "scale": 1,
      "adaptive": false,
      "pitch": 0,
      "roll": 0,
      "yaw": 0,
      "title_text": item.label || '',
      "title_offset": "10,-10",
      "title_face_to_camera": true,
      "title_text_portrait": false
    })
  })

  let areaJsonArray = [{
    "id": "1",
    "color": "1ed9c1",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449036,30.496712"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449188,30.496758"
      },
      {
        "coord": "111.449112,30.496948"
      },
      {
        "coord": "111.448959,30.496902"
      }
    ],
  }, {
    "id": "2",
    "color": "faebd7",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449677,30.496489"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449753,30.496511"
      },
      {
        "coord": "111.449615,30.496826"
      },
      {
        "coord": "111.449547,30.496805"
      }
    ],
  }, {
    "id": "3",
    "color": "eb536b",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449471,30.496428"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449638,30.496477"
      },
      {
        "coord": "111.449509,30.496798"
      },
      {
        "coord": "111.449425,30.496771"
      },
      {
        "coord": "111.449394,30.496847"
      },
      {
        "coord": "111.44931,30.496819"
      }
    ],
  }, {
    "id": "4",
    "color": "eb536b",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449677,30.496168"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449753,30.496189"
      },
      {
        "coord": "111.449928,30.495754"
      },
      {
        "coord": "111.449852,30.495728"
      }
    ],
  }, {
    "id": "5",
    "color": "00ffffa",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449669,30.496166"
      }
      ,
      {
        "coord": "111.449791,30.495861"
      },
      {
        "coord": "111.449699,30.495838"
      },
      {
        "coord": "111.449577,30.49614"
      }
    ],
  }, {
    "id": "5-1",
    "color": "00ffffa",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449547,30.496128"
      }
      ,
      {
        "coord": "111.449661,30.495827"
      },
      {
        "coord": "111.449585,30.495798"
      },
      {
        "coord": "111.449463,30.496105"
      }
    ],
  }, {
    "id": "8",
    "color": "bcf247",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449844,30.495731"
      },
      {
        "coord": "111.449638,30.49567"
      },
      {
        "coord": "111.449585,30.495798"
      },
      {
        "coord": "111.449791,30.495861"
      }
    ],
  }, {
    "id": "9",
    "color": "bcf247",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449203,30.496975"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449257,30.496843"
      },
      {
        "coord": "111.449181,30.49682"
      },
      {
        "coord": "111.449127,30.496952"
      }
    ],
  }, {
    "id": "10",
    "color": "00ffffa",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449257,30.496843"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449326,30.496677"
      },
      {
        "coord": "111.449249,30.496655"
      },
      {
        "coord": "111.449181,30.49682"
      }
    ],
  }, {
    "id": "11",
    "color": "a52a2a",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449326,30.496677"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449379,30.49654"
      },
      {
        "coord": "111.449303,30.496515"
      },
      {
        "coord": "111.449249,30.496655"
      }
    ],
  }, {
    "id": "12",
    "color": "f0ffff",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449379,30.49654"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449432,30.496416"
      },
      {
        "coord": "111.449348,30.496391"
      },
      {
        "coord": "111.449303,30.496515"
      }
    ],
  }, {
    "id": "13",
    "color": "d2691e",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449188,30.496758"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449226,30.496666"
      },
      {
        "coord": "111.44915,30.496643"
      },
      {
        "coord": "111.449112,30.496735"
      }
    ],
  }, {
    "id": "14",
    "color": "509bff",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449226,30.496666"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449333,30.496389"
      },
      {
        "coord": "111.449257,30.496367"
      },
      {
        "coord": "111.44915,30.496643"
      }
    ],
  }, {
    "id": "15",
    "color": "509bff",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449089,30.496691"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449158,30.496521"
      },
      {
        "coord": "111.449081,30.496498"
      },
      {
        "coord": "111.449013,30.49667"
      }
    ],
  }, {
    "id": "16",
    "color": "898560",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449158,30.496521"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449226,30.496355"
      },
      {
        "coord": "111.44915,30.496332"
      },
      {
        "coord": "111.449081,30.496498"
      }
    ],
  }, {
    "id": "17",
    "color": "ca00ff",              //轮廓颜色(HEXA颜色值)
    "points": [

      {
        "coord": "111.449326,30.497011"
      },
      {
        "coord": "111.449394,30.496847"
      },
      {
        "coord": "111.44931,30.496819"
      },
      {
        "coord": "111.449242,30.496986"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      }
    ],
  }, {
    "id": "18",
    "color": "f5f5dc",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449409,30.497038"
      },
      {
        "coord": "111.449509,30.496798"
      },
      {
        "coord": "111.449425,30.496771"
      },
      {
        "coord": "111.449326,30.497011"
      }
    ],
  }, {
    "id": "19",
    "color": "f5f5dc",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449516,30.497068"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "111.449615,30.496826"
      },
      {
        "coord": "111.449547,30.496805"
      },
      {
        "coord": "111.449448,30.497047"
      }
    ],
  }, {
    "id": "21",
    "color": "f8c2cc",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449928,30.495754"
      },
      {
        "coord": "111.449852,30.495728"
      },
      {
        "coord": "111.449936,30.495544"
      },
      {
        "coord": "111.449997,30.495564"
      }
    ],
  }, {
    "id": "22",
    "color": "f8c2cc",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449852,30.496222"
      },
      {
        "coord": "111.449944,30.495996"
      },
      {
        "coord": "111.449875,30.495979"
      },
      {
        "coord": "111.449791,30.496202"
      }
    ],
  }, {
    "id": "23",
    "color": "f8c2cc",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449448,30.496101"
      },
      {
        "coord": "111.449524,30.495918"
      },
      {
        "coord": "111.449448,30.495897"
      },
      {
        "coord": "111.449371,30.496078"
      }
    ],
  }, {
    "id": "23-1",
    "color": "f8c2cc",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449532,30.495897"
      },
      {
        "coord": "111.4496,30.495718"
      },
      {
        "coord": "111.449532,30.495697"
      },
      {
        "coord": "111.449455,30.495878"
      }
    ],
  }, {
    "id": "26",
    "color": "ffff00",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449402,30.495895"
      },
      {
        "coord": "111.449478,30.49572"
      },
      {
        "coord": "111.449402,30.495699"
      },
      {
        "coord": "111.449333,30.495872"
      }
    ],
  }, {
    "id": "27",
    "color": "8a2be2",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449387,30.495949"
      },
      {
        "coord": "111.449402,30.495895"
      },
      {
        "coord": "111.449333,30.495872"
      },
      {
        "coord": "111.44931,30.495928"
      }
    ],
  }, {
    "id": "28",
    "color": "7fff00",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449333,30.496067"
      },
      {
        "coord": "111.449387,30.495949"
      },
      {
        "coord": "111.44931,30.495928"
      },
      {
        "coord": "111.449265,30.496046"
      }
    ],
  }, {
    "id": "29",
    "color": "7fff00",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.448677,30.495157"
      },
      {
        "coord": "111.448647,30.495237"
      },
      {
        "coord": "111.448692,30.495251"
      },
      {
        "coord": "111.448723,30.495173"
      }
    ],
  }, {
    "id": "30",
    "color": "f0ffff",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.44854,30.495205"
      },
      {
        "coord": "111.448509,30.495279"
      },
      {
        "coord": "111.448639,30.495316"
      },
      {
        "coord": "111.448669,30.495241"
      }
    ],
  }, {
    "id": "32",
    "color": "704926",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.448372,30.495646"
      },
      {
        "coord": "111.448326,30.495756"
      },
      {
        "coord": "111.448441,30.495789"
      },
      {
        "coord": "111.448479,30.495682"
      }
    ],
  }, {
    "id": "33",
    "color": "9a62bb",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.448456,30.49544"
      },
      {
        "coord": "111.448372,30.495646"
      },
      {
        "coord": "111.448479,30.495682"
      },
      {
        "coord": "111.448563,30.495478"
      }
    ],
  }, {
    "id": "34",
    "color": "9a62bb",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.44854,30.495623"
      },
      {
        "coord": "111.448494,30.495739"
      },
      {
        "coord": "111.448547,30.495754"
      },
      {
        "coord": "111.448601,30.495642"
      }
    ],
  }, {
    "id": "35",
    "color": "ff0000",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.44873,30.495304"
      },
      {
        "coord": "111.448555,30.495756"
      },
      {
        "coord": "111.448631,30.495781"
      },
      {
        "coord": "111.448814,30.495333"
      }
    ],
  }, {
    "id": "35-1",
    "color": "ff0000",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.448898,30.495224"
      },
      {
        "coord": "111.448669,30.49579"
      },
      {
        "coord": "111.448845,30.495842"
      },
      {
        "coord": "111.44902,30.495396"
      },
      {
        "coord": "111.448944,30.495375"
      },
      {
        "coord": "111.448975,30.495247"
      }
    ],
  }, {
    "id": "35-2",
    "color": "ff0000",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.449028,30.495472"
      },
      {
        "coord": "111.448944,30.495686"
      },
      {
        "coord": "111.44902,30.495712"
      },
      {
        "coord": "111.449112,30.495495"
      }
    ],
  }, {
    "id": "36",
    "color": "ae9481",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.448944,30.495686"
      },
      {
        "coord": "111.448875,30.495852"
      },
      {
        "coord": "111.448959,30.495876"
      },
      {
        "coord": "111.44902,30.495712"
      }
    ],
  }, {
    "id": "37",
    "color": "765d8c",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.44912,30.495289"
      },
      {
        "coord": "111.449059,30.495445"
      },
      {
        "coord": "111.44912,30.495464"
      },
      {
        "coord": "111.449181,30.495308"
      }
    ],
  }, {
    "id": "38",
    "color": "5f9ea0",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.44899,30.495253"
      },
      {
        "coord": "111.448944,30.495375"
      },
      {
        "coord": "111.44902,30.495396"
      },
      {
        "coord": "111.449066,30.495274"
      }
    ],
  }, {
    "id": "39",
    "color": "5f9ea0",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.448296,30.495762"
      },
      {
        "coord": "111.448196,30.495996"
      },
      {
        "coord": "111.448296,30.496025"
      },
      {
        "coord": "111.448387,30.49579"
      }
    ],
  }, {
    "id": "40",
    "color": "c4590a",              //轮廓颜色(HEXA颜色值)
    "points": [
      {
        "coord": "111.448387,30.49579"
      },
      {
        "coord": "111.448296,30.496025"
      },
      {
        "coord": "111.448395,30.496056"
      },
      {
        "coord": "111.448494,30.495825"
      }
    ],
  }]
  areaJsonArray.forEach((item) => {
    cloudRender.SuperAPI("AddRange", {
      id: 'area_' + item.id,
      "coord_type": 0,                  //坐标类型(0:经纬度坐标, 1:cad坐标)
      "cad_mapkey": "",                 //CAD基准点Key值, 项目中约定
      "coord_z": 52.077553,                     //高度(单位:米)
      "coord_z_type": 2,
      "type": "wave",                   //样式类型; 注①
      "range_height": 1,               //围栏高度(单位:米)
      "stroke_weight": 0.3,              //底部轮廓线宽度(单位:米; 注: 区域中含有内环"inner_points"时无效)
      "fill_area": "none",              //底部区域填充类型; 注②
      color: item.color,
      points: item.points,
    })
  })


  // let jsondata = {
  //   "id": 'place_30',           //覆盖物id
  //   "covering_type": "scene_effect",     //覆盖物类型, 详见下表
  //   "distance": 10           //距离(单位:米), 默认20米
  // }
  // cloudRender.SuperAPI("FocusCovering", jsondata, (status) => {
  //   console.log(status); //成功、失败回调
  // })

}


const addFire1 = () => {
  let fireArray =
    [
      {
        id: 0,
        label: '东厂区门口监控',
        status: true,
        video: '',
        coord: '111.448387,30.496483',
        type: '灭火器'
      },
      {
        id: 1,
        label: '员工通道入口',
        status: true,
        video: '',
        coord: '111.449142,30.496061',
        type: '消防泵'
      },
      {
        id: 2,
        label: '货物装卸区',
        status: true,
        video: '',
        coord: '111.447746,30.497774',
        type: '灭火器'
      },
      {
        id: 3,
        label: '设备运行区',
        status: true,
        video: '',
        coord: '111.447327,30.498665',
        type: '消防泵'
      },
      {
        id: 4,
        label: '质检区',
        status: true,
        video: '',
        type: '灭火器'
      },
      {
        id: 5,
        label: '原材料仓库',
        status: true,
        video: '',
        type: '消防泵'
      },
      {
        id: 6,
        label: '成品仓库',
        status: true,
        video: '',
        type: '灭火器'
      },
      {
        id: 7,
        label: '易燃易爆物品区',
        status: true,
        video: '',
        type: '消防泵'
      },
      {
        id: 8,
        label: '消防通道与出口',
        status: true,
        video: '',
        type: '灭火器'
      },
      {
        id: 9,
        label: '危险作业区',
        status: true,
        video: '',
        type: '消防泵'
      },
      {
        id: 10,
        label: '休息区',
        status: true,
        video: '',
        type: '消防泵'
      },
      {
        id: 11,
        label: '停车场',
        status: true,
        video: '',
        type: '消防泵'
      },
      {
        id: 12,
        label: '保密区域',
        status: true,
        video: '',
        type: '消防泵'
      },
      {
        id: 13,
        label: '工厂周边',
        status: true,
        video: '',
        type: '消防泵'
      },
      {
        id: 14,
        label: '厂区西门',
        status: false,
        video: '',
      },
      {
        id: 15,
        label: '贵重产品存放区',
        status: false,
        video: '',
        type: '灭火器'
      },
      {
        id: 16,
        label: '东厂门口监控',
        status: false,
        video: '',
        type: '灭火器'
      }
    ]
  store.dispatch("setFireArray", fireArray);
  fireArray.forEach((item) => {
    addCustomPOI({
      id: 'fire_' + item.id,
      coord: item.coord,
      coord_z: item.coord_z || 0,
      coord_z_type: item.coord_z_type || 0,
      always_show_label: true,
      marker: {
        size: "62,78",
        images: [
          {
            "define_state": "state_1",
            "normal_url": CONFIG.fileUrl + `/images/${item.type}.png`,
            "activate_url": CONFIG.fileUrl + `/images/${item.type}.png`
          }
        ]
      },
      label: {},
      window: {
        url: CONFIG.fileUrl + "/html/fire.html?id=" + item.id + "&time=" + new Date().getTime(),
        size: "326,168",
        offset: "-163,246"
      }

    })
  })
}

const addDevices = () => {
  let devicesArray =
    [
      {
        id: 0,
        label: '全自动埋弧焊接机',
        coord: "111.449432,30.496885",
        coord_z: "60.049751",
        coord_z_type: 2
      },
      {
        id: 1,
        label: '全自动埋弧焊接机',
        coord: "111.449471,30.496763",
        coord_z: "60.049755",
        coord_z_type: 2
      },
      {
        id: 2,
        label: '全自动埋弧焊接机',
        coord: "111.449738,30.49609",
        coord_z: "60.049755",
        coord_z_type: 2
      },
      {
        id: 3,
        label: 'P+T等离子纵缝焊接机',
        coord: "111.448608,30.495213",
        coord_z: "58.917774",
        coord_z_type: 2
      },
      {
        id: 4,
        label: 'P+T等离子环缝焊接机',
        coord: "111.448799,30.495626",
        coord_z: "57.445633",
        coord_z_type: 2
      },
      {
        id: 5,
        label: 'P+T等离子环缝焊接机',
        coord: "111.448944,30.495434",
        coord_z: "57.462734",
        coord_z_type: 2
      },
      {
        id: 6,
        label: '数控切割机',
        coord: "111.448456,30.495577",
        coord_z: "53.380672",
        coord_z_type: 2
      },
      {
        id: 7,
        label: '数控切割机',
        coord: "111.449409,30.495806",
        coord_z: "53.316914",
        coord_z_type: 2
      },
      {
        id: 8,
        label: '数控切割机',
        coord: "111.449097,30.496572",
        coord_z: "53.810394",
        coord_z_type: 2
      },
      {
        id: 9,
        label: '立式车床',
        coord: "111.449532,30.496912",
        coord_z: "53.802567",
        coord_z_type: 2
      },
      {
        id: 10,
        label: '立式车床',
        coord: "111.449562,30.496849",
        coord_z: "53.733253",
        coord_z_type: 2
      },
      {
        id: 11,
        label: '插床',
        coord: "111.448616,30.496279",
        coord_z: "53.989208",
        coord_z_type: 2
      },
      {
        id: 12,
        label: '插床',
        coord: "111.448639,30.496288",
        coord_z: "54.112877",
        coord_z_type: 2
      },
      {
        id: 13,
        label: '插床',
        coord: "111.448616,30.496162",
        coord_z: "54.112877",
        coord_z_type: 2
      },
      {
        id: 14,
        label: '插床',
        coord: "111.448753,30.496225",
        coord_z: "54.112877",
        coord_z_type: 2
      },
      {
        id: 15,
        label: '插床',
        coord: "111.448654,30.496166",
        coord_z: "54.112877",
        coord_z_type: 2
      },
      {
        id: 16,
        label: '插床',
        coord: "111.448677,30.49618",
        coord_z: "54.112877",
        coord_z_type: 2
      },
      {
        id: 17,
        label: '刨边机',
        coord: "111.448593,30.495556",
        coord_z: "55.074917",
        coord_z_type: 2
      },
      {
        id: 18,
        label: '刨边机',
        coord: "111.449547,30.495802",
        coord_z: "55.074917",
        coord_z_type: 2
      },
      {
        id: 19,
        label: '摇臂钻床',
        coord: "111.448669,30.49629",
        coord_z: "54.9109",
        coord_z_type: 2
      },
      {
        id: 20,
        label: '摇臂钻床',
        coord: "111.448708,30.496302",
        coord_z: "57.415333",
        coord_z_type: 2
      },
      {
        id: 21,
        label: '摇臂钻床',
        coord: "111.448769,30.496309",
        coord_z: "57.615337",
        coord_z_type: 2
      },
      {
        id: 22,
        label: '举升机',
        coord: "111.449249,30.496525",
        coord_z: "60.049755",
        coord_z_type: 2
      },
      {
        id: 23,
        label: '卷板机',
        coord: "111.449341,30.495993",
        coord_z: "53.22966",
        coord_z_type: 2
      },
      {
        id: 24,
        label: '卷板机',
        coord: "111.449226,30.496592",
        coord_z: "53.164902",
        coord_z_type: 2
      },
      {
        id: 25,
        label: '卷板机',
        coord: "111.449333,30.496544",
        coord_z: "53.240578",
        coord_z_type: 2
      },
      {
        id: 26,
        label: '卷板机',
        coord: "111.448486,30.495497",
        coord_z: "53.141037",
        coord_z_type: 2
      },
      {
        id: 27,
        label: '液压机',
        coord: "111.449493,30.495951",
        coord_z: "55.136444",
        coord_z_type: 2
      },
      {
        id: 28,
        label: '剪板机',
        coord: "111.449455,30.49605",
        coord_z: "53.963886",
        coord_z_type: 2
      },
      {
        id: 29,
        label: '自动四点焊接机',
        coord: "111.448212,30.496071",
        coord_z: "55.80825",
        coord_z_type: 2
      },
      {
        id: 30,
        label: '自动四点焊接机',
        coord: "111.448181,30.496153",
        coord_z: "55.808258",
        coord_z_type: 2
      },
      {
        id: 31,
        label: '龙门刨床',
        coord: "111.449509,30.496998",
        coord_z: "53.375889",
        coord_z_type: 2
      }
    ]


  devicesArray.forEach((item) => {
    // addCustomPOI({
    //   id: 'device_' + item.id,
    //   coord: item.coord,
    //   coord_z: item.coord_z || 0,
    //   coord_z_type: item.coord_z_type || 0,
    //   always_show_label: true,
    //   marker: {
    //     size: "35,78",
    //     images: [
    //       {
    //         "define_state": "state_1",
    //         "normal_url": CONFIG.fileUrl + "/images/poiDefault.png",
    //         "activate_url": CONFIG.fileUrl + "/images/poiActive.png"
    //       }
    //     ]
    //   },
    //   label: {
    //     // bg_image_url: CONFIG.fileUrl + "/images/workshopLabel.png",
    //     // bg_size: (item.width || "55") + ",26",
    //     bg_offset: "30,65",
    //     content: [
    //       {
    //         text: [item.label, "ffffffff", "14"],
    //         text_offset: "3,5",
    //       },
    //     ],
    //   },
    //   window: {
    //     url: CONFIG.fileUrl + "/html/person.html?id=" + item.label + "&time=" + new Date().getTime(),
    //     size: "326,168",
    //     offset: "-163,246"
    //   }
    // })


    // cloudRender.SuperAPI('Add3DText', {
    //   "id": "3dtext" + item.id,
    //   "coord_type": 0,                            //坐标类型(0:经纬度坐标, 1:cad坐标)
    //   "cad_mapkey": "",                           //CAD基准点Key值, 项目中约定
    //   "coord": item.coord,        //坐标 lng,lat
    //   "coord_z": item.coord_z,                              //高度(单位:米)
    //   "coord_z_type": 2,                          //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
    //   "text": item.label,                           //文字内容
    //   "color": "ff00ff",                          //颜色(HEX颜色值)
    //   "size": 0.1,                                 //字体大小(单位:米)
    //   "thickness": 10,                            //厚度(单位:米)
    //   "type": "plain",                            //样式(plain; reflection; metal)
    //   "outline": 1,                               //轮廓(单位:百分比), 取值范围[0~1]
    //   "portrait": false,                          //纵向(true/false)
    //   "space": 0.2,                               //间距(单位:米)
    //   "flash": 5,                                 //闪烁动效(单位:秒)
    //   "bounce": 1,                                //反弹动效(单位:米/秒)
    //   "pitch": 0,                                 //俯仰角(-90~90)
    //   "yaw": 0,                                   //偏航角(0正北, 0~360)
    //   "face_to_camera": true
    // })

    cloudRender.SuperAPI("AddEffect", {
      id: 'devices_' + item.id,
      coord: item.coord,
      coord_z: item.coord_z || 58,
      coord_z_type: item.coord_z_type || 2,
      "cad_mapkey": "",
      "type": "circle_outside",
      "scale": 1,
      "adaptive": false,
      "pitch": 0,
      "roll": 0,
      "yaw": 0,
      "title_text": item.label || '',
      "title_offset": "10,-10",
      "title_face_to_camera": true,
      "title_text_portrait": false
    })

  })
}
const addPerson = () => {
  let personArray =
    [
      {
        id: 0,
        label: '张林动',
        coord: "111.447884,30.49729",
        coord_z: "51.886497",
        coord_z_type: 2
      },
      {
        id: 1,
        label: '李小杰',
        coord: "111.448151,30.497503",
        coord_z: "51.89603",
        coord_z_type: 2
      },
      {
        id: 2,
        label: '沈浪',
      },
      {
        id: 3,
        label: '张杰',
      },
      {
        id: 4,
        label: '刘备',
      },
      {
        id: 5,
        label: '张也',
      },
      {
        id: 6,
        label: '周翊然',
      },
      {
        id: 7,
        label: '李志东',
      },
      {
        id: 8,
        label: '王天大',
      },
      {
        id: 9,
        label: '魏小力',
      },
      {
        id: 10,
        label: '李小萌',
      },
      {
        id: 11,
        label: '刘萌萌',
      },
      {
        id: 12,
        label: '赵东来',
      },
      {
        id: 13,
        label: '祁同伟',
      },
      {
        id: 14,
        label: '薛仁贵',
      },
      {
        id: 15,
        label: '黎明',
      },
      {
        id: 16,
        label: '郭磊',
      }
    ]
  store.dispatch("setPersonArray", personArray);

  personArray.forEach((item) => {
    addCustomPOI({
      id: 'person_' + item.id,
      coord: item.coord,
      coord_z: item.coord_z || 0,
      coord_z_type: item.coord_z_type || 0,
      always_show_label: true,
      marker: {
        size: "62,78",
        images: [
          {
            "define_state": "state_1",
            "normal_url": CONFIG.fileUrl + "/images/工人.png",
            "activate_url": CONFIG.fileUrl + "/images/工人.png"
          }
        ]
      },
      label: {
        // bg_image_url: CONFIG.fileUrl + "/images/workshopLabel.png",
        // bg_size: (item.width || "55") + ",26",
        bg_offset: "30,65",
        content: [
          {
            text: [item.label, "ffffffff", "14"],
            text_offset: "3,5",
          },
        ],
      },
      window: {
        url: CONFIG.fileUrl + "/html/person.html?id=" + item.label + "&time=" + new Date().getTime(),
        size: "326,168",
        offset: "-163,246"
      }

    })
  })
}

const enterGate = (id) => {
  let getePoints = CONFIG.places.find((item) => {
    return item.id == id.split('fire_')[1]
  })
  let jsondata = {
    "coord_type": 0,            //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",           //CAD基准点Key值, 项目中约定
    "coord_z_type": 2,          //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
    "subsidiary_show": false,     //是否显示辅助线(true:显示; false:不显示)
    "points": getePoints.points
  }
  setCameraRoamingPro(jsondata)

}
function setCameraRoamingPro(jsondata) {
  cloudRender.SuperAPI("SetCameraRoamingPro", jsondata)
}



const addCustomPOI = (objJson) => {
  cloudRender.SuperAPI("AddCustomPOI", { ...CONFIG.customJson, ...objJson })

}

const removeCustomPOI = () => {
  let jsondata = {
    covering_type: "all"
  }
  cloudRender.SuperAPI("RemoveAllCovering", jsondata)
}

emitter.on('startGetCoord', () => {
  startGetCoord()
});
emitter.on('cancelGetCoord', () => {
  removeGetCoord(1)
  cloudRender.SuperAPI("EndGetCoord")
});

emitter.on('addCameraEffect', (val) => {
  if (!cameraEffectCoord?.coord) {
    ElMessage({
      type: 'warning',
      message: '您还未放置摄像机点位！'
    })
    return
  }
  addCameraEffect(val)
});
emitter.on('transform', (val) => {
  activeSuperApiGizmo(val)
});
emitter.on('completeTransform', (val) => {
  deactiveSuperApiGizmo()
  getCoveringInfo(val)
});
emitter.on('cancelTransform', (val) => {
  deactiveSuperApiGizmo()
  if (val.coord) {
    resetCameraEffect(val)
  } else {
    removeCameraEffect(val)
  }
});


let cameraEffectCoord = {}
const getCoord = (args) => {
  let coord_result = args.coord_result
  if (coord_result.length > 1) {
    removeGetCoord(coord_result[0].index)
    return
  }
  if (coord_result.length) {
    cameraEffectCoord = coord_result[coord_result.length - 1]
  } else {
    cameraEffectCoord = {}
  }
}

const startGetCoord = () => {
  // removeCameraEffect()
  let jsondata = {
    "coord_type": 0,                //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",               //CAD基准点Key值, 项目中约定
    "coord_z_type": 2,              //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    "coordinate_show": true,        //true:显示; false:隐藏 (显隐坐标信息,默认隐藏)  
    "icon_show": true               //true:显示取点标记; false:隐藏取点标记
  }
  cloudRender.SuperAPI("StartGetCoord", jsondata)
}

const removeGetCoord = (index) => {
  let jsondata = {
    "index": index   //坐标索引
  }
  cloudRender.SuperAPI("RemoveGetCoord", jsondata)
}

const addCameraEffect = (val) => {
  cloudRender.SuperAPI("EndGetCoord")
  let json = {
    ...CONFIG.customJson,
    ...{
      id: 'camera_' + val.id,
      coord: cameraEffectCoord.coord,
      always_show_label: true,
      marker: {
        size: "62,78",
        images: [
          {
            "define_state": "state_1",
            "normal_url": CONFIG.fileUrl + "/images/camera.png",
            "activate_url": CONFIG.fileUrl + "/images/camera.png"
          }
        ]
      },
      label: {},
      window: {
        url: CONFIG.fileUrl + "/html/camera.html?id=" + val.id + "&time=" + new Date().getTime(),
        size: "326,228",
        offset: "30,180"
      }

    }, ...cameraEffectCoord, ...{ id: 'camera_' + val.id, "coord_z_type": 2 }
  }
  cloudRender.SuperAPI("AddCustomPOI", json, (status) => {
    emitter.emit('nextStep');
  })
  // let jsondata = {
  //     "id": "camera_" + val.id,
  //     "coord_type": 0,                     //坐标类型(0:经纬度坐标, 1:cad坐标)
  //     "cad_mapkey": "",                    //CAD基准点Key值, 项目中约定
  //     "type": "3dmark_camera",                    //样式类型(见下表)
  //     "scale": 3,                         //半径(单位:米; "adaptive":true 时含义为倍率)
  //     "adaptive": false,                    //true:自适应大小;false:默认
  //     "coord": cameraEffectCoord.coord,      //坐标点 lng,lat
  //     "coord_z": cameraEffectCoord.coord_z,                        //高度(单位:米)
  //     "coord_z_type": 2,                   //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
  //     "pitch": 0,                         //俯仰角, 参考(-90~90)
  //     "roll": 0,                           //翻滚角, 参考(0~360)
  //     "yaw": 0,                            //偏航角, 参考(0正北, 0~360)
  //     "title_text": "",                //文本内容, 富文本内容
  //     "title_offset": "10,100",            //文本偏移(单位:米; 东西向为x轴进行偏移)
  //     "title_face_to_camera": true,        //顶部文字是否跟踪朝向摄像机(注: true优先, "pitch", "roll", "yaw" 无效)
  //     "title_text_portrait": true          //顶部文字排列方向(true: 纵向, false: 横向)
  // }
  // cloudRender.SuperAPI("AddEffect", jsondata)
  removeGetCoord(1)
}
const removeCameraEffect = (val) => {
  let jsondata = {
    "id": "camera_" + val.id,            //覆盖物id
    "covering_type": "poi"     //覆盖物类型, 详见下表
  }
  cloudRender.SuperAPI("RemoveCovering", jsondata)
}
function resetCameraEffect(val) {
  let jsondata = {
    "id": "camera_" + val.id,
    "coord_type": val.coord_type || 0,                     //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",                    //CAD基准点的Key值, 项目中约定
    "coord": val.coord,     //POI点的坐标 lng,lat
    "coord_z": val.coord_z || 0,                        //高度(单位:米)
    "coord_z_type": val.coord_z_type || 0                    //高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
  }
  cloudRender.SuperAPI("UpdateCustomPOICoord", jsondata)
}

function activeSuperApiGizmo(val) {
  let jsondata = {
    "id": "camera_" + val.id,           //覆盖物id (sectioning: 剖切体, id选填)
    "covering_type": "poi",         //覆盖物类型(poi, viewshed, scene_effect, sectioning, light, aes_object)
    "gizmo_type": "Translation",//Translation:移动; Rotation:旋转; Scale:缩放
    "gizmo_mode": "world"           //坐标系类型（world:世界坐标系; local:物体坐标系）
  }
  cloudRender.SuperAPI("ActiveSuperApiGizmo", jsondata)
}
function deactiveSuperApiGizmo() {
  cloudRender.SuperAPI("DeactiveSuperApiGizmo")
}

function getCoveringInfo(val) {
  let jsondata = {
    "data": [
      {
        "covering_type": "poi",   //覆盖物类型, 详见下表
        "id": [
          "camera_" + val.id
        ]
      },
    ]
  }
  cloudRender.SuperAPI("GetCoveringInfo", jsondata)
}


const addTest = () => {
  let json = { "coord_type": 0, "cad_mapkey": "", "coord_z_type": 2, "coord_z": "56.876431", "id": "camera_9", "coord": "111.448059,30.497194", "always_show_label": true, "show_label_range": "0,2000", "sort_order": false, "animation_type": "bounce", "duration_time": 0.7, "state": "state_1", "marker": { "size": "62,78", "images": [{ "define_state": "state_1", "normal_url": "http://ycstaticfile.zhiwangyilian.com:30381/images/camera.png", "activate_url": "http://ycstaticfile.zhiwangyilian.com:30381/images/camera.png" }] }, "window": { "url": "http://ycstaticfile.zhiwangyilian.com:30381/html/fire.html?id=9", "size": "326,228", "offset": "30,180" }, "index": "1", "adaptive": true }
  cloudRender.SuperAPI("AddCustomPOI", json)
}
function active() {
  let jsondata = {
    "id": "camera_9",            //覆盖物id (sectioning: 剖切体, id选填)
    "covering_type": "poi",         //覆盖物类型(poi, viewshed, scene_effect, sectioning, light, aes_object)
    "gizmo_type": "Translation",//Translation:移动; Rotation:旋转; Scale:缩放
    "gizmo_mode": "world"           //坐标系类型（world:世界坐标系; local:物体坐标系）
  }
  cloudRender.SuperAPI("ActiveSuperApiGizmo", jsondata)
}
function deactive() {
  cloudRender.SuperAPI("DeactiveSuperApiGizmo")
}








// 添加自定义POI点
function AddPOI() {
  let jsondata = {
    "id": "poi_id_0", //POI点的ID
    "label": "Hello World!", //POI提示文本
    "type": "default", //图标的数据类型, 项目中约定
    "coord_type": 0, //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "default", //CAD基准点Key值, 项目中约定
    "coord": "113.287072,23.181194", //POI点的坐标
    "coord_z": 1, //高度(单位:米, cad坐标无效)
    "coord_z_type": 0, //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
    "always_show_label": true, //是否永远显示title, true:显示title(默认), false:不显示title
    "show_label_range": "0,3000", //POI点显示title的范围(单位:米, 范围最小、最大距离; 在此范围内显示, 超出范围隐藏; 注意:always_show_label属性优先于此属性)
    "umg_type": "default", //此POI所使用的UI模板类型(项目中约定, 默认有两种:default为带线的默认POI UI样式, default_noline为不带线的POI UI样式)
    "sort_order": true, //是否自动遮挡排序
    "animation_type": "bounce", //动画类型(bounce:弹出式; stretch:伸缩式; wipe:展开式)
    "duration_time": .7 //规定完成动画所花费的时间(单位:秒)
  }

  cloudRender.SuperAPI("AddPOI", jsondata, (_back) => {
    console.log('添加POI点', _back); //成功、失败回调
  })
}

function AddCustomPOI() {
  let jsondata = {
    "id": "customPOI_id",
    "coord_type": 0,                         //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",                        //CAD基准点的Key值, 项目中约定
    "adaptive": false,                       //true:自适应大小;false:默认
    "coord": "113.287072,23.181194",         //POI点的坐标 lng,lat
    "coord_z": 0,                            //高度(单位:米)
    "coord_z_type": 0,                       //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    "always_show_label": true,               //是否永远显示label, true:显示label(默认), false:不显示label
    "show_label_range": "0,2000",            //POI点显示label的范围(单位:米, 范围最小、最大距离; 在此范围内显示, 超出范围隐藏; 注意:always_show_label属性优先于此属性)
    "sort_order": false,                     //是否开启遮挡排序(根据POI点真实3D位置开启遮挡排序,
    //注: 只与其他开启排序的POI之间进行排序, 开启此排序会消耗性能(最多60个POI点同时开启排序)
    "animation_type": "bounce",              //动画类型(bounce:弹出式; stretch:伸缩式; wipe:展开式)
    "duration_time": 0.7,                    //规定完成动画所花费的时间(单位:秒)
    "state": "state_1",                      //与marker之中images中的define_state对应
    "marker": {
      "size": "100,228",                   //marker大小(宽,高 单位:像素)
      "images": [
        {
          "define_state": "state_1",   //marker图片组
          "normal_url": "http://superapi.51hitech.com/doc-static/images/static/markerNormal.png",        //normal 图片url地址
          "activate_url": "http://superapi.51hitech.com/doc-static/images/static/markerActive.png"       //hover, active 图片url地址
          //本地图片地址一: "file:///D:/xxx/markerNormal.png",    D: 在线席位所在盘符
          //本地图片地址二: "path:/UserData/markerNormal.png",    图片资源由在线席位后台管理, 在线席位4.3.1以上版本
        }
      ]
    },
    // "label":{
    //     "bg_image_url":"http://superapi.51hitech.com/doc-static/images/static/LabelBg.png",      
    //                     //本地图片地址一: "file:///D:/xxx/LabelBg.png",    D: 在线席位所在盘符
    //                     //本地图片地址二: "path:/UserData/LabelBg.png",    图片资源由在线席位后台管理, 在线席位4.3.1以上版本
    //     "bg_size":"100,80", //label大小(宽, 高 单位:像素)
    //     "bg_offset":"50,200", //整个label左上角相对于marker的中心点(coord坐标中心点)的偏移(x,y 单位:像素), 注: x为正向右, y为正向上
    //     "content": [
    //           {
    //               "text":["文本内容A", "ff0000ff", "30"],   //[文本内容, HEXA颜色, 文本大小]
    //               "text_offset":"10,5",     //文本框左上角相对于label中bg_offset左上角的margin偏移(x,y 单位:像素), 注: x为正向右, y为正向下
    //               "text_boxwidth": 80,      //文本框宽度
    //               "text_centered": false,   //文本居中(true:居中; false:不居中)
    //               "scroll_speed": 1         //文本滚动速度(0:不滚动; 注: "text_centered":true优先)
    //           },
    //           {
    //               "text":["文本内容B", "00ff00ff", "20"],
    //               "text_offset":"10,45",
    //               "text_boxwidth": 80,
    //               "text_centered": true,
    //               "scroll_speed": 0
    //           }
    //      ]
    // },
    "window": {
      "url": "http://superapi.51hitech.com/doc-static/images/static/video.html",
      // "url": "http://127.0.0.1:5500/video.html",
      //本地地址一: "file:///D:/xxx/echarts.html",    D: 在线席位所在盘符
      "size": "520,350",      //window大小(宽,高 单位:像素)
      "offset": "50,180"      //window左上角相对于marker的中心点(coord坐标中心点)的偏移(x,y 单位:像素), 注: x为正向右, y为正向上
    }
  }
  cloudRender.SuperAPI("AddCustomPOI", jsondata, (status) => {
    // console.log(status); //成功、失败回调
  })

}
function AddPOIByWindow() {
  let jsondata = {
    "id": "id_window",
    "coord_type": 0,                         //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",                        //CAD基准点的Key值, 项目中约定
    "coord": "113.287072,23.181194",         //POI点的坐标 lng,lat
    "coord_z": 0,                            //高度(单位:米)
    "coord_z_type": 0,                       //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    "window": {
      "url": "https://superapi.51aes.com/apifunc?timestamp=1900524264000",
      "size": "500,500",     //window大小(宽,高 单位:像素)
      "offset": "0,0"         //window左上角相对于coord坐标中心的偏移(x,y 单位:像素), 注:x为正向右, y为正向上
    }
  }
  cloudRender.SuperAPI("AddPOIByWindow", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
}

//数据驱动
function DataDriveObjectToMove() {
  let jsondata = {
    "data": [
      {
        "object": [   //当object中包含多个对象时, 他们拥有相同的坐标（经纬高）, 但姿态只对aes_object生效, 目前只支持自定义poi、scene_effect、aes_objct三种类型
          // {
          //     "id": ['5e4982f0-5456-11ed-a559-65fff4692f0f'],
          //     "type": "aes_object"
          // },
          {
            "id": ["56678960-5456-11ed-a559-65fff4692f0f"],
            "type": "scene_effect"
          },
          {
            "id": ["poi_id_0",],
            "type": "poi"
          }
        ],
        "coord": "113.286598,23.182587", //目的地的坐标, 对象们从他们当前位置向目的地移动(lng,lat)
        "coord_type": 0, //坐标类型(0:经纬度坐标, 1:cad坐标)
        "cad_mapkey": "default", //CAD基准点Key值, 通过“注册CAD锚点”API创建；coord_type为0时可为空
        "coord_z": 5, //高度(单位:米, cad坐标无效)
        "coord_z_type": 0, //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
        "periodic": 5, //周期, 当前状态到该状态所需时间
        "pitch": 30, //俯仰角,姿态数据只对aes_object生效, 当aes_object到达目的地后, 在一个短暂时间内, 旋转到目标姿态
        "yaw": 30, //偏航角
        "default_yaw": false,  //true：根据运动方向自动计算各姿态角的0度方向；false：以固定yaw值运动
        "roll": 30 //滚动角
      }
    ]
  }
  cloudRender.SuperAPI("DataDriveObjectToMove", jsondata, (e) => {
    console.log(e);
  })
}
function StopDataDriveObjectToMove() {
  let jsondata = {
    "object": [   //当object中包含多个对象时, 同时结束他们的运动
      {
        "id": ["56678960-5456-11ed-a559-65fff4692f0f"],
        "type": "scene_effect"
      },
      // {
      //     "id": ["poi_id_0",],
      //     "type": "poi"
      // }
    ]
  }

  cloudRender.SuperAPI("StopDataDriveObjectToMove", jsondata, (e) => {
    console.log(e);
  })
}

//楼宇拆解
function SplitBuild() {
  let jsondata = {
    "build_id": "Build_01",           //建筑物id (项目中约定)
    "floor": 1,                       //要拆解的楼层(1楼为1,地下一楼为-1)
    "animation_type": 1               //动画类型 (1:伸缩杆动画)
  }
  cloudRender.SuperAPI("SplitBuild", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
}

// 设置场景镜头
function SetCameraInfo() {
  let jsonData = {
    "ord_type": "0",
    "cad_mapkey": "",
    "center_coord": "113.287072,23.181194",
    "coord_z": "6.16",
    "arm_distance": "106.207596",
    "arm_distance_max": "10000.0",
    "arm_distance_min": "1.0",
    "pitch": "21.5",
    "pitch_max": "89.989998",
    "pitch_min": "8.0",
    "yaw": "49.0",
    "left_top_coord": "113.288002,23.183001",
    "right_top_coord": "113.288002,23.183001",
    "left_bottom_coord": "113.286285,23.181168",
    "right_bottom_coord": "113.286858,23.180502",
    "near_clip": "1.0",
    // fly: false,
  };

  cloudRender.SuperAPI('SetCameraInfo', jsonData, (_back) => {
    console.log('设置场景镜头', _back); //成功、失败回调
  })
}

function GetCameraInfo() {
  let jsondata = {};
  cloudRender.SuperAPI("GetCameraInfo", jsondata, (e) => {
    let cameraData = JSON.parse(e);
    console.log('cameraData', cameraData);
    copyStr(JSON.stringify(cameraData.args));
    proxy.$msg.success('复制镜头参数成功');
  })
}

// 关闭场景
function StopRenderCloud() {
  cloudRender.SuperAPI("StopRenderCloud");
  proxy.$msg.success('关闭场景');
}

//测量工具
function StartMeasureTool() {
  let jsondata = {
    "coord_type": 0,          //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": ""          //CAD基准点Key值, 项目中约定
  }
  cloudRender.SuperAPI("StartMeasureTool", jsondata, (e) => {
    console.log(e);
  })
}

//天气
function SetEnvWeather(weather) {
  cloudRender.SuperAPI("SetEnvWeather", {
    "env_weather": weather
  }, (status) => {
    console.log(status); //成功、失败回调
  })
}

function getId() {
  cloudRender.SuperAPI("GetFullSceenCoveringId", {
    "covering_type": "all"   //覆盖物类型, 详见下表
  }, (_back) => {
    console.log(_back)
  })
  return
  let jsondata = {
    "state": true,         //true:开启获取EID; false:关闭获取EID
    "highlight": true,      //true:点击实体高亮; false:点击实体不高亮
    // "act_layers": ["building", "road"] //可被选中元素所在图层，删除该字段，全部元素可被选中
  }
  cloudRender.SuperAPI("StartGetEID", jsondata, (e) => {
    console.log(e);
  })
}
//激活编辑
function ActiveSuperApiGizmo() {
  let jsondata = {
    "id": "56678960-5456-11ed-a559-65fff4692f0f",           //覆盖物id (sectioning: 剖切体, id选填)
    "covering_type": "scene_effect",         //覆盖物类型(poi, viewshed, scene_effect, sectioning, light, aes_object)
    "gizmo_type": "Translation",    //Translation:移动; Rotation:旋转; Scale:缩放
    "gizmo_mode": "world"           //坐标系类型（world:世界坐标系; local:物体坐标系）
  }
  // cloudRender.SuperAPI('ActiveSuperApiGizmo', jsondata).then((_back) => {
  //     console.log(_back)
  // })
  cloudRender.SuperAPI("ActiveSuperApiGizmo", jsondata, (e) => {
    console.log(e);
  })
}
function DeactiveSuperApiGizmo() {
  cloudRender.SuperAPI("DeactiveSuperApiGizmo", (status) => {
    console.log(status); //成功、失败回调
  })
}


function AddRange() {
  let jsondata = {
    "id": "range_id",
    "coord_type": 0,                  //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",                 //CAD基准点Key值, 项目中约定
    "coord_z": 0,                     //高度(单位:米)
    "coord_z_type": 0,                //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    "type": "block",                   //样式类型; 注①
    "color": "ff00004c",              //轮廓颜色(HEXA颜色值)
    "range_height": 10,               //围栏高度(单位:米)
    "stroke_weight": 10,              //底部轮廓线宽度(单位:米; 注: 区域中含有内环"inner_points"时无效)
    "fill_area": "none",              //底部区域填充类型; 注②
    "points": [
      {
        "coord": "113.320381,23.108027"     //坐标点 lng,lat; 注:相邻点坐标不能重复
      },
      {
        "coord": "113.320122,23.104624"
      },
      {
        "coord": "113.322266,23.104511"
      }
    ]
  }
  cloudRender.SuperAPI("AddRange", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
}

//汽车漫游
function AddPath() {
  //添加路径
  let path1Json = {
    "id": "path1",
    "advancedSetting": {
      "smoothnessOfCorners": "extremelyHigh"  //设置路径边角的平滑度(extremelyHigh:极高; high:高; middle:中; low:低;)
    },
    "coord_type": 0,                    //坐标类型(0:经纬度坐标, 1:cad坐标)
    "coord_z_type": 0,                  //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    "cad_mapkey": "",                   //CAD基准点Key值, 项目中约定
    "type": "arrow",                    //样式类型; 注①
    "color": "00ffff",                  //颜色(HEX颜色值, 空值即透明; railway类型无效, 默认黑白色)
    "pass_color": "ffff00",             //覆盖物移动经过路径颜色(HEX颜色值)
    "width": 5,                        //宽度(单位:米, 圆柱直径或方柱边长；当类型为“adaptive_solid”，含义为倍率)
    "speedRate": 1,                      //流动特效的移动倍率,仅针对部分类型有效（arrow,arrow_dot,arrow_dashed,brimless_arrow,scan_line,scan_line_solid）
    "points": [
      {
        "coord": "113.29245,23.180981",   //路径坐标点 lng,lat
        "coord_z": 0               //高度(单位:米)
      },
      {
        "coord": "113.292038,23.180992",
        "coord_z": 0
      },
      {
        "coord": "113.291061,23.181",
        "coord_z": 0
      }
    ]
  }
  let path2Json = {
    "id": "path2",
    "advancedSetting": {
      "smoothnessOfCorners": "extremelyHigh"  //设置路径边角的平滑度(extremelyHigh:极高; high:高; middle:中; low:低;)
    },
    "coord_type": 0,                    //坐标类型(0:经纬度坐标, 1:cad坐标)
    "coord_z_type": 0,                  //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    "cad_mapkey": "",                   //CAD基准点Key值, 项目中约定
    "type": "none",                    //样式类型; 注①
    "color": "00ffff",                  //颜色(HEX颜色值, 空值即透明; railway类型无效, 默认黑白色)
    "pass_color": "ffff00",             //覆盖物移动经过路径颜色(HEX颜色值)
    "width": 5,                        //宽度(单位:米, 圆柱直径或方柱边长；当类型为“adaptive_solid”，含义为倍率)
    "speedRate": 1,                      //流动特效的移动倍率,仅针对部分类型有效（arrow,arrow_dot,arrow_dashed,brimless_arrow,scan_line,scan_line_solid）
    "points": [
      {
        "coord": "113.29245,23.180981",   //路径坐标点 lng,lat
        "coord_z": 0               //高度(单位:米)
      },
      {
        "coord": "113.292038,23.180992",
        "coord_z": 0
      },
      {
        "coord": "113.291061,23.181",
        "coord_z": 0
      }
    ]
  }

  //添加覆盖物
  let carJson = {
    "id": "car1",
    "coord_type": 0,                     //坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",                    //CAD基准点Key值, 项目中约定
    "type": "vehicle_car_black",         //样式类型(见下表)
    "scale": 1,                         //半径(单位:米; "adaptive":true 时含义为倍率)
    "adaptive": true,                    //true:自适应大小;false:默认
    "coord": "113.29245,23.180981",      //坐标点 lng,lat
    "coord_z": 0,                        //高度(单位:米)
    "coord_z_type": 0,                   //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    "pitch": 0,                         //俯仰角, 参考(-90~90)
    "roll": 0,                           //翻滚角, 参考(0~360)
    "yaw": 270,                            //偏航角, 参考(0正北, 0~360)
    // "title_text": "巡逻车A",                   //文本内容, 富文本内容
    "title_offset": "10,100",            //文本偏移(单位:米; 东西向为x轴进行偏移)
    "title_face_to_camera": true,        //顶部文字是否跟踪朝向摄像机(注: true优先, "pitch", "roll", "yaw" 无效)
    "title_text_portrait": true          //顶部文字排列方向(true: 纵向, false: 横向)
  }

  //定位
  let locationJson = {
    "id": "car1",             //覆盖物id
    "covering_type": "scene_effect",     //覆盖物类型, 详见下表
    "distance": 50            //距离(单位:米), 默认20米
  }

  //覆盖物移动
  let carMoveJson = {
    "attach_id": "car1",            //要移动的覆盖物id
    "attach_type": "scene_effect",  //要移动的覆盖物类型 见下表
    "be_attach_id": "path1",      //依附的覆盖物id
    "be_attach_type": "path",       //依附的覆盖物类型 见下表
    "speed": 5,                     //移动速度 (单位:米/秒)
    "loop": false,                   //是否循环
    "reverse": false,               //是否反向移动
    "current_attitude": true,       //元素姿态(true: 前一帧的姿态; 注: true优先, "pitch", "yaw", "roll" 无效)
    "pitch": 0,                    //俯仰角, 参考值(-90~90)
    "yaw": 270,                       //偏航角, 参考值(0~360)
    "roll": 0                       //翻滚角, 参考值(0~360)
  }
  //添加镜头
  let camera1Json = {
    "camera_id": "camera1",
    "coord_type": "0",                          //位置的坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",                           //CAD基准点Key值, 项目中约定
    "coord": "113.29245,23.180981",        //相机位置坐标 lng, lat
    "coord_z": 50,                              //高度(单位:米)
    "coord_z_type": 0,                          //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    //若需要根据“获取镜头信息”API回调信息中的高度参数设置相同位姿的镜头，此处需要选择“2”
    // "pitch": 0,                                //镜头俯仰角(-90~90)
    // "pitch_limit": "0,90",                      //镜头俯仰角范围(-90~90)
    // "yaw": 0,                                   //镜头偏航角(0正北, 0~359)
    // "yaw_limit": "0,359",                       //镜头偏航角范围(0正北, 0~359)
    // "arm_distance": 1,                        //镜头距坐标点距离(单位:米)
    // "arm_distance_limit": "50,10000"            //镜头距坐标点距离范围(单位:米)
  }
  let camera2Json = {
    "camera_id": "camera2",
    "coord_type": "0",                          //位置的坐标类型(0:经纬度坐标, 1:cad坐标)
    "cad_mapkey": "",                           //CAD基准点Key值, 项目中约定
    "coord": "113.29245,23.180981",        //相机位置坐标 lng, lat
    "coord_z": 50,                              //高度(单位:米)
    "coord_z_type": 0,                          //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
    //若需要根据“获取镜头信息”API回调信息中的高度参数设置相同位姿的镜头，此处需要选择“2”
    // "pitch": 0,                                //镜头俯仰角(-90~90)
    // "pitch_limit": "0,90",                      //镜头俯仰角范围(-90~90)
    // "yaw": 0,                                   //镜头偏航角(0正北, 0~359)
    // "yaw_limit": "0,359",                       //镜头偏航角范围(0正北, 0~359)
    // "arm_distance": 1,                        //镜头距坐标点距离(单位:米)
    // "arm_distance_limit": "50,10000"            //镜头距坐标点距离范围(单位:米)
  }
  //跟随镜头
  let cameraToMoveJson1 = {
    "camera_id": "camera1",         //镜头id(由AddCamera添加),可删除该字段，删除该字段则由默认镜头沿覆盖物移动，不必添加镜头
    "be_attach_id": "path1",      //依附的覆盖物id 见下表
    "be_attach_type": "path",       //依附的覆盖物类型 见下表
    "speed": 5,                   //移动速度 (单位:米/秒)
    "loop": false,                   //是否循环
    "reverse": false,               //是否反向移动
    "arm_distance": 10,           //镜头距覆盖物距离(单位:米)
    "pitch": 20                    //镜头俯仰角(0~89)
  }
  let cameraToMoveJson2 = {
    "camera_id": "camera2",         //镜头id(由AddCamera添加),可删除该字段，删除该字段则由默认镜头沿覆盖物移动，不必添加镜头
    "be_attach_id": "path2",      //依附的覆盖物id 见下表
    "be_attach_type": "path",       //依附的覆盖物类型 见下表
    "speed": 5,                   //移动速度 (单位:米/秒)
    "loop": false,                   //是否循环
    "reverse": false,               //是否反向移动
    "arm_distance": 11,           //镜头距覆盖物距离(单位:米)
    "pitch": 10                   //镜头俯仰角(0~89)
  }

  // cloudRender.SuperAPI("FocusCovering", locationJson, (status) => {
  //     console.log(status); //成功、失败回调
  // })
  cloudRender.SuperAPI('RemoveAllCovering', { "covering_type": "scene_effect" });
  cloudRender.SuperAPI('RemoveAllCovering', { "covering_type": "path" });
  cloudRender.SuperAPI('RemoveAllCovering', { "covering_type": "scene_camera" });

  cloudRender.SuperAPI("AddPath", path2Json)
  cloudRender.SuperAPI("AddPath", path1Json, (status) => {
    console.log(status); //成功、失败回调
    let obj = JSON.parse(status)
    if (obj.success) {
      cloudRender.SuperAPI("AddCamera", camera1Json, (e) => {
        console.log(e);
      })
      cloudRender.SuperAPI("AddCamera", camera2Json, (e) => {
        console.log(e);
      })
      cloudRender.SuperAPI("AddEffect", carJson, (status) => {
        console.log(status); //成功、失败回调
      })
      cloudRender.SuperAPI("SetCameraToMove", cameraToMoveJson2, (status) => {
        console.log(status); //成功、失败回调
      })
      cloudRender.SuperAPI("SetCameraActive", {
        "camera_id": "camera1",
        "fly": false  //true: 飞行动画; false: 立刻跳转过去(瞬移)
      }, (e) => {
        console.log(e);
      })
      setTimeout(() => {
        cloudRender.SuperAPI("CoverToMove", carMoveJson, (status) => {
          console.log(status); //成功、失败回调
        })

        cloudRender.SuperAPI("SetCameraToMove", cameraToMoveJson1, (status) => {
          console.log(status); //成功、失败回调
        })

      }, 2e3);

    }
  })

}
function changeCamera(val) {
  if (val == '1') {
    cloudRender.SuperAPI("SetCameraActive", {
      "camera_id": "camera2",
      "fly": false  //true: 飞行动画; false: 立刻跳转过去(瞬移)
    }, (e) => {
      console.log(e);
    })
  } else if (val == '3') {
    cloudRender.SuperAPI("SetCameraActive", {
      "camera_id": "camera1",
      "fly": false  //true: 飞行动画; false: 立刻跳转过去(瞬移)
    }, (e) => {
      console.log(e);
    })
  }



}

//键盘漫游
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

function startGetEID() {
  let jsondata = {
    "state": true,         //true:开启获取EID; false:关闭获取EID
    "highlight": true,      //true:点击实体高亮; false:点击实体不高亮
    // "act_layers": ["building", "road"] //可被选中元素所在图层，删除该字段，全部元素可被选中
  }
  cloudRender.SuperAPI("StartGetEID", jsondata, (e) => {
    console.log(e);
  })
}
function focusAESObject() {
  let jsondata = {
    "eid": ["-223452005895503872"],
    "distance": 1000       //距离(单位:米; 多个EID自动计算)
  }
  cloudRender.SuperAPI("FocusAESObject", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
}
function setAESObjectAnimationPlayState() {
  let jsondata = {
    "eid": "-3747838483533045475",
    "state": "pause"
    //pause:暂停播放; continue:从暂停处继续播放，播放设置沿用暂停前的设置;
    //stop，中止播放，模型重置回初始状态，continue此时无效
  }
  cloudRender.SuperAPI("SetAESObjectAnimationPlayState", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
}






</script>


<style lang="scss" scoped>
@import './WDPMap.scss';
</style>