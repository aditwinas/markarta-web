export interface ReportBasis {
  label: string;
  monthlyCurrent: string;
  monthlyPrevious: string;
  dailyCurrent: string;
  dailyPrevious: string;
  updatedAt: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  note: string;
  changePct?: number | null;
}

export interface DetailTable {
  title: string;
  description: string;
  columns: Array<{ key: string; label: string; align?: "left" | "right" }>;
  rows: Array<Record<string, string>>;
}

export interface RankingBlock {
  title: string;
  description: string;
  items: Array<{
    name: string;
    value: string;
    detail?: string;
  }>;
}

export interface BrandReportSection {
  id: string;
  name: string;
  source: string;
  state: "live" | "fallback" | "placeholder";
  summaryCards: SummaryCard[];
  note: string;
  table?: DetailTable;
  rankings?: RankingBlock[];
  notes?: string[];
}

export interface PortfolioSummary {
  activeBrands: number;
  trackedBrands: number;
  monthlyRevenue: number;
  monthlyChangePct: number | null;
  dailyRevenue: number;
  dailyChangePct: number | null;
}

export interface PosReportPayload {
  reportBasis: ReportBasis;
  portfolioSummary: PortfolioSummary;
  brandReports: BrandReportSection[];
}
