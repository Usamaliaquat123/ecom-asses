<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BarChart3, TrendingUp, Users, Activity, Download, Calendar } from 'lucide-vue-next'
import UserChart from '@/components/charts/UserChart.vue'
import ActivityChart from '@/components/charts/ActivityChart.vue'

const isLoading = ref(true)
const selectedPeriod = ref('7d')

const periods = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' }
]

const stats = ref([
  {
    title: 'Total Page Views',
    value: '45,231',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: BarChart3,
    color: 'blue'
  },
  {
    title: 'Unique Visitors',
    value: '12,543',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'green'
  },
  {
    title: 'Active Sessions',
    value: '2,847',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: Activity,
    color: 'purple'
  },
  {
    title: 'Bounce Rate',
    value: '34.2%',
    change: '-2.1%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'orange'
  }
])

const topPages = ref([
  { path: '/dashboard', views: 8543, percentage: 18.9 },
  { path: '/users', views: 6234, percentage: 13.8 },
  { path: '/analytics', views: 4521, percentage: 10.0 },
  { path: '/settings', views: 3876, percentage: 8.6 },
  { path: '/roles', views: 2987, percentage: 6.6 }
])

const recentActivity = ref([
  {
    id: '1',
    user: 'John Doe',
    action: 'Created new user',
    target: 'Sarah Johnson',
    timestamp: '2 minutes ago',
    type: 'create'
  },
  {
    id: '2',
    user: 'Admin',
    action: 'Updated system settings',
    target: 'Security settings',
    timestamp: '15 minutes ago',
    type: 'update'
  },
  {
    id: '3',
    user: 'Jane Smith',
    action: 'Deleted user',
    target: 'Mike Wilson',
    timestamp: '1 hour ago',
    type: 'delete'
  },
  {
    id: '4',
    user: 'System',
    action: 'Backup completed',
    target: 'Database backup',
    timestamp: '2 hours ago',
    type: 'system'
  }
])

onMounted(async () => {
  // Simulate loading analytics data
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
})

const getActivityColor = (type: string) => {
  const colors = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    system: 'bg-gray-100 text-gray-800'
  }
  return colors[type as keyof typeof colors] || colors.system
}

const getActivityIcon = (type: string) => {
  const icons = {
    create: '+',
    update: '↻',
    delete: '×',
    system: '⚙'
  }
  return icons[type as keyof typeof icons] || icons.system
}

const exportData = () => {
  console.log('Exporting analytics data...')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p class="mt-1 text-sm text-gray-500">
          Monitor system usage and user activity
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <select
          v-model="selectedPeriod"
          class="input min-w-[150px]"
        >
          <option v-for="period in periods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
        <button
          @click="exportData"
          class="btn btn-outline px-4 py-2"
        >
          <Download class="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.title }}</p>
            <div v-if="isLoading" class="animate-pulse">
              <div class="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div v-else>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ stat.value }}</p>
              <div class="flex items-center">
                <TrendingUp :class="['w-4 h-4 mr-1', stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500']" />
                <span :class="['text-sm font-medium', stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600']">
                  {{ stat.change }}
                </span>
                <span class="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          </div>
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center',
            stat.color === 'blue' ? 'bg-blue-100' :
            stat.color === 'green' ? 'bg-green-100' :
            stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
          ]">
            <component 
              :is="stat.icon" 
              :class="[
                'w-6 h-6',
                stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'green' ? 'text-green-600' :
                stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
              ]" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">User Activity Trend</h3>
          <Calendar class="w-5 h-5 text-gray-400" />
        </div>
        <UserChart />
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Session Distribution</h3>
          <Activity class="w-5 h-5 text-gray-400" />
        </div>
        <ActivityChart />
      </div>
    </div>

    <!-- Detailed Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Pages -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Top Pages</h3>
        <div class="space-y-4">
          <div
            v-for="page in topPages"
            :key="page.path"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ page.path }}</p>
              <p class="text-xs text-gray-500">{{ page.views.toLocaleString() }} views</p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-purple-600 h-2 rounded-full" 
                  :style="{ width: `${page.percentage}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-900 w-12 text-right">
                {{ page.percentage }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start space-x-3"
          >
            <div :class="['flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', getActivityColor(activity.type)]">
              {{ getActivityIcon(activity.type) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">
                <span class="font-medium">{{ activity.user }}</span>
                {{ activity.action.toLowerCase() }}
                <span class="font-medium">{{ activity.target }}</span>
              </p>
              <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <button class="text-sm text-purple-600 hover:text-purple-700 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">System Performance</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity class="w-8 h-8 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900">99.9%</p>
          <p class="text-sm text-gray-500">Uptime</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp class="w-8 h-8 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900">1.2s</p>
          <p class="text-sm text-gray-500">Avg Response Time</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 class="w-8 h-8 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900">45GB</p>
          <p class="text-sm text-gray-500">Data Processed</p>
        </div>
      </div>
    </div>
  </div>
</template>
