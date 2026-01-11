/**
 * Draft Store
 * Manages saving and restoring post drafts
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const DRAFT_KEY = 'post_draft'

export interface PostDraft {
  title: string
  body: string
  tags: string[]
  timestamp: number
}

export const useDraftStore = defineStore('draft', () => {
  // Load draft from localStorage
  const loadDraft = (): PostDraft | null => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load draft:', e)
    }
    return null
  }
  
  const draft = ref<PostDraft | null>(loadDraft())
  
  // Computed
  const hasDraft = computed(() => draft.value !== null)
  
  const draftAge = computed(() => {
    if (!draft.value) return ''
    const diff = Date.now() - draft.value.timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  })
  
  // Actions
  function saveDraft(title: string, body: string, tags: string[]) {
    // Don't save if all fields are empty
    if (!title.trim() && !body.trim() && tags.length === 0) {
      return false
    }
    
    const newDraft: PostDraft = {
      title: title.trim(),
      body: body.trim(),
      tags,
      timestamp: Date.now()
    }
    
    draft.value = newDraft
    localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft))
    console.log('📝 Draft saved')
    return true
  }
  
  function clearDraft() {
    draft.value = null
    localStorage.removeItem(DRAFT_KEY)
    console.log('🗑️ Draft cleared')
  }
  
  function getDraft(): PostDraft | null {
    return draft.value
  }
  
  return {
    draft,
    hasDraft,
    draftAge,
    saveDraft,
    clearDraft,
    getDraft
  }
})
