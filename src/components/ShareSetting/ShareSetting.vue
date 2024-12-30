<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-18 18:35:03
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="shareSetting">
    <div class="dialog">
      <div class="header">
        <span>分享云上展厅</span>
      </div>
      <div class="close" @click="close">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="content">
        <el-form :model="form" label-width="auto" v-show="!isGenerated">
          <el-form-item label="路线名称：">
            <span class="formText">宜化化机数字孪生中心厂区周边展厅</span>
          </el-form-item>
          <el-form-item label="类型：">
            <el-radio-group v-model="form.time">
              <el-radio value="1">1天</el-radio>
              <el-radio value="7">7天</el-radio>
              <el-radio value="30">30天</el-radio>
              <el-radio value="forever">永久</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="btn">
              <el-button type="primary" @click="onSubmit">生成链接</el-button>
              <el-button @click="onCancel">取消</el-button>
            </div>
          </el-form-item>
        </el-form>

        <el-form :model="form" label-width="auto" v-show="isGenerated">
          <el-form-item label="分享链接：">
            <el-input id="linkText" v-model="form.url" disabled />
          </el-form-item>
          <el-form-item label="链接时效：">
            <span class="formText">30天</span>
          </el-form-item>
          <el-form-item>
            <div class="btn">
              <el-button type="primary" @click="copy">复制链接</el-button>
              <el-button @click="last">上一步</el-button>
            </div>
          </el-form-item>
        </el-form>

      </div>

    </div>

  </div>

</template>

<script setup>
import { ref, watch, onMounted, reactive, onBeforeUnmount, shallowRef, nextTick, defineProps, defineEmits } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'


import { useStore } from "vuex";
const store = useStore();

const form = reactive({
  time: '7',
  id: '',
  url: ''
})

onMounted(() => {
})

onBeforeUnmount(() => {
})


const close = () => {
  onCancel()
}

const onSubmit = () => {
  let data = {
    term: form.time
  }

  axios({
    method: 'post',//请求方法
    data: data,
    url: `/api/show/term`,
  }).then(res => {
    console.log(res)
    if (res.data?.code) {
      form.id = res.data.code
      let { origin } = window.location
      let { pathname } = window.location
      form.url = `${origin + pathname}#/cloud?id=${form.id}`
      isGenerated.value = true
    }
  })




}

const emit = defineEmits(['closeShareSetting']);
const onCancel = () => {
  form.id = ''
  form.url = ''
  form.time='7'
  isGenerated.value = false
  emit('closeShareSetting');
}
const copy = () => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', form.url);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    ElMessage({
      type:'success',
      message:'复制成功！'
    })
  }
  emit('modifyPoi', { id:props.id, label: form.label });
  onCancel()

}
const isGenerated = ref(false)
const last = () => {
  form.id = ''
  form.url = ''
  isGenerated.value = false
}
</script>

<style lang="scss" scoped>
@import url('./ShareSetting.scss');
</style>