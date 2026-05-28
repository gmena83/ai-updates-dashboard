import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  DatabaseZap,
  ExternalLink,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { fallbackDataset, getItemsBySection, sectionDefinitions } from "@/data/dashboardContent";
import { perplexityService } from "@/services/perplexityService";
import LeadCaptureForm from "@/components/dashboard/LeadCaptureForm";
import SourcePill from "@/components/dashboard/SourcePill";
import type { DashboardDataset, DashboardSectionId } from "@/types/dashboard";

const formatter = new Intl.DateTimeFormat("es-PR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const accentClasses: Record<string, string> = {
  orange: "border-orange-500/25 bg-orange-500/10 text-orange-950 dark:text-orange-50",
  cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-950 dark:text-cyan-50",
  green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-950 dark:text-emerald-50",
  purple: "border-purple-500/25 bg-purple-500/10 text-purple-950 dark:text-purple-50",
};

const DashboardHome = () => {
  const [dataset, setDataset] = useState<DashboardDataset>(() => {
    const cached = window.localStorage.getItem("menatech-dashboard-cache");
    if (!cached) return fallbackDataset;

    try {
      return JSON.parse(cached) as DashboardDataset;
    } catch {
      return fallbackDataset;
    }
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const syncLatestDataset = useCallback(
    async (showToast = false) => {
      setIsRefreshing(true);
      const result = await perplexityService.getDashboardDataset();
      setIsRefreshing(false);

      if (!result) {
        if (showToast) {
          toast({
            title: "No se pudo sincronizar",
            description:
              "El dashboard sigue usando el snapshot local. Revisa Supabase Edge Functions y dashboard_snapshots.",
            variant: "destructive",
          });
        }
        return;
      }

      window.localStorage.setItem("menatech-dashboard-cache", JSON.stringify(result));
      setDataset(result);

      if (showToast) {
        toast({
          title: "Dashboard sincronizado",
          description: "Se cargo el ultimo snapshot publicado del backend.",
        });
      }
    },
    [toast],
  );

  useEffect(() => {
    void syncLatestDataset(false);
  }, [syncLatestDataset]);

  const chartData = useMemo(
    () =>
      dataset.metrics.map((metric) => ({
        name: metric.label.replace(" por semana", ""),
        value: metric.chartValue,
        unit: metric.unit,
      })),
    [dataset.metrics],
  );

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-600 text-sm font-black text-white shadow-sm"
            >
              MT
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                Menatech
              </p>
              <h1 className="text-base font-bold sm:text-lg">AI Impact Dashboard</h1>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden border-zinc-300 bg-white/70 sm:inline-flex dark:border-white/10 dark:bg-white/10"
              asChild
            >
              <a href="/admin">Admin</a>
            </Button>
            <Button
              onClick={() => void syncLatestDataset(true)}
              disabled={isRefreshing}
              className="h-10 w-10 bg-orange-600 p-0 text-white hover:bg-orange-500 sm:w-auto sm:px-4"
              aria-label="Sincronizar dashboard"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Sincronizar</span>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/50 bg-zinc-950 text-white dark:border-white/10">
        <div className="absolute inset-0 [background-image:linear-gradient(90deg,rgba(250,71,4,.18)_1px,transparent_1px),linear-gradient(0deg,rgba(34,211,238,.14)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f7f8fb] to-transparent dark:from-zinc-950" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:overflow-visible lg:pt-24">
          <div className="min-w-0 max-w-sm sm:max-w-none">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Tecnologia aplicada, no complicada
            </div>
            <h2 className="w-full max-w-sm text-4xl font-black leading-[1.02] sm:max-w-full sm:text-6xl lg:max-w-4xl">
              Senales de IA para PYMEs que quieren avanzar sin perder claridad.
            </h2>
            <p className="mt-6 w-full max-w-xs text-base leading-7 text-zinc-300 sm:max-w-full sm:text-lg lg:max-w-2xl">
              Noticias, metricas, papers y modelos traducidos a impacto operativo:
              tiempo ahorrado, costos, productividad y decisiones concretas para tu negocio.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-orange-600 text-white hover:bg-orange-500">
                <a href="#lead-form">
                  Recibir reporte PDF <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <a href="https://menatech.cloud" target="_blank" rel="noreferrer">
                  Evaluacion AI Readiness <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid min-w-0 max-w-sm content-start gap-4 sm:max-w-none">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-300">Ultima actualizacion</p>
                  <p className="font-semibold">{formatter.format(new Date(dataset.updatedAt))}</p>
                </div>
                <CalendarClock className="h-8 w-8 text-orange-300" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {dataset.metrics.slice(0, 4).map((metric) => (
                  <div key={metric.id} className="rounded-xl border border-white/10 bg-zinc-950/35 p-4">
                    <p className="text-xs text-zinc-400">{metric.label}</p>
                    <p className="mt-1 text-2xl font-black text-white">{metric.value}</p>
                    <p className="mt-1 text-xs text-zinc-300">{metric.change}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-300">
                <DatabaseZap className="h-4 w-4 text-cyan-300" />
                {dataset.nextUpdateCadence}
              </div>
              <Progress value={72} className="h-2 bg-white/10" />
              <p className="mt-3 break-words text-sm text-zinc-300">
                La version de produccion queda lista para refresco semanal via Supabase Cron y revision editorial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-7xl px-4 pb-16 sm:px-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dataset.metrics.map((metric) => (
            <article
              key={metric.id}
              className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-xl shadow-zinc-200/70 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{metric.label}</p>
                  <p className="mt-1 text-3xl font-black">{metric.value}</p>
                </div>
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <p className="min-h-20 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {metric.description}
              </p>
              <p className="mt-4 rounded-xl bg-zinc-100 p-3 text-sm leading-5 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {metric.businessUse}
              </p>
              <div className="mt-4">
                <SourcePill source={metric.source} />
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <div className="mb-5 flex items-center gap-3">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="text-xl font-bold">Metricas que abren conversacion</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Priorizadas para dueños, gerentes y founders con poco tiempo.
                </p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -18, right: 16, top: 10, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,.25)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={64} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, _name, item) => [`${value} ${item.payload.unit}`, "Valor"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,.08)" }}
                  />
                  <Bar dataKey="value" fill="#FA4704" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <div className="mb-5 flex items-center gap-3">
              <BrainCircuitIcon />
              <div>
                <h3 className="text-xl font-bold">Comparador de modelos para PYMEs</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Que elegir segun caso de uso, no por moda.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {dataset.models.map((model) => (
                <article
                  key={model.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-orange-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-950/60"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-zinc-500">{model.provider}</p>
                      <h4 className="text-lg font-bold">{model.model}</h4>
                    </div>
                    <div className="min-w-28">
                      <div className="mb-1 flex justify-between text-xs text-zinc-500">
                        <span>Fit PYME</span>
                        <span>{model.score}</span>
                      </div>
                      <Progress value={model.score} className="h-2" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium">{model.bestFor}</p>
                  <p className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                    {model.pymeUseCase}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">{model.caution}</p>
                  <div className="mt-3">
                    <SourcePill source={model.source} compact />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sectionDefinitions.map((section) => (
            <SectionPanel
              key={section.id}
              sectionId={section.id}
              dataset={dataset}
            />
          ))}
        </section>

        <div id="lead-form" className="mt-10">
          <LeadCaptureForm dataset={dataset} />
        </div>
      </div>
    </main>
  );
};

interface SectionPanelProps {
  sectionId: DashboardSectionId;
  dataset: DashboardDataset;
}

const SectionPanel = ({ sectionId, dataset }: SectionPanelProps) => {
  const section = sectionDefinitions.find((definition) => definition.id === sectionId);
  const items = getItemsBySection(sectionId, dataset);

  if (!section) return null;

  const Icon = section.icon;

  return (
    <article className="group rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className={`mb-3 inline-flex rounded-xl border p-2 ${accentClasses[section.accent]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">{section.title}</h3>
        </div>
        <CheckCircle2 className="h-5 w-5 text-emerald-500 opacity-80" />
      </div>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{section.description}</p>
      <p className="mt-3 rounded-xl bg-zinc-100 p-3 text-xs leading-5 text-zinc-600 opacity-0 transition group-hover:opacity-100 dark:bg-white/10 dark:text-zinc-300">
        {section.hoverHint}
      </p>
      <div className="mt-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">Pendiente de la proxima actualizacion semanal.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="border-t border-zinc-200 pt-4 dark:border-white/10">
              <div className="mb-2 flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
              <h4 className="text-sm font-bold leading-5">{item.title}</h4>
              <p className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                {item.description}
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                AI Readiness: {item.aiReadinessAngle}
              </p>
              <div className="mt-3">
                <SourcePill source={item.source} compact />
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

const BrainCircuitIcon = () => (
  <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-2 text-purple-600 dark:text-purple-200">
    <Sparkles className="h-5 w-5" />
  </div>
);

export default DashboardHome;
