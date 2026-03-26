<template>
  <view class="page-container">
    <!-- 时间筛选 -->
    <view class="time-tabs">
      <view 
        v-for="tab in timeTabs" 
        :key="tab.value"
        :class="['tab-item', activeTab === tab.value ? 'active' : '']"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 收支概览卡片 -->
    <view class="summary-card">
      <view class="summary-row">
        <view class="summary-item">
          <text class="summary-label">支出</text>
          <text class="summary-value expense">¥{{ formatAmount(statistics.expense) }}</text>
          <text :class="['summary-change', expenseChangeClass]">
            {{ expenseChangeText }}
          </text>
        </view>
        <view class="summary-divider"></view>
        <view class="summary-item">
          <text class="summary-label">收入</text>
          <text class="summary-value income">¥{{ formatAmount(statistics.income) }}</text>
          <text :class="['summary-change', incomeChangeClass]">
            {{ incomeChangeText }}
          </text>
        </view>
      </view>
      <view class="summary-balance">
        <text class="balance-label">结余</text>
        <text class="balance-value">¥{{ formatAmount(statistics.balance) }}</text>
      </view>
    </view>

    <!-- 支出分类占比 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">支出分类</text>
      </view>

      <view class="category-list" v-if="categoryStats.length > 0">
        <view 
          class="category-bar" 
          v-for="(item, index) in categoryStats" 
          :key="item.id"
        >
          <view class="bar-header">
            <text class="bar-icon">{{ item.icon }}</text>
            <text class="bar-name">{{ item.name }}</text>
            <text class="bar-percent">{{ item.percentage }}%</text>
            <text class="bar-amount">¥{{ formatAmount(item.total) }}</text>
          </view>
          <view class="bar-track">
            <view 
              class="bar-fill" 
              :style="{ 
                width: item.percentage + '%',
                backgroundColor: item.color || getCategoryColor(index)
              }"
            ></view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <text>暂无数据</text>
      </view>
    </view>

    <!-- 收入分类占比 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">收入分类</text>
      </view>

      <view class="category-list" v-if="incomeStats.length > 0">
        <view 
          class="category-bar" 
          v-for="(item, index) in incomeStats" 
          :key="item.id"
        >
          <view class="bar-header">
            <text class="bar-icon">{{ item.icon }}</text>
            <text class="bar-name">{{ item.name }}</text>
            <text class="bar-percent">{{ item.percentage }}%</text>
            <text class="bar-amount">¥{{ formatAmount(item.total) }}</text>
          </view>
          <view class="bar-track">
            <view 
              class="bar-fill income" 
              :style="{ width: item.percentage + '%' }"
            ></view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <text>暂无数据</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMonthlySummary, getCategoryStatistics } from '@/api/statistics'
import { useUserStore } from '../../stores/user'
import dayjs from 'dayjs'

const userStore = useUserStore()

// 时间选项
const timeTabs = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' }
]

const activeTab = ref('month')

// 数据
const statistics = ref({ expense: 0, income: 0, balance: 0 })
const comparison = ref({ expenseChange: 0, incomeChange: 0 })
const categoryStats = ref([])
const incomeStats = ref([])

// 计算属性
const expenseChangeText = computed(() => {
  const change = comparison.value.expenseChange
  if (change > 0) return `↑${change}%`
  if (change < 0) return `↓${Math.abs(change)}%`
  return '持平'
})

const expenseChangeClass = computed(() => {
  const change = comparison.value.expenseChange
  return change > 0 ? 'increase' : change < 0 ? 'decrease' : ''
})

const incomeChangeText = computed(() => {
  const change = comparison.value.incomeChange
  if (change > 0) return `↑${change}%`
  if (change < 0) return `↓${Math.abs(change)}%`
  return '持平'
})

const incomeChangeClass = computed(() => {
  const change = comparison.value.incomeChange
  return change > 0 ? 'increase' : change < 0 ? 'decrease' : ''
})

// 方法
const formatAmount = (amount) => {
  return Number(amount || 0).toFixed(2)
}

const getCategoryColor = (index) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#DDA0DD', '#87CEEB']
  return colors[index % colors.length]
}

// 切换时间
const switchTab = (value) => {
  activeTab.value = value
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    // 获取月度概览
    const summaryRes = await getMonthlySummary()
    statistics.value = summaryRes.current
    comparison.value = summaryRes.comparison

    // 获取分类统计
    const expenseRes = await getCategoryStatistics({ type: 'expense' })
    categoryStats.value = expenseRes.statistics || []

    const incomeRes = await getCategoryStatistics({ type: 'income' })
    incomeStats.value = incomeRes.statistics || []
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 页面显示
onShow(() => {
  if (userStore.isLoggedIn) {
    loadData()
  }
})

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

/* 时间筛选 */
.time-tabs {
  display: flex;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  color: #8C8C8C;
  border-radius: 6px;
  transition: all 0.2s;
}

.tab-item.active {
  background: #00A5A0;
  color: #FFFFFF;
}

/* 收支概览 */
.summary-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  margin-bottom: 16px;
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-label {
  font-size: 12px;
  color: #8C8C8C;
  display: block;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.summary-value.expense {
  color: #FF4D4F;
}

.summary-value.income {
  color: #52C41A;
}

.summary-change {
  font-size: 12px;
}

.summary-change.increase {
  color: #FF4D4F;
}

.summary-change.decrease {
  color: #52C41A;
}

.summary-divider {
  width: 1px;
  background: #E8E8E8;
  margin: 0 16px;
}

.summary-balance {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #E8E8E8;
}

.balance-label {
  font-size: 12px;
  color: #8C8C8C;
  margin-right: 8px;
}

.balance-value {
  font-size: 18px;
  font-weight: 600;
  color: #00A5A0;
}

/* 分类列表 */
.section {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.category-list {
  margin-top: 8px;
}

.category-bar {
  margin-bottom: 16px;
}

.category-bar:last-child {
  margin-bottom: 0;
}

.bar-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.bar-icon {
  font-size: 18px;
  margin-right: 8px;
}

.bar-name {
  flex: 1;
  font-size: 14px;
  color: #262626;
}

.bar-percent {
  font-size: 12px;
  color: #8C8C8C;
  margin-right: 8px;
}

.bar-amount {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.bar-track {
  height: 6px;
  background: #F5F5F5;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #FF6B6B;
  border-radius: 3px;
  transition: width 0.3s;
}

.bar-fill.income {
  background: #52C41A;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 32px;
  color: #8C8C8C;
  font-size: 14px;
}
</style>
