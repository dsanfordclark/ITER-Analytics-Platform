'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  AlertTriangle,
  TrendingUp,
  Users,
  Search,
  Filter,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

// Types
interface ClientOverview {
  id: string
  name: string
  sector: string | null
  tier: string
  healthScore: number
  adminScore: number
  legalScore: number
  financialScore: number
  activeAlerts: number
  lastActivity: string
}

// Mock data for scaffolding
const MOCK_CLIENTS: ClientOverview[] = [
  {
    id: '1', name: 'TechBrasil Ltda', sector: 'Tecnologia', tier: 'full',
    healthScore: 72, adminScore: 78, legalScore: 58, financialScore: 76,
    activeAlerts: 2, lastActivity: '2026-04-14',
  },
  {
    id: '2', name: 'Construtora Vale Verde', sector: 'Construção', tier: 'two_pillar',
    healthScore: 45, adminScore: 52, legalScore: 34, financialScore: 48,
    activeAlerts: 5, lastActivity: '2026-04-13',
  },
  {
    id: '3', name: 'Agro Horizonte S.A.', sector: 'Agronegócio', tier: 'single_pillar',
    healthScore: 61, adminScore: 65, legalScore: 55, financialScore: 62,
    activeAlerts: 1, lastActivity: '2026-04-15',
  },
  {
    id: '4', name: 'Distribuidora Norte', sector: 'Logística', tier: 'enterprise',
    healthScore: 83, adminScore: 88, legalScore: 75, financialScore: 84,
    activeAlerts: 0, lastActivity: '2026-04-15',
  },
]

function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-600'
  if (score >= 40) return 'text-amber-500'
  return 'text-red-500'
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-emerald-50'
  if (score >= 40) return 'bg-amber-50'
  return 'bg-red-50'
}

function tierLabel(tier: string): string {
  const labels: Record<string, string> = {
    free: 'Gratuito',
    single_pillar: '1 Pilar',
    two_pillar: '2 Pilares',
    full: 'Completo',
    enterprise: 'Enterprise',
  }
  return labels[tier] || tier
}

export function AdminDashboardClient() {
  const [search, setSearch] = useState('')
  const [clients] = useState<ClientOverview[]>(MOCK_CLIENTS)

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalAlerts = clients.reduce((sum, c) => sum + c.activeAlerts, 0)
  const avgScore = Math.round(clients.reduce((sum, c) => sum + c.healthScore, 0) / clients.length)
  const atRisk = clients.filter((c) => c.healthScore < 50).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard ITER</h1>
        <p className="text-gray-500 mt-1">Visão unificada de todos os clientes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={<Building2 size={20} />}
          label="Clientes Ativos"
          value={String(clients.length)}
          color="text-iter-accent"
          bg="bg-blue-50"
        />
        <SummaryCard
          icon={<TrendingUp size={20} />}
          label="Score Médio"
          value={`${avgScore}/100`}
          color={scoreColor(avgScore)}
          bg={scoreBg(avgScore)}
        />
        <SummaryCard
          icon={<AlertTriangle size={20} />}
          label="Alertas Ativos"
          value={String(totalAlerts)}
          color={totalAlerts > 0 ? 'text-red-500' : 'text-emerald-600'}
          bg={totalAlerts > 0 ? 'bg-red-50' : 'bg-emerald-50'}
        />
        <SummaryCard
          icon={<Users size={20} />}
          label="Em Risco (< 50)"
          value={String(atRisk)}
          color={atRisk > 0 ? 'text-amber-500' : 'text-emerald-600'}
          bg={atRisk > 0 ? 'bg-amber-50' : 'bg-emerald-50'}
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-iter-accent/20 focus:border-iter-accent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
          <Filter size={16} />
          Filtrar
        </button>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Jurídico</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Financeiro</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Alertas</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                    <p className="text-xs text-gray-400">{client.sector || '—'}</p>
                  </div>
                </td>
                <td className="text-center px-4 py-4">
                  <span className={`text-lg font-bold ${scoreColor(client.healthScore)}`}>
                    {client.healthScore}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  <span className={`text-sm font-medium ${scoreColor(client.adminScore)}`}>
                    {client.adminScore}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  <span className={`text-sm font-medium ${scoreColor(client.legalScore)}`}>
                    {client.legalScore}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  <span className={`text-sm font-medium ${scoreColor(client.financialScore)}`}>
                    {client.financialScore}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  {client.activeAlerts > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                      <AlertTriangle size={12} />
                      {client.activeAlerts}
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-500">✓</span>
                  )}
                </td>
                <td className="text-center px-4 py-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {tierLabel(client.tier)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/clientes/${client.id}`}
                    className="text-iter-accent hover:text-iter-dark transition-colors"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bg: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${bg} ${color}`}>{icon}</div>
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
