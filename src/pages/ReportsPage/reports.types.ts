export type ReportType = "Users" | "Accounts" | "Activity";
export type ReportFormat = "CSV" | "JSON";
export type ReportStatus = "ready" | "generating";
export type ReportTypeFilter = ReportType | "";

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  dateRange: string;
  format: ReportFormat;
  generated: string;
  status: ReportStatus;
  rows: number;
}
