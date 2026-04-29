import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { PaginatedUsers } from "@/types/user";
import { USER_PAGE_SIZE_OPTIONS } from "./users.constants";

interface UsersPaginationProps {
  data: PaginatedUsers | undefined;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
}

export function UsersPagination({ data, onPageChange, onPageSizeChange, pageSize }: UsersPaginationProps) {
  if (!data) return null;

  const buttonClass =
    "inline-flex h-9 w-9 items-center justify-center border-l border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-35 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        Rows
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          {USER_PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {data.totalPages > 1 && (
        <div className="inline-flex max-w-full items-center overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <button
            type="button"
            aria-label="First page"
            onClick={() => onPageChange(1)}
            disabled={data.page <= 1}
            className="inline-flex h-9 w-9 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-35 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => onPageChange(data.page - 1)}
            disabled={data.page <= 1}
            className={buttonClass}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="shrink-0 border-l border-gray-200 px-3 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300 sm:px-4">
            Page {data.page.toLocaleString()} of {data.totalPages.toLocaleString()}
          </span>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => onPageChange(data.page + 1)}
            disabled={data.page >= data.totalPages}
            className={buttonClass}
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            aria-label="Last page"
            onClick={() => onPageChange(data.totalPages)}
            disabled={data.page >= data.totalPages}
            className={buttonClass}
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
