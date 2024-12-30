/*
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-12-11 11:24:36
 * @FilePath: \screen-web\src\store\state.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 设置状态变量值
export default {
  mapLoaded: 0,
  vsLoaded: 0,
  activeNav: 0, //切换
  showAside: false,
  showLoading: true,  // 首页加载loading
  showPoiSetting: false,
  showLineSetting: false,
  showCamera: false,
  showFire: false,
  showDevices: false,
  showPerson: false,
  showTimeWeather: false,
  cameraArray: [],
  fireArray: [],
  personArray: [],
  devicesMap: new Map(),
  weather: ''
}
