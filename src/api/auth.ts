/**
 * Auth API Service
 */

import type { User } from '@/types'
import { apiClient, type ApiResponse, setAuthToken, removeAuthToken } from './index'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  uniId: number
}

export interface AuthResponse {
  user: User
  token: string
  requiresEmailOtp?: boolean
  message?: string
}

export interface VerifyOtpRequest {
  email: string
  code: string
}

export interface ResendOtpRequest {
  email: string
}

export async function login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const result = await apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(request)
  })

  if (result.success && result.data) {
    setAuthToken(result.data.token)
  }

  return result
}

export async function register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  const result = await apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(request)
  })

  // Don't set token yet if email verification is required
  if (result.success && result.data && result.data.token && !result.data.requiresEmailOtp) {
    setAuthToken(result.data.token)
  }

  return result
}

export async function logout(): Promise<ApiResponse<void>> {
  removeAuthToken()
  return { success: true }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient<User>('/auth/me')
}

export async function updateProfile(updates: { handle?: string, name?: string }): Promise<ApiResponse<User>> {
  return apiClient<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

/**
 * Verify email with OTP code
 */
export async function verifyEmailOtp(request: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> {
  const result = await apiClient<AuthResponse>('/auth/verify-email-otp', {
    method: 'POST',
    body: JSON.stringify(request)
  })

  if (result.success && result.data && result.data.token) {
    setAuthToken(result.data.token)
  }

  return result
}

/**
 * Resend OTP code
 */
export async function resendOtp(request: ResendOtpRequest): Promise<ApiResponse<{ message: string }>> {
  return apiClient<{ message: string }>('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify(request)
  })
}

/**
 * Forgot Password - Request OTP
 */
export async function forgotPassword(email: string): Promise<ApiResponse<{ message: string, expiresIn?: number }>> {
  return apiClient<{ message: string, expiresIn?: number }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
}

/**
 * Reset Password with OTP
 */
export async function resetPassword(email: string, code: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword })
  })
}

export async function deleteAccount(): Promise<ApiResponse<{ message: string }>> {
  const result = await apiClient<{ message: string }>('/auth/account', {
    method: 'DELETE'
  })
  
  // Remove token after successful deletion
  if (result.success) {
    removeAuthToken()
  }
  
  return result
}

export const authApi = {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  verifyEmailOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  deleteAccount
}
