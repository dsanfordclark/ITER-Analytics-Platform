import { Resend } from 'resend'
import type { ReactElement } from 'react'

// Singleton Resend client
let resendInstance: Resend | null = null

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

export const ResendClient = {
  getInstance: getResend,
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: ReactElement
  from?: string
  replyTo?: string
  cc?: string[]
  bcc?: string[]
  tags?: Array<{ name: string; value: string }>
  scheduledAt?: string
}

/**
 * Send an email using Resend.
 *
 * @example
 * ```ts
 * import { sendEmail, WelcomeEmail } from '@iter/notifications'
 *
 * await sendEmail({
 *   to: 'ceo@empresa.com.br',
 *   subject: 'Bem-vindo ao ITER Analytics',
 *   react: WelcomeEmail({ name: 'João', companyName: 'Empresa X' }),
 *   tags: [{ name: 'type', value: 'welcome' }],
 * })
 * ```
 */
export async function sendEmail(options: SendEmailOptions) {
  const resend = getResend()
  const fromAddress = options.from || process.env.RESEND_FROM_EMAIL || 'ITER Analytics <noreply@iteranalytics.com.br>'

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      react: options.react,
      reply_to: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      tags: options.tags,
      scheduled_at: options.scheduledAt,
    })

    if (error) {
      console.error('[Resend] Email send error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log(`[Resend] Email sent successfully: ${data?.id}`)
    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error('[Resend] Unexpected error:', err)
    throw err
  }
}

/**
 * Send a batch of emails using Resend's batch API.
 * More efficient than individual sends for digests/reports.
 */
export async function sendBatchEmails(
  emails: Array<Omit<SendEmailOptions, 'from'>>
) {
  const resend = getResend()
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'ITER Analytics <noreply@iteranalytics.com.br>'

  const batch = emails.map((email) => ({
    from: fromAddress,
    to: Array.isArray(email.to) ? email.to : [email.to],
    subject: email.subject,
    react: email.react,
    tags: email.tags,
  }))

  try {
    const { data, error } = await resend.batch.send(batch)

    if (error) {
      console.error('[Resend] Batch send error:', error)
      throw new Error(`Failed to send batch: ${error.message}`)
    }

    console.log(`[Resend] Batch sent: ${data?.data?.length} emails`)
    return { success: true, results: data?.data }
  } catch (err) {
    console.error('[Resend] Batch unexpected error:', err)
    throw err
  }
}
