"use client";

import { CalendarDays, Filter, Link2 } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { getBrandById, getCalendarItems, brands } from "@/lib/mock-data";

const platforms = ["all", "Instagram", "TikTok", "X"];

export function CalendarPageClient({ selectedBrand }: { selectedBrand: string }) {
  const [brandFilter, setBrandFilter] = useState(selectedBrand);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [view, setView] = useState<"mingguan" | "bulanan">("mingguan");

  const items = useMemo(() => getCalendarItems(brandFilter, platformFilter), [brandFilter, platformFilter]);
  const activeBrand = brandFilter === "all" ? null : getBrandById(brandFilter);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content Calendar"
        title="Planning dan eksekusi konten lintas platform"
        description="Kalender ini membantu Content Creator dan Manager menjaga ritme publish, status produksi, dan link post agar KPI bulanan tetap aman."
      />

      <SectionCard title="Filter Calendar" description="Ubah tampilan untuk melihat satu brand atau seluruh brand.">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_auto]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Brand</span>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none ring-0 focus:border-markarta-blue"
              value={brandFilter}
              onChange={(event) => setBrandFilter(event.target.value)}
            >
              <option value="all">Semua Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Platform</span>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none ring-0 focus:border-markarta-blue"
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform === "all" ? "Semua Platform" : platform}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Tampilan</span>
            <div className="flex gap-2">
              <Button variant={view === "mingguan" ? "default" : "outline"} onClick={() => setView("mingguan")}>
                Mingguan
              </Button>
              <Button variant={view === "bulanan" ? "default" : "outline"} onClick={() => setView("bulanan")}>
                Bulanan
              </Button>
            </div>
          </div>
          <div className="flex items-end">
            <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-markarta-blue">
              <Filter className="h-4 w-4" />
              {activeBrand ? activeBrand.shortName : "Seluruh brand"}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard
          title={`View ${view === "mingguan" ? "Mingguan" : "Bulanan"}`}
          description="Blok ini menampilkan planning konten dengan status yang mudah dipindai."
        >
          {items.length === 0 ? (
            <EmptyState
              title="Belum ada item untuk filter ini"
              description="Coba ganti brand atau platform untuk melihat jadwal konten lainnya."
            />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-slate-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.weekLabel}</p>
                      <h3 className="mt-2 text-lg font-semibold text-markarta-navy">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {getBrandById(item.brandId).name} • {item.platform} • {item.date}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <CalendarDays className="h-4 w-4" />
                      PIC {item.owner}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <Link2 className="h-4 w-4" />
                      Link post akan tercatat setelah publish
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Ringkasan Eksekusi" description="Snapshot cepat untuk melihat beban kerja tim content.">
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Item Aktif</p>
              <p className="mt-2 text-3xl font-semibold text-markarta-navy">{items.length}</p>
              <p className="mt-2 text-sm text-slate-500">Terdiri dari planning, produksi, dan published.</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">Sudah Published</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-700">
                {items.filter((item) => item.status === "published").length}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-sm text-amber-700">Butuh Produksi</p>
              <p className="mt-2 text-3xl font-semibold text-amber-700">
                {items.filter((item) => item.status === "produksi").length}
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm text-markarta-blue">Planning Baru</p>
              <p className="mt-2 text-3xl font-semibold text-markarta-navy">
                {items.filter((item) => item.status === "planning").length}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
