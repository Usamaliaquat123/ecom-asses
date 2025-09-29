import React from 'react'
import { cn } from '@/utils/cn'

export interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required,
  children,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {children}
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

export default FormField
