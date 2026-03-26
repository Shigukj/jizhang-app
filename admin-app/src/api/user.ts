import request from '@/utils/request'

// 获取用户列表
export function getUsers(params: { page?: number; limit?: number; keyword?: string; status?: number }) {
  return request.get('/users', { params })
}

// 更新用户状态
export function updateUserStatus(id: number, status: number) {
  return request.put(`/users/${id}/status`, { status })
}
