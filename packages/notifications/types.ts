import type { AlertSeverity, PillarType } from '@iter/db'

export type NotificationChannel = 'email' | 'whatsapp' | 'in_app'

export interface NotificationPayload {
  to: {
    email: string
    name: string
    phone?: string
    whatsappOptIn?: boolean
  }
  channels: NotificationChannel[]
  organizationId: string
  locale: string
}

export interface AlertPayload extends NotificationPayload {
  alert: {
    id: string
    kpiName: string
    pillar: PillarType
    severity: AlertSeverity
    message: string
    currentValue: number
    thresholdValue: number
    unit: string
  }
}

export interface DigestPayload extends NotificationPayload {
  digest: {
    period: 'weekly' | 'monthly'
    healthScores: {
      admin: number
      legal: number
      financial: number
      overall: number
    }
    activeAlerts: number
    resolvedAlerts: number
    topRisks: Array<{
      pillar: PillarType
      kpiName: string
      message: string
    }>
    trendHighlights: Array<{
      kpiName: string
      direction: 'up' | 'down'
      changePercent: number
    }>
  }
}

export interface DiagnosticReportPayload extends NotificationPayload {
  report: {
    id: string
    overallScore: number
    adminScore: number
    legalScore: number
    financialScore: number
    topRisksCount: number
    pdfUrl: string
  }
}
