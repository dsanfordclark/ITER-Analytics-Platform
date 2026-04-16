export { ResendClient, sendEmail } from './email/client'
export { WhatsAppClient, sendWhatsApp } from './whatsapp/client'
export { AlertNotifier } from './alert-notifier'

// Email templates
export { DiagnosticReportEmail } from './email/templates/diagnostic-report'
export { WeeklyDigestEmail } from './email/templates/weekly-digest'
export { AlertNotificationEmail } from './email/templates/alert-notification'
export { WelcomeEmail } from './email/templates/welcome'

// Types
export type { NotificationChannel, NotificationPayload, AlertPayload } from './types'
