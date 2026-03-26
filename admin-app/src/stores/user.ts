import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getCurrentUser } from '@/api/auth'
import { setToken, getToken, removeToken } from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const userInfo = ref<any>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(phone: string, password: string) {
    const res: any = await loginApi({ phone, password })
    token.value = res.token
    userInfo.value = res.user
    setToken(res.token)
    return res
  }

  async function fetchUserInfo() {
    const res: any = await getCurrentUser()
    userInfo.value = res.user
    return res.user
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    fetchUserInfo,
    logout
  }
})
