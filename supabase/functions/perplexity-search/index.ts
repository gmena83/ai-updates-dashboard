import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const searchTypes = ["news", "llm-news", "papers", "manuals", "metrics", "reports"] as const;
type SearchType = (typeof searchTypes)[number];
type DashboardSectionId = "news" | "metrics" | "reports" | "papers" | "llmNews" | "manuals";
type ImpactLevel = "Alto" | "Medio" | "Bajo";
type SourceKind = "oficial" | "academica" | "consultora" | "periodistica" | "gobierno";

interface PerplexityRequest {
  action?: "health" | "latest" | "refresh";
  query?: string;
  type?: SearchType;
  maxResults?: number;
}

interface SourceRef {
  name: string;
  url: string;
  kind: SourceKind;
}

interface ContentItem {
  id: string;
  section: DashboardSectionId;
  title: string;
  description: string;
  source: SourceRef;
  date: string;
  impact: ImpactLevel;
  tags: string[];
  aiReadinessAngle: string;
}

interface MetricInsight {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  description: string;
  businessUse: string;
  source: SourceRef;
  chartValue: number;
  unit: string;
}

interface ModelComparison {
  id: string;
  model: string;
  provider: string;
  bestFor: string;
  pymeUseCase: string;
  caution: string;
  source: SourceRef;
  score: number;
}

interface DashboardDataset {
  updatedAt: string;
  nextUpdateCadence: string;
  metrics: MetricInsight[];
  items: ContentItem[];
  models: ModelComparison[];
}

type RawItem = Record<string, unknown>;

interface AdminContext {
  allowed: boolean;
  triggeredBy: string;
  email?: string;
}

interface PersistenceResult {
  persisted: boolean;
  errors: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse({ success: true }, 200);
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json().catch(() => ({}))) as PerplexityRequest;

    if (body.action === "latest") {
      const dataset = await getLatestDashboard();

      if (!dataset) {
        return jsonResponse({ success: false, error: "No dashboard snapshot available" }, 404);
      }

      return jsonResponse({ success: true, data: dataset });
    }

    if (body.action === "health") {
      const adminContext = await getAdminContext(req);
      if (!adminContext.allowed) {
        return jsonResponse({ success: false, error: "Admin authorization required" }, 403);
      }

      return jsonResponse({
        success: true,
        services: {
          perplexity: Deno.env.get("PERPLEXITY_API_KEY") ? "ok" : "missing",
          resend: Deno.env.get("RESEND_API_KEY") ? "ok" : "missing",
          database: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ? "ok" : "missing",
        },
        admin: adminContext.email ?? adminContext.triggeredBy,
      });
    }

    if (body.action === "refresh") {
      const adminContext = await getAdminContext(req);
      if (!adminContext.allowed) {
        return jsonResponse({ success: false, error: "Admin authorization required" }, 403);
      }

      const dataset = await refreshDashboard(body.maxResults ?? 6);
      const persistence = await persistRefresh(dataset, adminContext.triggeredBy);
      return jsonResponse({ success: true, data: dataset, persistence });
    }

    if (!body.type || !isSearchType(body.type)) {
      return jsonResponse({ success: false, error: "Invalid search type" }, 400);
    }

    const adminContext = await getAdminContext(req);
    if (!adminContext.allowed) {
      return jsonResponse({ success: false, error: "Admin authorization required" }, 403);
    }

    const data = await runSearch(body.type, body.query ?? "", body.maxResults ?? 5);
    return jsonResponse({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("perplexity-search failed:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
});

async function getLatestDashboard(): Promise<DashboardDataset | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !key) return null;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/dashboard_snapshots?select=payload&id=eq.latest&status=eq.active&limit=1`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) return null;

  const rows = (await response.json().catch(() => [])) as unknown;
  if (!Array.isArray(rows) || !isRecord(rows[0])) return null;

  return isDashboardDataset(rows[0].payload) ? rows[0].payload : null;
}

async function getAdminContext(req: Request): Promise<AdminContext> {
  const cronSecret = Deno.env.get("DASHBOARD_CRON_SECRET");
  const providedCronSecret = req.headers.get("x-dashboard-cron-secret");

  if (cronSecret && providedCronSecret === cronSecret) {
    return { allowed: true, triggeredBy: "cron" };
  }

  const email = await getRequestUserEmail(req);
  if (email?.endsWith("@menatech.cloud")) {
    return { allowed: true, triggeredBy: email, email };
  }

  return { allowed: false, triggeredBy: email ?? "anonymous", email: email ?? undefined };
}

async function getRequestUserEmail(req: Request): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!supabaseUrl || !anonKey || !token || token === anonKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null);

  if (!response?.ok) return null;

  const user = (await response.json().catch(() => ({}))) as RawItem;
  const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
  return email.length > 0 ? email : null;
}

async function refreshDashboard(maxResults: number): Promise<DashboardDataset> {
  const [news, metrics, reports, papers, llmNews, manuals] = await Promise.all([
    runSearch("news", "", maxResults),
    runSearch("metrics", "", 4),
    runSearch("reports", "", maxResults),
    runSearch("papers", "", maxResults),
    runSearch("llm-news", "", maxResults),
    runSearch("manuals", "", maxResults),
  ]);

  return {
    updatedAt: new Date().toISOString(),
    nextUpdateCadence: "Actualizacion editorial semanal",
    metrics: metrics.map(toMetricInsight),
    items: [
      ...news.map((item, index) => toContentItem(item, "news", index)),
      ...reports.map((item, index) => toContentItem(item, "reports", index)),
      ...papers.map((item, index) => toContentItem(item, "papers", index)),
      ...llmNews.map((item, index) => toContentItem(item, "llm-news", index)),
      ...manuals.map((item, index) => toContentItem(item, "manuals", index)),
    ],
    models: modelComparisons,
  };
}

async function runSearch(type: SearchType, query: string, maxResults: number): Promise<RawItem[]> {
  const apiKey = Deno.env.get("PERPLEXITY_API_KEY");
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY no configurada");
  }

  const payload = {
    model: Deno.env.get("PERPLEXITY_MODEL") ?? "sonar-pro",
    messages: [
      { role: "system", content: getSystemPrompt(type) },
      { role: "user", content: buildSearchQuery(query, type) },
    ],
    temperature: 0.1,
    top_p: 0.9,
    max_tokens: 2600,
    return_images: false,
    return_related_questions: false,
    search_recency_filter: getRecencyFilter(type),
  };

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity ${response.status}: ${errorText.slice(0, 240)}`);
  }

  const data = (await response.json()) as RawItem;
  const choices = Array.isArray(data.choices) ? data.choices : [];
  const firstChoice = choices.find(isRecord);
  const message = isRecord(firstChoice?.message) ? firstChoice.message : {};
  const content = typeof message.content === "string" ? message.content : "";

  return parseJsonArray(content).slice(0, maxResults);
}

function getSystemPrompt(type: SearchType): string {
  const common =
    "Responde solamente con un array JSON valido. No uses markdown. Incluye source y url verificables en cada objeto. Prioriza fuentes primarias, oficiales o verificables.";

  switch (type) {
    case "news":
      return `${common} Busca noticias recientes de IA relevantes para PYMEs, startups y freelancers en Puerto Rico, Chile y LatAm. Prioriza medios pequenos o alternativos verificables y evita articulos sin URL. Formato: [{"title":"","description":"","source":"","date":"YYYY-MM-DD","url":"","impact":"Alto|Medio|Bajo","tags":[""],"aiReadinessAngle":""}]`;
    case "llm-news":
      return `${common} Busca anuncios oficiales recientes de OpenAI, Anthropic, DeepSeek, Google Gemini y Perplexity. Solo fuentes oficiales. Formato: [{"title":"","description":"","source":"","date":"YYYY-MM-DD","url":"","llm":"","impact":"Alto|Medio|Bajo","tags":[""],"aiReadinessAngle":""}]`;
    case "papers":
      return `${common} Busca papers revisados por pares o working papers academicos sobre IA, productividad, PYMEs, trabajo y adopcion empresarial. Formato: [{"title":"","description":"","authors":[""],"journal":"","year":"2026","source":"","date":"YYYY-MM-DD","url":"","impact":"Alto|Medio|Bajo","tags":[""],"aiReadinessAngle":""}]`;
    case "reports":
      return `${common} Busca reportes profundos de McKinsey, Deloitte, PwC, BCG, Accenture, Stanford, OECD, BID o instituciones gubernamentales sobre impacto de IA en empresas. Formato: [{"title":"","description":"","company":"","source":"","date":"YYYY-MM-DD","url":"","impact":"Alto|Medio|Bajo","tags":[""],"aiReadinessAngle":""}]`;
    case "manuals":
      return `${common} Busca guias, tutoriales y documentacion oficial para usar LLMs y agentes en empresas. Solo fuentes oficiales de proveedores. Formato: [{"title":"","description":"","company":"","source":"","date":"YYYY-MM-DD","url":"","impact":"Alto|Medio|Bajo","tags":[""],"aiReadinessAngle":""}]`;
    case "metrics":
      return `${common} Busca metricas verificables sobre IA en negocios: horas de trabajo ahorradas por semana, ahorro de costos, aumento de productividad, adopcion por PYMEs o empresas. Fuentes academicas, Big 5, Stanford, OECD o reportes oficiales. Formato: [{"name":"","value":"","change":"","trend":"up|down|flat","description":"","businessUse":"","source":"","url":""}]`;
  }
}

function buildSearchQuery(query: string, type: SearchType): string {
  if (query.trim().length > 0) return query;

  switch (type) {
    case "news":
      return "AI small business SME startups Latin America Puerto Rico Chile recent news verified sources";
    case "llm-news":
      return "official OpenAI Anthropic Google Gemini DeepSeek Perplexity latest model updates documentation";
    case "papers":
      return "peer reviewed research generative AI productivity small business SMEs working paper 2025 2026";
    case "reports":
      return "McKinsey Deloitte PwC BCG Accenture Stanford OECD AI adoption productivity SMEs report 2025 2026";
    case "manuals":
      return "official documentation OpenAI Anthropic Google Perplexity DeepSeek AI agents prompt guide business";
    case "metrics":
      return "verified statistics AI adoption SMEs productivity gains hours saved per week cost savings 2025 2026";
  }
}

function getRecencyFilter(type: SearchType): "week" | "month" | "year" {
  return type === "papers" || type === "reports" ? "year" : "month";
}

function parseJsonArray(content: string): RawItem[] {
  const trimmed = content.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start < 0 || end < start) return [];

  const parsed = JSON.parse(trimmed.slice(start, end + 1)) as unknown;
  return Array.isArray(parsed) ? parsed.filter(isRecord) : [];
}

function toMetricInsight(item: RawItem, index: number): MetricInsight {
  const label = text(item.name, `Metrica ${index + 1}`);
  const source = sourceRef(text(item.source, "Fuente verificable"), text(item.url, "#"), "metrics");
  const value = text(item.value, "N/A");

  return {
    id: slug(`${label}-${index}`),
    label,
    value,
    change: text(item.change, "Actualizado"),
    trend: item.trend === "down" || item.trend === "flat" ? item.trend : "up",
    description: text(item.description, "Metrica pendiente de descripcion."),
    businessUse: text(
      item.businessUse,
      "Usa esta metrica para priorizar procesos repetitivos antes de invertir en nuevas herramientas.",
    ),
    source,
    chartValue: extractNumber(value),
    unit: inferUnit(value),
  };
}

function toContentItem(item: RawItem, type: SearchType, index: number): ContentItem {
  const title = text(item.title, `Entrada ${index + 1}`);
  const section = sectionFromType(type);
  const url = text(item.url, "#");
  const sourceName = text(item.source ?? item.company ?? item.journal, "Fuente verificable");

  return {
    id: slug(`${section}-${title}-${index}`),
    section,
    title,
    description: text(item.description, "Descripcion pendiente."),
    source: sourceRef(sourceName, url, type),
    date: text(item.date ?? item.year, new Date().toISOString().slice(0, 10)),
    impact: impact(item.impact ?? item.relevance),
    tags: arrayText(item.tags).slice(0, 4),
    aiReadinessAngle: text(
      item.aiReadinessAngle,
      "Evalua si tu operacion, datos y equipo estan listos para aplicar esta senal.",
    ),
  };
}

function sectionFromType(type: SearchType): DashboardSectionId {
  if (type === "llm-news") return "llmNews";
  return type;
}

function sourceRef(name: string, url: string, type: SearchType | "metrics"): SourceRef {
  return {
    name,
    url,
    kind: sourceKind(name, type),
  };
}

function sourceKind(name: string, type: SearchType | "metrics"): SourceKind {
  const lower = name.toLowerCase();
  if (type === "papers" || lower.includes("nber") || lower.includes("stanford") || lower.includes("journal")) return "academica";
  if (type === "manuals" || type === "llm-news" || lower.includes("openai") || lower.includes("anthropic") || lower.includes("google")) return "oficial";
  if (lower.includes("mckinsey") || lower.includes("pwc") || lower.includes("deloitte") || lower.includes("bcg") || lower.includes("accenture")) return "consultora";
  if (lower.includes("oecd") || lower.includes("government") || lower.includes("gobierno")) return "gobierno";
  return "periodistica";
}

function impact(value: unknown): ImpactLevel {
  return value === "Alto" || value === "Bajo" ? value : "Medio";
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function arrayText(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry)).filter((entry) => entry.trim().length > 0);
}

function isRecord(value: unknown): value is RawItem {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDashboardDataset(value: unknown): value is DashboardDataset {
  return (
    isRecord(value) &&
    typeof value.updatedAt === "string" &&
    typeof value.nextUpdateCadence === "string" &&
    Array.isArray(value.metrics) &&
    Array.isArray(value.items) &&
    Array.isArray(value.models)
  );
}

function extractNumber(value: string): number {
  const match = value.replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function inferUnit(value: string): string {
  if (value.includes("%")) return "%";
  if (value.toLowerCase().includes("h")) return "horas";
  if (value.toLowerCase().includes("x")) return "x";
  return "";
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function persistRefresh(dataset: DashboardDataset, triggeredBy: string): Promise<PersistenceResult> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const errors: string[] = [];

  if (!supabaseUrl || !serviceRole) {
    return { persisted: false, errors: ["SUPABASE_SERVICE_ROLE_KEY no configurada"] };
  }

  const rows = dataset.items.map((item) => ({
    id: item.id,
    section: item.section,
    title: item.title,
    description: item.description,
    source_name: item.source.name,
    source_url: item.source.url,
    source_kind: item.source.kind,
    published_at: item.date,
    impact: item.impact,
    tags: item.tags,
    ai_readiness_angle: item.aiReadinessAngle,
    payload: item,
    status: "active",
    updated_at: dataset.updatedAt,
  }));

  const snapshotRow = {
    id: "latest",
    payload: dataset,
    source: "perplexity",
    status: "active",
    updated_at: dataset.updatedAt,
  };

  const snapshotResponse = await postRest(
    supabaseUrl,
    serviceRole,
    "dashboard_snapshots?on_conflict=id",
    [snapshotRow],
    "resolution=merge-duplicates",
  );

  if (snapshotResponse) errors.push(snapshotResponse);

  if (rows.length > 0) {
    const itemResponse = await postRest(
      supabaseUrl,
      serviceRole,
      "dashboard_items?on_conflict=id",
      rows,
      "resolution=merge-duplicates",
    );

    if (itemResponse) errors.push(itemResponse);
  }

  const runResponse = await postRest(supabaseUrl, serviceRole, "dashboard_refresh_runs", {
    status: errors.length === 0 ? "ok" : "partial",
    item_count: dataset.items.length,
    metric_count: dataset.metrics.length,
    data_snapshot: dataset,
    triggered_by: triggeredBy,
    error: errors.join("; ") || null,
    completed_at: dataset.updatedAt,
  });

  if (runResponse) errors.push(runResponse);

  return { persisted: errors.length === 0, errors };
}

async function postRest(
  supabaseUrl: string,
  serviceRole: string,
  path: string,
  body: unknown,
  prefer?: string,
): Promise<string | null> {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: JSON.stringify(body),
  }).catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown REST error";
    return new Response(message, { status: 500 });
  });

  if (response.ok) return null;

  const text = await response.text().catch(() => "");
  return `${path} ${response.status}: ${text.slice(0, 180)}`;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

const modelComparisons: ModelComparison[] = [
  {
    id: "openai-gpt-55",
    model: "GPT-5.5",
    provider: "OpenAI",
    bestFor: "Razonamiento complejo, coding y flujos con herramientas",
    pymeUseCase: "Diagnostico operativo, analisis de documentos y automatizacion de propuestas.",
    caution: "Reservar para tareas de alto valor por costo.",
    source: {
      name: "OpenAI - Models",
      url: "https://platform.openai.com/docs/models",
      kind: "oficial",
    },
    score: 96,
  },
  {
    id: "claude-opus-47",
    model: "Claude Opus 4.7",
    provider: "Anthropic",
    bestFor: "Trabajo largo, razonamiento y agentes de alta precision",
    pymeUseCase: "Revision de contratos, SOPs, politicas y documentos extensos.",
    caution: "Evaluar costos y region antes de escalar.",
    source: {
      name: "Anthropic - Claude models",
      url: "https://docs.anthropic.com/en/docs/about-claude/models/overview",
      kind: "oficial",
    },
    score: 94,
  },
  {
    id: "gemini-25-pro",
    model: "Gemini 2.5 Pro",
    provider: "Google",
    bestFor: "Razonamiento multimodal y ecosistema Google",
    pymeUseCase: "Flujos con Drive, documentos, reuniones, imagenes y soporte.",
    caution: "Revisar permisos de Workspace y privacidad.",
    source: {
      name: "Google - Gemini models",
      url: "https://ai.google.dev/gemini-api/docs/models",
      kind: "oficial",
    },
    score: 91,
  },
  {
    id: "perplexity-sonar-pro",
    model: "Sonar Pro",
    provider: "Perplexity",
    bestFor: "Investigacion web con fuentes recientes",
    pymeUseCase: "Monitoreo de noticias, competidores, regulacion y oportunidades.",
    caution: "Validar fuentes antes de publicar.",
    source: {
      name: "Perplexity - Sonar models",
      url: "https://docs.perplexity.ai/docs/sonar/models",
      kind: "oficial",
    },
    score: 89,
  },
];

function isSearchType(type: string): type is SearchType {
  return searchTypes.includes(type as SearchType);
}
