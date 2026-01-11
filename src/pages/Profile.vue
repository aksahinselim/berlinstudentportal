<template>
  <div class="min-h-screen bg-zinc-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-black mb-2">{{ t.profile.title }}</h1>
        <p class="text-zinc-600">{{ t.profile.manageAccount }}</p>
      </div>

      <!-- Verification Status -->
      <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-8 mb-6">
        <h2 class="text-xl font-bold text-black mb-4">{{ t.profile.verificationStatus }}</h2>

        <div v-if="authStore.currentUser?.status === 'pending'" class="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div class="flex items-start gap-4">
            <Clock class="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold text-yellow-900 mb-2 text-lg">{{ t.profile.pendingVerification }}</h3>
              <p class="text-yellow-800 mb-4">
                {{ t.profile.pendingVerificationDesc }}
              </p>
              <router-link
                to="/verification"
                class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium"
              >
                {{ t.profile.viewVerificationStatus }}
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>
          </div>
        </div>

        <div v-else-if="authStore.currentUser?.status === 'verified'" class="p-6 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-start gap-4">
            <CheckCircle class="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold text-green-900 mb-1 text-lg">{{ t.profile.accountVerified }}</h3>
              <p class="text-green-800">
                {{ t.profile.accountVerifiedDesc }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="p-6 bg-zinc-50 border border-zinc-200 rounded-xl">
          <div class="flex items-start gap-4">
            <AlertCircle class="w-8 h-8 text-zinc-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold text-zinc-900 mb-2 text-lg">{{ t.profile.notVerified }}</h3>
              <p class="text-zinc-700 mb-4">
                {{ t.profile.notVerifiedDesc }}
              </p>
              <router-link
                to="/verification"
                class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-medium"
              >
                {{ t.profile.startVerification }}
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Information -->
      <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-8 mb-6">
        <h2 class="text-xl font-bold text-black mb-6">{{ t.profile.accountInfo }}</h2>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-2">{{ t.auth.name }}</label>
              <p class="text-black font-medium">{{ authStore.currentUser?.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-2">{{ t.auth.email }}</label>
              <p class="text-black font-medium">{{ authStore.currentUser?.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-2">{{ t.profile.myUniversities }}</label>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  <GraduationCap class="w-4 h-4" />
                  {{ universityName }}
                  <span class="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">{{ t.common.primary }}</span>
                </span>
                <!-- Additional universities would be displayed here -->
                <button
                  @click="showAddUniversityModal = true"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed border-zinc-300 text-zinc-500 hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus class="w-4 h-4" />
                  {{ t.profile.addUniversity }}
                </button>
              </div>
            </div>

            <div>
              <label for="handle" class="block text-sm font-medium text-zinc-700 mb-2">
                {{ t.profile.displayHandle }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  id="handle"
                  v-model="editableHandle"
                  type="text"
                  class="flex-1 px-4 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  v-if="editableHandle !== authStore.currentUser?.handle"
                  @click="saveHandle"
                  class="px-4 py-2 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-medium"
                >
                  {{ t.common.save }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-8 mb-6">
        <h2 class="text-xl font-bold text-black mb-6">{{ t.profile.preferences }}</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-black">{{ t.profile.emailNotifications }}</h3>
              <p class="text-sm text-zinc-600">{{ t.profile.emailNotificationsDesc }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="emailNotifications" class="sr-only peer" />
              <div class="w-11 h-6 bg-zinc-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-black">{{ t.profile.anonymousPosting }}</h3>
              <p class="text-sm text-zinc-600">{{ t.profile.anonymousPostingDesc }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="anonymousPosting" class="sr-only peer" />
              <div class="w-11 h-6 bg-zinc-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white rounded-2xl shadow-lg border border-red-200 p-8">
        <h2 class="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        
        <div class="space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 class="font-bold text-red-900 mb-2">{{ t.profile.deleteAccount }}</h3>
            <p class="text-sm text-red-700 mb-4">
              {{ t.profile.deleteAccountWarning }}
            </p>
            <button
              @click="showDeleteConfirm = true"
              class="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              {{ t.profile.deleteAccount }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add University Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showAddUniversityModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="resetAddUniModal"
          >
            <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <!-- Header -->
              <div class="flex items-center justify-between p-6 border-b border-zinc-200">
                <h2 class="text-xl font-bold text-black">{{ t.profile.addUniversity }}</h2>
                <button @click="resetAddUniModal" class="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors">
                  <X class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Step 1: Select University -->
              <div v-if="addUniStep === 1" class="p-6">
                <div class="mb-6">
                  <label class="block text-sm font-medium text-black mb-2">{{ t.auth.university }}</label>
                  <select
                    v-model="selectedNewUniId"
                    class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option :value="null" disabled>Select a university...</option>
                    <option v-for="uni in availableUniversities" :key="uni.id" :value="uni.id">
                      {{ uni.name }}
                    </option>
                  </select>
                </div>
                
                <button
                  @click="addUniStep = 2"
                  :disabled="!selectedNewUniId"
                  class="w-full py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {{ t.common.next }}
                </button>
              </div>
              
              <!-- Step 2: Upload Documents -->
              <div v-else-if="addUniStep === 2" class="p-6">
                <div class="mb-6">
                  <p class="text-sm text-zinc-600 mb-4">
                    To verify your enrollment at this university, please upload a selfie and your student card.
                  </p>
                  
                  <!-- Selfie Upload -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-black mb-2">{{ t.verification.uploadSelfie }}</label>
                    <div 
                      class="relative border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
                      @click="($refs.selfieInput as HTMLInputElement).click()"
                    >
                      <input
                        ref="selfieInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleSelfieSelect"
                      />
                      <div v-if="selfiePreview" class="relative">
                        <img :src="selfiePreview" alt="Selfie preview" class="max-h-40 mx-auto rounded-lg" />
                        <div class="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span class="text-white text-sm">Click to change</span>
                        </div>
                      </div>
                      <div v-else class="text-zinc-500">
                        <Camera class="w-12 h-12 mx-auto mb-2 text-zinc-400" />
                        <p class="text-sm">Click to upload selfie</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Student Card Upload -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-black mb-2">{{ t.verification.uploadStudentCard }}</label>
                    <div 
                      class="relative border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
                      @click="($refs.cardInput as HTMLInputElement).click()"
                    >
                      <input
                        ref="cardInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleCardSelect"
                      />
                      <div v-if="cardPreview" class="relative">
                        <img :src="cardPreview" alt="Card preview" class="max-h-40 mx-auto rounded-lg" />
                        <div class="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span class="text-white text-sm">Click to change</span>
                        </div>
                      </div>
                      <div v-else class="text-zinc-500">
                        <CreditCard class="w-12 h-12 mx-auto mb-2 text-zinc-400" />
                        <p class="text-sm">Click to upload student card</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex gap-3">
                  <button
                    @click="addUniStep = 1"
                    class="flex-1 py-3 bg-zinc-200 text-black rounded-xl hover:bg-zinc-300 transition-colors font-medium"
                  >
                    {{ t.common.back }}
                  </button>
                  <button
                    @click="handleSubmitNewUniversity"
                    :disabled="!selfieFile || !cardFile || isSubmittingUni"
                    class="flex-1 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Loader2 v-if="isSubmittingUni" class="w-5 h-5 animate-spin" />
                    {{ isSubmittingUni ? t.common.loading : t.common.submit }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
      
      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h3 class="text-2xl font-bold text-red-600 mb-4">⚠️ Confirm Account Deletion</h3>
          <p class="text-zinc-700 mb-4">
            Are you absolutely sure you want to delete your account? This action cannot be undone.
          </p>
          <p class="text-sm text-zinc-600 mb-6">
            Type <strong class="text-black">"DELETE"</strong> to confirm:
          </p>
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="Type DELETE"
            class="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
          />
          <div class="flex gap-3">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 px-4 py-3 bg-zinc-100 text-zinc-700 rounded-xl hover:bg-zinc-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteAccount"
              :disabled="deleteConfirmText !== 'DELETE' || deleting"
              class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ deleting ? 'Deleting...' : 'Delete Forever' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, CheckCircle, AlertCircle, ArrowRight, GraduationCap, Plus, Camera, CreditCard, X, Upload, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { useI18nStore } from '@/store/i18n'
import { toast } from '@/utils/toast'
import * as authApi from '@/api/auth'
import * as verificationApi from '@/api/verifications'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

const editableHandle = ref(authStore.currentUser?.handle || '')
const emailNotifications = ref(true)
const anonymousPosting = ref(true)

const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')
const deleting = ref(false)

// Add University Modal
const showAddUniversityModal = ref(false)
const selectedNewUniId = ref<number | null>(null)
const selfieFile = ref<File | null>(null)
const cardFile = ref<File | null>(null)
const selfiePreview = ref<string | null>(null)
const cardPreview = ref<string | null>(null)
const isSubmittingUni = ref(false)
const addUniStep = ref(1) // 1: select uni, 2: upload documents

// Get available universities (excluding current one)
const availableUniversities = computed(() => {
  return appStore.universities.filter(u => u.id !== authStore.currentUser?.uniId)
})

function handleSelfieSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selfieFile.value = input.files[0]
    selfiePreview.value = URL.createObjectURL(input.files[0])
  }
}

function handleCardSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    cardFile.value = input.files[0]
    cardPreview.value = URL.createObjectURL(input.files[0])
  }
}

function resetAddUniModal() {
  showAddUniversityModal.value = false
  selectedNewUniId.value = null
  selfieFile.value = null
  cardFile.value = null
  selfiePreview.value = null
  cardPreview.value = null
  addUniStep.value = 1
  isSubmittingUni.value = false
}

async function handleSubmitNewUniversity() {
  if (!selectedNewUniId.value || !selfieFile.value || !cardFile.value) {
    toast.error('Please complete all required fields')
    return
  }
  
  isSubmittingUni.value = true
  
  try {
    // Submit verification using the existing API
    const result = await verificationApi.submitVerification(selfieFile.value, cardFile.value)
    
    if (result.success) {
      toast.success(t.value.verification.pending + ' - ' + t.value.success.profileUpdated)
      resetAddUniModal()
    } else {
      throw new Error(result.error || 'Failed to submit verification')
    }
  } catch (error: any) {
    console.error('Add university error:', error)
    toast.error(error.message || t.value.errors.somethingWentWrong)
  } finally {
    isSubmittingUni.value = false
  }
}

// Fetch universities on mount
onMounted(() => {
  if (appStore.universities.length === 0) {
    appStore.fetchUniversities()
  }
})

const universityName = computed(() => {
  if (!authStore.currentUser) return ''
  return appStore.universities.find(u => u.id === authStore.currentUser!.uniId)?.name || 'Unknown'
})

async function saveHandle() {
  if (editableHandle.value.trim()) {
    await authStore.updateProfile(editableHandle.value.trim())
    toast.success('Display handle updated successfully!')
  }
}

async function handleDeleteAccount() {
  if (deleteConfirmText.value !== 'DELETE') {
    toast.error('Please type DELETE to confirm')
    return
  }
  
  deleting.value = true
  
  try {
    const result = await authApi.deleteAccount()
    
    if (result.success) {
      toast.success('Your account has been deleted. A confirmation email has been sent.')
      
      // Clear auth state
      authStore.currentUser = null
      
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      toast.error(result.error || 'Failed to delete account')
      deleting.value = false
    }
  } catch (error: any) {
    console.error('Delete account error:', error)
    toast.error('An error occurred while deleting your account')
    deleting.value = false
  }
}
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

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>