import { ArrowRight, Clock, DollarSign, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fallbackDataset } from "@/data/dashboardContent";

const iconMap = [Clock, TrendingUp, DollarSign, Zap];

const EmbedCta = () => (
  <main className="min-h-screen bg-transparent p-4">
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-zinc-950 text-white shadow-2xl">
      <div className="relative p-6 sm:p-8">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(250,71,4,.3)_1px,transparent_1px),linear-gradient(0deg,rgba(34,211,238,.18)_1px,transparent_1px)] [background-size:48px_48px]" />
        <img
          src="/brand/menatech-pattern-orange.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[-7rem] top-4 hidden h-28 w-[32rem] object-contain opacity-10 mix-blend-screen md:block"
        />
        <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
              AI Readiness Signal
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
              Cuanto tiempo, costo y foco podria recuperar tu empresa con IA?
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Mira el dashboard completo de Menatech con metricas verificadas, noticias,
              modelos y fuentes para PYMEs de Puerto Rico, Chile y LatAm.
            </p>
            <Button asChild className="mt-5 bg-[#D93D03] hover:bg-[#B83300]">
              <a href="/dashboard_ia" target="_top">
                Ver dashboard completo <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fallbackDataset.metrics.slice(0, 4).map((metric, index) => {
              const Icon = iconMap[index] ?? Zap;
              return (
                <article key={metric.id} className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className="h-5 w-5 text-cyan-300" />
                    <span className="text-xs text-zinc-400">{metric.source.kind}</span>
                  </div>
                  <p className="text-sm text-zinc-300">{metric.label}</p>
                  <p className="mt-1 text-3xl font-black">{metric.value}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default EmbedCta;
