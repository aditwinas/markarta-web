import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn, formatCompactCurrency } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  note,
  progress,
  trend
}: {
  label: string;
  value: string | number;
  note: string;
  progress?: number;
  trend?: number;
}) {
  const positiveTrend = typeof trend === "number" ? trend >= 0 : true;
  const trendLabel =
    typeof trend === "number" ? `${Math.abs(trend).toFixed(1).replace(".", ",")}%` : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-markarta-navy">
            {typeof value === "number" ? formatCompactCurrency(value) : value}
          </p>
        </div>
        {typeof trend === "number" ? (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
              positiveTrend ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
            )}
          >
            {positiveTrend ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trendLabel}
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-slate-500">{note}</p>
      {typeof progress === "number" ? (
        <div className="mt-4 space-y-2">
          <Progress value={progress} />
          <p className="text-xs font-medium text-slate-500">{progress}% toward target</p>
        </div>
      ) : null}
    </div>
  );
}
