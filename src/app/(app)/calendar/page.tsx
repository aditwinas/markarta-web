"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AppShell } from "@/components/app/app-shell";
import { CalendarPageClient } from "@/components/app/calendar-page-client";
import { normalizeBrand, normalizeRole } from "@/lib/demo-session";

function CalendarPageContent() {
  const searchParams = useSearchParams();
  const role = normalizeRole(searchParams.get("role") ?? undefined);
  const brandId = normalizeBrand(searchParams.get("brand") ?? undefined);

  return (
    <AppShell role={role} brand={brandId} pathname="/calendar">
      <CalendarPageClient selectedBrand={brandId} />
    </AppShell>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <CalendarPageContent />
    </Suspense>
  );
}
