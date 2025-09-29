<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'
import UserTable from '@/components/users/UserTable.vue'
import UserFilters from '@/components/users/UserFilters.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import CreateUserModal from '@/components/users/CreateUserModal.vue'
import EditUserModal from '@/components/users/EditUserModal.vue'
import { Plus, Download, Upload, Trash2, Users, UserCheck, Shield, Clock } from 'lucide-vue-next'
import type { User } from '@/types'

const usersStore = useUsersStore()
const router = useRouter()

const selectedUsers = ref<string[]>([])
const showDeleteDialog = ref(false)
const userToDelete = ref<User | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const userToEdit = ref<User | null>(null)

const hasSelectedUsers = computed(() => selectedUsers.value.length > 0)

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

const handleBulkDelete = () => {
  // Implement bulk delete
  console.log('Bulk delete:', selectedUsers.value)
}

const handleExport = () => {
  // Implement export functionality
  console.log('Exporting users...')
}

const handleImport = () => {
  // Implement import functionality
  console.log('Importing users...')
}

const handleSelectionChange = (selected: string[]) => {
  selectedUsers.value = selected
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage user accounts, roles, and permissions
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="handleImport"
          class="btn btn-outline px-4 py-2"
        >
          <Upload class="w-4 h-4 mr-2" />
          Import
        </button>
        <button
          @click="handleExport"
          class="btn btn-outline px-4 py-2"
        >
          <Download class="w-4 h-4 mr-2" />
          Export
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
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ usersStore.totalUsers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck class="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Users</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ usersStore.users.filter(u => u.isActive).length }}
            </p>
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
            <p class="text-sm font-medium text-gray-600">Admins</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ usersStore.users.filter(u => u.role === 'admin').length }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock class="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ usersStore.users.filter(u => !u.isActive).length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <UserFilters />

    <!-- Bulk Actions -->
    <div v-if="hasSelectedUsers" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-blue-700">
          {{ selectedUsers.length }} user{{ selectedUsers.length === 1 ? '' : 's' }} selected
        </p>
        <div class="flex space-x-2">
          <button
            @click="handleBulkDelete"
            class="btn btn-outline text-red-600 border-red-300 hover:bg-red-50 px-3 py-1 text-sm"
          >
            <Trash2 class="w-4 h-4 mr-1" />
            Delete Selected
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <UserTable
        :users="usersStore.paginatedUsers"
        :loading="usersStore.isLoading"
        :selected="selectedUsers"
        @edit="handleEditUser"
        @delete="handleDeleteUser"
        @selection-change="handleSelectionChange"
      />
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-700">
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
