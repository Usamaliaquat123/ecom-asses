import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/UsersView.vue'),
    meta: { title: 'User Management', requiresAuth: true }
  },
  {
    path: '/users/create',
    name: 'CreateUser',
    component: () => import('@/views/CreateUserView.vue'),
    meta: { title: 'Create User' }
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: () => import('@/views/EditUserView.vue'),
    meta: { title: 'Edit User' }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('@/views/RolesView.vue'),
    meta: { title: 'Role Management' }
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: () => import('@/views/PermissionsView.vue'),
    meta: { title: 'Permissions' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'System Settings' }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/AnalyticsView.vue'),
    meta: { title: 'Analytics' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Update document title
  document.title = `${to.meta.title} - Admin Panel`
  
  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
