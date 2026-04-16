/**
 * Supabase Edge Function: process-alerts
 *
 * Evaluates KPI data points against thresholds and creates alerts.
 * Triggered via cron (daily) or on new data point insertion.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { organization_id, kpi_data_point_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get KPI definitions with thresholds
    let kpiQuery = supabase
      .from('kpi_definitions')
      .select('*')
      .eq('is_active', true)
      .not('alert_threshold_value', 'is', null)

    if (organization_id) {
      kpiQuery = kpiQuery.or(
        `organization_id.eq.${organization_id},organization_id.is.null`
      )
    }

    const { data: kpiDefs } = await kpiQuery
    if (!kpiDefs || kpiDefs.length === 0) {
      return new Response(JSON.stringify({ alerts_created: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let alertsCreated = 0

    // Get organizations to check
    const orgIds = organization_id
      ? [organization_id]
      : await getActiveOrgIds(supabase)

    for (const orgId of orgIds) {
      for (const kpi of kpiDefs) {
        // Get latest data point
        const { data: latest } = await supabase
          .from('kpi_data_points')
          .select('*')
          .eq('kpi_definition_id', kpi.id)
          .eq('organization_id', orgId)
          .order('period_start', { ascending: false })
          .limit(2)

        if (!latest || latest.length === 0) continue

        const currentValue = latest[0].value
        const previousValue = latest.length > 1 ? latest[1].value : null
        const threshold = kpi.alert_threshold_value!

        let shouldAlert = false
        let severity: 'critical' | 'warning' | 'info' = 'warning'
        let message = ''

        switch (kpi.alert_threshold_type) {
          case 'above':
            shouldAlert = currentValue > threshold
            message = `${kpi.name} está em ${currentValue} (acima do limite de ${threshold})`
            severity = currentValue > threshold * 1.5 ? 'critical' : 'warning'
            break

          case 'below':
            shouldAlert = currentValue < threshold
            message = `${kpi.name} está em ${currentValue} (abaixo do limite de ${threshold})`
            severity = currentValue < threshold * 0.5 ? 'critical' : 'warning'
            break

          case 'change_pct':
            if (previousValue && previousValue !== 0) {
              const changePct = Math.abs(
                ((currentValue - previousValue) / previousValue) * 100
              )
              shouldAlert = changePct > threshold
              message = `${kpi.name} variou ${changePct.toFixed(1)}% (limite: ${threshold}%)`
              severity = changePct > threshold * 2 ? 'critical' : 'warning'
            }
            break
        }

        if (shouldAlert) {
          // Check if there's already an active alert for this KPI
          const { count } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('kpi_definition_id', kpi.id)
            .eq('organization_id', orgId)
            .eq('status', 'active')

          if ((count ?? 0) === 0) {
            await supabase.from('alerts').insert({
              organization_id: orgId,
              kpi_definition_id: kpi.id,
              kpi_data_point_id: latest[0].id,
              severity,
              message,
              status: 'active',
            })
            alertsCreated++
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ alerts_created: alertsCreated }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Process alerts error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getActiveOrgIds(supabase: any): Promise<string[]> {
  const { data } = await supabase
    .from('organizations')
    .select('id')
    .neq('subscription_tier', 'free')

  return (data ?? []).map((o: any) => o.id)
}
