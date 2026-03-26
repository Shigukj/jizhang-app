<template>
  <div class="dashboard">
    <h2 class="page-title">📊 Dashboard</h2>

    <!-- 数据卡片 -->
    <a-row :gutter="16" class="stats-row">
      <a-col :span="6">
        <a-card class="stats-card">
          <div class="stats-icon" style="background: #E6F7F6">
            <UserOutlined style="color: #00A5A0" />
          </div>
          <div class="stats-info">
            <p class="stats-label">总用户数</p>
            <p class="stats-value">{{ stats.totalUsers.toLocaleString() }}</p>
            <p class="stats-change increase">↑ {{ stats.userGrowth }}%</p>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stats-card">
          <div class="stats-icon" style="background: #FFF1F0">
            <FileTextOutlined style="color: #FF4D4F" />
          </div>
          <div class="stats-info">
            <p class="stats-label">今日记账</p>
            <p class="stats-value">{{ stats.todayRecords.toLocaleString() }}</p>
            <p class="stats-change increase">↑ {{ stats.recordGrowth }}%</p>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stats-card">
          <div class="stats-icon" style="background: #F6FFED">
            <DollarOutlined style="color: #52C41A" />
          </div>
          <div class="stats-info">
            <p class="stats-label">总交易额</p>
            <p class="stats-value">¥{{ formatAmount(stats.totalAmount) }}</p>
            <p class="stats-change increase">↑ {{ stats.amountGrowth }}%</p>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stats-card">
          <div class="stats-icon" style="background: #FFF7E6">
            <LineChartOutlined style="color: #FA8C16" />
          </div>
          <div class="stats-info">
            <p class="stats-label">日活用户</p>
            <p class="stats-value">{{ stats.activeUsers.toLocaleString() }}</p>
            <p class="stats-change increase">↑ {{ stats.activeGrowth }}%</p>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="16" class="charts-row">
      <a-col :span="16">
        <a-card title="📈 用户增长趋势" class="chart-card">
          <div class="chart-container">
            <v-chart :option="lineChartOption" autoresize />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="🥧 用户活跃度分布" class="chart-card">
          <div class="chart-container">
            <v-chart :option="pieChartOption" autoresize />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 今日账目流水 -->
    <a-card title="📋 今日账目流水" class="table-card">
      <template #extra>
        <a-button type="link">查看全部</a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="recordList"
        :pagination="false"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="record.type === 'expense' ? 'red' : 'green'">
              {{ record.type === 'expense' ? '支出' : '收入' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'amount'">
            <span :style="{ color: record.type === 'expense' ? '#FF4D4F' : '#52C41A' }">
              {{ record.type === 'expense' ? '-' : '+' }}¥{{ formatAmount(record.amount) }}
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { UserOutlined, FileTextOutlined, DollarOutlined, LineChartOutlined } from '@ant-design/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

// 模拟数据
const stats = reactive({
  totalUsers: 12580,
  userGrowth: 15,
  todayRecords: 1256,
  recordGrowth: 12,
  totalAmount: 2300000,
  amountGrowth: 8,
  activeUsers: 3420,
  activeGrowth: 23
})

const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toFixed(2)
}

// 折线图配置
const lineChartOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: { type: 'value' },
  series: [{
    name: '新增用户',
    type: 'line',
    smooth: true,
    data: [1200, 1800, 2400, 2800, 3200, 3800],
    itemStyle: { color: '#00A5A0' },
    areaStyle: { color: 'rgba(0, 165, 160, 0.1)' }
  }]
})

// 饼图配置
const pieChartOption = ref({
  tooltip: { trigger: 'item' },
  legend: { bottom: '5%', left: 'center' },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    data: [
      { value: 35, name: '高活跃', itemStyle: { color: '#52C41A' } },
      { value: 40, name: '中活跃', itemStyle: { color: '#FAAD14' } },
      { value: 25, name: '低活跃', itemStyle: { color: '#FF4D4F' } }
    ]
  }]
})

// 表格配置
const columns = [
  { title: '用户', dataIndex: 'username', key: 'username' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '金额', dataIndex: 'amount', key: 'amount' },
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '备注', dataIndex: 'note', key: 'note' }
]

const recordList = ref([
  { key: '1', username: '张**', type: 'expense', category: '餐饮', amount: 32, time: '12:30', note: '午餐' },
  { key: '2', username: '李**', type: 'income', category: '工资', amount: 8000, time: '10:00', note: '3月工资' },
  { key: '3', username: '王**', type: 'expense', category: '交通', amount: 15, time: '09:15', note: '打车' },
  { key: '4', username: '赵**', type: 'expense', category: '购物', amount: 299, time: '14:20', note: '衣服' },
  { key: '5', username: '钱**', type: 'expense', category: '娱乐', amount: 88, time: '20:00', note: '电影' }
])

onMounted(() => {
  // 可以在这里加载真实数据
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #262626;
}

.stats-row {
  margin-bottom: 24px;
}

.stats-card {
  border-radius: 8px;
}

.stats-card :deep(.ant-card-body) {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stats-info {
  flex: 1;
}

.stats-label {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.stats-change {
  font-size: 12px;
}

.stats-change.increase {
  color: #52C41A;
}

.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  border-radius: 8px;
}

.chart-container {
  height: 300px;
}

.table-card {
  border-radius: 8px;
}
</style>
