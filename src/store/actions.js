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
  setShowGds(context, data) {
    context.commit('setShowGds', data);
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
  setWeather(context, data) {
    context.commit('setWeather', data);
  },
  setAlarmList({ commit }, data) {
    commit('setAlarmList', data);
  },
  async startPollingAlarms({ commit, state }) {
    if (state.isPollingAlarms) return;
    commit('setIsPollingAlarms', true);

    while (state.isPollingAlarms) {
      if (!state.isPollingAlarms) break;
      try {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const format = (date) => {
          const Y = date.getFullYear();
          const M = String(date.getMonth() + 1).padStart(2, '0');
          const D = String(date.getDate()).padStart(2, '0');
          const h = String(date.getHours()).padStart(2, '0');
          const m = String(date.getMinutes()).padStart(2, '0');
          const s = String(date.getSeconds()).padStart(2, '0');
          return `${Y}-${M}-${D} ${h}:${m}:${s}`;
        };
        const queryParams = new URLSearchParams();
        queryParams.append('startTime', format(oneMinuteAgo));
        queryParams.append('endTime', format(now));

        const response = await fetch(`/nodeApi/alarmsHistory?${queryParams.toString()}`);
        if (response.ok) {
          const result = await response.json();
          if (result.code === 200 && result.data) {
            const alarms = result.data.map(item => {
              const now = new Date();
              const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

              let alarmText = '告警';
              let color = '#FF4D4F';

              if (item.alarm_type === 'HIGH') {
                alarmText = '高报';
                color = '#FF4D4F';
              } else if (item.alarm_type === 'LOW') {
                alarmText = '低报';
                color = '#FFA940';
              }

              return {
                id: item.device_id,
                name: item.device_name,
                alarmText,
                color,
                currentValue: item.pv_value,
                time,
                address: '系统设备'
              };
            });

            if (alarms.length > 0) {
              // 将最新的告警累加到现有列表前面
              const currentList = state.alarmList || [];
              commit('setAlarmList', [...alarms, ...currentList]);
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch alarms', e);
      }
      // slight delay before starting the next poll round
      await new Promise(r => setTimeout(r, 60000));
    }
  },
  stopPollingAlarms({ commit }) {
    commit('setIsPollingAlarms', false);
  }
}
