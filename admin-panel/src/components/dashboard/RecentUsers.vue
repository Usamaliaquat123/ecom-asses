<script setup lang="ts">
import { computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, UserPlus } from 'lucide-vue-next'

const usersStore = useUsersStore()

const recentUsers = computed(() => {
  return usersStore.users
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

const getRoleColor = (role: string) => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800'
  }
  return colors[role as keyof typeof colors] || colors.user
}

const getStatusColor = (isActive: boolean) => {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Recent Users</h3>
      <router-link 
        to="/users"
        class="text-sm text-purple-600 hover:text-purple-700 font-medium"
      >
        View all
      </router-link>
    </div>

    <div v-if="usersStore.isLoading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse flex items-center space-x-4">
        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="recentUsers.length === 0" class="text-center py-8">
      <UserPlus class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500">No users found</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="user in recentUsers" 
        :key="user.id"
        class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
      >
        <div class="flex items-center space-x-4">
          <img 
            :src="user.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`" 
            :alt="`${user.firstName} ${user.lastName}`"
            class="w-10 h-10 rounded-full object-cover"
          >
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ user.firstName }} {{ user.lastName }}
            </p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getRoleColor(user.role)]">
            {{ user.role }}
          </span>
          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(user.isActive)]">
            {{ user.isActive ? 'Active' : 'Inactive' }}
          </span>
          <span class="text-xs text-gray-500">
            {{ formatDate(user.createdAt) }}
          </span>
          <button class="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreHorizontal class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
