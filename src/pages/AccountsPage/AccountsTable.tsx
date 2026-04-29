import { Link } from "react-router";
import { Search } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/account";
import { AccountsActionMenu } from "./AccountsActionMenu";
import { AccountsRowSkeleton } from "./AccountsRowSkeleton";
import { ACCOUNT_GRID_COLUMNS, ACCOUNT_TABLE_HEADINGS, PLAN_STYLES, STATUS_STYLES } from "./accounts.constants";
import { formatAccountDate } from "./accounts.utils";

interface AccountsTableProps {
  accounts: Account[];
  debouncedSearch: string;
  error: unknown;
  hasFilters: boolean;
  isError: boolean;
  isLoading: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
  onToggleSuspend: (account: Account) => void;
}

export function AccountsTable({
  accounts,
  debouncedSearch,
  error,
  hasFilters,
  isError,
  isLoading,
  onClearFilters,
  onRetry,
  onToggleSuspend,
}: AccountsTableProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="w-full min-w-0 text-sm">
        <div
          className="grid border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50"
          style={{ gridTemplateColumns: ACCOUNT_GRID_COLUMNS }}
        >
          {ACCOUNT_TABLE_HEADINGS.map((heading) => (
            <div key={heading} className="px-3 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              {heading}
            </div>
          ))}
          <div className="px-3 py-3" />
        </div>

        {isLoading ? (
          <div>
            {Array.from({ length: 8 }).map((_, index) => <AccountsRowSkeleton key={index} />)}
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={onRetry} />
        ) : accounts.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Search size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No accounts found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {hasFilters ? "Try adjusting your filters" : "Create your first account to get started"}
                </p>
              </div>
              {(debouncedSearch || hasFilters) && (
                <button
                  onClick={onClearFilters}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            {accounts.map((account) => (
              <div
                key={account.id}
                className="grid w-full min-w-0 border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                style={{ gridTemplateColumns: ACCOUNT_GRID_COLUMNS }}
              >
                <div className="px-3 py-3.5 min-w-0">
                  <Link to={`/accounts/${account.id}`} className="group block min-w-0">
                    <p className="truncate font-medium text-gray-800 transition-colors group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                      {account.name}
                    </p>
                    {account.domain && (
                      <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">{account.domain}</p>
                    )}
                  </Link>
                </div>
                <div className="px-3 py-3.5 flex min-w-0 items-center">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", PLAN_STYLES[account.plan])}>
                    {account.plan}
                  </span>
                </div>
                <div className="px-3 py-3.5 min-w-0">
                  <p className="truncate text-gray-700 dark:text-gray-300">{account.ownerName}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">{account.ownerEmail}</p>
                </div>
                <div className="px-3 py-3.5 flex min-w-0 items-center text-gray-600 dark:text-gray-300">
                  {account.membersCount}
                </div>
                <div className="px-3 py-3.5 flex min-w-0 items-center">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[account.status])}>
                    {account.status}
                  </span>
                </div>
                <div className="px-3 py-3.5 flex min-w-0 items-center">
                  <span className="truncate text-gray-500 dark:text-gray-400">{formatAccountDate(account.createdDate)}</span>
                </div>
                <div className="px-3 py-3.5 flex items-center justify-end">
                  <AccountsActionMenu
                    account={account}
                    onToggleSuspend={() => onToggleSuspend(account)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
