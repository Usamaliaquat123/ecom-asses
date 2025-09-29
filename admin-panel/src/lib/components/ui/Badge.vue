<template>
  <span :class="badgeClasses">
    <slot name="icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  rounded: false
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium'
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-purple-100 text-purple-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  }
  
  const roundedClasses = props.rounded ? 'rounded-full' : 'rounded-lg'
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    roundedClasses
  ].join(' ')
})
</script>
