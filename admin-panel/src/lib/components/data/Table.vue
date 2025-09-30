<template>
  <div class="overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Header -->
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="getHeaderClasses(column)"
              @click="handleSort(column)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.title }}</span>
                
                <!-- Sort Icons -->
                <div v-if="column.sortable" class="flex flex-col">
                  <svg
                    :class="getSortIconClasses(column, 'asc')"
                    class="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg
                    :class="getSortIconClasses(column, 'desc')"
                    class="w-3 h-3 -mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        
        <!-- Body -->
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(item, index) in data"
            :key="getRowKey(item, index)"
            :class="getRowClasses(item, index)"
            @click="$emit('row-click', item, index)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="getCellClasses(column)"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="getColumnValue(item, column.key)"
                :index="index"
              >
                {{ getColumnValue(item, column.key) }}
              </slot>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-if="data.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <slot name="empty">
                <div class="flex flex-col items-center space-y-2">
                  <svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                  </svg>
                  <p class="text-sm">{{ emptyText || 'No data available' }}</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  title: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface Props {
  columns: Column[]
  data: any[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  hoverable?: boolean
  striped?: boolean
  emptyText?: string
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: true,
  striped: false,
  rowKey: 'id'
})

const emit = defineEmits<{
  'row-click': [item: any, index: number]
  'sort': [column: Column, order: 'asc' | 'desc']
}>()

const getHeaderClasses = (column: Column) => {
  const baseClasses = 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
  const sortableClasses = column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return [
    baseClasses,
    sortableClasses,
    alignClasses[column.align || 'left']
  ].filter(Boolean).join(' ')
}

const getCellClasses = (column: Column) => {
  const baseClasses = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return [baseClasses, alignClasses[column.align || 'left']].join(' ')
}

const getRowClasses = (item: any, index: number) => {
  const baseClasses = ''
  const hoverClasses = props.hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''
  const stripedClasses = props.striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700' : ''
  
  return [baseClasses, hoverClasses, stripedClasses].filter(Boolean).join(' ')
}

const getSortIconClasses = (column: Column, direction: 'asc' | 'desc') => {
  const isActive = props.sortBy === column.key && props.sortOrder === direction
  return isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-300 dark:text-gray-600'
}

const getRowKey = (item: any, index: number) => {
  return item[props.rowKey] || index
}

const getColumnValue = (item: any, key: string) => {
  return key.split('.').reduce((obj, k) => obj?.[k], item)
}

const handleSort = (column: Column) => {
  if (!column.sortable) return
  
  let newOrder: 'asc' | 'desc' = 'asc'
  
  if (props.sortBy === column.key) {
    newOrder = props.sortOrder === 'asc' ? 'desc' : 'asc'
  }
  
  emit('sort', column, newOrder)
}
</script>
