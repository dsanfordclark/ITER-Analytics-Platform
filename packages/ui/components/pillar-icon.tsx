import { Building2, Scale, Landmark } from 'lucide-react'
import { clsx } from 'clsx'

type Pillar = 'admin' | 'legal' | 'financial'

interface PillarIconProps {
  pillar: Pillar
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const pillarConfig: Record<Pillar, {
  icon: typeof Building2
  label: string
  labelPt: string
  color: string
  bg: string
}> = {
  admin: {
    icon: Building2,
    label: 'Administrative',
    labelPt: 'Administrativo',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  legal: {
    icon: Scale,
    label: 'Legal',
    labelPt: 'Jurídico',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  financial: {
    icon: Landmark,
    label: 'Financial',
    labelPt: 'Financeiro',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
}

const iconSizes = { sm: 14, md: 18, lg: 24 }
const paddings = { sm: 'p-1.5', md: 'p-2', lg: 'p-3' }

export function PillarIcon({ pillar, size = 'md', showLabel = false }: PillarIconProps) {
  const config = pillarConfig[pillar]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <div className={clsx('rounded-lg', paddings[size], config.bg, config.color)}>
        <Icon size={iconSizes[size]} />
      </div>
      {showLabel && (
        <span className={clsx('font-medium text-sm', config.color)}>
          {config.labelPt}
        </span>
      )}
    </div>
  )
}
