<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-18 14:12:00
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="fireStatistics">
    <div class="widget">
      <div class="header">
        <span>设备列表</span>
      </div>
      <div class="content">
        <template v-for="item in devicePVList" :key="item.id">
          <div class="contentItem">
            <div class="Item" :title="item.name">
              <div class="point" style="background: #00FF7A"></div>
              <div class="text">{{ item.name }}</div>
            </div>
            <div class="icon">
              <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                <div class="view" @click.stop="queryDeviceData(item)"></div>
              </el-tooltip>
            </div>
          </div>
        </template>

      </div>
      <div class="line"></div>

    </div>
    <div id="fireBtn" @click="showContentFuc"> </div>


  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage, ElMessageBox } from 'element-plus';
import { devicePVList } from './devicesPVList';
import { fetchDeviceData } from './start';

onMounted(() => {
})
const showContent = ref(false)
const showContentFuc = () => {
  let p = showContent.value ? 0 : 374
  let t = showContent.value ? 0.5 : 0.5
  let b = showContent.value ? 'url("/image/zhankai.png")' : 'url("/image/shouqi.png")'
  document.getElementsByClassName('fireStatistics')[0].style.transform = `translateX(${p}px)`
  document.getElementsByClassName('fireStatistics')[0].style.transition = `transform ${t}s`
  document.getElementById('fireBtn').style.background = b
  document.getElementById('fireBtn').style.backgroundSize = '100% 100%'
  showContent.value = !showContent.value
}

const queryDeviceData = async (val) => {
  if (!val.id) {
    ElMessage({
      type: 'warning',
      message: `${val.name}数据缺失！`
    })
    return
  }

  try {
    const value = await fetchDeviceData(val.id)
    ElMessageBox.alert(
      `<strong>设备名称：</strong>${val.name}<br/><strong>当前值：</strong>${value}`,
      '设备数据',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定'
      }
    )
  } catch (err) {
    ElMessage({
      type: 'error',
      message: err.message || '获取数据失败'
    })
  }
}
</script>

<style lang="scss" scoped>
@import url('./FireStatistics.scss');
</style>

<style lang="scss">
.iconTooltip {
  background-color: rgba(39, 53, 70, 1) !important;
  border: 1px solid rgba(12, 137, 234, 0.40) !important;
  border-radius: 2px !important;
}
</style>