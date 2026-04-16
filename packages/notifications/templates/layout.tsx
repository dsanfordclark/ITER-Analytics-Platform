import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

const ITER_DARK = '#1B2A4A'
const ITER_ACCENT = '#2E75B6'
const GRAY = '#6B7280'
const LIGHT_BG = '#F9FAFB'

interface LayoutProps {
  preview: string
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>ITER</Text>
            <Text style={tagline}>A Elevação Empresarial</Text>
          </Section>

          <Hr style={divider} />

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              ITER Analytics — Inteligência, Estrutura e Propósito
            </Text>
            <Text style={footerText}>
              Elevar empresas. Libertar potenciais. Criar prosperidade.
            </Text>
            <Text style={footerSmall}>
              Este email foi enviado pelo ITER Analytics Platform.
              Para ajustar suas preferências de notificação, acesse as configurações da sua conta.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Shared style exports for templates
export const styles = {
  h1: {
    color: ITER_DARK,
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '24px 0 16px',
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  } as React.CSSProperties,

  h2: {
    color: ITER_ACCENT,
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '1.3',
    margin: '20px 0 8px',
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  } as React.CSSProperties,

  paragraph: {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '8px 0',
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  } as React.CSSProperties,

  button: {
    backgroundColor: ITER_ACCENT,
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: '600',
    lineHeight: '1',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  } as React.CSSProperties,

  scoreBox: {
    backgroundColor: LIGHT_BG,
    borderRadius: '8px',
    padding: '16px',
    margin: '12px 0',
    border: '1px solid #E5E7EB',
  } as React.CSSProperties,

  scoreValue: {
    color: ITER_DARK,
    fontSize: '32px',
    fontWeight: '700',
    margin: '0',
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  } as React.CSSProperties,

  scoreLabel: {
    color: GRAY,
    fontSize: '13px',
    margin: '4px 0 0',
    fontFamily: "'Arial', 'Helvetica', sans-serif",
  } as React.CSSProperties,

  alertCritical: {
    backgroundColor: '#FEF2F2',
    borderLeft: '4px solid #EF4444',
    padding: '12px 16px',
    margin: '8px 0',
    borderRadius: '0 6px 6px 0',
  } as React.CSSProperties,

  alertWarning: {
    backgroundColor: '#FFFBEB',
    borderLeft: '4px solid #F59E0B',
    padding: '12px 16px',
    margin: '8px 0',
    borderRadius: '0 6px 6px 0',
  } as React.CSSProperties,

  alertInfo: {
    backgroundColor: '#EFF6FF',
    borderLeft: '4px solid #3B82F6',
    padding: '12px 16px',
    margin: '8px 0',
    borderRadius: '0 6px 6px 0',
  } as React.CSSProperties,
}

// Private layout styles
const body: React.CSSProperties = {
  backgroundColor: '#F3F4F6',
  fontFamily: "'Arial', 'Helvetica', sans-serif",
  margin: '0',
  padding: '0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '40px auto',
  maxWidth: '600px',
  padding: '0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}

const header: React.CSSProperties = {
  padding: '32px 40px 16px',
  textAlign: 'center' as const,
}

const logoText: React.CSSProperties = {
  color: ITER_DARK,
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '3px',
  margin: '0',
  fontFamily: "'Arial', 'Helvetica', sans-serif",
}

const tagline: React.CSSProperties = {
  color: ITER_ACCENT,
  fontSize: '12px',
  letterSpacing: '1px',
  margin: '4px 0 0',
  fontFamily: "'Arial', 'Helvetica', sans-serif",
}

const divider: React.CSSProperties = {
  borderColor: '#E5E7EB',
  margin: '0 40px',
}

const content: React.CSSProperties = {
  padding: '24px 40px',
}

const footer: React.CSSProperties = {
  padding: '16px 40px 32px',
  textAlign: 'center' as const,
}

const footerText: React.CSSProperties = {
  color: GRAY,
  fontSize: '13px',
  lineHeight: '1.4',
  margin: '4px 0',
  fontFamily: "'Arial', 'Helvetica', sans-serif",
}

const footerSmall: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: '11px',
  lineHeight: '1.4',
  margin: '12px 0 0',
  fontFamily: "'Arial', 'Helvetica', sans-serif",
}
