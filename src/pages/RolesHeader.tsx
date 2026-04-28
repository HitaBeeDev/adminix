import { Plus } from "lucide-react";

interface RolesHeaderProps {
  isLoading: boolean;
  onAddRole: () => void;
  rolesCount: number;
}

export function RolesHeader({ isLoading, onAddRole, rolesCount }: RolesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#181818]">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? (
            <span className="block h-4 w-32 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ) : `${rolesCount} roles configured`}
        </p>
      </div>
      <button
        onClick={onAddRole}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] transition-colors"
      >
        <Plus size={15} /> Add role
      </button>
    </div>
  );
}
