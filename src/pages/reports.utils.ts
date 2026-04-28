import type { GenerateReportValues } from "./reports.schema";
import type { Report } from "./reports.types";

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export function formatReportDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatReportRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);

  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
}

export function csvCell(value: string | number | undefined) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function mockRowCount(values: Pick<GenerateReportValues, "name" | "type" | "from" | "to">) {
  const seed = `${values.name}:${values.type}:${values.from}:${values.to}`
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return (seed % 800) + 10;
}

export function mockDownload(report: Report) {
  let content: string;
  let mime: string;
  let ext: string;

  if (report.format === "JSON") {
    content = JSON.stringify(
      {
        report: report.name,
        type: report.type,
        dateRange: report.dateRange,
        rows: report.rows,
        generated: report.generated,
      },
      null,
      2,
    );
    mime = "application/json";
    ext = "json";
  } else {
    content = [
      ["Report", "Type", "Date Range", "Generated", "Rows"].join(","),
      [
        csvCell(report.name),
        csvCell(report.type),
        csvCell(report.dateRange),
        csvCell(report.generated),
        csvCell(report.rows),
      ].join(","),
    ].join("\n");
    mime = "text/csv";
    ext = "csv";
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${report.name.toLowerCase().replace(/\s+/g, "-")}.${ext}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
