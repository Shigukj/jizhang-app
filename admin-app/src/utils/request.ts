import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

const BASE_URL = '/api/v1'

// Token 管理
const TOKEN_KEY = 'admin_token'

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// 创建 axios 实例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

export default request
