import type { UserRole } from "@/types/markarta";

export function normalizeRole(value?: string): UserRole {
  if (
    value === "direktur" ||
    value === "manager" ||
    value === "activation" ||
    value === "kol" ||
    value === "content_creator"
  ) {
    return value;
  }

  return "direktur";
}

export function normalizeBrand(value?: string, fallback = "sebelas") {
  return value ?? fallback;
}
