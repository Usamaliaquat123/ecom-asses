<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

interface Props {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const colorClasses = computed(() => {
  const colors = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-500 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-500 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      icon: 'text-purple-500 dark:text-purple-400'
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
      icon: 'text-orange-500 dark:text-orange-400'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-500 dark:text-red-400'
    }
  }
  return colors[props.color]
})

const changeClasses = computed(() => {
  return {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }[props.changeType]
})

const TrendIcon = computed(() => {
  return props.changeType === 'positive' ? TrendingUp : TrendingDown
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ title }}</p>
        <div v-if="loading" class="animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div v-else>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ value }}</p>
          <div class="flex items-center">
            <TrendIcon :class="['w-4 h-4 mr-1', changeClasses]" />
            <span :class="['text-sm font-medium', changeClasses]">{{ change }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
          </div>
        </div>
      </div>
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', colorClasses.bg]">
        <component :is="icon" :class="['w-6 h-6', colorClasses.icon]" />
      </div>
    </div>
  </div>
</template>
