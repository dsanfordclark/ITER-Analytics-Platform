import { Button, Section, Text } from '@react-email/components'
import * as React from 'react'
import { EmailLayout, styles } from './layout'

interface WelcomeEmailProps {
  name: string
  companyName: string
  dashboardUrl?: string
}

export function WelcomeEmail({
  name = 'João',
  companyName = 'Empresa Exemplo',
  dashboardUrl = 'https://app.iteranalytics.com.br/dashboard',
}: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Bem-vindo ao ITER Analytics, ${name}!`}>
      <Text style={styles.h1}>
        Bem-vindo ao ITER Analytics, {name}!
      </Text>

      <Text style={styles.paragraph}>
        Sua conta para <strong>{companyName}</strong> foi criada com sucesso.
        Agora você tem acesso ao diagnóstico empresarial gratuito do ITER —
        uma análise completa da saúde da sua empresa nos três pilares:
        Administrativo, Jurídico e Financeiro.
      </Text>

      <Text style={styles.h2}>O que fazer agora?</Text>

      <Text style={styles.paragraph}>
        <strong>1. Complete o Diagnóstico</strong> — Em apenas 10-15 minutos,
        nosso questionário interativo vai mapear os pontos fortes e os riscos
        ocultos da sua empresa.
      </Text>
      <Text style={styles.paragraph}>
        <strong>2. Receba seu Relatório</strong> — Um relatório PDF completo
        com scores por pilar, principais riscos identificados e comparação
        com empresas do seu setor.
      </Text>
      <Text style={styles.paragraph}>
        <strong>3. Tome Decisões</strong> — Use os insights para priorizar
        ações e construir uma base sólida para o crescimento sustentável.
      </Text>

      <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
        <Button href={dashboardUrl} style={styles.button}>
          Iniciar Diagnóstico →
        </Button>
      </Section>

      <Text style={styles.paragraph}>
        Se tiver qualquer dúvida, responda este email ou fale com nossa equipe.
        Estamos aqui para ajudar sua empresa a prosperar.
      </Text>

      <Text style={{ ...styles.paragraph, fontStyle: 'italic', color: '#6B7280' }}>
        "A empresa que se organiza, se liberta. A que se liberta, cresce.
        A que cresce, prospera."
      </Text>
    </EmailLayout>
  )
}

export default WelcomeEmail
