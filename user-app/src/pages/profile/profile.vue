<template>
  <view class="page-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-avatar">
        <text class="avatar-text">{{ avatarText }}</text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo?.username || '用户' }}</text>
        <text class="user-phone">{{ formatPhone(userInfo?.phone) }}</text>
      </view>
      <view class="user-stats">
        <view class="stat-item">
          <text class="stat-value">{{ userInfo?.record_days || 0 }}</text>
          <text class="stat-label">记账天数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ userInfo?.record_count || 0 }}</text>
          <text class="stat-label">账目数量</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToLedgers">
        <text class="menu-icon">📒</text>
        <text class="menu-text">账本管理</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToBudget">
        <text class="menu-icon">💰</text>
        <text class="menu-text">预算设置</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToCategories">
        <text class="menu-icon">📁</text>
        <text class="menu-text">分类管理</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToReminder">
        <text class="menu-icon">🔔</text>
        <text class="menu-text">记账提醒</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToExport">
        <text class="menu-icon">📊</text>
        <text class="menu-text">导出报表</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 设置列表 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToPrivacy">
        <text class="menu-icon">🔒</text>
        <text class="menu-text">隐私设置</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToAbout">
        <text class="menu-icon">📱</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="handleLogout">
        <text class="menu-icon">🚪</text>
        <text class="menu-text logout">退出登录</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo)

const avatarText = computed(() => {
  const name = userInfo.value?.username || ''
  return name.charAt(0).toUpperCase() || 'U'
})

// 格式化手机号
const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 页面显示时刷新用户信息
onShow(async () => {
  if (userStore.isLoggedIn) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
})

// 导航方法
const goToLedgers = () => {
  uni.showToast({ title: '账本管理开发中', icon: 'none' })
}

const goToBudget = () => {
  uni.showToast({ title: '预算设置开发中', icon: 'none' })
}

const goToCategories = () => {
  uni.showToast({ title: '分类管理开发中', icon: 'none' })
}

const goToReminder = () => {
  uni.showToast({ title: '记账提醒开发中', icon: 'none' })
}

const goToExport = () => {
  uni.showToast({ title: '导出报表开发中', icon: 'none' })
}

const goToPrivacy = () => {
  uni.showToast({ title: '隐私设置开发中', icon: 'none' })
}

const goToAbout = () => {
  uni.showToast({ title: '关于我们开发中', icon: 'none' })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.redirectTo({ url: '/pages/login/login' })
      }
    }
  })
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    uni.redirectTo({ url: '/pages/login/login' })
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 16px;
  padding-bottom: 100px;
  background: #F5F5F5;
}

/* 用户卡片 */
.user-card {
  background: linear-gradient(135deg, #00A5A0 0%, #26B3AE 100%);
  border-radius: 16px;
  padding: 24px;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.avatar-text {
  font-size: 28px;
  font-weight: 600;
}

.user-info {
  margin-bottom: 16px;
}

.user-name {
  display: block;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 14px;
  opacity: 0.8;
}

.user-stats {
  display: flex;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

/* 菜单列表 */
.menu-section {
  background: #FFFFFF;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #F5F5F5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: #262626;
}

.menu-text.logout {
  color: #FF4D4F;
}

.menu-arrow {
  font-size: 14px;
  color: #C0C0C0;
}
</style>
