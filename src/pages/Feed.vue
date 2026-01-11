<template>
  <div class="min-h-screen bg-zinc-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div>
          <h1 class="text-3xl font-bold text-black mb-2">
            {{ selectedUniversity?.name || '' }} {{ t.nav.feed }}
          </h1>
          <p class="text-zinc-600">{{ t.feed.shareKnowledge }}</p>
        </div>
      </div>

      <!-- No university selected -->
      <div v-if="!selectedUniversity" class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <Building2 class="w-16 h-16 text-zinc-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-black mb-2">{{ t.feed.loadingUni }}</h2>
        <p class="text-zinc-600 mb-6">
          {{ t.feed.settingUp }}
        </p>
      </div>

      <template v-else>
        <!-- Filters and Search -->
        <div class="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <!-- Filter tabs -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in filters"
                :key="filter.id"
                @click="activeFilter = filter.id"
                :class="[
                  'px-4 py-2 rounded-xl font-medium transition-colors',
                  activeFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-zinc-100 text-black hover:bg-zinc-200'
                ]"
              >
                {{ filter.label }}
              </button>
            </div>

            <!-- Tag filter (if any) -->
            <div v-if="route.query.tag" class="flex items-center gap-2">
              <span class="text-sm text-zinc-600">{{ t.common.filterBy }}:</span>
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                #{{ route.query.tag }}
                <button @click="clearTagFilter" class="hover:text-primary-dark">
                  <X class="w-4 h-4" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Posts List -->
        <div v-if="filteredPosts.length > 0" class="space-y-4">
          <TransitionGroup name="post-list">
            <QACard 
              v-for="post in filteredPosts" 
              :key="post.id" 
              :post="post"
            />
          </TransitionGroup>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <MessageSquare class="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-black mb-2">{{ t.feed.noPostsYet }}</h2>
          <p class="text-zinc-600 mb-6">
            {{ t.feed.beFirstToAsk }}
          </p>
          <button
            @click="openNewPostModal"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold"
          >
            <Plus class="w-5 h-5" />
            {{ t.feed.askQuestion }}
          </button>
        </div>
      </template>

      <!-- Floating Action Buttons -->
      <div v-if="selectedUniversity" class="fixed bottom-8 right-8 flex flex-col gap-3 items-end">
        <!-- Draft Button (shows only when there's a draft) -->
        <Transition name="slide-fade">
          <button
            v-if="draftStore.hasDraft && !showNewPostModal"
            @click="restoreDraft"
            class="flex items-center gap-2 px-4 py-3 bg-white text-primary border-2 border-primary rounded-full shadow-lg hover:scale-105 transition-transform"
            :title="t.draft.restore"
          >
            <FileText class="w-5 h-5" />
            <span class="text-sm font-medium">{{ t.draft.hasDraft }}</span>
          </button>
        </Transition>
        
        <!-- Main FAB -->
        <button
          @click="openNewPostModal"
          class="w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          :aria-label="t.feed.askQuestion"
        >
          <Plus class="w-8 h-8" />
        </button>
      </div>

      <!-- New Post Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showNewPostModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="showNewPostModal = false"
          >
            <div class="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-black">{{ t.feed.askQuestion }}</h2>
                <div class="flex items-center gap-2">
                  <!-- Save Draft Button -->
                  <button 
                    @click="handleSaveDraft" 
                    class="p-2 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    :title="t.common.save"
                  >
                    <Save class="w-5 h-5" />
                  </button>
                  <!-- Close Button -->
                  <button @click="handleCloseModal" class="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors">
                    <X class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form @submit.prevent="handleCreatePost" class="space-y-6">
                <div>
                  <label for="title" class="block text-sm font-medium text-black mb-2">
                    {{ t.post.title }} <span class="text-primary">*</span>
                  </label>
                  <input
                    id="title"
                    v-model="newPost.title"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    :placeholder="t.post.whatsYourQuestion"
                  />
                </div>

                <div>
                  <label for="body" class="block text-sm font-medium text-black mb-2">
                    {{ t.post.description }} <span class="text-primary">*</span>
                  </label>
                  <textarea
                    id="body"
                    v-model="newPost.body"
                    required
                    rows="6"
                    class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    :placeholder="t.post.provideDetails"
                  ></textarea>
                  <p class="text-xs text-zinc-500 mt-1">
                    {{ newPost.body.length }} {{ t.common.characters }}
                  </p>
                </div>

                <div>
                  <label for="tags" class="block text-sm font-medium text-black mb-2">
                    {{ t.post.tags }}
                  </label>
                  <input
                    id="tags"
                    v-model="tagsInput"
                    type="text"
                    class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    :placeholder="t.post.tagsPlaceholder"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-black mb-2">
                    {{ t.post.attachments }}
                  </label>
                  <FileDrop ref="fileDropRef" @files-updated="handleFilesUpdated" />
                </div>

                <div class="flex gap-3">
                  <button
                    type="button"
                    @click="showNewPostModal = false"
                    class="flex-1 py-3 bg-zinc-200 text-black rounded-xl hover:bg-zinc-300 transition-colors font-medium"
                  >
                    {{ t.common.cancel }}
                  </button>
                  <button
                    type="submit"
                    class="flex-1 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold"
                  >
                    {{ t.post.postQuestion }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Building2, MessageSquare, Plus, X, Save, FileText } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { useDraftStore } from '@/store/draft'
import { useI18nStore } from '@/store/i18n'
import { toast } from '@/utils/toast'
import QACard from '@/components/QACard.vue'
import FileDrop from '@/components/FileDrop.vue'
import type { Attachment, Post } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const draftStore = useDraftStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

const selectedUniversity = computed(() => appStore.selectedUniversity)

const filters = computed(() => [
  { id: 'new', label: t.value.common.new },
  { id: 'active', label: t.value.common.active },
  { id: 'unanswered', label: t.value.common.unanswered },
  { id: 'top', label: t.value.common.top },
])

const activeFilter = ref('new')
const showNewPostModal = ref(false)
const fileDropRef = ref<InstanceType<typeof FileDrop> | null>(null)

const newPost = ref({
  title: '',
  body: '',
})

const tagsInput = ref('')
const attachments = ref<Attachment[]>([])

// Now we filter locally for search/tags, but the main list comes from API
const filteredPosts = computed(() => {
  let posts: Post[] = [...appStore.posts] // Use appStore.posts directly as it's now updated by API

  // Filter by selected Uni (should be handled by API mostly, but client side check doesn't hurt)
  if (appStore.selectedUniId) {
    posts = posts.filter(p => p.uniId === appStore.selectedUniId)
  }

  // Apply search filter (Client-side for now, can be moved to API)
  const searchQuery = route.query.search as string | undefined
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    posts = posts.filter((p: Post) => 
      p.title.toLowerCase().includes(query) ||
      p.body.toLowerCase().includes(query) ||
      p.tags.some((t: string) => t.toLowerCase().includes(query))
    )
  }

  // Apply tag filter
  const tagFilter = route.query.tag as string | undefined
  if (tagFilter) {
    posts = posts.filter((p: Post) => p.tags.includes(tagFilter))
  }

  // Apply sort filter (Client-side or re-fetch from API)
  // For simplicity we do it client side on the fetched list
  switch (activeFilter.value) {
    case 'new':
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'active':
      posts.sort((a, b) => b.replies - a.replies)
      break
    case 'unanswered':
      posts = posts.filter((p: Post) => p.replies === 0)
      break
    case 'top':
      posts.sort((a, b) => b.votes - a.votes)
      break
  }

  return posts
})

function clearTagFilter() {
  router.push({ name: 'Feed', query: { ...route.query, tag: undefined } })
}

function handleFilesUpdated(files: Array<{ type: string; name: string; size: string; uploadedId?: number; url?: string }>) {
  attachments.value = files
    .filter(f => f.uploadedId) // Only include successfully uploaded files
    .map((f) => ({
      id: f.uploadedId,
      type: f.type as Attachment['type'],
      name: f.name,
      size: f.size,
      url: f.url,
    }))
}

// Draft functions
function handleSaveDraft() {
  const tags = tagsInput.value
    .split(',')
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag.length > 0)
  
  // Check if there's any content to save
  const hasContent = newPost.value.title.trim() || newPost.value.body.trim() || tags.length > 0
  
  if (!hasContent) {
    // If empty, clear any existing draft
    draftStore.clearDraft()
    toast.info('Draft cleared')
    return
  }
  
  const saved = draftStore.saveDraft(newPost.value.title, newPost.value.body, tags)
  if (saved) {
    toast.success(t.value.draft.saved)
    // Close modal after saving draft
    showNewPostModal.value = false
    // Reset form for next time
    resetForm()
  }
}

function restoreDraft() {
  const draft = draftStore.getDraft()
  if (draft) {
    newPost.value.title = draft.title
    newPost.value.body = draft.body
    tagsInput.value = draft.tags.join(', ')
    showNewPostModal.value = true
    // Clear the draft after restoring
    draftStore.clearDraft()
    toast.info(t.value.draft.restore)
  }
}

function openNewPostModal() {
  // Always start with a fresh form when clicking "+"
  resetForm()
  showNewPostModal.value = true
}

function resetForm() {
  newPost.value = { title: '', body: '' }
  tagsInput.value = ''
  attachments.value = []
  fileDropRef.value?.clearFiles()
}

function handleCloseModal() {
  // Just close the modal without saving - user must explicitly click save
  showNewPostModal.value = false
  // Reset form
  resetForm()
}

async function handleCreatePost() {
  if (!authStore.currentUser || !appStore.selectedUniId) return

  const tags = tagsInput.value
    .split(',')
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag.length > 0)

  // Use async store method
  const post = await appStore.addPost({
    uniId: appStore.selectedUniId,
    title: newPost.value.title,
    body: newPost.value.body,
    tags,
    attachments: attachments.value,
  })

  // Clear draft on successful post
  draftStore.clearDraft()
  
  // Reset form
  newPost.value = { title: '', body: '' }
  tagsInput.value = ''
  attachments.value = []
  fileDropRef.value?.clearFiles()
  showNewPostModal.value = false

  if (post) {
    // Show success message
    toast.success(t.value.success.postCreated)
    // Navigate to the new post
    router.push({ name: 'Post', params: { id: post.id } })
  } else {
    toast.error(t.value.errors.somethingWentWrong)
  }
}

// Auto-set university based on logged-in user
watch(() => authStore.currentUser, (user) => {
  if (user && user.uniId) {
    appStore.setSelectedUniversity(user.uniId)
  }
}, { immediate: true })

// Watch for university changes
watch(() => appStore.selectedUniId, (newVal: number | null) => {
  if (!newVal) {
    activeFilter.value = 'new'
  }
})

// Initial fetch
onMounted(() => {
    if (appStore.selectedUniId) {
        appStore.fetchPosts({ uniId: appStore.selectedUniId })
    }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.post-list-enter-active,
.post-list-leave-active {
  transition: all 0.3s ease;
}

.post-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.post-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Slide fade for draft button */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>

