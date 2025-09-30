<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const isInitializing = ref(true)

// Check if current route should be rendered without layout
const isStandaloneRoute = computed(() => {
  return route.name === 'Login'
})

onMounted(async () => {
  // Initialize theme first
  themeStore.initializeTheme()
  
  // Quick initialization check
  const token = localStorage.getItem('auth_token')
  if (token) {
    // If token exists, initialize auth to validate it
    await authStore.initializeAuth()
  }
  isInitializing.value = false
})
</script>

<template>
  <div id="app">
    <!-- Loading screen during initial auth check -->
    <div v-if="isInitializing" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
    
    <!-- App content after initialization -->
    <template v-else>
      <!-- Standalone routes (like login) without layout -->
      <RouterView v-if="isStandaloneRoute" />
      
      <!-- Protected routes with layout -->
      <AppLayout v-else>
        <RouterView />
      </AppLayout>
    </template>
  </div>
</template>