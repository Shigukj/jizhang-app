---
name: global-feedback
description: 全局反馈组件使用指南，统一 Toast、Message 和 Loading 的使用规范
version: "1.0.0"
type: skill
tags: [feedback, toast, loading, message, wot-ui]
---

# 全局反馈组件使用指南

统一项目中的交互反馈，确保 Toast、Message 和 Loading 的使用符合设计规范。

## Toast 轻提示

用于操作成功或失败的短暂提示。

### 基础用法

```javascript
import { showToast } from 'wot-design-uni'

// 成功提示
showToast({
  title: '操作成功',
  icon: 'success'
})

// 失败提示
showToast({
  title: '操作失败',
  icon: 'error'
})

// 加载提示
showToast({
  title: '加载中...',
  loading: true
})

// 普通提示
showToast({
  title: '这是一条提示'
})
```

### 使用场景

- 表单提交成功/失败
- 数据加载成功/失败
- 操作完成反馈

## Loading 加载

用于页面或数据加载时的状态展示。

### 全局 Loading

```javascript
import { showLoading, hideLoading } from 'wot-design-uni'

// 显示加载
showLoading({
  title: '加载中...'
})

// 隐藏加载
hideLoading()

// 带自动隐藏
showLoading({
  title: '加载中...',
  duration: 3000
})
```

### 使用场景

- 页面初始化加载
- API 请求等待
- 表单提交等待

### 注意事项

- 显示 Loading 后必须调用 hideLoading 隐藏
- 建议在 try-finally 中使用，确保异常时也能隐藏
- 不建议嵌套使用多个 Loading

## Modal 弹窗

用于重要操作确认或信息展示。

```javascript
import { showConfirmDialog } from 'wot-design-uni'

// 确认对话框
showConfirmDialog({
  title: '提示',
  msg: '确定要删除吗？',
  showCancelButton: true
}).then(() => {
  // 确认操作
}).catch(() => {
  // 取消操作
})

// 成功对话框
showConfirmDialog({
  title: '成功',
  msg: '操作成功！',
  showCancelButton: false,
  confirmButtonText: '知道了'
})
```

### 使用场景

- 删除确认
- 重要操作确认
- 系统通知

## ActionSheet 动作面板

用于从底部弹出的操作菜单。

```javascript
import { showActionSheet } from 'wot-design-uni'

showActionSheet({
  itemList: ['拍照', '从相册选择']
}).then(({ item, index }) => {
  console.log('选择了：', item, index)
}).catch(() => {
  // 取消选择
})
```

### 使用场景

- 图片选择方式
- 多操作选择
- 菜单入口

## 统一工具函数封装

在 `src/utils/feedback.js` 中创建统一封装：

```javascript
import { showToast, showLoading, hideLoading, showConfirmDialog } from 'wot-design-uni'

/**
 * 显示成功提示
 * @param {string} message - 提示信息
 */
export function showSuccess(message) {
  showToast({
    title: message,
    icon: 'success'
  })
}

/**
 * 显示错误提示
 * @param {string} message - 提示信息
 */
export function showError(message) {
  showToast({
    title: message,
    icon: 'error'
  })
}

/**
 * 显示加载
 * @param {string} message - 加载文字
 */
export function showPageLoading(message = '加载中...') {
  showLoading({
    title: message
  })
}

/**
 * 隐藏加载
 */
export function hidePageLoading() {
  hideLoading()
}

/**
 * 确认对话框
 * @param {string} message - 提示信息
 * @param {Function} onConfirm - 确认回调
 */
export function confirm(message, onConfirm) {
  showConfirmDialog({
    title: '提示',
    msg: message,
    showCancelButton: true
  }).then(() => {
    onConfirm && onConfirm()
  })
}
```

### 使用封装后的工具

```javascript
import { showSuccess, showError, showPageLoading, hidePageLoading, confirm } from '@/utils/feedback'

// 显示成功
showSuccess('保存成功')

// 显示错误
showError('保存失败')

// 加载
showPageLoading('上传中...')
try {
  // API 调用
  await uploadData()
  showSuccess('上传成功')
} catch (error) {
  showError('上传失败')
} finally {
  hidePageLoading()
}

// 确认
confirm('确定要删除吗？', async () => {
  await deleteItem()
})
```

## 最佳实践

1. **统一封装**：使用统一的工具函数，避免直接调用组件 API
2. **成对出现**：Loading 的 show 和 hide 必须成对出现
3. **及时反馈**：所有操作都应给用户反馈
4. **简洁明确**：提示信息要简洁明了
5. **避免滥用**：不要过度使用反馈组件
