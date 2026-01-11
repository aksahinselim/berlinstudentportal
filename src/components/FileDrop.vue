<template>
  <div class="space-y-4">
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="[
        'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
        isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-zinc-300 hover:border-primary',
        isUploading ? 'pointer-events-none opacity-50' : ''
      ]"
      @click="openFilePicker"
    >
      <Upload class="w-12 h-12 mx-auto mb-4 text-zinc-400" />
      <p class="text-black font-medium mb-1">
        {{ isUploading ? t.common.loading : t.post.dropFiles }}
      </p>
      <p class="text-sm text-zinc-500">{{ t.post.supportsFiles }}</p>
      
      <input
        ref="fileInput"
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.docx"
        class="hidden"
        @change="handleFileSelect"
        :disabled="isUploading"
      />
    </div>

    <!-- File list with upload progress -->
    <TransitionGroup name="file-list" tag="div" class="space-y-2">
      <div
        v-for="file in files"
        :key="file.id"
        :class="[
          'flex items-center gap-3 p-3 rounded-xl',
          file.error ? 'bg-red-50' : 'bg-zinc-50'
        ]"
      >
        <component :is="getFileIcon(file.type)" :class="['w-5 h-5 flex-shrink-0', file.error ? 'text-red-500' : 'text-primary']" />
        
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-black truncate">{{ file.name }}</p>
          <div v-if="!file.error" class="flex items-center gap-2 mt-1">
            <div class="flex-1 bg-zinc-200 rounded-full h-1.5">
              <div 
                :class="[
                  'h-1.5 rounded-full transition-all duration-300',
                  file.uploaded ? 'bg-green-500' : 'bg-primary'
                ]"
                :style="{ width: `${file.progress}%` }"
              ></div>
            </div>
            <span class="text-xs text-zinc-500">
              {{ file.uploaded ? '✓ Uploaded' : `${file.progress}%` }}
            </span>
          </div>
          <p v-else class="text-xs text-red-500 mt-1">{{ file.error }}</p>
        </div>

        <button
          type="button"
          @click.prevent="removeFile(file.id)"
          class="text-zinc-400 hover:text-red-500 transition-colors flex-shrink-0"
          aria-label="Remove file"
          :disabled="isUploading && !file.uploaded && !file.error"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, X, FileText, Image, File } from 'lucide-vue-next'
import { uploadFiles as uploadFilesApi, type UploadedFile } from '@/api/uploads'
import { useI18nStore } from '@/store/i18n'

const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

interface FileItem {
  id: string
  name: string
  size: string
  type: 'pdf' | 'image' | 'docx' | 'other'
  progress: number
  uploaded: boolean
  error?: string
  uploadedId?: number  // Server ID after upload
  url?: string         // Server URL after upload
  rawFile?: File       // Original file object
}

const emit = defineEmits<{
  'files-updated': [files: FileItem[]]
  'upload-complete': [uploadedFiles: UploadedFile[]]
}>()

const isDragging = ref(false)
const files = ref<FileItem[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

// Track pending files to upload
const pendingFiles = ref<File[]>([])

// Computed: all files uploaded successfully
const allUploaded = computed(() => 
  files.value.length > 0 && files.value.every(f => f.uploaded || f.error)
)

function openFilePicker() {
  if (!isUploading.value) {
    fileInput.value?.click()
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    processFiles(Array.from(target.files))
  }
  // Reset input so same file can be selected again
  target.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files && !isUploading.value) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

async function processFiles(fileList: File[]) {
  // Add files to the list with pending state
  const newFiles: FileItem[] = fileList.map(file => ({
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    size: formatFileSize(file.size),
    type: getFileType(file.name),
    progress: 0,
    uploaded: false,
    rawFile: file
  }))
  
  files.value.push(...newFiles)
  pendingFiles.value.push(...fileList)
  
  emit('files-updated', files.value)
  
  // Start uploading
  await uploadPendingFiles()
}

async function uploadPendingFiles() {
  if (pendingFiles.value.length === 0 || isUploading.value) return
  
  isUploading.value = true
  
  const filesToUpload = [...pendingFiles.value]
  pendingFiles.value = []
  
  try {
    const result = await uploadFilesApi(filesToUpload, (progress) => {
      // Update progress for all currently uploading files
      files.value.forEach(f => {
        if (!f.uploaded && !f.error) {
          f.progress = progress
        }
      })
    })
    
    if (result.success && result.data) {
      // Match uploaded files with our file items
      result.data.forEach((uploadedFile, index) => {
        const originalFile = filesToUpload[index]
        const fileItem = files.value.find(f => f.rawFile === originalFile)
        if (fileItem) {
          fileItem.uploaded = true
          fileItem.progress = 100
          fileItem.uploadedId = uploadedFile.id
          fileItem.url = uploadedFile.url
        }
      })
      
      emit('upload-complete', result.data)
    } else {
      // Mark all as error
      filesToUpload.forEach(originalFile => {
        const fileItem = files.value.find(f => f.rawFile === originalFile)
        if (fileItem) {
          fileItem.error = result.error || 'Upload failed'
        }
      })
    }
  } catch (err) {
    // Mark all as error
    filesToUpload.forEach(originalFile => {
      const fileItem = files.value.find(f => f.rawFile === originalFile)
      if (fileItem) {
        fileItem.error = 'Network error'
      }
    })
  } finally {
    isUploading.value = false
    emit('files-updated', files.value)
  }
}

function removeFile(fileId: string) {
  const file = files.value.find(f => f.id === fileId)
  if (file) {
    // Remove from pending if not yet uploaded
    if (file.rawFile) {
      const pendingIndex = pendingFiles.value.indexOf(file.rawFile)
      if (pendingIndex > -1) {
        pendingFiles.value.splice(pendingIndex, 1)
      }
    }
  }
  
  files.value = files.value.filter(f => f.id !== fileId)
  emit('files-updated', files.value)
}

function getFileType(filename: string): FileItem['type'] {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image'
  if (['doc', 'docx'].includes(ext || '')) return 'docx'
  return 'other'
}

function getFileIcon(type: FileItem['type']) {
  switch (type) {
    case 'pdf':
    case 'docx':
      return FileText
    case 'image':
      return Image
    default:
      return File
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Get successfully uploaded file data for post creation
function getUploadedFiles(): Array<{ id: number; name: string; type: string; size: string; url: string }> {
  return files.value
    .filter(f => f.uploaded && f.uploadedId)
    .map(f => ({
      id: f.uploadedId!,
      name: f.name,
      type: f.type,
      size: f.size,
      url: f.url!
    }))
}

// Expose for parent component
defineExpose({
  files,
  isUploading,
  allUploaded,
  getUploadedFiles,
  clearFiles: () => {
    files.value = []
    pendingFiles.value = []
  }
})
</script>

<style scoped>
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.3s ease;
}

.file-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.file-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
