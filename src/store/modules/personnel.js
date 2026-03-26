const PERSON_AREA_POLYGON = [
  [111.41098823911135, 30.555326852157116],
  [111.40965179382539, 30.556139759665626],
  [111.40775444349205, 30.55431860799904],
  [111.4092221018413, 30.55322451754084],
  [111.41098823911135, 30.555326852157116],
];

const isPointInPolygon = (lon, lat, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const state = {
  personnelList: [], // Flat list of personnel in the area
  personnelMap: new Map(), // Personnel grouped by department
  token: null,
  timer: null,
  loading: false
};

const mutations = {
  SET_PERSONNEL_DATA(state, { list, map }) {
    state.personnelList = list;
    state.personnelMap = map;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_TIMER(state, timer) {
    if (state.timer) clearInterval(state.timer);
    state.timer = timer;
  }
};

const actions = {
  async fetchToken({ commit }) {
    try {
      const res = await fetch('/people-locate/api/v2/get-token', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "837E4298041D73923169079720895C06" },
        body: JSON.stringify({
          "appId": "client",
          "buildIdList": ["209094"]
        })
      });
      if (!res.ok) throw Error(res.statusText);
      const json = await res.json();
      commit('SET_TOKEN', json.data);
      return json.data;
    } catch (error) {
      console.error('Failed to fetch personnel token:', error);
      return null;
    }
  },

  async fetchPersonnelData({ state, commit, dispatch }) {
    commit('SET_LOADING', true);
    let token = state.token;
    if (!token) {
      token = await dispatch('fetchToken');
    }
    if (!token) {
      commit('SET_LOADING', false);
      return;
    }

    try {
      const res = await fetch('/people-locate/api/v2/person/realTimeData', {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": token },
        body: JSON.stringify({ "buildId": "209094" })
      });
      if (!res.ok) throw Error(res.statusText);
      const json = await res.json();
      const rawData = json.data || [];

      const filteredList = [];
      const filteredMap = rawData.reduce((pre, cur) => {
        const lon = Number(cur.longitude);
        const lat = Number(cur.latitude);
        if (isPointInPolygon(lon, lat, PERSON_AREA_POLYGON)) {
          filteredList.push(cur);
          const dept = cur.department || '一线员工';
          if (!pre.has(dept)) {
            pre.set(dept, [cur]);
          } else {
            pre.get(dept).push(cur);
          }
        }
        return pre;
      }, new Map());

      commit('SET_PERSONNEL_DATA', { list: filteredList, map: filteredMap });
    } catch (error) {
      console.error('Failed to fetch personnel data:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  startPolling({ state, dispatch, commit }) {
    if (state.timer) return;
    dispatch('fetchPersonnelData');
    const timer = setInterval(() => {
      dispatch('fetchPersonnelData');
    }, 3 * 60 * 1000); // 3 minutes
    commit('SET_TIMER', timer);
  },

  stopPolling({ commit }) {
    commit('SET_TIMER', null);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
