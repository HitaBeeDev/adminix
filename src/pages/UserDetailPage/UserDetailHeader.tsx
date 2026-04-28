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

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                {initials(user.name)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-[#181818]">{user.name}</h1>
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

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onResetPassword}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw size={13} /> Reset Password
            </button>
            <button
              onClick={onSuspend}
              disabled={isPending}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isSuspended ? "Reactivate" : "Suspend"}
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm rounded-lg border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
