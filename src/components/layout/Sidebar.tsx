import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import {
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
  ChevronDown,
} from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
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
          "relative flex items-center h-11 rounded-2xl transition-colors duration-150 select-none",
          collapsed ? "justify-center w-11 mx-auto" : "gap-3 px-4",
          isActive
            ? "bg-highlight/15 text-headline font-semibold"
            : "text-paragraph hover:bg-highlight/10 hover:text-headline"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-highlight rounded-full" />
          )}
          <Icon size={19} className={cn("shrink-0", isActive && "text-highlight")} />
          {!collapsed && <span className="text-[15px]">{label}</span>}
        </>
      )}
    </NavLink>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  onLogout: () => void;
  userName: string;
  userRole: string;
  initials: string;
  onCollapseToggle?: () => void;
  onNavigate?: () => void;
}

function SidebarContent({ collapsed, onLogout, userName, userRole, initials, onCollapseToggle, onNavigate }: SidebarContentProps) {
  return (
    <>
      {/* Brand */}
      <div className={cn("flex items-center h-20 shrink-0 px-5", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-2xl bg-highlight flex items-center justify-center shadow-[0_12px_24px_-16px_var(--highlight)]">
            <LayoutGrid size={17} className="text-headline" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-highlight flex items-center justify-center shrink-0 shadow-[0_12px_24px_-16px_var(--highlight)]">
                <LayoutGrid size={18} className="text-headline" />
              </div>
              <span className="text-xl font-bold tracking-tight text-headline truncate">Adminix</span>
            </div>
            {onCollapseToggle && (
              <button
                onClick={onCollapseToggle}
                aria-label="Collapse sidebar"
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-paragraph/60 hover:bg-highlight/10 hover:text-headline transition-colors shrink-0"
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
          className="w-9 h-9 mx-auto mb-2 rounded-2xl flex items-center justify-center text-paragraph/60 hover:bg-highlight/10 hover:text-headline transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Workspace switcher */}
      {!collapsed && (
        <button className="mx-4 mb-4 flex items-center gap-3 h-11 px-3 rounded-2xl bg-bg/70 hover:bg-highlight/10 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-tertiary flex items-center justify-center text-[12px] font-bold text-headline shrink-0">
            A
          </div>
          <span className="flex-1 text-left text-sm font-medium text-headline truncate">Acme Internal</span>
          <ChevronDown size={14} className="text-paragraph/60 shrink-0" />
        </button>
      )}

      {/* Primary nav */}
      <div className={cn("mt-1", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <p className="px-2 pb-2 text-[13px] font-medium text-paragraph/70 select-none">
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
          <p className="px-2 pb-2 text-[13px] font-medium text-paragraph/70 select-none">
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
              "w-full flex items-center h-11 rounded-2xl transition-colors duration-150 text-paragraph hover:bg-highlight/10 hover:text-headline",
              collapsed ? "justify-center w-11 mx-auto" : "gap-3 px-4"
            )}
          >
            <LogOut size={19} className="shrink-0" />
            {!collapsed && <span className="text-[15px]">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Bottom block */}
      <div className="mt-auto">
        {!collapsed && (
          <div
            className="mx-4 mb-4 rounded-3xl p-5 overflow-hidden relative"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--highlight) 34%, white), color-mix(in srgb, var(--highlight) 10%, white))",
            }}
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/35" />
            <p className="relative text-sm font-bold text-headline">Need Help?</p>
            <p className="relative text-[12px] mt-1" style={{ color: "color-mix(in srgb, var(--paragraph) 78%, transparent)" }}>
              Contact support team
            </p>
            <button className="relative mt-4 w-full h-10 rounded-2xl bg-button text-button-text text-xs font-bold hover:brightness-105 transition-colors shadow-[0_14px_26px_-18px_var(--stroke)]">
              Get Support
            </button>
          </div>
        )}

        {/* User chip */}
        <div className={cn("border-t border-stroke/8 p-4 flex items-center gap-3", collapsed && "justify-center")}>
          <div
            title={collapsed ? `${userName} — ${userRole}` : undefined}
            className="w-10 h-10 rounded-full bg-highlight/15 text-highlight flex items-center justify-center text-[12px] font-bold shrink-0"
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-headline truncate">{userName}</p>
              <p className="text-[11px] truncate capitalize" style={{ color: "color-mix(in srgb, var(--paragraph) 60%, transparent)" }}>
                {userRole}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileOpen);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const navigate = useNavigate();

  const userName = user?.name ?? "Admin User";
  const userRole = user?.role.replace(/_/g, " ") ?? "admin";
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

  const contentProps = { userName, userRole, initials, onLogout: handleLogout };

  return (
    <>
      {/* Desktop floating sidebar */}
      <aside
        className="hidden md:flex flex-col bg-main border border-stroke/8 rounded-[2rem] m-5 shrink-0 overflow-hidden shadow-[0_24px_70px_-52px_var(--stroke)]"
        style={{
          width: collapsed ? 84 : 270,
          height: "calc(100vh - 40px)",
          transition: "width 220ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
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
        <aside className="flex flex-col bg-main border-r border-stroke/8 w-72 h-full">
          <div className="flex items-center justify-between h-[72px] px-5 border-b border-stroke/8 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-highlight flex items-center justify-center">
                <LayoutGrid size={16} className="text-headline" />
              </div>
              <span className="text-xl font-bold tracking-tight text-headline">Adminix</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-paragraph/60 hover:bg-highlight/10 hover:text-headline transition-colors"
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
