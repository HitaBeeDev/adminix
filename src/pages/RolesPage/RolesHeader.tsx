import { Plus } from "lucide-react";

interface RolesHeaderProps {
  isLoading: boolean;
  onAddRole: () => void;
  rolesCount: number;
}

export function RolesHeader({ isLoading, onAddRole, rolesCount }: RolesHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? (
            <span className="block h-4 w-32 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ) : `${rolesCount} roles configured`}
        </p>
      </div>
      <button
        onClick={onAddRole}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:w-auto dark:focus-visible:ring-offset-gray-950"
      >
        <Plus size={15} /> Add role
      </button>
    </div>
  );
}
