import { daysAgo, today } from "./reports.utils";
import type { Report, ReportFormat, ReportType, ReportTypeFilter } from "./reports.types";

export const INITIAL_REPORTS: Report[] = [
  { id: "r1", name: "User Growth Summary", type: "Users", dateRange: "Jan 2026 - Apr 2026", format: "CSV", generated: "2026-04-08T09:15:00Z", status: "ready", rows: 248 },
  { id: "r2", name: "Suspended Users Audit", type: "Users", dateRange: "Q1 2026", format: "CSV", generated: "2026-04-07T14:30:00Z", status: "ready", rows: 17 },
  { id: "r3", name: "Account Plan Distribution", type: "Accounts", dateRange: "All time", format: "JSON", generated: "2026-04-06T11:00:00Z", status: "ready", rows: 84 },
  { id: "r4", name: "Enterprise Account Activity", type: "Accounts", dateRange: "Mar 2026", format: "CSV", generated: "2026-04-05T08:45:00Z", status: "ready", rows: 312 },
  { id: "r5", name: "Login Audit Log", type: "Activity", dateRange: "Last 30 days", format: "CSV", generated: "2026-04-08T07:00:00Z", status: "ready", rows: 1042 },
  { id: "r6", name: "Permission Change Activity", type: "Activity", dateRange: "Q1 2026", format: "JSON", generated: "2026-04-03T16:20:00Z", status: "ready", rows: 55 },
];

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: "Users", label: "User Summary" },
  { value: "Accounts", label: "Account Summary" },
  { value: "Activity", label: "Activity Log" },
];

export const REPORT_FILTER_OPTIONS: ReportTypeFilter[] = ["", "Users", "Accounts", "Activity"];

export const DATE_PRESETS = [
  { label: "Last 7 days", from: () => daysAgo(7), to: () => today() },
  { label: "Last 30 days", from: () => daysAgo(30), to: () => today() },
  { label: "Last 90 days", from: () => daysAgo(90), to: () => today() },
  { label: "Q1 2026", from: () => "2026-01-01", to: () => "2026-03-31" },
  { label: "Q2 2026", from: () => "2026-04-01", to: () => "2026-06-30" },
  { label: "All time", from: () => "2020-01-01", to: () => today() },
];

export const TYPE_STYLES: Record<ReportType, string> = {
  Users: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Accounts: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Activity: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export const FORMAT_STYLES: Record<ReportFormat, string> = {
  CSV: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  JSON: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export const REPORT_TABLE_HEADINGS = ["Name", "Type", "Date Range", "Generated", "Rows", "Actions"];

export const reportFieldClass =
  "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

export const reportLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

export const reportErrorClass = "mt-1 text-xs text-rose-500";
