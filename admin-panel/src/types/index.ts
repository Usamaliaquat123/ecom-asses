export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  role: 'admin' | 'moderator' | 'user'
  permissions: string[]
  avatar?: string
  isActive: boolean
  status?: 'active' | 'inactive'
  lastLogin: string | null
  createdAt: string
}

export interface CreateUserData {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  role: 'admin' | 'moderator' | 'user'
  password: string
}

export interface UpdateUserData {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  role?: 'admin' | 'moderator' | 'user'
  isActive?: boolean
  status?: 'active' | 'inactive'
  password?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface UserFilters {
  search: string
  role: string
  status: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRoles: number
  totalPermissions: number
  userGrowth: number
  activeUserGrowth: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

export interface SystemSettings {
  siteName: string
  siteDescription: string
  allowRegistration: boolean
  requireEmailVerification: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  enableTwoFactor: boolean
  maintenanceMode: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
}
