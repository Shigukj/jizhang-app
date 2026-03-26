import request from '@/utils/request'

// 登录
export function login(data: { phone: string; password: string }) {
  return request.post('/auth/login', data)
}

// 获取当前用户信息
export function getCurrentUser() {
  return request.get('/auth/me')
}
