import {
  Activity,
  Blocks,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutGrid,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarNavItem from "./SidebarNavItem";

const PRIMARY_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/users", label: "Users", icon: Users },
  { to: "/accounts", label: "Accounts", icon: Building2 },
  { to: "/roles", label: "Roles", icon: Shield },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/reports", label: "Reports", icon: FileText },
];

const OTHER_NAV = [{ to: "/settings", label: "Settings", icon: Settings }];

interface SidebarContentProps {
  collapsed: boolean;
  onLogout: () => void;
  onCollapseToggle?: () => void;
  onNavigate?: () => void;
}

export default function SidebarContent({
  collapsed,
  onLogout,
  onCollapseToggle,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          "flex items-center h-20 shrink-0 px-5",
          collapsed && "justify-center px-2",
        )}
      >
        {collapsed ? (
          <div className="w-8 h-8 p-[0.45rem] rounded-[0.45rem] bg-[#6366f1] flex items-center justify-center shadow-[0_12px_24px_-16px_rgba(99,102,241,0.5)]">
            <Blocks className="text-white" strokeWidth={1.45} />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-8 h-8 p-[0.45rem] rounded-[0.45rem] bg-[#6366f1] flex items-center justify-center shrink-0 
              shadow-[0_12px_24px_-16px_rgba(99,102,241,0.5)]"
              >
                <Blocks className="text-white" strokeWidth={1.45} />
              </div>

              <span className="text-xl font-bold tracking-wider text-[#0f172a] truncate">
                Adminix
              </span>
            </div>
            {onCollapseToggle && (
              <button
                onClick={onCollapseToggle}
                aria-label="Collapse sidebar"
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors shrink-0"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {collapsed && onCollapseToggle && (
        <button
          onClick={onCollapseToggle}
          aria-label="Expand sidebar"
          className="w-9 h-9 mx-auto mb-2 rounded-2xl flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      )}

      <div className={cn("mt-1", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <p className="px-2 pb-2 text-[0.75rem] font-[300] text-[#94a3b8] select-none">
            Main
          </p>
        )}
        <nav className="space-y-1.5" aria-label="Primary navigation">
          {PRIMARY_NAV.map((link) => (
            <SidebarNavItem
              key={link.to}
              {...link}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto" />

      <div className={cn("mt-7 pb-6", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <p className="px-2 pb-2 text-[0.75rem] font-[300] text-[#94a3b8] select-none">
            Other
          </p>
        )}
        <nav aria-label="Secondary navigation">
          {OTHER_NAV.map((link) => (
            <SidebarNavItem
              key={link.to}
              {...link}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
          <button
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "group w-full flex items-center h-10 rounded-[0.45rem] transition-colors duration-150 text-[#64748b] hover:bg-[#fff1f2] hover:text-[#f43f5e] font-[300] text-[0.7rem]",
              collapsed
                ? "justify-center w-8 h-8 p-[0.3rem] mx-auto"
                : "gap-[0.6rem] px-4",
            )}
          >
            <LogOut
              strokeWidth={1.35}
              size={18}
              className="shrink-0 text-[#94a3b8] group-hover:text-[#f43f5e]"
            />
            {!collapsed && <span className="text-[0.85rem]">Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}
