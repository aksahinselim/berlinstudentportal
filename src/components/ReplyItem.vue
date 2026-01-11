<template>
  <div class="border-l-2 border-zinc-200 pl-4 py-4">
    <div class="flex items-start gap-3">
      <!-- Vote section (like/dislike) -->
      <div class="flex flex-col items-center space-y-1 flex-shrink-0">
        <button
          @click="handleVote(1)"
          :class="[
            'transition-all duration-200 hover:scale-110',
            userVote === 1 ? 'text-green-600' : 'text-zinc-400 hover:text-green-500'
          ]"
          aria-label="Upvote reply"
        >
          <ThumbsUp :class="['w-5 h-5', userVote === 1 ? 'fill-current' : '']" />
        </button>
        <span class="font-medium text-sm text-black">{{ reply.votes }}</span>
        <button
          @click="handleVote(-1)"
          :class="[
            'transition-all duration-200 hover:scale-110',
            userVote === -1 ? 'text-red-600' : 'text-zinc-400 hover:text-red-500'
          ]"
          aria-label="Downvote reply"
        >
          <ThumbsDown :class="['w-5 h-5', userVote === -1 ? 'fill-current' : '']" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            {{ authorInitial }}
          </div>
          <span class="text-sm text-zinc-500">{{ authorHandle }}</span>
          <span class="text-sm text-zinc-400">•</span>
          <span class="text-sm text-zinc-500">{{ formatDate(reply.createdAt) }}</span>
        </div>
        
        <p class="text-black leading-relaxed mb-3">{{ reply.body }}</p>

        <!-- Attachments -->
        <div v-if="reply.attachments && reply.attachments.length > 0" class="flex flex-wrap gap-2 mt-3">
          <AttachmentBadge
            v-for="attachment in reply.attachments"
            :key="attachment.id"
            :attachment="attachment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ThumbsUp, ThumbsDown } from 'lucide-vue-next'
import type { Reply } from '@/types'
import { useAppStore } from '@/store/app'
import AttachmentBadge from './AttachmentBadge.vue'
import { useI18nStore } from '@/store/i18n'

const props = defineProps<{
  reply: Reply
}>()

const appStore = useAppStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

// Track user's vote for this reply (1 = upvote, -1 = downvote, 0 = no vote)
// Load from localStorage
const REPLY_VOTE_KEY = 'user_reply_votes'
function loadReplyVote(): number {
  try {
    const saved = localStorage.getItem(REPLY_VOTE_KEY)
    if (saved) {
      const obj = JSON.parse(saved)
      return obj[props.reply.id] || 0
    }
  } catch (err) {
    console.error('Failed to load reply vote', err)
  }
  return 0
}

function saveReplyVote(vote: number) {
  try {
    const saved = localStorage.getItem(REPLY_VOTE_KEY)
    const obj = saved ? JSON.parse(saved) : {}
    if (vote === 0) {
      delete obj[props.reply.id]
    } else {
      obj[props.reply.id] = vote
    }
    localStorage.setItem(REPLY_VOTE_KEY, JSON.stringify(obj))
  } catch (err) {
    console.error('Failed to save reply vote', err)
  }
}

const userVote = ref<number>(loadReplyVote())

const authorHandle = computed(() => props.reply.authorHandle || t.value.feed.deletedAccount)
const authorInitial = computed(() => authorHandle.value.charAt(0).toUpperCase())

function handleVote(delta: 1 | -1) {
  const currentVote = userVote.value
  
  if (currentVote === delta) {
    // Clicking the same button again - remove vote
    userVote.value = 0
    appStore.voteReply(props.reply.id, -delta)
  } else if (currentVote === 0) {
    // No previous vote - add new vote
    userVote.value = delta
    appStore.voteReply(props.reply.id, delta)
  } else {
    // Changing vote - need to apply 2x delta
    userVote.value = delta
    appStore.voteReply(props.reply.id, delta * 2)
  }
  
  // Save to localStorage
  saveReplyVote(userVote.value)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

