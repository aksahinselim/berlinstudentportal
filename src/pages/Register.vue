<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-white py-12 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-primary/15 via-zinc-300/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-zinc-400/5 to-primary/5 rounded-full blur-2xl animate-float-slow"></div>
    </div>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          <h1 class="text-3xl font-bold text-black mb-2">{{ t.auth.registerTitle }}</h1>
          <p class="text-zinc-600">{{ t.auth.createAccount }}</p>
        </div>

        <!-- Progress indicator -->
        <div 
          class="flex items-center justify-center mb-8"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 500 } }"
        >
          <div class="flex items-center space-x-2">
            <div 
              :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500', step >= 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-zinc-200 text-zinc-500']"
              v-motion
              :initial="{ scale: 0.8 }"
              :enter="{ scale: 1, transition: { duration: 400, delay: 600 } }"
            >
              1
            </div>
            <div 
              :class="['w-16 h-1 transition-all duration-500', step >= 2 ? 'bg-primary' : 'bg-zinc-200']"
              v-motion
              :initial="{ scaleX: 0 }"
              :enter="{ scaleX: 1, transition: { duration: 600, delay: 800 } }"
            ></div>
            <div 
              :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500', step >= 2 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-zinc-200 text-zinc-500']"
              v-motion
              :initial="{ scale: 0.8 }"
              :enter="{ scale: 1, transition: { duration: 400, delay: 1000 } }"
            >
              2
            </div>
          </div>
        </div>

        <!-- Step 1: Basic Info -->
        <form v-if="step === 1" @submit.prevent="goToStep2" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-black mb-2">
              Full Name <span class="text-primary">*</span>
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-black mb-2">
              University Email <span class="text-primary">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="student@example.com"
            />
            <p class="text-xs text-zinc-500 mt-1">Use your official university email address</p>
          </div>

          <div>
            <label for="university" class="block text-sm font-medium text-black mb-2">
              University <span class="text-primary">*</span>
            </label>
            <select
              id="university"
              v-model="formData.uniId"
              required
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="" disabled>Select your university</option>
              <option v-for="uni in universities" :key="uni.id" :value="uni.id">
                {{ uni.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-black mb-2">
              Password <span class="text-primary">*</span>
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
            <PasswordStrengthIndicator :password="formData.password" :show-checklist="true" />
          </div>

          <div>
            <label for="dob" class="block text-sm font-medium text-black mb-2">
              Date of Birth <span class="text-primary">*</span>
            </label>
            <input
              id="dob"
              v-model="formData.dob"
              type="date"
              required
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-black mb-2">
              Address
            </label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Berlin, Germany"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold"
          >
            Continue
          </button>
        </form>

        <!-- Step 2: Review -->
        <div v-if="step === 2" class="space-y-6">
          <div class="bg-zinc-50 rounded-xl p-6 space-y-4">
            <h3 class="font-bold text-lg text-black mb-4">Review Your Information</h3>
            
            <div>
              <p class="text-sm text-zinc-500">Full Name</p>
              <p class="text-black font-medium">{{ formData.name }}</p>
            </div>
            
            <div>
              <p class="text-sm text-zinc-500">Email</p>
              <p class="text-black font-medium">{{ formData.email }}</p>
            </div>
            
            <div>
              <p class="text-sm text-zinc-500">University</p>
              <p class="text-black font-medium">{{ selectedUniversityName }}</p>
            </div>
            
            <div>
              <p class="text-sm text-zinc-500">Date of Birth</p>
              <p class="text-black font-medium">{{ formData.dob }}</p>
            </div>
            
            <div v-if="formData.address">
              <p class="text-sm text-zinc-500">Address</p>
              <p class="text-black font-medium">{{ formData.address }}</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="step = 1"
              class="flex-1 py-3 bg-zinc-200 text-black rounded-xl hover:bg-zinc-300 transition-colors font-medium"
            >
              Back
            </button>
            <button
              @click="handleSubmit"
              class="flex-1 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold"
            >
              Create Account
            </button>
          </div>
        </div>

        <!-- Login link -->
        <div class="mt-6 text-center text-sm text-zinc-600">
          {{ t.auth.alreadyHaveAccount }}
          <router-link to="/login" class="text-primary font-medium hover:underline">
            {{ t.nav.login }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- OTP Modal -->
    <OtpModal
      :is-open="showOtpModal"
      :email="formData.email"
      @close="showOtpModal = false"
      @verified="handleOtpVerified"
    />

    <!-- Student Verification Modal -->
    <StudentVerificationModal
      :show="showVerificationModal"
      @close="showVerificationModal = false"
      @success="handleVerificationSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { useI18nStore } from '@/store/i18n'
import { toast } from '@/utils/toast'
import { validatePassword } from '@/utils/validation'
import OtpModal from '@/components/OtpModal.vue'
import StudentVerificationModal from '@/components/StudentVerificationModal.vue'
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator.vue'
import * as authApi from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

const universities = computed(() => appStore.universities)

const step = ref(1)
const showOtpModal = ref(false)
const showVerificationModal = ref(false)

const formData = ref({
  name: '',
  email: '',
  password: '',
  uniId: '' as number | '',
  dob: '',
  address: '',
})

const selectedUniversityName = computed(() => {
  return universities.value.find(u => u.id === formData.value.uniId)?.name || ''
})

function goToStep2() {
  step.value = 2
}

async function handleSubmit() {
  // Validate password strength
  const passwordValidation = validatePassword(formData.value.password)
  if (!passwordValidation.isValid) {
    toast.error('Please choose a stronger password')
    return
  }
  
  try {
    // Register user
    const result = await authApi.register({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      uniId: formData.value.uniId as number,
    })

    if (result.success && result.data) {
      // Check if email verification is required
      if (result.data.requiresEmailOtp) {
        // Show OTP modal
        showOtpModal.value = true
      } else {
        // Old flow - direct login (shouldn't happen with new backend)
        authStore.currentUser = result.data.user
        toast.success(`Account created successfully! Welcome, ${result.data.user.handle}`)
        router.push('/feed')
      }
    } else {
      toast.error(result.error || 'Registration failed.')
    }
  } catch (error) {
    toast.error('An error occurred during registration. Please try again.')
  }
}

function handleOtpVerified(data: { user: any; token: string }) {
  // Update auth store with verified user
  authStore.currentUser = data.user
  
  // Close OTP modal
  showOtpModal.value = false
  
  // Show verification modal instead of redirecting to feed
  showVerificationModal.value = true
}

function handleVerificationSuccess() {
  // Verification modal will handle redirect to feed
  showVerificationModal.value = false
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

