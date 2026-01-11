import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import * as authService from '@/api/auth'
import { getAuthToken } from '@/api/index'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  
  // Initialize user from local token if available
  async function initAuth() {
    // Skip if no token exists
    const token = getAuthToken()
    if (!token) {
      console.log('🔐 Auth: No token found, skipping init')
      initialized.value = true
      return
    }

    console.log('🔐 Auth: Token found, initializing user...')
    loading.value = true
    
    try {
      const result = await authService.getCurrentUser()
      console.log('🔐 Auth: getCurrentUser result:', result.success)
      
      if (result.success && result.data) {
        currentUser.value = result.data
        console.log('🔐 Auth: User loaded:', result.data.email)
      } else {
        console.log('🔐 Auth: getCurrentUser failed, clearing token')
        authService.logout()
        currentUser.value = null
      }
    } catch (err) {
      console.error('🔐 Auth: Error during init:', err)
      currentUser.value = null
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  const isAuthenticated = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.isAdmin === true)
  const isVerified = computed(() => currentUser.value?.status === 'verified')

  async function login(request: authService.LoginRequest): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const result = await authService.login(request)
      if (result.success && result.data) {
        currentUser.value = result.data.user
        return true
      } else {
        error.value = result.error || 'Login failed'
        return false
      }
    } catch (err) {
      error.value = 'An unexpected error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(request: authService.RegisterRequest): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const result = await authService.register(request)
      if (result.success && result.data) {
        currentUser.value = result.data.user
        return true
      } else {
        error.value = result.error || 'Registration failed'
        return false
      }
    } catch (err) {
      error.value = 'An unexpected error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    currentUser.value = null
  }

  async function updateProfile(handle: string) {
    if (!currentUser.value) return
    
    try {
      const result = await authService.updateProfile({ handle })
      if (result.success && result.data) {
        currentUser.value = result.data
      }
    } catch (err) {
      console.error('Failed to update profile', err)
    }
  }

  // Call init on store creation
  initAuth()

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isVerified,
    loading,
    error,
    initialized,
    login,
    register,
    logout,
    updateProfile,
    initAuth
  }
})

