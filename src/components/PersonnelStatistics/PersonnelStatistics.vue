<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-27 17:29:07
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="personnelStatistics">
    <div class="header">
      <span>人员统计</span>
    </div>
    <div class="content" v-loading="loading" element-loading-background="rgba(8, 15, 24, 0.4)">
      <div class="contentItem" v-for="(item, index) in infoArry">
        <img :src="item.img">
        <div class="text">
          <div class="text1">{{ item.label1 }}</div>
          <div class="text2">{{ item.label2 }}</div>
        </div>
      </div>

    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const loading = ref(false)

const getPersonApiToken = async () => {
// ... existing code ...
  let token;
  await fetch('/people-locate/api/v2/get-token', {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "837E4298041D73923169079720895C06", },
    body: JSON.stringify({
      "appId": "client",
      "buildIdList": [
        "209094"
      ]
    })
  }).then(res => {
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  }).then(json => {
    token = json.data
  })
  return token;
}

// 判断点是否在多边形内（射线法）
const PERSON_AREA_POLYGON = [
  [111.41098823911135, 30.555326852157116],
  [111.40965179382539, 30.556139759665626],
  [111.40775444349205, 30.55431860799904],
  [111.4092221018413, 30.55322451754084],
  [111.41098823911135, 30.555326852157116],
]
const isPointInPolygon = (lon, lat, polygon) => {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

const getPersonList = async (token) => {
  let personList;
  await fetch('/people-locate/api/v2/person/realTimeData', {
    method: "POST",
    headers: { "Content-Type": "application/json", "token": token, },
    body: JSON.stringify({
      "buildId": "209094"
    })
  }).then(res => {
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  }).then(json => {
    personList = json.data
    personList = personList.reduce((pre, cur) => {
      const lon = Number(cur.longitude)
      const lat = Number(cur.latitude)
      if (isPointInPolygon(lon, lat, PERSON_AREA_POLYGON)) {
        if (!pre.has(cur.department)) {
          pre.set(cur.department, [cur])
        } else {
          pre.get(cur.department).push(cur)
        }
      }
      return pre;
    }, new Map())
  })
  return personList;
}

const infoArry = ref([
  {
    id: 0,
    img: '/image/1.png',
    label1: '总人数',
    label2: '0人'
  },
])

onMounted(async () => {
  loading.value = true
  let token = await getPersonApiToken()
  let personMap = await getPersonList(token)

  let total = 0
  let dynamicItems = []
  let imgIndex = 2

  personMap.forEach((list, department) => {
    const deptName = department || '一线员工'
    total += list.length
    dynamicItems.push({
      id: dynamicItems.length + 1,
      img: `/image/${imgIndex}.png`,
      label1: deptName,
      label2: list.length + '人'
    })
    
    // Cycle images from 2 to 6
    imgIndex++
    if (imgIndex > 6) imgIndex = 2
  })

  infoArry.value = [
    {
      id: 0,
      img: '/image/1.png',
      label1: '总人数',
      label2: total + '人'
    },
    ...dynamicItems
  ]
  loading.value = false
})

</script>

<style lang="scss" scoped>
@import url('./PersonnelStatistics.scss');
</style>