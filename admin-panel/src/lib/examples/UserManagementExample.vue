<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <Card>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600">Manage your application users</p>
        </div>
        
        <Button @click="showCreateModal = true">
          <template #icon-left>
            <PlusIcon class="w-4 h-4" />
          </template>
          Add User
        </Button>
      </div>
    </Card>

    <!-- Filters -->
    <Card title="Filters">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          v-model="filters.search"
          placeholder="Search users..."
          @input="handleSearch"
        >
          <template #icon>
            <SearchIcon class="w-4 h-4" />
          </template>
        </Input>
        
        <Select
          v-model="filters.role"
          placeholder="Filter by role"
          :options="roleOptions"
          @update:model-value="handleFilter"
        />
        
        <Select
          v-model="filters.status"
          placeholder="Filter by status"
          :options="statusOptions"
          @update:model-value="handleFilter"
        />
      </div>
    </Card>

    <!-- Users Table -->
    <Card>
      <Table
        :columns="columns"
        :data="filteredUsers"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        hoverable
        @sort="handleSort"
        @row-click="handleRowClick"
      >
        <!-- Avatar Column -->
        <template #cell-avatar="{ item }">
          <img
            :src="item.avatar || getDefaultAvatar(item.name)"
            :alt="item.name"
            class="w-8 h-8 rounded-full object-cover"
          />
        </template>
        
        <!-- Status Column -->
        <template #cell-status="{ value }">
          <Badge
            :variant="value === 'active' ? 'success' : 'danger'"
            rounded
          >
            {{ value }}
          </Badge>
        </template>
        
        <!-- Role Column -->
        <template #cell-role="{ value }">
          <Badge
            :variant="getRoleVariant(value)"
            size="sm"
          >
            {{ value }}
          </Badge>
        </template>
        
        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              @click.stop="editUser(item)"
            >
              <EditIcon class="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              @click.stop="deleteUser(item)"
            >
              <TrashIcon class="w-4 h-4" />
            </Button>
          </div>
        </template>
        
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <UsersIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p class="text-gray-500 mb-4">Get started by creating your first user.</p>
            <Button @click="showCreateModal = true">
              <template #icon-left>
                <PlusIcon class="w-4 h-4" />
              </template>
              Add User
            </Button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Create User Modal -->
    <Modal
      :show="showCreateModal"
      title="Create New User"
      size="lg"
      @close="showCreateModal = false"
    >
      <form @submit.prevent="handleCreateUser" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            :error="errors.firstName"
            required
          >
            <Input
              v-model="newUser.firstName"
              placeholder="Enter first name"
            />
          </FormField>
          
          <FormField
            label="Last Name"
            :error="errors.lastName"
            required
          >
            <Input
              v-model="newUser.lastName"
              placeholder="Enter last name"
            />
          </FormField>
        </div>
        
        <FormField
          label="Email Address"
          :error="errors.email"
          required
        >
          <Input
            v-model="newUser.email"
            type="email"
            placeholder="Enter email address"
          />
        </FormField>
        
        <FormField
          label="Role"
          :error="errors.role"
          required
        >
          <Select
            v-model="newUser.role"
            :options="roleOptions"
            placeholder="Select user role"
          />
        </FormField>
        
        <FormField
          label="Password"
          :error="errors.password"
          hint="Password must be at least 8 characters"
          required
        >
          <Input
            v-model="newUser.password"
            type="password"
            placeholder="Enter password"
          />
        </FormField>
      </form>
      
      <template #footer>
        <Button
          variant="secondary"
          @click="showCreateModal = false"
        >
          Cancel
        </Button>
        
        <Button
          :loading="isCreating"
          loading-text="Creating..."
          @click="handleCreateUser"
        >
          <template #icon-left>
            <UserPlusIcon class="w-4 h-4" />
          </template>
          Create User
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Button,
  Input,
  Select,
  Modal,
  Card,
  Table,
  Badge,
  FormField
} from '@/lib/components'
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  UserPlusIcon
} from 'lucide-vue-next'

// Data
const users = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'ADMIN',
    status: 'active',
    avatar: null,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'USER',
    status: 'active',
    avatar: null,
    createdAt: '2024-01-14'
  }
])

// State
const showCreateModal = ref(false)
const isCreating = ref(false)
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const filters = reactive({
  search: '',
  role: '',
  status: ''
})

const newUser = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: ''
})

// Options
const roleOptions = [
  { label: 'Administrator', value: 'ADMIN' },
  { label: 'Moderator', value: 'MODERATOR' },
  { label: 'User', value: 'USER' }
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

// Table columns
const columns = [
  { key: 'avatar', title: '', width: '60px' },
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role' },
  { key: 'status', title: 'Status' },
  { key: 'actions', title: 'Actions', align: 'right' as const }
]

// Computed
const filteredUsers = computed(() => {
  let result = users.value

  if (filters.search) {
    result = result.filter(user =>
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  if (filters.role) {
    result = result.filter(user => user.role === filters.role)
  }

  if (filters.status) {
    result = result.filter(user => user.status === filters.status)
  }

  return result
})

// Methods
const handleSearch = () => {
  // Debounced search logic would go here
}

const handleFilter = () => {
  // Filter logic
}

const handleSort = (column: any, order: 'asc' | 'desc') => {
  sortBy.value = column.key
  sortOrder.value = order
}

const handleRowClick = (user: any) => {
  console.log('Row clicked:', user)
}

const editUser = (user: any) => {
  console.log('Edit user:', user)
}

const deleteUser = (user: any) => {
  console.log('Delete user:', user)
}

const handleCreateUser = async () => {
  // Validation
  errors.firstName = newUser.firstName ? '' : 'First name is required'
  errors.lastName = newUser.lastName ? '' : 'Last name is required'
  errors.email = newUser.email ? '' : 'Email is required'
  errors.role = newUser.role ? '' : 'Role is required'
  errors.password = newUser.password ? '' : 'Password is required'

  const hasErrors = Object.values(errors).some(error => error)
  if (hasErrors) return

  isCreating.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add user to list
    users.value.push({
      id: Date.now(),
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      avatar: null,
      createdAt: new Date().toISOString()
    })

    // Reset form
    Object.assign(newUser, {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      password: ''
    })

    showCreateModal.value = false
  } catch (error) {
    console.error('Failed to create user:', error)
  } finally {
    isCreating.value = false
  }
}

const getRoleVariant = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'danger'
    case 'MODERATOR': return 'warning'
    default: return 'primary'
  }
}

const getDefaultAvatar = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
}
</script>
