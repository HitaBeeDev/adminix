import { Link } from "react-router";
import { Users } from "lucide-react";
import { ROLE_LABELS, USER_ROLE_COLORS, USER_STATUS_STYLES } from "./accountDetail.constants";
import { fmtRelative, getInitials } from "./accountDetail.utils";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/account";
import type { User } from "@/types/user";

interface AccountMembersTableProps {
  account: Account;
  isLoading: boolean;
  members: User[];
}

export function AccountMembersTable({ account, isLoading, members }: AccountMembersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818]">Members</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{account.membersCount} total</p>
        </div>
        <Link to={`/users?accountId=${account.id}`} className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="p-5 space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-2.5 w-44 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
              <div className="h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-2 text-center">
          <Users size={24} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No members found</p>
        </div>
      ) : (
        <div className="min-w-0">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
                <th className="w-[48%] px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Member</th>
                <th className="hidden w-[18%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 sm:table-cell">Role</th>
                <th className="w-[24%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-[16%]">Status</th>
                <th className="hidden w-[18%] px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 md:table-cell">Last active</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <Link to={`/users/${member.id}`} className="flex items-center gap-2.5 group">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[0.625rem] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {getInitials(member.name)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{member.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", USER_ROLE_COLORS[member.role])}>
                      {ROLE_LABELS[member.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", USER_STATUS_STYLES[member.status])}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-400 dark:text-gray-500 hidden md:table-cell">
                    {fmtRelative(member.lastActive)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
