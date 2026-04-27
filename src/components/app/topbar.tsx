"use client";

import Link from "next/link";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Sparkles } from "lucide-react";

import { LogoMark } from "@/components/app/logo-mark";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buildDemoHref, getRoleLabel } from "@/lib/navigation";
import type { UserRole } from "@/types/markarta";

export function Topbar({
  role,
  brand,
  pathname,
  isSidebarVisible,
  onToggleSidebar
}: {
  role: UserRole;
  brand: string;
  pathname: string;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-background/90 px-4 py-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="border-b border-white/10 px-6 py-6">
              <div className="flex items-center gap-4">
                <LogoMark />
                <div>
                  <p className="text-sm font-semibold tracking-[0.28em] text-white/80">MARKARTA</p>
                  <p className="text-xs text-white/50">by ARTA Partners</p>
                </div>
              </div>
            </div>
            <SidebarNav role={role} brand={brand} pathname={pathname} />
          </SheetContent>
        </Sheet>

        <Button variant="outline" size="icon" className="hidden md:inline-flex" onClick={onToggleSidebar}>
          {isSidebarVisible ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Role Demo</p>
          <p className="text-lg font-semibold text-markarta-navy">{getRoleLabel(role)}</p>
        </div>
      </div>

      <div className="hidden min-w-[280px] max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-11" placeholder="Cari brand, campaign, atau insight..." />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href={buildDemoHref("/", role, { brand })}>
          <Button variant="outline" className="hidden sm:inline-flex">
            Ganti Role
          </Button>
        </Link>
        <div className="hidden rounded-2xl bg-white px-4 py-2 shadow-soft sm:flex sm:items-center sm:gap-2">
          <Sparkles className="h-4 w-4 text-markarta-blue" />
          <span className="text-sm font-medium text-slate-600">Morning report siap tiap hari 07.00</span>
        </div>
      </div>
    </div>
  );
}
