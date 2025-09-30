<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import UserChart from '@/components/charts/UserChart.vue'
import ActivityChart from '@/components/charts/ActivityChart.vue'
import RecentUsers from '@/components/dashboard/RecentUsers.vue'
import { Users, UserCheck, Shield, Activity } from 'lucide-vue-next'

const usersStore = useUsersStore()
const isLoading = ref(true)

const stats = ref([
  {
    title: 'Total Users',
    value: '0',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'blue' as const
  },
  {
    title: 'Active Users',
    value: '0',
    change: '+8%',
    changeType: 'positive' as const,
    icon: UserCheck,
    color: 'green' as const
  },
  {
    title: 'Total Roles',
    value: '3',
    change: '+2',
    changeType: 'positive' as const,
    icon: Shield,
    color: 'purple' as const
  },
  {
    title: 'System Activity',
    value: '98.5%',
    change: '+0.5%',
    changeType: 'positive' as const,
    icon: Activity,
    color: 'orange' as const
  }
])

onMounted(async () => {
  await usersStore.fetchUsers()
  
  // Update stats with real data
  stats.value[0].value = usersStore.totalUsers.toString()
  stats.value[1].value = usersStore.users.filter(u => u.isActive).length.toString()
  
  isLoading.value = false
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
      <h1 class="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
      <p class="text-purple-100">Here's what's happening with your system today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
        :change-type="stat.changeType"
        :icon="stat.icon"
        :color="stat.color"
        :loading="isLoading"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
        <UserChart />
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Activity</h3>
        <ActivityChart />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <RecentUsers />
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">New user registered</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">System backup completed</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">Role permissions updated</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">New admin user created</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <button class="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
