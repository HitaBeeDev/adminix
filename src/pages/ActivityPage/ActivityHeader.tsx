import { Download } from "lucide-react";

interface ActivityHeaderProps {
  isExporting: boolean;
  isLoading: boolean;
  onExport: () => void;
  total: number;
}

export function ActivityHeader({ isExporting, isLoading, onExport, total }: ActivityHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#181818]">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? (
            <span className="block h-4 w-20 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ) : `${total} events`}
        </p>
      </div>
      <button
        type="button"
        onClick={onExport}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <Download size={14} /> {isExporting ? "Exporting..." : "Export CSV"}
      </button>
    </div>
  );
}
