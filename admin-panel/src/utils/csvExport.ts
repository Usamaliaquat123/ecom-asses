import type { User } from '@/types'

export interface ExportOptions {
  filename?: string
  includeHeaders?: boolean
  selectedFields?: (keyof User)[]
}

/**
 * Converts an array of users to CSV format
 */
export function convertToCSV(users: User[], options: ExportOptions = {}): string {
  const {
    includeHeaders = true,
    selectedFields = [
      'id',
      'firstName', 
      'lastName',
      'email',
      'phone',
      'address',
      'role',
      'status',
      'isActive',
      'createdAt',
      'lastLogin'
    ]
  } = options

  if (users.length === 0) {
    return includeHeaders ? selectedFields.join(',') : ''
  }

  const csvRows: string[] = []

  // Add headers if requested
  if (includeHeaders) {
    const headers = selectedFields.map(field => {
      // Convert camelCase to Title Case for better readability
      return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    })
    csvRows.push(headers.join(','))
  }

  // Add data rows
  users.forEach(user => {
    const row = selectedFields.map(field => {
      let value = user[field]
      
      // Handle different data types
      if (value === null || value === undefined) {
        return ''
      }
      
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
      }
      
      if (field === 'createdAt' || field === 'lastLogin') {
        // Format dates nicely
        return value ? new Date(value).toLocaleString() : ''
      }
      
      if (field === 'permissions' && Array.isArray(value)) {
        return `"${value.join('; ')}"`
      }
      
      if (field === 'lastLogin' && value === null) {
        return 'Never'
      }
      
      // Escape commas and quotes in string values
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      
      return stringValue
    })
    
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}

/**
 * Downloads CSV data as a file
 */
export function downloadCSV(csvContent: string, filename: string = 'users-export.csv'): void {
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF'
  const csvWithBOM = BOM + csvContent
  
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Exports users to CSV and triggers download
 */
export function exportUsersToCSV(users: User[], options: ExportOptions = {}): void {
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  const defaultFilename = `users-export-${timestamp}.csv`
  
  const csvContent = convertToCSV(users, options)
  const filename = options.filename || defaultFilename
  
  downloadCSV(csvContent, filename)
}

/**
 * Gets a summary of what will be exported
 */
export function getExportSummary(users: User[], options: ExportOptions = {}): {
  totalUsers: number
  fields: string[]
  estimatedSize: string
} {
  const selectedFields = options.selectedFields || [
    'id', 'firstName', 'lastName', 'email', 'phone', 'address', 'role', 'status', 'isActive', 'createdAt', 'lastLogin'
  ]
  
  const csvContent = convertToCSV(users.slice(0, 1), options) // Sample with one user
  const estimatedSizePerUser = csvContent.length
  const totalEstimatedSize = estimatedSizePerUser * users.length
  
  let sizeString = ''
  if (totalEstimatedSize < 1024) {
    sizeString = `${totalEstimatedSize} bytes`
  } else if (totalEstimatedSize < 1024 * 1024) {
    sizeString = `${(totalEstimatedSize / 1024).toFixed(1)} KB`
  } else {
    sizeString = `${(totalEstimatedSize / (1024 * 1024)).toFixed(1)} MB`
  }
  
  return {
    totalUsers: users.length,
    fields: selectedFields.map(field => 
      field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    ),
    estimatedSize: sizeString
  }
}
