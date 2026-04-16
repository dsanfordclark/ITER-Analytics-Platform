import { Button, Section, Text } from '@react-email/components'
import * as React from 'react'
import { EmailLayout, styles } from './layout'

interface AlertNotificationEmailProps {
  name: string
  companyName: string
  kpiName: string
  pillar: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  currentValue: string
  thresholdValue: string
  dashboardUrl?: string
}

const severityLabels = {
  critical: { label: 'CRÍTICO', color: '#EF4444', bg: '#FEF2F2' },
  warning: { label: 'ATENÇÃO', color: '#F59E0B', bg: '#FFFBEB' },
  info: { label: 'INFORMATIVO', color: '#3B82F6', bg: '#EFF6FF' },
}

const pillarLabels: Record<string, string> = {
  admin: 'Administrativo',
  legal: 'Jurídico',
  financial: 'Financeiro',
}

export function AlertNotificationEmail({
  name = 'João',
  companyName = 'Empresa Exemplo',
  kpiName = 'Saúde do Fluxo de Caixa',
  pillar = 'financial',
  severity = 'critical',
  message = 'Fluxo de caixa negativo por 2 meses consecutivos',
  currentValue = '-R$ 28.000',
  thresholdValue = 'R$ 0 (positivo)',
  dashboardUrl = 'https://app.iteranalytics.com.br/alertas',
}: AlertNotificationEmailProps) {
  const sev = severityLabels[severity]
  const pillarLabel = pillarLabels[pillar] || pillar

  return (
    <EmailLayout preview={`[${sev.label}] ${kpiName} — ${companyName}`}>
      {/* Severity badge */}
      <Section style={{
        backgroundColor: sev.bg,
        borderRadius: '8px',
        padding: '16px 20px',
        margin: '0 0 20px',
        borderLeft: `4px solid ${sev.color}`,
      }}>
        <Text style={{
          fontSize: '12px',
          fontWeight: '700',
          color: sev.color,
          margin: '0 0 4px',
          letterSpacing: '1px',
          fontFamily: "'Arial', sans-serif",
        }}>
          ALERTA {sev.label}
        </Text>
        <Text style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1F2937',
          margin: '0',
          fontFamily: "'Arial', sans-serif",
        }}>
          {kpiName}
        </Text>
        <Text style={{
          fontSize: '12px',
          color: '#6B7280',
          margin: '4px 0 0',
          fontFamily: "'Arial', sans-serif",
        }}>
          Pilar: {pillarLabel} · {companyName}
        </Text>
      </Section>

      <Text style={styles.paragraph}>
        Olá {name}, um limite foi ultrapassado em um dos KPIs monitorados
        da sua empresa:
      </Text>

      <Text style={styles.paragraph}>
        <strong>{message}</strong>
      </Text>

      {/* Value comparison */}
      <Section style={{
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        padding: '16px 20px',
        margin: '16px 0',
      }}>
        <Text style={{
          fontSize: '13px',
          color: '#6B7280',
          margin: '0 0 8px',
          fontFamily: "'Arial', sans-serif",
        }}>
          Valor atual vs. limite configurado:
        </Text>
        <Text style={{
          fontSize: '14px',
          color: '#1F2937',
          margin: '0',
          fontFamily: "'Arial', sans-serif",
        }}>
          <strong>Atual:</strong> {currentValue}
          {'  '}|{'  '}
          <strong>Limite:</strong> {thresholdValue}
        </Text>
      </Section>

      <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
        <Button href={dashboardUrl} style={styles.button}>
          Ver Detalhes no Dashboard
        </Button>
      </Section>

      <Text style={{ ...styles.paragraph, fontSize: '13px', color: '#6B7280' }}>
        Este alerta foi gerado automaticamente pelo ITER Analytics.
        Você pode ajustar os limites de alerta nas configurações do seu dashboard.
      </Text>
    </EmailLayout>
  )
}

export default AlertNotificationEmail
