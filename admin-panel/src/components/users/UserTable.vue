<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff, Users } from 'lucide-vue-next'
import type { User } from '@/types'

interface Props {
  users: User[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

const getRoleColor = (role: string) => {
  const colors = {
    admin: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    manager: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    user: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
  return colors[role as keyof typeof colors] || colors.user
}

const getStatusColor = (isActive: boolean) => {
  return isActive 
    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}
</script>

<template>
  <div class="overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Login
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Loading state -->
          <tr v-if="loading" v-for="i in 5" :key="`loading-${i}`">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="animate-pulse h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <div class="animate-pulse h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div class="animate-pulse h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="animate-pulse h-6 bg-gray-200 rounded w-16"></div>
            </td>
            <td class="px-6 py-4">
              <div class="animate-pulse h-6 bg-gray-200 rounded w-16"></div>
            </td>
            <td class="px-6 py-4">
              <div class="animate-pulse h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td class="px-6 py-4">
              <div class="animate-pulse h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td class="px-6 py-4">
              <div class="animate-pulse h-8 bg-gray-200 rounded w-8"></div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="text-gray-500 dark:text-gray-400">
                <Users class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p class="text-lg font-medium">No users found</p>
                <p class="text-sm">Get started by creating a new user.</p>
              </div>
            </td>
          </tr>

          <!-- User rows -->
          <tr 
            v-else
            v-for="user in users" 
            :key="user.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img 
                  :src="user.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`" 
                  :alt="`${user.firstName} ${user.lastName}`"
                  class="h-10 w-10 rounded-full object-cover"
                >
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getRoleColor(user.role)]">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(user.isActive)]">
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(user.lastLogin) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('edit', user)"
                  class="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                  title="Edit user"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('delete', user)"
                  class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                  title="Delete user"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
