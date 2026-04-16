import { sendEmail } from './email/client'
import { sendWhatsApp } from './whatsapp/client'
import { AlertNotificationEmail } from './email/templates/alert-notification'
import type { AlertPayload, NotificationChannel } from './types'
import React from 'react'

/**
 * AlertNotifier orchestrates sending alerts across multiple channels.
 * Used by the `process-alerts` Supabase Edge Function.
 *
 * Flow:
 * 1. KPI data point is inserted/updated
 * 2. Supabase DB trigger or Edge Function evaluates thresholds
 * 3. If breached, creates alert row + calls AlertNotifier.send()
 * 4. AlertNotifier delivers via configured channels (email, WhatsApp, in-app)
 */
export class AlertNotifier {
  /**
   * Send an alert notification across all configured channels.
   * Respects user's WhatsApp opt-in and subscription tier.
   */
  static async send(payload: AlertPayload): Promise<{
    channels: Record<NotificationChannel, { sent: boolean; error?: string }>
  }> {
    const results: Record<string, { sent: boolean; error?: string }> = {}

    // Always send in-app (handled by Supabase Realtime subscription on alerts table)
    results.in_app = { sent: true }

    // Email
    if (payload.channels.includes('email')) {
      try {
        await sendEmail({
          to: payload.to.email,
          subject: `[${severityLabel(payload.alert.severity)}] ${payload.alert.kpiName} — ITER Analytics`,
          react: React.createElement(AlertNotificationEmail, {
            name: payload.to.name,
            companyName: '', // Populated by caller
            kpiName: payload.alert.kpiName,
            pillar: payload.alert.pillar,
            severity: payload.alert.severity,
            message: payload.alert.message,
            currentValue: formatValue(payload.alert.currentValue, payload.alert.unit),
            thresholdValue: formatValue(payload.alert.thresholdValue, payload.alert.unit),
          }),
          tags: [
            { name: 'type', value: 'alert' },
            { name: 'severity', value: payload.alert.severity },
            { name: 'pillar', value: payload.alert.pillar },
            { name: 'org', value: payload.organizationId },
          ],
        })
        results.email = { sent: true }
      } catch (err) {
        results.email = { sent: false, error: String(err) }
      }
    }

    // WhatsApp (only if opted in + critical alerts only)
    if (
      payload.channels.includes('whatsapp') &&
      payload.to.phone &&
      payload.to.whatsappOptIn &&
      payload.alert.severity === 'critical'
    ) {
      try {
        const result = await sendWhatsApp({
          to: payload.to.phone,
          kpiName: payload.alert.kpiName,
          message: payload.alert.message,
          currentValue: formatValue(payload.alert.currentValue, payload.alert.unit),
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/alertas`,
        })
        results.whatsapp = { sent: result.success, error: result.success ? undefined : String(result) }
      } catch (err) {
        results.whatsapp = { sent: false, error: String(err) }
      }
    }

    return { channels: results as any }
  }
}

// --- Helpers ---

function severityLabel(severity: string): string {
  switch (severity) {
    case 'critical': return 'CRÍTICO'
    case 'warning': return 'ATENÇÃO'
    default: return 'INFO'
  }
}

function formatValue(value: number, unit: string): string {
  switch (unit) {
    case 'currency_brl':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    case 'percentage':
      return `${value}%`
    case 'days':
      return `${value} dias`
    case 'ratio':
      return value.toFixed(2)
    default:
      return String(value)
  }
}
