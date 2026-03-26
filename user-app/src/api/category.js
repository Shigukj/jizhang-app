import { get, post, put, del } from '@/utils/request'

// 获取分类列表
export const getCategories = (params) => {
  return get('/categories', params)
}

// 创建分类
export const createCategory = (data) => {
  return post('/categories', data)
}

// 更新分类
export const updateCategory = (id, data) => {
  return put(`/categories/${id}`, data)
}

// 删除分类
export const deleteCategory = (id) => {
  return del(`/categories/${id}`)
}
