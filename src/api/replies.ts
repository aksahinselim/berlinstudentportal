/**
 * Replies API Service
 */

import type { Reply, Attachment } from '@/types'
import { apiClient, type ApiResponse } from './index'

export interface CreateReplyRequest {
  postId: number
  body: string
  attachments?: Attachment[]
}

export async function getRepliesForPost(postId: number): Promise<ApiResponse<Reply[]>> {
  return apiClient<Reply[]>(`/replies?postId=${postId}`)
}

export async function createReply(request: CreateReplyRequest): Promise<ApiResponse<Reply>> {
  // Backend expects attachmentIds (array of numbers), not full attachment objects
  const requestBody = {
    postId: request.postId,
    body: request.body,
    // Extract only the IDs from attachments
    attachmentIds: request.attachments
      ?.filter(att => att.id !== undefined)
      .map(att => att.id) as number[] || []
  }

  console.log('📤 Creating reply with attachments:', requestBody.attachmentIds)

  return apiClient<Reply>('/replies', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  })
}

export async function voteReply(replyId: number, delta: number): Promise<ApiResponse<Reply>> {
  return apiClient<Reply>(`/replies/${replyId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ delta })
  })
}
