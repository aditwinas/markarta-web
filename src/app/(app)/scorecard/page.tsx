"use client";

import Link from "next/link";
import { ArrowRight, Building2, LineChart, SmilePlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AppShell } from "@/components/app/app-shell";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { normalizeBrand, normalizeRole } from "@/lib/demo-session";
import { getScorecardView, teamHighlights } from "@/lib/mock-data";
import { buildDemoHref } from "@/lib/navigation";
import { formatCompactCurrency, formatPercent } from "@/lib/utils";

function ScorecardPageContent() {
  const searchParams = useSearchParams();
  const role = normalizeRole(searchParams.get("role") ?? undefined);
  const brand = normalizeBrand(searchParams.get("brand") ?? undefined);

  return (
    <AppShell role={role} brand={brand} pathname="/scorecard">
      <div className="space-y-8">
      <PageHeader
        eyebrow="Brand Scorecard"
        title="Ringkasan performa 6 brand dalam satu layar"
        description="Direktur dan Marketing Manager dapat memantau progress omset, skor digital, aktivasi berjalan, dan sentimen harian tanpa berpindah dashboard."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {teamHighlights.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} note={item.note} />
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        {getScorecardView().map(({ brand, metric }) => (
          <div key={brand.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-markarta-navy">{brand.name}</h2>
                  <StatusBadge status={metric.status}>
                    {metric.status === "green" ? "On Track" : metric.status === "yellow" ? "Waspada" : "Butuh Aksi"}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-sm text-slate-500">Sumber omset: {brand.source}</p>
              </div>

              <Link href={buildDemoHref("/dashboard", role, { brand: brand.id })}>
                <Button variant="outline">
                  Lihat Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Omset</p>
                <p className="mt-3 text-xl font-semibold text-markarta-navy">{formatCompactCurrency(metric.omzet)}</p>
                <p className="mt-2 text-sm text-slate-500">{formatPercent(metric.progress)} dari target</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Digital Score</p>
                <p className="mt-3 text-xl font-semibold text-markarta-navy">{metric.digitalScore}/100</p>
                <p className="mt-2 text-sm text-slate-500">Kombinasi konten, ads, dan respons</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Aktivasi</p>
                <p className="mt-3 text-xl font-semibold text-markarta-navy">{metric.activationCount} aktif</p>
                <p className="mt-2 text-sm text-slate-500">Program berjalan bulan ini</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Sentimen</p>
                <p className="mt-3 text-xl font-semibold text-markarta-navy">{metric.sentimentScore}/100</p>
                <p className="mt-2 text-sm text-slate-500">Pantauan Mention & review</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <SectionCard
        title="Radar Pagi Hari"
        description="Area ini membantu pimpinan memprioritaskan brand yang harus diperhatikan lebih dulu."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <p className="font-semibold text-emerald-800">Brand On Track</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-emerald-700">
              Sebelas Coffee dan Snap O&apos; Snap sudah melewati 90% target bulan ini.
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-5">
            <div className="flex items-center gap-3">
              <LineChart className="h-5 w-5 text-amber-600" />
              <p className="font-semibold text-amber-800">Perlu Dorongan Digital</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-amber-700">
              Zona Massage dan Tunas Mekar Dental menunjukkan momentum positif tetapi belum aman terhadap target.
            </p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-5">
            <div className="flex items-center gap-3">
              <SmilePlus className="h-5 w-5 text-rose-600" />
              <p className="font-semibold text-rose-800">Aksi Cepat Dibutuhkan</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-rose-700">
              Snapobox dan Balcos membutuhkan kampanye, follow-up sentimen, dan optimasi funnel segera.
            </p>
          </div>
        </div>
      </SectionCard>
      </div>
    </AppShell>
  );
}

export default function ScorecardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <ScorecardPageContent />
    </Suspense>
  );
}
