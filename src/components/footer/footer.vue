<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-11 10:39:44
 * @FilePath: \screen-web\src\components\footer\footer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="footer_wrapper">
    <div class="btnContent">
      <div class="btn" v-for="item in btnArray" @click="changeBtn(item.id)">
        <div :class="active == item.id ? 'text_active' : 'text'">{{ item.label }}</div>
        <div :class="active == item.id ? 'img_active' : 'img'"></div>
      </div>

    </div>

  </div>
</template>

<script setup>
// import router from '@router';
import { ref, watch, nextTick } from 'vue'
import { useStore } from "vuex";
import { ElMessage } from 'element-plus'
import emitter from '@/utils/bus'
// userStore可以拿到vuex仓库实例
const store = useStore();
const active = ref(null);

const btnArray = ref([
  {
    id: 0,
    label: '展开图表',
  },
  {
    id: 1,
    label: '视频监控',
  },
  {
    id: 2,
    label: '告警信息',
  },
  {
    id: 5,
    label: '气体报警',
  },
  {
    id: 3,
    label: '人员定位',
  },
  {
    id: 4,
    label: '设备信息',
  },

])

// nextTick(() => {
//     active.value = store.state.activeNav;
// })

let isSameIndex = true
const changeBtn = (id) => {
  if (id !== 4 && active.value == id && isSameIndex) {
    isSameIndex = false
    active.value = null
    // removeCustomPOI()
    store.state.showCamera && store.dispatch("setShowCamera", false);
    store.state.showFire && store.dispatch("setShowFire", false);
    store.state.showPerson && store.dispatch("setShowPerson", false);
    if (btnArray.value[0].label == '收起图表') {
      btnArray.value[0].label = '展开图表'
      store.dispatch("setShowAside", false);
    }
    return
  }
  active.value = id
  isSameIndex = true
  switch (id) {
    case 0:
      store.state.showCamera && store.dispatch("setShowCamera", false);
      store.state.showFire && store.dispatch("setShowFire", false);
      store.state.showPerson && store.dispatch("setShowPerson", false);
      store.state.showDevices && store.dispatch("setShowDevices", false);
      if (btnArray.value[0].label == '收起图表') {
        btnArray.value[0].label = '展开图表'
        store.dispatch("setShowAside", false);

      } else {
        btnArray.value[0].label = '收起图表'
        store.dispatch("setShowAside", true);
      }
      break;
    case 1:
      if (btnArray.value[0].label == '收起图表') {
        btnArray.value[0].label = '展开图表'
        store.dispatch("setShowAside", false);
      }
      store.state.showPerson && store.dispatch("setShowPerson", false);
      store.state.showFire && store.dispatch("setShowFire", false);
      store.state.showDevices && store.dispatch("setShowDevices", false);
      !store.state.showCamera && store.dispatch("setShowCamera", true);
      break;
    case 2:
      if (btnArray.value[0].label == '收起图表') {
        btnArray.value[0].label = '展开图表'
        store.dispatch("setShowAside", false);
      }
      store.state.showCamera && store.dispatch("setShowCamera", false);
      store.state.showPerson && store.dispatch("setShowPerson", false);
      store.state.showDevices && store.dispatch("setShowDevices", false);
      !store.state.showFire && store.dispatch("setShowFire", true);
      break;
    case 3:
      if (btnArray.value[0].label == '收起图表') {
        btnArray.value[0].label = '展开图表'
        store.dispatch("setShowAside", false);
      }
      store.state.showCamera && store.dispatch("setShowCamera", false);
      store.state.showFire && store.dispatch("setShowFire", false);
      store.state.showDevices && store.dispatch("setShowDevices", false);
      !store.state.showPerson && store.dispatch("setShowPerson", true);
      break;
    // case 4:
    //   const href = router.resolve({
    //     name: '云上展厅',
    //     path: '/cloud?id=2b7e3206',
    //     query: { id: '2b7e3206' }
    //   })
    //   window.open(href.href, '_blank')
    //   break;
    case 5:
      if (btnArray.value[0].label == '收起图表') {
        btnArray.value[0].label = '展开图表'
        store.dispatch("setShowAside", false);
      }
      store.state.showPerson && store.dispatch("setShowPerson", false);
      store.state.showCamera && store.dispatch("setShowCamera", false);
      store.state.showFire && store.dispatch("setShowFire", false);
      !store.state.showDevices && store.dispatch("setShowDevices", true);
      break;
    case 6:
      if (btnArray.value[0].label == '收起图表') {
        btnArray.value[0].label = '展开图表'
        store.dispatch("setShowAside", false);
      }
      store.state.showPerson && store.dispatch("setShowPerson", false);
      store.state.showCamera && store.dispatch("setShowCamera", false);
      store.state.showFire && store.dispatch("setShowFire", false);
      store.state.showDevices && store.dispatch("setShowDevices", false);
      break;
    default:
      ElMessage({
        message: '功能开发中，敬请期待......',
        type: 'warning',
      })
      break;
  }
  emitter.emit('activeNav', active.value);
  // store.dispatch("setActiveNavAction", active.value);

}

const removeCustomPOI = () => {
  let jsondata = {
    covering_type: "all"
  }
  cloudRender.SuperAPI("RemoveAllCovering", jsondata)
}
</script>

<style lang="scss" scoped>
@import url('./footer.scss');
</style>