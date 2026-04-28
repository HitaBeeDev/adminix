import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  Blocks,
  LayoutGrid,
  Users,
  Building2,
  Shield,
  Activity,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/users",     label: "Users",     icon: Users },
  { to: "/accounts",  label: "Accounts",  icon: Building2 },
  { to: "/roles",     label: "Roles",     icon: Shield },
  { to: "/activity",  label: "Activity",  icon: Activity },
  { to: "/reports",   label: "Reports",   icon: FileText },
];

const OTHER_NAV = [
  { to: "/settings",  label: "Settings",  icon: Settings },
];

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  onNavigate?: () => void;
}

function NavItem({ to, label, icon: Icon, collapsed, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center h-11 rounded-2xl transition-colors duration-150 select-none",
          collapsed ? "justify-center w-11 mx-auto" : "gap-3 px-4",
          isActive
            ? "bg-[#eef2ff] text-[#0f172a] font-semibold"
            : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#6366f1] rounded-full" />
          )}
          <Icon size={19} className={cn("shrink-0", isActive ? "text-[#6366f1]" : "text-[#94a3b8] group-hover:text-[#6366f1]")} />
          {!collapsed && <span className="text-[15px]">{label}</span>}
        </>
      )}
    </NavLink>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  onLogout: () => void;
  onCollapseToggle?: () => void;
  onNavigate?: () => void;
}

function SidebarContent({ collapsed, onLogout, onCollapseToggle, onNavigate }: SidebarContentProps) {
  return (
    <>
      {/* Brand */}
      <div className={cn("flex items-center h-20 shrink-0 px-5", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-2xl bg-[#6366f1] flex items-center justify-center shadow-[0_12px_24px_-16px_rgba(99,102,241,0.5)]">
            <Blocks size={17} className="text-white" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#6366f1] flex items-center justify-center shrink-0 shadow-[0_12px_24px_-16px_rgba(99,102,241,0.5)]">
                <Blocks size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0f172a] truncate">Adminix</span>
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

      {/* Expand button when collapsed */}
      {collapsed && onCollapseToggle && (
        <button
          onClick={onCollapseToggle}
          aria-label="Expand sidebar"
          className="w-9 h-9 mx-auto mb-2 rounded-2xl flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Primary nav */}
      <div className={cn("mt-1", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <p className="px-2 pb-2 text-[13px] font-medium text-[#94a3b8] select-none uppercase tracking-widest">
            Main
          </p>
        )}
        <nav className="space-y-1.5" aria-label="Primary navigation">
          {PRIMARY_NAV.map((link) => (
            <NavItem key={link.to} {...link} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      {/* Other nav */}
      <div className={cn("mt-7", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <p className="px-2 pb-2 text-[13px] font-medium text-[#94a3b8] select-none uppercase tracking-widest">
            Other
          </p>
        )}
        <nav className="space-y-1.5" aria-label="Secondary navigation">
          {OTHER_NAV.map((link) => (
            <NavItem key={link.to} {...link} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
          <button
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "group w-full flex items-center h-11 rounded-2xl transition-colors duration-150 text-[#64748b] hover:bg-[#fff1f2] hover:text-[#f43f5e]",
              collapsed ? "justify-center w-11 mx-auto" : "gap-3 px-4"
            )}
          >
            <LogOut size={19} className="shrink-0 text-[#94a3b8] group-hover:text-[#f43f5e]" />
            {!collapsed && <span className="text-[15px]">Logout</span>}
          </button>
        </nav>
      </div>

      <div className="mt-auto" />
    </>
  );
}

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileOpen);
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setCollapsed(!mql.matches);
    const handler = (e: MediaQueryListEvent) => setCollapsed(!e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [setCollapsed]);

  async function handleLogout() {
    await logout.mutateAsync();
    setMobileOpen(false);
    navigate("/login", { replace: true });
  }

  const contentProps = { onLogout: handleLogout };

  return (
    <>
      {/* Desktop floating sidebar */}
      <aside
        className={cn(
          "m-5 hidden h-[calc(100vh_-_40px)] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-[#e2e8f0] bg-[#ffffff] shadow-[0_24px_70px_-52px_rgba(15,23,42,0.12)] transition-[width] duration-200 ease-out md:flex",
          collapsed ? "w-[84px]" : "w-[270px]",
        )}
      >
        <SidebarContent
          {...contentProps}
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Mobile overlay drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen z-30 md:hidden transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <aside className="flex flex-col bg-[#ffffff] border-r border-[#e2e8f0] w-72 h-full">
          <div className="flex items-center justify-between h-[72px] px-5 border-b border-[#e2e8f0] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#6366f1] flex items-center justify-center">
                <Blocks size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0f172a]">Adminix</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <SidebarContent {...contentProps} collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </aside>
      </div>
    </>
  );
}
