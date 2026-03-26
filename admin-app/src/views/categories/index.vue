<template>
  <div class="categories-page">
    <h2 class="page-title">📁 分类管理</h2>

    <a-row :gutter="24">
      <!-- 支出分类 -->
      <a-col :span="12">
        <a-card title="支出分类" :bordered="false">
          <a-list :data-source="expenseCategories" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.icon">
                  <template #title>{{ item.name }}</template>
                </a-list-item-meta>
                <template #actions>
                  <a-button type="link" size="small">编辑</a-button>
                  <a-button type="link" size="small" danger>删除</a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- 收入分类 -->
      <a-col :span="12">
        <a-card title="收入分类" :bordered="false">
          <a-list :data-source="incomeCategories" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.icon">
                  <template #title>{{ item.name }}</template>
                </a-list-item-meta>
                <template #actions>
                  <a-button type="link" size="small">编辑</a-button>
                  <a-button type="link" size="small" danger>删除</a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const expenseCategories = ref([
  { id: 1, name: '餐饮', icon: '🍔' },
  { id: 2, name: '交通', icon: '🚗' },
  { id: 3, name: '购物', icon: '🛒' },
  { id: 4, name: '住房', icon: '🏠' },
  { id: 5, name: '娱乐', icon: '🎮' },
  { id: 6, name: '通讯', icon: '📱' },
  { id: 7, name: '医疗', icon: '🏥' },
  { id: 8, name: '教育', icon: '📚' }
])

const incomeCategories = ref([
  { id: 1, name: '工资', icon: '💰' },
  { id: 2, name: '兼职', icon: '💼' },
  { id: 3, name: '投资', icon: '📈' },
  { id: 4, name: '理财', icon: '🏦' },
  { id: 5, name: '礼金', icon: '🧧' },
  { id: 6, name: '退款', icon: '↩️' },
  { id: 7, name: '其他', icon: '💵' }
])
</script>

<style scoped>
.categories-page {
  padding: 0;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #262626;
}
</style>
