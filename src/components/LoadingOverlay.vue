<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
          <!-- Animated Logo -->
          <div class="relative">
            <div class="w-20 h-20 rounded-full bg-primary/20 animate-ping absolute"></div>
            <div class="w-20 h-20 rounded-full bg-primary flex items-center justify-center relative">
              <svg
                class="w-10 h-10 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>

          <!-- Message -->
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ message }}</p>
          </div>

          <!-- Progress Bar -->
          <div class="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-primary animate-progress"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  title?: string;
  message?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Please wait...',
  message: 'Processing your request',
});
</script>

<style scoped>
.bg-primary {
  background-color: #E2382A;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Progress bar animation */
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
  width: 25%;
}
</style>
