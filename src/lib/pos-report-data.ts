import reportData from "@/data/markarta-report.json";

import type { BrandReportSection, PortfolioSummary, PosReportPayload, ReportBasis } from "@/lib/pos-report-types";

const payload = reportData as PosReportPayload;

export const reportBasis: ReportBasis = payload.reportBasis;
export const portfolioSummary: PortfolioSummary = payload.portfolioSummary;
export const brandReports: BrandReportSection[] = payload.brandReports;

