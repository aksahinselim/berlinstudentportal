<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="getTransitionName(route)" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  
  <!-- Global Toast Notification -->
  <ToastNotification ref="toastRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import ToastNotification from '@/components/ToastNotification.vue';

const toastRef = ref<InstanceType<typeof ToastNotification> | null>(null);

// Get transition name based on route
function getTransitionName(route: RouteLocationNormalizedLoaded) {
  // Use fade for auth pages (login, register, forgot-password)
  const authPages = ['Login', 'Register', 'ForgotPassword'];
  if (authPages.includes(route.name as string)) {
    return 'fade-slide';
  }
  // Use slide for other pages
  return 'slide-fade';
}
</script>

<style>
/* Fade Slide Transition (for auth pages) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Slide Fade Transition (for other pages) */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Page Transition (fallback) */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>

