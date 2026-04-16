import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface AlertBannerProps {
  severity: 'critical' | 'warning' | 'info'
  title?: string
  children: ReactNode
  onDismiss?: () => void
}

const config = {
  critical: {
    icon: AlertCircle,
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    titleColor: 'text-amber-800',
    textColor: 'text-amber-700',
  },
  info: {
    icon: Info,
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
  },
}

export function AlertBanner({ severity, title, children, onDismiss }: AlertBannerProps) {
  const c = config[severity]
  const Icon = c.icon

  return (
    <div className={clsx('border-l-4 rounded-r-lg p-4', c.border, c.bg)}>
      <div className="flex items-start gap-3">
        <Icon size={18} className={clsx('mt-0.5 shrink-0', c.titleColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={clsx('font-semibold text-sm mb-1', c.titleColor)}>{title}</p>
          )}
          <div className={clsx('text-sm', c.textColor)}>{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={clsx('shrink-0 p-1 rounded hover:bg-black/5', c.textColor)}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
