import type { RefObject } from "react";
import { Link } from "react-router";

interface TopbarUserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onToggle: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  userName: string;
  userRole: string;
}

export function TopbarUserMenu({
  isOpen,
  onClose,
  onLogout,
  onToggle,
  panelRef,
  userName,
  userRole,
}: TopbarUserMenuProps) {
  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={onToggle}
        aria-label="User menu"
        aria-expanded={isOpen}
        className="flex items-center gap-3 pl-[0.4rem] pr-[1.5rem] h-[3.1rem] rounded-full bg-[#ffffff] hover:bg-[#f1f5f9] transition-colors focus-visible:outline-none shadow-[0_16px_34px_-28px_rgba(15,23,42,0.12)] dark:bg-[#0f172a] dark:hover:bg-[#1e293b] dark:shadow-none"
      >
        <img
          src="/p1.jpg"
          alt={userName}
          className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-[#6366f1]/20"
        />
        <div className="hidden sm:block text-left leading-tight">
          <p className="text-[0.85rem] font-[400] text-[#0f172a] dark:text-white">
            {userName}
          </p>

          <p className="text-[0.65rem] mt-[0.15rem] font-[300] capitalize text-[#64748b]">
            {userRole}
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-60 bg-[#ffffff] rounded-3xl border border-[#e2e8f0] z-50 overflow-hidden p-2 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.18)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-2xl">
          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-[#e2e8f0] mb-1 dark:border-[#1e293b]">
            <img
              src="/p1.jpg"
              alt={userName}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-[#6366f1]/20"
            />
            <div className="min-w-0">
              <p className="text-[0.85rem] font-[500] text-[#0f172a] truncate dark:text-white">
                {userName}
              </p>
              <p className="text-[0.85rem] font-[400] truncate capitalize text-[#64748b]">
                {userRole}
              </p>
            </div>
          </div>
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl text-[0.85rem] font-[400] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl text-[0.85rem] font-[400] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
          >
            Settings
          </Link>
          <div className="my-1 h-px bg-[#e2e8f0] dark:bg-[#1e293b]" />
          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-[0.85rem] font-[400] text-[#f43f5e] hover:bg-[#fff1f2] transition-colors dark:text-[#fb7185] dark:hover:bg-[#7f1d1d]/25"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
