<template>
  <div class="users-page">
    <h2 class="page-title">👥 用户管理</h2>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索用户名/手机号"
        style="width: 300px"
        @search="handleSearch"
      />
      <a-select
        v-model:value="statusFilter"
        style="width: 120px; margin-left: 16px"
        placeholder="状态"
        allowClear
        @change="handleSearch"
      >
        <a-select-option :value="1">正常</a-select-option>
        <a-select-option :value="0">禁用</a-select-option>
      </a-select>
    </div>

    <!-- 用户列表 -->
    <a-table
      :columns="columns"
      :data-source="userList"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '正常' : '已禁用' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="showUserDetail(record)">查看</a-button>
          <a-popconfirm
            :title="record.status === 1 ? '确定要禁用该用户吗？' : '确定要启用该用户吗？'"
            @confirm="toggleUserStatus(record)"
          >
            <a-button type="link" :style="{ color: record.status === 1 ? '#FF4D4F' : '#52C41A' }">
              {{ record.status === 1 ? '禁用' : '启用' }}
            </a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <!-- 用户详情弹窗 -->
    <a-modal
      v-model:open="detailVisible"
      title="用户详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions :column="2" bordered v-if="currentUser">
        <a-descriptions-item label="用户ID">{{ currentUser.id }}</a-descriptions-item>
        <a-descriptions-item label="昵称">{{ currentUser.username }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ currentUser.phone }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="currentUser.status === 1 ? 'green' : 'red'">
            {{ currentUser.status === 1 ? '正常' : '已禁用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="注册时间">{{ currentUser.created_at }}</a-descriptions-item>
        <a-descriptions-item label="记账天数">{{ currentUser.record_days || 0 }} 天</a-descriptions-item>
        <a-descriptions-item label="账目数量">{{ currentUser.record_count || 0 }} 条</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref<number | undefined>()
const detailVisible = ref(false)
const currentUser = ref<any>(null)

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const columns = [
  { title: '用户ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '昵称', dataIndex: 'username', key: 'username' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '注册时间', dataIndex: 'created_at', key: 'created_at', width: 180 },
  { title: '操作', key: 'action', width: 150 }
]

const userList = ref([
  { key: '1', id: 1001, username: '张三', phone: '138****8888', status: 1, created_at: '2025-01-15 10:30:25' },
  { key: '2', id: 1002, username: '李四', phone: '139****6666', status: 1, created_at: '2025-01-20 14:20:10' },
  { key: '3', id: 1003, username: '王五', phone: '137****5555', status: 0, created_at: '2025-02-01 09:15:32' },
  { key: '4', id: 1004, username: '赵六', phone: '136****4444', status: 1, created_at: '2025-02-10 16:45:00' },
  { key: '5', id: 1005, username: '钱七', phone: '135****3333', status: 1, created_at: '2025-02-15 11:30:15' }
])

pagination.total = 12580

const handleSearch = () => {
  pagination.current = 1
  // 实际项目中调用 API
  message.info('搜索功能开发中')
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const showUserDetail = (user: any) => {
  currentUser.value = user
  detailVisible.value = true
}

const toggleUserStatus = async (user: any) => {
  // 实际项目中调用 API
  user.status = user.status === 1 ? 0 : 1
  message.success(`已${user.status === 1 ? '启用' : '禁用'}用户`)
}

onMounted(() => {
  // 加载数据
})
</script>

<style scoped>
.users-page {
  padding: 0;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #262626;
}

.search-bar {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
</style>
