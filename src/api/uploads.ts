/**
 * Uploads API Service
 */

import { apiClient, type ApiResponse } from './index'

export interface UploadedFile {
  id: number
  filename: string
  originalName: string
  fileType: string
  fileSize: number
  url: string
}

interface UploadResponse {
  uploadedFiles: UploadedFile[]
}

/**
 * Upload files to the server
 * @param files - Array of File objects to upload
 * @param onProgress - Optional callback for upload progress
 */
export async function uploadFiles(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<ApiResponse<UploadedFile[]>> {
  const formData = new FormData()
  
  files.forEach(file => {
    formData.append('files', file)
  })

  const token = localStorage.getItem('token')
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100)
        onProgress(percentComplete)
      }
    })
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve({
            success: response.success,
            data: response.data
          })
        } catch (e) {
          reject(new Error('Failed to parse response'))
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          resolve({
            success: false,
            error: errorResponse.error || 'Upload failed'
          })
        } catch (e) {
          resolve({
            success: false,
            error: 'Upload failed'
          })
        }
      }
    })
    
    xhr.addEventListener('error', () => {
      resolve({
        success: false,
        error: 'Network error during upload'
      })
    })
    
    xhr.open('POST', '/api/uploads')
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    xhr.send(formData)
  })
}

/**
 * Get attachment info by ID
 */
export async function getAttachment(id: number): Promise<ApiResponse<UploadedFile>> {
  return apiClient<UploadedFile>(`/uploads/${id}`)
}

/**
 * Delete attachment by ID
 */
export async function deleteAttachment(id: number): Promise<ApiResponse<void>> {
  return apiClient<void>(`/uploads/${id}`, {
    method: 'DELETE'
  })
}

/**
 * Upload verification file (selfie or card)
 */
export interface VerificationFileResponse {
  filePath: string
  filename: string
}

export async function uploadVerificationFile(
  file: File,
  type: 'selfie' | 'card'
): Promise<ApiResponse<VerificationFileResponse>> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const token = localStorage.getItem('token')
  
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve({
            success: response.success,
            data: response.data
          })
        } catch (e) {
          resolve({
            success: false,
            error: 'Failed to parse response'
          })
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          resolve({
            success: false,
            error: errorResponse.error || 'Upload failed'
          })
        } catch (e) {
          resolve({
            success: false,
            error: 'Upload failed'
          })
        }
      }
    })
    
    xhr.addEventListener('error', () => {
      resolve({
        success: false,
        error: 'Network error during upload'
      })
    })
    
    xhr.open('POST', '/api/uploads/verification')
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    xhr.send(formData)
  })
}
