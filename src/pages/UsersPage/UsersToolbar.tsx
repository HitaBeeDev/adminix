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
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-sm lg:flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
        <select
          value={role}
          onChange={(event) => onFilter("role", event.target.value)}
          className="w-full py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer lg:w-auto"
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
          className="w-full py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer lg:w-auto"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onInvite}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 lg:ml-auto lg:w-auto dark:focus-visible:ring-offset-gray-950"
      >
        + Invite user
      </button>
    </div>
  );
}
