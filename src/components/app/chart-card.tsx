import { cn, formatCompactCurrency } from "@/lib/utils";
import type { RevenuePoint } from "@/types/markarta";

export function ChartCard({
  data,
  tone = "blue"
}: {
  data: RevenuePoint[];
  tone?: "blue" | "navy";
}) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
            <p className="mt-2 text-base font-semibold text-markarta-navy">{formatCompactCurrency(item.value)}</p>
          </div>
        ))}
      </div>
      <div className="flex h-52 items-end gap-3 rounded-2xl bg-slate-50 p-4">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
            <div
              className={cn(
                "w-full rounded-t-2xl bg-gradient-to-b transition-all",
                tone === "blue"
                  ? "from-markarta-bright to-markarta-blue"
                  : "from-markarta-blue to-markarta-navy",
              )}
              style={{ height: `${Math.max(16, (item.value / maxValue) * 100)}%` }}
            />
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
