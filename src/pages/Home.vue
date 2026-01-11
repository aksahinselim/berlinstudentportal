<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section with Parallax -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-zinc-50 to-white">
      <!-- Animated background shapes with lo-fi vibe -->
      <div ref="bgShapes" class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Large floating orbs -->
        <div class="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-32 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-primary/15 via-zinc-300/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-zinc-400/5 to-primary/5 rounded-full blur-2xl animate-float-slow"></div>
        
        <!-- Small floating particles -->
        <div class="absolute top-1/4 left-1/3 w-4 h-4 bg-primary/30 rounded-full animate-float-particle"></div>
        <div class="absolute top-2/3 right-1/3 w-3 h-3 bg-primary/20 rounded-full animate-float-particle-delayed"></div>
        <div class="absolute bottom-1/4 left-1/4 w-2 h-2 bg-zinc-400/40 rounded-full animate-float-particle-slow"></div>
        <div class="absolute top-1/2 right-1/2 w-3 h-3 bg-primary/25 rounded-full animate-float-particle"></div>
        
        <!-- Subtle grain overlay for lo-fi feel -->
        <div class="absolute inset-0 bg-noise opacity-[0.015]"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div
          v-motion
          :initial="{ opacity: 0, y: 60, filter: 'blur(10px)' }"
          :enter="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1200, delay: 200, ease: 'easeOut' } }"
        >
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
            <span
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 400 } }"
            >
              {{ t.home.heroTitle }}
            </span>
          </h1>
          
          <p 
            class="text-xl sm:text-2xl text-zinc-600 mb-12 max-w-3xl mx-auto"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 800 } }"
          >
            {{ t.home.heroSubtitle }}
          </p>

          <div 
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 1000 } }"
          >
            <router-link
              to="/register"
              class="group px-8 py-4 bg-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-2xl hover:shadow-primary/20 flex items-center gap-2"
            >
              {{ t.home.openChannel }}
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </router-link>
            
            <a
              href="#how-it-works"
              class="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-black text-black rounded-xl hover:bg-black hover:text-white transition-all duration-300 font-bold text-lg"
            >
              {{ t.home.learnMore }}
            </a>
          </div>
        </div>
      </div>

      <!-- Scroll indicator with soft glow -->
      <div 
        class="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 1200 } }"
      >
        <div class="relative animate-float-gentle">
          <div class="absolute inset-0 bg-primary/10 blur-xl rounded-full"></div>
          <ChevronDown class="w-8 h-8 text-zinc-400 relative" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-black mb-4">{{ t.home.whyBSP }}</h2>
          <p class="text-xl text-zinc-600">{{ t.home.builtForStudents }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            v-motion
            :initial="{ opacity: 0, y: 40, scale: 0.95 }"
            :visible-once="{ opacity: 1, y: 0, scale: 1, transition: { duration: 600, delay: index * 150, ease: 'easeOut' } }"
            class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-3 transition-all duration-500 cursor-pointer group relative overflow-hidden"
          >
            <!-- Subtle gradient overlay on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 rounded-2xl"></div>
            
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative">
                <div class="absolute inset-0 bg-primary/5 blur-xl rounded-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
                <component :is="feature.icon" class="w-8 h-8 text-primary relative" />
              </div>
              <h3 class="text-xl font-bold text-black mb-2 group-hover:text-primary transition-colors duration-300">{{ feature.title }}</h3>
              <p class="text-zinc-600">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20 bg-zinc-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-black mb-4">{{ t.home.howItWorks }}</h2>
          <p class="text-xl text-zinc-600">{{ t.home.getStarted }}</p>
        </div>

        <div class="space-y-12">
          <div
            v-for="(step, index) in steps"
            :key="index"
            v-motion
            :initial="{ opacity: 0, x: index % 2 === 0 ? -60 : 60, filter: 'blur(5px)' }"
            :visible-once="{ opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 800, delay: 200, ease: 'easeOut' } }"
            :class="['flex flex-col gap-8 items-center', index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse']"
          >
            <div class="flex-1 text-center md:text-left">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full text-2xl font-bold mb-4 shadow-lg shadow-primary/20 hover:scale-110 transition-transform duration-300">
                {{ index + 1 }}
              </div>
              <h3 class="text-2xl font-bold text-black mb-3">{{ step.title }}</h3>
              <p class="text-lg text-zinc-600">{{ step.description }}</p>
            </div>
            <div class="flex-1 flex items-center justify-center">
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div class="relative w-64 h-64 bg-gradient-to-br from-primary/10 via-white to-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 group-hover:scale-105 transition-all duration-500">
                  <component :is="step.icon" class="w-32 h-32 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-black text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-6">{{ t.home.ctaTitle }}</h2>
        <p class="text-xl text-zinc-300 mb-8">
          {{ t.home.ctaDesc }}
        </p>
        <router-link
          to="/register"
          class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold text-lg"
        >
          {{ t.home.getStartedNow }}
          <ArrowRight class="w-5 h-5" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowRight, ChevronDown, Shield, MessageSquare, FileText, Sparkles, UserCheck, Users, Zap } from 'lucide-vue-next'
import gsap from 'gsap'
import { useI18nStore } from '@/store/i18n'

const i18nStore = useI18nStore()
const t = computed(() => i18nStore.t)

const bgShapes = ref<HTMLElement | null>(null)

const features = computed(() => [
  {
    icon: Shield,
    title: t.value.home.feature1Title,
    description: t.value.home.feature1Desc,
  },
  {
    icon: MessageSquare,
    title: t.value.home.feature2Title,
    description: t.value.home.feature2Desc,
  },
  {
    icon: FileText,
    title: t.value.home.feature3Title,
    description: t.value.home.feature3Desc,
  },
  {
    icon: Sparkles,
    title: t.value.home.feature4Title,
    description: t.value.home.feature4Desc,
  },
])

const steps = computed(() => [
  {
    icon: UserCheck,
    title: t.value.home.step1Title,
    description: t.value.home.step1Desc,
  },
  {
    icon: Users,
    title: t.value.home.step2Title,
    description: t.value.home.step2Desc,
  },
  {
    icon: Zap,
    title: t.value.home.step3Title,
    description: t.value.home.step3Desc,
  },
])

// Mouse movement effect
function handleMouseMove(e: MouseEvent) {
  if (!bgShapes.value) return
  
  const { clientX, clientY } = e
  const { innerWidth, innerHeight } = window
  
  const xPercent = (clientX / innerWidth - 0.5) * 20
  const yPercent = (clientY / innerHeight - 0.5) * 20
  
  gsap.to(bgShapes.value.children, {
    x: xPercent,
    y: yPercent,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.1,
  })
}

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (!prefersReducedMotion) {
    window.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  if (!prefersReducedMotion) {
    window.removeEventListener('mousemove', handleMouseMove)
  }
})
</script>

<style scoped>
/* Lo-fi floating animations */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.05);
  }
  50% {
    transform: translate(-15px, 15px) scale(0.95);
  }
  75% {
    transform: translate(25px, 10px) scale(1.02);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(-25px, 20px) scale(1.03) rotate(2deg);
  }
  50% {
    transform: translate(20px, -10px) scale(0.97) rotate(-2deg);
  }
  75% {
    transform: translate(-15px, -15px) scale(1.01) rotate(1deg);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(50px, -80px) scale(1.5);
    opacity: 0.8;
  }
}

@keyframes float-particle-delayed {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translate(-60px, -100px) scale(1.3);
    opacity: 0.7;
  }
}

@keyframes float-particle-slow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(40px, -60px) scale(1.2);
    opacity: 0.6;
  }
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-slow {
  animation: float-slow 30s ease-in-out infinite;
  animation-delay: 4s;
}

.animate-float-particle {
  animation: float-particle 15s ease-in-out infinite;
}

.animate-float-particle-delayed {
  animation: float-particle-delayed 18s ease-in-out infinite;
  animation-delay: 3s;
}

.animate-float-particle-slow {
  animation: float-particle-slow 22s ease-in-out infinite;
  animation-delay: 6s;
}

.animate-float-gentle {
  animation: float-gentle 3s ease-in-out infinite;
}

/* Lo-fi noise texture */
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}

/* Disable animations for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-delayed,
  .animate-float-slow,
  .animate-float-particle,
  .animate-float-particle-delayed,
  .animate-float-particle-slow,
  .animate-float-gentle {
    animation: none !important;
  }
}
</style>
