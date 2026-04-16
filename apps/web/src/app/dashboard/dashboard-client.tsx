'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, ArrowRight, Building2, Scale, Landmark, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

const mockData = {
  companyName: 'Empresa Exemplo',
  scores: { admin: 62, legal: 45, financial: 58, overall: 56 },
  alerts: [
    { id: '1', pillar: 'legal', severity: 'critical', kpi: 'LGPD', message: 'Conformidade abaixo de 70%' },
    { id: '2', pillar: 'financial', severity: 'warning', kpi: 'Concentração', message: 'Top 3 clientes = 52% da receita' },
  ],
  kpis: [
    { name: 'Conformidade POPs', pillar: 'admin', value: 82, unit: '%', trend: 'up' as const },
    { name: 'Score LGPD', pillar: 'legal', value: 45, unit: '%', trend: 'down' as const },
    { name: 'Fluxo de Caixa', pillar: 'financial', value: -28000, unit: 'R$', trend: 'down' as const },
    { name: 'Margem Bruta', pillar: 'financial', value: 34, unit: '%', trend: 'up' as const },
    { name: 'Contratos a Vencer', pillar: 'legal', value: 2, unit: 'contratos', trend: 'stable' as const },
  ],
}

function scoreColor(s: number) { return s >= 70 ? 'text-emerald-500' : s >= 40 ? 'text-amber-500' : 'text-red-500' }
function scoreBg(s: number) { return s >= 70 ? 'bg-emerald-50' : s >= 40 ? 'bg-amber-50' : 'bg-red-50' }

function ScoreRing({ score, label, size = 120 }: { score: number; label: string; size?: number }) {
  const [d, setD] = useState(0)
  const r = (size - 10) / 2, c = 2 * Math.PI * r
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444'
  useEffect(() => {
    let f: number; const s = performance.now()
    const go = (n: number) => { const p = Math.min((n - s) / 1000, 1); setD(Math.round(p * p * (3 - 2 * p) * score)); if (p < 1) f = requestAnimationFrame(go) }
    f = requestAnimationFrame(go); return () => cancelAnimationFrame(f)
  }, [score])
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={8} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (d/100)*c} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className={`text-3xl font-bold ${scoreColor(score)}`}>{d}</span></div>
      </div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  )
}

const icons = { admin: Building2, legal: Scale, financial: Landmark }
const labels: Record<string, string> = { admin: 'Administrativo', legal: 'Jurídico', financial: 'Financeiro' }

export function DashboardClient() {
  const { companyName, scores, alerts, kpis } = mockData
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">{companyName}</h1><p className="text-gray-500 mt-1">Visão geral da saúde empresarial</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">ITER Health Score</h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <ScoreRing score={scores.overall} label="Score Geral" size={140} />
          <div className="hidden md:block w-px h-24 bg-gray-200" />
          <ScoreRing score={scores.admin} label="Administrativo" size={100} />
          <ScoreRing score={scores.legal} label="Jurídico" size={100} />
          <ScoreRing score={scores.financial} label="Financeiro" size={100} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Alertas Ativos</h2>
            <Link href="/alertas" className="text-xs text-iter-accent hover:underline flex items-center gap-1">Ver todos <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className={`p-3 rounded-lg border-l-4 ${a.severity === 'critical' ? 'border-l-red-500 bg-red-50' : 'border-l-amber-500 bg-amber-50'}`}>
                <div className="flex items-center gap-2 mb-1"><AlertTriangle size={14} className={a.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} /><span className="text-xs font-semibold text-gray-500 uppercase">{labels[a.pillar]} · {a.kpi}</span></div>
                <p className="text-sm text-gray-700">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">KPIs em Destaque</h2>
          <div className="space-y-3">
            {kpis.map(k => { const I = icons[k.pillar as keyof typeof icons] || Building2; return (
              <div key={k.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3"><div className={`p-1.5 rounded-md ${scoreBg(k.value >= 0 ? k.value : 30)}`}><I size={14} className="text-gray-500" /></div><div><p className="text-sm font-medium text-gray-800">{k.name}</p><p className="text-xs text-gray-400">{labels[k.pillar]}</p></div></div>
                <div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-900">{k.unit === 'R$' ? new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(k.value) : `${k.value}${k.unit === '%' ? '%' : ` ${k.unit}`}`}</span>{k.trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}{k.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}</div>
              </div>
            )})}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {(['admin','legal','financial'] as const).map(p => { const I = icons[p]; return (
          <Link key={p} href={`/kpis/${p}`} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group">
            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><I size={18} className="text-iter-accent" /><span className="text-sm font-semibold text-gray-700">{labels[p]}</span></div><ArrowRight size={16} className="text-gray-300 group-hover:text-iter-accent transition-colors" /></div>
            <div className="flex items-end gap-2"><span className={`text-2xl font-bold ${scoreColor(scores[p])}`}>{scores[p]}</span><span className="text-xs text-gray-400 mb-1">/100</span></div>
          </Link>
        )})}
      </div>
    </div>
  )
}
