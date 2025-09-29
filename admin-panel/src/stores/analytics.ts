import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { apiService } from '@/services/api'
import type { DashboardData } from '@/services/api'

export const useAnalyticsStore = defineStore('analytics', () => {
  const dashboardData = ref<DashboardData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchDashboardData = async (period?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.getDashboardAnalytics(period)
      
      if (response.success && response.data) {
        dashboardData.value = response.data
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch dashboard data'
      console.error('Dashboard analytics error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const refreshData = () => {
    if (dashboardData.value) {
      fetchDashboardData(dashboardData.value.period)
    } else {
      fetchDashboardData()
    }
  }

  return {
    dashboardData: readonly(dashboardData),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchDashboardData,
    refreshData
  }
})
