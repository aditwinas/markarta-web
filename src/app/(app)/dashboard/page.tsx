"use client";

import { ArrowDownRight, ArrowUpRight, BellRing, CalendarRange, DatabaseZap, Mail, Store } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { AppShell } from "@/components/app/app-shell";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { normalizeBrand, normalizeRole } from "@/lib/demo-session";
import { brands } from "@/lib/mock-data";
import { buildDemoHref } from "@/lib/navigation";
import { brandReports, portfolioSummary, reportBasis } from "@/lib/pos-report-data";
import { cn } from "@/lib/utils";

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const role = normalizeRole(searchParams.get("role") ?? undefined);
  const brandId = normalizeBrand(searchParams.get("brand") ?? undefined);
  const selectedBrand = brandReports.find((item) => item.id === brandId)?.id ?? brandReports[0].id;
  const liveBrandCount = brandReports.filter((item) => item.state === "live").length;
  const fallbackBrandCount = brandReports.filter((item) => item.state === "fallback").length;
  const placeholderBrandCount = brandReports.filter((item) => item.state === "placeholder").length;

  return (
    <AppShell role={role} brand={selectedBrand} pathname="/dashboard">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Morning Report Center"
          title="Dashboard multi-brand yang siap dibuka dari desktop maupun mobile"
          description="Semua brand penting Markarta dirangkum dalam format report yang sama: omset MTD, progres harian, progres bulanan, dan produk atau unit teratas. Tunas Mekar Dental serta Balcos Compound tetap tampil sebagai placeholder sampai source datanya siap."
        />

        <SectionCard
          title={reportBasis.label}
          description="Dashboard ini hanya memakai hari yang sudah tertutup penuh agar perbandingan daily dan monthly tetap apples-to-apples."
          action={<CalendarRange className="h-5 w-5 text-markarta-blue" />}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <BasisCard label="Monthly MTD" value={reportBasis.monthlyCurrent} note={`Pembanding: ${reportBasis.monthlyPrevious}`} />
            <BasisCard label="Daily" value={reportBasis.dailyCurrent} note={`Pembanding: ${reportBasis.dailyPrevious}`} />
            <BasisCard
              label="Source Status"
              value={`${liveBrandCount} live / ${fallbackBrandCount} fallback`}
              note={`${placeholderBrandCount} placeholder tetap ditampilkan di dashboard.`}
            />
            <BasisCard label="Last Refresh" value={reportBasis.updatedAt} note="Refresh otomatis dini hari sebelum dashboard pagi dibuka." />
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-4">
          <MetricCard
            label="Omset MTD Aktif"
            value={portfolioSummary.monthlyRevenue}
            note="Total 4 brand dengan data live"
            trend={portfolioSummary.monthlyChangePct ?? undefined}
          />
          <MetricCard
            label="Omset Harian Aktif"
            value={portfolioSummary.dailyRevenue}
            note={`${reportBasis.dailyCurrent} vs ${reportBasis.dailyPrevious}`}
            trend={portfolioSummary.dailyChangePct ?? undefined}
          />
          <MetricCard
            label="Brand Live"
            value={liveBrandCount}
            note="Source yang berhasil direfresh pada run ini"
          />
          <MetricCard
            label="Brand Stale/Placeholder"
            value={fallbackBrandCount + placeholderBrandCount}
            note="Gabungan fallback source dan slot placeholder"
          />
        </div>

        <SectionCard
          title="Navigasi brand"
          description="Pilih brand untuk lompat cepat ke section detail di bawah."
          action={<Store className="h-5 w-5 text-markarta-blue" />}
        >
          <div className="flex flex-wrap gap-3">
            {brands.map((item) => {
              const selected = item.id === selectedBrand;
              const report = brandReports.find((entry) => entry.id === item.id);
              const href = `${buildDemoHref("/dashboard", role, { brand: item.id })}#${item.id}`;

              return (
                <Link key={item.id} href={href}>
                  <Button variant={selected ? "default" : "outline"} className="justify-start">
                    {item.shortName}
                    {report?.state === "placeholder" ? <span className="ml-2 text-xs opacity-80">pending</span> : null}
                    {report?.state === "fallback" ? <span className="ml-2 text-xs opacity-80">stale</span> : null}
                  </Button>
                </Link>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          {brandReports.map((brand) => (
            <section
              id={brand.id}
              key={brand.id}
              className={cn(
                "scroll-mt-28 rounded-[28px] border bg-white p-5 shadow-panel sm:p-6",
                brand.id === selectedBrand ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200",
              )}
            >
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-markarta-navy">{brand.name}</h2>
                    <StatusBadge status={brand.state === "live" ? "green" : "yellow"}>
                      {brand.state === "live" ? "Live" : brand.state === "fallback" ? "Fallback" : "Pending"}
                    </StatusBadge>
                    <Badge variant="secondary">{brand.source}</Badge>
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-slate-600">{brand.note}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <DatabaseZap className="h-4 w-4 text-markarta-blue" />
                  <span>
                    {brand.state === "live"
                      ? "Siap dipakai untuk review pagi"
                      : brand.state === "fallback"
                        ? "Menampilkan snapshot terakhir valid sambil menunggu source pulih"
                        : "Tetap tampil untuk menjaga slot dashboard"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                {brand.summaryCards.map((card) => (
                  <div key={card.label} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <p className="mt-3 text-2xl font-semibold text-markarta-navy">{card.value}</p>
                      </div>
                      {typeof card.changePct === "number" ? (
                        <TrendPill value={card.changePct} />
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-500">{card.note}</p>
                  </div>
                ))}
              </div>

              {brand.table ? (
                <div className="mt-6">
                  <SectionCard title={brand.table.title} description={brand.table.description}>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-separate border-spacing-y-3">
                        <thead>
                          <tr>
                            {brand.table.columns.map((column) => (
                              <th
                                key={column.key}
                                className={cn(
                                  "px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400",
                                  column.align === "right" ? "text-right" : "text-left",
                                )}
                              >
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {brand.table.rows.map((row, index) => (
                            <tr key={`${brand.id}-${index}`} className="rounded-2xl bg-slate-50">
                              {brand.table?.columns.map((column) => (
                                <td
                                  key={column.key}
                                  className={cn(
                                    "border-y border-slate-100 px-4 py-4 text-sm text-slate-600 first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r",
                                    column.align === "right" ? "text-right" : "text-left",
                                    column.key === brand.table?.columns[0]?.key && "font-medium text-markarta-navy",
                                  )}
                                >
                                  {row[column.key]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>
              ) : null}

              {brand.rankings?.length ? (
                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  {brand.rankings.map((block) => (
                    <SectionCard key={block.title} title={block.title} description={block.description}>
                      <div className="space-y-3">
                        {block.items.map((item, index) => (
                          <div key={`${block.title}-${item.name}`} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">#{index + 1}</p>
                              <p className="mt-1 font-semibold text-markarta-navy">{item.name}</p>
                              {item.detail ? <p className="text-sm text-slate-500">{item.detail}</p> : null}
                            </div>
                            <p className="text-sm font-semibold text-markarta-blue">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  ))}
                </div>
              ) : null}

              {brand.notes?.length ? (
                <div className="mt-6 rounded-3xl bg-markarta-mist p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-markarta-blue">Catatan data</p>
                  <div className="mt-4 space-y-3">
                    {brand.notes.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                        <span className="mt-2 h-2 w-2 rounded-full bg-markarta-blue" />
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <SectionCard
          title="Automation aktif"
          description="Dashboard ini sekarang disiapkan untuk refresh dini hari, lalu dipakai lagi sebagai basis email pagi."
          action={<BellRing className="h-5 w-5 text-markarta-blue" />}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <AutomationCard
              icon={<DatabaseZap className="h-5 w-5 text-markarta-blue" />}
              title="03.00 refresh website"
              note="Tarik data POS, bangun ulang static site, lalu deploy ke domain utama Netlify."
            />
            <AutomationCard
              icon={<Mail className="h-5 w-5 text-markarta-blue" />}
              title="07.00 daily email"
              note="Kirim ringkasan ke Gmail dengan snapshot yang sudah direfresh dini hari."
            />
            <AutomationCard
              icon={<CalendarRange className="h-5 w-5 text-markarta-blue" />}
              title="Tunas & Balcos tetap tampil"
              note="Selama source belum aktif, dashboard dan email akan menandai keduanya sebagai placeholder."
            />
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <DashboardPageContent />
    </Suspense>
  );
}

function BasisCard({
  label,
  value,
  note
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-xl font-semibold text-markarta-navy">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{note}</p>
    </div>
  );
}

function TrendPill({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
      )}
    >
      {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {Math.abs(value).toFixed(1).replace(".", ",")}%
    </div>
  );
}

function AutomationCard({
  icon,
  title,
  note
}: {
  icon: ReactNode;
  title: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="flex items-center gap-3">
        {icon}
        <p className="font-semibold text-markarta-navy">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>
    </div>
  );
}
