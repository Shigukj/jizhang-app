import { post, get, put } from '../utils/request'

// 用户注册
export const register = (data) => {
  return post('/auth/register', data)
}

// 用户登录
export const login = (data) => {
  return post('/auth/login', data)
}

// 获取当前用户信息
export const getCurrentUser = () => {
  return get('/auth/me')
}

// 更新用户信息
export const updateProfile = (data) => {
  return put('/auth/profile', data)
}
