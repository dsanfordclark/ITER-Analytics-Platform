import { AdminLayout } from '@/components/layout/admin-layout'

interface PageProps {
  params: { orgId: string }
}

export default function ClientDetailPage({ params }: PageProps) {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Detalhes do Cliente
        </h1>
        <p className="text-gray-500 mb-8">
          ID: {params.orgId}
        </p>

        {/* TODO: Implement full client detail view */}
        {/* - Health scores per pillar with trend charts */}
        {/* - KPI breakdown table */}
        {/* - Active alerts list */}
        {/* - Internal notes section */}
        {/* - Upsell opportunity flags */}
        {/* - Diagnostic history */}
        {/* - AI chat session viewer */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-400 text-sm">
            Visão detalhada do cliente será implementada aqui.
            Mesmo dashboard que o cliente vê, com notas internas e
            flags de upsell adicionais para a equipe ITER.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
