import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Ban, Eye, MoreHorizontal, Pencil, RefreshCw, Trash2 } from "lucide-react";
import type { User } from "@/types/user";

interface UserRowActionMenuProps {
  onDelete: (id: string) => void;
  onUpdate: (payload: { id: string; payload: { status: User["status"] } }) => void;
  user: User;
}

export function UserRowActionMenu({ onDelete, onUpdate, user }: UserRowActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isSuspended = user.status === "suspended";

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function action(run: () => void) {
    run();
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen((current) => !current)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="py-1">
            <button
              onClick={() => action(() => navigate(`/users/${user.id}`))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.85rem] font-[400] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye size={14} className="text-gray-400" /> View
            </button>
            <button
              onClick={() => action(() => navigate(`/users/${user.id}`))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.85rem] font-[400] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Pencil size={14} className="text-gray-400" /> Edit
            </button>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 py-1">
            <button
              onClick={() =>
                action(() =>
                  onUpdate({
                    id: user.id,
                    payload: { status: isSuspended ? "active" : "suspended" },
                  }),
                )
              }
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.85rem] font-[400] text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              {isSuspended ? <RefreshCw size={14} /> : <Ban size={14} />}
              {isSuspended ? "Reactivate" : "Suspend"}
            </button>
            <button
              onClick={() => action(() => onDelete(user.id))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.85rem] font-[400] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
