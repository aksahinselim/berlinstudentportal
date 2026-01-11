/**
 * Verifications API Service
 */

import type { Verification } from '@/types'
import { apiClient, type ApiResponse } from './index'

export interface CreateVerificationRequest {
  uniId: number
  selfieUrl: string
  cardUrl: string
}

export async function createVerification(request: CreateVerificationRequest): Promise<ApiResponse<Verification>> {
  return apiClient<Verification>('/verifications', {
    method: 'POST',
    body: JSON.stringify(request)
  })
}

export async function getVerifications(status?: string): Promise<ApiResponse<Verification[]>> {
  const query = status ? `?status=${status}` : ''
  return apiClient<Verification[]>(`/verifications${query}`)
}

export async function updateVerificationStatus(id: number, status: 'approved' | 'rejected'): Promise<ApiResponse<Verification>> {
  return apiClient<Verification>(`/verifications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
}

/**
 * Submit verification with photo files
 */
export async function submitVerification(selfieFile: File, cardFile: File): Promise<ApiResponse<Verification>> {
  try {
    console.log('🚀 API: Starting verification submission...');
    console.log('📁 Selfie file:', selfieFile.name, selfieFile.size, 'bytes');
    console.log('📁 Card file:', cardFile.name, cardFile.size, 'bytes');
    
    const formData = new FormData();
    formData.append('selfie', selfieFile);
    formData.append('card', cardFile);

    // Get token from localStorage (using same key as auth store)
    const token = localStorage.getItem('token');
    
    // Use nginx proxy path - browser is served from nginx, API calls go through nginx proxy
    const url = '/api/verifications/submit';
    
    console.log('🌐 API URL:', url);
    console.log('🔑 Token present:', !!token);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
  } catch (error: any) {
    console.error('❌ API submitVerification error:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
    };
  }
}

export const verificationsApi = {
  createVerification,
  getVerifications,
  updateVerificationStatus,
  submitVerification,
}
