<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Key, 
  BarChart3, 
  Settings, 
  LogOut,
  X
} from 'lucide-vue-next'

interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    current: computed(() => route.path === '/')
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    current: computed(() => route.path === '/users')
  },

  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    current: computed(() => route.path === '/analytics')
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    current: computed(() => route.path === '/settings')
  }
]

const handleNavigation = (href: string) => {
  router.push(href)
  emit('close') // Close mobile sidebar after navigation
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-full flex-col bg-white shadow-xl">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Shield class="w-5 h-5 text-white" />
        </div>
        <h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>
      
      <!-- Mobile close button -->
      <button
        @click="emit('close')"
        class="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <div
        v-for="item in navigationItems"
        :key="item.name"
        @click="handleNavigation(item.href)"
        class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl cursor-pointer transition-all duration-200"
        :class="item.current.value
          ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <component
          :is="item.icon"
          class="mr-3 h-5 w-5 flex-shrink-0 transition-colors"
          :class="item.current.value
            ? 'text-purple-600'
            : 'text-gray-400 group-hover:text-gray-500'"
        />
        {{ item.name }}
      </div>
    </nav>

    <!-- User Profile & Logout -->
    <div class="border-t border-gray-200 p-4">
      <!-- User Info -->
      <div class="flex items-center space-x-3 px-3 py-2 mb-3">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-sm font-semibold text-white">
            {{ authStore.user?.firstName?.[0] || 'A' }}{{ authStore.user?.lastName?.[0] || 'U' }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }} || 'Admin User'
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ authStore.user?.role?.charAt(0).toUpperCase() + authStore.user?.role?.slice(1) || 'Admin' }}
          </p>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        @click="handleLogout"
        class="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
      >
        <LogOut class="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
        Sign out
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for navigation */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
