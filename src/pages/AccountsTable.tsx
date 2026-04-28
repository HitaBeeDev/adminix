import { Link } from "react-router";
import { Search } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/account";
import { AccountsActionMenu } from "./AccountsActionMenu";
import { AccountsRowSkeleton } from "./AccountsRowSkeleton";
import { ACCOUNT_TABLE_HEADINGS, PLAN_STYLES, STATUS_STYLES } from "./accounts.constants";
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {ACCOUNT_TABLE_HEADINGS.map((heading) => (
                <th key={heading} className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  {heading}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => <AccountsRowSkeleton key={index} />)
            ) : isError ? (
              <tr>
                <td colSpan={7}>
                  <ErrorState error={error} onRetry={onRetry} />
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-20 text-center">
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
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <Link to={`/accounts/${account.id}`} className="group">
                      <p className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {account.name}
                      </p>
                      {account.domain && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{account.domain}</p>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", PLAN_STYLES[account.plan])}>
                      {account.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-gray-700 dark:text-gray-300">{account.ownerName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{account.ownerEmail}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{account.membersCount}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[account.status])}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">
                    {formatAccountDate(account.createdDate)}
                  </td>
                  <td className="px-4 py-3.5">
                    <AccountsActionMenu
                      account={account}
                      onToggleSuspend={() => onToggleSuspend(account)}
                    />
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
