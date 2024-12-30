/*
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 11:31:19
 * @FilePath: \screen-web\src\store\actions.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-26 17:48:34
 * @FilePath: \screen-web\src\store\actions.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 设置函数，使用commit来提交mutations中状态值的改变，
// 但是此时state的状态值还是没有改变，需要通过$dispatch来分配actions；

export default {
  // 首页地图是否加载完成
  setMapLoadedAction(context, data) {
    context.commit('setMapLoaded', data);
  },
  // 设置vs是否完成
  setVsLoadedAction(context, data) {
    context.commit('setVsLoaded', data);
  },
  // 切换顶部 nav
  setActiveNavAction(context, data) {
    context.commit('setActiveNav', data);
  },
  setShowLoadingAction(context, data) {
    context.commit('setShowLoading', data);
  },
  setShowAside(context, data) {
    context.commit('setShowAside', data);
  },
  setShowPoiSetting(context, data) {
    context.commit('setShowPoiSetting', data);
  },
  setShowLineSetting(context, data) {
    context.commit('setShowLineSetting', data);
  },
  setShowCamera(context, data) {
    context.commit('setShowCamera', data);
  },
  setShowFire(context, data) {
    context.commit('setShowFire', data);
  },
  setShowDevices(context, data) {
    context.commit('setShowDevices', data);
  },
  updateDevicesArray(context, data) {
    context.commit('updateDevicesArray', data);
  },
  setShowPerson(context, data) {
    context.commit('setShowPerson', data);
  },
  setShowTimeWeather(context, data) {
    context.commit('setShowTimeWeather', data);
  },
  setCameraArray(context, data) {
    context.commit('setCameraArray', data);
  },
  setFireArray(context, data) {
    context.commit('setFireArray', data);
  },
  setPersonArray(context, data) {
    context.commit('setPersonArray', data);
  },
setWeather(context, data){
        context.commit('setWeather', data);
    },


}
