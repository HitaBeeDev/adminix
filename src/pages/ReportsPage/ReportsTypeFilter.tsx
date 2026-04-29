import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPORT_FILTER_OPTIONS } from "./reports.constants";
import type { ReportTypeFilter } from "./reports.types";

interface ReportsTypeFilterProps {
  onChange: (type: ReportTypeFilter) => void;
  onGenerate: () => void;
  typeFilter: ReportTypeFilter;
}

export function ReportsTypeFilter({ onChange, onGenerate, typeFilter }: ReportsTypeFilterProps) {
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
      <button
        onClick={onGenerate}
        className="ml-auto flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
      >
        <Plus size={15} /> Generate report
      </button>
    </div>
  );
}
