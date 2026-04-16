import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  children: ReactNode
}

export function Badge({ variant = 'default', size = 'sm', children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full',
        {
          'bg-gray-100 text-gray-600': variant === 'default',
          'bg-emerald-50 text-emerald-700': variant === 'success',
          'bg-amber-50 text-amber-700': variant === 'warning',
          'bg-red-50 text-red-700': variant === 'danger',
          'bg-blue-50 text-blue-700': variant === 'info',
          'text-xs px-2 py-0.5': size === 'sm',
          'text-sm px-3 py-1': size === 'md',
        }
      )}
    >
      {children}
    </span>
  )
}
