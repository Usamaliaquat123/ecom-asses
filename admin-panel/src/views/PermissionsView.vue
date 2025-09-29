<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Key, Shield, Search, Filter } from 'lucide-vue-next'

interface Permission {
  id: string
  name: string
  description: string
  category: string
  roles: string[]
}

const permissions = ref<Permission[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')

// Mock data
const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'read',
    description: 'View and read data',
    category: 'Basic',
    roles: ['Administrator', 'Manager', 'User', 'Viewer']
  },
  {
    id: '2',
    name: 'write',
    description: 'Create and edit data',
    category: 'Basic',
    roles: ['Administrator', 'Manager']
  },
  {
    id: '3',
    name: 'delete',
    description: 'Delete data and records',
    category: 'Basic',
    roles: ['Administrator']
  },
  {
    id: '4',
    name: 'manage_users',
    description: 'Create, edit, and delete user accounts',
    category: 'User Management',
    roles: ['Administrator', 'Manager']
  },
  {
    id: '5',
    name: 'manage_roles',
    description: 'Create and modify user roles',
    category: 'User Management',
    roles: ['Administrator']
  },
  {
    id: '6',
    name: 'system_settings',
    description: 'Access and modify system settings',
    category: 'System',
    roles: ['Administrator']
  },
  {
    id: '7',
    name: 'view_reports',
    description: 'Access reports and analytics',
    category: 'Reports',
    roles: ['Administrator', 'Manager', 'Viewer']
  },
  {
    id: '8',
    name: 'export_data',
    description: 'Export data and reports',
    category: 'Reports',
    roles: ['Administrator', 'Manager']
  },
  {
    id: '9',
    name: 'audit_logs',
    description: 'View system audit logs',
    category: 'System',
    roles: ['Administrator']
  },
  {
    id: '10',
    name: 'backup_restore',
    description: 'Create backups and restore data',
    category: 'System',
    roles: ['Administrator']
  }
]

const categories = computed(() => {
  const cats = [...new Set(permissions.value.map(p => p.category))]
  return cats.sort()
})

const filteredPermissions = computed(() => {
  let filtered = permissions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  return filtered
})

const groupedPermissions = computed(() => {
  const groups: Record<string, Permission[]> = {}
  
  filteredPermissions.value.forEach(permission => {
    if (!groups[permission.category]) {
      groups[permission.category] = []
    }
    groups[permission.category].push(permission)
  })

  return groups
})

onMounted(async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  permissions.value = mockPermissions
  isLoading.value = false
})

const getRoleColor = (role: string) => {
  const colors = {
    'Administrator': 'bg-red-100 text-red-800',
    'Manager': 'bg-blue-100 text-blue-800',
    'User': 'bg-gray-100 text-gray-800',
    'Viewer': 'bg-green-100 text-green-800'
  }
  return colors[role as keyof typeof colors] || colors.User
}

const getCategoryColor = (category: string) => {
  const colors = {
    'Basic': 'bg-blue-100 text-blue-800',
    'User Management': 'bg-purple-100 text-purple-800',
    'System': 'bg-red-100 text-red-800',
    'Reports': 'bg-green-100 text-green-800'
  }
  return colors[category as keyof typeof colors] || colors.Basic
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Permissions</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage system permissions and their assignments
        </p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Permissions</p>
            <p class="text-2xl font-bold text-gray-900">{{ permissions.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Categories</p>
            <p class="text-2xl font-bold text-gray-900">{{ categories.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Key class="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Basic Permissions</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ permissions.filter(p => p.category === 'Basic').length }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">System Permissions</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ permissions.filter(p => p.category === 'System').length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-4 w-4 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search permissions..."
              class="input pl-10 w-full"
            >
          </div>
        </div>

        <!-- Category Filter -->
        <div class="min-w-0">
          <select
            v-model="selectedCategory"
            class="input min-w-[150px]"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Permissions by Category -->
    <div v-if="isLoading" class="space-y-6">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
          <div class="space-y-3">
            <div v-for="j in 3" :key="j" class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(categoryPermissions, category) in groupedPermissions"
        :key="category"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <span :class="['inline-flex px-3 py-1 text-sm font-medium rounded-full', getCategoryColor(category)]">
              {{ category }}
            </span>
            <span class="ml-3 text-sm text-gray-500">
              {{ categoryPermissions.length }} permission{{ categoryPermissions.length === 1 ? '' : 's' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="permission in categoryPermissions"
            :key="permission.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-1">
                  {{ permission.name.replace('_', ' ').toUpperCase() }}
                </h4>
                <p class="text-sm text-gray-600">{{ permission.description }}</p>
              </div>
              <Key class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            </div>

            <div class="flex flex-wrap gap-1">
              <span
                v-for="role in permission.roles"
                :key="role"
                :class="['inline-flex px-2 py-1 text-xs font-medium rounded', getRoleColor(role)]"
              >
                {{ role }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && filteredPermissions.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
      <Key class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No permissions found</h3>
      <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
    </div>
  </div>
</template>
