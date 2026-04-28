import { cn } from "@/lib/utils";
import { REPORT_FILTER_OPTIONS } from "./reports.constants";
import type { ReportTypeFilter } from "./reports.types";

interface ReportsTypeFilterProps {
  onChange: (type: ReportTypeFilter) => void;
  typeFilter: ReportTypeFilter;
}

export function ReportsTypeFilter({ onChange, typeFilter }: ReportsTypeFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {REPORT_FILTER_OPTIONS.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-lg border transition-colors",
            typeFilter === type
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800",
          )}
        >
          {type === "" ? "All" : type}
        </button>
      ))}
    </div>
  );
}
