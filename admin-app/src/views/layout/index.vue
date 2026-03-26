<template>
  <a-layout class="layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="light"
      class="sider"
    >
      <div class="logo">
        <span v-if="!collapsed">💰 记账App</span>
        <span v-else>💰</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <DashboardOutlined />
          <span>Dashboard</span>
        </a-menu-item>
        <a-menu-item key="users">
          <UserOutlined />
          <span>用户管理</span>
        </a-menu-item>
        <a-menu-item key="records">
          <FileTextOutlined />
          <span>账目管理</span>
        </a-menu-item>
        <a-menu-item key="categories">
          <FolderOutlined />
          <span>分类管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 内容区 -->
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="header">
        <div class="header-left">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="collapsed = !collapsed"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="collapsed = !collapsed"
          />
        </div>
        <div class="header-right">
          <a-dropdown>
            <a class="user-info" @click.prevent>
              <a-avatar :style="{ backgroundColor: '#00A5A0' }">
                {{ userInfo?.username?.charAt(0)?.toUpperCase() || 'A' }}
              </a-avatar>
              <span class="username">{{ userInfo?.username || '管理员' }}</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])

const userInfo = computed(() => userStore.userInfo)

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(`/${key}`)
}

const handleLogout = () => {
  userStore.logout()
  message.success('已退出登录')
  router.push('/login')
}

onMounted(async () => {
  // 设置当前菜单
  const key = route.path.split('/')[1] || 'dashboard'
  selectedKeys.value = [key]

  // 获取用户信息
  if (userStore.isLoggedIn) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #00A5A0;
  border-bottom: 1px solid #f0f0f0;
}

.header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #00A5A0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  color: #262626;
}

.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 112px);
}
</style>
