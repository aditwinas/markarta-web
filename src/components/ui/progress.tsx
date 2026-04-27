import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-markarta-blue to-markarta-bright transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}
