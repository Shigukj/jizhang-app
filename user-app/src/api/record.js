import { get, post, put, del } from '../utils/request'

// 创建账目
export const createRecord = (data) => {
  return post('/records', data)
}

// 获取账目列表
export const getRecords = (params) => {
  return get('/records', params)
}

// 获取今日账目
export const getTodayRecords = () => {
  return get('/records/today')
}

// 获取单条账目
export const getRecordById = (id) => {
  return get(`/records/${id}`)
}

// 更新账目
export const updateRecord = (id, data) => {
  return put(`/records/${id}`, data)
}

// 删除账目
export const deleteRecord = (id) => {
  return del(`/records/${id}`)
}
