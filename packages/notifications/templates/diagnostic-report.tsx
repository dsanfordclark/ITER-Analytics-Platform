import { Button, Column, Row, Section, Text } from '@react-email/components'
import * as React from 'react'
import { EmailLayout, styles } from './layout'

interface DiagnosticReportEmailProps {
  name: string
  companyName: string
  overallScore: number
  adminScore: number
  legalScore: number
  financialScore: number
  topRisks: Array<{ pillar: string; message: string }>
  reportUrl: string
  dashboardUrl?: string
}

function scoreColor(score: number): string {
  if (score >= 70) return '#10B981'
  if (score >= 40) return '#F59E0B'
  return '#EF4444'
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div style={styles.scoreBox}>
      <Text style={{ ...styles.scoreValue, color: scoreColor(score) }}>
        {score}
      </Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </div>
  )
}

export function DiagnosticReportEmail({
  name = 'João',
  companyName = 'Empresa Exemplo',
  overallScore = 54,
  adminScore = 62,
  legalScore = 38,
  financialScore = 58,
  topRisks = [
    { pillar: 'Jurídico', message: 'Conformidade LGPD abaixo de 70% — risco de multas' },
    { pillar: 'Administrativo', message: '3 gargalos operacionais detectados no fluxo de produção' },
    { pillar: 'Financeiro', message: 'Concentração de receita: top 3 clientes representam 52% do faturamento' },
  ],
  reportUrl = 'https://app.iteranalytics.com.br/relatorios/abc123',
  dashboardUrl = 'https://app.iteranalytics.com.br/dashboard',
}: DiagnosticReportEmailProps) {
  return (
    <EmailLayout preview={`Diagnóstico ITER: ${companyName} — Score ${overallScore}/100`}>
      <Text style={styles.h1}>
        Seu Diagnóstico Empresarial está pronto
      </Text>

      <Text style={styles.paragraph}>
        Olá {name}, concluímos a análise diagnóstica da <strong>{companyName}</strong>.
        Aqui está um resumo dos resultados nos três pilares do Sistema de Elevação ITER:
      </Text>

      {/* Overall Score */}
      <Section style={{
        backgroundColor: '#1B2A4A',
        borderRadius: '8px',
        padding: '24px',
        margin: '20px 0',
        textAlign: 'center' as const,
      }}>
        <Text style={{
          color: '#ffffff',
          fontSize: '14px',
          margin: '0 0 4px',
          fontFamily: "'Arial', sans-serif",
          letterSpacing: '1px',
        }}>
          ITER HEALTH SCORE
        </Text>
        <Text style={{
          color: scoreColor(overallScore),
          fontSize: '48px',
          fontWeight: '800',
          margin: '0',
          fontFamily: "'Arial', sans-serif",
        }}>
          {overallScore}
          <span style={{ fontSize: '20px', color: '#9CA3AF' }}>/100</span>
        </Text>
      </Section>

      {/* Pillar Scores */}
      <Text style={styles.h2}>Scores por Pilar</Text>

      <ScoreCard label="Pilar I — Administrativo (Inteligência Operacional)" score={adminScore} />
      <ScoreCard label="Pilar II — Jurídico (Blindagem Estratégica)" score={legalScore} />
      <ScoreCard label="Pilar III — Financeiro (Estratégia de Capital)" score={financialScore} />

      {/* Top Risks */}
      <Text style={styles.h2}>Principais Riscos Identificados</Text>

      {topRisks.map((risk, i) => (
        <Section
          key={i}
          style={risk.pillar === 'Jurídico' ? styles.alertCritical :
                 risk.pillar === 'Financeiro' ? styles.alertWarning : styles.alertInfo}
        >
          <Text style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#6B7280',
            margin: '0 0 4px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            fontFamily: "'Arial', sans-serif",
          }}>
            {risk.pillar}
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

      {/* CTA */}
      <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
        <Button href={reportUrl} style={styles.button}>
          Baixar Relatório Completo (PDF)
        </Button>
      </Section>

      <Text style={styles.paragraph}>
        Quer entender melhor esses resultados e criar um plano de ação?
        Nossa equipe está pronta para uma conversa estratégica sem compromisso.
      </Text>

      <Section style={{ textAlign: 'center' as const, margin: '16px 0' }}>
        <Button
          href="https://calendly.com/iter-analytics/diagnostico"
          style={{
            ...styles.button,
            backgroundColor: 'transparent',
            color: '#2E75B6',
            border: '2px solid #2E75B6',
          }}
        >
          Agendar Conversa com ITER
        </Button>
      </Section>
    </EmailLayout>
  )
}

export default DiagnosticReportEmail
