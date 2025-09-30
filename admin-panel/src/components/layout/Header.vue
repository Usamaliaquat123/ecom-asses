<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { 
  Menu, 
  Bell, 
  Search, 
  Settings,
  ChevronDown,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor
} from 'lucide-vue-next'

defineEmits<{
  toggleSidebar: []
}>()

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showThemeMenu = ref(false)

const pageTitle = computed(() => {
  return route.meta.title as string || 'Dashboard'
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showThemeMenu.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
  showThemeMenu.value = false
}

const toggleThemeMenu = () => {
  showThemeMenu.value = !showThemeMenu.value
  showUserMenu.value = false
  showNotifications.value = false
}

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
}

const setTheme = (theme: 'light' | 'dark' | 'system') => {
  themeStore.setTheme(theme)
  showThemeMenu.value = false
}

const themeIcon = computed(() => {
  if (themeStore.theme === 'system') return Monitor
  return themeStore.isDark ? Moon : Sun
})
</script>

<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="mx-auto  px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Left section -->
        <div class="flex items-center">
          <!-- Mobile menu button -->
          <button
            @click="$emit('toggleSidebar')"
            class="lg:hidden p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu class="h-6 w-6" />
          </button>
          
          <!-- Page title -->
          <h1 class="ml-4 lg:ml-0 text-2xl font-bold text-gray-900 dark:text-white">
            {{ pageTitle }}
          </h1>
        </div>

        <!-- Right section -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="hidden md:block">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
            </div>
          </div>

          <!-- Theme switcher -->
          <div class="relative">
            <button
              @click="toggleThemeMenu"
              class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <component :is="themeIcon" class="h-5 w-5" />
            </button>

            <!-- Theme dropdown -->
            <div
              v-if="showThemeMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              <button
                @click="setTheme('light')"
                :class="[
                  'flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700',
                  themeStore.theme === 'light' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-700 dark:text-gray-300'
                ]"
              >
                <Sun class="mr-3 h-4 w-4" />
                Light
              </button>
              <button
                @click="setTheme('dark')"
                :class="[
                  'flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700',
                  themeStore.theme === 'dark' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-700 dark:text-gray-300'
                ]"
              >
                <Moon class="mr-3 h-4 w-4" />
                Dark
              </button>
              <button
                @click="setTheme('system')"
                :class="[
                  'flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700',
                  themeStore.theme === 'system' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-700 dark:text-gray-300'
                ]"
              >
                <Monitor class="mr-3 h-4 w-4" />
                System
              </button>
            </div>
          </div>
      
          <!-- Settings -->
          <router-link
            to="/settings"
            class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Settings class="h-5 w-5" />
          </router-link>

          <!-- User menu -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <img 
                :src="authStore.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'" 
                alt="User avatar" 
                class="h-8 w-8 rounded-full"
              >
              <div class="hidden lg:block text-left">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ authStore.user?.role }}</p>
              </div>
              <ChevronDown class="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </button>

            <!-- User dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
              </div>
              <div class="py-2">
              
                <div class="border-gray-200 dark:border-gray-700 my-2"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut class="mr-3 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
