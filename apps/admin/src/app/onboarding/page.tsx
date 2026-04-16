import { AdminLayout } from '@/components/layout/admin-layout'

export const metadata = {
  title: 'Novo Cliente | ITER Admin',
}

export default function OnboardingPage() {
  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Onboarding de Novo Cliente
        </h1>
        <p className="text-gray-500 mb-8">
          Cadastre uma nova empresa e configure seus KPIs iniciais.
        </p>

        {/* TODO: Implement onboarding form */}
        {/* Steps: */}
        {/* 1. Company info (name, CNPJ, sector, employee count) */}
        {/* 2. Select subscription tier + active pillars */}
        {/* 3. Configure KPIs (select from templates or create custom) */}
        {/* 4. Import baseline data (CSV or manual) */}
        {/* 5. Create owner user account + send welcome email */}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razão Social
            </label>
            <input
              type="text"
              placeholder="Nome da empresa"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-iter-accent/20 focus:border-iter-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              type="text"
              placeholder="00.000.000/0001-00"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-iter-accent/20 focus:border-iter-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Setor
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-iter-accent/20">
                <option value="">Selecione...</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="industria">Indústria</option>
                <option value="servicos">Serviços</option>
                <option value="comercio">Comércio</option>
                <option value="agro">Agronegócio</option>
                <option value="construcao">Construção</option>
                <option value="saude">Saúde</option>
                <option value="educacao">Educação</option>
                <option value="logistica">Logística</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nº de Funcionários
              </label>
              <input
                type="number"
                placeholder="150"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-iter-accent/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilares Ativos
            </label>
            <div className="flex gap-3">
              {['Administrativo', 'Jurídico', 'Financeiro'].map((pillar) => (
                <label key={pillar} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="rounded text-iter-accent" />
                  <span className="text-sm">{pillar}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full py-3 bg-iter-accent text-white rounded-lg font-medium hover:bg-iter-dark transition-colors">
            Criar Cliente
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
