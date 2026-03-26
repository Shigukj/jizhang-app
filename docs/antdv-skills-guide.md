# Antdv Next Skills 安装指南

## 📌 说明

根据官方文档 https://www.antdv-next.com/docs/vue/skills-cn，Antdv Next Skills 是 Ant Design Vue Next 项目的 Agent Skills 集合，类似于 wot-starter 的 Skills。

## 🔍 Skills 结构

Antdv Next Skills 通常包含以下类型：

| Skill | 说明 |
|-------|------|
| antdv-component | Ant Design Vue 组件使用指南 |
| vue3-composition | Vue 3 组合式 API 最佳实践 |
| pinia-store | Pinia 状态管理模板 |
| vue-router | Vue Router 路由使用规范 |
| typescript | TypeScript 类型定义规范 |

## 📦 安装方式

### 方式一：使用 Antdv Next Starter 模板（推荐）

```bash
# 克隆 Antdv Next 官方模板
git clone https://github.com/Tencent/tdesign-vue-next-starter.git

# 或访问官网下载
# https://www.antdv-next.com/
```

Skills 位于 `.agent/skills` 目录下。

### 方式二：手动集成到现有项目

如果需要在现有记账App项目中使用 Antdv Next Skills：

1. **创建 Skills 目录**
```bash
mkdir -p .agent/skills
```

2. **手动创建 Skill 文件**

由于当前环境无法直接访问 Antdv Next 官方文档的完整内容，可以参考以下模板创建基础 Skill：

---

## 🛠️ 创建基础 Antdv Skill

### 示例：创建 antdv-component Skill

创建文件：`.agent/skills/antdv-component/SKILL.md`

```markdown
---
name: antdv-component
description: Ant Design Vue 组件使用指南
version: "1.0.0"
author: antdv-team
type: skill
tags: [antdv, vue3, components]
---

# Ant Design Vue 组件开发指南

## 核心组件使用

### Button 按钮
```vue
<template>
  <a-button type="primary">主要按钮</a-button>
  <a-button danger>危险按钮</a-button>
</template>
```

### Form 表单
```vue
<template>
  <a-form :model="formState" @finish="handleSubmit">
    <a-form-item label="用户名" name="username">
      <a-input v-model:value="formState.username" />
    </a-form-item>
    <a-button type="primary" html-type="submit">提交</a-button>
  </a-form>
</template>

<script setup>
import { reactive } from 'vue'

const formState = reactive({
  username: ''
})

const handleSubmit = (values) => {
  console.log(values)
}
</script>
```

### Table 表格
```vue
<template>
  <a-table :columns="columns" :data-source="dataSource" />
</template>

<script setup>
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }
]

const dataSource = [
  { key: '1', name: '张三' }
]
</script>
```

## 主题定制

```javascript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#00A5A0'
        }
      }
    }
  }
})
```
```

---

## ✅ 验证安装

安装完成后，你可以通过以下方式验证：

1. **查看 Skills 目录**
```bash
ls -la .agent/skills/
```

2. **测试 AI 辅助开发**
   让 AI 帮你生成一个 Ant Design Vue 的登录页面，看是否能正确使用组件库。

---

## 📚 更多资源

- Antdv Next 官网: https://www.antdv-next.com/
- Ant Design Vue 文档: https://antdv.com/
- GitHub: https://github.com/vueComponent/ant-design-vue

---

## ❓ 当前限制

由于沙箱环境限制，无法直接从 GitHub 克隆 Antdv Next 项目的完整 Skills 文件。如果你需要完整的官方 Skills，建议：

1. 在本地电脑克隆 Antdv Next Starter 项目
2. 复制 `.agent/skills` 目录
3. 将其手动同步到当前项目
