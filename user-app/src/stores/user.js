import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  login as loginApi, 
  register as registerApi, 
  getCurrentUser 
} from '../api/auth'
import { setToken, getToken, removeToken, setUser, getUser, removeUser } from '../utils/request'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(getToken() || '')
  const userInfo = ref(getUser() || null)
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  
  // 登录
  async function login(phone, password) {
    try {
      const res = await loginApi({ phone, password })
      token.value = res.token
      userInfo.value = res.user
      setToken(res.token)
      setUser(res.user)
      return res
    } catch (error) {
      throw error
    }
  }
  
  // 注册
  async function register(phone, password, username) {
    try {
      const res = await registerApi({ phone, password, username })
      token.value = res.token
      userInfo.value = res.user
      setToken(res.token)
      setUser(res.user)
      return res
    } catch (error) {
      throw error
    }
  }
  
  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const res = await getCurrentUser()
      userInfo.value = res.user
      setUser(res.user)
      return res.user
    } catch (error) {
      throw error
    }
  }
  
  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
    removeUser()
  }
  
  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    register,
    fetchUserInfo,
    logout
  }
})
