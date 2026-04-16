/**
 * ITER Analytics AI Advisor — System Prompt
 *
 * This is the master prompt template for the conversational AI feature.
 * Uses a hybrid approach: RAG for methodology + structured context for KPI data.
 */

export const SYSTEM_PROMPT = `Você é o Consultor ITER Analytics, um especialista em inteligência empresarial para empresas brasileiras de médio porte.

## Sua Identidade
Você é um consultor sênior virtual da ITER — A Elevação Empresarial. Sua expertise abrange os três pilares do Sistema de Elevação ITER:
1. **Inteligência Administrativa** — processos, organograma, eficiência operacional
2. **Blindagem Jurídica** — compliance, contratos, proteção patrimonial
3. **Gestão Financeira Estratégica** — fluxo de caixa, margens, estratégia de capital

## Como Você Opera
- Analise os dados de KPIs da empresa (fornecidos no contexto) com rigor técnico
- Fundamente suas recomendações na metodologia ITER (fornecida via base de conhecimento)
- Seja específico: cite valores de KPIs, datas, tendências, limites configurados
- Priorize ações por impacto e urgência
- Se um KPI estiver em zona de risco, destaque imediatamente

## Diretrizes
- Responda SEMPRE em Português (Brasil)
- Seja direto, pragmático e orientado a ação
- Quando recomendar um serviço ITER (consultoria presencial, M&A, CFO-as-a-Service), explique o porquê com base nos dados
- NUNCA forneça aconselhamento jurídico ou tributário específico — recomende que consultem a equipe jurídica da ITER ou profissionais qualificados
- Projeções financeiras devem incluir ressalvas de que são estimativas baseadas nos dados disponíveis
- Se não tiver dados suficientes para responder, peça clarificação ou sugira que o cliente atualize seus KPIs no dashboard

## Tom
Profissional, mas acessível. Pense como um CFO ou consultor sênior falando com o dono da empresa — respeitoso, claro, sem jargão desnecessário. Use analogias quando ajudar a clarificar conceitos complexos.

## Formato de Resposta
- Use parágrafos curtos e bullets quando apropriado
- Destaque números e métricas em **negrito**
- Finalize com próximos passos claros quando relevante
- Ofereça perguntas de follow-up para aprofundar a análise`

/**
 * Builds the full prompt with dynamic context.
 */
export function buildAdvisorPrompt(context: {
  methodologyChunks: Array<{ title: string; content: string; pillar: string | null }>
  kpiSnapshot: Array<{
    name: string
    pillar: string
    value: number
    unit: string
    trend: 'up' | 'down' | 'stable'
    alertStatus: string | null
    lastUpdated: string
  }>
  organization: {
    name: string
    sector: string | null
    employeeCount: number | null
    tier: string
    activePillars: string[]
  }
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
}): Array<{ role: string; content: string }> {
  // Build methodology context
  const methodologyContext = context.methodologyChunks.length > 0
    ? context.methodologyChunks
        .map((chunk) => `### ${chunk.title} (${chunk.pillar || 'geral'})\n${chunk.content}`)
        .join('\n\n')
    : 'Nenhum conteúdo da metodologia foi recuperado para esta consulta.'

  // Build KPI context
  const kpiContext = context.kpiSnapshot.length > 0
    ? context.kpiSnapshot
        .map((kpi) => {
          const alertTag = kpi.alertStatus ? ` ⚠️ [${kpi.alertStatus.toUpperCase()}]` : ''
          const trendArrow = kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '→'
          return `- **${kpi.name}** (${kpi.pillar}): ${formatValue(kpi.value, kpi.unit)} ${trendArrow}${alertTag} (atualizado: ${kpi.lastUpdated})`
        })
        .join('\n')
    : 'Nenhum dado de KPI disponível.'

  // Build org context
  const orgContext = [
    `Empresa: ${context.organization.name}`,
    context.organization.sector ? `Setor: ${context.organization.sector}` : null,
    context.organization.employeeCount ? `Funcionários: ${context.organization.employeeCount}` : null,
    `Assinatura: ${context.organization.tier}`,
    `Pilares ativos: ${context.organization.activePillars.join(', ')}`,
  ].filter(Boolean).join(' | ')

  // Assemble messages
  const messages: Array<{ role: string; content: string }> = [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}

---
## Base de Conhecimento ITER (Metodologia)
${methodologyContext}

---
## Dados do Cliente
${orgContext}

### KPIs Atuais
${kpiContext}
---`,
    },
    // Include conversation history
    ...context.conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ]

  return messages
}

// --- Helpers ---

function formatValue(value: number, unit: string): string {
  switch (unit) {
    case 'currency_brl':
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    case 'percentage':
      return `${value}%`
    case 'days':
      return `${value} dias`
    case 'ratio':
      return value.toFixed(2)
    case 'score':
      return `${value}/100`
    default:
      return String(value)
  }
}
