import { Search } from "lucide-react";
import type { UserRole, UserStatus } from "@/types/user";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "./users.constants";

interface UsersToolbarProps {
  onFilter: (key: "role" | "status", value: string) => void;
  onInvite: () => void;
  onSearch: (value: string) => void;
  role: UserRole | "";
  searchInput: string;
  status: UserStatus | "";
}

export function UsersToolbar({ onFilter, onInvite, onSearch, role, searchInput, status }: UsersToolbarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-48 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      <select
        value={role}
        onChange={(event) => onFilter("role", event.target.value)}
        className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) => onFilter("status", event.target.value)}
        className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={onInvite}
        className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] transition-colors"
      >
        + Invite user
      </button>
    </div>
  );
}
