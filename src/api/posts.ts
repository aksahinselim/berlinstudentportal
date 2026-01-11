/**
 * Posts API Service
 */

import type { Post, Attachment } from '@/types'
import { apiClient, type ApiResponse } from './index'

export interface CreatePostRequest {
  uniId: number
  title: string
  body: string
  tags: string[]
  attachments: Attachment[]
}

export interface GetPostsParams {
  uniId?: number
  tag?: string
  search?: string
  sortBy?: 'new' | 'active' | 'unanswered' | 'top'
  limit?: number
  offset?: number
}

interface GetPostsResponse {
  posts: Post[]
  total: number
}

export async function getPosts(params: GetPostsParams = {}): Promise<ApiResponse<GetPostsResponse>> {
  // Convert params to query string
  const query = new URLSearchParams()
  if (params.uniId) query.append('uniId', params.uniId.toString())
  if (params.tag) query.append('tag', params.tag)
  if (params.search) query.append('search', params.search)
  if (params.sortBy) query.append('sortBy', params.sortBy)
  if (params.limit) query.append('limit', params.limit.toString())
  if (params.offset) query.append('offset', params.offset.toString())

  return apiClient<GetPostsResponse>(`/posts?${query.toString()}`)
}

export async function getPostById(id: number): Promise<ApiResponse<Post>> {
  return apiClient<Post>(`/posts/${id}`)
}

export async function createPost(request: CreatePostRequest): Promise<ApiResponse<Post>> {
  // Backend expects attachmentIds (array of numbers), not full attachment objects
  const requestBody = {
    uniId: request.uniId,
    title: request.title,
    body: request.body,
    tags: request.tags,
    // Extract only the IDs from attachments
    attachmentIds: request.attachments
      .filter(att => att.id !== undefined)
      .map(att => att.id)
  }
  
  console.log('📤 Creating post with attachments:', requestBody.attachmentIds)
  
  return apiClient<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  })
}

export async function votePost(postId: number, delta: number): Promise<ApiResponse<Post>> {
  return apiClient<Post>(`/posts/${postId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ delta })
  })
}
