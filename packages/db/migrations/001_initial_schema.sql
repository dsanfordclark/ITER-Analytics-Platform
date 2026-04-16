-- ============================================================
-- ITER Analytics Platform - Initial Schema
-- Migration: 001_initial_schema
-- Date: 2026-04-15
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE subscription_tier AS ENUM (
  'free', 'single_pillar', 'two_pillar', 'full', 'enterprise'
);

CREATE TYPE pillar_type AS ENUM ('admin', 'legal', 'financial');

CREATE TYPE user_role AS ENUM (
  'owner', 'admin', 'viewer', 'iter_admin', 'iter_super_admin'
);

CREATE TYPE kpi_unit AS ENUM (
  'percentage', 'currency_brl', 'days', 'score', 'count', 'ratio'
);

CREATE TYPE kpi_direction AS ENUM ('higher_is_better', 'lower_is_better');

CREATE TYPE alert_severity AS ENUM ('critical', 'warning', 'info');

CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved');

CREATE TYPE data_source AS ENUM ('manual', 'csv_import', 'erp_sync', 'diagnostic');

-- ============================================================
-- TABLES
-- ============================================================

-- Organizations (top-level tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  sector TEXT,
  employee_count INTEGER,
  annual_revenue_range TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  active_pillars pillar_type[] NOT NULL DEFAULT '{}',
  onboarded_by UUID,  -- FK added after users table
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  whatsapp_opt_in BOOLEAN DEFAULT false,
  locale TEXT DEFAULT 'pt-BR',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK for organizations.onboarded_by
ALTER TABLE organizations
  ADD CONSTRAINT fk_onboarded_by FOREIGN KEY (onboarded_by) REFERENCES users(id);

-- KPI Definitions
CREATE TABLE kpi_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  pillar pillar_type NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  unit kpi_unit NOT NULL DEFAULT 'score',
  direction kpi_direction NOT NULL DEFAULT 'higher_is_better',
  alert_threshold_type TEXT, -- 'above', 'below', 'change_pct'
  alert_threshold_value NUMERIC,
  weight NUMERIC DEFAULT 1.0,
  data_source data_source DEFAULT 'manual',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for KPI definitions
CREATE INDEX idx_kpi_def_org ON kpi_definitions(organization_id);
CREATE INDEX idx_kpi_def_pillar ON kpi_definitions(pillar);
CREATE INDEX idx_kpi_def_org_pillar ON kpi_definitions(organization_id, pillar);

-- KPI Data Points (time-series)
CREATE TABLE kpi_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_definition_id UUID NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  value NUMERIC NOT NULL,
  source data_source NOT NULL DEFAULT 'manual',
  notes TEXT,
  entered_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Critical index for dashboard queries
CREATE INDEX idx_kpi_data_org_kpi_period
  ON kpi_data_points(organization_id, kpi_definition_id, period_start DESC);

CREATE INDEX idx_kpi_data_org_period
  ON kpi_data_points(organization_id, period_start DESC);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  kpi_definition_id UUID NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
  kpi_data_point_id UUID REFERENCES kpi_data_points(id),
  severity alert_severity NOT NULL DEFAULT 'warning',
  message TEXT NOT NULL,
  status alert_status NOT NULL DEFAULT 'active',
  notified_via TEXT[] DEFAULT '{}',
  notified_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_org_status ON alerts(organization_id, status);
CREATE INDEX idx_alerts_org_created ON alerts(organization_id, created_at DESC);

-- Questionnaire Responses
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  wizard_version TEXT NOT NULL DEFAULT '1.0',
  answers JSONB NOT NULL DEFAULT '[]',
  pillar_scores_raw JSONB,
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Diagnostic Reports
CREATE TABLE diagnostic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  generated_by UUID NOT NULL REFERENCES users(id),
  questionnaire_response_id UUID REFERENCES questionnaire_responses(id),
  admin_score NUMERIC,
  legal_score NUMERIC,
  financial_score NUMERIC,
  overall_score NUMERIC,
  top_risks JSONB DEFAULT '[]',
  teaser_insights JSONB DEFAULT '[]',
  full_report_data JSONB,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diag_reports_org ON diagnostic_reports(organization_id, created_at DESC);

-- AI Chat Sessions
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  context_kpis JSONB,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_chat_user ON ai_chat_sessions(user_id, created_at DESC);

-- Methodology Documents (RAG Knowledge Base)
CREATE TABLE methodology_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  pillar pillar_type,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  metadata JSONB,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vector similarity search index
CREATE INDEX idx_methodology_embedding
  ON methodology_documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_ai_chat_updated
  BEFORE UPDATE ON ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE methodology_documents ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's org and role
CREATE OR REPLACE FUNCTION auth.user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.is_iter_admin()
RETURNS BOOLEAN AS $$
  SELECT role IN ('iter_admin', 'iter_super_admin') FROM users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Organizations policies
CREATE POLICY "Users see own org" ON organizations
  FOR SELECT USING (id = auth.user_org_id() OR auth.is_iter_admin());

CREATE POLICY "ITER admins can insert orgs" ON organizations
  FOR INSERT WITH CHECK (auth.is_iter_admin());

CREATE POLICY "ITER admins can update orgs" ON organizations
  FOR UPDATE USING (auth.is_iter_admin());

-- Users policies
CREATE POLICY "Users see own org members" ON users
  FOR SELECT USING (organization_id = auth.user_org_id() OR auth.is_iter_admin());

CREATE POLICY "Users update own profile" ON users
  FOR UPDATE USING (auth_id = auth.uid());

-- KPI Definitions policies
CREATE POLICY "See global or own org KPIs" ON kpi_definitions
  FOR SELECT USING (
    organization_id IS NULL
    OR organization_id = auth.user_org_id()
    OR auth.is_iter_admin()
  );

CREATE POLICY "ITER admins manage KPI defs" ON kpi_definitions
  FOR ALL USING (auth.is_iter_admin());

-- KPI Data Points policies
CREATE POLICY "Own org data only" ON kpi_data_points
  FOR SELECT USING (organization_id = auth.user_org_id() OR auth.is_iter_admin());

CREATE POLICY "Insert own org data" ON kpi_data_points
  FOR INSERT WITH CHECK (
    organization_id = auth.user_org_id()
    AND auth.user_role() IN ('owner', 'admin')
  );

-- Alerts policies
CREATE POLICY "Own org alerts" ON alerts
  FOR SELECT USING (organization_id = auth.user_org_id() OR auth.is_iter_admin());

CREATE POLICY "Update own org alerts" ON alerts
  FOR UPDATE USING (organization_id = auth.user_org_id() OR auth.is_iter_admin());

-- Questionnaire Responses policies
CREATE POLICY "Own org responses" ON questionnaire_responses
  FOR SELECT USING (organization_id = auth.user_org_id() OR auth.is_iter_admin());

CREATE POLICY "Insert own responses" ON questionnaire_responses
  FOR INSERT WITH CHECK (organization_id = auth.user_org_id());

-- Diagnostic Reports policies
CREATE POLICY "Own org reports" ON diagnostic_reports
  FOR SELECT USING (organization_id = auth.user_org_id() OR auth.is_iter_admin());

-- AI Chat policies
CREATE POLICY "Own sessions only" ON ai_chat_sessions
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Insert own sessions" ON ai_chat_sessions
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Update own sessions" ON ai_chat_sessions
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ITER admins can also see all chat sessions
CREATE POLICY "ITER admins see all chats" ON ai_chat_sessions
  FOR SELECT USING (auth.is_iter_admin());

-- Methodology documents are readable by all authenticated users
CREATE POLICY "All users read methodology" ON methodology_documents
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Calculate composite pillar score for an organization
CREATE OR REPLACE FUNCTION calculate_pillar_score(
  p_org_id UUID,
  p_pillar pillar_type
)
RETURNS NUMERIC AS $$
DECLARE
  result NUMERIC;
BEGIN
  SELECT
    COALESCE(
      SUM(latest.value * kd.weight) / NULLIF(SUM(kd.weight), 0),
      0
    )
  INTO result
  FROM kpi_definitions kd
  LEFT JOIN LATERAL (
    SELECT value
    FROM kpi_data_points kdp
    WHERE kdp.kpi_definition_id = kd.id
      AND kdp.organization_id = p_org_id
    ORDER BY period_start DESC
    LIMIT 1
  ) latest ON true
  WHERE (kd.organization_id = p_org_id OR kd.organization_id IS NULL)
    AND kd.pillar = p_pillar
    AND kd.is_active = true;

  RETURN ROUND(result, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Calculate overall ITER Health Score
CREATE OR REPLACE FUNCTION calculate_health_score(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
  admin_score NUMERIC;
  legal_score NUMERIC;
  financial_score NUMERIC;
  overall NUMERIC;
BEGIN
  admin_score := calculate_pillar_score(p_org_id, 'admin');
  legal_score := calculate_pillar_score(p_org_id, 'legal');
  financial_score := calculate_pillar_score(p_org_id, 'financial');
  overall := ROUND((admin_score * 0.35) + (legal_score * 0.30) + (financial_score * 0.35), 1);

  RETURN jsonb_build_object(
    'admin', admin_score,
    'legal', legal_score,
    'financial', financial_score,
    'overall', overall
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Semantic search for RAG
CREATE OR REPLACE FUNCTION match_methodology(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.75,
  match_count INT DEFAULT 5,
  filter_pillar pillar_type DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  pillar pillar_type,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    md.id,
    md.title,
    md.content,
    md.pillar,
    1 - (md.embedding <=> query_embedding) AS similarity
  FROM methodology_documents md
  WHERE 1 - (md.embedding <=> query_embedding) > match_threshold
    AND (filter_pillar IS NULL OR md.pillar = filter_pillar OR md.pillar IS NULL)
  ORDER BY md.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
