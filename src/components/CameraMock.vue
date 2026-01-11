<template>
  <div class="space-y-4">
    <div 
      class="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center"
      :class="{ 'ring-4 ring-primary': isCapturing }"
    >
      <div v-if="!capturedImage" class="text-white text-center">
        <Camera class="w-16 h-16 mx-auto mb-4" />
        <p class="text-lg">Camera Preview</p>
        <p class="text-sm text-zinc-400 mt-2">Mock camera for verification</p>
      </div>
      
      <img 
        v-else
        :src="capturedImage" 
        alt="Captured verification photo" 
        class="w-full h-full object-cover"
      />

      <!-- Shutter animation overlay -->
      <Transition name="shutter">
        <div v-if="isCapturing" class="absolute inset-0 bg-white"></div>
      </Transition>
    </div>

    <div class="flex gap-3 justify-center">
      <button
        v-if="!capturedImage"
        @click="capture"
        class="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-medium"
      >
        <Camera class="w-5 h-5" />
        Capture Photo
      </button>
      
      <template v-else>
        <button
          @click="retake"
          class="flex items-center gap-2 px-6 py-3 bg-zinc-200 text-black rounded-xl hover:bg-zinc-300 transition-colors font-medium"
        >
          <RotateCcw class="w-5 h-5" />
          Retake
        </button>
        <button
          @click="submit"
          class="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-medium"
        >
          <Check class="w-5 h-5" />
          Submit for Review
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Camera, RotateCcw, Check } from 'lucide-vue-next'

const emit = defineEmits<{
  submit: [imageUrl: string]
}>()

const capturedImage = ref<string | null>(null)
const isCapturing = ref(false)

// Mock images for verification
const mockImages = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
]

function capture() {
  isCapturing.value = true
  
  // Simulate camera shutter
  setTimeout(() => {
    isCapturing.value = false
    // Use a random mock image
    capturedImage.value = mockImages[Math.floor(Math.random() * mockImages.length)]
  }, 200)
}

function retake() {
  capturedImage.value = null
}

function submit() {
  if (capturedImage.value) {
    emit('submit', capturedImage.value)
  }
}
</script>

<style scoped>
.shutter-enter-active {
  transition: opacity 0.2s ease;
}

.shutter-leave-active {
  transition: opacity 0.2s ease;
}

.shutter-enter-from,
.shutter-leave-to {
  opacity: 0;
}
</style>

