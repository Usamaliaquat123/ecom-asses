// Data Components
export { default as Table } from './Table.vue'

// Types
export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
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
}
