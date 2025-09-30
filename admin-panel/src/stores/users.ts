import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { apiService } from '@/services/api'
import type { CreateUserData, UpdateUserData } from '@/services/api'
import type { User } from '@/types'

interface UserFilters {
  search: string
  role: string
  status: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalUsers = ref(0)
  const filters = ref<UserFilters>({
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-0123',
      address: '123 Admin Street, New York, NY 10001',
      role: 'ADMIN',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      email: 'moderator@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0456',
      address: '456 Moderator Ave, Los Angeles, CA 90210',
      role: 'MODERATOR',
      permissions: ['read', 'write'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      status: 'active',
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
      createdAt: '2024-01-20T14:20:00Z'
    },
    {
      id: '3',
      email: 'user@example.com',
      firstName: 'Mike',
      lastName: 'Chen',
      phone: '+1-555-0789',
      address: '789 User Blvd, Chicago, IL 60601',
      role: 'USER',
      permissions: ['read'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isActive: false,
      status: 'inactive',
      lastLogin: new Date(Date.now() - 172800000).toISOString(),
      createdAt: '2024-02-01T09:15:00Z'
    }
  ]

  const filteredUsers = computed(() => {
    let filtered = [...users.value]

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(user => 
        (user.firstName?.toLowerCase() || '').includes(search) ||
        (user.lastName?.toLowerCase() || '').includes(search) ||
        user.email.toLowerCase().includes(search)
      )
    }

    if (filters.value.role) {
      filtered = filtered.filter(user => user.role === filters.value.role)
    }

    if (filters.value.status) {
      const isActive = filters.value.status === 'active'
      filtered = filtered.filter(user => user.isActive === isActive)
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[filters.value.sortBy as keyof User] as string
      const bValue = b[filters.value.sortBy as keyof User] as string
      
      if (filters.value.sortOrder === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    return filtered
  })

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredUsers.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
  })

  const fetchUsers = async (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
    sortBy?: string
    sortOrder?: string
  }) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiService.getUsers(params)
      
      if (response.success && response.data) {
        users.value = response.data.users
        totalUsers.value = response.data.pagination.totalItems
        currentPage.value = response.data.pagination.currentPage
        itemsPerPage.value = response.data.pagination.itemsPerPage
      } else {
        throw new Error(response.message || 'Failed to fetch users')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
      console.error('Fetch users error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createUser = async (userData: CreateUserData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiService.createUser(userData)
      
      if (response.success && response.data) {
        // Add the new user to the local list
        users.value.push(response.data.user)
        totalUsers.value++
        
        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.message || 'Failed to create user')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to create user'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (id: string | number, userData: Partial<UpdateUserData>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiService.updateUser(id, userData)
      
      if (response.success && response.data) {
        // Update the user in the local list
        const userIndex = users.value.findIndex(user => user.id === id)
        if (userIndex !== -1) {
          users.value[userIndex] = response.data.user
        }
        
        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.message || 'Failed to update user')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update user'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteUser = async (id: string | number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiService.deleteUser(id)
      
      if (response.success) {
        // Remove the user from the local list
        const userIndex = users.value.findIndex(user => user.id === id)
        if (userIndex !== -1) {
          users.value.splice(userIndex, 1)
          totalUsers.value--
        }
        
        return { success: true }
      } else {
        throw new Error(response.message || 'Failed to delete user')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete user'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const getUserById = (id: string | number) => {
    return users.value.find(user => user.id === id)
  }

  const updateFilters = (newFilters: Partial<UserFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1 // Reset to first page when filters change
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1
  }

  const exportUsers = async (format: 'csv' | 'xlsx' = 'csv', useServerExport: boolean = false) => {
    isLoading.value = true
    error.value = null
    
    try {
      if (useServerExport) {
        // Use server-side export
        const blob = await apiService.exportUsers(format, {
          search: filters.value.search,
          role: filters.value.role,
          status: filters.value.status
        })
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        const timestamp = new Date().toISOString().split('T')[0]
        link.download = `users-export-${timestamp}.${format}`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        return { success: true }
      } else {
        // Use client-side export with current filtered users
        const { exportUsersToCSV } = await import('@/utils/csvExport')
        const timestamp = new Date().toISOString().split('T')[0]
        
        exportUsersToCSV(filteredUsers.value, {
          filename: `users-export-${timestamp}.csv`
        })
        
        return { success: true }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to export users'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    users: readonly(users),
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    itemsPerPage: readonly(itemsPerPage),
    totalUsers: readonly(totalUsers),
    filters: readonly(filters),
    filteredUsers,
    paginatedUsers,
    totalPages,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    updateFilters,
    setPage,
    setItemsPerPage,
    exportUsers
  }
})
