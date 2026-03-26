import { get } from '../utils/request'

// 获取首页数据
export const getHomeData = () => {
  return get('/statistics/home')
}

// 获取月度概览
export const getMonthlySummary = (params) => {
  return get('/statistics/monthly', params)
}

// 获取分类统计
export const getCategoryStatistics = (params) => {
  return get('/statistics/categories', params)
}

// 获取趋势数据
export const getTrendStatistics = (params) => {
  return get('/statistics/trends', params)
}
