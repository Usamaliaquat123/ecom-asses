// Main library entry point
export * from './components'

// Utility functions
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
