<template>
  <div class="min-h-screen bg-zinc-50 flex items-center justify-center py-12">
    <div class="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="bg-white rounded-2xl shadow-lg p-12">
        <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion class="w-12 h-12 text-primary" />
        </div>
        
        <h1 class="text-6xl font-bold text-black mb-4">404</h1>
        <h2 class="text-2xl font-bold text-black mb-3">Page Not Found</h2>
        <p class="text-zinc-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It may have been moved or deleted.
        </p>

        <div class="space-y-3">
          <router-link
            to="/"
            class="block w-full px-6 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold"
          >
            Go Home
          </router-link>
          
          <router-link
            to="/feed"
            class="block w-full px-6 py-3 bg-zinc-200 text-black rounded-xl hover:bg-zinc-300 transition-colors font-medium"
          >
            View Feed
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileQuestion } from 'lucide-vue-next'
</script>

