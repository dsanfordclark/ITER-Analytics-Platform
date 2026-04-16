import { Button, Section, Text } from '@react-email/components'
import * as React from 'react'
import { EmailLayout, styles } from './layout'

interface WeeklyDigestEmailProps {
  name: string
  companyName: string
  period: 'weekly' | 'monthly'
  periodLabel: string
  healthScores: {
    admin: number
    legal: number
    financial: number
    overall: number
    overallChange: number
  }
  activeAlerts: number
  resolvedAlerts: number
  topRisks: Array<{ pillar: string; kpiName: string; message: string }>
  trendHighlights: Array<{
    kpiName: string
    direction: 'up' | 'down'
    changePercent: number
  }>
  dashboardUrl?: string
}

function scoreColor(score: number): string {
  if (score >= 70) return '#10B981'
  if (score >= 40) return '#F59E0B'
  return '#EF4444'
}

function changeIndicator(change: number): string {
  if (change > 0) return `▲ +${change}%`
  if (change < 0) return `▼ ${change}%`
  return '— 0%'
}

function changeColor(change: number): string {
  if (change > 0) return '#10B981'
  if (change < 0) return '#EF4444'
  return '#6B7280'
}

export function WeeklyDigestEmail({
  name = 'João',
  companyName = 'Empresa Exemplo',
  period = 'weekly',
  periodLabel = 'Semana de 07/04 a 13/04',
  healthScores = {
    admin: 62, legal: 45, financial: 58, overall: 56, overallChange: 3,
  },
  activeAlerts = 4,
  resolvedAlerts = 2,
  topRisks = [
    { pillar: 'Jurídico', kpiName: 'LGPD', message: 'Conformidade abaixo do limite' },
    { pillar: 'Financeiro', kpiName: 'Concentração', message: '52% da receita nos top 3 clientes' },
  ],
  trendHighlights = [
    { kpiName: 'Margem Bruta', direction: 'up' as const, changePercent: 4.2 },
    { kpiName: 'Tempo de Resposta a Crises', direction: 'down' as const, changePercent: -12 },
  ],
  dashboardUrl = 'https://app.iteranalytics.com.br/dashboard',
}: WeeklyDigestEmailProps) {
  const digestTitle = period === 'weekly' ? 'Resumo Semanal' : 'Resumo Mensal'

  return (
    <EmailLayout preview={`${digestTitle} ITER: ${companyName} — Score ${healthScores.overall}/100`}>
      <Text style={styles.h1}>{digestTitle}</Text>

      <Text style={{ ...styles.paragraph, color: '#6B7280' }}>
        {companyName} · {periodLabel}
      </Text>

      {/* Overall Health Score */}
      <Section style={{
        backgroundColor: '#1B2A4A',
        borderRadius: '8px',
        padding: '20px',
        margin: '16px 0',
        textAlign: 'center' as const,
      }}>
        <Text style={{
          color: '#9CA3AF',
          fontSize: '12px',
          letterSpacing: '1px',
          margin: '0 0 4px',
          fontFamily: "'Arial', sans-serif",
        }}>
          ITER HEALTH SCORE
        </Text>
        <Text style={{
          color: scoreColor(healthScores.overall),
          fontSize: '40px',
          fontWeight: '800',
          margin: '0',
          fontFamily: "'Arial', sans-serif",
        }}>
          {healthScores.overall}
          <span style={{ fontSize: '16px', color: '#9CA3AF' }}>/100</span>
        </Text>
        <Text style={{
          color: changeColor(healthScores.overallChange),
          fontSize: '14px',
          margin: '4px 0 0',
          fontFamily: "'Arial', sans-serif",
        }}>
          {changeIndicator(healthScores.overallChange)} vs. período anterior
        </Text>
      </Section>

      {/* Pillar Scores Row */}
      <Section style={{
        display: 'flex' as any,
        gap: '8px',
        margin: '12px 0',
      }}>
        {[
          { label: 'Administrativo', score: healthScores.admin },
          { label: 'Jurídico', score: healthScores.legal },
          { label: 'Financeiro', score: healthScores.financial },
        ].map((p) => (
          <div key={p.label} style={{
            ...styles.scoreBox,
            flex: '1',
            textAlign: 'center' as const,
            display: 'inline-block',
            width: '30%',
            marginRight: '3%',
          }}>
            <Text style={{ ...styles.scoreValue, fontSize: '24px', color: scoreColor(p.score) }}>
              {p.score}
            </Text>
            <Text style={{ ...styles.scoreLabel, fontSize: '11px' }}>{p.label}</Text>
          </div>
        ))}
      </Section>

      {/* Alerts Summary */}
      <Text style={styles.h2}>Alertas</Text>
      <Section style={{
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        padding: '12px 16px',
        margin: '8px 0',
      }}>
        <Text style={{ ...styles.paragraph, margin: '4px 0' }}>
          🔴 <strong>{activeAlerts}</strong> alertas ativos
          {'  '}·{'  '}
          ✅ <strong>{resolvedAlerts}</strong> resolvidos neste período
        </Text>
      </Section>

      {/* Top Risks */}
      {topRisks.length > 0 && (
        <>
          <Text style={styles.h2}>Riscos Prioritários</Text>
          {topRisks.map((risk, i) => (
            <Section key={i} style={styles.alertWarning}>
              <Text style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6B7280',
                margin: '0 0 2px',
                textTransform: 'uppercase' as const,
                fontFamily: "'Arial', sans-serif",
              }}>
                {risk.pillar} · {risk.kpiName}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#1F2937',
                margin: '0',
                fontFamily: "'Arial', sans-serif",
              }}>
                {risk.message}
              </Text>
            </Section>
          ))}
        </>
      )}

      {/* Trend Highlights */}
      {trendHighlights.length > 0 && (
        <>
          <Text style={styles.h2}>Destaques de Tendência</Text>
          {trendHighlights.map((trend, i) => (
            <Text key={i} style={{ ...styles.paragraph, fontSize: '14px' }}>
              <span style={{ color: changeColor(trend.changePercent) }}>
                {trend.direction === 'up' ? '▲' : '▼'}
              </span>
              {'  '}
              <strong>{trend.kpiName}</strong>
              {'  '}
              <span style={{ color: changeColor(trend.changePercent) }}>
                {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
              </span>
            </Text>
          ))}
        </>
      )}

      {/* CTA */}
      <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
        <Button href={dashboardUrl} style={styles.button}>
          Abrir Dashboard Completo
        </Button>
      </Section>
    </EmailLayout>
  )
}

export default WeeklyDigestEmail
