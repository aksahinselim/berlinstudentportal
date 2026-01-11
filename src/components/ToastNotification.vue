<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-6 py-4 rounded-xl shadow-xl backdrop-blur-lg border max-w-md',
          'animate-slide-in-right',
          toast.type === 'success' && 'bg-green-50/95 border-green-200 text-green-800',
          toast.type === 'error' && 'bg-red-50/95 border-red-200 text-red-800',
          toast.type === 'warning' && 'bg-yellow-50/95 border-yellow-200 text-yellow-800',
          toast.type === 'info' && 'bg-blue-50/95 border-blue-200 text-blue-800'
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
            <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
            <AlertCircle v-else-if="toast.type === 'warning'" class="w-5 h-5" />
            <Info v-else class="w-5 h-5" />
          </div>

          <!-- Message -->
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm leading-relaxed">{{ toast.message }}</p>
          </div>

          <!-- Close button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'
import { setGlobalToast } from '@/utils/toast'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

const toasts = ref<Toast[]>([])
let nextId = 1

function showToast(message: string, type: Toast['type'] = 'info', duration = 4000) {
  const id = nextId++
  const toast: Toast = { id, type, message }
  
  toasts.value.push(toast)
  
  // Auto-remove after duration
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// Register as global toast handler on mount
onMounted(() => {
  setGlobalToast(showToast)
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
</style>
