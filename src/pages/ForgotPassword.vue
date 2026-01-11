<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 relative">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <router-link to="/" class="inline-block mb-8">
          <img src="/bsp-logo.png" alt="BSP" class="h-16 mx-auto" />
        </router-link>
        <h2 class="text-3xl font-bold text-gray-900">{{ t.auth.resetPassword }}</h2>
        <p class="mt-2 text-gray-600">{{ t.auth.email }}</p>
      </div>

      <!-- Step 1: Request OTP -->
      <div v-if="step === 'email'" class="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <form @submit.prevent="handleRequestOtp" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="!loading">Send Reset Code</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          </button>
        </form>

        <div class="text-center">
          <router-link to="/login" class="text-sm text-primary hover:underline">
            Back to Login
          </router-link>
        </div>
      </div>

      <!-- Step 2: Verify OTP and Reset Password -->
      <div v-if="step === 'reset'" class="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div class="text-center mb-6">
          <p class="text-sm text-gray-600">
            Verification code sent to <strong>{{ email }}</strong>
          </p>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              id="code"
              v-model="code"
              type="text"
              maxlength="6"
              required
              pattern="[0-9]{6}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
            />
            <p class="mt-2 text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Enter new password"
            />
            <PasswordStrengthIndicator :password="newPassword" :show-checklist="true" />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="!loading">Reset Password</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
          </button>
        </form>

        <div class="text-center">
          <button
            @click="handleResendOtp"
            :disabled="resendCooldown > 0"
            class="text-sm text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code' }}
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="step === 'success'" class="bg-white rounded-lg shadow-lg p-8 space-y-6 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">Password Reset Successful!</h3>
        <p class="text-gray-600">You can now login with your new password</p>
        <router-link
          to="/login"
          class="inline-block w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-all"
        >
          Go to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18nStore } from '@/store/i18n';
import { toast } from '@/utils/toast';
import { validatePassword } from '@/utils/validation';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator.vue';
import { authApi } from '../api/auth';

const router = useRouter();
const i18nStore = useI18nStore();
const t = computed(() => i18nStore.t);

// State
const step = ref<'email' | 'reset' | 'success'>('email');
const email = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const resendCooldown = ref(0);

// Request OTP
async function handleRequestOtp() {
  if (!email.value) return;

  loading.value = true;
  try {
    const response = await authApi.forgotPassword(email.value);
    
    if (response.success) {
      step.value = 'reset';
      startResendCooldown();
    } else {
      toast.error(response.error || 'Failed to send reset code');
    }
  } catch (error: any) {
    console.error('Request OTP error:', error);
    toast.error(error.response?.data?.error || 'Failed to send reset code');
  } finally {
    loading.value = false;
  }
}

// Reset Password
async function handleResetPassword() {
  if (!code.value || !newPassword.value || !confirmPassword.value) {
    toast.warning('Please fill in all fields');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error('Passwords do not match');
    return;
  }

  // Validate password strength
  const passwordValidation = validatePassword(newPassword.value);
  if (!passwordValidation.isValid) {
    toast.error('Please choose a stronger password');
    return;
  }

  loading.value = true;
  try {
    const response = await authApi.resetPassword(email.value, code.value, newPassword.value);
    
    if (response.success) {
      step.value = 'success';
    } else {
      toast.error(response.error || 'Failed to reset password');
    }
  } catch (error: any) {
    console.error('Reset password error:', error);
    toast.error(error.response?.data?.error || 'Failed to reset password');
  } finally {
    loading.value = false;
  }
}

// Resend OTP
async function handleResendOtp() {
  if (resendCooldown.value > 0) return;

  loading.value = true;
  try {
    const response = await authApi.forgotPassword(email.value);
    
    if (response.success) {
      startResendCooldown();
      toast.success('New code sent to your email');
    }
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    toast.error('Failed to resend code');
  } finally {
    loading.value = false;
  }
}

// Resend cooldown timer
function startResendCooldown() {
  resendCooldown.value = 60;
  const interval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}
</script>

<style scoped>
.bg-primary {
  background-color: #E2382A;
}

.bg-primary-dark {
  background-color: #c42f22;
}

.text-primary {
  color: #E2382A;
}

.ring-primary {
  --tw-ring-color: #E2382A;
}
</style>
