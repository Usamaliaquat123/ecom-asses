import React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  rightAction?: React.ReactNode
  fullWidth?: boolean
  inputSize?: 'sm' | 'md' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    rightAction,
    fullWidth = true,
    inputSize = 'md',
    id,
    required,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    const baseClasses = 'block rounded-xl border-gray-300 shadow-sm transition-colors duration-200 focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-500'
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base'
    }
    
    const widthClass = fullWidth ? 'w-full' : ''
    const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
    const iconPadding = leftIcon ? 'pl-10' : rightIcon || rightAction ? 'pr-10' : ''

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseClasses,
              sizeClasses[inputSize],
              widthClass,
              errorClasses,
              iconPadding,
              className
            )}
            required={required}
            {...props}
          />
          
          {(rightIcon || rightAction) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightAction ? (
                <span>{rightAction}</span>
              ) : (
                <span className="text-gray-400 text-sm pointer-events-none">
                  {rightIcon}
                </span>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
        
        {hint && !error && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
