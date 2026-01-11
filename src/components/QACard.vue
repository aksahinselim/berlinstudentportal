<template>
  <article
    class="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    @click="handleClick"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- Vote section (like/dislike) -->
      <div class="flex flex-col items-center space-y-1 flex-shrink-0">
        <button
          @click.stop="handleVote(1)"
          :class="[
            'transition-all duration-200 hover:scale-110',
            userVote === 1 ? 'text-green-600' : 'text-zinc-400 hover:text-green-500'
          ]"
          aria-label="Upvote"
        >
          <ThumbsUp :class="['w-6 h-6', userVote === 1 ? 'fill-current' : '']" />
        </button>
        <span class="font-bold text-lg text-black">{{ post.votes }}</span>
        <button
          @click.stop="handleVote(-1)"
          :class="[
            'transition-all duration-200 hover:scale-110',
            userVote === -1 ? 'text-red-600' : 'text-zinc-400 hover:text-red-500'
          ]"
          aria-label="Downvote"
        >
          <ThumbsDown :class="['w-6 h-6', userVote === -1 ? 'fill-current' : '']" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-bold text-black mb-2 hover:text-primary transition-colors">
          {{ post.title }}
        </h3>
        
        <p class="text-zinc-600 mb-3 line-clamp-2">
          {{ post.body }}
        </p>

        <!-- Tags -->
        <TagChips :tags="post.tags" @tag-click="handleTagClick" />

        <!-- Meta info -->
        <div class="flex items-center gap-4 mt-4 text-sm text-zinc-500">
          <div class="flex items-center gap-1">
            <MessageSquare class="w-4 h-4" />
            <span>{{ post.replies }} {{ t.feed.replies }}</span>
          </div>
          
          <div v-if="post.attachments.length > 0" class="flex items-center gap-1">
            <Paperclip class="w-4 h-4" />
            <span>{{ post.attachments.length }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <Clock class="w-4 h-4" />
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ThumbsUp, ThumbsDown, MessageSquare, Paperclip, Clock } from 'lucide-vue-next'
import type { Post } from '@/types'
import { useAppStore } from '@/store/app'
import { useI18nStore } from '@/store/i18n'
import TagChips from './TagChips.vue'

const props = defineProps<{
  post: Post
}>()

const router = useRouter()
const appStore = useAppStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

// Track user's vote for this post (1 = upvote, -1 = downvote, 0 = no vote)
// Load from localStorage
const STORAGE_KEY = 'user_post_votes'
function loadVotes(): Map<number, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const obj = JSON.parse(saved)
      return new Map(Object.entries(obj).map(([k, v]) => [parseInt(k), v as number]))
    }
  } catch (err) {
    console.error('Failed to load votes from localStorage', err)
  }
  return new Map()
}

function saveVotes(votes: Map<number, number>) {
  try {
    const obj = Object.fromEntries(votes)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (err) {
    console.error('Failed to save votes to localStorage', err)
  }
}

const userVotes = ref<Map<number, number>>(loadVotes())
const userVote = computed(() => userVotes.value.get(props.post.id) || 0)

const universityName = computed(() => {
  return appStore.universities.find(u => u.id === props.post.uniId)?.name || 'Unknown'
})

function handleClick() {
  router.push({ name: 'Post', params: { id: props.post.id } })
}

function handleVote(delta: 1 | -1) {
  const currentVote = userVote.value
  
  if (currentVote === delta) {
    // Clicking the same button again - remove vote
    userVotes.value.delete(props.post.id)
    appStore.votePost(props.post.id, -delta) // Undo the vote
  } else if (currentVote === 0) {
    // No previous vote - add new vote
    userVotes.value.set(props.post.id, delta)
    appStore.votePost(props.post.id, delta)
  } else {
    // Changing vote - need to apply 2x delta (undo old + apply new)
    userVotes.value.set(props.post.id, delta)
    appStore.votePost(props.post.id, delta * 2)
  }
  
  // Save to localStorage
  saveVotes(userVotes.value)
}

function handleTagClick(tag: string) {
  // Navigate to feed with tag filter
  router.push({ name: 'Feed', query: { tag } })
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

