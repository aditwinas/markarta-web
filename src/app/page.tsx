"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { normalizeRole } from "@/lib/demo-session";
import { LogoMark } from "@/components/app/logo-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildDemoHref, demoRoles, getDefaultRoute } from "@/lib/navigation";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const selectedRole = normalizeRole(searchParams.get("role") ?? undefined);

  return (
    <main className="min-h-screen bg-markarta-gradient bg-hero-grid text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
        <section className="flex flex-col justify-between gap-10">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <LogoMark />
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-white/85">MARKARTA</p>
                <p className="text-sm text-white/65">by ARTA Partners</p>
              </div>
            </div>

            <div className="space-y-5">
              <p className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-white/80">
                Internal Dashboard Multi-Brand
              </p>
              <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">
                Pantau 6 brand dalam satu layar dengan morning report yang siap dibuka dari mana saja.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/72 sm:text-lg">
                Frontend MVP Markarta menghadirkan scorecard, dashboard performa, kalender konten, dan worksheet
                operasional dengan snapshot report April 2026 yang siap dipakai untuk review harian.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
              {[
              ["Morning Sync", "Ringkasan bisnis siap untuk review pagi hari."],
              ["Alert Proaktif", "Anomali penting langsung naik ke radar manager."],
              ["Daily Email", "Target berikutnya: kirim report otomatis tiap jam 07.00."]
            ].map(([title, note]) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/70">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Card className="border-white/20 bg-white text-slate-900 shadow-2xl">
            <CardContent className="space-y-6 p-8 sm:p-10">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-markarta-blue">Demo Login</p>
                <h2 className="text-3xl font-semibold text-markarta-navy">Masuk ke workspace Markarta</h2>
                <p className="text-sm leading-6 text-slate-500">
                  Gunakan role demo di bawah untuk melihat alur UI sesuai kebutuhan tiap tim.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="nama@artapartners.com" defaultValue="direktur@artapartners.com" />
                <Input type="password" placeholder="••••••••" defaultValue="markarta-demo" />
              </div>

              <div className="grid gap-3">
                {demoRoles.map((item) => {
                  const active = selectedRole === item.role;

                  return (
                    <Link key={item.role} href={buildDemoHref("/", item.role)}>
                      <div
                        className={`rounded-2xl border p-4 transition ${
                          active
                            ? "border-markarta-blue bg-blue-50 shadow-soft"
                            : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-markarta-navy">{item.label}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                          </div>
                          <ShieldCheck className={`h-5 w-5 ${active ? "text-markarta-blue" : "text-slate-300"}`} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Link href={buildDemoHref(getDefaultRoute(selectedRole), selectedRole, { brand: "sebelas" })}>
                <Button size="lg" className="w-full">
                  Masuk ke Dashboard Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-markarta-gradient" />}>
      <LoginPageContent />
    </Suspense>
  );
}
