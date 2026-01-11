<template>
  <footer class="bg-black text-white py-8 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <img src="/bsp-logo.png" alt="BSP Logo" class="h-8 w-8 brightness-0 invert" />
            <span class="font-bold text-lg">Berlin Student Portal</span>
          </div>
          <p class="text-zinc-400 text-sm">
            {{ t.footer.connectingStudents }}
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="font-bold mb-4">{{ t.footer.quickLinks }}</h3>
          <ul class="space-y-2">
            <li>
              <router-link :to="homeLink" class="text-zinc-400 hover:text-white transition-colors text-sm">
                {{ authStore.currentUser ? t.nav.feed : t.nav.home }}
              </router-link>
            </li>
            <li v-if="!authStore.currentUser">
              <a href="#how-it-works" class="text-zinc-400 hover:text-white transition-colors text-sm">
                {{ t.home.howItWorks }}
              </a>
            </li>
            <li v-if="authStore.currentUser">
              <router-link to="/profile" class="text-zinc-400 hover:text-white transition-colors text-sm">
                {{ t.nav.profile }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="font-bold mb-4">{{ t.footer.legal }}</h3>
          <ul class="space-y-2">
            <li>
              <a href="#terms" class="text-zinc-400 hover:text-white transition-colors text-sm">
                {{ t.footer.termsOfService }}
              </a>
            </li>
            <li>
              <a href="#privacy" class="text-zinc-400 hover:text-white transition-colors text-sm">
                {{ t.footer.privacyPolicy }}
              </a>
            </li>
            <li>
              <a href="#guidelines" class="text-zinc-400 hover:text-white transition-colors text-sm">
                {{ t.footer.communityGuidelines }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-zinc-800 mt-8 pt-8 text-center">
        <p class="text-zinc-500 text-sm">
          © {{ currentYear }} Berlin Student Portal. {{ t.footer.allRightsReserved }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useI18nStore } from '@/store/i18n'

const currentYear = computed(() => new Date().getFullYear())
const authStore = useAuthStore()
const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

// Smart home link - goes to feed if logged in, home if not
const homeLink = computed(() => authStore.currentUser ? '/feed' : '/')
</script>

