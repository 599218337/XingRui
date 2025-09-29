<template>
  <div class="login-wrap">
    <div class="ray">
      <img src="/public/image/ray.svg" width="100%" height="1005">
    </div>
    <div class="title">兴瑞数字孪生平台</div>
    <div class="content">
      <div class="formTitle">
        <div class="line"></div>
        <div>用户登录</div>
      </div>
      <div class="formContent">
        <el-form ref="ruleFormRef" :model="ruleForm" size="large" :rules="rules">
          <el-form-item prop="username">
            <el-input size="large" placeholder="请输入登录账号" v-model="ruleForm.username">
              <template #prefix>
                <img src="/image/username.png" alt="" srcset="">
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入登录密码" v-model="ruleForm.password">
              <template #prefix>
                <img src="/image/passpord.png" alt="" srcset="">
              </template></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-col :span="15">
              <el-input size="large" placeholder="请输入验证码" v-model="ruleForm.verifyCode">
                <template #prefix>
                  <img src="/image/verify.png" alt="" srcset="">
                </template>
              </el-input>

            </el-col>
            <el-col :span="1">
            </el-col>
            <el-col :span="3">
              <div class="piccode">
                <PicCode :width="120" :height="50" v-model:Code="verifyCode" />
              </div>

            </el-col>
          </el-form-item>
          <div class="pass-option">
            <div class="remember-pass">
              <el-checkbox v-model="isRemember" label="记住密码" />
            </div>
            <div class="forgot-pass" @click="forgotFuc">
              <span>忘记密码？</span>
            </div>
          </div>

          <el-button class="submit-btn" size="large" type="primary" @click="submitForm(ruleFormRef)">
            登录
          </el-button>
        </el-form>

      </div>
    </div>

  </div>
</template>

<script setup>
import router from '@router'
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue';
import { encryptData, decryptData } from "./crypto";
import { useStore } from "vuex";
import { PicCode } from '@/components';
import Config from "@/utils/Config";
import { ElNotification, ElMessage } from 'element-plus'
const { user1, user2 } = Config;
// 表单体
const ruleFormRef = ref()
// 表单数据
let ruleForm = reactive({
  // 用户名
  username: '',
  // 密码
  password: '',
  verifyCode: ''
})
// 表单校验规则
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'change' },
  ],
})

const verifyCode = ref(1);

// 记住密码状态
const isRemember = ref(true)
// const showError = ref(false)

// 登录
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (ruleForm.verifyCode.toLowerCase() !== verifyCode.value) {
        ElNotification({
          title: '登录失败',
          message: '验证码错误，请重试！',
          type: 'error',
        })
        localStorage.removeItem("account_name");
        localStorage.removeItem("account_password");
        return
      }

      if (((ruleForm.username == user1.name && ruleForm.password == user1.pass.join('')) || (ruleForm.username == user2.name && ruleForm.password == user2.pass.join('')))) {
        sessionStorage.setItem("account_name", encryptData(ruleForm.username));
        sessionStorage.setItem("account_password", encryptData(ruleForm.password));
        // console.log('进入');
        // router.push({ path: '/' })
        router.push({
          name: '首页'
        })

      } else {
        ElNotification({
          title: '登录失败',
          message: '用户名或密码错误，请重试！',
          type: 'error',
        })
        sessionStorage.removeItem("account_name");
        sessionStorage.removeItem("account_password");
      }



      // 记住密码
      if (isRemember.value) {
        localStorage.setItem("account_name", encryptData(ruleForm.username));
        localStorage.setItem("account_password", encryptData(ruleForm.password));
      } else {
        localStorage.removeItem("account_name");
        localStorage.removeItem("account_password");
      }
    }
  })
}

const forgotFuc = () => {
  ElMessage.warning({
    type: 'warning',
    message: '请联系平台管理员'
  })
}


const handler = (e) => {
  if (e.key === 'Enter') {
    submitForm(ruleFormRef.value)
  }
}
onMounted(() => {
  window.addEventListener('keydown', handler);
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handler, false);
})

</script>

<style lang="scss">
@import "./login.scss";
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->