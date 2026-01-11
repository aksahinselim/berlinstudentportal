/**
 * Universities API Service
 */

import type { University } from '@/types'
import { apiClient, type ApiResponse } from './index'

export async function getUniversities(): Promise<ApiResponse<University[]>> {
  return apiClient<University[]>('/universities')
}

export async function getUniversityById(id: number): Promise<ApiResponse<University>> {
  return apiClient<University>(`/universities/${id}`)
}
