import { Link } from "react-router";
import { Check } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState";
import { useRoles } from "@/hooks/useRoles";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, ROLE_LABELS } from "./userDetail.constants";
import { useUserDetailContext } from "./UserDetailContext";

export function PermissionsTab() {
  const { user } = useUserDetailContext();
  const { data, isLoading, isError, error, refetch } = useRoles();

  const roleRecord = data?.data.find((role) => role.name.toLowerCase().replace(/\s+/g, "_") === user.role);
  const allPermissions = data?.permissions ?? [];
  const groups = [...new Set(allPermissions.map((permission) => permission.group))];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818]">Permissions</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Granted via the <span className={cn("font-medium", ROLE_COLORS[user.role]?.split(" ")[1])}>{ROLE_LABELS[user.role]}</span> role
          </p>
        </div>
        <Link to="/roles" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
          Manage roles →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
              {Array.from({ length: 3 }).map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} className="py-12" />
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                {group}
              </p>
              <div className="space-y-1.5">
                {allPermissions
                  .filter((permission) => permission.group === group)
                  .map((permission) => {
                    const granted = roleRecord?.permissions.includes(permission.key) ?? false;

                    return (
                      <div key={permission.key} className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            "mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 text-[#181818]",
                            granted ? "bg-[#4fc4cf]" : "bg-gray-100 dark:bg-gray-800",
                          )}
                        >
                          {granted && <Check size={10} strokeWidth={3} />}
                        </div>
                        <div>
                          <p className={cn("text-sm", granted ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-600 line-through")}>
                            {permission.label}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
