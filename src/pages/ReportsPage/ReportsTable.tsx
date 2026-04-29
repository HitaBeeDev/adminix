import { Download, FileText, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FORMAT_STYLES,
  REPORT_TABLE_HEADINGS,
  TYPE_STYLES,
} from "./reports.constants";
import { formatReportDate, formatReportRelative, mockDownload } from "./reports.utils";
import { ReportsRowSkeleton } from "./ReportsRowSkeleton";
import type { Report, ReportTypeFilter } from "./reports.types";

interface ReportsTableProps {
  isLoading: boolean;
  onClearFilter: () => void;
  onDelete: (report: Report) => void;
  onGenerate: () => void;
  onRegenerate: (id: string) => void;
  reports: Report[];
  typeFilter: ReportTypeFilter;
}

export function ReportsTable({
  isLoading,
  onClearFilter,
  onDelete,
  onGenerate,
  onRegenerate,
  reports,
  typeFilter,
}: ReportsTableProps) {
  const emptyState = (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <FileText size={20} className="text-gray-400 dark:text-gray-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No reports found</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {typeFilter ? "Try selecting a different type" : "Generate your first report to get started"}
        </p>
      </div>
      {typeFilter ? (
        <button
          onClick={onClearFilter}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Clear filter
        </button>
      ) : (
        <button
          onClick={onGenerate}
          className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          Generate report
        </button>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="md:hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-7 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-7 flex-1 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          emptyState
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {reports.map((report) => (
              <article key={report.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="shrink-0 text-gray-300 dark:text-gray-600" />
                      <h2 className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{report.name}</h2>
                    </div>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{report.dateRange}</p>
                  </div>
                  <span className={cn("shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", TYPE_STYLES[report.type])}>
                    {report.type}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium text-gray-400 dark:text-gray-500">Generated</p>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{formatReportRelative(report.generated)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-400 dark:text-gray-500">Rows</p>
                    <p className="mt-1 tabular-nums text-gray-700 dark:text-gray-300">{report.rows.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => onRegenerate(report.id)}
                    disabled={report.status === "generating"}
                    title="Regenerate"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <RefreshCw size={14} className={report.status === "generating" ? "animate-spin" : ""} />
                  </button>
                  <button
                    onClick={() => mockDownload(report)}
                    disabled={report.status === "generating"}
                    className={cn(
                      "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors disabled:opacity-40",
                      FORMAT_STYLES[report.format],
                      "border-current/20 hover:opacity-80",
                    )}
                  >
                    <Download size={12} />
                    {report.format}
                  </button>
                  <button
                    onClick={() => onDelete(report)}
                    disabled={report.status === "generating"}
                    title="Delete report"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-[840px] w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {REPORT_TABLE_HEADINGS.map((heading) => (
                <th
                  key={heading}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400",
                    heading === "Actions" && "text-right",
                  )}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => <ReportsRowSkeleton key={index} />)
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-20 text-center">
                  {emptyState}
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <FileText size={15} className="text-gray-300 dark:text-gray-600 shrink-0" />
                      <span className="font-medium text-gray-800 dark:text-gray-100">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", TYPE_STYLES[report.type])}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{report.dateRange}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-gray-700 dark:text-gray-300">{formatReportRelative(report.generated)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatReportDate(report.generated)}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 tabular-nums">
                    {report.rows.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onRegenerate(report.id)}
                        disabled={report.status === "generating"}
                        title="Regenerate"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                      >
                        <RefreshCw size={14} className={report.status === "generating" ? "animate-spin" : ""} />
                      </button>
                      <button
                        onClick={() => mockDownload(report)}
                        disabled={report.status === "generating"}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border disabled:opacity-40 transition-colors",
                          FORMAT_STYLES[report.format],
                          "border-current/20 hover:opacity-80",
                        )}
                      >
                        <Download size={12} />
                        {report.format}
                      </button>
                      <button
                        onClick={() => onDelete(report)}
                        disabled={report.status === "generating"}
                        title="Delete report"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-40 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
