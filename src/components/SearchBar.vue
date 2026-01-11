<template>
  <div class="relative">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="t.common.searchPlaceholder"
        class="w-full pl-10 pr-10 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        @keydown="handleKeydown"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
        aria-label="Clear search"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { useI18nStore } from '@/store/i18n'

const router = useRouter()
const route = useRoute()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)
const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  if (route.name === 'Feed') {
    // In Feed page, emit or update route query
    router.push({ name: 'Feed', query: { ...route.query, search: searchQuery.value || undefined } })
  }
}, 300)

watch(searchQuery, () => {
  debouncedSearch()
})

function clearSearch() {
  searchQuery.value = ''
  if (route.name === 'Feed') {
    router.push({ name: 'Feed', query: { ...route.query, search: undefined } })
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    clearSearch()
    searchInput.value?.blur()
  }
}

// Keyboard shortcut: "/" to focus search
function handleGlobalKeydown(e: KeyboardEvent) {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
  // Load search from route query
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
kbd {
  font-family: Arial, sans-serif;
}
</style>

