import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from './store/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('./pages/Home.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('./pages/Register.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('./pages/Login.vue'),
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('./pages/ForgotPassword.vue'),
      },
      {
        path: '/verification',
        name: 'Verification',
        component: () => import('./pages/Verification.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/feed',
        name: 'Feed',
        component: () => import('./pages/Feed.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/post/:id',
        name: 'Post',
        component: () => import('./pages/Post.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('./pages/Profile.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin',
        name: 'Admin',
        component: () => import('./pages/Admin.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards - wait for auth initialization
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize before checking protected routes
  if (!authStore.initialized) {
    // Wait for initialization to complete
    await new Promise<void>((resolve) => {
      const checkInit = setInterval(() => {
        if (authStore.initialized) {
          clearInterval(checkInit)
          resolve()
        }
      }, 50)
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInit)
        resolve()
      }, 5000)
    })
  }
  
  // Now check auth requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
  } else if (authStore.isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    // Redirect logged in users away from login/register
    next({ name: 'Feed' })
  } else {
    next()
  }
})

export default router

