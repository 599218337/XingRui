<template>
    <div class="scene-mapControl">
        <!-- 放大缩小地图 -->
        <div class="changeZoom">
            <div class="btns plus" @click.stop="setZoom('plus')"></div>
            <div class="btns reduce" @click.stop="setZoom('reduce')"></div>
        </div>
        <!-- 定位 -->
        <div class="custrom_position" @click.stop="setCenter">
            <i class="position-icon"></i>
        </div>
        <!-- 回到当前位置 -->
        <!-- <div class="viewType" @click.stop="viewTypeFun">
            <i class="pitch-type" :class="{ 'no-pitch': viewTypeTxt == '2D', 'yes-pitch': viewTypeTxt == '3D' }"></i>
        </div> -->
    </div>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex"; //导入mapState方法，同时导入其他方法的，方便等下使用
const store = useStore();
const emit = defineEmits(['mapInitFun', 'setMapTo2D3DFun']);
const props = defineProps(['pageType']);

watch(() => store.state.mapLoaded, (newValue, oldValue) => {
    // 添加鹰眼
    // addOverViewFun();
    // 添加指南针组件
    addControlBarToolFun();
    // 添加比例尺
    // addScaleFun();
    // 添加缩放控件
    // addToolBarFun();
});
let OverViewTool;
// 添加鹰眼控件
function addOverViewFun() {
    OverViewTool && window.mapObj.removeControl(OverViewTool);
    OverViewTool = new LKMap.OverView({
        position: 'bottom-right',   // 添加位置
        liteStyle: true,
        width: 130,
        height: 130,
    });
    window.mapObj.addControl(OverViewTool);
    window.OverViewTool = OverViewTool;
    console.log('OverViewTool=', OverViewTool);
}

/**
 * 23D切换
 */
const viewTypeTxt = ref('3D');
function viewTypeFun() {
    if (viewTypeTxt.value == '2D') {
        viewTypeTxt.value = '3D';
        window.mapObj.flyTo({
            pitch: 70,
            maxDuration: 2000
        });
    } else {
        viewTypeTxt.value = '2D';
        window.mapObj.flyTo({
            pitch: 0,
            maxDuration: 2000
        });
    }
    emit('setMapTo2D3DFun', viewTypeTxt.value);
}

/**
 * 定位按钮回到主视野
 */

// 回到当前位置
function setCenter() {
    emit('mapInitFun')
    
}

// 修改地图缩放
function setZoom(str) {
    let mapZoom = window.mapObj.getZoom();
    let minZoom = window.mapObj.getMinZoom();
    (str == 'plus') ? (mapZoom++) : (mapZoom--);
    if (mapZoom < minZoom) mapZoom = minZoom;
    window.mapObj.flyTo({
        zoom: mapZoom,
        maxDuration: 2000
    });
}
// 添加指南针组件
let ControlBar;
function addControlBarToolFun() {
    ControlBar && window.mapObj.removeControl(ControlBar);
    ControlBar = new LKMap.ControlBar({
        position: 'bottom-right',
        showCompass: true,
    });
    ControlBar._container.classList.add('user_custom_ControlBar');
    if (store.state.activeNav != 1 || props.pageType == 'AnalysisMap') {
        ControlBar._container.classList.add('ControlBar_min');
    }
    window.mapObj.addControl(ControlBar);
}

// watch( () => store.state.activeNav, (newVal) => {
//     if (!ControlBar) return;
//     if (newVal == 0) {
//         ControlBar._container.classList.add('ControlBar_hide')
//         ScaleObj._container.classList.add('scale_hide')
//     } else {
//         ControlBar._container.classList.remove('ControlBar_hide')
//         ScaleObj._container.classList.remove('scale_hide')
//     }
//     if (newVal == 1) {
//         ControlBar._container.classList.remove('ControlBar_min')
//     } else {
//         ControlBar._container.classList.add('ControlBar_min')
//     }
//     if (newVal == 1) {
//         ScaleObj._container.classList.remove('scale_min')
//     } else {
//         ScaleObj._container.classList.add('scale_min')
//     }
// });


// 添加比例尺
let ScaleObj;
function addScaleFun() {
    ScaleObj && window.mapObj.removeControl(ScaleObj);
    ScaleObj = new LKMap.Scale({
        position: 'bottom-right',   // 添加位置
    });
    window.mapObj.addControl(ScaleObj);
    if (store.state.activeNav != 1 || props.pageType == 'AnalysisMap') {
        ScaleObj._container.classList.add('scale_min');
    }
}

// 添加缩放控件
function addToolBarFun() {
    let ToolBar = new LKMap.ToolBar({
        // map: map,
        position: 'left-center',
        // ruler: false,
        showZoom: true,
        liteStyle: true
    });
    window.mapObj.addControl(ToolBar);
}


</script>

<style lang="scss" >
@import url('./MapControl.scss');
</style>
  
