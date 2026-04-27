"use client";

import { useState } from "react";

import { SidebarNav } from "@/components/app/sidebar-nav";
import { Topbar } from "@/components/app/topbar";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/markarta";

export function AppShell({
  children,
  role,
  brand,
  pathname
}: {
  children: React.ReactNode;
  role: UserRole;
  brand: string;
  pathname: string;
}) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-[290px] overflow-hidden bg-markarta-navy transition-transform duration-300 md:block",
          isSidebarVisible ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarNav
          role={role}
          brand={brand}
          pathname={pathname}
          showCollapseButton
          onToggleVisibility={() => setIsSidebarVisible((value) => !value)}
        />
      </aside>

      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-1 flex-col transition-[padding-left] duration-300",
          isSidebarVisible ? "md:pl-[290px]" : "md:pl-0",
        )}
      >
        <Topbar
          role={role}
          brand={brand}
          pathname={pathname}
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={() => setIsSidebarVisible((value) => !value)}
        />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
