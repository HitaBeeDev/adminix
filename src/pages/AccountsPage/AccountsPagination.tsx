import { cn } from "@/lib/utils";
import type { PaginatedAccounts } from "@/types/account";
import { getPaginationItems } from "./accounts.utils";

interface AccountsPaginationProps {
  data: PaginatedAccounts | undefined;
  onPageChange: (page: number) => void;
}

export function AccountsPagination({ data, onPageChange }: AccountsPaginationProps) {
  if (!data || data.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>
        Showing {(data.page - 1) * data.pageSize + 1}-{Math.min(data.page * data.pageSize, data.total)} of {data.total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(data.page - 1)}
          disabled={data.page <= 1}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {getPaginationItems(data.page, data.totalPages).map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={cn(
                "w-9 py-1.5 rounded-lg border transition-colors",
                item === data.page
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(data.page + 1)}
          disabled={data.page >= data.totalPages}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
