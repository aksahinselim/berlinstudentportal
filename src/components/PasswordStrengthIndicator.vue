<template>
  <div v-if="password" class="mt-2 space-y-2">
    <!-- Strength Bar -->
    <div class="flex gap-1">
      <div
        v-for="i in 4"
        :key="i"
        :class="[
          'h-1 flex-1 rounded-full transition-all duration-300',
          getBarColor(i)
        ]"
      ></div>
    </div>

    <!-- Strength Label -->
    <div class="flex items-center justify-between">
      <span :class="['text-sm font-medium', strengthColor]">
        {{ strengthLabel }}
      </span>
      <span class="text-xs text-zinc-500">
        {{ validation.score }}/100
      </span>
    </div>

    <!-- Error Messages -->
    <ul v-if="validation.errors.length > 0" class="space-y-1 mt-2">
      <li
        v-for="(error, index) in validation.errors"
        :key="index"
        class="text-xs text-red-600 flex items-start gap-1"
      >
        <span class="flex-shrink-0 mt-0.5">•</span>
        <span>{{ error }}</span>
      </li>
    </ul>

    <!-- Requirements Checklist (optional) -->
    <div v-if="showChecklist" class="mt-3 space-y-1">
      <div
        v-for="(req, index) in requirements"
        :key="index"
        :class="['text-xs flex items-center gap-2', req.met ? 'text-green-600' : 'text-zinc-500']"
      >
        <component :is="req.met ? CheckCircle2 : Circle" class="w-3 h-3" />
        <span>{{ req.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Circle } from 'lucide-vue-next'
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthBg } from '@/utils/validation'

const props = defineProps<{
  password: string
  showChecklist?: boolean
}>()

const validation = computed(() => validatePassword(props.password))

const strengthLabel = computed(() => {
  switch (validation.value.strength) {
    case 'weak':
      return '🔴 Weak'
    case 'medium':
      return '🟡 Medium'
    case 'strong':
      return '🔵 Strong'
    case 'very-strong':
      return '🟢 Very Strong'
    default:
      return ''
  }
})

const strengthColor = computed(() => getPasswordStrengthColor(validation.value.strength))

function getBarColor(index: number): string {
  const score = validation.value.score
  
  if (index === 1 && score >= 25) {
    return getPasswordStrengthBg(validation.value.strength)
  } else if (index === 2 && score >= 50) {
    return getPasswordStrengthBg(validation.value.strength)
  } else if (index === 3 && score >= 75) {
    return getPasswordStrengthBg(validation.value.strength)
  } else if (index === 4 && score >= 90) {
    return getPasswordStrengthBg(validation.value.strength)
  }
  
  return 'bg-zinc-200'
}

const requirements = computed(() => [
  { label: '8+ characters', met: props.password.length >= 8 },
  { label: 'Uppercase letter (A-Z)', met: /[A-Z]/.test(props.password) },
  { label: 'Lowercase letter (a-z)', met: /[a-z]/.test(props.password) },
  { label: 'Number (0-9)', met: /[0-9]/.test(props.password) },
  { label: 'Special character (!@#$%)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(props.password) }
])
</script>
