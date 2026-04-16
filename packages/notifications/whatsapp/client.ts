/**
 * WhatsApp Business API client for ITER Analytics.
 * Used for critical alerts only (cash flow risk, contract expiry, compliance breach).
 *
 * Uses the WhatsApp Cloud API (Meta Business Platform).
 * Requires: WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID env vars.
 */

const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0'

interface WhatsAppMessage {
  to: string        // Phone number in E.164 format (e.g., +5514999990000)
  template: string  // Template name registered in Meta Business
  language: string  // e.g., 'pt_BR'
  components?: WhatsAppComponent[]
}

interface WhatsAppComponent {
  type: 'header' | 'body' | 'button'
  parameters: Array<{
    type: 'text' | 'currency' | 'date_time'
    text?: string
    currency?: { fallback_value: string; code: string; amount_1000: number }
  }>
}

export const WhatsAppClient = {
  /**
   * Send a template message via WhatsApp Business API.
   * Only pre-approved templates can be sent (Meta requirement).
   */
  async sendTemplate(message: WhatsAppMessage) {
    const token = process.env.WHATSAPP_API_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!token || !phoneNumberId) {
      console.warn('[WhatsApp] API token or phone number ID not configured. Skipping.')
      return { success: false, reason: 'not_configured' }
    }

    const url = `${WHATSAPP_API_URL}/${phoneNumberId}/messages`

    const body = {
      messaging_product: 'whatsapp',
      to: message.to.replace(/\D/g, ''), // Strip non-digits
      type: 'template',
      template: {
        name: message.template,
        language: { code: message.language },
        ...(message.components ? { components: message.components } : {}),
      },
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('[WhatsApp] API error:', data)
        return { success: false, reason: 'api_error', error: data }
      }

      console.log(`[WhatsApp] Message sent to ${message.to}: ${data.messages?.[0]?.id}`)
      return { success: true, messageId: data.messages?.[0]?.id }
    } catch (err) {
      console.error('[WhatsApp] Unexpected error:', err)
      return { success: false, reason: 'network_error', error: err }
    }
  },
}

/**
 * Send a WhatsApp alert for a critical KPI breach.
 *
 * Requires template "iter_alert_critical" registered in Meta Business:
 * "🔴 Alerta ITER — {{1}}: {{2}}. Valor atual: {{3}}. Acesse: {{4}}"
 */
export async function sendWhatsApp(options: {
  to: string
  kpiName: string
  message: string
  currentValue: string
  dashboardUrl: string
}) {
  return WhatsAppClient.sendTemplate({
    to: options.to,
    template: 'iter_alert_critical',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: options.kpiName },
          { type: 'text', text: options.message },
          { type: 'text', text: options.currentValue },
          { type: 'text', text: options.dashboardUrl },
        ],
      },
    ],
  })
}

/**
 * WhatsApp template definitions for registration in Meta Business.
 * Register these before going live.
 */
export const WHATSAPP_TEMPLATES = {
  // Critical alert
  iter_alert_critical: {
    name: 'iter_alert_critical',
    category: 'UTILITY',
    language: 'pt_BR',
    body: '🔴 *Alerta ITER — {{1}}*\n\n{{2}}\n\nValor atual: {{3}}\n\n📊 Acesse seu dashboard: {{4}}',
  },

  // Weekly digest summary
  iter_weekly_digest: {
    name: 'iter_weekly_digest',
    category: 'UTILITY',
    language: 'pt_BR',
    body: '📊 *Resumo Semanal ITER*\n\nHealth Score: {{1}}/100\nAlertas ativos: {{2}}\n\nAcesse: {{3}}',
  },

  // Diagnostic report ready
  iter_diagnostic_ready: {
    name: 'iter_diagnostic_ready',
    category: 'UTILITY',
    language: 'pt_BR',
    body: '✅ *Seu diagnóstico ITER está pronto!*\n\nHealth Score: {{1}}/100\nRiscos identificados: {{2}}\n\nBaixe o relatório: {{3}}',
  },
} as const
