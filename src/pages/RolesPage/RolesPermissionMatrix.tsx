import { Fragment } from "react";
import { ShieldCheck } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import type { Permission, PermissionKey, Role } from "@/types/role";
import { RolesMatrixSkeleton } from "./RolesMatrixSkeleton";

interface RolesPermissionMatrixProps {
  error: unknown;
  groups: Permission["group"][];
  isError: boolean;
  isLoading: boolean;
  onAddRole: () => void;
  onRetry: () => void;
  onTogglePermission: (role: Role, key: PermissionKey) => void;
  permissions: Permission[];
  roles: Role[];
}

export function RolesPermissionMatrix({
  error,
  groups,
  isError,
  isLoading,
  onAddRole,
  onRetry,
  onTogglePermission,
  permissions,
  roles,
}: RolesPermissionMatrixProps) {
  return (
    <div className="w-full min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      {isLoading ? (
        <RolesMatrixSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : roles.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck size={22} />}
          title="No roles to display"
          description="Add a role to see the permission matrix."
          action={{ label: "Add role", onClick: onAddRole }}
        />
      ) : (
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="sticky left-0 z-10 w-48 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400 sm:w-52 sm:px-5">Permission</th>
                {roles.map((role) => (
                  <th key={role.id} className="min-w-[92px] px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 sm:px-4">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <Fragment key={group}>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/20">
                    <td
                      colSpan={roles.length + 1}
                      className="px-5 py-2 text-[0.6875rem] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
                    >
                      {group}
                    </td>
                  </tr>

                  {permissions
                    .filter((permission) => permission.group === group)
                    .map((permission) => (
                      <tr
                        key={permission.key}
                        className="border-t border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                      >
                        <td className="sticky left-0 z-10 bg-white px-4 py-2.5 dark:bg-gray-900 sm:px-5">
                          <p className="text-sm text-gray-700 dark:text-gray-200">{permission.label}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{permission.description}</p>
                        </td>
                        {roles.map((role) => {
                          const has = role.permissions.includes(permission.key);

                          return (
                            <td key={role.id} className="px-3 py-2.5 text-center sm:px-4">
                              <input
                                type="checkbox"
                                checked={has}
                                disabled={role.isSystem}
                                onChange={() => onTogglePermission(role, permission.key)}
                                title={role.isSystem ? "System roles cannot be modified" : undefined}
                                className={cn(
                                  "w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500",
                                  role.isSystem ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                                )}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
