import { Link } from "react-router";
import { ChevronRight, RotateCcw, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import { ROLE_COLORS, ROLE_LABELS, STATUS_STYLES } from "./userDetail.constants";
import { initials } from "./userDetail.utils";

interface UserDetailHeaderProps {
  isPending: boolean;
  isSuspended: boolean;
  onDelete: () => void;
  onResetPassword: () => void;
  onSuspend: () => void;
  user: User;
}

export function UserDetailHeader({
  isPending,
  isSuspended,
  onDelete,
  onResetPassword,
  onSuspend,
  user,
}: UserDetailHeaderProps) {
  return (
    <>
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/users" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          Users
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 dark:text-gray-100 font-medium">{user.name}</span>
      </nav>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-900/20" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white ring-4 ring-indigo-50 dark:ring-indigo-900/20">
                {initials(user.name)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", ROLE_COLORS[user.role])}>
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[user.status])}>
                  {user.status}
                </span>
                {user.twoFactorEnabled && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    <Shield size={10} /> 2FA
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <button
              onClick={onResetPassword}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
            >
              <RotateCcw size={13} /> Reset Password
            </button>
            <button
              onClick={onSuspend}
              disabled={isPending}
              className="rounded-lg border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:border-amber-800/60 dark:text-amber-400 dark:hover:bg-amber-900/20"
            >
              {isSuspended ? "Reactivate" : "Suspend"}
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-800/50 dark:text-rose-400 dark:hover:bg-rose-900/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
