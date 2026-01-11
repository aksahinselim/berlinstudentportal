<template>
  <button 
    @click="handleClick"
    :disabled="loading"
    class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
  >
    <Loader2 v-if="loading" class="w-5 h-5 text-primary animate-spin" />
    <component v-else :is="icon" class="w-5 h-5 text-primary" />
    <div class="flex flex-col text-left">
      <span class="text-sm font-medium text-black">{{ attachment.name }}</span>
      <span class="text-xs text-zinc-500">{{ attachment.size }}</span>
    </div>
    <ExternalLink class="w-4 h-4 text-zinc-400" />
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FileText, Image, File, ExternalLink, Loader2 } from 'lucide-vue-next'
import type { Attachment } from '@/types'
import { apiClient } from '@/api/index'
import { toast } from '@/utils/toast'

const props = defineProps<{
  attachment: Attachment
}>()

const loading = ref(false)

const icon = computed(() => {
  switch (props.attachment.type) {
    case 'pdf':
    case 'docx':
      return FileText
    case 'image':
      return Image
    default:
      return File
  }
})

/**
 * Handle attachment click - get file URL and open
 */
async function handleClick() {
  // If attachment has ID, fetch file URL from backend
  if (props.attachment.id) {
    loading.value = true
    try {
      console.log(`🔗 Fetching file URL for attachment ID: ${props.attachment.id}`)
      const result = await apiClient<{ url: string }>(`/uploads/${props.attachment.id}/url`)
      
      if (result.success && result.data?.url) {
        console.log(`✅ Opening file: ${result.data.url}`)
        window.open(result.data.url, '_blank')
      } else {
        console.error('❌ Failed to get file URL:', result.error)
        toast.error(`Dosya açılamadı: ${result.error || 'Dosya bulunamadı. Lütfen tekrar yükleyin.'}`)
      }
    } catch (err) {
      console.error('❌ Error getting file URL:', err)
      toast.error('Dosya açılamadı. Lütfen tekrar deneyin veya dosyayı yeniden yükleyin.')
    } finally {
      loading.value = false
    }
  } else if (props.attachment.url) {
    // Legacy: direct URL (for inline/mock attachments)
    console.log(`📎 Opening direct URL: ${props.attachment.url}`)
    window.open(props.attachment.url, '_blank')
  } else {
    console.error('❌ No attachment ID or URL provided')
    toast.error('Dosya bilgisi eksik.')
  }
}
</script>

