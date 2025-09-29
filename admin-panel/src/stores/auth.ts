import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { apiService } from '@/services/api'
import type { User, LoginCredentials } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'user')

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.login(credentials)
      
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        return { success: true }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      await apiService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      error.value = null
      isLoading.value = false
    }
  }

  const initializeAuth = async () => {
    const storedToken = localStorage.getItem('auth_token')
    if (!storedToken) return

    token.value = storedToken
    isLoading.value = true
    
    try {
      const response = await apiService.getCurrentUser()
      
      if (response.success && response.data) {
        user.value = response.data.user
      } else {
        // Invalid token, clear it
        logout()
      }
    } catch (err) {
      console.error('Auth initialization failed:', err)
      logout()
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    address: string
    role?: 'ADMIN' | 'USER' | 'MODERATOR'
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.register(userData)
      
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        return { success: true }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const hasRole = (role: string) => {
    return userRole.value.toLowerCase() === role.toLowerCase()
  }

  const isAdmin = computed(() => hasRole('admin'))
  const isModerator = computed(() => hasRole('moderator') || hasRole('admin'))

  return {
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,
    userRole,
    isAdmin,
    isModerator,
    login,
    logout,
    initializeAuth,
    register,
    hasRole
  }
})
