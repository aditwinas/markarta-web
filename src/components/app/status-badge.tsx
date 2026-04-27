import { Badge } from "@/components/ui/badge";
import type { CalendarStatus, TrafficLight } from "@/types/markarta";

export function StatusBadge({
  status,
  children
}: {
  status: TrafficLight | CalendarStatus | string;
  children?: React.ReactNode;
}) {
  if (status === "green") return <Badge variant="success">{children ?? "Hijau"}</Badge>;
  if (status === "yellow") return <Badge variant="warning">{children ?? "Kuning"}</Badge>;
  if (status === "red") return <Badge variant="danger">{children ?? "Merah"}</Badge>;
  if (status === "planning") return <Badge variant="secondary">{children ?? "Planning"}</Badge>;
  if (status === "produksi") return <Badge variant="warning">{children ?? "Produksi"}</Badge>;
  if (status === "published") return <Badge variant="success">{children ?? "Published"}</Badge>;
  return <Badge variant="default">{children ?? status}</Badge>;
}
