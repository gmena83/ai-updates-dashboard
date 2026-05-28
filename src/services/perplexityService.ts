import { supabase } from "@/integrations/supabase/client";
import { fallbackDataset } from "@/data/dashboardContent";
import type { DashboardDataset, ImpactLevel } from "@/types/dashboard";

export interface PerplexitySearchParams {
  query?: string;
  type: "news" | "llm-news" | "papers" | "manuals" | "metrics" | "success-cases" | "recommended-tools" | "reports";
  maxResults?: number;
}

export interface NewsItem {
  id?: number;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
  impact: ImpactLevel;
}

export interface LLMNewsItem extends NewsItem {
  llm: string;
}

export interface PaperItem {
  id?: number;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  citations: number;
  relevance: ImpactLevel;
  url: string;
}

export interface ReportItem {
  id?: number;
  title: string;
  description: string;
  company: string;
  pages: number;
  date: string;
  url: string;
  type: string;
}

export type ManualItem = ReportItem;

export interface MetricItem {
  id?: number;
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  source?: string;
  url?: string;
}

export interface SuccessCaseItem {
  id?: number;
  title: string;
  company: string;
  description: string;
  industry: string;
  country: string;
  aiTechnology: string;
  results: string;
  date: string;
  url: string;
}

export interface RecommendedToolItem {
  id?: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  features: string[];
  website: string;
  popularity: "Trending" | "Stable" | "New";
  date: string;
}

type RawItem = Record<string, unknown>;

interface EdgeResponse {
  success?: boolean;
  error?: string;
  data?: unknown;
}

const isRecord = (value: unknown): value is RawItem =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stringValue = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const numberValue = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const impactValue = (value: unknown, fallback: ImpactLevel = "Medio"): ImpactLevel =>
  value === "Alto" || value === "Medio" || value === "Bajo" ? value : fallback;

const itemArray = (value: unknown): RawItem[] =>
  Array.isArray(value) ? value.filter(isRecord) : [];

const isDashboardDataset = (value: unknown): value is DashboardDataset =>
  isRecord(value) &&
  typeof value.updatedAt === "string" &&
  Array.isArray(value.metrics) &&
  Array.isArray(value.items) &&
  Array.isArray(value.models);

class PerplexityService {
  async getDashboardDataset(): Promise<DashboardDataset | null> {
    try {
      const { data, error } = await supabase.functions.invoke("perplexity-search", {
        body: { action: "latest" },
      });

      if (error) return null;

      const response = data as EdgeResponse;
      if (response?.success === false) return null;

      if (isDashboardDataset(response?.data)) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async refreshDashboardDataset(): Promise<DashboardDataset | null> {
    try {
      const { data, error } = await supabase.functions.invoke("perplexity-search", {
        body: { action: "refresh", maxResults: 6 },
      });

      if (error) return null;

      const response = data as EdgeResponse;
      if (response?.success === false) return null;

      if (isDashboardDataset(response?.data)) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  private async callEdgeFunction(params: PerplexitySearchParams): Promise<RawItem[]> {
    try {
      const { data, error } = await supabase.functions.invoke("perplexity-search", {
        body: params,
      });

      if (error) return [];
      if (Array.isArray(data)) return itemArray(data);

      const response = data as EdgeResponse;
      if (response?.success === false) return [];

      return itemArray(response?.data);
    } catch {
      return [];
    }
  }

  async searchNews(query = "IA PyMEs startups"): Promise<NewsItem[]> {
    const data = await this.callEdgeFunction({ type: "news", query, maxResults: 4 });
    return data.map((item, index) => ({
      id: index + 1,
      title: stringValue(item.title, "Noticia sobre IA"),
      description: stringValue(item.description, "Sin descripcion disponible"),
      source: stringValue(item.source, "Fuente desconocida"),
      date: stringValue(item.date, new Date().toISOString().slice(0, 10)),
      url: stringValue(item.url, "#"),
      impact: impactValue(item.impact),
    }));
  }

  async searchLLMNews(query = "ChatGPT Claude Gemini actualizaciones oficiales"): Promise<LLMNewsItem[]> {
    const data = await this.callEdgeFunction({ type: "llm-news", query, maxResults: 4 });
    return data.map((item, index) => ({
      id: index + 1,
      title: stringValue(item.title, "Actualizacion LLM"),
      description: stringValue(item.description, "Sin descripcion disponible"),
      source: stringValue(item.source, "Fuente desconocida"),
      date: stringValue(item.date, new Date().toISOString().slice(0, 10)),
      url: stringValue(item.url, "#"),
      impact: impactValue(item.impact),
      llm: stringValue(item.llm, "General"),
    }));
  }

  async searchPapers(query = "AI adoption SMEs peer reviewed research"): Promise<PaperItem[]> {
    const data = await this.callEdgeFunction({ type: "papers", query, maxResults: 4 });
    return data.map((item, index) => ({
      id: index + 1,
      title: stringValue(item.title, "Paper academico"),
      authors: Array.isArray(item.authors) ? item.authors.map((author) => String(author)) : ["Autor desconocido"],
      journal: stringValue(item.journal, "Journal desconocido"),
      year: stringValue(item.year, "2026"),
      citations: numberValue(item.citations, 0),
      relevance: impactValue(item.relevance),
      url: stringValue(item.url, "#"),
    }));
  }

  async searchReports(query = "McKinsey Deloitte PwC BCG IA PyMEs reportes"): Promise<ReportItem[]> {
    const data = await this.callEdgeFunction({ type: "reports", query, maxResults: 4 });
    return data.map((item, index) => ({
      id: index + 1,
      title: stringValue(item.title, "Reporte sobre IA"),
      description: stringValue(item.description, "Sin descripcion disponible"),
      company: stringValue(item.company ?? item.source, "Consultora"),
      pages: numberValue(item.pages, 0),
      date: stringValue(item.date, new Date().toISOString().slice(0, 10)),
      url: stringValue(item.url, "#"),
      type: stringValue(item.type, "Reporte"),
    }));
  }

  async searchManuals(query = "OpenAI Anthropic Google official AI documentation"): Promise<ManualItem[]> {
    const data = await this.callEdgeFunction({ type: "manuals", query, maxResults: 4 });
    return data.map((item, index) => ({
      id: index + 1,
      title: stringValue(item.title, "Manual oficial"),
      description: stringValue(item.description, "Sin descripcion disponible"),
      company: stringValue(item.company ?? item.source, "Empresa"),
      pages: numberValue(item.pages, 0),
      date: stringValue(item.date, new Date().toISOString().slice(0, 10)),
      url: stringValue(item.url, "#"),
      type: stringValue(item.type, "Documentacion"),
    }));
  }

  async searchMetrics(query = "AI adoption productivity cost savings SMEs statistics"): Promise<MetricItem[]> {
    const data = await this.callEdgeFunction({ type: "metrics", query, maxResults: 4 });
    if (data.length === 0) {
      return fallbackDataset.metrics.map((metric, index) => ({
        id: index + 1,
        name: metric.label,
        value: metric.value,
        change: metric.change,
        trend: metric.trend === "down" ? "down" : "up",
        description: metric.description,
        source: metric.source.name,
        url: metric.source.url,
      }));
    }

    return data.map((item, index) => ({
      id: index + 1,
      name: stringValue(item.name, "Metrica de IA"),
      value: stringValue(item.value, "N/A"),
      change: stringValue(item.change, "Sin cambio"),
      trend: item.trend === "down" ? "down" : "up",
      description: stringValue(item.description, "Sin descripcion disponible"),
      source: stringValue(item.source, "Fuente desconocida"),
      url: stringValue(item.url, "#"),
    }));
  }

  async searchSuccessCases(): Promise<SuccessCaseItem[]> {
    return [];
  }

  async searchRecommendedTools(): Promise<RecommendedToolItem[]> {
    return [];
  }
}

export const perplexityService = new PerplexityService();
