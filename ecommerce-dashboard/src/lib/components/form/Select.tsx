import React from 'react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[] | string[]
  placeholder?: string
  fullWidth?: boolean
  selectSize?: 'sm' | 'md' | 'lg'
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    label,
    error,
    hint,
    options,
    placeholder,
    fullWidth = true,
    selectSize = 'md',
    id,
    required,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    
    const baseClasses = 'block rounded-xl border-gray-300 shadow-sm transition-colors duration-200 focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-500'
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base'
    }
    
    const widthClass = fullWidth ? 'w-full' : ''
    const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''

    const getOptionValue = (option: SelectOption | string): string | number => {
      return typeof option === 'string' ? option : option.value
    }

    const getOptionLabel = (option: SelectOption | string): string => {
      return typeof option === 'string' ? option : option.label
    }

    const getOptionDisabled = (option: SelectOption | string): boolean => {
      return typeof option === 'string' ? false : option.disabled || false
    }

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={cn(
            baseClasses,
            sizeClasses[selectSize],
            widthClass,
            errorClasses,
            className
          )}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option, index) => (
            <option
              key={index}
              value={getOptionValue(option)}
              disabled={getOptionDisabled(option)}
            >
              {getOptionLabel(option)}
            </option>
          ))}
        </select>
        
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

Select.displayName = 'Select'

export default Select
