'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

interface ScoreRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  animated?: boolean
}

function getScoreColor(score: number) {
  if (score >= 70) return { stroke: '#10B981', text: 'text-emerald-600', bg: 'bg-emerald-50' }
  if (score >= 40) return { stroke: '#F59E0B', text: 'text-amber-500', bg: 'bg-amber-50' }
  return { stroke: '#EF4444', text: 'text-red-500', bg: 'bg-red-50' }
}

const sizes = {
  sm: { svg: 80, strokeWidth: 6, fontSize: 'text-lg', labelSize: 'text-[10px]' },
  md: { svg: 120, strokeWidth: 8, fontSize: 'text-3xl', labelSize: 'text-xs' },
  lg: { svg: 160, strokeWidth: 10, fontSize: 'text-4xl', labelSize: 'text-sm' },
}

export function ScoreRing({ score, size = 'md', label, animated = true }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const config = sizes[size]
  const radius = (config.svg - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const colors = getScoreColor(score)

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score)
      return
    }
    let frame: number
    const start = performance.now()
    const duration = 1200

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score, animated])

  const offset = circumference - (displayScore / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: config.svg, height: config.svg }}>
        <svg
          width={config.svg}
          height={config.svg}
          viewBox={`0 0 ${config.svg} ${config.svg}`}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={config.svg / 2}
            cy={config.svg / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={config.strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={config.svg / 2}
            cy={config.svg / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: animated ? 'none' : 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={clsx('font-bold', config.fontSize, colors.text)}>
            {displayScore}
          </span>
        </div>
      </div>
      {label && (
        <span className={clsx('text-gray-500 font-medium', config.labelSize)}>
          {label}
        </span>
      )}
    </div>
  )
}
