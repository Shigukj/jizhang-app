---
name: pinia-store-generator
description: 创建符合项目规范的 Pinia Store
version: "1.0.0"
type: skill
tags: [pinia, store, state-management]
---

# Pinia Store 生成器

## Store 模板

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStoreName = defineStore('storeName', () => {
  // State
  const stateValue = ref('')
  const items = ref([])

  // Getters
  const getterValue = computed(() => stateValue.value)

  // Actions
  function setStateValue(value) {
    stateValue.value = value
  }

  async function fetchData() {
    // API 调用
  }

  return {
    stateValue,
    items,
    getterValue,
    setStateValue,
    fetchData
  }
})
```

## 使用示例

```javascript
import { useStoreName } from '@/stores/storeName'

const store = useStoreName()
console.log(store.stateValue)
store.setStateValue('new value')
```
