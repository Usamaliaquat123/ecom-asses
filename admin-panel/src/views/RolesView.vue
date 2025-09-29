<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Shield, Users, Plus, Edit, Trash2 } from 'lucide-vue-next'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
}

const roles = ref<Role[]>([])
const isLoading = ref(true)

// Mock data
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles', 'system_settings'],
    userCount: 2,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Can manage users and view reports',
    permissions: ['read', 'write', 'manage_users', 'view_reports'],
    userCount: 5,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic access to dashboard and personal settings',
    permissions: ['read'],
    userCount: 25,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to reports and analytics',
    permissions: ['read', 'view_reports'],
    userCount: 8,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

onMounted(async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  roles.value = mockRoles
  isLoading.value = false
})

const getRoleColor = (roleName: string) => {
  const colors = {
    'Administrator': 'bg-red-100 text-red-800 border-red-200',
    'Manager': 'bg-blue-100 text-blue-800 border-blue-200',
    'User': 'bg-gray-100 text-gray-800 border-gray-200',
    'Viewer': 'bg-green-100 text-green-800 border-green-200'
  }
  return colors[roleName as keyof typeof colors] || colors.User
}

const getPermissionCount = (permissions: string[]) => {
  return permissions.length
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Role Management</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage user roles and their permissions
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button class="btn btn-primary px-4 py-2">
          <Plus class="w-4 h-4 mr-2" />
          Create Role
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Roles</p>
            <p class="text-2xl font-bold text-gray-900">{{ roles.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ roles.reduce((sum, role) => sum + role.userCount, 0) }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Custom Roles</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ roles.filter(r => !['Administrator', 'Manager', 'User'].includes(r.name)).length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Roles Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="flex space-x-2">
            <div class="h-6 bg-gray-200 rounded w-16"></div>
            <div class="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="role in roles"
        :key="role.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Shield class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ role.name }}</h3>
              <span :class="['inline-flex px-2 py-1 text-xs font-medium rounded-full border', getRoleColor(role.name)]">
                {{ role.name }}
              </span>
            </div>
          </div>
          <div class="flex space-x-1">
            <button class="p-1 text-gray-400 hover:text-gray-600 rounded">
              <Edit class="w-4 h-4" />
            </button>
            <button class="p-1 text-gray-400 hover:text-red-600 rounded">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-600 mb-4">{{ role.description }}</p>

        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Users assigned:</span>
            <span class="font-medium text-gray-900">{{ role.userCount }}</span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Permissions:</span>
            <span class="font-medium text-gray-900">{{ getPermissionCount(role.permissions) }}</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="permission in role.permissions.slice(0, 3)"
              :key="permission"
              class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
            >
              {{ permission.replace('_', ' ') }}
            </span>
            <span
              v-if="role.permissions.length > 3"
              class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
            >
              +{{ role.permissions.length - 3 }} more
            </span>
          </div>
        </div>

        <div class="mt-4 flex space-x-2">
          <button class="flex-1 btn btn-outline text-sm py-2">
            <Edit class="w-4 h-4 mr-1" />
            Edit
          </button>
          <button class="flex-1 btn btn-primary text-sm py-2">
            <Users class="w-4 h-4 mr-1" />
            View Users
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
