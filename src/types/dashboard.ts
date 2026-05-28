import type { LucideIcon } from "lucide-react";

export type DashboardSectionId =
  | "news"
  | "metrics"
  | "reports"
  | "papers"
  | "llmNews"
  | "manuals";

export type ImpactLevel = "Alto" | "Medio" | "Bajo";

export interface SourceRef {
  name: string;
  url: string;
  kind: "oficial" | "academica" | "consultora" | "periodistica" | "gobierno";
}

export interface ContentItem {
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

export interface MetricInsight {
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

export interface ModelComparison {
  id: string;
  model: string;
  provider: string;
  bestFor: string;
  pymeUseCase: string;
  caution: string;
  source: SourceRef;
  score: number;
}

export interface SectionDefinition {
  id: DashboardSectionId;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  hoverHint: string;
}

export interface DashboardDataset {
  updatedAt: string;
  nextUpdateCadence: string;
  metrics: MetricInsight[];
  items: ContentItem[];
  models: ModelComparison[];
}

export interface LeadRequestPayload {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  consent: boolean;
  snapshot: {
    updatedAt: string;
    selectedMetrics: MetricInsight[];
    selectedModels: ModelComparison[];
  };
}
