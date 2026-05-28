import { ExternalLink } from "lucide-react";
import type { SourceRef } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface SourcePillProps {
  source: SourceRef;
  compact?: boolean;
  className?: string;
}

const kindClasses: Record<SourceRef["kind"], string> = {
  oficial: "border-orange-500/30 bg-orange-500/10 text-orange-900 dark:text-orange-100",
  academica: "border-purple-500/30 bg-purple-500/10 text-purple-900 dark:text-purple-100",
  consultora: "border-cyan-500/30 bg-cyan-500/10 text-cyan-900 dark:text-cyan-100",
  periodistica: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  gobierno: "border-slate-500/30 bg-slate-500/10 text-slate-900 dark:text-slate-100",
};

const SourcePill = ({ source, compact = false, className }: SourcePillProps) => (
  <a
    href={source.url}
    target="_blank"
    rel="noreferrer"
    className={cn(
      "inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:-translate-y-0.5 hover:shadow-sm",
      kindClasses[source.kind],
      compact && "px-2 py-0.5 text-[11px]",
      className,
    )}
    title={source.url}
  >
    <span className="truncate">{source.name}</span>
    <ExternalLink className="h-3 w-3 shrink-0" />
  </a>
);

export default SourcePill;
