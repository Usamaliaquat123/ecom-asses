<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff, Users } from 'lucide-vue-next'
import type { User } from '@/types'

interface Props {
  users: User[]
  loading?: boolean
  selected?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selected: () => []
})

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
  'selection-change': [selected: string[]]
}>()

const selectedUsers = ref<string[]>([...props.selected])
const selectAll = ref(false)

const isAllSelected = computed(() => {
  return props.users.length > 0 && selectedUsers.value.length === props.users.length
})

const isIndeterminate = computed(() => {
  return selectedUsers.value.length > 0 && selectedUsers.value.length < props.users.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = props.users.map(user => user.id)
  }
  emit('selection-change', selectedUsers.value)
}

const toggleUserSelection = (userId: string) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
  emit('selection-change', selectedUsers.value)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
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
  <div class="overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 sm:left-6"
              >
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading state -->
          <tr v-if="loading" v-for="i in 5" :key="`loading-${i}`">
            <td class="px-6 py-4">
              <div class="animate-pulse h-4 w-4 bg-gray-200 rounded"></div>
            </td>
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
            <td colspan="7" class="px-6 py-12 text-center">
              <div class="text-gray-500">
                <Users class="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
            :class="[
              'hover:bg-gray-50 transition-colors duration-200',
              selectedUsers.includes(user.id) ? 'bg-purple-50' : ''
            ]"
          >
            <td class="relative px-6 py-4">
              <input
                type="checkbox"
                :checked="selectedUsers.includes(user.id)"
                @change="toggleUserSelection(user.id)"
                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 sm:left-6"
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img 
                  :src="user.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`" 
                  :alt="`${user.firstName} ${user.lastName}`"
                  class="h-10 w-10 rounded-full object-cover"
                >
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.lastLogin) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
