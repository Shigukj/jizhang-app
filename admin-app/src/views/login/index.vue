<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <span class="logo-icon">💰</span>
        <h1 class="logo-title">记账App</h1>
        <p class="logo-subtitle">管理后台</p>
      </div>

      <a-form
        :model="formState"
        :rules="rules"
        @finish="handleSubmit"
      >
        <a-form-item name="account">
          <a-input
            v-model:value="formState.account"
            size="large"
            placeholder="请输入用户名或手机号"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
          >
            登 录
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="login-tip">
        <p>测试账号：admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)

const formState = reactive({
  account: '',
  password: ''
})

const rules = {
  account: [
    { required: true, message: '请输入用户名或手机号' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6位' }
  ]
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await userStore.login(formState.account, formState.password)
    message.success('登录成功')
    router.push('/dashboard')
  } catch (error: any) {
    message.error(error?.error || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E6F7F6 0%, #FFFFFF 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 48px;
}

.logo-title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 16px 0 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: #8C8C8C;
}

.login-tip {
  text-align: center;
  margin-top: 16px;
  color: #8C8C8C;
  font-size: 12px;
}
</style>
