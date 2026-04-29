import { Link } from "react-router";
import { ChevronDown, Search } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import type { User, UserRole, UserStatus } from "@/types/user";
import { ROLE_LABELS, STATUS_STYLES, USER_COLUMNS, USER_GRID_COLUMNS } from "./users.constants";
import { formatUserDate, getUserInitials } from "./users.utils";
import type { SortableColumn, SortDirection } from "./users.types";
import { UserRowActionMenu } from "./UserRowActionMenu";
import { UserRowSkeleton } from "./UserRowSkeleton";
import { UsersSortIcon } from "./UsersSortIcon";

interface UsersTableProps {
  allLoadedSelected: boolean;
  debouncedSearch: string;
  error: unknown;
  expanded: Set<string>;
  isError: boolean;
  isLoading: boolean;
  onClearFilters: () => void;
  onDeleteUser: (id: string, user: User) => void;
  onRetry: () => void;
  onSort: (column: SortableColumn) => void;
  onToggleAll: () => void;
  onToggleExpanded: (id: string) => void;
  onToggleOne: (id: string) => void;
  onUpdateUser: (args: { id: string; payload: { status: User["status"] } }, user: User) => void;
  role: UserRole | "";
  selected: Set<string>;
  someLoadedSelected: boolean;
  sortBy: SortableColumn;
  sortDir: SortDirection;
  status: UserStatus | "";
  users: User[];
}

export function UsersTable({
  allLoadedSelected,
  debouncedSearch,
  error,
  expanded,
  isError,
  isLoading,
  onClearFilters,
  onDeleteUser,
  onRetry,
  onSort,
  onToggleAll,
  onToggleExpanded,
  onToggleOne,
  onUpdateUser,
  role,
  selected,
  someLoadedSelected,
  sortBy,
  sortDir,
  status,
  users,
}: UsersTableProps) {
  const emptyState = (
    <div className="px-4 py-20 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Search size={20} className="text-gray-400 dark:text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No users found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {debouncedSearch || role || status
              ? "Try adjusting your filters or search term"
              : "Invite your first user to get started"}
          </p>
        </div>
        {(debouncedSearch || role || status) && (
          <button onClick={onClearFilters} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="md:hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  </div>
                </div>
                <div className="h-8 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={onRetry} />
        ) : users.length === 0 ? (
          emptyState
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((user) => {
              const isExpanded = expanded.has(user.id);

              return (
                <article
                  key={user.id}
                  className={cn(
                    "p-4 transition-colors",
                    selected.has(user.id) && "bg-indigo-50/50 dark:bg-indigo-900/10",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() => onToggleOne(user.id)}
                      className="mt-2 h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
                    />
                    <Link to={`/users/${user.id}`} className="flex min-w-0 flex-1 items-center gap-2.5 group">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                        {getUserInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
                      </div>
                    </Link>
                    <UserRowActionMenu
                      user={user}
                      onUpdate={(args) => onUpdateUser(args, user)}
                      onDelete={(id) => onDeleteUser(id, user)}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-medium text-gray-400 dark:text-gray-500">Role</p>
                      <p className="mt-1 truncate text-gray-700 dark:text-gray-300">{ROLE_LABELS[user.role]}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-400 dark:text-gray-500">Status</p>
                      <span className={cn("mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[user.status])}>
                        {user.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-400 dark:text-gray-500">Joined</p>
                      <p className="mt-1 truncate text-gray-700 dark:text-gray-300">{formatUserDate(user.dateJoined)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-400 dark:text-gray-500">Last active</p>
                      <p className="mt-1 truncate text-gray-700 dark:text-gray-300">{formatUserDate(user.lastActive)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleExpanded(user.id)}
                    aria-expanded={isExpanded}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <ChevronDown size={14} className={cn("transition-transform", isExpanded && "rotate-180")} />
                    Details
                  </button>

                  {isExpanded && (
                    <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs dark:bg-gray-950/30">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-500 dark:text-gray-400">User ID</p>
                          <p className="mt-1 truncate font-mono text-gray-800 dark:text-gray-100">{user.id}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-500 dark:text-gray-400">Account</p>
                          <p className="mt-1 truncate font-mono text-gray-800 dark:text-gray-100">{user.accountId ?? "Unassigned"}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-500 dark:text-gray-400">Security</p>
                          <p className="mt-1 truncate text-gray-800 dark:text-gray-100">
                            {user.twoFactorEnabled ? "2FA enabled" : "2FA disabled"}
                            {user.lastIp ? ` - ${user.lastIp}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden w-full min-w-0 overflow-x-auto md:block">
        <div className="w-full min-w-0 text-sm">
          <div
            className="sticky top-0 z-10 grid border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
            style={{ gridTemplateColumns: USER_GRID_COLUMNS }}
          >
            <div className="pl-4 pr-2 py-3">
              <input
                type="checkbox"
                checked={allLoadedSelected}
                ref={(element) => {
                  if (element) element.indeterminate = someLoadedSelected;
                }}
                onChange={onToggleAll}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            {USER_COLUMNS.map(({ key, label }) => (
              <div key={key} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                <button
                  onClick={() => onSort(key)}
                  className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  {label}
                  <UsersSortIcon col={key} sortBy={sortBy} sortDir={sortDir} />
                </button>
              </div>
            ))}
            <div className="px-4 py-3" />
          </div>

          {isLoading ? (
            <div>
              {Array.from({ length: 8 }).map((_, index) => (
                <UserRowSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState error={error} onRetry={onRetry} />
          ) : users.length === 0 ? (
            emptyState
          ) : (
            <div>
              {users.map((user) => {
                const isExpanded = expanded.has(user.id);

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "grid w-full min-w-0 border-b border-gray-50 dark:border-gray-800 transition-colors last:border-b-0",
                      selected.has(user.id)
                        ? "bg-indigo-50/50 dark:bg-indigo-900/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    )}
                    style={{ gridTemplateColumns: USER_GRID_COLUMNS }}
                  >
                      <div className="pl-4 pr-2 py-3 flex items-center">
                        <input
                          type="checkbox"
                          checked={selected.has(user.id)}
                          onChange={() => onToggleOne(user.id)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>
                      <div className="px-3 py-3 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => onToggleExpanded(user.id)}
                            aria-label={isExpanded ? `Collapse ${user.name}` : `Expand ${user.name}`}
                            aria-expanded={isExpanded}
                            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
                          >
                            <ChevronDown
                              size={14}
                              className={cn("transition-transform", isExpanded ? "rotate-0" : "-rotate-90")}
                            />
                          </button>
                          <Link to={`/users/${user.id}`} className="flex items-center gap-2.5 group min-w-0">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                              {getUserInitials(user.name)}
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {user.name}
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="px-3 py-3 flex min-w-0 items-center">
                        <span className="truncate text-gray-500 dark:text-gray-400">{user.email}</span>
                      </div>
                      <div className="px-3 py-3 flex min-w-0 items-center">
                        <span className="truncate text-gray-600 dark:text-gray-300">{ROLE_LABELS[user.role]}</span>
                      </div>
                      <div className="px-3 py-3 flex min-w-0 items-center">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[user.status])}>
                          {user.status}
                        </span>
                      </div>
                      <div className="px-3 py-3 flex min-w-0 items-center">
                        <span className="truncate text-gray-500 dark:text-gray-400">{formatUserDate(user.dateJoined)}</span>
                      </div>
                      <div className="px-3 py-3 flex items-center justify-end">
                        <UserRowActionMenu
                          user={user}
                          onUpdate={(args) => onUpdateUser(args, user)}
                          onDelete={(id) => onDeleteUser(id, user)}
                        />
                      </div>
                      {isExpanded && (
                        <div className="col-span-full border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/30 px-4 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-xs">
                            <div className="min-w-0">
                              <p className="font-medium text-gray-500 dark:text-gray-400">User ID</p>
                              <p className="mt-1 truncate font-mono text-gray-800 dark:text-gray-100">{user.id}</p>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-500 dark:text-gray-400">Account</p>
                              <p className="mt-1 truncate font-mono text-gray-800 dark:text-gray-100">{user.accountId ?? "Unassigned"}</p>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-500 dark:text-gray-400">Last active</p>
                              <p className="mt-1 truncate text-gray-800 dark:text-gray-100">{formatUserDate(user.lastActive)}</p>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-500 dark:text-gray-400">Security</p>
                              <p className="mt-1 truncate text-gray-800 dark:text-gray-100">
                                {user.twoFactorEnabled ? "2FA enabled" : "2FA disabled"}
                                {user.lastIp ? ` - ${user.lastIp}` : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
