import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          // Variants
          'bg-[#2E75B6] text-white hover:bg-[#1B2A4A] focus:ring-[#2E75B6]': variant === 'primary',
          'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300': variant === 'secondary',
          'border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200': variant === 'outline',
          'text-gray-600 hover:bg-gray-100 focus:ring-gray-200': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
          // Sizes
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2.5': size === 'md',
          'text-base px-6 py-3': size === 'lg',
          // States
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
