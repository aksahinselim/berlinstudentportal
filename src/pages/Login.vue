<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-white flex items-center justify-center py-12 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-primary/15 via-zinc-300/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-zinc-400/5 to-primary/5 rounded-full blur-2xl animate-float-slow"></div>
    </div>

    <div class="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div 
        class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
        v-motion
        :initial="{ opacity: 0, y: 50, scale: 0.95 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 800, delay: 200 } }"
      >
        <!-- Header -->
        <div 
          class="text-center mb-8"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
        >
          <div 
            class="flex items-center justify-center mb-4"
            v-motion
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 500, delay: 300 } }"
          >
            <div class="relative">
              <div class="absolute inset-0 bg-primary/10 blur-xl rounded-full"></div>
              <img src="/bsp-logo.png" alt="BSP Logo" class="h-16 w-16 relative" />
            </div>
          </div>
          <h1 
            class="text-3xl font-bold text-black mb-2"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 500 } }"
          >
            {{ t.auth.loginTitle }}
          </h1>
          <p 
            class="text-zinc-600"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 600 } }"
          >
            {{ t.nav.login }}
          </p>
        </div>

        <!-- Login Form -->
        <form 
          @submit.prevent="handleLogin" 
          class="space-y-6"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 700 } }"
        >
          <div>
            <label for="email" class="block text-sm font-medium text-black mb-2">
              {{ t.auth.email }}
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-black mb-2">
              {{ t.auth.password }}
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center justify-end">
          <router-link
            to="/forgot-password"
            class="text-sm text-primary hover:underline"
          >
            {{ t.auth.forgotPassword }}
          </router-link>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:shadow-primary/20"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 1000 } }"
          >
            {{ t.nav.login }}
          </button>
        </form>

        <!-- Register link -->
        <div 
          class="mt-6 text-center text-sm text-zinc-600"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 600, delay: 1200 } }"
        >
          {{ t.auth.dontHaveAccount }}
          <router-link to="/register" class="text-primary font-medium hover:underline">
            {{ t.nav.register }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useI18nStore } from '@/store/i18n'
import { toast } from '@/utils/toast'
import * as authApi from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

const email = ref('')
const password = ref('')
const showOtpPrompt = ref(false)

async function handleLogin() {
  try {
    const result = await authApi.login({
      email: email.value,
      password: password.value,
    })

    if (result.success && result.data) {
      // Login successful
      authStore.currentUser = result.data.user
      
      // Redirect to feed
      router.push('/feed')
    } else if (result.error) {
      // Check if email verification is required
      if (result.error.includes('verify your email') || (result as any).requiresEmailVerification) {
        showOtpPrompt.value = true
        toast.warning('Please verify your email before logging in. Check your inbox for the verification code.')
        // Optionally redirect to a verification page
        // router.push({ name: 'Verification', query: { email: email.value } })
      } else {
        toast.error(result.error || 'Invalid credentials.')
      }
    }
  } catch (error) {
    toast.error('An error occurred during login. Please try again.')
  }
}

</script>

<style scoped>
/* Floating animations for background */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.05);
  }
  50% {
    transform: translate(-15px, 15px) scale(0.95);
  }
  75% {
    transform: translate(25px, 10px) scale(1.02);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(-25px, 20px) scale(1.03) rotate(2deg);
  }
  50% {
    transform: translate(20px, -10px) scale(0.97) rotate(-2deg);
  }
  75% {
    transform: translate(-15px, -15px) scale(1.01) rotate(1deg);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-slow {
  animation: float-slow 30s ease-in-out infinite;
  animation-delay: 4s;
}

/* Disable animations for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-delayed,
  .animate-float-slow {
    animation: none !important;
  }
}
</style>

