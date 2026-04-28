import { Link } from "react-router";
import { Menu } from "lucide-react";
import type { BreadcrumbItem } from "./topbar.types";

interface TopbarBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  onOpenMobileNav: () => void;
}

export function TopbarBreadcrumbs({ breadcrumbs, onOpenMobileNav }: TopbarBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-[#ffffff] text-[#64748b] shadow-[0_16px_34px_-28px_rgba(15,23,42,0.12)] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors dark:bg-[#0f172a] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white dark:shadow-none"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      <nav
        aria-label="Breadcrumb"
        className="hidden md:flex items-center gap-1 text-sm rounded-[1.5rem] bg-[#ffffff] px-[1.3rem] py-[0.55rem] border border-[#e2e8f0] mt-[0.4rem] dark:border-[#1e293b] dark:bg-[#0f172a]"
      >
        <Link
          to="/dashboard"
          className="text-[0.85rem] font-[300] text-[#64748b] transition-colors hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:text-white"
        >
          Workspace
        </Link>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <span key={breadcrumb.path} className="flex items-center gap-1">
              <span aria-hidden="true" className="text-xs text-[#94a3b8]">
                /
              </span>
              {isLast ? (
                <span className="text-[0.85rem] font-[400] text-[#0f172a] dark:text-white">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-[0.85rem] font-[300] text-[#64748b] transition-colors hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:text-white"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
