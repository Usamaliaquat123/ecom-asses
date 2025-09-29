import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

// Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  address: string
  role?: 'ADMIN' | 'USER' | 'MODERATOR'
}

export interface User {
  id: number
  email: string
  role: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  isActive?: boolean
  status?: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  address: string
  role: 'admin' | 'moderator' | 'user'
}

export interface UpdateUserData {
  id: number
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  role?: 'admin' | 'moderator' | 'user'
  isActive?: boolean
}

export interface PaginatedResponse<T> {
  users: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface DashboardData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalRoles: number
    systemActivity: number
    growth: {
      users: number
      activeUsers: number
      systemActivity: number
    }
  }
  charts: {
    userGrowth: Array<{ date: string; users: number }>
    usersByRole: Array<{ role: string; count: number; percentage: number }>
    activityData: Array<{ date: string; logins: number; pageViews: number; apiCalls: number }>
  }
  recentActivity: Array<{
    id: number
    name: string
    email: string
    role: string
    action: string
    timestamp: string
    avatar?: string
  }>
  period: string
  generatedAt: string
}

class ApiService {
  private api: AxiosInstance
  private token: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Load token from localStorage
    this.token = localStorage.getItem('auth_token')
    if (this.token) {
      this.setAuthHeader(this.token)
    }

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message)
        
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
          this.clearAuth()
          window.location.href = '/login'
        }
        
        return Promise.reject(error)
      }
    )
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  private clearAuth() {
    this.token = null
    localStorage.removeItem('auth_token')
    delete this.api.defaults.headers.common['Authorization']
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.api.post('/auth/login', credentials)
      const { data } = response.data

      if (data.token) {
        this.token = data.token
        localStorage.setItem('auth_token', data.token)
        this.setAuthHeader(data.token)
      }

      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Login failed' }
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.api.post('/auth/register', userData)
      const { data } = response.data

      if (data.token) {
        this.token = data.token
        localStorage.setItem('auth_token', data.token)
        this.setAuthHeader(data.token)
      }

      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Registration failed' }
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuth()
    }
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await this.api.get('/auth/me')
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to get current user' }
    }
  }

  // User management methods
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
    sortBy?: string
    sortOrder?: string
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const response = await this.api.get('/users', { params })
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch users' }
    }
  }

  async getUserById(id: number): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await this.api.get(`/users/${id}`)
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch user' }
    }
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await this.api.post('/users', userData)
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to create user' }
    }
  }

  async updateUser(id: number, userData: Partial<UpdateUserData>): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await this.api.put(`/users/${id}`, userData)
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to update user' }
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/users/${id}`)
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to delete user' }
    }
  }

  // Analytics methods
  async getDashboardAnalytics(period?: string): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await this.api.get('/analytics/dashboard', {
        params: { period }
      })
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch dashboard analytics' }
    }
  }

  async getUserAnalytics(params?: {
    period?: string
    groupBy?: string
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/analytics/users', { params })
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch user analytics' }
    }
  }

  // File upload methods
  async uploadFile(file: File): Promise<ApiResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to upload file' }
    }
  }

  async uploadMultipleFiles(files: File[]): Promise<ApiResponse> {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const response = await this.api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to upload files' }
    }
  }

  // Reports methods
  async exportData(params: {
    type: 'users' | 'analytics' | 'sales'
    format?: 'csv' | 'json'
    startDate?: string
    endDate?: string
  }): Promise<Blob> {
    try {
      const response = await this.api.get('/reports/export', {
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw error.response?.data || new Error('Failed to export data')
    }
  }

  async getReportsSummary(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/reports/summary')
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch reports summary' }
    }
  }

  // Integration methods
  async getIntegrationStatus(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/integrations/status')
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch integration status' }
    }
  }

  async testWebhook(data: { source: string; event: string }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/integrations/test', data)
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to test webhook' }
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await this.api.get('/health')
      return response.data
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Health check failed' }
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()
export default apiService
