<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-11-01 16:28:26
 * @FilePath: \screen-web\src\components\header\header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="header-box">
        <div class="time-box">
            <div>
                <span>{{ week }}</span>&nbsp&nbsp
                <span>{{ weather }}</span>
            </div>
            <div>
                <span>{{ time }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useStore } from "vuex";
import axios from 'axios'
import utils from '@/utils/utils.js'

import { decryptData } from "@/utils/crypto";
const store = useStore();

let week = ref('');
let weather = ref('');
let time = ref('');
let timer = null, weatherTimer = null

nextTick(() => {
    getWeather()
    timer = setInterval(() => {
        week.value = utils.dateToWeek(new Date());
        time.value = utils.dateFormat(new Date(), 'yyyy年MM月dd日');
    }, 1000);

    weatherTimer = setInterval(() => {
        getWeather()
    }, 600000);
    // const user_s = localStorage.getItem('account_name');
    // userName.value = decryptData(user_s);
});
onUnmounted(() => {
    clearInterval(timer)
    clearInterval(weatherTimer)
})


const getWeather = () => {
    axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
        params: {
            key: 'c4d5a8f8b9d2f351d0bd7ec75c447707',
            city: '420505',
            // extensions:'base'
        },
    }).then(
        (res) => {
            if (res.data.count == '1') {
                weather.value = res.data.lives[0].weather
                // store.dispatch('setWeather',weather.value)
            } else {
                weather.value = '未知'
            }
        }
    )
}

const formatWeather=()=>{

}

</script>

<style lang="scss" scoped>
@import url('./header.scss');
</style>