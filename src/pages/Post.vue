<template>
  <div class="min-h-screen bg-zinc-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back button -->
      <router-link
        to="/feed"
        class="inline-flex items-center gap-2 text-zinc-600 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
        {{ t.nav.backToFeed }}
      </router-link>

      <!-- Post not found -->
      <div v-if="!post" class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <AlertCircle class="w-16 h-16 text-zinc-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-black mb-2">{{ t.errors.somethingWentWrong }}</h2>
        <p class="text-zinc-600">{{ t.errors.somethingWentWrong }}</p>
      </div>

      <template v-else>
        <!-- Post Content -->
        <article class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-8 mb-6">
          <div class="flex items-start gap-6">
            <!-- Vote section (like/dislike) -->
            <div class="flex flex-col items-center space-y-2 flex-shrink-0">
              <button
                @click="handleVote(1)"
                :class="[
                  'transition-all duration-200 hover:scale-110',
                  userVote === 1 ? 'text-green-600' : 'text-zinc-400 hover:text-green-500'
                ]"
                aria-label="Upvote"
              >
                <ThumbsUp :class="['w-8 h-8', userVote === 1 ? 'fill-current' : '']" />
              </button>
              <span class="font-bold text-2xl text-black">{{ post.votes }}</span>
              <button
                @click="handleVote(-1)"
                :class="[
                  'transition-all duration-200 hover:scale-110',
                  userVote === -1 ? 'text-red-600' : 'text-zinc-400 hover:text-red-500'
                ]"
                aria-label="Downvote"
              >
                <ThumbsDown :class="['w-8 h-8', userVote === -1 ? 'fill-current' : '']" />
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl font-bold text-black mb-4">{{ post.title }}</h1>

              <div class="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-6">
                <div class="flex items-center gap-1">
                  <Clock class="w-4 h-4" />
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <MessageSquare class="w-4 h-4" />
                  <span>{{ post.replies }} {{ t.feed.replies }}</span>
                </div>
              </div>

              <div class="prose prose-zinc max-w-none mb-6">
                <p class="text-black leading-relaxed whitespace-pre-wrap">{{ post.body }}</p>
              </div>

              <!-- Tags -->
              <div class="mb-6">
                <TagChips :tags="post.tags" />
              </div>

              <!-- Attachments -->
              <div v-if="post.attachments.length > 0" class="space-y-3">
                <h3 class="text-sm font-medium text-zinc-700">{{ t.post.attachments }}:</h3>
                <div class="flex flex-wrap gap-3">
                  <AttachmentBadge
                    v-for="(attachment, index) in post.attachments"
                    :key="index"
                    :attachment="attachment"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-4 mt-6 pt-6 border-t border-zinc-200">
                <button
                  @click="copyLink"
                  class="flex items-center gap-2 text-zinc-600 hover:text-primary transition-colors"
                >
                  <Link class="w-4 h-4" />
                  {{ t.post.copyLink }}
                </button>
              </div>
            </div>
          </div>
        </article>

        <!-- Replies Section -->
        <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-8">
          <h2 class="text-2xl font-bold text-black mb-6">
            {{ replies.length }} {{ t.feed.replies }}
          </h2>

          <!-- Reply Composer -->
          <form @submit.prevent="handleAddReply" class="mb-8">
            <label for="reply-body" class="block text-sm font-medium text-black mb-2">
              {{ t.post.writeReply }}
            </label>
            <textarea
              id="reply-body"
              v-model="newReply"
              rows="4"
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              :placeholder="t.post.writeReply"
            ></textarea>

            <!-- File Upload for Reply -->
            <div class="mt-3">
              <FileDrop ref="replyFileDropRef" @files-updated="handleReplyFilesUpdated" />
            </div>

            <div class="flex items-center justify-between mt-3">
              <p class="text-xs text-zinc-500">{{ newReply.length }} {{ t.common.characters }}</p>
              <button
                type="submit"
                :disabled="!newReply.trim()"
                class="px-6 py-2 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {{ t.post.postReply }}
              </button>
            </div>
          </form>

          <!-- Replies List -->
          <div v-if="replies.length > 0" class="space-y-4">
            <TransitionGroup name="reply-list">
              <ReplyItem
                v-for="reply in replies"
                :key="reply.id"
                :reply="reply"
              />
            </TransitionGroup>
          </div>

          <!-- Empty state -->
          <div v-else class="text-center py-8 text-zinc-500">
            <MessageSquare class="w-12 h-12 mx-auto mb-3 text-zinc-400" />
            <p>{{ t.post.noReplies }} {{ t.post.beFirstToAnswer }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Clock, Link, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { useI18nStore } from '@/store/i18n'
import type { Attachment } from '@/types'
import { toast } from '@/utils/toast'
import TagChips from '@/components/TagChips.vue'
import AttachmentBadge from '@/components/AttachmentBadge.vue'
import ReplyItem from '@/components/ReplyItem.vue'
import FileDrop from '@/components/FileDrop.vue'

const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

const postId = computed(() => parseInt(route.params.id as string))
// Use currentPost from store which is populated fetchPostById
const post = computed(() => appStore.currentPost)
// Use replies from store
const replies = computed(() => appStore.replies)

const newReply = ref('')
const newReplyId = ref<number | null>(null)
const replyAttachments = ref<Attachment[]>([])
const replyFileDropRef = ref<InstanceType<typeof FileDrop> | null>(null)

// Track user's vote for this post (1 = upvote, -1 = downvote, 0 = no vote)
// Load from localStorage
const POST_VOTE_KEY = 'user_post_votes'
function loadPostVote(): number {
  try {
    const saved = localStorage.getItem(POST_VOTE_KEY)
    if (saved) {
      const obj = JSON.parse(saved)
      return obj[postId.value] || 0
    }
  } catch (err) {
    console.error('Failed to load post vote', err)
  }
  return 0
}

function savePostVote(vote: number) {
  try {
    const saved = localStorage.getItem(POST_VOTE_KEY)
    const obj = saved ? JSON.parse(saved) : {}
    if (vote === 0) {
      delete obj[postId.value]
    } else {
      obj[postId.value] = vote
    }
    localStorage.setItem(POST_VOTE_KEY, JSON.stringify(obj))
  } catch (err) {
    console.error('Failed to save post vote', err)
  }
}

const userVote = ref<number>(loadPostVote())

function handleVote(delta: 1 | -1) {
  if (!post.value) return
  
  const currentVote = userVote.value
  
  if (currentVote === delta) {
    // Clicking the same button again - remove vote
    userVote.value = 0
    appStore.votePost(postId.value, -delta)
  } else if (currentVote === 0) {
    // No previous vote - add new vote
    userVote.value = delta
    appStore.votePost(postId.value, delta)
  } else {
    // Changing vote - need to apply 2x delta
    userVote.value = delta
    appStore.votePost(postId.value, delta * 2)
  }
  
  // Save to localStorage
  savePostVote(userVote.value)
}

function handleReplyFilesUpdated(files: { uploadedId: number; type: string; name: string; size: string }[]) {
  replyAttachments.value = files.map(f => ({
    id: f.uploadedId,
    type: f.type as 'pdf' | 'image' | 'docx' | 'other',
    name: f.name,
    size: f.size
  }))
}

async function handleAddReply() {
  if (!authStore.currentUser) {
    toast.error('Yorum yapmak için giriş yapmalısınız')
    return
  }
  
  if (!newReply.value.trim()) {
    toast.warning('Lütfen bir yorum yazın')
    return
  }

  try {
    console.log('📝 Adding reply:', {
      postId: postId.value,
      body: newReply.value.trim(),
      attachments: replyAttachments.value
    })

    const reply = await appStore.addReply({
      postId: postId.value,
      body: newReply.value.trim(),
      attachments: replyAttachments.value
    })

    if (reply) {
      // Store the new reply ID for highlight
      newReplyId.value = reply.id

      // Reset form
      newReply.value = ''
      replyAttachments.value = []
      replyFileDropRef.value?.clearFiles()

      toast.success('Yorumunuz eklendi!')

      // Scroll to the new reply after a short delay
      nextTick(() => {
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          })
        }, 100)
      })
    } else {
      toast.error('Yorum eklenirken bir hata oluştu')
    }
  } catch (err: any) {
    console.error('❌ Reply submission error:', err)
    toast.error(err.message || 'Yorum gönderilemedi')
  }
}

function copyLink() {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    toast.success('Link copied to clipboard!')
  })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch post data on mount
onMounted(() => {
    if (!isNaN(postId.value)) {
        appStore.fetchPostById(postId.value)
        appStore.fetchReplies(postId.value)
    }
})
</script>

<style scoped>
.reply-list-enter-active {
  transition: all 0.5s ease;
}

.reply-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
  background-color: rgba(226, 56, 42, 0.1);
}

.prose {
  font-size: 1.125rem;
  line-height: 1.75;
}
</style>

