import { Ban, Trash2, X } from "lucide-react";

interface UsersBulkActionsProps {
  deletePending: boolean;
  onClear: () => void;
  onDelete: () => void;
  onSuspend: () => void;
  selectedCount: number;
  updatePending: boolean;
}

export function UsersBulkActions({
  deletePending,
  onClear,
  onDelete,
  onSuspend,
  selectedCount,
  updatePending,
}: UsersBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 flex-1">
        {selectedCount} user{selectedCount > 1 ? "s" : ""} selected
      </span>
      <button
        onClick={onSuspend}
        disabled={updatePending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 transition-colors"
      >
        <Ban size={13} /> Suspend
      </button>
      <button
        onClick={onDelete}
        disabled={deletePending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-50 transition-colors"
      >
        <Trash2 size={13} /> Delete
      </button>
      <button
        onClick={onClear}
        className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors"
        title="Clear selection"
      >
        <X size={14} />
      </button>
    </div>
  );
}
