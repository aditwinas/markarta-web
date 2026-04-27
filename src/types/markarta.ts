export type UserRole =
  | "direktur"
  | "manager"
  | "activation"
  | "kol"
  | "content_creator";

export type TrafficLight = "green" | "yellow" | "red";
export type CalendarStatus = "planning" | "produksi" | "published";
export type WorksheetKind = "planning" | "weekly_report" | "kol_update" | "aktivasi";

export interface Brand {
  id: string;
  name: string;
  shortName: string;
  source: string;
  ownerRole: UserRole | "shared";
}

export interface ScorecardMetric {
  brandId: string;
  omzet: number;
  target: number;
  progress: number;
  digitalScore: number;
  activationCount: number;
  sentimentScore: number;
  status: TrafficLight;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export interface SocialPerformance {
  platform: string;
  reach: number;
  engagement: number;
  published: number;
  target: number;
}

export interface AdsPerformance {
  channel: string;
  spend: number;
  roas: number;
  ctr: number;
  impressions: number;
}

export interface KolPerformance {
  name: string;
  platform: string;
  reach: number;
  impact: string;
  status: string;
}

export interface ActivationProgram {
  title: string;
  date: string;
  status: string;
  result: string;
}

export interface SalesEvent {
  title: string;
  revenue: number;
  attendees: number;
}

export interface SentimentMention {
  source: string;
  text: string;
  tone: "positif" | "netral" | "negatif";
}

export interface BrandDashboardData {
  brandId: string;
  summary: {
    omzet: number;
    target: number;
    monthOverMonth: number;
    activeCampaigns: number;
    weeklyHighlights: string;
  };
  revenueDaily: RevenuePoint[];
  revenueMonthly: RevenuePoint[];
  topProducts: TopProduct[];
  social: SocialPerformance[];
  ads: AdsPerformance[];
  kol: KolPerformance[];
  activations: ActivationProgram[];
  salesEvents: SalesEvent[];
  sentiment: {
    score: number;
    positive: number;
    neutral: number;
    negative: number;
    keywords: string[];
    mentions: SentimentMention[];
  };
}

export interface CalendarItem {
  id: string;
  brandId: string;
  title: string;
  platform: string;
  date: string;
  weekLabel: string;
  status: CalendarStatus;
  owner: string;
}

export interface WorksheetEntry {
  id: string;
  role: UserRole;
  brandId: string;
  title: string;
  kind: WorksheetKind;
  status: string;
  updatedAt: string;
  notes: string;
}
