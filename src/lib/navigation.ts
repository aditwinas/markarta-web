import { BarChart3, CalendarRange, ClipboardPenLine, LayoutGrid } from "lucide-react";

import type { UserRole } from "@/types/markarta";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  roles: UserRole[];
}

export const demoRoles: Array<{ role: UserRole; label: string; description: string }> = [
  {
    role: "direktur",
    label: "Direktur Marketing",
    description: "Lihat scorecard semua brand dan target omset."
  },
  {
    role: "manager",
    label: "Marketing Manager",
    description: "Pantau dashboard dan koordinasi eksekusi tim."
  },
  {
    role: "activation",
    label: "Brand Activation & Sales",
    description: "Kelola aktivasi, event, dan laporan lapangan."
  },
  {
    role: "kol",
    label: "KOL & Community Specialist",
    description: "Pantau sourcing dan performa project KOL."
  },
  {
    role: "content_creator",
    label: "Content Creator",
    description: "Atur planning konten dan weekly report brand."
  }
];

export const navItems: NavItem[] = [
  {
    href: "/scorecard",
    label: "Scorecard",
    icon: LayoutGrid,
    roles: ["direktur", "manager"]
  },
  {
    href: "/dashboard",
    label: "Dashboard Brand",
    icon: BarChart3,
    roles: ["direktur", "manager", "activation", "kol", "content_creator"]
  },
  {
    href: "/calendar",
    label: "Content Calendar",
    icon: CalendarRange,
    roles: ["direktur", "manager", "content_creator"]
  },
  {
    href: "/worksheet",
    label: "Worksheet",
    icon: ClipboardPenLine,
    roles: ["activation", "kol", "content_creator", "manager"]
  }
];

export function getDefaultRoute(role: UserRole) {
  if (role === "direktur" || role === "manager") {
    return "/scorecard";
  }

  if (role === "content_creator") {
    return "/calendar";
  }

  return "/dashboard";
}

export function buildDemoHref(
  pathname: string,
  role: UserRole,
  extra?: Record<string, string>,
) {
  const params = new URLSearchParams({ role, ...extra });
  return `${pathname}?${params.toString()}`;
}

export function getRoleLabel(role: UserRole) {
  return demoRoles.find((item) => item.role === role)?.label ?? role;
}
