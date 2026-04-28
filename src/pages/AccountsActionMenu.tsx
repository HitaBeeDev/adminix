import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Ban, Eye, MoreHorizontal, RefreshCw } from "lucide-react";
import type { Account } from "@/types/account";

interface AccountsActionMenuProps {
  account: Account;
  onToggleSuspend: () => void;
}

export function AccountsActionMenu({ account, onToggleSuspend }: AccountsActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    function handler(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function act(action: () => void) {
    action();
    setOpen(false);
  }

  const isSuspended = account.status === "suspended";

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
              onClick={() => act(() => navigate(`/accounts/${account.id}`))}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.85rem] font-[400] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye size={14} className="text-gray-400" /> View
            </button>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 py-1">
            <button
              onClick={() => act(onToggleSuspend)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[0.85rem] font-[400] text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              {isSuspended ? <RefreshCw size={14} /> : <Ban size={14} />}
              {isSuspended ? "Reactivate" : "Suspend"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
