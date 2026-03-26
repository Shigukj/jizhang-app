<template>
  <view class="login-container">
    <!-- Logo 区域 -->
    <view class="logo-section">
      <view class="logo-icon">💰</view>
      <text class="logo-title">记账App</text>
      <text class="logo-subtitle">极简记账，轻松理财</text>
    </view>

    <!-- 登录表单 -->
    <view class="form-section">
      <view class="form-item">
        <input 
          class="input" 
          type="number" 
          v-model="phone" 
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>
      
      <view class="form-item" v-if="isRegister">
        <input 
          class="input" 
          type="text" 
          v-model="username" 
          placeholder="请输入昵称（可选）"
          maxlength="20"
        />
      </view>

      <view class="form-item">
        <input 
          class="input" 
          type="password" 
          v-model="password" 
          placeholder="请输入密码"
          maxlength="20"
        />
      </view>

      <view class="form-item" v-if="isRegister">
        <input 
          class="input" 
          type="password" 
          v-model="confirmPassword" 
          placeholder="请确认密码"
          maxlength="20"
        />
      </view>

      <button class="btn-primary" @click="handleSubmit" :disabled="loading">
        {{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}
      </button>

      <view class="switch-mode" @click="switchMode">
        <text>{{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}</text>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <checkbox-group @change="onAgreementChange">
        <label class="agreement-label">
          <checkbox :checked="agreed" color="#00A5A0" />
          <text>我已阅读并同意</text>
        </label>
      </checkbox-group>
      <text class="agreement-link">《用户协议》</text>
      <text>和</text>
      <text class="agreement-link">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const phone = ref('')
const password = ref('')
const username = ref('')
const confirmPassword = ref('')
const isRegister = ref(false)
const agreed = ref(false)
const loading = ref(false)

// 切换登录/注册模式
const switchMode = () => {
  isRegister.value = !isRegister.value
  password.value = ''
  confirmPassword.value = ''
}

// 协议勾选
const onAgreementChange = (e) => {
  agreed.value = e.detail.value.length > 0
}

// 表单验证
const validateForm = () => {
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return false
  }
  if (!password.value || password.value.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return false
  }
  if (isRegister.value && password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return false
  }
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return false
  }
  return true
}

// 提交
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  try {
    if (isRegister.value) {
      await userStore.register(phone.value, password.value, username.value)
      uni.showToast({ title: '注册成功', icon: 'success' })
    } else {
      await userStore.login(phone.value, password.value)
      uni.showToast({ title: '登录成功', icon: 'success' })
    }
    
    // 跳转首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (error) {
    uni.showToast({ title: error.message || '操作失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  padding: 60px 32px;
  background: linear-gradient(180deg, #E6F7F6 0%, #FFFFFF 50%);
}

.logo-section {
  text-align: center;
  margin-bottom: 48px;
}

.logo-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.logo-title {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: #8C8C8C;
}

.form-section {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.form-item {
  margin-bottom: 16px;
}

.input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: #F5F5F5;
  border-radius: 8px;
  font-size: 16px;
}

.btn-primary {
  width: 100%;
  height: 48px;
  background: #00A5A0;
  border-radius: 24px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  border: none;
  margin-top: 8px;
}

.btn-primary[disabled] {
  background: #C0C0C0;
}

.switch-mode {
  text-align: center;
  margin-top: 24px;
  color: #00A5A0;
  font-size: 14px;
}

.agreement {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #8C8C8C;
}

.agreement-label {
  display: flex;
  align-items: center;
}

.agreement-link {
  color: #00A5A0;
}
</style>
