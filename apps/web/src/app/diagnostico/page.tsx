'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

type Step = 'welcome' | 'profile' | 'admin' | 'legal' | 'financial' | 'results'

const STEPS: { id: Step; label: string }[] = [
  { id: 'welcome', label: 'Início' },
  { id: 'profile', label: 'Perfil' },
  { id: 'admin', label: 'Administrativo' },
  { id: 'legal', label: 'Jurídico' },
  { id: 'financial', label: 'Financeiro' },
  { id: 'results', label: 'Resultados' },
]

export default function DiagnosticoPage() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const stepIndex = STEPS.findIndex((s) => s.id === currentStep)
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100

  function next() {
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id)
    }
  }

  function back() {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-[#1B2A4A]">
              Diagnóstico Empresarial ITER
            </h1>
            <span className="text-sm text-gray-400">
              {stepIndex + 1} de {STEPS.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2E75B6] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step labels */}
          <div className="flex justify-between mt-2">
            {STEPS.map((step, i) => (
              <span
                key={step.id}
                className={`text-[10px] font-medium ${
                  i <= stepIndex ? 'text-[#2E75B6]' : 'text-gray-300'
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 min-h-[400px]">
          {currentStep === 'welcome' && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-[#1B2A4A] mb-3">
                Descubra a saúde da sua empresa
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-2">
                Em apenas 10-15 minutos, nosso diagnóstico vai mapear os pontos
                fortes e os riscos ocultos da sua empresa nos três pilares:
              </p>
              <div className="flex justify-center gap-6 my-6">
                {[
                  { icon: '🏢', label: 'Administrativo' },
                  { icon: '⚖️', label: 'Jurídico' },
                  { icon: '💰', label: 'Financeiro' },
                ].map((p) => (
                  <div key={p.label} className="text-center">
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <span className="text-xs text-gray-500">{p.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Ao final, você receberá um relatório PDF completo com scores,
                riscos identificados e insights acionáveis.
              </p>
            </div>
          )}

          {currentStep === 'profile' && (
            <div>
              <h2 className="text-xl font-bold text-[#1B2A4A] mb-6">
                Sobre sua empresa
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qual é o setor da sua empresa?
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm">
                    <option>Selecione...</option>
                    <option>Tecnologia</option>
                    <option>Indústria</option>
                    <option>Serviços</option>
                    <option>Comércio</option>
                    <option>Agronegócio</option>
                    <option>Construção</option>
                    <option>Saúde</option>
                    <option>Logística</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantos funcionários a empresa possui?
                  </label>
                  <input type="number" placeholder="Ex: 150" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faixa de faturamento anual
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm">
                    <option>Selecione...</option>
                    <option>Até R$ 1 milhão</option>
                    <option>R$ 1-5 milhões</option>
                    <option>R$ 5-20 milhões</option>
                    <option>R$ 20-100 milhões</option>
                    <option>Acima de R$ 100 milhões</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Há quantos anos a empresa opera?
                  </label>
                  <input type="number" placeholder="Ex: 12" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sua empresa exporta ou tem operações internacionais?
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="exports" /> <span className="text-sm">Sim</span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="exports" /> <span className="text-sm">Não</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'admin' && (
            <div>
              <h2 className="text-xl font-bold text-[#1B2A4A] mb-1">
                Pilar Administrativo
              </h2>
              <p className="text-sm text-gray-400 mb-6">Inteligência Operacional e Performance</p>
              <div className="space-y-6">
                <LikertQuestion
                  question="Sua empresa possui um organograma formal e documentado?"
                  id="a1"
                />
                <LikertQuestion
                  question="Quão claramente os papéis e responsabilidades estão definidos?"
                  id="a2"
                />
                <LikertQuestion
                  question="Existem Procedimentos Operacionais Padrão (POPs) para os processos-chave?"
                  id="a3"
                />
                <LikertQuestion
                  question="Qual sua visibilidade sobre gargalos operacionais?"
                  id="a4"
                />
              </div>
            </div>
          )}

          {currentStep === 'legal' && (
            <div>
              <h2 className="text-xl font-bold text-[#1B2A4A] mb-1">
                Pilar Jurídico
              </h2>
              <p className="text-sm text-gray-400 mb-6">Blindagem Estratégica e Direcionamento</p>
              <div className="space-y-6">
                <LikertQuestion
                  question="Quando foi a última auditoria dos seus contratos por um advogado?"
                  id="l1"
                  type="choice"
                  options={['Menos de 6 meses', '6-12 meses', '1-2 anos', 'Mais de 2 anos', 'Nunca']}
                />
                <LikertQuestion question="Sua empresa está em conformidade com leis trabalhistas e EPIs?" id="l2" />
                <LikertQuestion question="Existe um plano de sucessão ou acordo societário documentado?" id="l3" type="yesno" />
                <LikertQuestion question="Sua empresa avaliou a conformidade com a LGPD?" id="l4" type="yesno" />
              </div>
            </div>
          )}

          {currentStep === 'financial' && (
            <div>
              <h2 className="text-xl font-bold text-[#1B2A4A] mb-1">
                Pilar Financeiro
              </h2>
              <p className="text-sm text-gray-400 mb-6">Blindagem de Caixa e Estratégia de Capital</p>
              <div className="space-y-6">
                <LikertQuestion
                  question="Como você acompanha o fluxo de caixa atualmente?"
                  id="f1"
                  type="choice"
                  options={['Planilha manual', 'Software básico', 'ERP integrado', 'Não acompanho regularmente']}
                />
                <LikertQuestion question="Sua empresa possui uma reserva financeira para emergências?" id="f2" type="yesno" />
                <LikertQuestion question="Quão confiante você está na precisão dos seus relatórios financeiros?" id="f3" />
                <LikertQuestion question="Existem políticas definidas para gestão de custos e investimento?" id="f4" type="yesno" />
              </div>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-4">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[#1B2A4A] mb-3">
                Diagnóstico Concluído!
              </h2>
              <p className="text-gray-500 mb-6">
                Seu relatório está sendo gerado. Você receberá o PDF por email
                e poderá visualizar os resultados no dashboard.
              </p>
              {/* Placeholder scores */}
              <div className="flex justify-center gap-8 my-8">
                {[
                  { label: 'Admin', score: 62, color: 'text-amber-500' },
                  { label: 'Jurídico', score: 45, color: 'text-red-500' },
                  { label: 'Financeiro', score: 58, color: 'text-amber-500' },
                ].map((p) => (
                  <div key={p.label} className="text-center">
                    <div className={`text-3xl font-bold ${p.color}`}>{p.score}</div>
                    <div className="text-xs text-gray-400 mt-1">{p.label}</div>
                  </div>
                ))}
              </div>
              <button className="px-6 py-3 bg-[#2E75B6] text-white rounded-lg font-medium hover:bg-[#1B2A4A] transition-colors">
                Ver Dashboard Completo →
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep !== 'results' && (
          <div className="flex justify-between mt-6">
            <button
              onClick={back}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Voltar
            </button>
            <button
              onClick={next}
              className="flex items-center gap-1 px-6 py-2.5 bg-[#2E75B6] text-white rounded-lg text-sm font-medium hover:bg-[#1B2A4A] transition-colors"
            >
              {currentStep === 'financial' ? 'Finalizar' : 'Próximo'} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Question Components ---

function LikertQuestion({
  question,
  id,
  type = 'likert',
  options,
}: {
  question: string
  id: string
  type?: 'likert' | 'yesno' | 'choice'
  options?: string[]
}) {
  const [value, setValue] = useState<string | null>(null)

  if (type === 'yesno') {
    return (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{question}</p>
        <div className="flex gap-2">
          {['Sim', 'Não'].map((opt) => (
            <button
              key={opt}
              onClick={() => setValue(opt)}
              className={`px-5 py-2 rounded-lg text-sm border transition-colors ${
                value === opt
                  ? 'bg-[#2E75B6] text-white border-[#2E75B6]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'choice' && options) {
    return (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{question}</p>
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setValue(opt)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-colors ${
                value === opt
                  ? 'bg-[#E8F0FE] border-[#2E75B6] text-[#1B2A4A]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Default: Likert 1-5
  const likertLabels = ['Muito baixo', 'Baixo', 'Moderado', 'Bom', 'Excelente']
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">{question}</p>
      <div className="flex gap-2">
        {likertLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setValue(String(i + 1))}
            className={`flex-1 py-2.5 rounded-lg text-xs border transition-colors ${
              value === String(i + 1)
                ? 'bg-[#2E75B6] text-white border-[#2E75B6]'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div className="font-bold text-base mb-0.5">{i + 1}</div>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
