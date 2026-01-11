import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { University, Post, Reply, Verification } from '@/types'
import * as universityService from '@/api/universities'
import * as postService from '@/api/posts'
import * as replyService from '@/api/replies'
import * as verificationService from '@/api/verifications'

export const useAppStore = defineStore('app', () => {
  // Universities
  const universities = ref<University[]>([])
  const selectedUniId = ref<number | null>(null)
  
  async function fetchUniversities() {
    try {
      const result = await universityService.getUniversities()
      if (result.success && result.data) {
        universities.value = result.data
      }
    } catch (err) {
      console.error('Failed to fetch universities', err)
    }
  }

  // Load selected university from localStorage
  const storedUniId = localStorage.getItem('selectedUniId')
  if (storedUniId) {
    selectedUniId.value = parseInt(storedUniId)
  }

  const selectedUniversity = computed(() => 
    universities.value.find(u => u.id === selectedUniId.value)
  )

  function setSelectedUniversity(uniId: number) {
    selectedUniId.value = uniId
    localStorage.setItem('selectedUniId', uniId.toString())
    // When university changes, refresh posts
    fetchPosts({ uniId })
  }

  // Posts
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const loadingPosts = ref(false)
  
  async function fetchPosts(params: postService.GetPostsParams = {}) {
    loadingPosts.value = true
    try {
      const result = await postService.getPosts(params)
      if (result.success && result.data) {
        posts.value = result.data.posts
      }
    } catch (err) {
      console.error('Failed to fetch posts', err)
    } finally {
      loadingPosts.value = false
    }
  }

  async function fetchPostById(id: number) {
    loadingPosts.value = true
    try {
      const result = await postService.getPostById(id)
      if (result.success && result.data) {
        currentPost.value = result.data
      }
    } catch (err) {
      console.error('Failed to fetch post', err)
    } finally {
      loadingPosts.value = false
    }
  }

  async function addPost(post: postService.CreatePostRequest) {
    try {
      const result = await postService.createPost(post)
      if (result.success && result.data) {
        posts.value.unshift(result.data)
        return result.data
      }
    } catch (err) {
      console.error('Failed to create post', err)
    }
    return null
  }

  async function votePost(postId: number, delta: number) {
    // Optimistic update
    const post = posts.value.find(p => p.id === postId)
    if (post) post.votes += delta
    if (currentPost.value?.id === postId) currentPost.value.votes += delta

    try {
      await postService.votePost(postId, delta)
    } catch (err) {
      // Revert on failure
      if (post) post.votes -= delta
      if (currentPost.value?.id === postId) currentPost.value.votes -= delta
    }
  }

  // Replies
  const replies = ref<Reply[]>([])
  const loadingReplies = ref(false)

  async function fetchReplies(postId: number) {
    loadingReplies.value = true
    try {
        // Replies are now fetched with the post detail usually, 
        // but if we use the separate endpoint:
      const result = await replyService.getRepliesForPost(postId)
      if (result.success && result.data) {
        replies.value = result.data
      }
    } catch (err) {
      console.error('Failed to fetch replies', err)
    } finally {
      loadingReplies.value = false
    }
  }

  async function addReply(reply: replyService.CreateReplyRequest) {
    try {
      const result = await replyService.createReply(reply)
      if (result.success && result.data) {
        replies.value.unshift(result.data)
        // Update post reply count locally
        const post = posts.value.find(p => p.id === reply.postId)
        if (post) post.replies++
        if (currentPost.value?.id === reply.postId) currentPost.value.replies++
        
        return result.data
      }
    } catch (err) {
      console.error('Failed to add reply', err)
    }
    return null
  }

  async function voteReply(replyId: number, delta: number) {
    const reply = replies.value.find(r => r.id === replyId)
    if (reply) reply.votes += delta

    try {
      await replyService.voteReply(replyId, delta)
    } catch (err) {
      if (reply) reply.votes -= delta
    }
  }

  // Verifications
  const verifications = ref<Verification[]>([])
  const loadingVerifications = ref(false)

  async function fetchVerifications(status?: string) {
    loadingVerifications.value = true
    try {
      const result = await verificationService.getVerifications(status)
      if (result.success && result.data) {
        verifications.value = result.data
      }
    } catch (err) {
      console.error('Failed to fetch verifications', err)
    } finally {
      loadingVerifications.value = false
    }
  }

  async function addVerification(verification: verificationService.CreateVerificationRequest) {
    try {
      const result = await verificationService.createVerification(verification)
      if (result.success && result.data) {
        verifications.value.push(result.data)
        return result.data
      }
    } catch (err) {
      console.error('Failed to submit verification', err)
    }
    return null
  }

  async function updateVerificationStatus(verificationId: number, status: 'approved' | 'rejected') {
    try {
      const result = await verificationService.updateVerificationStatus(verificationId, status)
      if (result.success && result.data) {
        const index = verifications.value.findIndex(v => v.id === verificationId)
        if (index !== -1) {
          verifications.value[index] = result.data
        }
      }
    } catch (err) {
      console.error('Failed to update verification', err)
    }
  }

  const pendingVerifications = computed(() => 
    verifications.value.filter(v => v.status === 'pending')
  )

  // Initial load
  fetchUniversities()

  return {
    // Universities
    universities,
    selectedUniId,
    selectedUniversity,
    setSelectedUniversity,
    fetchUniversities,
    
    // Posts
    posts,
    currentPost,
    loadingPosts,
    fetchPosts,
    fetchPostById,
    addPost,
    votePost,
    
    // Replies
    replies,
    loadingReplies,
    fetchReplies,
    addReply,
    voteReply,
    
    // Verifications
    verifications,
    pendingVerifications,
    loadingVerifications,
    fetchVerifications,
    addVerification,
    updateVerificationStatus,
  }
})

