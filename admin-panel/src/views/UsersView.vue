<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'
import UserTable from '@/components/users/UserTable.vue'
import UserFilters from '@/components/users/UserFilters.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import CreateUserModal from '@/components/users/CreateUserModal.vue'
import EditUserModal from '@/components/users/EditUserModal.vue'
import { Plus, Download, Users, UserCheck, Shield, Clock } from 'lucide-vue-next'
import type { User } from '@/types'

const usersStore = useUsersStore()
const router = useRouter()

const showDeleteDialog = ref(false)
const userToDelete = ref<User | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const userToEdit = ref<User | null>(null)
const isExporting = ref(false)

onMounted(() => {
  usersStore.fetchUsers()
})

const handleCreateUser = () => {
  showCreateModal.value = true
}

const handleEditUser = (user: User) => {
  userToEdit.value = user
  showEditModal.value = true
}

const handleDeleteUser = (user: User) => {
  userToDelete.value = user
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (userToDelete.value) {
    await usersStore.deleteUser(userToDelete.value.id)
    showDeleteDialog.value = false
    userToDelete.value = null
  }
}

const handleUserCreated = () => {
  showCreateModal.value = false
  usersStore.fetchUsers() // Refresh the user list
}

const handleUserUpdated = () => {
  showEditModal.value = false
  userToEdit.value = null
  usersStore.fetchUsers() // Refresh the user list
}

const handleExport = async () => {
  if (isExporting.value) return
  
  isExporting.value = true
  
  try {
    // Show a brief notification about the export starting
    const totalUsers = usersStore.filteredUsers.length
    
    if (totalUsers === 0) {
      alert('No users to export. Please adjust your filters or add some users first.')
      return
    }
    
    // Use client-side export for better performance with current filtered data
    const result = await usersStore.exportUsers('csv', false)
    
    if (result.success) {
      // Show success message
      const message = `Successfully exported ${totalUsers} user${totalUsers === 1 ? '' : 's'} to CSV file.`
      
      // You could replace this with a toast notification component
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300'
      notification.textContent = message
      document.body.appendChild(notification)
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0'
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    } else {
      throw new Error(result.error || 'Export failed')
    }
  } catch (error: any) {
    console.error('Export error:', error)
    alert(`Export failed: ${error.message || 'Unknown error occurred'}`)
  } finally {
    isExporting.value = false
  }
}


</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage user accounts, roles, and permissions
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
    
        <button
          @click="handleExport"
          :disabled="isExporting || usersStore.isLoading"
          class="btn btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="isExporting" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <Download v-else class="w-4 h-4 mr-2" />
          {{ isExporting ? 'Exporting...' : 'Export' }}
        </button>
        <button
          @click="handleCreateUser"
          class="btn btn-primary px-4 py-2"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ usersStore.totalUsers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <UserCheck class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ usersStore.users.filter(u => u.isActive).length }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ usersStore.users.filter(u => u.role === 'ADMIN').length }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ usersStore.users.filter(u => !u.isActive).length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <UserFilters />

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <UserTable
        :users="usersStore.paginatedUsers"
        :loading="usersStore.isLoading"
        @edit="handleEditUser"
        @delete="handleDeleteUser"
      />
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        Showing {{ (usersStore.currentPage - 1) * usersStore.itemsPerPage + 1 }} to 
        {{ Math.min(usersStore.currentPage * usersStore.itemsPerPage, usersStore.filteredUsers.length) }} 
        of {{ usersStore.filteredUsers.length }} results
      </p>
      <div class="flex space-x-2">
        <button
          :disabled="usersStore.currentPage === 1"
          @click="usersStore.setPage(usersStore.currentPage - 1)"
          class="btn btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          v-for="page in Math.min(usersStore.totalPages, 5)"
          :key="page"
          @click="usersStore.setPage(page)"
          :class="[
            'btn px-3 py-2',
            page === usersStore.currentPage ? 'btn-primary' : 'btn-outline'
          ]"
        >
          {{ page }}
        </button>
        <button
          :disabled="usersStore.currentPage === usersStore.totalPages"
          @click="usersStore.setPage(usersStore.currentPage + 1)"
          class="btn btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Delete User"
      :message="`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
    />

    <!-- Create User Modal -->
    <CreateUserModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />

    <!-- Edit User Modal -->
    <EditUserModal
      :show="showEditModal"
      :user="userToEdit"
      @close="showEditModal = false"
      @updated="handleUserUpdated"
    />
  </div>
</template>
