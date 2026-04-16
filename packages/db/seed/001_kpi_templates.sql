-- ============================================================
-- ITER Analytics - Seed Data
-- Global KPI template definitions (organization_id = NULL)
-- ============================================================

-- PILAR I: ADMINISTRATIVO
INSERT INTO kpi_definitions (organization_id, pillar, name, name_en, description, unit, direction, alert_threshold_type, alert_threshold_value, weight, display_order) VALUES
(NULL, 'admin', 'Tempo de Ciclo de Processo', 'Process Cycle Time', 'Tempo médio para completar processos-chave do negócio', 'days', 'lower_is_better', 'above', 20, 1.5, 1),
(NULL, 'admin', 'Índice de Gargalos', 'Bottleneck Index', 'Número de gargalos identificados por departamento', 'count', 'lower_is_better', 'above', 3, 1.0, 2),
(NULL, 'admin', 'Taxa de Conformidade com POPs', 'SOP Compliance Rate', 'Percentual de equipes seguindo Procedimentos Operacionais Padrão', 'percentage', 'higher_is_better', 'below', 80, 1.5, 3),
(NULL, 'admin', 'Score de Clareza Organizacional', 'Org Clarity Score', 'Avaliação da clareza do organograma, papéis e responsabilidades', 'score', 'higher_is_better', 'below', 60, 1.2, 4),
(NULL, 'admin', 'Adoção de Painéis de KPI', 'KPI Dashboard Adoption', 'Percentual de KPIs operacionais ativamente monitorados', 'percentage', 'higher_is_better', 'below', 50, 0.8, 5),
(NULL, 'admin', 'Tempo de Resposta a Crises', 'Crisis Response Time', 'Tempo médio da detecção do incidente à resolução', 'days', 'lower_is_better', 'above', 2, 1.0, 6),
(NULL, 'admin', 'Índice Overhead Seek', 'Overhead Seek Index', 'Razão de custos ocultos identificados sobre receita total', 'percentage', 'lower_is_better', 'above', 15, 1.0, 7);

-- PILAR II: JURÍDICO
INSERT INTO kpi_definitions (organization_id, pillar, name, name_en, description, unit, direction, alert_threshold_type, alert_threshold_value, weight, display_order) VALUES
(NULL, 'legal', 'Score de Risco Contratual', 'Contract Risk Score', 'Avaliação agregada de risco dos contratos ativos', 'score', 'higher_is_better', 'below', 60, 1.5, 1),
(NULL, 'legal', 'Conformidade Trabalhista', 'Labor Compliance', 'Percentual de conformidade com leis trabalhistas e adequação de EPIs', 'percentage', 'higher_is_better', 'below', 90, 1.5, 2),
(NULL, 'legal', 'Exposição a Contingências (R$)', 'Contingency Exposure', 'Exposição financeira total de contingências jurídicas ativas', 'currency_brl', 'lower_is_better', 'change_pct', 10, 1.2, 3),
(NULL, 'legal', 'Score LGPD', 'LGPD Compliance Score', 'Progresso na adequação à Lei Geral de Proteção de Dados', 'percentage', 'higher_is_better', 'below', 70, 1.3, 4),
(NULL, 'legal', 'Saúde do Portfólio de PI', 'IP Portfolio Health', 'Status dos registros de marcas, patentes e direitos autorais', 'score', 'higher_is_better', 'below', 70, 0.8, 5),
(NULL, 'legal', 'Contratos a Vencer', 'Contract Expiry Tracker', 'Dias até vencimento de contratos-chave', 'days', 'higher_is_better', 'below', 30, 1.0, 6),
(NULL, 'legal', 'Conformidade Internacional', 'International Compliance', 'Status de conformidade com regulamentações estrangeiras (GDPR, FCPA)', 'score', 'higher_is_better', 'below', 70, 0.7, 7);

-- PILAR III: FINANCEIRO
INSERT INTO kpi_definitions (organization_id, pillar, name, name_en, description, unit, direction, alert_threshold_type, alert_threshold_value, weight, display_order) VALUES
(NULL, 'financial', 'Saúde do Fluxo de Caixa', 'Cash Flow Health', 'Fluxo de caixa operacional líquido com análise de tendência', 'currency_brl', 'higher_is_better', 'below', 0, 2.0, 1),
(NULL, 'financial', 'Burn Rate e Runway', 'Burn Rate & Runway', 'Taxa mensal de consumo de caixa e meses de runway restantes', 'days', 'higher_is_better', 'below', 180, 1.5, 2),
(NULL, 'financial', 'Margem Bruta (%)', 'Gross Margin', 'Receita menos COGS como percentual', 'percentage', 'higher_is_better', 'below', 30, 1.5, 3),
(NULL, 'financial', 'Índice de Liquidez', 'Liquidity Ratio', 'Ativos circulantes / passivos circulantes', 'ratio', 'higher_is_better', 'below', 1.2, 1.3, 4),
(NULL, 'financial', 'Status da Reserva Financeira', 'Fund Reserve Status', 'Saldo de reservas versus meta de reserva', 'percentage', 'higher_is_better', 'below', 50, 1.0, 5),
(NULL, 'financial', 'Índice de Redução de Desperdícios', 'Waste Reduction Index', 'Desperdícios eliminados como % dos custos totais', 'percentage', 'higher_is_better', 'below', 5, 0.8, 6),
(NULL, 'financial', 'ROI de Investimentos', 'Investment ROI', 'Retorno sobre investimentos corporativos e alocação de capital', 'percentage', 'higher_is_better', 'below', 10, 1.0, 7),
(NULL, 'financial', 'Concentração de Receita', 'Revenue Concentration Risk', 'Percentual de receita dos top 3 clientes', 'percentage', 'lower_is_better', 'above', 40, 1.0, 8);
