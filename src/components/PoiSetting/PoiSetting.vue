<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-12 16:58:02
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="poiSetting">
    <div class="dialog">
      <div class="header">
        <span>标识点设置</span>
      </div>
      <div class="close" @click="close">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="content">
        <el-form :model="form" label-width="auto">
          <el-form-item label="标识点名称：">
            <el-input v-model="form.label" placeholder="标识点名称" />
          </el-form-item>
          <el-form-item label="类型：">
            <el-radio-group v-model="form.type">
              <el-radio value="video">视频</el-radio>
              <el-radio value="msg">图文</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-show="form.type == 'msg'">
            <div class="richContent">
              <Toolbar style="border-bottom: 1px solid rgba(41, 182, 255,0.5)" :editor="editorRef"
                :defaultConfig="toolbarConfig" :mode="mode" />
              <Editor style="height: 450px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
                :mode="mode" @onCreated="handleCreated" />
            </div>
          </el-form-item>
          <el-form-item v-show="form.type == 'video'" style="display: inline-flex;">
            <el-upload v-show="showUploadBtn" v-model:file-list="fileList" class="uploadContent" ref="upload"
              accept="video/mp4" action="/api/show/file/upload" :show-file-list="false" :limit="1"
              :on-preview="handlePreview" :on-remove="handleRemove" :on-error="handleError" :on-success="handleSuccess"
              :before-upload="beforeAvatarUpload" :on-progress="handleProgress">
              <div class="uploadBtn">
                <el-button>
                  <img :src="uploadSvg" />
                  点击上传视频</el-button>
              </div>
            </el-upload>

            <div class="fileContent" v-show="!showUploadBtn">
              <div class="fileContentItem">
                <span>{{ fileName }}</span>
                <div class="uploadItemBtn" v-show="uploadComplete">
                  <el-button key="primary" type="primary" link @click="preview"> 预览 </el-button>
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
    <div class="dialogVideo" v-if="showVideo">
      <div class="header">
        <span>{{ fileName }}</span>
      </div>
      <div class="close" @click="closeVideo">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="content">
        <video ref="videoRef" :src="form.video" width="100%" height="100%" autoplay controls></video>
      </div>

    </div>

  </div>

</template>

<script setup>
import { ref, watch, onMounted, reactive, onBeforeUnmount, shallowRef, nextTick, defineProps, defineEmits } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import uploadSvg from "/image/upload.svg";
// import { Upload } from '@element-plus/icons-vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'


import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  id: String
});
// import { DomEditor } from '@wangeditor/editor'

const form = reactive({
  label: '',
  type: 'msg',
  msg: '',
  video: ''
})

const editorRef = shallowRef()
const valueHtml = ref('')
const mode = ref('default')

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}

toolbarConfig.toolbarKeys = [
  "undo",
  "redo",
  "fontFamily",
  "fontSize",
  "bold",
  "italic",
  "underline",
  "through",
  "color",
  "bgColor",
  "justifyLeft",
  "justifyRight",
  "justifyCenter",
  "justifyJustify",
  "numberedList",
  "bulletedList",
  "indent",
  "delIndent",
  "emotion",
  "uploadImage",
  "divider",
]


editorConfig.MENU_CONF['uploadImage'] = {
  server: '/api/show/file/upload',
  fieldName: 'file',
  // 自定义插入图片
  customInsert(res, insertFn) {
    insertFn(res.data.url)
  },
  // 单个文件上传成功之后
  onSuccess(file, res) {
    console.log(`${file.name} 上传成功`, res)
  },

  // 单个文件上传失败
  onFailed(file, res) {
    console.log(`${file.name} 上传失败`, res)
  },

  // 上传错误，或者触发 timeout 超时
  onError(file, err, res) {
    console.log(`${file.name} 上传出错`, err, res)
  },


}

const fileList = ref()
const upload = ref()
const showUploadBtn = ref(true)
const uploadComplete = ref(false)
const fileName = ref('')
const percentage = ref(0)
const showVideo = ref(false)


const handleSuccess = (response, uploadFile, uploadFiles) => {
  console.log('handleSuccess', response, uploadFile, uploadFiles)
  uploadComplete.value = true
  form.video = response.data.url

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
  if (rawFile.type !== 'video/mp4') {
    ElMessage.error('请上传video/mp4格式视频!')
    return false
  }
  return true
}

const preview = () => {
  showVideo.value = true

}
const closeVideo = () => {
  showVideo.value = false
}

const clear = () => {
  upload.value.clearFiles()
  uploadComplete.value = false
  showUploadBtn.value = true
  fileName.value = ''
  form.video = ''
}


onMounted(() => {
  let id = props.id.split('_')[1]
  axios.get(`/api/show/${id}`, {
  }).then(
    (res) => {
      console.log(res);
      let data = res.data.data
      if (data) {
        form.label = data.label
        form.video = data.video
        form.msg = data.msg
        form.type = data.video ? 'video' : 'msg'
        if (form.type == 'msg') {
          const editor = editorRef.value
          editor && editor.setHtml(data.msg)
        } else {
          showUploadBtn.value = false
          uploadComplete.value = true
          let str = data.video.split('/')
          fileName.value = str[str.length - 1] || '未命名'
        }
      }
    }
  )

  // setTimeout(() => {
  //   const toolbar = DomEditor.getToolbar(editorRef.value)

  //   const curToolbarConfig = toolbar.getConfig()
  //   console.log(curToolbarConfig.toolbarKeys)

  // }, 5000)
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor
}

const close = () => {
  onCancel()
}


const emit = defineEmits(['modifyPoi']);

const onSubmit = () => {
  const editor = editorRef.value
  if (form.type == 'msg') {
    form.msg = editor.isEmpty()?'':editor.getHtml()
    form.video = ''
  } else {
    form.msg = ''
  }

  let str = props.id.split('_')
  let data = {
    id: str[1],
    label: form.label,
    msg: form.msg,
    video: form.video
  }
  axios({
    method: 'post',//请求方法
    data: data,
    url: `/api/show/point`,
  }).then(res => {
    console.log(res)
    ElMessage({
      type: 'success',
      message: '保存成功！'
    })
  })
  emit('modifyPoi', { id:props.id, label: form.label });

  onCancel()

}
const onClear = () => {
  form.label = ''
  form.msg = ''
  form.video = ''
  valueHtml.value = ''
  clear()

}
const onCancel = () => {
  onClear()
  form.type = 'msg'
  store.dispatch("setShowPoiSetting", false);
}
</script>

<style lang="scss" scoped>
@import url('./PoiSetting.scss');
</style>