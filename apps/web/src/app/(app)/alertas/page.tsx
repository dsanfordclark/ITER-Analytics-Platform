'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react'

type AlertItem = {
  id: string
  kpiName: string
  pillar: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  status: 'active' | 'acknowledged' | 'resolved'
  createdAt: string
}

const MOCK_ALERTS: AlertItem[] = [
  { id: '1', kpiName: 'Saúde do Fluxo de Caixa', pillar: 'Financeiro', severity: 'critical', message: 'Fluxo de caixa negativo por 2 meses consecutivos', status: 'active', createdAt: '2026-04-14' },
  { id: '2', kpiName: 'Score LGPD', pillar: 'Jurídico', severity: 'critical', message: 'Conformidade LGPD abaixo de 70% — risco de multas significativas', status: 'active', createdAt: '2026-04-13' },
  { id: '3', kpiName: 'Contratos a Vencer', pillar: 'Jurídico', severity: 'warning', message: '2 contratos vencem em menos de 30 dias', status: 'acknowledged', createdAt: '2026-04-12' },
  { id: '4', kpiName: 'Concentração de Receita', pillar: 'Financeiro', severity: 'warning', message: 'Top 3 clientes representam 52% da receita', status: 'active', createdAt: '2026-04-10' },
  { id: '5', kpiName: 'Taxa de Conformidade com POPs', pillar: 'Administrativo', severity: 'info', message: 'Conformidade com POPs subiu para 82% — acima do limite', status: 'resolved', createdAt: '2026-04-08' },
]

const severityConfig = {
  critical: { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500', icon: '🔴' },
  warning: { label: 'Atenção', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500', icon: '🟡' },
  info: { label: 'Info', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500', icon: '🔵' },
}

const statusConfig = {
  active: { label: 'Ativo', icon: AlertTriangle, color: 'text-red-500' },
  acknowledged: { label: 'Reconhecido', icon: Clock, color: 'text-amber-500' },
  resolved: { label: 'Resolvido', icon: CheckCircle, color: 'text-emerald-500' },
}

export default function AlertasPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')

  const filtered = MOCK_ALERTS.filter((a) => {
    if (filter === 'active') return a.status !== 'resolved'
    if (filter === 'resolved') return a.status === 'resolved'
    return true
  })

  const activeCount = MOCK_ALERTS.filter((a) => a.status === 'active').length

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
          <p className="text-gray-500 mt-1">{activeCount} alertas ativos</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#1B2A4A] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Resolvidos'}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const sev = severityConfig[alert.severity]
          const stat = statusConfig[alert.status]
          const StatusIcon = stat.icon

          return (
            <div
              key={alert.id}
              className={`border-l-4 ${sev.border} ${sev.bg} rounded-r-lg p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {alert.pillar}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className={`text-xs font-semibold ${sev.color}`}>
                      {sev.icon} {sev.label}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{alert.kpiName}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{alert.createdAt}</p>
                </div>
                <div className={`flex items-center gap-1 ${stat.color}`}>
                  <StatusIcon size={14} />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle size={40} className="mx-auto mb-3 text-emerald-300" />
          <p>Nenhum alerta encontrado.</p>
        </div>
      )}
    </div>
  )
}
