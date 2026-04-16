import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AiChat } from '@/components/ai-chat/ai-chat'

export default function AiAdvisorPage() {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-iter-dark">
          Consultor IA
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Análise inteligente dos seus KPIs com base na metodologia ITER
        </p>
      </div>
      <AiChat />
    </DashboardLayout>
  )
}
