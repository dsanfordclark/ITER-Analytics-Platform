'use client'

import { FileText, Download, Calendar, Clock } from 'lucide-react'

const MOCK_REPORTS = [
  { id: '1', type: 'diagnostic', title: 'Diagnóstico Inicial', date: '2026-04-10', score: 56 },
  { id: '2', type: 'weekly', title: 'Resumo Semanal — 07/04 a 13/04', date: '2026-04-14', score: null },
  { id: '3', type: 'diagnostic', title: 'Reavaliação Q1', date: '2026-03-28', score: 48 },
]

export default function RelatoriosPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-500 mt-1">Histórico de diagnósticos e resumos periódicos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2E75B6] text-white rounded-lg text-sm font-medium hover:bg-[#1B2A4A] transition-colors">
          <FileText size={16} />
          Gerar Novo Relatório
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_REPORTS.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-50 text-[#2E75B6] rounded-lg">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} /> {report.date}
                  </span>
                  {report.score !== null && (
                    <span className={`text-xs font-bold ${
                      report.score >= 70 ? 'text-emerald-500' :
                      report.score >= 40 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      Score: {report.score}/100
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {report.type === 'diagnostic' ? 'Diagnóstico' : 'Resumo'}
                  </span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#2E75B6] hover:text-[#1B2A4A] transition-colors">
              <Download size={16} />
              PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
