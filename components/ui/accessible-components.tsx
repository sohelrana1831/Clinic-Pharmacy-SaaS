'use client'

import React, { forwardRef } from 'react'
import { focusStyles, ariaPatterns } from '@/lib/accessibility-utils'
import { cn } from '@/lib/utils'

// Enhanced Button with accessibility
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  ariaDescribedBy?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    loadingText = 'লোড হচ্ছে...',
    leftIcon,
    rightIcon,
    className,
    disabled,
    ariaDescribedBy,
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'motion-reduce:transition-none',
      focusStyles.ring
    ]

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:bg-primary-50',
      ghost: 'text-primary-600 hover:bg-primary-50 focus:bg-primary-50'
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-md gap-2',
      md: 'px-4 py-2.5 text-base rounded-lg gap-2',
      lg: 'px-6 py-3 text-lg rounded-lg gap-3'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

// Enhanced Input with accessibility
export interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ 
    label, 
    error, 
    helpText, 
    leftIcon, 
    rightIcon, 
    isLoading,
    className, 
    id, 
    required,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = `${inputId}-error`
    const helpId = `${inputId}-help`

    return (
      <div className="space-y-2">
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-error-500 ml-1" aria-label="আবশ্যক ক্ষেত্র">*</span>
          )}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full rounded-lg border-2 px-3 py-2.5 text-gray-900 transition-colors',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              error 
                ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
                : 'border-gray-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              'motion-reduce:transition-none',
              className
            )}
            aria-describedby={cn(
              error && errorId,
              helpText && helpId
            )}
            aria-invalid={error ? 'true' : 'false'}
            required={required}
            {...props}
          />
          
          {rightIcon && !isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">
              {rightIcon}
            </div>
          )}
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
              <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
        
        {error && (
          <p id={errorId} className="text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={helpId} className="text-sm text-gray-600">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'

// Enhanced Card with accessibility
export interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section'
  interactive?: boolean
  pressed?: boolean
}

export const AccessibleCard = forwardRef<HTMLDivElement, AccessibleCardProps>(
  ({ children, as: Component = 'div', interactive = false, pressed, className, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white shadow-sm',
          interactive && [
            'cursor-pointer transition-all duration-200',
            'hover:shadow-md hover:border-gray-300',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            pressed && 'bg-gray-50',
            'motion-reduce:transition-none'
          ],
          className
        )}
        {...(interactive && {
          tabIndex: 0,
          role: 'button',
          'aria-pressed': pressed
        })}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

AccessibleCard.displayName = 'AccessibleCard'

// Enhanced Modal with accessibility
export interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  preventClose?: boolean
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  preventClose = false
}) => {
  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
  const descId = description ? `modal-desc-${Math.random().toString(36).substr(2, 9)}` : undefined

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'auto'
      }
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, preventClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!preventClose ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div 
          className={cn(
            'relative w-full transform rounded-lg bg-white shadow-xl transition-all',
            'animate-scale-in motion-reduce:animate-none',
            sizes[size]
          )}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              {!preventClose && (
                <button
                  onClick={onClose}
                  className={cn(
                    'rounded-md p-2 text-gray-400 hover:text-gray-600 transition-colors',
                    focusStyles.ring
                  )}
                  aria-label="মোডাল বন্ধ করুন"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
            {description && (
              <p id={descId} className="mt-2 text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
          
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading Spinner with accessibility
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'লোড হচ্ছে...', 
  className 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn('flex items-center gap-3', className)} role="status" aria-live="polite">
      <svg 
        className={cn('animate-spin text-primary-600', sizes[size])} 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
          fill="none"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-sm text-gray-600">{text}</span>
      <span className="sr-only">{text}</span>
    </div>
  )
}
