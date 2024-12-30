<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-14 21:07:21
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="lineSetting">
    <div class="dialog">
      <div class="header">
        <span>线路设置</span>
      </div>
      <div class="close" @click="close">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="content">
        <el-form :model="form" label-width="auto">
          <el-form-item style="display: inline-flex;">
            <el-upload v-show="showUploadBtn" v-model:file-list="fileList" class="uploadContent" ref="upload"
              accept="audio/mpeg" action="/api/show/file/upload" :show-file-list="false" :limit="1"
              :on-preview="handlePreview" :on-remove="handleRemove" :on-error="handleError" :on-success="handleSuccess"
              :before-upload="beforeAvatarUpload" :on-progress="handleProgress">
              <div class="uploadBtn">
                <el-button>
                  <img :src="uploadSvg" />
                  点击上传音频</el-button>
              </div>
            </el-upload>

            <div class="fileContent" v-show="!showUploadBtn">
              <div class="fileContentItem">
                <span>{{ fileName }}</span>
                <div class="uploadItemBtn" v-show="uploadComplete">
                  <el-button key="primary" type="primary" link @click="preview"> 试听 </el-button>
                  <el-button key="primary" type="primary" link @click="clear"> 清除 </el-button>
                </div>
              </div>
              <div v-show="!uploadComplete">
                <el-progress :percentage="percentage" />
              </div>
            </div>


          </el-form-item>

          <el-form-item>
            <div class="btn">
              <el-button type="primary" @click="onSubmit">确定</el-button>
              <el-button @click="onClear">清空</el-button>
              <el-button @click="onCancel">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

    </div>
    <div class="dialogAudio" v-if="showAudio">
      <div class="header">
        <span>{{ fileName }}</span>
      </div>
      <div class="close" @click="closeAudio">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="content">
        <audio ref="audioRef" :src="form.audio" autoplay controls></audio>
      </div>

    </div>

  </div>

</template>

<script setup>
import { ref, watch, onMounted, reactive, onBeforeUnmount, shallowRef, nextTick, defineProps, defineEmits } from 'vue'
import uploadSvg from "/image/upload.svg";
import axios from 'axios';
import { ElMessage } from 'element-plus'


import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  id: String
});

const form = reactive({
  audio: '',
  duration: 0
})

const fileList = ref()
const upload = ref()
const showUploadBtn = ref(true)
const uploadComplete = ref(false)
const fileName = ref('')
const percentage = ref(0)
const showAudio = ref(false)


const handleSuccess = (response, uploadFile, uploadFiles) => {
  console.log('handleSuccess', response, uploadFile, uploadFiles)
  uploadComplete.value = true
  form.audio = response.data.url
  let audio = new Audio(form.audio);
  audio.onloadedmetadata = function () {
    if (audio && audio.duration) {
      form.duration = audio.duration
      console.log(audio.duration + '秒');
    }
  };
  audio.load();

}
const handleError = (response, uploadFile, uploadFiles) => {
  console.log('handleError', response, uploadFile, uploadFiles)

}
const handleProgress = (evt, uploadFile, uploadFiles) => {
  showUploadBtn.value = false
  fileName.value = uploadFile.name
  console.log('handleProgress', evt, uploadFile, uploadFiles)
  percentage.value = parseInt(evt.percent)
}

const handleRemove = (file, uploadFiles) => {
  console.log('handleRemove', file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log('handlePreview', uploadFile)
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'audio/mpeg') {
    ElMessage.error('请上传mp3格式视频!')
    return false
  }
  return true
}

const preview = () => {
  showAudio.value = true

}
const closeAudio = () => {
  showAudio.value = false
}

const clear = () => {
  upload.value.clearFiles()
  uploadComplete.value = false
  showUploadBtn.value = true
  fileName.value = ''
  form.audio = ''
  form.duration = ''
}


onMounted(() => {
  let id = props.id.split('_')[1]
  axios.get(`/api/show/${id}`, {
  }).then(
    (res) => {
      console.log(res);
      let data = res.data.data
      if (data) {
        form.audio = data.audio
        form.duration = data.duration
        if (data.audio) {
          showUploadBtn.value = false
          uploadComplete.value = true
          let str = data.audio.split('/')
          fileName.value = str[str.length - 1] || '未命名'
        }
      }
    }
  )
})

onBeforeUnmount(() => {
})

const handleCreated = (editor) => {
}

const close = () => {
  onCancel()
}

const onSubmit = () => {
  let str = props.id.split('_')
  let data = {
    id: str[1],
    audio: form.audio,
    duration: form.duration
  }

  axios({
    method: 'post',//请求方法
    data: data,
    url: `/api/show/line`,
  }).then(res => {
    console.log(res)
    ElMessage({
      type: 'success',
      message: '保存成功！'
    })
  })

  onCancel()

}
const onClear = () => {
  form.audio = ''
  form.duration = ''

  clear()

}
const onCancel = () => {
  onClear()
  store.dispatch("setShowLineSetting", false);
}
</script>

<style lang="scss" scoped>
@import url('./LineSetting.scss');
</style>