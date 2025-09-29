import React from 'react'
import { cn } from '@/utils/cn'

export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  render?: (value: any, item: any, index: number) => React.ReactNode
}

export interface TableProps {
  columns: TableColumn[]
  data: any[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  hoverable?: boolean
  striped?: boolean
  emptyText?: string
  rowKey?: string
  onSort?: (column: TableColumn, order: 'asc' | 'desc') => void
  onRowClick?: (item: any, index: number) => void
  className?: string
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  sortBy,
  sortOrder,
  hoverable = true,
  striped = false,
  emptyText = 'No data available',
  rowKey = 'id',
  onSort,
  onRowClick,
  className
}) => {
  const getHeaderClasses = (column: TableColumn) => {
    const baseClasses = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
    const sortableClasses = column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
    
    return cn(
      baseClasses,
      sortableClasses,
      alignClasses[column.align || 'left']
    )
  }

  const getCellClasses = (column: TableColumn) => {
    const baseClasses = 'px-6 py-4 whitespace-nowrap text-sm'
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
    
    return cn(baseClasses, alignClasses[column.align || 'left'])
  }

  const getRowClasses = (index: number) => {
    const baseClasses = ''
    const hoverClasses = hoverable ? 'hover:bg-gray-50 cursor-pointer' : ''
    const stripedClasses = striped && index % 2 === 1 ? 'bg-gray-50' : ''
    
    return cn(baseClasses, hoverClasses, stripedClasses)
  }

  const getSortIconClasses = (column: TableColumn, direction: 'asc' | 'desc') => {
    const isActive = sortBy === column.key && sortOrder === direction
    return isActive ? 'text-purple-600' : 'text-gray-300'
  }

  const getRowKey = (item: any, index: number) => {
    return item[rowKey] || index
  }

  const getColumnValue = (item: any, key: string) => {
    return key.split('.').reduce((obj, k) => obj?.[k], item)
  }

  const handleSort = (column: TableColumn) => {
    if (!column.sortable || !onSort) return
    
    let newOrder: 'asc' | 'desc' = 'asc'
    
    if (sortBy === column.key) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    }
    
    onSort(column, newOrder)
  }

  const handleRowClick = (item: any, index: number) => {
    if (onRowClick) {
      onRowClick(item, index)
    }
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={getHeaderClasses(column)}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    
                    {/* Sort Icons */}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={cn('w-3 h-3', getSortIconClasses(column, 'asc'))}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <svg
                          className={cn('w-3 h-3 -mt-1', getSortIconClasses(column, 'desc'))}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                      />
                    </svg>
                    <p className="text-sm">{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={getRowKey(item, index)}
                  className={getRowClasses(index)}
                  onClick={() => handleRowClick(item, index)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={getCellClasses(column)}
                    >
                      {column.render
                        ? column.render(getColumnValue(item, column.key), item, index)
                        : getColumnValue(item, column.key)
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
