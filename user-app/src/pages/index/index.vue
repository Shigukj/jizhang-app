<template>
  <view class="page-container">
    <!-- 金额卡片 -->
    <view class="balance-card">
      <view class="balance-header">
        <text class="balance-title">本月结余</text>
        <text class="balance-month">{{ currentMonth }}</text>
      </view>
      
      <view class="balance-amount">
        <text class="currency">¥</text>
        <text class="amount">{{ formatAmount(monthSummary.balance) }}</text>
      </view>

      <view class="balance-detail">
        <view class="detail-item">
          <text class="detail-label">支出</text>
          <text class="detail-value expense">¥{{ formatAmount(monthSummary.expense) }}</text>
        </view>
        <view class="divider"></view>
        <view class="detail-item">
          <text class="detail-label">收入</text>
          <text class="detail-value income">¥{{ formatAmount(monthSummary.income) }}</text>
        </view>
      </view>
    </view>

    <!-- 今日账目 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日账目</text>
        <text class="section-more" @click="goToRecords">查看全部 ></text>
      </view>

      <view class="record-list" v-if="todayRecords.length > 0">
        <view 
          class="record-item" 
          v-for="record in todayRecords" 
          :key="record.id"
          @click="goToRecordDetail(record.id)"
        >
          <view class="record-icon" :style="{ backgroundColor: record.category_color + '20' }">
            <text>{{ record.category_icon }}</text>
          </view>
          <view class="record-info">
            <text class="record-category">{{ record.category_name }}</text>
            <text class="record-note">{{ record.note || '无备注' }}</text>
          </view>
          <view class="record-amount">
            <text :class="['amount-text', record.type]">
              {{ record.type === 'expense' ? '-' : '+' }}¥{{ formatAmount(record.amount) }}
            </text>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <text class="empty-text">今日暂无记账</text>
        <text class="empty-hint">点击下方记账按钮开始记账吧~</text>
      </view>
    </view>

    <!-- 快捷记账 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">快捷记账</text>
      </view>

      <view class="quick-categories">
        <view 
          class="quick-category" 
          v-for="category in recentCategories" 
          :key="category.id"
          @click="quickAdd(category)"
        >
          <view class="category-icon">{{ category.icon }}</view>
          <text class="category-name">{{ category.name }}</text>
        </view>
        <view class="quick-category" @click="goToAdd">
          <view class="category-icon add">+</view>
          <text class="category-name">更多</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getHomeData } from '@/api/statistics'
import { useUserStore } from '../../stores/user'
import dayjs from 'dayjs'

const userStore = useUserStore()

// 数据
const monthSummary = ref({ expense: 0, income: 0, balance: 0 })
const todayRecords = ref([])
const recentCategories = ref([])

// 计算属性
const currentMonth = computed(() => dayjs().format('YYYY年M月'))

// 格式化金额
const formatAmount = (amount) => {
  return Number(amount || 0).toFixed(2)
}

// 加载数据
const loadData = async () => {
  try {
    const res = await getHomeData()
    monthSummary.value = res.monthSummary
    todayRecords.value = res.todayRecords || []
    recentCategories.value = res.recentCategories || []
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 页面显示时刷新数据
onShow(() => {
  if (userStore.isLoggedIn) {
    loadData()
  }
})

// 初始化
onMounted(() => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    uni.redirectTo({ url: '/pages/login/login' })
  }
})

// 快捷记账
const quickAdd = (category) => {
  uni.navigateTo({ 
    url: `/pages/add/add?categoryId=${category.id}&categoryName=${category.name}&categoryIcon=${category.icon}`
  })
}

// 跳转记账页
const goToAdd = () => {
  uni.switchTab({ url: '/pages/add/add' })
}

// 跳转账目列表
const goToRecords = () => {
  // 可以跳转到账目列表页
  uni.showToast({ title: '账目列表页开发中', icon: 'none' })
}

// 跳转账目详情
const goToRecordDetail = (id) => {
  uni.showToast({ title: '账目详情页开发中', icon: 'none' })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 16px;
  padding-bottom: 100px;
  background: #F5F5F5;
}

/* 金额卡片 */
.balance-card {
  background: linear-gradient(135deg, #00A5A0 0%, #26B3AE 100%);
  border-radius: 16px;
  padding: 20px;
  color: #FFFFFF;
  box-shadow: 0 8px 24px rgba(0, 165, 160, 0.3);
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.balance-title {
  font-size: 14px;
  opacity: 0.9;
}

.balance-month {
  font-size: 12px;
  opacity: 0.8;
}

.balance-amount {
  margin-bottom: 16px;
}

.currency {
  font-size: 18px;
}

.amount {
  font-size: 32px;
  font-weight: 700;
}

.balance-detail {
  display: flex;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-item {
  flex: 1;
  text-align: center;
}

.detail-label {
  font-size: 12px;
  opacity: 0.8;
  display: block;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
}

.detail-value.expense {
  color: #FFB6C1;
}

.detail-value.income {
  color: #B7EB8F;
}

.divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}

/* 通用区块 */
.section {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.section-more {
  font-size: 12px;
  color: #8C8C8C;
}

/* 账目列表 */
.record-list {
  margin-top: 8px;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F5F5F5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
}

.record-info {
  flex: 1;
}

.record-category {
  font-size: 14px;
  color: #262626;
  display: block;
}

.record-note {
  font-size: 12px;
  color: #8C8C8C;
  margin-top: 2px;
  display: block;
}

.record-amount {
  font-size: 14px;
  font-weight: 500;
}

.amount-text.expense {
  color: #FF4D4F;
}

.amount-text.income {
  color: #52C41A;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 32px 0;
}

.empty-text {
  display: block;
  font-size: 14px;
  color: #8C8C8C;
}

.empty-hint {
  display: block;
  font-size: 12px;
  color: #BFBFBF;
  margin-top: 8px;
}

/* 快捷分类 */
.quick-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-category {
  width: calc(16.66% - 10px);
  text-align: center;
}

.category-icon {
  width: 48px;
  height: 48px;
  background: #F5F5F5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 8px;
}

.category-icon.add {
  font-size: 24px;
  color: #8C8C8C;
  background: #F5F5F5;
}

.category-name {
  font-size: 12px;
  color: #595959;
}
</style>
