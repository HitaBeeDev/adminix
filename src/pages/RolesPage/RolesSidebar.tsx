import { ShieldCheck, Trash2, Users } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import type { Role } from "@/types/role";

interface RolesSidebarProps {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  onAddRole: () => void;
  onDeleteRole: (role: Role) => void;
  onRetry: () => void;
  roles: Role[];
}

export function RolesSidebar({
  error,
  isError,
  isLoading,
  onAddRole,
  onDeleteRole,
  onRetry,
  roles,
}: RolesSidebarProps) {
  return (
    <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:w-64 xl:grid-cols-1">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))
      ) : isError ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <ErrorState error={error} onRetry={onRetry} className="px-4 py-10" />
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <EmptyState
            icon={<ShieldCheck size={22} />}
            title="No roles yet"
            description="Create your first role to manage user permissions."
            action={{ label: "Add role", onClick: onAddRole }}
            className="py-10"
          />
        </div>
      ) : (
        roles.map((role) => (
          <div
            key={role.id}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck size={15} className="text-indigo-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{role.name}</span>
              </div>
              {!role.isSystem && role.usersCount === 0 && (
                <button
                  onClick={() => onDeleteRole(role)}
                  className="shrink-0 p-1 rounded text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  title="Delete role"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{role.description}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Users size={11} />
              <span>{role.usersCount} user{role.usersCount !== 1 ? "s" : ""}</span>
              {role.isSystem && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-[0.625rem] font-medium">
                  System
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
