/*
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-24 13:59:10
 * @FilePath: \screen-web\src\components\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 顶部导航
import headerNav from "./header/header.vue";
// 加载框
import Loading from "./Loading/Loading.vue";
// import WDPMap from "./WDPMap/WDPMap.vue";


import personnelStatistics from "./PersonnelStatistics/PersonnelStatistics.vue"
import alarmStatistics from "./AlarmStatistics/AlarmStatistics.vue"
import environmentalData from "./EnvironmentalData/EnvironmentalData.vue"
import deviceStatistics from "./DeviceStatistics/DeviceStatistics.vue"
import devicesListPoi from "./devicesListPoi/devicesListPoi.vue"
import productionTasks from "./ProductionTasks/ProductionTasks.vue"
import energyStatistics from "./EnergyStatistics/EnergyStatistics.vue"
import PicCode from "./PicCode/PicCode.vue";

import viewChange from "./ViewChange/ViewChange.vue"

// import poiSetting from "./PoiSetting/PoiSetting.vue";
// import lineSetting from "./LineSetting/LineSetting.vue";
// import poiSelect from "./PoiSelect/PoiSelect.vue";
// import poiMsg from "./PoiMsg/PoiMsg.vue";
import shareSetting from "./ShareSetting/ShareSetting.vue";

import cameraStatistics from "./CameraStatistics/CameraStatistics.vue";
import fireStatistics from "./FireStatistics/FireStatistics.vue";
import personStatistics from "./PersonStatistics/PersonStatistics.vue";

import timeWeather from "./TimeWeather/TimeWeather.vue";









// 底部按钮
import footerNav from "./footer/footer.vue"



export {
  headerNav,
  // WDPMap,
  Loading,
  personnelStatistics,
  alarmStatistics,
  environmentalData,
  deviceStatistics,
  devicesListPoi,
  productionTasks,
  energyStatistics,
  footerNav,
  viewChange,
  PicCode,
  // poiSetting,
  // lineSetting,
  // poiSelect,
  // poiMsg,
  shareSetting,
  cameraStatistics,
  fireStatistics,
  personStatistics,
  timeWeather
};

