"use client";

import { FileText, Flag, Link2, Save, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getBrandById, getWorksheetEntries, brands } from "@/lib/mock-data";
import type { UserRole } from "@/types/markarta";

export function WorksheetPageClient({
  role,
  brandId
}: {
  role: UserRole;
  brandId: string;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const entries = useMemo(() => getWorksheetEntries(role, brandId), [brandId, role]);
  const brand = getBrandById(brandId);

  const roleConfig = {
    content_creator: {
      title: "Worksheet Content Creator",
      description: "Input planning konten, link post setelah publish, dan weekly report brand.",
      icon: FileText,
      fields: ["Judul konten", "Platform", "Link post / insight mingguan"]
    },
    kol: {
      title: "Worksheet KOL & Community",
      description: "Catat sourcing, update progress project, dan evaluasi impact KOL.",
      icon: Users,
      fields: ["Nama KOL", "Platform / followers", "Status project dan catatan impact"]
    },
    activation: {
      title: "Worksheet Aktivasi & Sales",
      description: "Input event baru, progres aktivasi, dan hasil revenue lapangan.",
      icon: Flag,
      fields: ["Nama aktivasi", "Tanggal / lokasi", "Hasil event dan kebutuhan follow-up"]
    },
    manager: {
      title: "Worksheet Marketing Manager",
      description: "Ringkasan approval, review lintas divisi, dan catatan eksekusi mingguan.",
      icon: FileText,
      fields: ["Topik review", "PIC / divisi", "Catatan keputusan dan action item"]
    },
    direktur: {
      title: "Worksheet Direktur",
      description: "Mode direktur meninjau worksheet sebagai referensi cepat lintas brand.",
      icon: FileText,
      fields: ["Ringkasan", "Brand / PIC", "Arah strategis"]
    }
  }[role];

  const Icon = roleConfig.icon;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Worksheet" title={roleConfig.title} description={roleConfig.description} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Input Panel" description={`Brand aktif: ${brand.name}`}>
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-markarta-blue">
              <Icon className="h-4 w-4" />
              Frontend-only form untuk demo MVP
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">{roleConfig.fields[0]}</span>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={roleConfig.fields[0]} />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">{roleConfig.fields[1]}</span>
              <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-markarta-blue">
                <option>{brand.name}</option>
                {brands.filter((item) => item.id !== brand.id).map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">{roleConfig.fields[2]}</span>
              <Textarea
                value={detail}
                onChange={(event) => setDetail(event.target.value)}
                placeholder="Tulis konteks singkat, hasil, atau kebutuhan follow-up..."
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Draft
              </Button>
              <Button variant="outline">
                <Link2 className="mr-2 h-4 w-4" />
                Tambah Lampiran Link
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Daftar Entry Terbaru" description="Mock data ini menggambarkan jenis tugas yang sedang ditangani role terkait.">
          {entries.length === 0 ? (
            <EmptyState
              title="Belum ada entry untuk role ini"
              description="Role ini belum memiliki contoh data pada brand yang dipilih."
            />
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-[24px] border border-slate-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{entry.kind.replace("_", " ")}</p>
                      <h3 className="mt-2 text-lg font-semibold text-markarta-navy">{entry.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {getBrandById(entry.brandId).name} • Update {entry.updatedAt}
                      </p>
                    </div>
                    <StatusBadge status="planning">{entry.status}</StatusBadge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{entry.notes}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
