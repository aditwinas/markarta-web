import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white p-6 shadow-panel sm:p-8">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-50 to-transparent" />
      <div className="relative space-y-3">
        <Badge className="w-fit bg-blue-50 text-markarta-blue">{eyebrow}</Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-markarta-navy">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
        </div>
      </div>
    </div>
  );
}
