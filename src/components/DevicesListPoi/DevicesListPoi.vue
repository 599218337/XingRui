<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 17:38:24
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cameraStatistics">
    <div class="widget">
      <div class="header">
        <span>设备统计</span>
      </div>
      <div class="content">
        <div class="contentItem" v-for="(item, index) in Array.from(store.state.devicesMap.values())"
          @click="location(item)">
          <div class="Item">
            <div class="point" :style="{ background: item.state ? '#00FF7A' : '#FF1010' }"></div>
            <div class="text">{{ item.Name }}</div>
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
import { ref, watch, onMounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();

import emitter from '@/utils/bus'

onMounted(() => {
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
  cloudRender.SuperAPI("FocusCovering", jsondata, (status) => {
    console.log(status); //成功、失败回调
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

const addPerson = () => {


  store.state.devicesMap.forEach((item) => {
    addCustomPOI({
      id: 'devices_' + item.ClientId,
      coord: item.location,
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
      label: {},
      window: {
        url: CONFIG.fileUrl + "/html/person.html?id=" + item.label + "&time=" + new Date().getTime(),
        size: "326,168",
        offset: "-163,246"
      }

    })
  })
}


const addCustomPOI = (objJson) => {
  cloudRender.SuperAPI("AddCustomPOI", { ...CONFIG.customJson, ...objJson })

}

const removeCustomPOI = () => {
  let jsondata = {
    covering_type: "all"
  }
  cloudRender.SuperAPI("RemoveAllCovering", jsondata, (status) => {
    // console.log(status); //成功、失败回调
  })
}
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