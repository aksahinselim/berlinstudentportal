<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-zinc-100 transition-colors"
      :class="variant === 'light' ? 'text-white hover:bg-white/10' : 'text-zinc-700'"
    >
      <span class="text-base">{{ currentFlag }}</span>
      <span>{{ currentLanguage.toUpperCase() }}</span>
      <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>
    
    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-zinc-200 py-2 z-50"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-zinc-50 transition-colors"
          :class="{ 'bg-primary/5 text-primary font-medium': currentLanguage === lang.code }"
        >
          <span class="text-lg">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
          <Check v-if="currentLanguage === lang.code" class="w-4 h-4 ml-auto text-primary" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useI18nStore } from '@/store/i18n'
import type { Language } from '@/i18n/translations'

defineProps<{
  variant?: 'light' | 'dark'
}>()

const i18nStore = useI18nStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currentLanguage = computed(() => i18nStore.currentLanguage)
const languages = computed(() => i18nStore.languages)

const currentFlag = computed(() => {
  const lang = languages.value.find(l => l.code === currentLanguage.value)
  return lang?.flag || '🌐'
})

function selectLanguage(code: Language) {
  i18nStore.setLanguage(code)
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
