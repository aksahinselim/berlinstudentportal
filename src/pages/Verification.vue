<template>
  <div class="min-h-screen bg-zinc-50 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck class="w-8 h-8 text-primary" />
          </div>
          <h1 class="text-3xl font-bold text-black mb-2">Verify Your Identity</h1>
          <p class="text-zinc-600">
            Take a selfie while holding your student ID to complete verification
          </p>
        </div>

        <!-- Status check -->
        <div v-if="authStore.currentUser?.status === 'pending' && hasSubmitted" class="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div class="flex items-start gap-3">
            <Clock class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold text-yellow-900 mb-1">Verification Pending</h3>
              <p class="text-sm text-yellow-800">
                Your verification is being reviewed by our team. This usually takes 24-48 hours. 
                We'll notify you via email once your account is verified.
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="authStore.currentUser?.status === 'verified'" class="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-start gap-3">
            <CheckCircle class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold text-green-900 mb-1">Account Verified!</h3>
              <p class="text-sm text-green-800">
                Your account has been verified. You can now access all features.
              </p>
            </div>
          </div>
          <router-link 
            to="/feed"
            class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-medium"
          >
            Go to Feed
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <!-- Camera Section -->
        <div v-if="!hasSubmitted" class="space-y-6">
          <div class="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 class="font-bold text-black mb-3">Instructions:</h3>
            <ol class="list-decimal list-inside space-y-2 text-zinc-700">
              <li>Hold your student ID card clearly visible next to your face</li>
              <li>Make sure your face and the ID are well-lit and in focus</li>
              <li>Click "Capture Photo" when ready</li>
              <li>Review the photo and submit for verification</li>
            </ol>
          </div>

          <CameraMock @submit="handleSubmit" />

          <div class="text-center text-sm text-zinc-500">
            <p>Your photo will be reviewed within 24-48 hours</p>
            <p class="mt-1">We respect your privacy and only use this for verification</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck, Clock, CheckCircle, ArrowRight } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { toast } from '@/utils/toast'
import CameraMock from '@/components/CameraMock.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const hasSubmitted = ref(false)

async function handleSubmit(imageUrl: string) {
  if (!authStore.currentUser) return

  // Add verification request
  await appStore.addVerification({
    uniId: authStore.currentUser.uniId,
    selfieUrl: imageUrl,
    cardUrl: imageUrl, // In real app, this would be a separate capture
  })

  // Mark as submitted
  hasSubmitted.value = true

  // Show success message
  toast.success('Verification submitted successfully! You will receive an email once approved.')
}
</script>

