import React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  header?: React.ReactNode
  footer?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    title,
    subtitle,
    variant = 'default',
    padding = 'md',
    hover = false,
    header,
    footer,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'bg-white rounded-2xl transition-all duration-200'
    
    const variantClasses = {
      default: 'border border-gray-200',
      outlined: 'border-2 border-gray-200',
      elevated: 'shadow-lg border border-gray-100',
      glass: 'backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl'
    }
    
    const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : ''
    
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }

    const hasHeader = header || title || subtitle
    const hasFooter = footer

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          hoverClasses,
          className
        )}
        {...props}
      >
        {hasHeader && (
          <div className={cn(
            'border-b border-gray-200',
            paddingClasses[padding]
          )}>
            {header || (
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className={cn(paddingClasses[padding])}>
          {children}
        </div>
        
        {hasFooter && (
          <div className={cn(
            'border-t border-gray-200',
            paddingClasses[padding]
          )}>
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
