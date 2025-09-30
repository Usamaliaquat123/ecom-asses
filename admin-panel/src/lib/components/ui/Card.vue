<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header || title" :class="headerClasses">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    
    <!-- Body -->
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <!-- Footer -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: false
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl transition-all duration-200'
  
  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    outlined: 'border-2 border-gray-200 dark:border-gray-700',
    elevated: 'shadow-lg border border-gray-100 dark:border-gray-700'
  }
  
  const hoverClasses = props.hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600' : ''
  
  return [baseClasses, variantClasses[props.variant], hoverClasses].filter(Boolean).join(' ')
})

const headerClasses = computed(() => {
  const baseClasses = 'border-b border-gray-200 dark:border-gray-700'
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return [baseClasses, paddingClasses[props.padding]].join(' ')
})

const bodyClasses = computed(() => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return paddingClasses[props.padding]
})

const footerClasses = computed(() => {
  const baseClasses = 'border-t border-gray-200 dark:border-gray-700'
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return [baseClasses, paddingClasses[props.padding]].join(' ')
})
</script>
