<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-11-22 17:43:03
 * @FilePath: \screen-web\src\components\footer\footer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="timeWeather">
        <div class="header">
            <span>场景设置</span>
        </div>
        <div class="close" @click="close">
            <el-icon>
                <Close />
            </el-icon>
        </div>
        <div class="content">
            <div class="time">
                <div class="mask" v-show="showLoading">
                    <el-icon class="is-loading">
                        <Loading />
                    </el-icon>
                    <div class="text">{{ loadingText }}</div>
                </div>
                <div class="title">
                    <span class="text">时间与现实同步</span>
                    <el-switch class="switch" v-model="timeAuto" @change="timeAutoFuc" size='small' />
                    <el-button class="btn" type="primary" round size='small' @click="timeAutoPlay">一键播放</el-button>
                </div>
                <div class="timeContent">
                    <div class="timeItem" v-for="(item, index) in timeConfig" @click="setTime(item.value)">
                        <img class="image" :src="item.show ? item.image2 : item.image1">
                        <div class="text" :style="{ color: item.show ? '#fff' : '#8b8c8c' }">{{ item.label }}</div>
                    </div>
                </div>
            </div>
            <div class="weather">
                <div class="title">
                    <span class="text">天气与现实同步</span>
                    <el-switch class="switch" v-model="weatherAuto" @change="weatherAutoFuc" size='small' />
                </div>
                <div class="weatherContent">
                    <div class="weatherItem" v-for="(item, index) in weatherConfig" @click="setWeather(item.value)">
                        <img class="image" :src="item.show ? item.image2 : item.image1">
                        <div class="text" :style="{ color: item.show ? '#fff' : '#8b8c8c' }">{{ item.label }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { reactive, ref, watch, nextTick, onMounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();

const showLoading = ref(false)
const loadingText = ref('实时...')

let timeAuto = ref(true)
let weatherAuto = ref(true)

let timeConfig = reactive([
    {
        label: '7:00',
        value: '7:00',
        image1: '/image/早上-未选中.png',
        image2: '/image/早上-选中.png',
        show: false
    },
    {
        label: '12:00',
        value: '12:00',
        image1: '/image/中午-未选中.png',
        image2: '/image/中午-选中.png',
        show: false
    },
    {
        label: '17:00',
        value: '17:00',
        image1: '/image/下午-未选中.png',
        image2: '/image/下午-选中.png',
        show: false
    },
    {
        label: '22:00',
        value: '22:00',
        image1: '/image/晚上-未选中.png',
        image2: '/image/晚上-选中.png',
        show: false
    },
])
let weatherConfig = reactive([
    {
        label: '晴天',
        value: 'Sunny',
        image1: '/image/晴天-未选中.png',
        image2: '/image/晴天-选中.png',
        show: false
    },
    {
        label: '多云',
        value: 'Overcast',
        image1: '/image/多云-未选中.png',
        image2: '/image/多云-选中.png',
        show: false
    },
    {
        label: '下雨',
        value: 'LightRain',
        image1: '/image/下雨-未选中.png',
        image2: '/image/下雨-选中.png',
        show: false
    },
    {
        label: '下雪',
        value: 'LightSnow',
        image1: '/image/下雪-未选中.png',
        image2: '/image/下雪-选中.png',
        show: false
    },
])

onMounted(() => {
    // nextTick(() => {
    //     if (timeAuto.value) {
    //         setTime('auto')
    //     } else {
    //         let timeItem = timeConfig.find((item) => {
    //             return item.show == true
    //         })
    //         setTime(timeItem.value)
    //     }
    //     if (weatherAuto.value) {
    //         setWeather('auto')
    //     } else {
    //         let weatherItem = weatherConfig.find((item) => {
    //             return item.show == true
    //         })
    //         setWeather(weatherItem.value)
    //     }
    // })
})

const timeAutoPlay = () => {
    showLoading.value = true
    let nowHour = new Date().getHours()
    if (nowHour == 24) { nowHour = 0 }
    setTimePlay((nowHour + 1 == 24) ? 0 : (nowHour + 1))

    function setTimePlay(time) {
        console.log('time', time)
        loadingText.value = (time == 'auto' ? '实时' : `${time}:00`)
        let jsondata = {
            "env_time": time == 'auto' ? 'auto' : `${time}:00`,
            "direction": "clockwise"
        }

        cloudRender.SuperAPI("SetEnvTime", jsondata, (status) => {
        })
        setTimeout(() => {
            if (time == 'auto') {
                showLoading.value = false
                return
            }
            else if (time == nowHour) {
                setTimePlay('auto')
            }
            else {
                setTimePlay((time + 1 == 24) ? 0 : (time + 1))
            }
        }, 1500);
        // else if ((time > nowHour && time < 24) || (time < nowHour)) {
        //     setTimeout(() => {
        //         setTimePlay((time + 1 == 24) ? 0 : (time + 1))
        //     }, 1500);
        // }
        // else if (time < nowHour) {
        //     setTimeout(() => {
        //         setTimePlay(time + 1)
        //     }, 1500);
        // }

    }
}



const timeAutoFuc = (val) => {
    val ? setTime('auto') : setTime('12:00')
}
function setTime(time) {
    if (time !== 'auto') {
        timeAuto.value = false
    }
    timeConfig.forEach((item) => {
        item.show = item.value == time ? true : false
    })
    let jsondata = {
        "env_time": time,
        "direction": "clockwise"
    }
    cloudRender.SuperAPI("SetEnvTime", jsondata, (status) => {
        console.log(status);
    })
}
const weatherAutoFuc = (val) => {
    val ? setWeather('auto') : setWeather('Sunny')
}
function setWeather(weather) {
    if (weather !== 'auto') {
        weatherAuto.value = false
    }
    weatherConfig.forEach((item) => {
        item.show = item.value == weather ? true : false
    })
    let jsondata = {
        "env_weather": weather
    }
    cloudRender.SuperAPI("SetEnvWeather", jsondata, (status) => {
        console.log(status);
    })
}

const close = () => {
    store.dispatch("setShowTimeWeather", false);
}






</script>

<style lang="scss" scoped>
@import url('./TimeWeather.scss');
</style>