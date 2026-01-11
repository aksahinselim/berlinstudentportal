<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail class="w-8 h-8 text-primary" />
            </div>
            <h2 class="text-2xl font-bold text-black mb-2">Verify Your Email</h2>
            <p class="text-zinc-600">
              We've sent a 6-digit code to<br />
              <span class="font-medium text-black">{{ email }}</span>
            </p>
          </div>

          <!-- OTP Input -->
          <form @submit.prevent="handleVerify" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-black mb-2">
                Enter Verification Code
              </label>
              <div class="flex gap-2 justify-center">
                <input
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  :ref="el => otpInputs[index] = el as HTMLInputElement"
                  v-model="otpDigits[index]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="w-12 h-14 text-center text-2xl font-bold border-2 border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  :class="{ 'border-red-500': error }"
                  @input="handleInput(index, $event)"
                  @keydown="handleKeydown(index, $event)"
                  @paste="handlePaste"
                />
              </div>
              <p v-if="error" class="text-red-600 text-sm mt-2 text-center">{{ error }}</p>
            </div>

            <!-- Timer and Resend -->
            <div class="text-center">
              <p v-if="!canResend" class="text-sm text-zinc-600">
                Didn't receive the code?
                <span class="font-medium">Resend in {{ resendTimer }}s</span>
              </p>
              <button
                v-else
                type="button"
                @click="handleResend"
                :disabled="isResending"
                class="text-sm text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isResending ? 'Sending...' : 'Resend Code' }}
              </button>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 py-3 bg-zinc-200 text-black rounded-xl hover:bg-zinc-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!isCodeComplete || isVerifying"
                class="flex-1 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {{ isVerifying ? 'Verifying...' : 'Verify' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Mail } from 'lucide-vue-next'
import * as authApi from '@/api/auth'

interface Props {
  isOpen: boolean
  email: string
}

interface Emits {
  (e: 'close'): void
  (e: 'verified', data: { user: any; token: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])
const error = ref('')
const isVerifying = ref(false)
const isResending = ref(false)
const resendTimer = ref(60)
const canResend = ref(false)
let timerInterval: NodeJS.Timeout | null = null

const isCodeComplete = computed(() => 
  otpDigits.value.every(digit => digit.length === 1)
)

const otpCode = computed(() => otpDigits.value.join(''))

// Auto-focus first input when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      otpInputs.value[0]?.focus()
    }, 100)
    startResendTimer()
  } else {
    stopResendTimer()
  }
})

function handleInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }

  error.value = ''

  // Move to next input if digit entered
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpInputs.value[index - 1]?.focus()
    }
  }
  // Handle left arrow
  else if (event.key === 'ArrowLeft' && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  // Handle right arrow
  else if (event.key === 'ArrowRight' && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  
  if (pastedData && /^\d{6}$/.test(pastedData)) {
    otpDigits.value = pastedData.split('')
    otpInputs.value[5]?.focus()
    error.value = ''
  }
}

async function handleVerify() {
  if (!isCodeComplete.value || isVerifying.value) return

  isVerifying.value = true
  error.value = ''

  try {
    const result = await authApi.verifyEmailOtp({
      email: props.email,
      code: otpCode.value,
    })

    if (result.success && result.data) {
      emit('verified', result.data)
    } else {
      error.value = result.error || 'Verification failed'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    isVerifying.value = false
  }
}

async function handleResend() {
  if (!canResend.value || isResending.value) return

  isResending.value = true
  error.value = ''

  try {
    const result = await authApi.resendOtp({ email: props.email })

    if (result.success) {
      // Reset form
      otpDigits.value = ['', '', '', '', '', '']
      otpInputs.value[0]?.focus()
      
      // Restart timer
      resendTimer.value = 60
      canResend.value = false
      startResendTimer()
      
      // Show success message briefly
      error.value = ''
    } else {
      error.value = result.error || 'Failed to resend code'
    }
  } catch (err) {
    error.value = 'Failed to resend code. Please try again.'
  } finally {
    isResending.value = false
  }
}

function startResendTimer() {
  stopResendTimer()
  resendTimer.value = 60
  canResend.value = false

  timerInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      canResend.value = true
      stopResendTimer()
    }
  }, 1000)
}

function stopResendTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function handleClose() {
  if (!isVerifying.value) {
    emit('close')
  }
}

onMounted(() => {
  if (props.isOpen) {
    startResendTimer()
  }
})

onUnmounted(() => {
  stopResendTimer()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Remove spinner from number inputs */
input[type="text"]::-webkit-outer-spin-button,
input[type="text"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="text"] {
  -moz-appearance: textfield;
}
</style>
