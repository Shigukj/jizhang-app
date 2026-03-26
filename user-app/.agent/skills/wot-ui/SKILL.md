---
name: wot-ui
description: wot-design-uni 组件库使用指南
version: "1.0.0"
type: skill
tags: [wot-ui, uni-app, components, vue3]
---

# Wot Design Uni 组件库开发指南

## 基础配置

项目已在 pages.json 中配置 easycom：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue"
    }
  }
}
```

## 常用组件

### Button 按钮
```vue
<wd-button type="primary">主要按钮</wd-button>
```

### Input 输入框
```vue
<wd-input v-model="value" placeholder="请输入内容" />
```

### Toast 轻提示
```javascript
import { showToast } from 'wot-design-uni'
showToast({ title: '操作成功', icon: 'success' })
```

### Loading 加载
```javascript
import { showLoading, hideLoading } from 'wot-design-uni'
showLoading({ title: '加载中...' })
hideLoading()
```

详见组件库文档：https://wot-design-uni.netlify.app/
