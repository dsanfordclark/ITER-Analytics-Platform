/**
 * KPI Context Builder
 *
 * Queries the database for an organization's current KPI state
 * and formats it for the AI advisor prompt.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, PillarType } from '@iter/db/types/database'
import type { KPISnapshot, OrgContext } from './prompts/advisor'

export async function buildKPIContext(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  pillarFilter?: PillarType
): Promise<KPISnapshot[]> {
  // Get active KPI definitions for this org
  let query = supabase
    .from('kpi_definitions')
    .select('*')
    .or(`organization_id.eq.${organizationId},organization_id.is.null`)
    .eq('is_active', true)
    .order('display_order')

  if (pillarFilter) {
    query = query.eq('pillar', pillarFilter)
  }

  const { data: kpiDefs, error: defError } = await query
  if (defError || !kpiDefs) return []

  const snapshots: KPISnapshot[] = []

  for (const kpi of kpiDefs) {
    // Get last 3 months of data
    const { data: dataPoints } = await supabase
      .from('kpi_data_points')
      .select('*')
      .eq('kpi_definition_id', kpi.id)
      .eq('organization_id', organizationId)
      .order('period_start', { ascending: false })
      .limit(3)

    if (!dataPoints || dataPoints.length === 0) continue

    const current = dataPoints[0]
    const previous = dataPoints.length > 1 ? dataPoints[1] : null

    // Calculate trend
    let trend: 'up' | 'down' | 'stable' = 'stable'
    let trendPct = 0
    if (previous && previous.value !== 0) {
      trendPct = Math.round(((current.value - previous.value) / Math.abs(previous.value)) * 100)
      trend = trendPct > 2 ? 'up' : trendPct < -2 ? 'down' : 'stable'
    }

    // Check if alert is active
    const { count: alertCount } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('kpi_definition_id', kpi.id)
      .eq('organization_id', organizationId)
      .eq('status', 'active')

    snapshots.push({
      name: kpi.name,
      pillar: kpi.pillar as PillarType,
      current_value: current.value,
      unit: kpi.unit,
      trend,
      trend_pct: trendPct,
      alert_active: (alertCount ?? 0) > 0,
      last_3_months: dataPoints.map(dp => ({
        period: dp.period_start,
        value: dp.value,
      })),
    })
  }

  return snapshots
}

export async function buildOrgContext(
  supabase: SupabaseClient<Database>,
  organizationId: string
): Promise<OrgContext | null> {
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .single()

  if (!org) return null

  return {
    name: org.name,
    sector: org.sector,
    employee_count: org.employee_count,
    subscription_tier: org.subscription_tier,
    active_pillars: org.active_pillars as PillarType[],
  }
}
