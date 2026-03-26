---
name: api-request
description: 统一的 API 请求封装和使用规范，基于项目中的 request 工具
version: "1.0.0"
type: skill
tags: [api, request, axios, uni-app]
---

# API 请求规范

项目使用统一的请求工具进行 API 调用，位于 `src/utils/request.js`。

## 请求工具

项目已封装的请求方法：

```javascript
import { get, post, put, del } from '@/utils/request'

// GET 请求
get('/api/path', { param1: 'value1' })

// POST 请求
post('/api/path', { data1: 'value1' })

// PUT 请求
put('/api/path', { data1: 'value1' })

// DELETE 请求
del('/api/path')
```

## API 模块结构

```
src/api/
├── auth.js        # 认证相关
├── category.js    # 分类相关
├── record.js      # 记录相关
└── statistics.js  # 统计相关
```

## 创建新的 API 模块

在 `src/api/` 中创建新文件：

```javascript
import { get, post, put, del } from '@/utils/request'

/**
 * 获取列表
 */
export function getList(params) {
  return get('/resources', params)
}

/**
 * 获取详情
 */
export function getDetail(id) {
  return get(`/resources/${id}`)
}

/**
 * 创建
 */
export function create(data) {
  return post('/resources', data)
}

/**
 * 更新
 */
export function update(id, data) {
  return put(`/resources/${id}`, data)
}

/**
 * 删除
 */
export function remove(id) {
  return del(`/resources/${id}`)
}
```

## 使用示例

```javascript
import { getList, create, update, remove } from '@/api/resource'

// 获取列表
const list = await getList({ page: 1, pageSize: 10 })

// 创建
const result = await create({ name: 'test' })

// 更新
const updated = await update(1, { name: 'updated' })

// 删除
await remove(1)
```

## 请求配置

### 基础配置

```javascript
// src/utils/request.js
const BASE_URL = 'http://localhost:3000/api/v1'
```

### Token 自动注入

请求工具会自动从存储中读取 Token 并添加到请求头：

```javascript
header: {
  'Authorization': `Bearer ${token}`
}
```

### 统一错误处理

- 401 错误：自动跳转登录页
- 其他错误：返回 Promise reject

## 完整示例：登录页面

```vue
<template>
  <view class="login-page">
    <wd-input
      v-model="phone"
      label="手机号"
      placeholder="请输入手机号"
    />
    <wd-input
      v-model="password"
      label="密码"
      type="password"
      placeholder="请输入密码"
    />
    <wd-button type="primary" @click="handleLogin">登录</wd-button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import { showSuccess, showError, showPageLoading, hidePageLoading } from '@/utils/feedback'

const phone = ref('')
const password = ref('')
const userStore = useUserStore()

const handleLogin = async () => {
  if (!phone.value || !password.value) {
    showError('请输入手机号和密码')
    return
  }

  showPageLoading('登录中...')
  try {
    const res = await login({
      phone: phone.value,
      password: password.value
    })
    
    // 保存用户信息
    await userStore.login(phone.value, password.value)
    
    showSuccess('登录成功')
    uni.switchTab({ url: '/pages/index/index' })
  } catch (error) {
    showError(error.message || '登录失败')
  } finally {
    hidePageLoading()
  }
}
</script>
```

## 命名规范

- API 文件名：小写字母 + 连字符（kebab-case）
- API 函数名：小驼峰（camelCase）
- RESTful 路径：小写字母 + 连字符

## 注意事项

1. **统一使用封装的请求工具**：不要直接使用 uni.request
2. **错误处理**：所有 API 调用都应使用 try-catch 包裹
3. **加载状态**：API 请求时显示 Loading，请求完成后隐藏
4. **参数校验**：发送请求前校验参数完整性
5. **RESTful 风格**：遵循 RESTful API 设计规范

## 当前项目 API 列表

| 文件 | 功能 |
|------|------|
| auth.js | 登录、注册、获取用户信息 |
| category.js | 分类的增删改查 |
| record.js | 记录的增删改查 |
| statistics.js | 统计数据查询 |

## 后端 API 地址

开发环境：`http://localhost:3000/api/v1`

API 前缀会自动处理，调用时只需传入相对路径。
