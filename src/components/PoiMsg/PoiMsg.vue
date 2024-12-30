<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-15 10:31:23
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="poiMsg" v-show="!isNull">
    <div class="dialog">
      <div class="header">
        <span>{{ form.label }}</span>
      </div>
      <div class="close" @click="close">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="content">
        <el-form :model="form" label-width="auto" style="height: 100%">
          <el-form-item v-if="form.type == 'msg'" style="height: 100%">
            <div class="richContent" style="height: 100%">
              <Editor
                style="height: 92%; overflow-y: hidden"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
              />
              <div class="closeBtn" v-show="showBtn">
                <el-button type="primary" @click="close" style="margin: auto"
                  >继续浏览展厅</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item v-else="form.type == 'video'">
            <video
              ref="videoRef"
              :src="form.video"
              width="100%"
              height="100%"
              autoplay
              controls
              @ended="onVideoEnded"
            ></video>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  reactive,
  onBeforeUnmount,
  shallowRef,
  nextTick,
  defineProps,
  defineEmits,
} from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import axios from "axios";
import { ElMessage } from "element-plus";

import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  id: String,
});

const form = reactive({
  label: "",
  type: "msg",
  msg: "",
  video: "",
});

const editorRef = shallowRef();
const valueHtml = ref("");
const mode = ref("default");

const editorConfig = {
  placeholder: "暂无介绍",
  MENU_CONF: {},
};
editorConfig.readOnly = true;

const emit = defineEmits(["showPoiMsg"]);
const isNull = ref(true);
const showBtn = ref(false);

onMounted(() => {
  let id = props.id.split("_")[1];
  axios.get(`/api/show/${id}`, {}).then((res) => {
    console.log(res);
    let data = res.data.data;
    form.label = data?.label;
    form.video = data?.video;
    form.msg = data?.msg;
    if (!data || (!data.video && !data.msg)) {
      isNull.value = true;
      id == 1 &&
        ElMessage({
          type: "warning",
          message: `标识点1：${form.label}暂无介绍！`,
        });
      emit("showPoiMsg", false);
    } else {
      isNull.value = false;
      form.type = data.video ? "video" : "msg";
      if (form.type == "msg") {
        const editor = editorRef.value;
        editor && editor.setHtml(data.msg);
        nextTick(() => {
          const dom = document.getElementsByClassName("w-e-scroll")[0];
          const handelr = () => {
            if (dom.clientHeight + dom.scrollTop >= dom.scrollHeight) {
              showBtn.value = true;
            } else {
              showBtn.value = false;
            }
          };
          handelr();
          dom.addEventListener("scroll", handelr);
        });
      }
    }
  });
});

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor;
};

const onVideoEnded = () => {
  emit("onVideoEnded");
};

const close = () => {
  form.type = "msg";
  form.label = "";
  form.msg = "";
  form.video = "";
  valueHtml.value = "";
  emit("showPoiMsg", false);
};
</script>

<style lang="scss" scoped>
@import url("./PoiMsg.scss");
</style>
