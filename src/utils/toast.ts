/**
 * Global Toast Notification Utility
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

// Global toast function that will be set by ToastNotification component
let globalShowToast: ((message: string, type: ToastType, duration?: number) => void) | null = null

export function setGlobalToast(showToastFn: (message: string, type: ToastType, duration?: number) => void) {
  globalShowToast = showToastFn
}

export function showToast(message: string, type: ToastType = 'info', duration = 4000) {
  if (globalShowToast) {
    globalShowToast(message, type, duration)
  } else {
    // Fallback to console if toast system not ready
    console.log(`[${type.toUpperCase()}]`, message)
  }
}

// Convenience functions
export const toast = {
  success: (message: string, duration?: number) => showToast(message, 'success', duration),
  error: (message: string, duration?: number) => showToast(message, 'error', duration),
  warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
  info: (message: string, duration?: number) => showToast(message, 'info', duration)
}
