// API 基础配置
const BASE_URL = 'http://localhost:3000/api/v1'

// Token 管理
const TOKEN_KEY = 'jizhang_token'

export const setToken = (token) => {
  uni.setStorageSync(TOKEN_KEY, token)
}

export const getToken = () => {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY)
}

// 用户信息管理
const USER_KEY = 'jizhang_user'

export const setUser = (user) => {
  uni.setStorageSync(USER_KEY, JSON.stringify(user))
}

export const getUser = () => {
  const user = uni.getStorageSync(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const removeUser = () => {
  uni.removeStorageSync(USER_KEY)
}

// 请求封装
export const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = getToken()
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // Token 过期，跳转登录
          removeToken()
          removeUser()
          uni.reLaunch({ url: '/pages/login/login' })
          reject(new Error('请先登录'))
        } else {
          reject(new Error(res.data?.error || '请求失败'))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络错误'))
      }
    })
  })
}

// 快捷方法
export const get = (url, data) => request({ url, method: 'GET', data })
export const post = (url, data) => request({ url, method: 'POST', data })
export const put = (url, data) => request({ url, method: 'PUT', data })
export const del = (url, data) => request({ url, method: 'DELETE', data })

export default {
  request,
  get,
  post,
  put,
  del,
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  removeUser
}
