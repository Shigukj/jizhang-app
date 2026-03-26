---
name: uni-page-generator
description: 快速创建符合项目规范的 uni-app 页面
version: "1.0.0"
type: skill
tags: [uni-app, pages, generator]
---

# Uni-app 页面生成器

## 页面模板

```vue
<template>
  <view class="page-container">
    <view class="page-header">
      <text class="page-title">页面标题</text>
    </view>
    <view class="page-content">
      <!-- 内容 -->
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('页面加载')
})
</script>

<style scoped>
.page-container { min-height: 100vh; background: #f5f5f5; }
.page-header { padding: 20rpx; background: #fff; }
.page-title { font-size: 32rpx; font-weight: 600; }
.page-content { padding: 20rpx; }
</style>
```

## 路由跳转

```javascript
// 保留当前页
uni.navigateTo({ url: '/pages/detail/index?id=123' })

// 关闭当前页
uni.redirectTo({ url: '/pages/login/index' })

// 切换 tabbar
uni.switchTab({ url: '/pages/index/index' })
```

## pages.json 配置

```json
{
  "pages": [
    {
      "path": "pages/newpage/index",
      "style": {
        "navigationBarTitleText": "新页面",
        "navigationBarBackgroundColor": "#00A5A0",
        "navigationBarTextStyle": "white"
      }
    }
  ]
}
```
