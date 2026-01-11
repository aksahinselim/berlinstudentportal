<template>
  <header class="sticky top-0 z-50 bg-white border-b border-zinc-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title (non-clickable, non-draggable) -->
        <div class="flex items-center space-x-3 select-none">
          <img src="/bsp-logo.png" alt="BSP Logo" class="h-10 w-10 pointer-events-none" draggable="false" />
          <span class="font-bold text-xl text-black hidden sm:inline">Berlin Student Portal</span>
          <span class="font-bold text-xl text-black sm:hidden">BSP</span>
        </div>

        <!-- Center: Search (only on authenticated pages) -->
        <div v-if="authStore.isAuthenticated" class="flex-1 max-w-2xl mx-4">
          <SearchBar />
        </div>

        <!-- Right: Language Switcher + Auth or User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <LanguageSwitcher />
          
          <template v-if="!authStore.isAuthenticated">
            <router-link 
              to="/login" 
              class="text-black hover:text-primary transition-colors font-medium"
            >
              {{ t.nav.login }}
            </router-link>
            <router-link 
              to="/register" 
              class="bg-primary text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform font-medium"
            >
              {{ t.nav.register }}
            </router-link>
          </template>
          <template v-else>
            <!-- User dropdown -->
            <div class="relative" ref="dropdownRef">
              <button 
                @click="toggleDropdown"
                class="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
                aria-label="User menu"
              >
                <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {{ userInitial }}
                </div>
                <ChevronDown :class="['w-4 h-4 transition-transform', { 'rotate-180': isDropdownOpen }]" />
              </button>
              
              <Transition name="dropdown">
                <div 
                  v-if="isDropdownOpen" 
                  class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-zinc-200 py-2"
                >
                  <div class="px-4 py-3 border-b border-zinc-100">
                    <p class="text-sm font-medium text-black">{{ authStore.currentUser?.handle }}</p>
                    <p class="text-xs text-zinc-500 mt-1">{{ authStore.currentUser?.email }}</p>
                  </div>
                  <router-link 
                    to="/profile" 
                    class="flex items-center px-4 py-2 text-sm text-black hover:bg-zinc-50 transition-colors"
                    @click="closeDropdown"
                  >
                    <User class="w-4 h-4 mr-3" />
                    {{ t.nav.profile }}
                  </router-link>
                  <router-link 
                    to="/feed" 
                    class="flex items-center px-4 py-2 text-sm text-black hover:bg-zinc-50 transition-colors"
                    @click="closeDropdown"
                  >
                    <MessageSquare class="w-4 h-4 mr-3" />
                    {{ t.nav.feed }}
                  </router-link>
                  <router-link 
                    v-if="authStore.isAdmin"
                    to="/admin" 
                    class="flex items-center px-4 py-2 text-sm text-black hover:bg-zinc-50 transition-colors"
                    @click="closeDropdown"
                  >
                    <Shield class="w-4 h-4 mr-3" />
                    {{ t.nav.admin }}
                  </router-link>
                  <hr class="my-2 border-zinc-100" />
                  <button 
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-primary hover:bg-zinc-50 transition-colors"
                  >
                    <LogOut class="w-4 h-4 mr-3" />
                    {{ t.nav.logout }}
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, User, MessageSquare, Shield, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import { useI18nStore } from '@/store/i18n'
import SearchBar from './SearchBar.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const authStore = useAuthStore()
const i18nStore = useI18nStore()
const router = useRouter()

// i18n
const t = computed(() => i18nStore.t)

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userInitial = computed(() => {
  const handle = authStore.currentUser?.handle || 'U'
  return handle.charAt(0).toUpperCase()
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}

function handleLogout() {
  authStore.logout()
  closeDropdown()
  router.push('/')
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

