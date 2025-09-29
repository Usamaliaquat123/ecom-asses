import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closable = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  header,
  footer,
  className
}) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-7xl mx-4'
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative bg-white rounded-2xl shadow-xl transform transition-all w-full',
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(header || title || closable) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                {header || (
                  title && (
                    <h3 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h3>
                  )
                )}
              </div>
              
              {closable && (
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="p-6">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default Modal
