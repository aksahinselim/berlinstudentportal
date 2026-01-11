/**
 * API Client Configuration
 * 
 * Centralized API client using fetch to communicate with the Express backend.
 */

// API Base URL - Use relative path for nginx proxy, or fallback to env var for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('token', token)
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  localStorage.removeItem('token')
}

/**
 * HTTP Client wrapper
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Attach token if exists
    const token = getAuthToken()
    const headers = new Headers(options.headers || {})
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    // CRITICAL: Don't set Content-Type for FormData - browser will set it automatically with boundary
    const isFormData = options.body instanceof FormData
    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    
    // If FormData, delete any Content-Type header to let browser set it
    if (isFormData) {
      headers.delete('Content-Type')
    }

    const config: RequestInit = {
      ...options,
      headers
    }

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
    console.log(`   Token: ${token ? 'Present' : 'Missing'}`)
    if (isFormData) console.log('   Body: FormData')

    const response = await fetch(url, config)

    console.log(`📡 API Response: ${response.status} ${response.statusText}`)

    // Handle non-200 responses
    if (!response.ok) {
        // Try to parse error message from JSON
        const errorData = await response.json().catch(() => ({}))
        console.error(`❌ API Error:`, errorData)
        return { 
            success: false, 
            error: errorData.error || `HTTP Error: ${response.status} ${response.statusText}` 
        }
    }

    const data = await response.json()
    console.log(`✅ API Success:`, data.success ? 'true' : 'false')
    return data // Assuming backend returns { success: true, data: ... } structure directly
  } catch (error) {
    console.error(`❌ API Network Error:`, error)
    return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}
