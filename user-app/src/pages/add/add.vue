<template>
  <view class="page-container">
    <!-- 类型切换 -->
    <view class="type-switch">
      <view 
        :class="['type-btn', type === 'expense' ? 'expense active' : '']"
        @click="switchType('expense')"
      >
        支出
      </view>
      <view 
        :class="['type-btn', type === 'income' ? 'income active' : '']"
        @click="switchType('income')"
      >
        收入
      </view>
    </view>

    <!-- 金额输入 -->
    <view class="amount-section">
      <text class="currency">¥</text>
      <input 
        class="amount-input"
        type="digit"
        v-model="amount"
        placeholder="0.00"
        :maxlength="10"
      />
    </view>

    <!-- 分类选择 -->
    <view class="category-section">
      <text class="section-title">选择分类</text>
      <view class="category-grid">
        <view 
          v-for="category in filteredCategories" 
          :key="category.id"
          :class="['category-item', selectedCategoryId === category.id ? 'selected' : '']"
          @click="selectCategory(category)"
        >
          <view class="category-icon">{{ category.icon }}</view>
          <text class="category-name">{{ category.name }}</text>
        </view>
      </view>
    </view>

    <!-- 扩展选项 -->
    <view class="options-section">
      <view class="option-item" @click="showDatePicker = true">
        <text class="option-label">📅 日期</text>
        <view class="option-value">
          <text>{{ formatDisplayDate(recordDate) }}</text>
          <text class="arrow">></text>
        </view>
      </view>

      <view class="option-item">
        <text class="option-label">📝 备注</text>
        <input 
          class="option-input"
          v-model="note"
          placeholder="添加备注（可选）"
          maxlength="100"
        />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-section">
      <button class="save-btn" :disabled="!canSave || saving" @click="saveRecord">
        {{ saving ? '保存中...' : '保 存' }}
      </button>
    </view>

    <!-- 日期选择器 -->
    <wd-datetime-picker 
      v-model="showDatePicker"
      type="date"
      :max-date="new Date()"
      @confirm="onDateConfirm"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCategories } from '@/api/category'
import { createRecord } from '@/api/record'
import dayjs from 'dayjs'

// 表单数据
const type = ref('expense')
const amount = ref('')
const note = ref('')
const recordDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedCategoryId = ref(null)
const saving = ref(false)
const showDatePicker = ref(false)

// 分类数据
const categories = ref([])

// 筛选后的分类
const filteredCategories = computed(() => {
  return categories.value.filter(c => c.type === type.value)
})

// 是否可保存
const canSave = computed(() => {
  return selectedCategoryId.value && amount.value && parseFloat(amount.value) > 0
})

// 切换类型
const switchType = (newType) => {
  type.value = newType
  selectedCategoryId.value = null
}

// 选择分类
const selectCategory = (category) => {
  selectedCategoryId.value = category.id
}

// 格式化日期显示
const formatDisplayDate = (date) => {
  const d = dayjs(date)
  const today = dayjs()
  if (d.isSame(today, 'day')) return '今天'
  if (d.isSame(today.subtract(1, 'day'), 'day')) return '昨天'
  return d.format('MM月DD日')
}

// 日期选择确认
const onDateConfirm = (value) => {
  recordDate.value = dayjs(value).format('YYYY-MM-DD')
  showDatePicker.value = false
}

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.categories || []
    
    // 默认选中第一个分类
    if (filteredCategories.value.length > 0) {
      selectedCategoryId.value = filteredCategories.value[0].id
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 保存账目
const saveRecord = async () => {
  if (!canSave.value || saving.value) return
  
  saving.value = true
  try {
    await createRecord({
      type: type.value,
      amount: parseFloat(amount.value),
      category_id: selectedCategoryId.value,
      note: note.value,
      record_date: recordDate.value
    })
    
    uni.showToast({ title: '记账成功', icon: 'success' })
    
    // 重置表单
    amount.value = ''
    note.value = ''
    
    // 延迟跳转首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (error) {
    uni.showToast({ title: error.message || '保存失败', icon: 'none' })
  } finally {
    saving.value = false
  }
}

// 页面加载
onLoad((options) => {
  loadCategories()
  
  // 处理快捷记账传参
  if (options.categoryId) {
    selectedCategoryId.value = parseInt(options.categoryId)
  }
  if (options.type) {
    type.value = options.type
  }
})

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 16px;
  padding-bottom: 120px;
  background: #F5F5F5;
}

/* 类型切换 */
.type-switch {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.type-btn {
  width: 80px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 18px;
  font-size: 14px;
  background: #F5F5F5;
  color: #8C8C8C;
  transition: all 0.3s;
}

.type-btn.expense.active {
  background: #FFF1F0;
  color: #FF4D4F;
  border: 1px solid #FF4D4F;
}

.type-btn.income.active {
  background: #F6FFED;
  color: #52C41A;
  border: 1px solid #52C41A;
}

/* 金额输入 */
.amount-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  margin-bottom: 16px;
}

.currency {
  font-size: 24px;
  color: #262626;
  margin-right: 8px;
}

.amount-input {
  font-size: 48px;
  font-weight: 700;
  color: #262626;
  text-align: center;
  flex: 1;
  max-width: 200px;
}

/* 分类选择 */
.category-section {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 12px;
  display: block;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-item {
  width: calc(25% - 9px);
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.category-item.selected {
  background: #E6F7F6;
  border-color: #00A5A0;
}

.category-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.category-name {
  font-size: 12px;
  color: #595959;
}

/* 扩展选项 */
.options-section {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F5F5F5;
}

.option-item:last-child {
  border-bottom: none;
}

.option-label {
  font-size: 14px;
  color: #262626;
  width: 80px;
}

.option-value {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #8C8C8C;
}

.option-input {
  flex: 1;
  font-size: 14px;
  text-align: right;
}

.arrow {
  margin-left: 8px;
  color: #C0C0C0;
}

/* 保存按钮 */
.save-section {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.save-btn {
  width: 100%;
  height: 48px;
  background: #00A5A0;
  border-radius: 24px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  border: none;
}

.save-btn[disabled] {
  background: #C0C0C0;
}
</style>
