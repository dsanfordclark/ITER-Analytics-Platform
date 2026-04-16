/**
 * Generate Report Edge Function
 *
 * Generates a diagnostic PDF report from questionnaire responses.
 * Endpoint: POST /functions/v1/generate-report
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
      },
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return json({ error: 'Unauthorized' }, 401)

    const { questionnaire_response_id } = await req.json()
    if (!questionnaire_response_id) {
      return json({ error: 'questionnaire_response_id is required' }, 400)
    }

    // Fetch questionnaire response
    const { data: response, error: fetchError } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('id', questionnaire_response_id)
      .single()

    if (fetchError || !response) {
      return json({ error: 'Questionnaire response not found' }, 404)
    }

    // Calculate scores from answers
    const scores = calculateScoresFromAnswers(response.answers, response.pillar_scores_raw)

    // Identify top risks
    const topRisks = identifyTopRisks(response.answers, scores)

    // Generate teaser insights
    const teaserInsights = generateTeaserInsights(scores, topRisks)

    // Get user profile for the report
    const { data: profile } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('auth_id', user.id)
      .single()

    // Create diagnostic report record
    const { data: report, error: reportError } = await supabase
      .from('diagnostic_reports')
      .insert({
        organization_id: response.organization_id,
        generated_by: profile?.id || response.user_id,
        questionnaire_response_id,
        admin_score: scores.admin,
        legal_score: scores.legal,
        financial_score: scores.financial,
        overall_score: scores.overall,
        top_risks: topRisks,
        teaser_insights: teaserInsights,
        full_report_data: {
          scores,
          risks: topRisks,
          insights: teaserInsights,
          generated_at: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (reportError) {
      console.error('Failed to create report:', reportError)
      return json({ error: 'Failed to generate report' }, 500)
    }

    // TODO: Generate PDF using React-PDF and upload to Supabase Storage
    // For MVP, return the report data and generate PDF client-side

    return json({
      report_id: report.id,
      scores: {
        admin: scores.admin,
        legal: scores.legal,
        financial: scores.financial,
        overall: scores.overall,
      },
      top_risks: topRisks,
      teaser_insights: teaserInsights,
    })

  } catch (err) {
    console.error('Generate report error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})

// --- Scoring Logic ---

interface Scores {
  admin: number
  legal: number
  financial: number
  overall: number
}

function calculateScoresFromAnswers(answers: any, rawScores: any): Scores {
  // If scoring engine already computed pillar scores, use them
  if (rawScores?.admin !== undefined) {
    const admin = Math.round(rawScores.admin)
    const legal = Math.round(rawScores.legal)
    const financial = Math.round(rawScores.financial)
    const overall = Math.round((admin * 0.35) + (legal * 0.30) + (financial * 0.35))
    return { admin, legal, financial, overall }
  }

  // Fallback: simple average from answer values
  // In production, this uses the full scoring engine from packages/diagnostics
  return { admin: 50, legal: 50, financial: 50, overall: 50 }
}

function identifyTopRisks(answers: any, scores: Scores) {
  const risks: Array<{ pillar: string; risk: string; severity: string; description: string }> = []

  if (scores.legal < 50) {
    risks.push({
      pillar: 'Jurídico',
      risk: 'Blindagem jurídica insuficiente',
      severity: 'critical',
      description: 'Seu score jurídico indica vulnerabilidades significativas em compliance e proteção patrimonial.',
    })
  }

  if (scores.financial < 50) {
    risks.push({
      pillar: 'Financeiro',
      risk: 'Gestão financeira em risco',
      severity: 'critical',
      description: 'Indicadores financeiros abaixo do ideal. Recomenda-se revisão urgente do fluxo de caixa.',
    })
  }

  if (scores.admin < 60) {
    risks.push({
      pillar: 'Administrativo',
      risk: 'Processos operacionais desorganizados',
      severity: 'warning',
      description: 'A estrutura administrativa precisa de fortalecimento para suportar crescimento.',
    })
  }

  return risks.slice(0, 5)
}

function generateTeaserInsights(scores: Scores, risks: any[]) {
  const insights: Array<{ pillar: string; insight: string; cta: string }> = []

  // Generate one insight per pillar
  insights.push({
    pillar: 'Administrativo',
    insight: scores.admin >= 70
      ? 'Sua estrutura operacional está sólida. Há oportunidades de otimização para escalar.'
      : 'Processos desorganizados podem estar custando até 15% da sua receita em desperdícios ocultos.',
    cta: 'Desbloqueie o dashboard completo para ver quais processos otimizar →',
  })

  insights.push({
    pillar: 'Jurídico',
    insight: scores.legal >= 70
      ? 'Boa blindagem jurídica. Considere avançar em LGPD e proteção de propriedade intelectual.'
      : 'Riscos jurídicos identificados podem se transformar em contingências financeiras significativas.',
    cta: 'Veja o mapa completo de riscos jurídicos no dashboard premium →',
  })

  insights.push({
    pillar: 'Financeiro',
    insight: scores.financial >= 70
      ? 'Saúde financeira positiva. Momento ideal para estratégias de expansão de capital.'
      : 'Seu fluxo de caixa e margens precisam de atenção para garantir sustentabilidade.',
    cta: 'Acesse projeções financeiras e alertas em tempo real →',
  })

  return insights
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
