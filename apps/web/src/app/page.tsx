import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-iter-dark tracking-[0.2em]">ITER</span>
            <span className="text-xs font-medium text-iter-accent">Analytics</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Entrar
            </Link>
            <Link href="/diagnostico" className="px-4 py-2 bg-iter-accent text-white rounded-lg text-sm font-medium hover:bg-iter-dark transition-colors">
              Diagnóstico Gratuito
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iter-light text-iter-accent text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-iter-accent" />
          Plataforma de Inteligência Empresarial
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-iter-dark leading-tight mb-6">
          Sua empresa pode mais.
          <br />
          <span className="text-iter-accent">Descubra como.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Diagnóstico empresarial gratuito nos três pilares fundamentais.
          Em 15 minutos, mapeie os riscos ocultos e oportunidades de crescimento.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/diagnostico" className="px-8 py-4 bg-iter-accent text-white rounded-xl text-lg font-semibold hover:bg-iter-dark transition-colors shadow-lg shadow-blue-500/20">
            Fazer Diagnóstico Gratuito →
          </Link>
          <Link href="/auth/login" className="px-8 py-4 border border-gray-200 text-gray-600 rounded-xl text-lg font-medium hover:bg-gray-50 transition-colors">
            Já tenho conta
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">Sem cartão de crédito · Relatório PDF incluso</p>
      </section>

      {/* Pillars */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-iter-dark text-center mb-4">O Sistema de Elevação</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Três pilares integrados que sustentam toda empresa sólida e duradoura.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🏢', num: '01', title: 'Inteligência Administrativa', desc: 'Processos, organograma, POPs, painéis de controle e gestão de crises. Clareza operacional que liberta o empresário.' },
              { icon: '⚖️', num: '02', title: 'Blindagem Jurídica', desc: 'Contratos, compliance trabalhista, LGPD, propriedade intelectual e planejamento societário. Proteção que dá segurança.' },
              { icon: '💰', num: '03', title: 'Gestão Financeira Estratégica', desc: 'Fluxo de caixa, margens, reservas, investimentos e estratégia de capital. Números que contam a verdade.' },
            ].map((p) => (
              <div key={p.num} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-xs font-bold text-iter-accent/40">{p.num}</span>
                </div>
                <h3 className="text-lg font-bold text-iter-dark mb-3">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-iter-dark text-center mb-12">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Responda o Diagnóstico', desc: 'Questionário interativo de 10-15 minutos adaptado ao perfil da sua empresa.' },
              { step: '02', title: 'Receba seu Relatório', desc: 'Health Score por pilar, riscos identificados e insights acionáveis em PDF.' },
              { step: '03', title: 'Monitore e Evolua', desc: 'Dashboard em tempo real com alertas, tendências e recomendações de IA.' },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-4xl font-bold text-iter-accent/10 mb-2">{item.step}</div>
                <h3 className="font-bold text-iter-dark mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-iter-dark py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Pronto para elevar sua empresa?</h2>
          <p className="text-blue-200 mb-8">Comece com o diagnóstico gratuito. Sem compromisso.</p>
          <Link href="/diagnostico" className="inline-block px-8 py-4 bg-iter-accent text-white rounded-xl text-lg font-semibold hover:bg-blue-500 transition-colors">
            Começar Agora →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-iter-dark tracking-widest text-sm">ITER</span>
            <span className="text-xs text-gray-400 ml-2">Elevar empresas. Libertar potenciais. Criar prosperidade.</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 ITER Analytics. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
