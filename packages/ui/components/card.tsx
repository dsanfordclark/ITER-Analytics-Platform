import { clsx } from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({
  children,
  padding = 'md',
  hover = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200',
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'hover:shadow-md hover:border-gray-300 transition-shadow cursor-pointer': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
