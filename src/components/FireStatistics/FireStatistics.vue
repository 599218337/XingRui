<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-18 14:12:00
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="fireStatistics"
    :style="{ transform: `translateX(${showContent ? 374 : 0}px)`, transition: 'transform 1s' }">
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
    <div id="fireBtn" @click="showContentFuc"
      :style="{ background: showContent ? 'url(/image/shouqi.png)' : 'url(/image/zhankai.png)', backgroundSize: '100% 100%' }">
    </div>

    <teleport to="body">
      <transition name="twin-fade">
        <div v-if="dialogVisible" class="twin-modal-overlay" @click="dialogVisible = false">
          <div class="twin-modal-box" @click.stop>
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
            
            <div class="twin-header">
              <div class="title">
                <span class="cn">设备数据</span>
                <span class="en">DEVICE DATA</span>
              </div>
              <div class="close-btn" @click="dialogVisible = false"></div>
            </div>
            
            <div class="twin-body">
              <div class="info-item">
                <div class="label">设备名称 <span class="sub">/ NAME</span></div>
                <div class="value cyber-text">{{ currentDevice.name || '--' }}</div>
              </div>
              <div class="info-item">
                <div class="label">当前数值 <span class="sub">/ VALUE</span></div>
                <div class="value highlight-text">{{ currentValue !== null && currentValue !== undefined ? currentValue : '--' }}</div>
              </div>
            </div>
            
            <div class="twin-footer">
              <div class="cyber-btn" @click="dialogVisible = false">
                <span>确 定</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';
import { devicePVList } from './devicesPVList';
import { fetchDeviceData } from './start';

const dialogVisible = ref(false)
const currentDevice = ref({})
const currentValue = ref('')

onMounted(() => {
})
const showContent = ref(false)
onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 100) // slight delay to allow DOM to render first, then apply transition
})
const showContentFuc = () => {
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
    currentDevice.value = val
    currentValue.value = value
    dialogVisible.value = true
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

/* Digital Twin Modal Styles */
.twin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 5, 16, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.twin-fade-enter-active,
.twin-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.twin-fade-enter-from,
.twin-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.twin-modal-box {
  position: relative;
  width: 440px;
  background: linear-gradient(135deg, rgba(8, 25, 43, 0.9) 0%, rgba(13, 35, 60, 0.95) 100%);
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.15), 0 15px 35px rgba(0, 0, 0, 0.6);
  padding: 24px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  }

  .corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2px solid #00ffff;
    
    &.top-left { top: -1px; left: -1px; border-right: none; border-bottom: none; }
    &.top-right { top: -1px; right: -1px; border-left: none; border-bottom: none; }
    &.bottom-left { bottom: -1px; left: -1px; border-right: none; border-top: none; }
    &.bottom-right { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  }

  .twin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    padding-bottom: 12px;

    .title {
      display: flex;
      flex-direction: column;
      
      .cn {
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
        letter-spacing: 2px;
      }
      .en {
        font-size: 10px;
        color: rgba(0, 255, 255, 0.6);
        margin-top: 2px;
        letter-spacing: 1px;
      }
    }

    .close-btn {
      width: 24px;
      height: 24px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
      
      &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 10%;
        width: 80%;
        height: 2px;
        background: currentColor;
        color: rgba(0, 255, 255, 0.7);
      }
      &::before { transform: translateY(-50%) rotate(45deg); }
      &::after { transform: translateY(-50%) rotate(-45deg); }
      
      &:hover {
        transform: rotate(90deg);
        &::before, &::after { color: #fff; box-shadow: 0 0 8px #00ffff; }
      }
    }
  }

  .twin-body {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .info-item {
      background: rgba(0, 255, 255, 0.04);
      border: 1px solid rgba(0, 255, 255, 0.15);
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 20%;
        bottom: 20%;
        width: 3px;
        background: #00ffff;
        box-shadow: 0 0 6px #00ffff;
      }

      .label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: baseline;
        gap: 6px;

        .sub {
          font-size: 10px;
          color: rgba(0, 255, 255, 0.4);
        }
      }

      .value {
        font-size: 18px;
        color: #fff;
        padding-left: 8px;
        word-break: break-all;

        &.highlight-text {
          color: #00ffff;
          font-weight: bold;
          font-size: 24px;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          font-family: 'Courier New', Courier, monospace;
        }
      }
    }
  }

  .twin-footer {
    margin-top: 28px;
    display: flex;
    justify-content: flex-end;

    .cyber-btn {
      position: relative;
      padding: 8px 36px;
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid #00ffff;
      color: #00ffff;
      font-size: 14px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s;

      span {
        position: relative;
        z-index: 2;
        letter-spacing: 2px;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
        transform: translateX(-100%);
        transition: transform 0.4s;
      }

      &:hover {
        background: rgba(0, 255, 255, 0.15);
        box-shadow: 0 0 12px rgba(0, 255, 255, 0.4) inset;
        
        &::before {
          transform: translateX(100%);
        }
      }
    }
  }
}
</style>