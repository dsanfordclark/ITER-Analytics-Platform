/**
 * Supabase Edge Function: ai-chat
 *
 * Handles the conversational AI advisor requests.
 * Pipeline: user message → RAG retrieval → KPI context → Claude API → response
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { session_id, message, organization_id } = await req.json()

    // Initialize Supabase client with user's auth
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    // Service role client for RAG queries
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Get or create chat session
    let session
    if (session_id) {
      const { data } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('id', session_id)
        .single()
      session = data
    }

    // 2. Get organization context
    const { data: org } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organization_id)
      .single()

    if (!org) {
      return new Response(
        JSON.stringify({ error: 'Organization not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Generate embedding for RAG retrieval
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: message,
      }),
    })
    const embeddingData = await embeddingResponse.json()
    const queryEmbedding = embeddingData.data[0].embedding

    // 4. Retrieve methodology chunks
    const { data: methodologyChunks } = await serviceClient.rpc('match_methodology', {
      query_embedding: queryEmbedding,
      match_threshold: 0.75,
      match_count: 5,
    })

    // 5. Get current KPI snapshot
    const { data: kpiDefs } = await supabase
      .from('kpi_definitions')
      .select('id, name, pillar, unit')
      .or(`organization_id.eq.${organization_id},organization_id.is.null`)
      .eq('is_active', true)

    const kpiSnapshots = []
    for (const kpi of (kpiDefs ?? []).slice(0, 10)) {
      const { data: points } = await supabase
        .from('kpi_data_points')
        .select('value, period_start')
        .eq('kpi_definition_id', kpi.id)
        .eq('organization_id', organization_id)
        .order('period_start', { ascending: false })
        .limit(3)

      if (points && points.length > 0) {
        kpiSnapshots.push({
          name: kpi.name,
          pillar: kpi.pillar,
          current: points[0].value,
          unit: kpi.unit,
          history: points,
        })
      }
    }

    // 6. Build system prompt
    const methodologyContext = (methodologyChunks ?? [])
      .map((c: any) => `### ${c.title}\n${c.content}`)
      .join('\n\n')

    const kpiContext = kpiSnapshots
      .map(k => `- ${k.name} (${k.pillar}): ${k.current} ${k.unit}`)
      .join('\n')

    const systemPrompt = `Você é o Assessor ITER Analytics, especialista em inteligência empresarial para empresas brasileiras de médio porte.

## Contexto da Metodologia ITER:
${methodologyContext || 'Nenhum contexto específico recuperado.'}

## Empresa: ${org.name}
- Setor: ${org.sector ?? 'Não informado'}
- Funcionários: ${org.employee_count ?? 'Não informado'}
- Plano: ${org.subscription_tier}

## KPIs Atuais:
${kpiContext || 'Nenhum dado de KPI disponível ainda.'}

## Diretrizes:
- Responda em português brasileiro
- Seja específico e acionável
- Referencie valores reais dos KPIs
- Nunca forneça aconselhamento jurídico ou tributário específico
- Projeções financeiras incluem disclaimer`

    // 7. Build conversation history
    const history = session?.messages ?? []
    const messages = [
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    // 8. Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages,
      }),
    })

    const claudeData = await claudeResponse.json()
    const assistantMessage = claudeData.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')

    const tokensUsed = (claudeData.usage?.input_tokens ?? 0) + (claudeData.usage?.output_tokens ?? 0)

    // 9. Save to chat session
    const updatedMessages = [
      ...history,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() },
    ]

    if (session) {
      await supabase
        .from('ai_chat_sessions')
        .update({
          messages: updatedMessages,
          tokens_used: (session.tokens_used ?? 0) + tokensUsed,
        })
        .eq('id', session.id)
    } else {
      const { data: newSession } = await supabase
        .from('ai_chat_sessions')
        .insert({
          organization_id,
          user_id: (await supabase.auth.getUser()).data.user!.id,
          messages: updatedMessages,
          tokens_used: tokensUsed,
        })
        .select('id')
        .single()
      session = newSession
    }

    return new Response(
      JSON.stringify({
        session_id: session?.id,
        message: assistantMessage,
        tokens_used: tokensUsed,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('AI Chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
