import { Search } from "lucide-react";
import { PLAN_OPTIONS, STATUS_OPTIONS } from "./accounts.constants";
import type { AccountPlan, AccountStatus } from "@/types/account";

interface AccountsToolbarProps {
  onFilterChange: (key: "plan" | "status", value: string) => void;
  onCreateAccount: () => void;
  onSearchChange: (value: string | null) => void;
  plan: AccountPlan | "";
  searchInput: string;
  status: AccountStatus | "";
}

export function AccountsToolbar({
  onFilterChange,
  onCreateAccount,
  onSearchChange,
  plan,
  searchInput,
  status,
}: AccountsToolbarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-48 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value || null)}
          placeholder="Search by name, owner, or domain..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      <select
        value={plan}
        onChange={(event) => onFilterChange("plan", event.target.value)}
        className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
      >
        {PLAN_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) => onFilterChange("status", event.target.value)}
        className="py-2 pl-3 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={onCreateAccount}
        className="ml-auto flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
      >
        + New account
      </button>
    </div>
  );
}
