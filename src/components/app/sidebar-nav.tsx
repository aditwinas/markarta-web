import Link from "next/link";
import { PanelLeftClose } from "lucide-react";

import { LogoMark } from "@/components/app/logo-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildDemoHref, getRoleLabel, navItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/markarta";

export function SidebarNav({
  role,
  brand,
  pathname,
  onNavigate,
  showCollapseButton,
  onToggleVisibility
}: {
  role: UserRole;
  brand: string;
  pathname: string;
  onNavigate?: () => void;
  showCollapseButton?: boolean;
  onToggleVisibility?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LogoMark />
            <div>
              <p className="text-sm font-semibold tracking-[0.28em] text-white/80">MARKARTA</p>
              <p className="text-xs text-white/50">by ARTA Partners</p>
            </div>
          </div>

          {showCollapseButton ? (
            <Button
              variant="outline"
              size="icon"
              className="hidden border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white md:inline-flex"
              onClick={onToggleVisibility}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 px-6 py-5">
        <Badge className="bg-white/10 text-white">{getRoleLabel(role)}</Badge>
        <p className="mt-3 text-sm leading-6 text-white/65">
          Dashboard internal untuk memantau performa multi-brand setiap hari.
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-hidden px-4">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const active = pathname === item.href;
            const href = buildDemoHref(item.href, role, { brand });
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active ? "bg-white text-markarta-navy shadow-soft" : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="shrink-0 px-6 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">Update Harian</p>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Snapshot dashboard memakai report POS per 22 April 2026 dengan placeholder untuk integrasi yang belum aktif.
          </p>
        </div>
      </div>
    </div>
  );
}
