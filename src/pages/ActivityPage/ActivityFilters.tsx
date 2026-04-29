import { Download } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";
import { ACTION_OPTIONS, activitySelectClass } from "./activity.constants";
import type { User } from "@/types/user";

interface ActivityFiltersProps {
  actionType: string;
  dateFrom: string;
  dateTo: string;
  hasFilters: boolean;
  isUsersError: boolean;
  isUsersLoading: boolean;
  isExporting: boolean;
  onClearFilters: () => void;
  onExport: () => void;
  onFilterChange: (key: string, value: string) => void;
  onRetryUsers: () => void;
  userId: string;
  users: User[];
  usersError: unknown;
}

export function ActivityFilters({
  actionType,
  dateFrom,
  dateTo,
  hasFilters,
  isExporting,
  isUsersError,
  isUsersLoading,
  onClearFilters,
  onExport,
  onFilterChange,
  onRetryUsers,
  userId,
  users,
  usersError,
}: ActivityFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {isUsersLoading ? (
        <div className="h-10 w-32 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ) : isUsersError ? (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
          <span>{getErrorMessage(usersError, "Failed to load users")}</span>
          <button type="button" onClick={onRetryUsers} className="font-medium underline">
            Retry
          </button>
        </div>
      ) : (
        <select
          value={userId}
          onChange={(event) => onFilterChange("userId", event.target.value)}
          className={activitySelectClass}
        >
          <option value="">All users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      )}

      <select
        value={actionType}
        onChange={(event) => onFilterChange("actionType", event.target.value)}
        className={activitySelectClass}
      >
        {ACTION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">From</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => onFilterChange("dateFrom", event.target.value)}
          className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">To</label>
        <input
          type="date"
          value={dateTo}
          onChange={(event) => onFilterChange("dateTo", event.target.value)}
          className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline self-center"
        >
          Clear filters
        </button>
      )}

      <button
        type="button"
        onClick={onExport}
        disabled={isExporting}
        className="ml-auto flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
      >
        <Download size={14} /> {isExporting ? "Exporting..." : "Export CSV"}
      </button>
    </div>
  );
}
