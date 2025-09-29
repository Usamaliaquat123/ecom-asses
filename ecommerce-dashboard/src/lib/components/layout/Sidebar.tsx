import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

export interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  children?: SidebarItem[]
}

export interface SidebarProps {
  items: SidebarItem[]
  isOpen?: boolean
  onToggle?: () => void
  className?: string
  logo?: React.ReactNode
  footer?: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  isOpen = true,
  onToggle,
  className,
  logo,
  footer
}) => {
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const isActive = isActiveLink(item.href)
    const hasChildren = item.children && item.children.length > 0
    
    const itemClasses = cn(
      'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
      level > 0 && 'ml-4',
      isActive
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    )

    return (
      <div key={item.href}>
        <Link href={item.href} className={itemClasses}>
          <div className="flex items-center space-x-3">
            <span className={cn('flex-shrink-0', isActive ? 'text-white' : 'text-gray-400')}>
              {item.icon}
            </span>
            {isOpen && (
              <span className="truncate">{item.label}</span>
            )}
          </div>
          
          {isOpen && (
            <div className="flex items-center space-x-2">
              {item.badge && (
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-100 text-purple-800'
                )}>
                  {item.badge}
                </span>
              )}
              
              {hasChildren && (
                <svg
                  className={cn('w-4 h-4 transition-transform', isActive ? 'text-white' : 'text-gray-400')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          )}
        </Link>
        
        {hasChildren && isOpen && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
      isOpen ? 'w-64' : 'w-16',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && logo && (
          <div className="flex items-center space-x-2">
            {logo}
          </div>
        )}
        
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map(item => renderSidebarItem(item))}
      </nav>
      
      {/* Footer */}
      {footer && isOpen && (
        <div className="p-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Sidebar
