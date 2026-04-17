'use client'

import { useParams } from 'next/navigation'

const pillarNames: Record<string, { name: string; subtitle: string; emoji: string }> = {
  admin: { name: 'Administrativo', subtitle: 'Inteligência Operacional e Performance Estruturada', emoji: '🏢' },
  legal: { name: 'Jurídico', subtitle: 'Blindagem Estratégica e Direcionamento Societário', emoji: '⚖️' },
  financial: { name: 'Financeiro', subtitle: 'Blindagem de Caixa e Estratégia de Capital', emoji: '💰' },
}

export default function KpiPillarPage() {
  const params = useParams()
  const pillar = params.pillar as string
  const config = pillarNames[pillar] || { name: pillar, subtitle: '', emoji: '📊' }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{config.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pilar {config.name}</h1>
            <p className="text-gray-500 text-sm">{config.subtitle}</p>
          </div>
        </div>
      </div>

      {/* TODO: Implement full KPI detail view */}
      {/* - Per-KPI cards with current value, trend chart, alert status */}
      {/* - Data entry form for manual input */}
      {/* - CSV upload button */}
      {/* - Historical trend charts (Recharts) */}
      {/* - Alert threshold configuration */}

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-400">
          Detalhamento completo dos KPIs do pilar {config.name} será implementado aqui.
          Inclui gráficos de tendência, entrada manual de dados, e configuração de alertas.
        </p>
      </div>
    </div>
  )
}
