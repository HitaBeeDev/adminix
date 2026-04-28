import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MoreHorizontal } from "lucide-react";

interface RoleDistributionHeaderProps {
  isLoading: boolean;
  total: number;
}

export function RoleDistributionHeader({ isLoading, total }: RoleDistributionHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-start justify-between mb-1">
      <div>
        <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[#0f172a] dark:text-white leading-snug">
          Role Distribution
        </h3>
        <p className="text-[0.75rem] text-[#94a3b8] mt-0.5">
          {isLoading ? "-" : `${total.toLocaleString()} users across all roles`}
        </p>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Role distribution options"
          aria-expanded={menuOpen}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] hover:text-[#64748b] dark:hover:text-white transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-[#e2e8f0] bg-white p-1 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] dark:border-[#1e293b] dark:bg-[#111827]">
            <Link
              to="/roles"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-[0.75rem] font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
            >
              View roles
            </Link>
            <Link
              to="/users"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-[0.75rem] font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
            >
              View users
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
