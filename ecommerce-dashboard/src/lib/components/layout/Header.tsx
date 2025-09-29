import React from 'react'
import { cn } from '@/utils/cn'

export interface HeaderAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface HeaderProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  actions?: HeaderAction[]
  showSecondaryBar?: boolean
  className?: string
  children?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  icon,
  breadcrumbs,
  actions,
  showSecondaryBar = false,
  className,
  children
}) => {
  const renderAction = (action: HeaderAction, index: number) => {
    const baseClasses = 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 focus:ring-purple-500',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
    }

    return (
      <button
        key={index}
        onClick={action.onClick}
        className={cn(baseClasses, variantClasses[action.variant || 'primary'])}
      >
        {action.icon && (
          <span className="mr-2">{action.icon}</span>
        )}
        {action.label}
      </button>
    )
  }

  return (
    <div className={cn('bg-white border-b border-gray-200', className)}>
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {icon && (
              <div className="flex-shrink-0 p-2 bg-purple-100 rounded-xl">
                <span className="text-purple-600">{icon}</span>
              </div>
            )}
            
            <div>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {item.href ? (
                        <a
                          href={item.href}
                          className="hover:text-gray-700 transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                          {item.label}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
              
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">
                  {title}
                </h1>
              )}
              
              {subtitle && (
                <p className="text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {actions && actions.length > 0 && (
            <div className="flex items-center space-x-3">
              {actions.map(renderAction)}
            </div>
          )}
        </div>
      </div>
      
      {/* Secondary Bar */}
      {showSecondaryBar && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}

export default Header
