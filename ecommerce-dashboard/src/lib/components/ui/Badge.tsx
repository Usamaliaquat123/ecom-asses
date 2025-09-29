import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: boolean
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'sm',
    rounded = false,
    dot = false,
    children,
    ...props
  }, ref) => {
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
    
    const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg'
    
    const dotClasses = {
      default: 'bg-gray-400',
      primary: 'bg-purple-600',
      secondary: 'bg-gray-400',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600',
      info: 'bg-blue-600'
    }

    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            'inline-flex items-center space-x-1.5',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              dotClasses[variant]
            )}
          />
          <span className="text-sm font-medium text-gray-900">
            {children}
          </span>
        </span>
      )
    }

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses,
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
