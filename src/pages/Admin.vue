<template>
  <div class="min-h-screen bg-zinc-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-black mb-2">Admin Panel</h1>
        <p class="text-zinc-600">Review and manage student verifications</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-600 text-sm mb-1">Pending</p>
              <p class="text-3xl font-bold text-black">{{ pendingCount }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-600 text-sm mb-1">Approved Today</p>
              <p class="text-3xl font-bold text-black">{{ approvedTodayCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-600 text-sm mb-1">Total Verified</p>
              <p class="text-3xl font-bold text-black">{{ totalVerifiedCount }}</p>
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield class="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Verifications Table -->
      <div class="bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden">
        <div class="p-6 border-b border-zinc-200">
          <h2 class="text-xl font-bold text-black">Pending Verifications</h2>
        </div>

        <div v-if="pendingVerifications.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-zinc-700">User</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-zinc-700">University</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-zinc-700">Submitted</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-zinc-700">Verification Photos</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-zinc-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200">
              <tr
                v-for="verification in pendingVerifications"
                :key="verification.id"
                class="hover:bg-zinc-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-black">{{ getUserEmail(verification.userId) }}</p>
                    <p class="text-sm text-zinc-500">ID: {{ verification.userId }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-black">
                    <Building2 class="w-4 h-4" />
                    {{ getUniversityName(verification.uniId) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-zinc-600">
                  {{ formatDate(verification.submittedAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="viewImage(verification.selfieUrl)"
                      class="group relative w-16 h-16 rounded-lg overflow-hidden border-2 border-zinc-200 hover:border-primary transition-colors"
                    >
                      <img :src="verification.selfieUrl" alt="Selfie" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye class="w-5 h-5 text-white" />
                      </div>
                    </button>
                    <button
                      @click="viewImage(verification.cardUrl)"
                      class="group relative w-16 h-16 rounded-lg overflow-hidden border-2 border-zinc-200 hover:border-primary transition-colors"
                    >
                      <img :src="verification.cardUrl" alt="Student ID" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye class="w-5 h-5 text-white" />
                      </div>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="handleApprove(verification.id, verification.userId)"
                      class="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle class="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      @click="handleReject(verification.id, verification.userId)"
                      class="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <XCircle class="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <Shield class="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-black mb-2">No Pending Verifications</h3>
          <p class="text-zinc-600">All verification requests have been processed.</p>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="previewImage"
          class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          @click="previewImage = null"
        >
          <div class="max-w-4xl w-full">
            <img :src="previewImage" alt="Preview" class="w-full h-auto rounded-2xl" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Clock, CheckCircle, Shield, Building2, Eye, XCircle } from 'lucide-vue-next'
import { useAppStore } from '@/store/app'
import { toast } from '@/utils/toast'

const appStore = useAppStore()

const pendingVerifications = computed(() => appStore.pendingVerifications)
const pendingCount = computed(() => pendingVerifications.value.length)
const approvedTodayCount = ref(3) // Mock data
const totalVerifiedCount = ref(247) // Mock data

const previewImage = ref<string | null>(null)

function getUserEmail(userId: number): string {
    // In a real app, we might need to fetch user info if not included in verification
    // For now, we'll return a placeholder or handle it in the backend response
    return `User #${userId}`
}

function getUniversityName(uniId: number): string {
  return appStore.universities.find(u => u.id === uniId)?.name || 'Unknown'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function viewImage(url: string) {
  previewImage.value = url
}

async function handleApprove(verificationId: number, _userId: number) {
  if (confirm('Are you sure you want to approve this verification?')) {
    await appStore.updateVerificationStatus(verificationId, 'approved')
    
    // In local store update logic, we might need to refresh verifications list
    // appStore.fetchVerifications('pending')
    
    toast.success('Verification approved successfully!')
  }
}

async function handleReject(verificationId: number, _userId: number) {
  if (confirm('Are you sure you want to reject this verification?')) {
    await appStore.updateVerificationStatus(verificationId, 'rejected')
    
    toast.info('Verification rejected.')
  }
}

// Initial fetch
appStore.fetchVerifications('pending')
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
</style>

