-- Production foundation for the Menatech AI Impact Dashboard.
-- Apply this migration before enabling weekly refreshes and the lead magnet.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.dashboard_items (
  id text PRIMARY KEY,
  section text NOT NULL CHECK (section IN ('news', 'metrics', 'reports', 'papers', 'llmNews', 'manuals')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  source_name text NOT NULL DEFAULT '',
  source_url text NOT NULL DEFAULT '',
  source_kind text NOT NULL DEFAULT 'periodistica',
  published_at text,
  impact text NOT NULL DEFAULT 'Medio',
  tags text[] NOT NULL DEFAULT '{}',
  ai_readiness_angle text NOT NULL DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'draft')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dashboard_refresh_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('ok', 'failed', 'partial')),
  item_count integer NOT NULL DEFAULT 0,
  metric_count integer NOT NULL DEFAULT 0,
  error text,
  triggered_by text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.dashboard_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  company text,
  role text,
  consent boolean NOT NULL DEFAULT false,
  report_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_path text NOT NULL DEFAULT 'ai-impact-dashboard',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_menatech_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@menatech.cloud'
$$;

ALTER TABLE public.dashboard_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_refresh_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active dashboard items" ON public.dashboard_items;
CREATE POLICY "Public can read active dashboard items"
ON public.dashboard_items
FOR SELECT
USING (status = 'active');

DROP POLICY IF EXISTS "Menatech admins can manage dashboard items" ON public.dashboard_items;
CREATE POLICY "Menatech admins can manage dashboard items"
ON public.dashboard_items
FOR ALL
USING (public.is_menatech_admin())
WITH CHECK (public.is_menatech_admin());

DROP POLICY IF EXISTS "Menatech admins can read refresh runs" ON public.dashboard_refresh_runs;
CREATE POLICY "Menatech admins can read refresh runs"
ON public.dashboard_refresh_runs
FOR SELECT
USING (public.is_menatech_admin());

DROP POLICY IF EXISTS "Menatech admins can read leads" ON public.dashboard_leads;
CREATE POLICY "Menatech admins can read leads"
ON public.dashboard_leads
FOR SELECT
USING (public.is_menatech_admin());

CREATE INDEX IF NOT EXISTS dashboard_items_section_status_idx
  ON public.dashboard_items (section, status);

CREATE INDEX IF NOT EXISTS dashboard_leads_created_at_idx
  ON public.dashboard_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS dashboard_refresh_runs_completed_at_idx
  ON public.dashboard_refresh_runs (completed_at DESC);
