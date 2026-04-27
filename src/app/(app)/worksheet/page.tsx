"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AppShell } from "@/components/app/app-shell";
import { WorksheetPageClient } from "@/components/app/worksheet-page-client";
import { normalizeBrand, normalizeRole } from "@/lib/demo-session";

function WorksheetPageContent() {
  const searchParams = useSearchParams();
  const role = normalizeRole(searchParams.get("role") ?? undefined);
  const brandId = normalizeBrand(searchParams.get("brand") ?? undefined, "snaposnap");

  return (
    <AppShell role={role} brand={brandId} pathname="/worksheet">
      <WorksheetPageClient role={role} brandId={brandId} />
    </AppShell>
  );
}

export default function WorksheetPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <WorksheetPageContent />
    </Suspense>
  );
}
