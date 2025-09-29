<script setup lang="ts">
import { computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-vue-next'

const usersStore = useUsersStore()

const filters = computed({
  get: () => usersStore.filters,
  set: (value) => usersStore.updateFilters(value)
})

const updateSearch = (value: string) => {
  usersStore.updateFilters({ search: value })
}

const updateRole = (value: string) => {
  usersStore.updateFilters({ role: value })
}

const updateStatus = (value: string) => {
  usersStore.updateFilters({ status: value })
}

const updateSort = (sortBy: string) => {
  const currentOrder = filters.value.sortBy === sortBy ? filters.value.sortOrder : 'desc'
  const newOrder = currentOrder === 'asc' ? 'desc' : 'asc'
  
  usersStore.updateFilters({ 
    sortBy, 
    sortOrder: newOrder 
  })
}

const clearFilters = () => {
  usersStore.updateFilters({
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
}

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.role || filters.value.status
})
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
      <!-- Search -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            :value="filters.search"
            @input="updateSearch(($event.target as HTMLInputElement).value)"
            placeholder="Search users..."
            class="input pl-10 w-full"
          >
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center space-x-4">
        <!-- Role Filter -->
        <div class="min-w-0">
          <select
            :value="filters.role"
            @change="updateRole(($event.target as HTMLSelectElement).value)"
            class="input min-w-[120px]"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="min-w-0">
          <select
            :value="filters.status"
            @change="updateStatus(($event.target as HTMLSelectElement).value)"
            class="input min-w-[120px]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Sort Options -->
        <div class="flex items-center space-x-2">
          <button
            @click="updateSort('firstName')"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              filters.sortBy === 'firstName' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Name
            <SortAsc 
              v-if="filters.sortBy === 'firstName' && filters.sortOrder === 'asc'" 
              class="w-4 h-4 ml-1" 
            />
            <SortDesc 
              v-else-if="filters.sortBy === 'firstName' && filters.sortOrder === 'desc'" 
              class="w-4 h-4 ml-1" 
            />
          </button>

          <button
            @click="updateSort('createdAt')"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              filters.sortBy === 'createdAt' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Created
            <SortAsc 
              v-if="filters.sortBy === 'createdAt' && filters.sortOrder === 'asc'" 
              class="w-4 h-4 ml-1" 
            />
            <SortDesc 
              v-else-if="filters.sortBy === 'createdAt' && filters.sortOrder === 'desc'" 
              class="w-4 h-4 ml-1" 
            />
          </button>

          <button
            @click="updateSort('lastLogin')"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              filters.sortBy === 'lastLogin' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Last Login
            <SortAsc 
              v-if="filters.sortBy === 'lastLogin' && filters.sortOrder === 'asc'" 
              class="w-4 h-4 ml-1" 
            />
            <SortDesc 
              v-else-if="filters.sortBy === 'lastLogin' && filters.sortOrder === 'desc'" 
              class="w-4 h-4 ml-1" 
            />
          </button>
        </div>

        <!-- Clear Filters -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap items-center gap-2">
      <span class="text-sm text-gray-500">Active filters:</span>
      
      <span v-if="filters.search" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Search: "{{ filters.search }}"
      </span>
      
      <span v-if="filters.role" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Role: {{ filters.role }}
      </span>
      
      <span v-if="filters.status" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Status: {{ filters.status }}
      </span>
    </div>
  </div>
</template>
