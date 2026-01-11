<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-4 py-2 bg-white border border-zinc-300 rounded-xl hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Select university"
    >
      <Building2 class="w-5 h-5 text-primary" />
      <span class="font-medium text-black">
        {{ selectedUniName }}
      </span>
      <ChevronDown :class="['w-4 h-4 transition-transform', { 'rotate-180': isDropdownOpen }]" />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isDropdownOpen"
        class="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-zinc-200 py-2 z-50"
      >
        <!-- Quick search -->
        <div class="px-3 pb-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search universities..."
              class="w-full pl-9 pr-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        <!-- University list -->
        <div class="max-h-64 overflow-y-auto">
          <button
            v-for="uni in filteredUniversities"
            :key="uni.id"
            @click="selectUniversity(uni.id)"
            :class="[
              'w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors flex items-center justify-between',
              { 'bg-primary/5': appStore.selectedUniId === uni.id }
            ]"
          >
            <span class="font-medium text-black">{{ uni.name }}</span>
            <Check v-if="appStore.selectedUniId === uni.id" class="w-5 h-5 text-primary" />
          </button>
          
          <div v-if="filteredUniversities.length === 0" class="px-4 py-8 text-center text-zinc-500 text-sm">
            No universities found
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Building2, ChevronDown, Search, Check } from 'lucide-vue-next'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const isDropdownOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)

const selectedUniName = computed(() => {
  return appStore.selectedUniversity?.name || 'Select University'
})

const filteredUniversities = computed(() => {
  if (!searchQuery.value) {
    return appStore.universities
  }
  const query = searchQuery.value.toLowerCase()
  return appStore.universities.filter(u => 
    u.name.toLowerCase().includes(query)
  )
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    searchQuery.value = ''
  }
}

function closeDropdown() {
  isDropdownOpen.value = false
}

function selectUniversity(uniId: number) {
  appStore.setSelectedUniversity(uniId)
  closeDropdown()
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

