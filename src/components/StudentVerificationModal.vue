<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="bg-gradient-to-r from-primary to-red-600 text-white p-6 rounded-t-2xl">
            <h2 class="text-2xl font-bold">Student Verification</h2>
            <p class="text-sm mt-1 opacity-90">
              {{ step === 'intro' ? 'Complete your verification to access the platform' : 
                 step === 'camera' ? 'Take a selfie with your student ID' : 
                 step === 'review' ? 'Review and submit' : 'Processing...' }}
            </p>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Step 1: Introduction -->
            <div v-if="step === 'intro'" class="space-y-6">
              <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div class="flex items-start">
                  <svg class="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 class="font-semibold text-blue-900">Verification Requirements</h3>
                    <p class="text-sm text-blue-800 mt-1">
                      To verify your student status, we need a photo of you holding your student ID card.
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="font-semibold text-gray-900">Instructions:</h3>
                <ol class="list-decimal list-inside space-y-3 text-gray-700">
                  <li>Have your <strong>student ID card</strong> ready</li>
                  <li>Allow <strong>camera access</strong> when prompted</li>
                  <li>Hold your ID card <strong>next to your face</strong></li>
                  <li>Make sure both your <strong>face and ID are clearly visible</strong></li>
                  <li>Take the photo when ready</li>
                </ol>
              </div>

              <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <div class="flex items-start">
                  <svg class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <div>
                    <h3 class="font-semibold text-yellow-900">Demo Mode Notice</h3>
                    <p class="text-sm text-yellow-800 mt-1">
                      This is a demo. In production, admin approval would be required. 
                      For this demo, you'll be automatically verified after submission.
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="handleClose"
                  class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  @click="startCamera"
                  class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Start Camera
                </button>
              </div>
            </div>

            <!-- Step 2: Camera -->
            <div v-if="step === 'camera'" class="space-y-4">
              <div class="relative bg-gray-900 rounded-lg overflow-hidden aspect-[4/3]">
                <!-- Video element for camera -->
                <video
                  ref="videoRef"
                  playsinline
                  autoplay
                  muted
                  class="w-full h-full object-cover"
                ></video>
                
                <!-- Camera overlay guide -->
                <div class="absolute inset-0 pointer-events-none">
                  <div class="absolute inset-0 border-4 border-white/30 m-8 rounded-lg"></div>
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                    <p class="text-sm bg-black/50 px-4 py-2 rounded-full">
                      Position your face and ID within the frame
                    </p>
                  </div>
                </div>

                <!-- Countdown overlay -->
                <div v-if="countdown > 0" class="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div class="text-white text-8xl font-bold animate-pulse">{{ countdown }}</div>
                </div>
              </div>

              <!-- Hidden canvas for capturing -->
              <canvas ref="canvasRef" class="hidden"></canvas>

              <div class="flex gap-3">
                <button
                  @click="stopCamera"
                  class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  @click="capturePhoto"
                  :disabled="capturing || !cameraReady"
                  class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ cameraReady ? 'Capture Photo' : 'Loading camera...' }}
                </button>
              </div>
            </div>

            <!-- Step 3: Review -->
            <div v-if="step === 'review'" class="space-y-4">
              <div class="relative bg-gray-100 rounded-lg overflow-hidden">
                <img :src="capturedImage" alt="Captured photo" class="w-full h-auto" />
              </div>

              <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div class="flex items-start">
                  <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 class="font-semibold text-green-900">Photo captured!</h3>
                    <p class="text-sm text-green-800 mt-1">
                      Make sure your face and student ID are clearly visible before submitting.
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="retakePhoto"
                  class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Retake Photo
                </button>
                <button
                  @click="submitVerification"
                  :disabled="uploading"
                  class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <svg v-if="!uploading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  <svg v-else class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ uploading ? 'Submitting...' : 'Submit Verification' }}
                </button>
              </div>
            </div>

            <!-- Step 4: Success -->
            <div v-if="step === 'success'" class="space-y-6 text-center py-8">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Verification Submitted!</h3>
                <p class="text-gray-600 mt-2">
                  Your verification has been automatically approved (demo mode).
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  You can now access all platform features!
                </p>
              </div>
              <button
                @click="handleSuccess"
                class="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
              >
                Continue to Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/toast';
import { verificationsApi } from '../api/verifications';
import { useAuthStore } from '../store/auth';

interface Props {
  show: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

// State
const step = ref<'intro' | 'camera' | 'review' | 'success'>('intro');
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const mediaStream = ref<MediaStream | null>(null);
const capturedImage = ref<string>('');
const capturing = ref(false);
const uploading = ref(false);
const countdown = ref(0);
const cameraReady = ref(false);

/**
 * Start Camera - Based on MDN getUserMedia example
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
async function startCamera() {
  step.value = 'camera';
  cameraReady.value = false;
  
  // Wait for DOM to update
  await nextTick();
  
  // Constraints - prefer front camera (user facing)
  const constraints = {
    audio: false,
    video: {
      facingMode: 'user'
    }
  };

  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    mediaStream.value = stream;
    
    // Attach stream to video element
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      
      // Wait for video to be ready
      videoRef.value.onloadedmetadata = () => {
        videoRef.value?.play();
        cameraReady.value = true;
        console.log('Camera ready');
      };
    }
  } catch (err: any) {
    console.error('Camera error:', err.name, err.message);
    
    let message = 'Kamera açılamadı.\n\n';
    
    switch (err.name) {
      case 'NotAllowedError':
        message += 'Kamera izni verilmedi.\nTarayıcınızın adres çubuğundaki kamera ikonuna tıklayıp izin verin.';
        break;
      case 'NotFoundError':
        message += 'Kamera bulunamadı.\nCihazınızda çalışan bir kamera olduğundan emin olun.';
        break;
      case 'NotReadableError':
        message += 'Kamera başka bir uygulama tarafından kullanılıyor.\nDiğer uygulamaları kapatıp tekrar deneyin.';
        break;
      case 'OverconstrainedError':
        message += 'Kamera ayarları uyumsuz.\nFarklı bir tarayıcı deneyin.';
        break;
      case 'SecurityError':
        message += 'Güvenlik hatası.\nSite HTTPS üzerinden yüklenmiyor olabilir.';
        break;
      default:
        message += err.message || 'Bilinmeyen bir hata oluştu.';
    }
    
    toast.error(message);
    step.value = 'intro';
  }
}

/**
 * Stop Camera - Release media stream
 */
function stopCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => {
      track.stop();
    });
    mediaStream.value = null;
  }
  cameraReady.value = false;
  step.value = 'intro';
}

/**
 * Capture Photo - Draw video frame to canvas
 */
async function capturePhoto() {
  if (!videoRef.value || !canvasRef.value || capturing.value || !cameraReady.value) return;

  capturing.value = true;

  // Countdown 3-2-1
  for (let i = 3; i > 0; i--) {
    countdown.value = i;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  countdown.value = 0;

  // Capture frame from video
  const video = videoRef.value;
  const canvas = canvasRef.value;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage.value = canvas.toDataURL('image/jpeg', 0.9);
  }

  // Stop camera and show review
  stopCameraOnly();
  step.value = 'review';
  capturing.value = false;
}

/**
 * Stop camera without changing step
 */
function stopCameraOnly() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop());
    mediaStream.value = null;
  }
  cameraReady.value = false;
}

/**
 * Retake Photo - Go back to camera
 */
function retakePhoto() {
  capturedImage.value = '';
  startCamera();
}

/**
 * Submit Verification
 */
async function submitVerification() {
  if (!capturedImage.value || uploading.value) return;

  uploading.value = true;

  try {
    console.log('📤 [FRONTEND] Starting verification submission...');
    console.log('📸 Captured image data URL length:', capturedImage.value.length);
    
    // Convert base64 to blob
    const response = await fetch(capturedImage.value);
    const blob = await response.blob();
    
    console.log('🔄 [FRONTEND] Blob created:', blob.size, 'bytes, type:', blob.type);
    
    // Create file from blob - same photo for both selfie and card
    // (Since photo already contains both face and student ID)
    const file = new File([blob], 'verification.jpg', { type: 'image/jpeg' });
    
    console.log('📁 [FRONTEND] File created:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    console.log('🌐 [FRONTEND] Calling API with files...');
    
    // Submit to backend (same photo used for both fields)
    const result = await verificationsApi.submitVerification(file, file);

    console.log('📥 [FRONTEND] API Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ [FRONTEND] Verification successful!');
      step.value = 'success';
      
      // Refresh user data to get updated status
      console.log('🔄 [FRONTEND] Refreshing auth store...');
      await authStore.initAuth();
      console.log('✅ [FRONTEND] Auth store refreshed');
    } else {
      console.error('❌ [FRONTEND] Verification failed:', result.error);
      toast.error(result.error || 'Doğrulama gönderilemedi. Lütfen tekrar deneyin.');
      uploading.value = false;
    }
  } catch (error: any) {
    console.error('❌ [FRONTEND] Exception caught:', error);
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    
    // More helpful error message
    const errorMsg = error.message || 'Bilinmeyen hata oluştu';
    toast.error(`Doğrulama gönderilemedi!\n\nHata: ${errorMsg}\n\nLütfen:\n1. İnternet bağlantınızı kontrol edin\n2. Tarayıcı console'unu açın (F12)\n3. Tekrar deneyin`);
    uploading.value = false;
  }
}

/**
 * Handle Success - Navigate to feed
 */
function handleSuccess() {
  emit('success');
  emit('close');
  router.push('/feed');
}

/**
 * Handle Close
 */
function handleClose() {
  stopCameraOnly();
  emit('close');
}

// Cleanup on unmount
onUnmounted(() => {
  stopCameraOnly();
});
</script>

<style scoped>
.bg-primary {
  background-color: #E2382A;
}

.bg-primary-dark {
  background-color: #c42f22;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
