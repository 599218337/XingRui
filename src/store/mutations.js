/*
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-24 13:50:59
 * @FilePath: \screen-web\src\store\mutations.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
// 改变状态的方法
// 设置函数来为状态值的常量赋值
export default {
  // 设置地图是否加载完成
  setMapLoaded(state, val) {
    state.mapLoaded = val;
  },
  // 设置vs是否加载完成
  setVsLoaded(state, val) {
    state.vsLoaded = val;
  },    // 登录获取的用户信息
  setActiveNav(state, data) {
    state.activeNav = data;
  },
  setShowAside(state, data) {
    state.showAside = data;
  },
  // 首页加载loading
  setShowLoading(state, data) {
    state.showLoading = data;
  },
  setShowPoiSetting(state, data) {
    state.showPoiSetting = data;
  },
  setShowLineSetting(state, data) {
    state.showLineSetting = data;
  },
  setShowCamera(state, data) {
    state.showCamera = data;
  },
  setShowFire(state, data) {
    state.showFire = data;
  },
  setShowDevices(state, data) {
    state.showDevices = data;
  },
  updateDevicesArray(state, data) {
    data = JSON.parse(data)
    if (!state.devicesMap.has(data.ClientId)) {
      state.devicesMap.set(data.ClientId, data);
    }


  },
  setShowPerson(state, data) {
    state.showPerson = data;
  },
  setShowTimeWeather(state, data) {
    state.showTimeWeather = data;
  },
  setCameraArray(state, data) {
    state.cameraArray = data;
  },
  setFireArray(state, data) {
    state.fireArray = data;
  },
  setPersonArray(state, data) {
    state.personArray = data;
  },
    setWeather(state, data) {
        state.weather = data;
    },




}
