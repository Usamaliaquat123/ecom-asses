<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Menu, 
  Bell, 
  Search, 
  Settings,
  ChevronDown,
  User,
  LogOut
} from 'lucide-vue-next'

defineEmits<{
  toggleSidebar: []
}>()

const route = useRoute()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const showNotifications = ref(false)

const pageTitle = computed(() => {
  return route.meta.title as string || 'Dashboard'
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="mx-auto  px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Left section -->
        <div class="flex items-center">
          <!-- Mobile menu button -->
          <button
            @click="$emit('toggleSidebar')"
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu class="h-6 w-6" />
          </button>
          
          <!-- Page title -->
          <h1 class="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">
            {{ pageTitle }}
          </h1>
        </div>

        <!-- Right section -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="hidden md:block">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
            </div>
          </div>

          <!-- Notifications -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell class="h-5 w-5" />
              <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            <!-- Notifications dropdown -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div class="px-4 py-3 hover:bg-gray-50">
                  <p class="text-sm text-gray-900">New user registered</p>
                  <p class="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <div class="px-4 py-3 hover:bg-gray-50">
                  <p class="text-sm text-gray-900">System backup completed</p>
                  <p class="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div class="px-4 py-2 border-t border-gray-200">
                <button class="text-sm text-purple-600 hover:text-purple-700">
                  View all notifications
                </button>
              </div>
            </div>
          </div>

          <!-- Settings -->
          <router-link
            to="/settings"
            class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <Settings class="h-5 w-5" />
          </router-link>

          <!-- User menu -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <img 
                :src="authStore.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'" 
                alt="User avatar" 
                class="h-8 w-8 rounded-full"
              >
              <div class="hidden lg:block text-left">
                <p class="text-sm font-medium text-gray-900">
                  {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                </p>
                <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
              </div>
              <ChevronDown class="h-4 w-4 text-gray-400" />
            </button>

            <!-- User dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div class="px-4 py-3 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">
                  {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                </p>
                <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
              </div>
              <div class="py-2">
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User class="mr-3 h-4 w-4" />
                  Profile Settings
                </button>
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings class="mr-3 h-4 w-4" />
                  Account Settings
                </button>
                <div class="border-t border-gray-200 my-2"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
