import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="rounded-2xl bg-white p-3 shadow-soft">
        <Inbox className="h-6 w-6 text-markarta-blue" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-markarta-navy">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
