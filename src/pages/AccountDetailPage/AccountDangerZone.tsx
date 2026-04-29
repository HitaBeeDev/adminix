import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountDangerZoneProps {
  isPending: boolean;
  isSuspended: boolean;
  onConfirmDelete: () => void;
  onConfirmSuspend: () => void;
}

export function AccountDangerZone({
  isPending,
  isSuspended,
  onConfirmDelete,
  onConfirmSuspend,
}: AccountDangerZoneProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-800/50 dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-rose-500" />
        <h2 className="text-sm font-semibold text-rose-600 dark:text-rose-400">Danger Zone</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 py-4 border-t border-rose-100 dark:border-rose-800/30">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {isSuspended ? "Reactivate account" : "Suspend account"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isSuspended
                ? "Restore access for all members of this account."
                : "Temporarily disable access for all members. The account and its data are preserved."}
            </p>
          </div>
          <button
            onClick={onConfirmSuspend}
            disabled={isPending}
            className={cn(
              "shrink-0 px-4 py-2 text-sm rounded-lg border transition-colors disabled:opacity-50",
              isSuspended
                ? "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                : "border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20",
            )}
          >
            {isSuspended ? "Reactivate" : "Suspend"}
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 py-4 border-t border-rose-100 dark:border-rose-800/30">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Delete account</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Permanently delete this account and remove all associated members. This cannot be undone.
            </p>
          </div>
          <button
            onClick={onConfirmDelete}
            className="shrink-0 px-4 py-2 text-sm rounded-lg border border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
